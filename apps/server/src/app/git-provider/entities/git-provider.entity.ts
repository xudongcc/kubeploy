import {
  Entity,
  Enum,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  Ref,
  t,
} from '@mikro-orm/core';
import { Field, HideField, ID, ObjectType } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { Workspace } from '@/workspace/workspace.entity';

import { GitProviderType } from '../enums/git-provider-type.enum';

@ObjectType()
@Entity()
export class GitProvider {
  @Field(() => ID)
  @PrimaryKey({ type: t.bigint })
  id: string = Sonyflake.next().toString();

  @Field(() => String)
  @Property({ type: t.string })
  name!: string;

  @Field(() => GitProviderType)
  @Enum(() => GitProviderType)
  type!: GitProviderType;

  @Field(() => String, {
    description: 'Base URL (e.g., https://github.com or https://gitlab.com)',
  })
  @Property({ type: t.string })
  url!: string;

  @HideField()
  @Property({ type: t.string, hidden: true, lazy: true })
  clientId!: string;

  @HideField()
  @Property({ type: t.string, hidden: true, lazy: true })
  clientSecret!: string;

  @ManyToOne(() => Workspace, { nullable: true })
  workspace: Opt<Ref<Workspace>> | null = null;

  @Field(() => Date)
  @Property({ type: t.datetime, defaultRaw: 'now()' })
  createdAt: Opt<Date> = new Date();
}
