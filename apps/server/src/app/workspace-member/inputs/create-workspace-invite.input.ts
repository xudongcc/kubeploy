import { Field, InputType } from '@nest-boot/graphql';
import { IsEmail, IsOptional } from 'class-validator';

import { WorkspaceMemberRole } from '@/workspace-member/enums/workspace-member-role.enum';

@InputType()
export class CreateWorkspaceInviteInput {
  @Field(() => WorkspaceMemberRole)
  role!: WorkspaceMemberRole;

  @IsOptional()
  @IsEmail()
  @Field(() => String, { nullable: true })
  email?: string;
}
