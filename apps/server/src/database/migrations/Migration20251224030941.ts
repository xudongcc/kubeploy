import { Migration } from '@mikro-orm/migrations';

export class Migration20251224030941 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "git_provider" ("id" bigserial primary key, "name" varchar(255) not null, "type" text check ("type" in ('GITHUB', 'GITLAB')) not null, "url" varchar(255) not null, "client_id" varchar(255) not null, "client_secret" varchar(255) not null, "workspace_id" bigint null, "created_at" timestamptz not null default now());`);
    this.addSql(`alter table "git_provider" add constraint "git_provider_name_workspace_id_unique" unique ("name", "workspace_id");`);

    this.addSql(`alter table "git_provider" add constraint "git_provider_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "service" add column "git_repository_git_provider_id" bigint null, add column "git_repository_account_id" varchar(255) null, add column "git_repository_owner" varchar(255) null, add column "git_repository_repo" varchar(255) null, add column "git_repository_branch" varchar(255) null, add column "git_repository_path" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "git_provider" cascade;`);

    this.addSql(`alter table "service" drop column "git_repository_git_provider_id", drop column "git_repository_account_id", drop column "git_repository_owner", drop column "git_repository_repo", drop column "git_repository_branch", drop column "git_repository_path";`);
  }

}
