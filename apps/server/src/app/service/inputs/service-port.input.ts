import { Field, InputType, Int } from '@nest-boot/graphql';
import { IsEnum, IsInt, IsPositive } from 'class-validator';

import { ServicePortProtocol } from '../enums/service-port-protocol.enum';

@InputType()
export class ServicePortInput {
  @IsInt()
  @IsPositive()
  @Field(() => Int)
  port!: number;

  @IsEnum(ServicePortProtocol)
  @Field(() => ServicePortProtocol)
  protocol!: ServicePortProtocol;
}
