import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { Domain } from './domain.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(Domain)
  .addField({
    type: 'string',
    field: 'host',
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
export class DomainConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class DomainConnection extends Connection {}
