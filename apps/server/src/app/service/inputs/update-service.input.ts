import { Field, InputType } from '@nest-boot/graphql';
import { Type } from 'class-transformer';
import { IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';

import { GitSourceInput } from './git-source.input';

import { EnvironmentVariableInput } from './environment-variable.input';
import { HealthCheckInput } from './health-check.input';
import { ImageInput } from './image.input';
import { ResourceLimitsInput } from './resource-limits.input';
import { ServicePortInput } from './service-port.input';

@InputType()
export class UpdateServiceInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ImageInput)
  @Field(() => ImageInput, { nullable: true })
  image?: ImageInput;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServicePortInput)
  @Field(() => [ServicePortInput], { nullable: true })
  ports?: ServicePortInput[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvironmentVariableInput)
  @Field(() => [EnvironmentVariableInput], { nullable: true })
  environmentVariables?: EnvironmentVariableInput[];

  @IsOptional()
  @ValidateNested()
  @Type(() => ResourceLimitsInput)
  @Field(() => ResourceLimitsInput, { nullable: true })
  resourceLimits?: ResourceLimitsInput;

  @IsOptional()
  @ValidateNested()
  @Type(() => HealthCheckInput)
  @Field(() => HealthCheckInput, { nullable: true })
  healthCheck?: HealthCheckInput | null;

  @IsOptional()
  @ValidateNested()
  @Type(() => GitSourceInput)
  @Field(() => GitSourceInput, { nullable: true })
  gitSource?: GitSourceInput | null;
}
