import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class TriggerSosDto {
  @IsNotEmpty()
  @IsString()
  deviceId!: string;

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsNumber()
  battery?: number;

  @IsOptional()
  @IsString()
  reason?: 'MANUAL_SOS' | 'FALL_DETECTED' | 'CRASH_DETECTED';

  @IsOptional()
  @IsString()
  audioRecordingUrl?: string;
}

export class ResolveSosDto {
  @IsOptional()
  @IsString()
  resolvedBy?: string;

  @IsOptional()
  @IsString()
  status?: 'RESOLVED' | 'CANCELLED';
}
