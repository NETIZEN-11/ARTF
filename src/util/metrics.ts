import { getDb } from '../database/index';
import { evalsTable, evalResultsTable } from '../database/tables';
import { eq, gte, lte, count, avg, sql } from 'drizzle-orm';
import logger from '../logger';

export interface MetricsSnapshot {
  date: string;
  totalRuns: number;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  errorTests: number;
  avgRunDurationMs: number;
  avgTestDurationMs: number;
  totalCost: number;
}

export async function aggregateMetrics(
  startDate?: Date,
  endDate?: Date,
): Promise<MetricsSnapshot[]> {
  const db = await getDb();

  const start = startDate ? Math.floor(startDate.getTime() / 1000) : 0;
  const end = endDate ? Math.floor(endDate.getTime() / 1000) : Math.floor(Date.now() / 1000);

  logger.info(`Aggregating metrics from ${new Date(start * 1000).toISOString()} to ${new Date(end * 1000).toISOString()}`);

  // Get runs in date range
  const runs = await db
    .select({
      id: evalsTable.id,
      createdAt: evalsTable.createdAt,
      results: evalsTable.results,
    })
    .from(evalsTable)
    .where(sql`${evalsTable.createdAt} >= ${start} AND ${evalsTable.createdAt} <= ${end}`);

  // Group by day
  const dailyMetrics = new Map<string, MetricsSnapshot>();

  for (const run of runs) {
    const date = new Date(run.createdAt * 1000).toISOString().split('T')[0];
    
    if (!dailyMetrics.has(date)) {
      dailyMetrics.set(date, {
        date,
        totalRuns: 0,
        totalTests: 0,
        passedTests: 0,
        failedTests: 0,
        errorTests: 0,
        avgRunDurationMs: 0,
        avgTestDurationMs: 0,
        totalCost: 0,
      });
    }

    const metrics = dailyMetrics.get(date)!;
    metrics.totalRuns++;

    const runResults = run.results as { results?: unknown[] } | null;
    if (runResults?.results) {
      for (const result of runResults.results) {
        const r = result as { success?: boolean; error?: string; latencyMs?: number; cost?: number };
        metrics.totalTests++;
        
        if (r.success) {
          metrics.passedTests++;
        } else if (r.error) {
          metrics.errorTests++;
        } else {
          metrics.failedTests++;
        }

        if (r.latencyMs) {
          metrics.avgTestDurationMs = 
            (metrics.avgTestDurationMs * (metrics.totalTests - 1) + r.latencyMs) / metrics.totalTests;
        }

        if (r.cost) {
          metrics.totalCost += r.cost;
        }
      }
    }
  }

  return Array.from(dailyMetrics.values()).sort((a, b) => a.date.localeCompare(b.date));
}

export async function getSystemMetrics(): Promise<{
  totalEvaluations: number;
  totalTestCases: number;
  passRate: number;
  avgLatencyMs: number;
  totalCost: number;
  queueStats: Record<string, {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
  }>;
}> {
  const db = await getDb();

  const [evalCount, resultStats] = await Promise.all([
    db.select({ count: count() }).from(evalsTable),
    db.select({
      total: count(),
      passed: count(sql`CASE WHEN ${evalResultsTable.success} = 1 THEN 1 END`),
      failed: count(sql`CASE WHEN ${evalResultsTable.success} = 0 AND ${evalResultsTable.error} IS NULL THEN 1 END`),
      errors: count(sql`CASE WHEN ${evalResultsTable.error} IS NOT NULL THEN 1 END`),
      avgLatency: avg(evalResultsTable.latencyMs),
      totalCost: sql<number>`SUM(${evalResultsTable.cost})`,
    }).from(evalResultsTable),
  ]);

  const { getWorkerStats } = await import('../queue/jobs');
  const queueStats = await getWorkerStats();

  return {
    totalEvaluations: evalCount[0]?.count ?? 0,
    totalTestCases: resultStats[0]?.total ?? 0,
    passRate: resultStats[0]?.total 
      ? (resultStats[0].passed ?? 0) / resultStats[0].total 
      : 0,
    avgLatencyMs: Number(resultStats[0]?.avgLatency ?? 0),
    totalCost: Number(resultStats[0]?.totalCost ?? 0),
    queueStats,
  };
}