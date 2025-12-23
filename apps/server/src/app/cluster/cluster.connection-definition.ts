import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { Cluster } from './cluster.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(Cluster)
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
export class ClusterConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class ClusterConnection extends Connection {}
