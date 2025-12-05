import { Args, ID, Mutation, Query, Resolver } from '@nest-boot/graphql';
import { ConnectionManager } from '@nest-boot/graphql-connection';

import { CurrentWorkspace } from '@/common/decorators/current-workspace.decorator';
import { Can, PermissionAction } from '@/lib/permission';
import { Workspace } from '@/workspace/workspace.entity';

import { CreateProjectInput } from './inputs/create-project.input';
import { UpdateProjectInput } from './inputs/update-project.input';
import {
  ProjectConnection,
  ProjectConnectionArgs,
} from './project.connection-definition';
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

  @Can(PermissionAction.READ, Project)
  @Query(() => ProjectConnection)
  async projects(
    @CurrentWorkspace() workspace: Workspace,
    @Args() args: ProjectConnectionArgs,
  ) {
    return await this.cm.find(ProjectConnection, args, {
      where: { workspace },
    });
  }

  @Can(PermissionAction.CREATE, Project)
  @Mutation(() => Project)
  async createProject(
    @CurrentWorkspace() workspace: Workspace,
    @Args('input') input: CreateProjectInput,
  ): Promise<Project> {
    return await this.projectService.create({
      name: input.name,
      workspace,
    });
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
  async removeProject(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Project> {
    return await this.projectService.remove(id);
  }
}
