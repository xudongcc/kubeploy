import { EntityManager } from '@mikro-orm/core';
import { EntityService } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { GitProviderAuthorization } from '../entities/git-provider-authorization.entity';

@Injectable()
export class GitProviderAuthorizationService extends EntityService<GitProviderAuthorization> {
  constructor(protected readonly em: EntityManager) {
    super(GitProviderAuthorization, em);
  }
}
