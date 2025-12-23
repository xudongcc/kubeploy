import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { WorkspaceMember } from './workspace-member.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(
  WorkspaceMember,
)
  .addField({
    type: 'string',
    field: 'name',
    replacement: 'searchableName',
    searchable: true,
    fulltext: true,
  })
  .addField({
    type: 'string',
    field: 'role',
    filterable: true,
  })
  .addField({
    type: 'string',
    field: 'email',
    replacement: 'user.email',
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
export class WorkspaceMemberConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class WorkspaceMemberConnection extends Connection {}
