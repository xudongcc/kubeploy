import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { Volume } from './volume.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(Volume)
  .addField({
    type: 'string',
    field: 'name',
    filterable: true,
    searchable: true,
  })
  .addField({
    type: 'date',
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
