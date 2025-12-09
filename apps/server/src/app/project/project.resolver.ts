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

import { Cluster } from '@/cluster/cluster.entity';
import { Can, PermissionAction } from '@/lib/permission';
import {
  ServiceConnection,
  ServiceConnectionArgs,
} from '@/service/service.connection-definition';
import { Service } from '@/service/service.entity';

import { CreateProjectInput } from './inputs/create-project.input';
import { UpdateProjectInput } from './inputs/update-project.input';
import { Project } from './project.entity';
import { ProjectService } from './project.service';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(
    private readonly projectService: ProjectService,
    private readonly cm: ConnectionManager,
  ) {}

  @Can(PermissionAction.READ, Project)
  @Query(() => Project, { nullable: true })
  async project(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Project | null> {
    return await this.projectService.findOne({ id });
  }

  @Can(PermissionAction.CREATE, Project)
  @Mutation(() => Project)
  async createProject(
    @Args('input') input: CreateProjectInput,
  ): Promise<Project> {
    return await this.projectService.createProject(input);
  }

  @Can(PermissionAction.UPDATE, Project)
  @Mutation(() => Project)
  async updateProject(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('input') input: UpdateProjectInput,
  ): Promise<Project> {
    return await this.projectService.update(id, input);
  }

  @Can(PermissionAction.DELETE, Project)
  @Mutation(() => Project)
  async deleteProject(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Project> {
    return await this.projectService.remove(id);
  }

  @Can(PermissionAction.READ, Cluster)
  @ResolveField(() => Cluster)
  async cluster(@Parent() project: Project) {
    return await project.cluster.loadOrFail();
  }

  @Can(PermissionAction.READ, Service)
  @ResolveField(() => ServiceConnection)
  async services(
    @Parent() project: Project,
    @Args() args: ServiceConnectionArgs,
  ) {
    return await this.cm.find(ServiceConnection, args, {
      where: { project },
    });
  }
}
