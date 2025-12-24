import { Field, ID, ObjectType } from '@nest-boot/graphql';

@ObjectType()
export class GitRepositoryObject {
  @Field(() => ID)
  id!: string;

  @Field(() => String)
  name!: string;

  @Field(() => String)
  fullName!: string;

  @Field(() => String)
  owner!: string;

  @Field(() => String, { nullable: true })
  description?: string;

  @Field(() => String)
  defaultBranch!: string;

  @Field(() => Boolean)
  private!: boolean;

  @Field(() => String)
  cloneUrl!: string;

  @Field(() => String)
  htmlUrl!: string;
}
