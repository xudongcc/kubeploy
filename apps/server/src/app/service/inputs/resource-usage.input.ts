import { Field, InputType, Int } from '@nest-boot/graphql';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

@InputType()
export class ResourceUsageInput {
  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field(() => Int, {
    nullable: true,
    description: 'CPU limit in millicores (1000 = 1 core)',
  })
  cpu?: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  @Field(() => Int, {
    nullable: true,
    description: 'Memory limit in megabytes',
  })
  memory?: number;
}
