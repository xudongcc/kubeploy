import { Migration } from '@mikro-orm/migrations';

export class Migration20251205094205 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "service" ("id" bigserial primary key, "name" varchar(255) not null, "image" varchar(255) not null, "replicas" int not null default 1, "ports" text[] not null default '{}', "environment_variables" jsonb not null default '[]', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "workspace_id" bigint not null, "project_id" bigint not null);`);

    this.addSql(`alter table "service" add constraint "service_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
    this.addSql(`alter table "service" add constraint "service_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "service" cascade;`);
  }

}
