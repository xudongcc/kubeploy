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

import { CreateVolumeInput } from './inputs/create-volume.input';
import { UpdateVolumeInput } from './inputs/update-volume.input';
import { Volume } from './volume.entity';
import { VolumeService } from './volume.service';

@Resolver(() => Volume)
export class VolumeResolver {
  constructor(
    private readonly volumeService: VolumeService,
    private readonly cm: ConnectionManager,
  ) {}

  @Can(PermissionAction.READ, Volume)
  @Query(() => Volume, { nullable: true })
  async volume(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Volume | null> {
    return await this.volumeService.findOne({ id });
  }

  @Can(PermissionAction.CREATE, Volume)
  @Mutation(() => Volume)
  async createVolume(@Args('input') input: CreateVolumeInput): Promise<Volume> {
    return await this.volumeService.createVolume({
      name: input.name,
      size: input.size,
      mountPath: input.mountPath,
      service: input.serviceId,
    });
  }

  @Can(PermissionAction.UPDATE, Volume)
  @Mutation(() => Volume)
  async updateVolume(
    @Args({ name: 'id', type: () => ID }) id: string,
    @Args('input') input: UpdateVolumeInput,
  ): Promise<Volume> {
    return await this.volumeService.update(id, input);
  }

  @Can(PermissionAction.DELETE, Volume)
  @Mutation(() => Volume)
  async removeVolume(
    @Args({ name: 'id', type: () => ID }) id: string,
  ): Promise<Volume> {
    return await this.volumeService.remove(id);
  }

  @Can(PermissionAction.READ, Service)
  @ResolveField(() => Service)
  async service(@Parent() volume: Volume) {
    return await volume.service.loadOrFail();
  }
}
