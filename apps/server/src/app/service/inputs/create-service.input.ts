import { Field, ID, InputType } from '@nest-boot/graphql';
import { IsOptional, IsString, Length, Matches } from 'class-validator';

function IsServiceName(): PropertyDecorator {
  return (target: object, propertyKey: string | symbol) => {
    IsString()(target, propertyKey);

    Length(1, 63)(target, propertyKey);

    // Kubernetes DNS-1123 subdomain name pattern
    // https://kubernetes.io/docs/concepts/overview/working-with-objects/names/
    Matches(/^[a-z]([a-z0-9-]*[a-z0-9])?$/, {
      message:
        'Name must be lowercase alphanumeric, may contain hyphens, and must start and end with an alphanumeric character',
    })(target, propertyKey);
  };
}

@InputType()
export class CreateServiceInput {
  @IsServiceName()
  @Field(() => String)
  name!: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  description?: string;

  @IsString()
  @Field(() => ID)
  projectId!: string;
}
