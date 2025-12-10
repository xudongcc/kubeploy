import { Field, ID, Int, ObjectType } from '@nest-boot/graphql';

import { ClusterNodeStatus } from '../enums/cluster-node-status.enum';

@ObjectType()
export class ClusterNode {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  ip!: string;

  @Field(() => Int, {
    description: 'Used CPU in millicores (1000 = 1 core)',
  })
  usedCpu!: number;

  @Field(() => Int, {
    description: 'Used memory in megabytes',
  })
  usedMemory!: number;

  @Field(() => Int, {
    description: 'Total CPU capacity in millicores (1000 = 1 core)',
  })
  totalCpu!: number;

  @Field(() => Int, {
    description: 'Total memory capacity in megabytes',
  })
  totalMemory!: number;

  @Field(() => ClusterNodeStatus)
  status!: ClusterNodeStatus;
}
