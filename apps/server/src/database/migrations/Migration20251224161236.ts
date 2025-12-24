import { Migration } from '@mikro-orm/migrations';

export class Migration20251224161236 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "git_provider" ("id" bigserial primary key, "name" varchar(255) not null, "type" text check ("type" in ('GITHUB', 'GITLAB')) not null, "url" varchar(255) not null, "client_id" varchar(255) not null, "client_secret" varchar(255) not null, "workspace_id" bigint null, "created_at" timestamptz not null default now());`);

    this.addSql(`create table "git_provider_account" ("id" bigserial primary key, "provider_user_id" varchar(255) not null, "username" varchar(255) null, "access_token" text not null, "refresh_token" text null, "expires_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "workspace_id" bigint not null, "user_id" bigint not null, "provider_id" bigint not null);`);
    this.addSql(`alter table "git_provider_account" add constraint "git_provider_account_workspace_id_provider_id_pro_9f862_unique" unique ("workspace_id", "provider_id", "provider_user_id");`);

    this.addSql(`alter table "git_provider" add constraint "git_provider_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade on delete set null;`);

    this.addSql(`alter table "git_provider_account" add constraint "git_provider_account_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
    this.addSql(`alter table "git_provider_account" add constraint "git_provider_account_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;`);
    this.addSql(`alter table "git_provider_account" add constraint "git_provider_account_provider_id_foreign" foreign key ("provider_id") references "git_provider" ("id") on update cascade;`);

    this.addSql(`alter table "service" drop column "git_repository_git_provider_id", drop column "git_repository_owner", drop column "git_repository_repo", drop column "git_repository_branch", drop column "git_repository_path";`);

    this.addSql(`alter table "service" add column "git_source_account_id" bigint null, add column "git_source_owner" varchar(255) null, add column "git_source_repo" varchar(255) null, add column "git_source_branch" varchar(255) null, add column "git_source_path" varchar(255) null;`);
    this.addSql(`alter table "service" add constraint "service_git_source_account_id_foreign" foreign key ("git_source_account_id") references "git_provider_account" ("id") on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "git_provider_account" drop constraint "git_provider_account_provider_id_foreign";`);

    this.addSql(`alter table "service" drop constraint "service_git_source_account_id_foreign";`);

    this.addSql(`drop table if exists "git_provider" cascade;`);

    this.addSql(`drop table if exists "git_provider_account" cascade;`);

    this.addSql(`alter table "service" drop column "git_source_account_id", drop column "git_source_owner", drop column "git_source_repo", drop column "git_source_branch", drop column "git_source_path";`);

    this.addSql(`alter table "service" add column "git_repository_git_provider_id" int8 null, add column "git_repository_owner" varchar(255) null, add column "git_repository_repo" varchar(255) null, add column "git_repository_branch" varchar(255) null, add column "git_repository_path" varchar(255) null;`);
  }

}
