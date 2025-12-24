import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { GitProvider } from './git-provider.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(GitProvider)
  .addField({
    type: 'string',
    field: 'name',
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
export class GitProviderConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class GitProviderConnection extends Connection {}
