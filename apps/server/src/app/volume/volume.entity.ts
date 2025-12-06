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

import { Service } from '@/service/service.entity';
import { Workspace } from '@/workspace/workspace.entity';

@ObjectType()
@Entity()
export class Volume {
  @Field(() => ID)
  @PrimaryKey({
    type: t.bigint,
  })
  id: string = Sonyflake.next().toString();

  @Field(() => String)
  @Property({ type: t.string })
  name!: string;

  @Field(() => String)
  @Property({ type: t.string })
  size!: string;

  @Field(() => String, { nullable: true })
  @Property({ type: t.string, nullable: true })
  storageClass?: string;

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

  @ManyToOne(() => Service)
  service!: Ref<Service>;

  get kubePvcName(): Opt<string> {
    return `kp-${this.id}`;
  }
}
