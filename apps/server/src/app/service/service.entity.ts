import {
  ArrayType,
  Embeddable,
  Embedded,
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

import { Project } from '@/project/project.entity';
import { Workspace } from '@/workspace/workspace.entity';

@ObjectType()
@Embeddable()
export class EnvironmentVariable {
  @Field(() => String)
  @Property({ type: t.string })
  key!: string;

  @Field(() => String)
  @Property({ type: t.string })
  value!: string;
}

@ObjectType()
@Entity()
export class Service {
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
  image!: string;

  @Field(() => Int)
  @Property({ type: t.integer, default: 1 })
  replicas: Opt<number> = 1;

  // eslint-disable-next-line @nest-boot/entity-property-config-from-types
  @Field(() => [Int])
  @Property({ type: new ArrayType((i) => +i), default: [] })
  ports: Opt<number[]> = [];

  // eslint-disable-next-line @nest-boot/entity-property-config-from-types
  @Field(() => [EnvironmentVariable])
  @Embedded(() => EnvironmentVariable, { array: true, default: [] })
  environmentVariables: Opt<EnvironmentVariable[]> = [];

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

  @ManyToOne(() => Project)
  project!: Ref<Project>;

  get kubeDeploymentName(): Opt<string> {
    return `kp-${this.id}`;
  }

  get kubeServiceName(): Opt<string> {
    return `kp-${this.id}`;
  }
}
