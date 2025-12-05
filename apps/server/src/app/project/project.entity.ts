import {
  Entity,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  Ref,
  t,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { Workspace } from '@/workspace/workspace.entity';

@ObjectType()
@Entity()
export class Project {
  @Field(() => ID)
  @PrimaryKey({
    type: t.bigint,
  })
  id: string = Sonyflake.next().toString();

  @Field(() => String)
  @Property({ type: t.string })
  name!: string;

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

  @ManyToOne(() => Workspace)
  workspace!: Ref<Workspace>;
}
