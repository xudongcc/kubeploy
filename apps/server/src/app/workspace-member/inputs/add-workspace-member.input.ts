import { Field, InputType } from '@nest-boot/graphql';
import { IsEmail } from 'class-validator';

@InputType()
export class AddWorkspaceMemberInput {
  @IsEmail()
  @Field(() => String)
  email!: string;
}
