import { getDb } from '../database/index';
import { evalsTable, evalResultsTable } from '../database/tables';
import { eq } from 'drizzle-orm';
import logger from '../logger';

export async function warmCache(evalIds: string[]): Promise<number> {
  if (evalIds.length === 0) {
    logger.info('No eval IDs provided for cache warming');
    return 0;
  }

  const db = await getDb();
  let warmedCount = 0;

  for (const evalId of evalIds) {
    try {
      const results = await db
        .select()
        .from(evalResultsTable)
        .where(eq(evalResultsTable.evalId, evalId));

      // Pre-load results into memory/cache
      for (const result of results) {
        // Access properties to trigger any lazy loading
        void result.response;
        void result.gradingResult;
      }

      warmedCount += results.length;
      logger.debug(`Warmed cache for eval ${evalId}: ${results.length} results`);
    } catch (error) {
      logger.warn(`Failed to warm cache for eval ${evalId}: ${error}`);
    }
  }

  logger.info(`Cache warming completed: ${warmedCount} results warmed across ${evalIds.length} evaluations`);
  return warmedCount;
}

export async function warmAllCaches(limit: number = 100): Promise<number> {
  const db = await getDb();
  const recentEvals = await db
    .select({ id: evalsTable.id })
    .from(evalsTable)
    .orderBy(evalsTable.createdAt)
    .limit(limit);

  const evalIds = recentEvals.map((e) => e.id);
  return warmCache(evalIds);
}