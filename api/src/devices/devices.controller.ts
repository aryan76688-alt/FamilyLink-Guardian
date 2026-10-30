import { Controller, Get, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { DevicesService } from './devices.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('api/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  getFamilyDevices(@Request() req: any) {
    return this.devicesService.getDevicesForFamily(req.user.familyGroupId);
  }

  @Get(':id')
  getDevice(@Param('id') id: string, @Request() req: any) {
    return this.devicesService.getDeviceById(id, req.user.familyGroupId);
  }

  @Patch(':id/name')
  updateName(@Param('id') id: string, @Body('name') name: string, @Request() req: any) {
    return this.devicesService.updateName(id, name, req.user.familyGroupId);
  }

  @Patch(':id/permissions')
  updatePermissions(@Param('id') id: string, @Body() permissions: any) {
    return this.devicesService.updatePermissions(id, permissions);
  }

  @Delete(':id')
  revokeDevice(@Param('id') id: string, @Request() req: any) {
    return this.devicesService.revokeDevice(id, req.user.familyGroupId);
  }
}
