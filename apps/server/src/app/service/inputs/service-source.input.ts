import { Field, ID, InputType } from '@nest-boot/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class ServiceSourceInput {
  @IsString()
  @Field(() => ID, { description: 'GitProviderAuthorization ID' })
  authorizationId!: string;

  @IsString()
  @Field(() => String)
  owner!: string;

  @IsString()
  @Field(() => String)
  repo!: string;

  @IsString()
  @Field(() => String)
  branch!: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true, description: 'Subdirectory path within the repository' })
  path?: string;
}
