import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { Domain } from './domain.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(Domain)
  .addField({
    field: 'host',
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
export class DomainConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class DomainConnection extends Connection {}
