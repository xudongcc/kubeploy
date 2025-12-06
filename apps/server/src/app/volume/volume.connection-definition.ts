import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { Volume } from './volume.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(Volume)
  .addField({
    field: 'name',
    searchable: true,
  })
  .addField({
    field: 'created_at',
    replacement: 'createdAt',
    filterable: true,
    sortable: true,
  })
  .build();

@ArgsType()
export class VolumeConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class VolumeConnection extends Connection {}
