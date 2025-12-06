import { Field, ID, InputType } from '@nest-boot/graphql';

@InputType()
export class CreateClusterInput {
  @Field(() => ID)
  workspaceId!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  server!: string;

  @Field(() => String)
  certificateAuthorityData!: string;

  @Field(() => String)
  token!: string;
}
