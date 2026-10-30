"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLocalRetentionCleanup = runLocalRetentionCleanup;
const client_1 = require("../db/client");
const logger_1 = require("../utils/logger");
async function runLocalRetentionCleanup() {
    const retentionDays = parseInt(process.env.LOCAL_RETENTION_DAYS || '10', 10);
    logger_1.logger.info(`Running local retention audit (files older than ${retentionDays} days)...`);
    try {
        const { rowCount } = await (0, client_1.query)(`UPDATE "MediaFile"
       SET "syncState" = 'EXPIRED_LOCAL'
       WHERE "syncState" = 'BACKED_UP'
         AND "createdAt" < NOW() - INTERVAL '${retentionDays} days'`);
        logger_1.logger.info(`Retention cleanup complete: marked ${rowCount} safely backed up media files as EXPIRED_LOCAL.`);
    }
    catch (err) {
        logger_1.logger.error(`Error in runLocalRetentionCleanup: ${err.message}`);
    }
}
//# sourceMappingURL=cleanup.job.js.map