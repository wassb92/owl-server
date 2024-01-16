import { IsString } from 'class-validator';

export class HeartRateDto {
  @IsString()
  readonly heartRate: string;
}
