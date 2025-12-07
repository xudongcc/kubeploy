import { Field, InputType, Int } from '@nest-boot/graphql';

@InputType()
export class UpdateVolumeInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => Int, { nullable: true })
  size?: number;

  @Field(() => String, { nullable: true })
  storageClass?: string;
}
