import { Field, InputType } from '@nest-boot/graphql';
import { IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class AcceptWorkspaceInviteInput {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Field(() => String, { nullable: true })
  name?: string;
}
