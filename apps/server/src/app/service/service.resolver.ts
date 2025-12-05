import { Args, ID, Mutation, Query, Resolver } from '@nest-boot/graphql';
import { ConnectionManager } from '@nest-boot/graphql-connection';

import { Can, PermissionAction } from '@/lib/permission';
import { ProjectService } from '@/project/project.service';

import { CreateServiceInput } from './inputs/create-service.input';
import { UpdateServiceInput } from './inputs/update-service.input';
import {
  ServiceConnection,
  ServiceConnectionArgs,
} from './service.connection-definition';
import { Service } from './service.entity';
import { ServiceService } from './service.service';

@Resolver(() => Service)
export class ServiceResolver {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly projectService: ProjectService,
    private readonly cm: ConnectionManager,
  ) {}

  @Can(PermissionAction.READ, Service)
  @Query(() => Service, { nullable: true })
  async service(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Service | null> {
    return await this.serviceService.findOne({ id });
  }

  @Can(PermissionAction.READ, Service)
  @Query(() => ServiceConnection)
  async services(
    @Args({ name: 'projectId', type: () => ID }) projectId: string,
    @Args() args: ServiceConnectionArgs,
  ) {
    return await this.cm.find(ServiceConnection, args, {
      where: { project: { id: projectId } },
    });
  }

  @Can(PermissionAction.CREATE, Service)
  @Mutation(() => Service)
  async createService(
    @Args('input') input: CreateServiceInput,
  ): Promise<Service> {
    return await this.serviceService.createService({
      name: input.name,
      image: input.image,
      replicas: input.replicas,
      ports: input.ports,
      environmentVariables: input.environmentVariables,
      project: input.projectId,
    });
  }

  @Can(PermissionAction.UPDATE, Service)
  @Mutation(() => Service)
  async updateService(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('input') input: UpdateServiceInput,
  ): Promise<Service> {
    return await this.serviceService.update(id, input);
  }

  @Can(PermissionAction.DELETE, Service)
  @Mutation(() => Service)
  async removeService(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Service> {
    return await this.serviceService.remove(id);
  }
}
