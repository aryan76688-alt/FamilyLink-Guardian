import { query } from '../db/client';
import { logger } from '../utils/logger';

export async function runLocalRetentionCleanup() {
  const retentionDays = parseInt(process.env.LOCAL_RETENTION_DAYS || '10', 10);
  logger.info(`Running local retention audit (files older than ${retentionDays} days)...`);

  try {
    const { rowCount } = await query(
      `UPDATE "MediaFile"
       SET "syncState" = 'EXPIRED_LOCAL'
       WHERE "syncState" = 'BACKED_UP'
         AND "createdAt" < NOW() - INTERVAL '${retentionDays} days'`,
    );

    logger.info(`Retention cleanup complete: marked ${rowCount} safely backed up media files as EXPIRED_LOCAL.`);
  } catch (err: any) {
    logger.error(`Error in runLocalRetentionCleanup: ${err.message}`);
  }
}
