export declare class DriveClient {
    private drive;
    constructor();
    getOrCreateFolder(folderName: string, parentId?: string): Promise<string>;
    uploadFile(filename: string, mimeType: string, folderId: string, contentBuffer: Buffer): Promise<string>;
}
export declare const driveClient: DriveClient;
//# sourceMappingURL=driveClient.d.ts.map