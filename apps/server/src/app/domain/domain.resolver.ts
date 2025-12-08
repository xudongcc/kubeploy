import {
  Args,
  ID,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nest-boot/graphql';
import { ConnectionManager } from '@nest-boot/graphql-connection';

import { Can, PermissionAction } from '@/lib/permission';
import { Service } from '@/service/service.entity';

import { Domain } from './domain.entity';
import { DomainService } from './domain.service';
import { CreateDomainInput } from './inputs/create-domain.input';
import { UpdateDomainInput } from './inputs/update-domain.input';

@Resolver(() => Domain)
export class DomainResolver {
  constructor(
    private readonly domainService: DomainService,
    private readonly cm: ConnectionManager,
  ) {}

  @Can(PermissionAction.READ, Domain)
  @Query(() => Domain, { nullable: true })
  async domain(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Domain | null> {
    return await this.domainService.findOne({ id });
  }

  @Can(PermissionAction.CREATE, Domain)
  @Mutation(() => Domain)
  async createDomain(@Args('input') input: CreateDomainInput): Promise<Domain> {
    return await this.domainService.createDomain({
      host: input.host,
      path: input.path ?? '/',
      servicePort: input.servicePort,
      service: input.serviceId,
    });
  }

  @Can(PermissionAction.UPDATE, Domain)
  @Mutation(() => Domain)
  async updateDomain(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('input') input: UpdateDomainInput,
  ): Promise<Domain> {
    return await this.domainService.update(id, input);
  }

  @Can(PermissionAction.DELETE, Domain)
  @Mutation(() => Domain)
  async deleteDomain(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Domain> {
    return await this.domainService.remove(id);
  }

  @Can(PermissionAction.READ, Service)
  @ResolveField(() => Service)
  async service(@Parent() domain: Domain) {
    return await domain.service.loadOrFail();
  }
}
