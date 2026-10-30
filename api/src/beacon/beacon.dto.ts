import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class LastGaspBeaconDto {
  @IsNotEmpty()
  @IsString()
  deviceId!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  batteryLevel!: number;

  @IsOptional()
  @IsString()
  wifiSsid?: string;

  @IsOptional()
  @IsString()
  cellInfo?: string;

  @IsNotEmpty()
  @IsString()
  triggerReason!: string; // BATTERY_CRITICAL, SHUTDOWN
}
