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
import { Field, ID, Int, ObjectType } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { Service } from '@/service/service.entity';
import { Workspace } from '@/workspace/workspace.entity';

@ObjectType()
@Unique({ properties: ['service', 'name'] })
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

  @Field(() => Int)
  @Property({ type: t.integer, unsigned: true })
  size!: number;

  @Field(() => String, { nullable: true })
  @Property({ type: t.string, nullable: true })
  mountPath: Opt<string> | null = null;

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

  get kubePersistentVolumeClaimName(): Opt<string> {
    return `kp-volume-${this.id}`;
  }
}
