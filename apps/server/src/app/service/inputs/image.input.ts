import { Field, InputType } from '@nest-boot/graphql';
import { IsOptional, IsString } from 'class-validator';

@InputType()
export class ImageInput {
  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  registry?: string;

  @IsString()
  @Field(() => String)
  name!: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  tag?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  username?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  password?: string;
}
