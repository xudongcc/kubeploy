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
    description: 'Used CPU in millicores (1000 = 1 core)',
  })
  usedCpu!: number;

  @Field(() => Float, {
    description: 'Used memory in megabytes',
  })
  usedMemory!: number;

  @Field(() => Float, {
    description: 'Total CPU capacity in millicores (1000 = 1 core)',
  })
  totalCpu!: number;

  @Field(() => Float, {
    description: 'Total memory capacity in megabytes',
  })
  totalMemory!: number;

  @Field(() => ClusterNodeStatus)
  status!: ClusterNodeStatus;
}
