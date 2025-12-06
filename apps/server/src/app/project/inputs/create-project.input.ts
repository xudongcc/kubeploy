import { Field, ID, InputType } from '@nest-boot/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateProjectInput {
  @Field(() => ID)
  clusterId!: string;

  @IsString()
  @Field(() => String)
  name!: string;
}
