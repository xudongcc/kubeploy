import { Field, Int, ObjectType } from '@nest-boot/graphql';

@ObjectType({ description: 'Service resource metrics' })
export class ServiceMetrics {
  @Field(() => Int, {
    description: 'Current CPU usage in millicores (1000 = 1 core)',
  })
  usedCpu!: number;

  @Field(() => Int, {
    description: 'Current memory usage in megabytes',
  })
  usedMemory!: number;

  @Field(() => Int, {
    nullable: true,
    description: 'CPU limit in millicores (1000 = 1 core)',
  })
  limitCpu?: number | null;

  @Field(() => Int, {
    nullable: true,
    description: 'Memory limit in megabytes',
  })
  limitMemory?: number | null;
}
