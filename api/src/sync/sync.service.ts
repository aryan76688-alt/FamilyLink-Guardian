import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SyncService {
  constructor(private readonly prisma: PrismaService) {}

  async createJob(deviceId: string, type: string, itemCount: number, checksum?: string) {
    return this.prisma.syncJob.create({
      data: {
        deviceId,
        type,
        itemCount,
        checksum,
        status: 'PENDING',
      },
    });
  }

  async updateJob(jobId: string, status: any, checksum?: string, errorMessage?: string) {
    return this.prisma.syncJob.update({
      where: { id: jobId },
      data: {
        status,
        checksum: checksum || undefined,
        errorMessage: errorMessage || undefined,
      },
    });
  }

  async getPendingJobs(deviceId: string) {
    return this.prisma.syncJob.findMany({
      where: {
        deviceId,
        status: { in: ['PENDING', 'UPLOADING'] },
      },
    });
  }
}
