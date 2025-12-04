import { CurrentUser } from '@nest-boot/auth';
import { Query, Resolver } from '@nest-boot/graphql';

import { Can, PermissionAction } from '@/lib/permission';

import { User } from './user.entity';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  @Can(PermissionAction.READ, User)
  @Query(() => User)
  currentUser(@CurrentUser() user: User) {
    return user;
  }
}
