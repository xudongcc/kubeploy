import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { WorkspaceMember } from './workspace-member.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(
  WorkspaceMember,
)
  .addField({
    field: 'name',
    replacement: 'searchableName',
    searchable: true,
    fulltext: true,
  })
  .addField({
    field: 'role',
    filterable: true,
  })
  .addField({
    field: 'email',
    replacement: 'user.email',
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
export class WorkspaceMemberConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class WorkspaceMemberConnection extends Connection {}
