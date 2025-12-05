import { Field, ID, InputType, Int } from '@nest-boot/graphql';
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
export class CreateServiceInput {
  @IsString()
  @Field(() => String)
  name!: string;

  @IsString()
  @Field(() => String)
  image!: string;

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

  @IsString()
  @Field(() => ID)
  projectId!: string;
}
