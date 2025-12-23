import { Field, InputType, Int } from '@nest-boot/graphql';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

import { HealthCheckType } from '../enums/health-check-type.enum';

@InputType()
export class HealthCheckInput {
  @IsEnum(HealthCheckType)
  @Field(() => HealthCheckType, { description: 'Type of health check: HTTP or TCP' })
  type!: HealthCheckType;

  @IsOptional()
  @IsString()
  @Field(() => String, {
    nullable: true,
    description: 'HTTP path to probe (required for HTTP type)',
  })
  path?: string;

  @IsInt()
  @Min(1)
  @Max(65535)
  @Field(() => Int, { description: 'Port to probe (1-65535)' })
  port!: number;
}
