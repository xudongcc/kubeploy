import { Field, ID, InputType, Int } from '@nest-boot/graphql';

@InputType()
export class CreateDomainInput {
  @Field(() => ID)
  serviceId!: string;

  @Field(() => String)
  host!: string;

  @Field(() => String, { nullable: true, defaultValue: '/' })
  path?: string;

  @Field(() => Int)
  servicePort!: number;
}
