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

import {
  DomainConnection,
  DomainConnectionArgs,
} from '@/domain/domain.connection-definition';
import { Domain } from '@/domain/domain.entity';
import { Can, PermissionAction } from '@/lib/permission';
import { Project } from '@/project/project.entity';
import {
  VolumeConnection,
  VolumeConnectionArgs,
} from '@/volume/volume.connection-definition';
import { Volume } from '@/volume/volume.entity';

import { ServiceStatus } from './enums/service-status.enum';
import { CreateServiceInput } from './inputs/create-service.input';
import { UpdateServiceInput } from './inputs/update-service.input';
import { ServiceMetrics } from './objects/service-metrics.object';
import { Service } from './service.entity';
import { ServiceService } from './service.service';

@Resolver(() => Service)
export class ServiceResolver {
  constructor(
    private readonly serviceService: ServiceService,
    private readonly cm: ConnectionManager,
  ) {}

  @Can(PermissionAction.READ, Service)
  @Query(() => Service, { nullable: true })
  async service(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Service | null> {
    return await this.serviceService.findOne({ id });
  }

  @Can(PermissionAction.CREATE, Service)
  @Mutation(() => Service)
  async createService(
    @Args('input') input: CreateServiceInput,
  ): Promise<Service> {
    return await this.serviceService.createService({
      name: input.name,
      description: input.description,
      project: input.projectId,
    });
  }

  @Can(PermissionAction.UPDATE, Service)
  @Mutation(() => Service)
  async deployService(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Service> {
    return await this.serviceService.deploy(id);
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
  async deleteService(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Service> {
    return await this.serviceService.remove(id);
  }

  @Can(PermissionAction.READ, Project)
  @ResolveField(() => Project)
  async project(@Parent() service: Service) {
    return await service.project.loadOrFail();
  }

  @Can(PermissionAction.READ, Domain)
  @ResolveField(() => DomainConnection)
  async domains(
    @Parent() service: Service,
    @Args() args: DomainConnectionArgs,
  ) {
    return await this.cm.find(DomainConnection, args, {
      where: { service },
    });
  }

  @Can(PermissionAction.READ, Volume)
  @ResolveField(() => VolumeConnection)
  async volumes(
    @Parent() service: Service,
    @Args() args: VolumeConnectionArgs,
  ) {
    return await this.cm.find(VolumeConnection, args, {
      where: { service },
    });
  }

  @Can(PermissionAction.READ, Service)
  @ResolveField(() => ServiceStatus)
  async status(@Parent() service: Service) {
    return await this.serviceService.getStatus(service);
  }

  @Can(PermissionAction.READ, Service)
  @ResolveField(() => ServiceMetrics)
  async metrics(@Parent() service: Service) {
    return await this.serviceService.getMetrics(service);
  }
}
