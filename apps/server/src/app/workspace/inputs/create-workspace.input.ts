import { Field, InputType } from '@nest-boot/graphql';
import { IsString } from 'class-validator';

@InputType()
export class CreateWorkspaceInput {
  @IsString()
  @Field(() => String)
  name!: string;
}
