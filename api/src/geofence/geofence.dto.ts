import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateGeofenceDto {
  @IsNotEmpty()
  @IsString()
  familyGroupId!: string;

  @IsNotEmpty()
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  type?: string; // SAFE, SCHOOL, HOME, WORK, DANGER

  @IsOptional()
  @IsArray()
  polygonCoordinates?: Array<{ lat: number; lng: number }>;

  @IsOptional()
  @IsNumber()
  centerLat?: number;

  @IsOptional()
  @IsNumber()
  centerLng?: number;

  @IsOptional()
  @IsNumber()
  radiusMeters?: number;

  @IsOptional()
  @IsBoolean()
  notifyOnEnter?: boolean;

  @IsOptional()
  @IsBoolean()
  notifyOnExit?: boolean;
}

export class RecordGeofenceEventDto {
  @IsNotEmpty()
  @IsString()
  deviceId!: string;

  @IsNotEmpty()
  @IsString()
  geofenceZoneId!: string;

  @IsNotEmpty()
  @IsString()
  eventType!: 'ENTER' | 'EXIT';

  @IsNumber()
  latitude!: number;

  @IsNumber()
  longitude!: number;
}
