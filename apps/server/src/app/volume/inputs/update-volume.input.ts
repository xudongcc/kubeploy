import { Field, InputType } from '@nest-boot/graphql';

@InputType()
export class UpdateVolumeInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  size?: string;

  @Field(() => String, { nullable: true })
  storageClass?: string;
}
