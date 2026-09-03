import { Job, Queue, QueueEvents, Worker } from 'bullmq';
import Redis from 'ioredis';
import { getEnvInt, getEnvString } from '../envars';
import logger from '../logger';

import type Eval from '../models/eval';

export interface QueueConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
  enableReadyCheck: boolean;
  maxRetriesPerRequest: number;
  retryStrategy?: (times: number) => number | null;
}

let redisClient: Redis | null = null;
const queueInstances: Map<string, Queue> = new Map();

export function getQueueConfig(): QueueConfig {
  return {
    host: getEnvString('REDIS_HOST', 'localhost'),
    port: getEnvInt('REDIS_PORT', 6379),
    password: getEnvString('REDIS_PASSWORD') || undefined,
    db: getEnvInt('REDIS_DB', 0),
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
    retryStrategy: (times) => {
      if (times > 10) {
        return null;
      }
      return Math.min(times * 200, 2000);
    },
  };
}

function createRedisClient(): Redis {
  const config = getQueueConfig();
  const client = new Redis({
    host: config.host,
    port: config.port,
    password: config.password,
    db: config.db,
    enableReadyCheck: config.enableReadyCheck,
    maxRetriesPerRequest: config.maxRetriesPerRequest,
    retryStrategy: config.retryStrategy,
    lazyConnect: true,
  });

  client.on('error', (err) => {
    logger.error(`Redis connection error: ${err.message}`);
  });

  client.on('connect', () => {
    logger.info('Redis connected');
  });

  client.on('ready', () => {
    logger.info('Redis ready');
  });

  return client;
}

export function getRedisClient(): Redis {
  if (!redisClient) {
    redisClient = createRedisClient();
  }
  return redisClient;
}

export async function connectRedis(): Promise<Redis> {
  const client = getRedisClient();
  if (client.status === 'wait') {
    await client.connect();
  }
  return client;
}

export async function disconnectRedis(): Promise<void> {
  if (redisClient) {
    await redisClient.quit();
    redisClient = null;
  }
}

export interface BaseJobData {
  runId: string;
  evalId?: string;
  type: 'evaluation' | 'redteam' | 'grading' | 'baseline' | 'maintenance';
  priority?: number;
  attempts?: number;
}

export interface EvaluationJobData extends BaseJobData {
  type: 'evaluation';
  config: unknown;
  options: unknown;
  traceContext?: Record<string, string>;
}

export interface RedteamJobData extends BaseJobData {
  type: 'redteam';
  config: unknown;
  options: unknown;
}

export interface GradingJobData extends BaseJobData {
  type: 'grading';
  evalId: string;
  testIndices: number[];
  providerConfig: Record<string, unknown>;
}

export interface MaintenanceJobData extends BaseJobData {
  type: 'maintenance';
  maintenanceType: 'cleanup' | 'cache-warm' | 'metrics-aggregate';
  maxAgeDays?: number;
  evalIds?: string[];
  startDate?: Date;
  endDate?: Date;
  delay?: number;
}

export type JobData = EvaluationJobData | RedteamJobData | GradingJobData | MaintenanceJobData;

export interface JobResult {
  success: boolean;
  result?: unknown;
  error?: string;
}

export interface EvaluationJobResult extends JobResult {
  runId: string;
  results: Eval;
  stats: {
    totalTests: number;
    passed: number;
    failed: number;
    errors: number;
  };
}

export interface GradingJobResult extends JobResult {
  gradedCount: number;
}

export interface RedteamJobResult extends JobResult {
  runId: string;
  results: Eval;
}

export function getQueue(name: string): Queue {
  if (!queueInstances.has(name)) {
    const connection = getRedisClient();
    const queue = new Queue(name, {
      connection,
      defaultJobOptions: {
        removeOnComplete: 100,
        removeOnFail: 50,
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
      },
    });
    queueInstances.set(name, queue);
  }
  return queueInstances.get(name)!;
}

export async function closeQueue(name: string): Promise<void> {
  const queue = queueInstances.get(name);
  if (queue) {
    await queue.close();
    queueInstances.delete(name);
  }
}

export async function closeAllQueues(): Promise<void> {
  for (const [_name, queue] of queueInstances) {
    await queue.close();
  }
  queueInstances.clear();
}

export const QUEUE_NAMES = {
  EVALUATION: 'evaluation',
  REDTEAM: 'redteam',
  GRADING: 'grading',
  BASELINE: 'baseline',
  MAINTENANCE: 'maintenance',
} as const;

export type QueueName = (typeof QUEUE_NAMES)[keyof typeof QUEUE_NAMES];

export async function addJob<T extends JobData>(
  queueName: QueueName,
  jobName: string,
  data: T,
  options?: {
    priority?: number;
    delay?: number;
    jobId?: string;
    attempts?: number;
  },
): Promise<Job<T>> {
  const queue = getQueue(queueName);
  return queue.add(jobName, data, {
    priority: options?.priority ?? 0,
    delay: options?.delay,
    jobId: options?.jobId,
    attempts: options?.attempts ?? 3,
  });
}

export function createWorker<T extends JobData>(
  queueName: QueueName,
  processor: (job: Job<T>) => Promise<JobResult>,
  options?: {
    concurrency?: number;
    limiter?: { max: number; duration: number };
  },
): Worker<T> {
  const connection = getRedisClient();
  const worker = new Worker<T>(
    queueName,
    async (job) => {
      const startTime = Date.now();
      logger.info(`Processing job ${job.id} (${job.name})`);
      try {
        const result = await processor(job);
        logger.info(`Job ${job.id} completed in ${Date.now() - startTime}ms`);
        return result;
      } catch (error) {
        logger.error(`Job ${job.id} failed: ${error}`);
        throw error;
      }
    },
    {
      connection,
      concurrency: options?.concurrency ?? getEnvInt('WORKER_CONCURRENCY', 4),
      limiter: options?.limiter,
    },
  );

  worker.on('completed', (job) => {
    logger.debug(`Job ${job.id} completed successfully`);
  });

  worker.on('failed', (job, err) => {
    logger.error(`Job ${job?.id} failed: ${err.message}`);
  });

  worker.on('error', (err) => {
    logger.error(`Worker error: ${err.message}`);
  });

  return worker;
}

export function getQueueEvents(queueName: QueueName): QueueEvents {
  const connection = getRedisClient();
  return new QueueEvents(queueName, { connection });
}

export async function getQueueStats(queueName: QueueName): Promise<{
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
}> {
  const queue = getQueue(queueName);
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    queue.getWaitingCount(),
    queue.getActiveCount(),
    queue.getCompletedCount(),
    queue.getFailedCount(),
    queue.getDelayedCount(),
  ]);
  return { waiting, active, completed, failed, delayed };
}

export async function pauseQueue(queueName: QueueName): Promise<void> {
  const queue = getQueue(queueName);
  await queue.pause();
}

export async function resumeQueue(queueName: QueueName): Promise<void> {
  const queue = getQueue(queueName);
  await queue.resume();
}

export async function cleanQueue(
  queueName: QueueName,
  gracePeriod: number = 24 * 60 * 60 * 1000,
  limit: number = 100,
  type: 'completed' | 'failed' = 'completed',
): Promise<void> {
  const queue = getQueue(queueName);
  await queue.clean(gracePeriod, limit, type);
}
