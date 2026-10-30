import { google } from 'googleapis';
import { logger } from '../utils/logger';

export class DriveClient {
  private drive: any = null;

  constructor() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const refreshToken = process.env.GOOGLE_REFRESH_TOKEN;

    if (clientId && clientSecret && refreshToken) {
      const auth = new google.auth.OAuth2(clientId, clientSecret);
      auth.setCredentials({ refresh_token: refreshToken });
      this.drive = google.drive({ version: 'v3', auth });
    } else {
      logger.warn('Google Drive credentials not set. Running in simulation mode.');
    }
  }

  async getOrCreateFolder(folderName: string, parentId?: string): Promise<string> {
    if (!this.drive) return 'simulated-folder-id';

    try {
      const query = parentId
        ? `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents and trashed=false`
        : `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;

      const res = await this.drive.files.list({ q: query, fields: 'files(id, name)' });
      if (res.data.files && res.data.files.length > 0) {
        return res.data.files[0].id;
      }

      const folderMetadata: any = {
        name: folderName,
        mimeType: 'application/vnd.google-apps.folder',
      };
      if (parentId) folderMetadata.parents = [parentId];

      const created = await this.drive.files.create({
        requestBody: folderMetadata,
        fields: 'id',
      });
      return created.data.id;
    } catch (err: any) {
      logger.error(`Error managing Drive folder ${folderName}: ${err.message}`);
      return 'simulated-folder-id';
    }
  }

  async uploadFile(filename: string, mimeType: string, folderId: string, contentBuffer: Buffer): Promise<string> {
    if (!this.drive) return `simulated-drive-file-${Date.now()}`;

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

export const driveClient = new DriveClient();
