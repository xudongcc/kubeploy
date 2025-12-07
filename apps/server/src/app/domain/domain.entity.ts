import {
  Entity,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  Ref,
  t,
} from '@mikro-orm/core';
import { Field, ID, Int, ObjectType } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { Service } from '@/service/service.entity';
import { Workspace } from '@/workspace/workspace.entity';

@ObjectType()
@Entity()
export class Domain {
  @Field(() => ID)
  @PrimaryKey({
    type: t.bigint,
  })
  id: string = Sonyflake.next().toString();

  @Field(() => String)
  @Property({ type: t.string })
  host!: string;

  @Field(() => String)
  @Property({ type: t.string, default: '/' })
  path: Opt<string> = '/';

  @Field(() => Int)
  @Property({ type: t.integer, unsigned: true })
  servicePort!: number;

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

  get kubeIngressName(): Opt<string> {
    return `kp-domain-${this.id}`;
  }
}
