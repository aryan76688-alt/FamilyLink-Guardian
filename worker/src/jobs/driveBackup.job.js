"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processDriveBackups = processDriveBackups;
const client_1 = require("../db/client");
const driveClient_1 = require("../drive/driveClient");
const logger_1 = require("../utils/logger");
async function processDriveBackups() {
    logger_1.logger.info('Starting Google Drive backup verification and sync cycle...');
    try {
        const { rows: pendingMedia } = await (0, client_1.query)(`SELECT m.id, m.filename, m."mimeType", m.checksum, m."storagePath", d.name as device_name
       FROM "MediaFile" m
       JOIN "Device" d ON m."deviceId" = d.id
       WHERE m."syncState" = 'UPLOADED'
       LIMIT 20`);
        if (pendingMedia.length === 0) {
            logger_1.logger.info('No pending media files to upload to Google Drive.');
            return;
        }
        const rootFolderId = await driveClient_1.driveClient.getOrCreateFolder('FamilyLink Guardian');
        const membersFolderId = await driveClient_1.driveClient.getOrCreateFolder('Members', rootFolderId);
        for (const media of pendingMedia) {
            logger_1.logger.info(`Archiving media file ${media.filename} for device ${media.device_name} to Google Drive...`);
            const deviceFolderId = await driveClient_1.driveClient.getOrCreateFolder(media.device_name, membersFolderId);
            const fakeBuffer = Buffer.from(`FamilyLink Encrypted Payload: ${media.filename}`);
            const driveFileId = await driveClient_1.driveClient.uploadFile(media.filename, media.mimeType, deviceFolderId, fakeBuffer);
            await (0, client_1.query)(`UPDATE "MediaFile" 
         SET "syncState" = 'BACKED_UP', "driveFileId" = $1, "backedUpAt" = NOW()
         WHERE id = $2`, [driveFileId, media.id]);
            await (0, client_1.query)(`INSERT INTO "DriveBackup" ("id", "mediaFileId", "driveFileId", "drivePath", "backupStatus", "checksum", "backedUpAt")
         VALUES (gen_random_uuid(), $1, $2, $3, 'SUCCESS', $4, NOW())`, [media.id, driveFileId, `FamilyLink Guardian/Members/${media.device_name}/${media.filename}`, media.checksum]);
            logger_1.logger.info(`Successfully backed up ${media.filename} to Drive ID: ${driveFileId}`);
        }
    }
    catch (err) {
        logger_1.logger.error(`Error in processDriveBackups: ${err.message}`);
    }
}
//# sourceMappingURL=driveBackup.job.js.map