import { Field, HideField, ID, ObjectType } from '@nest-boot/graphql';
import { GitProvider } from '../entities/git-provider.entity';
import { Ref } from '@mikro-orm/core';
import { Workspace } from '@/workspace/workspace.entity';

@ObjectType()
export class GitRepository {
  @Field(() => ID)
  id!: string;

  /** Internal field for resolver context */
  @HideField()
  workspace!: Ref<Workspace>;

  /** Internal field for resolver context */
  @HideField()
  provider!: Ref<GitProvider>;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  owner!: string;

  @Field(() => String)
  defaultBranch!: string;

  @Field(() => String)
  cloneUrl!: string;

  @Field(() => String)
  htmlUrl!: string;
}
