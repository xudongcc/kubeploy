import { Index, Opt } from '@mikro-orm/core';
import {
  Collection,
  Entity,
  OneToMany,
  PrimaryKey,
  Property,
  t,
} from '@mikro-orm/postgresql';
import { BaseUser } from '@nest-boot/auth';
import { Field, ID, ObjectType } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { WorkspaceMember } from '@/workspace-member/workspace-member.entity';

@ObjectType()
@Entity()
@Index({ properties: ['createdAt'] })
export class User extends BaseUser {
  @Field(() => ID)
  @PrimaryKey({ type: t.bigint })
  id: string = Sonyflake.next().toString();

  @Field(() => String)
  @Property({ type: t.string })
  name!: string;

  @Field(() => String)
  @Property({ type: t.string })
  email!: string;

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

  @OneToMany(() => WorkspaceMember, (member) => member.user)
  workspaceMembers = new Collection<WorkspaceMember>(this);
}
