import { Field, Float, ID, Int, ObjectType } from '@nest-boot/graphql';

@ObjectType()
export class ClusterNode {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  ip!: string;

  @Field(() => Float)
  allocatableCpuCores!: number;

  @Field(() => Float)
  allocatableMemoryBytes!: number;

  @Field(() => Float)
  allocatableDiskBytes!: number;

  @Field(() => Float)
  capacityCpuCores!: number;

  @Field(() => Float)
  capacityMemoryBytes!: number;

  @Field(() => Float)
  capacityDiskBytes!: number;
}
