import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { Workspace } from './workspace.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(Workspace)
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
export class WorkspaceConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class WorkspaceConnection extends Connection {}
