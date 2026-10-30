import cron from 'node-cron';
import { processDriveBackups } from './jobs/driveBackup.job';
import { runLocalRetentionCleanup } from './jobs/cleanup.job';
import { logger } from './utils/logger';

logger.info('FamilyLink Guardian Worker Daemon initialized.');

// Run Drive sync every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  await processDriveBackups();
});

// Run local retention cleanup every 24 hours
cron.schedule('0 0 * * *', async () => {
  await runLocalRetentionCleanup();
});

// Immediate initial run
processDriveBackups();

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down worker gracefully.');
  process.exit(0);
});
