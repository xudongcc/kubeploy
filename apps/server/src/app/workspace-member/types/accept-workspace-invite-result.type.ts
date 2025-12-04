import { Field, ObjectType } from '@nest-boot/graphql';
import { ID } from '@nest-boot/graphql';

import { WorkspaceMember } from '../workspace-member.entity';

@ObjectType()
export class AcceptWorkspaceInviteResult {
  @Field(() => WorkspaceMember)
  workspaceMember!: WorkspaceMember;

  @Field(() => ID)
  workspaceId!: string;
}
