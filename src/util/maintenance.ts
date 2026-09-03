import { getDb } from '../database/index';
import { evalsTable, evalResultsTable } from '../database/tables';
import { lt, sql, eq } from 'drizzle-orm';
import { getEnvInt } from '../envars';
import logger from '../logger';

export async function cleanupOldEvaluations(maxAgeDays: number = 30): Promise<number> {
  const db = await getDb();
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - maxAgeDays);
  const cutoffTimestamp = Math.floor(cutoffDate.getTime() / 1000);

  logger.info(`Cleaning up evaluations older than ${maxAgeDays} days (before ${cutoffDate.toISOString()})`);

  const oldEvals = await db
    .select({ id: evalsTable.id })
    .from(evalsTable)
    .where(lt(evalsTable.createdAt, cutoffTimestamp));

  if (oldEvals.length === 0) {
    logger.info('No old evaluations to clean up');
    return 0;
  }

  const evalIds = oldEvals.map((e) => e.id);

  await db.delete(evalResultsTable).where(sql`${evalResultsTable.evalId} IN (${evalIds.join(',')})`);
  await db.delete(evalsTable).where(sql`${evalsTable.id} IN (${evalIds.join(',')})`);

  logger.info(`Cleaned up ${evalIds.length} old evaluations`);
  return evalIds.length;
}

export async function cleanupOrphanedResults(): Promise<number> {
  const db = await getDb();

  logger.info('Cleaning up orphaned eval results...');

  const orphanedResults = await db
    .select({ id: evalResultsTable.id })
    .from(evalResultsTable)
    .leftJoin(evalsTable, eq(evalResultsTable.evalId, evalsTable.id))
    .where(sql`${evalsTable.id} IS NULL`);

  if (orphanedResults.length === 0) {
    logger.info('No orphaned results to clean up');
    return 0;
  }

  const resultIds = orphanedResults.map((r) => r.id);
  await db.delete(evalResultsTable).where(sql`${evalResultsTable.id} IN (${resultIds.join(',')})`);

  logger.info(`Cleaned up ${resultIds.length} orphaned results`);
  return resultIds.length;
}

export async function vacuumDatabase(): Promise<void> {
  const db = await getDb();
  logger.info('Running database vacuum...');
  try {
    await (db as unknown as { execute: (sql: string) => Promise<void> }).execute('VACUUM');
    logger.info('Database vacuum completed');
  } catch {
    logger.warn('VACUUM not supported on this database dialect');
  }
}