import { EntityManager } from '@mikro-orm/core';
import { EntityService } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { GitProviderAccount } from '../entities/git-provider-account.entity';

@Injectable()
export class GitProviderAccountService extends EntityService<GitProviderAccount> {
  constructor(protected readonly em: EntityManager) {
    super(GitProviderAccount, em);
  }
}
