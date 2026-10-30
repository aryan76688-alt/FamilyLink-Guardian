"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const driveBackup_job_1 = require("./jobs/driveBackup.job");
const cleanup_job_1 = require("./jobs/cleanup.job");
const logger_1 = require("./utils/logger");
logger_1.logger.info('FamilyLink Guardian Worker Daemon initialized.');
// Run Drive sync every 5 minutes
node_cron_1.default.schedule('*/5 * * * *', async () => {
    await (0, driveBackup_job_1.processDriveBackups)();
});
// Run local retention cleanup every 24 hours
node_cron_1.default.schedule('0 0 * * *', async () => {
    await (0, cleanup_job_1.runLocalRetentionCleanup)();
});
// Immediate initial run
(0, driveBackup_job_1.processDriveBackups)();
process.on('SIGTERM', () => {
    logger_1.logger.info('SIGTERM received. Shutting down worker gracefully.');
    process.exit(0);
});
//# sourceMappingURL=index.js.map