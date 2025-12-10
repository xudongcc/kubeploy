import { Field, InputType } from '@nest-boot/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class ResourcesInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  cpuRequest?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  cpuLimit?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  memoryRequest?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  memoryLimit?: string;
}
