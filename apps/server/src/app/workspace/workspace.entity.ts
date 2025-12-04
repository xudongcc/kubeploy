import { Filter } from '@mikro-orm/core';
import {
  Collection,
  Entity,
  Enum,
  Index,
  OneToMany,
  Opt,
  PrimaryKey,
  Property,
  t,
} from '@mikro-orm/postgresql';
import { Field, ID, ObjectType } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';

import { WorkspaceFeature } from './enums/features.enum';

@ObjectType()
@Entity()
@Filter({
  name: 'softDeleted',
  cond: { deletedAt: { $eq: null } },
  default: true,
})
@Index({ properties: ['createdAt'] })
@Index({ properties: ['deletedAt'] })
export class Workspace {
  @Field(() => ID)
  @PrimaryKey({
    type: t.bigint,
  })
  id: string = Sonyflake.next().toString();

  @Field(() => String)
  @Property({ type: t.string })
  name!: string;

  @Field(() => [WorkspaceFeature])
  @Enum({ items: () => WorkspaceFeature, array: true, defaultRaw: "'{}'" })
  features: Opt<WorkspaceFeature[]> = [];

  @Field(() => Date)
  @Property({ type: t.datetime, defaultRaw: 'now()' })
  createdAt: Opt<Date> = new Date();

  @Field(() => Date)
  @Property({
    type: t.datetime,
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt: Opt<Date> = new Date();

  @Field(() => Date, { nullable: true })
  @Property({ type: t.datetime, nullable: true })
  deletedAt?: Date;

  @OneToMany(() => WorkspaceMember, (member) => member.workspace)
  members = new Collection<WorkspaceMember>(this);
}
