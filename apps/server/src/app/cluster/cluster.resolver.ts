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

import { CurrentWorkspace } from '@/common/decorators/current-workspace.decorator';
import { Can, PermissionAction } from '@/lib/permission';
import {
  ProjectConnection,
  ProjectConnectionArgs,
} from '@/project/project.connection-definition';
import { Project } from '@/project/project.entity';
import { Workspace } from '@/workspace/workspace.entity';

import { Cluster } from './cluster.entity';
import { ClusterService } from './cluster.service';
import { CreateClusterInput } from './inputs/create-cluster.input';
import { UpdateClusterInput } from './inputs/update-cluster.input';
import { ClusterNode } from './objects/cluster-node.object';

@Resolver(() => Cluster)
export class ClusterResolver {
  constructor(
    private readonly clusterService: ClusterService,
    private readonly cm: ConnectionManager,
  ) {}

  @Can(PermissionAction.READ, Cluster)
  @Query(() => Cluster, { nullable: true })
  async cluster(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Cluster | null> {
    return await this.clusterService.findOne({ id });
  }

  @Can(PermissionAction.CREATE, Cluster)
  @Mutation(() => Cluster)
  async createCluster(
    @CurrentWorkspace() workspace: Workspace,
    @Args('input') input: CreateClusterInput,
  ): Promise<Cluster> {
    return await this.clusterService.createCluster({
      ...input,
      workspace,
    });
  }

  @Can(PermissionAction.UPDATE, Cluster)
  @Mutation(() => Cluster)
  async updateCluster(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('input') input: UpdateClusterInput,
  ): Promise<Cluster> {
    return await this.clusterService.update(id, input);
  }

  @Can(PermissionAction.DELETE, Cluster)
  @Mutation(() => Cluster)
  async deleteCluster(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Cluster> {
    return await this.clusterService.remove(id);
  }

  @Can(PermissionAction.READ, Cluster)
  @ResolveField(() => [ClusterNode])
  async nodes(@Parent() cluster: Cluster) {
    return await this.clusterService.getNodes(cluster);
  }

  @Can(PermissionAction.READ, Project)
  @ResolveField(() => ProjectConnection)
  async projects(
    @Parent() cluster: Cluster,
    @Args() args: ProjectConnectionArgs,
  ) {
    return await this.cm.find(ProjectConnection, args, {
      where: { cluster },
    });
  }
}
