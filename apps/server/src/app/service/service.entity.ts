import {
  ArrayType,
  Collection,
  Embeddable,
  Embedded,
  Entity,
  ManyToOne,
  OneToMany,
  Opt,
  PrimaryKey,
  Property,
  Ref,
  t,
  Unique,
} from '@mikro-orm/core';
import { Field, ID, Int, ObjectType } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { Domain } from '@/domain/domain.entity';
import { Project } from '@/project/project.entity';
import { Volume } from '@/volume/volume.entity';
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
@Unique({ properties: ['project', 'name'] })
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
  @Property({ type: new ArrayType((i) => +i), unsigned: true, default: [] })
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

  @OneToMany(() => Domain, (domain) => domain.service)
  domains = new Collection<Domain>(this);

  @OneToMany(() => Volume, (volume) => volume.service)
  volumes = new Collection<Volume>(this);

  get kubeDeploymentName(): Opt<string> {
    return this.name;
  }

  get kubeServiceName(): Opt<string> {
    return this.name;
  }
}
