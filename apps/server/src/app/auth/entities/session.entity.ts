import { Entity } from '@mikro-orm/core';
import { BaseSession } from '@nest-boot/auth';

@Entity()
export class Session extends BaseSession {}
