import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class RecordActivityDto {
  @IsNotEmpty()
  @IsString()
  deviceId!: string;

  @IsNotEmpty()
  @IsString()
  activityType!: string; // IN_VEHICLE, ON_BICYCLE, WALKING, RUNNING, STILL, UNKNOWN

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  confidence?: number;

  @IsOptional()
  @IsNumber()
  speedKmh?: number;
}
