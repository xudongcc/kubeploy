import { Field, InputType, Int } from '@nest-boot/graphql';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  ValidateNested,
} from 'class-validator';

import { EnvironmentVariableInput } from './environment-variable.input';

@InputType()
export class UpdateServiceInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  image?: string;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field(() => Int, { nullable: true })
  replicas?: number;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  @IsPositive({ each: true })
  @Field(() => [Int], { nullable: true })
  ports?: number[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => EnvironmentVariableInput)
  @Field(() => [EnvironmentVariableInput], { nullable: true })
  environmentVariables?: EnvironmentVariableInput[];
}
