import { Entity } from '@mikro-orm/core';
import { BaseVerification } from '@nest-boot/auth';

@Entity()
export class Verification extends BaseVerification {}
