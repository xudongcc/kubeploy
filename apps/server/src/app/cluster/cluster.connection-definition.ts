import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { Cluster } from './cluster.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(Cluster)
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
export class ClusterConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class ClusterConnection extends Connection {}
