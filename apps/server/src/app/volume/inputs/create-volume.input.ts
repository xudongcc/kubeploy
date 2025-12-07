import { Field, ID, InputType, Int } from '@nest-boot/graphql';

@InputType()
export class CreateVolumeInput {
  @Field(() => ID)
  serviceId!: string;

  @Field(() => String)
  name!: string;

  @Field(() => Int)
  size!: number;

  @Field(() => String, { nullable: true })
  mountPath?: string;
}
