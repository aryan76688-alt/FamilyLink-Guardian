import { IsNumber, IsOptional, IsBoolean, IsDateString } from 'class-validator';

export class LocationRecordDto {
  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;

  @IsOptional()
  @IsNumber()
  accuracy?: number;

  @IsOptional()
  @IsNumber()
  speed?: number;

  @IsOptional()
  @IsNumber()
  heading?: number;

  @IsOptional()
  @IsNumber()
  battery?: number;

  @IsOptional()
  @IsBoolean()
  isOfflineQueued?: boolean;

  @IsDateString()
  timestamp!: string;
}

export class BatchLocationDto {
  points!: LocationRecordDto[];
}
