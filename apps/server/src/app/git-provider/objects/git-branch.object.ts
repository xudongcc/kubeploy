import { Field, ObjectType } from '@nest-boot/graphql';

@ObjectType()
export class GitBranchObject {
  @Field(() => String)
  name!: string;

  @Field(() => String)
  sha!: string;

  @Field(() => Boolean)
  protected!: boolean;
}
