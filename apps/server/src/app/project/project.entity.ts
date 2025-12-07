import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Opt,
  PrimaryKey,
  Property,
  Ref,
  t,
} from '@mikro-orm/core';
import { Field, ID, ObjectType } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { Cluster } from '@/cluster/cluster.entity';
import { Service } from '@/service/service.entity';
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

  @ManyToOne(() => Cluster)
  cluster!: Ref<Cluster>;

  @OneToMany(() => Service, (service) => service.project)
  services = new Collection<Service>(this);

  get kubeNamespaceName(): Opt<string> {
    return `kp-project-${this.id}`;
  }
}
