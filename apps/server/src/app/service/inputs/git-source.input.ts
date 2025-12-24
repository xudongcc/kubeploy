import { Field, ID, InputType } from '@nest-boot/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class GitSourceInput {
  @IsString()
  @Field(() => ID, { description: 'GitProvider ID' })
  providerId!: string;

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
