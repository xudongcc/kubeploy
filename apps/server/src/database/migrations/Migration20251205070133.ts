import { Migration } from '@mikro-orm/migrations';

export class Migration20251205070133 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "project" ("id" bigserial primary key, "name" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "workspace_id" bigint not null);`);

    this.addSql(`alter table "project" add constraint "project_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "project" cascade;`);
  }

}
