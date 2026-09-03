import { Job, Worker } from 'bullmq';
import { eq } from 'drizzle-orm';
import { getDb } from '../database/index';
import { evalResultsTable } from '../database/tables';
import { getEnvBool, getEnvInt } from '../envars';
import logger from '../logger';
import { invalidateEvaluationCache, notifyEvaluationChanged } from '../models/evalMutation';
import { evaluateWithSource } from '../node';
import { getActiveTraceparent } from '../tracing/spanRoles';
import { addJob, createWorker, getQueueStats, pauseQueue, QUEUE_NAMES, resumeQueue } from './index';

import type { RunEvalOptions, UnifiedConfig } from '../types/index';
import type {
  EvaluationJobData,
  EvaluationJobResult,
  GradingJobData,
  GradingJobResult,
  MaintenanceJobData,
  RedteamJobData,
  RedteamJobResult,
} from './index';

async function processEvaluationJob(job: Job<EvaluationJobData>): Promise<EvaluationJobResult> {
  const { runId, config, options, traceContext } = job.data;
  const startTime = Date.now();

  logger.info(`Starting evaluation run ${runId}`);

  try {
    if (traceContext) {
      // Note: generateTraceContextIfNeeded requires test case context which isn't available in queue jobs
      // Tracing is handled within the evaluation itself
    }

    const activeTraceparent = getActiveTraceparent();
    if (activeTraceparent) {
      await job.updateProgress({ traceparent: activeTraceparent });
    }

    const result = await evaluateWithSource(
      config as Parameters<typeof evaluateWithSource>[0],
      options as Parameters<typeof evaluateWithSource>[1],
    );

    await job.updateProgress(50);

    // Results are persisted by evaluateWithSource when config.writeLatestResults is true
    // No need to call writeResultsToDatabase separately

    await job.updateProgress(80);

    await invalidateEvaluationCache(runId);
    notifyEvaluationChanged(runId);

    const totalTests = result.results?.length ?? 0;
    const passed = result.results?.filter((r) => r.success).length ?? 0;
    const failed = totalTests - passed;
    const errors = result.results?.filter((r) => r.error).length ?? 0;

    logger.info(`Evaluation run ${runId} completed in ${Date.now() - startTime}ms`);

    return {
      success: true,
      runId,
      results: result,
      stats: { totalTests, passed, failed, errors },
    };
  } catch (error) {
    logger.error(`Evaluation run ${runId} failed: ${error}`);
    throw error;
  }
}

export function createEvaluationWorker(): Worker<EvaluationJobData> {
  return createWorker<EvaluationJobData>(QUEUE_NAMES.EVALUATION, processEvaluationJob, {
    concurrency: getEnvInt('EVAL_WORKER_CONCURRENCY', 2),
  });
}

export async function queueEvaluation(
  runId: string,
  config: UnifiedConfig,
  options: RunEvalOptions,
): Promise<Job<EvaluationJobData>> {
  return addJob<EvaluationJobData>(
    QUEUE_NAMES.EVALUATION,
    'evaluate',
    { runId, config, options, traceContext: {}, type: 'evaluation' },
    {
      priority: 10,
      attempts: getEnvInt('EVAL_JOB_ATTEMPTS', 2),
    },
  );
}

async function processRedteamJob(job: Job<RedteamJobData>): Promise<RedteamJobResult> {
  const { runId, config, options } = job.data;
  const startTime = Date.now();

  logger.info(`Starting redteam run ${runId}`);

  try {
    const result = await evaluateWithSource(
      config as Parameters<typeof evaluateWithSource>[0],
      options as Parameters<typeof evaluateWithSource>[1],
    );

    // Results are persisted by evaluateWithSource when config.writeLatestResults is true
    await invalidateEvaluationCache(runId);
    notifyEvaluationChanged(runId);

    logger.info(`Redteam run ${runId} completed in ${Date.now() - startTime}ms`);

    return { success: true, runId, results: result };
  } catch (error) {
    logger.error(`Redteam run ${runId} failed: ${error}`);
    throw error;
  }
}

export function createRedteamWorker(): Worker<RedteamJobData> {
  return createWorker<RedteamJobData>(QUEUE_NAMES.REDTEAM, processRedteamJob, {
    concurrency: getEnvInt('REDTEAM_WORKER_CONCURRENCY', 1),
  });
}

export async function queueRedteam(
  runId: string,
  config: UnifiedConfig,
  options: RunEvalOptions,
): Promise<Job<RedteamJobData>> {
  return addJob<RedteamJobData>(
    QUEUE_NAMES.REDTEAM,
    'redteam',
    { runId, config, options, type: 'redteam' },
    {
      priority: 5,
      attempts: getEnvInt('REDTEAM_JOB_ATTEMPTS', 1),
    },
  );
}

async function processGradingJob(job: Job<GradingJobData>): Promise<GradingJobResult> {
  const { runId, evalId, testIndices, providerConfig: _providerConfig } = job.data;

  logger.info(`Starting grading job for run ${runId}, eval ${evalId}`);

  try {
    const db = await getDb();
    const results = await db
      .select()
      .from(evalResultsTable)
      .where(eq(evalResultsTable.evalId, evalId));

    let gradedCount = 0;
    for (const testIndex of testIndices) {
      const result = results.find((r) => r.testIdx === testIndex);
      if (result && result.response) {
        const { runAssertions } = await import('../assertions/index');

        const gradedResult = await runAssertions({
          providerResponse: result.response,
          test: result.testCase,
          prompt: typeof result.prompt === 'string' ? result.prompt : JSON.stringify(result.prompt),
        });

        await db
          .update(evalResultsTable)
          .set({
            success: gradedResult.pass,
            score: gradedResult.score,
            gradingResult: gradedResult,
          })
          .where(eq(evalResultsTable.id, result.id));

        gradedCount++;
      }
    }

    await invalidateEvaluationCache(runId);
    notifyEvaluationChanged(runId);

    return { success: true, gradedCount };
  } catch (error) {
    logger.error(`Grading job failed: ${error}`);
    throw error;
  }
}

export function createGradingWorker(): Worker<GradingJobData> {
  return createWorker<GradingJobData>(QUEUE_NAMES.GRADING, processGradingJob, {
    concurrency: getEnvInt('GRADING_WORKER_CONCURRENCY', 4),
  });
}

export async function queueGrading(
  runId: string,
  evalId: string,
  testIndices: number[],
  providerConfig: Record<string, unknown>,
): Promise<Job<GradingJobData>> {
  return addJob<GradingJobData>(
    QUEUE_NAMES.GRADING,
    'grade',
    { runId, evalId, testIndices, providerConfig, type: 'grading' },
    {
      priority: 15,
      attempts: 3,
    },
  );
}

async function processMaintenanceJob(job: Job<MaintenanceJobData>): Promise<{ success: boolean }> {
  const { maintenanceType, maxAgeDays, evalIds, startDate, endDate } = job.data;

  logger.info(`Running maintenance job: ${maintenanceType}`);

  switch (maintenanceType) {
    case 'cleanup': {
      const { cleanupOldEvaluations } = await import('../util/maintenance');
      await cleanupOldEvaluations(maxAgeDays ?? 30);
      break;
    }
    case 'cache-warm': {
      const { warmCache } = await import('../util/cache');
      await warmCache(evalIds ?? []);
      break;
    }
    case 'metrics-aggregate': {
      const { aggregateMetrics } = await import('../util/metrics');
      await aggregateMetrics(startDate, endDate);
      break;
    }
  }

  return { success: true };
}

export function createMaintenanceWorker(): Worker<MaintenanceJobData> {
  return createWorker<MaintenanceJobData>(QUEUE_NAMES.MAINTENANCE, processMaintenanceJob, {
    concurrency: 1,
  });
}

export async function queueMaintenance(
  maintenanceType: MaintenanceJobData['maintenanceType'],
  payload: Partial<MaintenanceJobData>,
): Promise<Job<MaintenanceJobData>> {
  return addJob<MaintenanceJobData>(
    QUEUE_NAMES.MAINTENANCE,
    'maintenance',
    { runId: `maint-${Date.now()}`, maintenanceType, ...payload, type: 'maintenance' },
    {
      priority: 1,
      delay: payload.delay,
    },
  );
}

export async function getWorkerStats(): Promise<
  Record<
    string,
    {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
    }
  >
> {
  const stats: Record<
    string,
    {
      waiting: number;
      active: number;
      completed: number;
      failed: number;
      delayed: number;
    }
  > = {};

  for (const queueName of Object.values(QUEUE_NAMES)) {
    stats[queueName] = await getQueueStats(queueName as never);
  }

  return stats;
}

export async function pauseAllWorkers(): Promise<void> {
  for (const queueName of Object.values(QUEUE_NAMES)) {
    await pauseQueue(queueName as never);
  }
}

export async function resumeAllWorkers(): Promise<void> {
  for (const queueName of Object.values(QUEUE_NAMES)) {
    await resumeQueue(queueName as never);
  }
}

export function isQueueEnabled(): boolean {
  return getEnvBool('QUEUE_ENABLED', true);
}

export function getWorkerConfig() {
  return {
    evaluation: {
      concurrency: getEnvInt('EVAL_WORKER_CONCURRENCY', 2),
      attempts: getEnvInt('EVAL_JOB_ATTEMPTS', 2),
    },
    redteam: {
      concurrency: getEnvInt('REDTEAM_WORKER_CONCURRENCY', 1),
      attempts: getEnvInt('REDTEAM_JOB_ATTEMPTS', 1),
    },
    grading: {
      concurrency: getEnvInt('GRADING_WORKER_CONCURRENCY', 4),
      attempts: 3,
    },
    maintenance: {
      concurrency: 1,
    },
  };
}
