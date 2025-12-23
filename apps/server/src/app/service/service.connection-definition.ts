import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { Service } from './service.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(Service)
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
export class ServiceConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class ServiceConnection extends Connection {}
