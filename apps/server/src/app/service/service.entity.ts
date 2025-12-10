import {
  Collection,
  Embeddable,
  Embedded,
  Entity,
  Enum,
  ManyToOne,
  OneToMany,
  Opt,
  PrimaryKey,
  Property,
  Ref,
  t,
  Unique,
} from '@mikro-orm/core';
import { Field, HideField, ID, Int, ObjectType } from '@nest-boot/graphql';
import { Float } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { Domain } from '@/domain/domain.entity';
import { Project } from '@/project/project.entity';
import { Volume } from '@/volume/volume.entity';
import { Workspace } from '@/workspace/workspace.entity';

import { ServicePortProtocol } from './enums/service-port-protocol.enum';

@ObjectType()
@Embeddable()
export class ServicePort {
  @Field(() => Int)
  @Property({ type: t.integer })
  port!: number;

  @Field(() => ServicePortProtocol)
  @Enum(() => ServicePortProtocol)
  protocol: ServicePortProtocol = ServicePortProtocol.HTTP;
}

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

@ObjectType({ description: 'Resource limits for a service container' })
@Embeddable()
export class ResourceUsage {
  @Field(() => Int, {
    nullable: true,
    description: 'CPU limit in millicores (1000 = 1 core)',
  })
  @Property({ type: t.integer, nullable: true })
  cpu: Opt<number> | null = null;

  @Field(() => Int, {
    nullable: true,
    description: 'Memory limit in megabytes',
  })
  @Property({ type: t.integer, nullable: true })
  memory: Opt<number> | null = null;
}

@ObjectType()
@Embeddable()
export class Image {
  @Field(() => String, { nullable: true })
  @Property({ type: t.string, nullable: true })
  registry: Opt<string> | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: t.string })
  name: Opt<string> | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: t.string, nullable: true })
  tag: Opt<string> | null = null;

  @HideField()
  @Property({ type: t.string, nullable: true })
  digest: Opt<string> | null = null;

  @Field(() => String, { nullable: true })
  @Property({ type: t.string, nullable: true })
  username: Opt<string> | null = null;

  @HideField()
  @Property({ type: t.string, nullable: true })
  password: Opt<string> | null = null;
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

  @Field(() => String, { nullable: true })
  @Property({ type: t.text, nullable: true })
  description: Opt<string> | null = null;

  // eslint-disable-next-line @nest-boot/entity-property-config-from-types
  @Field(() => Image)
  @Embedded(() => Image)
  image: Opt<Image> = new Image();

  // eslint-disable-next-line @nest-boot/entity-property-config-from-types
  @Field(() => [ServicePort])
  @Embedded(() => ServicePort, { array: true, default: [] })
  ports: Opt<ServicePort[]> = [];

  // eslint-disable-next-line @nest-boot/entity-property-config-from-types
  @Field(() => [EnvironmentVariable])
  @Embedded(() => EnvironmentVariable, { array: true, default: [] })
  environmentVariables: Opt<EnvironmentVariable[]> = [];

  // eslint-disable-next-line @nest-boot/entity-property-config-from-types
  @Field(() => ResourceUsage)
  @Embedded(() => ResourceUsage)
  resourceUsage: Opt<ResourceUsage> = new ResourceUsage();

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

  get kubeRegistryCredentialSecretName(): Opt<string> {
    return `kp-service-${this.id}-registry-credential`;
  }
}
