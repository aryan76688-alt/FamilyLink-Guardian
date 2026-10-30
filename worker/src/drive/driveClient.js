"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.driveClient = exports.DriveClient = void 0;
const googleapis_1 = require("googleapis");
const logger_1 = require("../utils/logger");
class DriveClient {
    drive = null;
    constructor() {
        const clientId = process.env.GOOGLE_CLIENT_ID;
        const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
        const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;
        if (clientId && clientSecret && refreshToken) {
            const auth = new googleapis_1.google.auth.OAuth2(clientId, clientSecret);
            auth.setCredentials({ refresh_token: refreshToken });
            this.drive = googleapis_1.google.drive({ version: 'v3', auth });
        }
        else {
            logger_1.logger.warn('Google Drive credentials not set. Running in simulation mode.');
        }
    }
    async getOrCreateFolder(folderName, parentId) {
        if (!this.drive)
            return 'simulated-folder-id';
        try {
            const query = parentId
                ? `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`
                : `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
            const res = await this.drive.files.list({ q: query, fields: 'files(id, name)' });
            if (res.data.files && res.data.files.length > 0) {
                return res.data.files[0].id;
            }
            const folderMetadata = {
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
            };
            if (parentId)
                folderMetadata.parents = [parentId];
            const created = await this.drive.files.create({
                requestBody: folderMetadata,
                fields: 'id',
            });
            return created.data.id;
        }
        catch (err) {
            logger_1.logger.error(`Error managing Drive folder ${folderName}: ${err.message}`);
            return 'simulated-folder-id';
        }
    }
    async uploadFile(filename, mimeType, folderId, contentBuffer) {
        if (!this.drive)
            return `simulated-drive-file-${Date.now()}`;
        const res = await this.drive.files.create({
            requestBody: {
                name: filename,
                parents: [folderId],
            },
            media: {
                mimeType,
                body: contentBuffer,
            },
            fields: 'id',
        });
        return res.data.id;
    }
}
exports.DriveClient = DriveClient;
exports.driveClient = new DriveClient();
//# sourceMappingURL=driveClient.js.map