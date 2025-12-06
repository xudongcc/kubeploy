import { Field, ID, InputType } from '@nest-boot/graphql';

@InputType()
export class CreateVolumeInput {
  @Field(() => ID)
  serviceId!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  size!: string;

  @Field(() => String, { nullable: true })
  storageClass?: string;
}
