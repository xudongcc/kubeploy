import { EntityManager } from '@mikro-orm/postgresql';
import { EntityService } from '@nest-boot/mikro-orm';
import { Injectable } from '@nestjs/common';

import { WorkspaceService } from '@/workspace/workspace.service';

import { User } from './user.entity';

@Injectable()
export class UserService extends EntityService<User> {
  constructor(
    protected readonly em: EntityManager,
    private readonly workspaceService: WorkspaceService,
  ) {
    super(User, em);
  }
}
