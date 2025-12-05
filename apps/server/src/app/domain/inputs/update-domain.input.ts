import { Field, InputType, Int } from '@nest-boot/graphql';

@InputType()
export class UpdateDomainInput {
  @Field(() => String, { nullable: true })
  host?: string;

  @Field(() => String, { nullable: true })
  path?: string;

  @Field(() => Int, { nullable: true })
  servicePort?: number;
}
