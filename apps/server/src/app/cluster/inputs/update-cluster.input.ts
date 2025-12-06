import { Field, InputType } from '@nest-boot/graphql';

@InputType()
export class UpdateClusterInput {
  @Field(() => String, { nullable: true })
  name?: string;

  @Field(() => String, { nullable: true })
  server?: string;

  @Field(() => String, { nullable: true })
  certificateAuthorityData?: string;

  @Field(() => String, { nullable: true })
  token?: string;
}
