import { ArgsType, ObjectType } from '@nest-boot/graphql';
import { ConnectionBuilder } from '@nest-boot/graphql-connection';

import { Project } from './project.entity';

export const { Connection, ConnectionArgs } = new ConnectionBuilder(Project)
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
export class ProjectConnectionArgs extends ConnectionArgs {}

@ObjectType()
export class ProjectConnection extends Connection {}
