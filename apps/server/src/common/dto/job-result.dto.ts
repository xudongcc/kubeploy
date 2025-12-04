import { Field, ID, ObjectType } from '@nest-boot/graphql';

import { JobStatus } from '../enums/job-status.enum';

@ObjectType()
export class JobResult {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => JobStatus)
  status!: JobStatus;
}
