import { Field, Float, ID, ObjectType } from '@nest-boot/graphql';

import { ClusterNodeStatus } from '../enums/cluster-node-status.enum';

@ObjectType()
export class ClusterNode {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  ip!: string;

  @Field(() => Float, {
    description: 'Allocatable CPU in millicores (1000 = 1 core)',
  })
  allocatableCpu!: number;

  @Field(() => Float, {
    description: 'Allocatable memory in megabytes',
  })
  allocatableMemory!: number;

  @Field(() => Float, {
    description: 'Allocatable disk in gigabytes',
  })
  allocatableDisk!: number;

  @Field(() => Float, {
    description: 'Total CPU capacity in millicores (1000 = 1 core)',
  })
  capacityCpu!: number;

  @Field(() => Float, {
    description: 'Total memory capacity in megabytes',
  })
  capacityMemory!: number;

  @Field(() => Float, {
    description: 'Total disk capacity in gigabytes',
  })
  capacityDisk!: number;

  @Field(() => ClusterNodeStatus)
  status!: ClusterNodeStatus;
}
