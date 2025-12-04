import { Entity } from '@mikro-orm/core';
import { BaseAccount } from '@nest-boot/auth';

@Entity()
export class Account extends BaseAccount {}
