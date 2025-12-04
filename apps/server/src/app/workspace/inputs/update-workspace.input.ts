import { Field, InputType } from '@nest-boot/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateWorkspaceInput {
  @IsString()
  @IsOptional()
  @Field(() => String, { nullable: true })
  name?: string;
}
