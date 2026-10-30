import { IsArray, IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateFocusModeDto {
  @IsNotEmpty()
  @IsString()
  deviceId!: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  modeName?: string;

  @IsOptional()
  @IsString()
  scheduledStart?: string; // "18:00"

  @IsOptional()
  @IsString()
  scheduledEnd?: string; // "21:00"

  @IsOptional()
  @IsBoolean()
  dndActive?: boolean;

  @IsOptional()
  @IsArray()
  blockedApps?: string[];
}
