import { Field, ID, ObjectType } from '@nest-boot/graphql';

@ObjectType()
export class GitAccountObject {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  providerId!: string;

  @Field(() => String)
  accountId!: string;

  @Field(() => String, { nullable: true })
  username?: string;
}
