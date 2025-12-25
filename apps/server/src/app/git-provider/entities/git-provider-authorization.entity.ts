import {
  Entity,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  Ref,
  t,
  Unique,
} from '@mikro-orm/core';
import { Field, HideField, ID, ObjectType } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';
import { Workspace } from '@/workspace/workspace.entity';

import { GitProviderAccount } from './git-provider-account.entity';

@ObjectType()
@Entity()
@Unique({ properties: ['member', 'account'] })
export class GitProviderAuthorization {
  @Field(() => ID)
  @PrimaryKey({ type: t.bigint })
  id: string = Sonyflake.next().toString();

  @HideField()
  @ManyToOne(() => Workspace)
  workspace!: Ref<Workspace>;

  @HideField()
  @ManyToOne(() => WorkspaceMember, { deleteRule: 'cascade' })
  member!: Ref<WorkspaceMember>;

  @HideField()
  @ManyToOne(() => GitProviderAccount)
  account!: Ref<GitProviderAccount>;

  @Field(() => Date)
  @Property({ type: t.datetime, defaultRaw: 'now()' })
  createdAt: Opt<Date> = new Date();
}
