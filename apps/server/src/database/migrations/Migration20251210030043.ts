import { Migration } from '@mikro-orm/migrations';

export class Migration20251210030043 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table "user" ("id" bigserial primary key, "email_verified" boolean not null default false, "image" text null, "name" varchar(255) not null, "email" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now());`);
    this.addSql(`alter table "user" add constraint "user_email_unique" unique ("email");`);
    this.addSql(`create index "user_created_at_index" on "user" ("created_at");`);

    this.addSql(`create table "session" ("id" uuid not null, "token" text not null, "user_id" bigint null, "expires_at" timestamptz not null, "ip_address" text null, "user_agent" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "session_pkey" primary key ("id"));`);
    this.addSql(`alter table "session" add constraint "session_token_unique" unique ("token");`);

    this.addSql(`create table "account" ("id" uuid not null, "account_id" text not null, "provider_id" text not null, "user_id" bigint null, "access_token" text null, "refresh_token" text null, "id_token" text null, "access_token_expires_at" timestamptz null, "refresh_token_expires_at" timestamptz null, "scope" text null, "password" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "account_pkey" primary key ("id"));`);

    this.addSql(`create table "verification" ("id" uuid not null, "identifier" text not null, "value" text not null, "expires_at" timestamptz not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), constraint "verification_pkey" primary key ("id"));`);

    this.addSql(`create table "workspace" ("id" bigserial primary key, "name" varchar(255) not null, "features" text[] not null default '{}', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null);`);
    this.addSql(`create index "workspace_deleted_at_index" on "workspace" ("deleted_at");`);
    this.addSql(`create index "workspace_created_at_index" on "workspace" ("created_at");`);

    this.addSql(`create table "cluster" ("id" bigserial primary key, "name" varchar(255) not null, "server" varchar(255) not null, "certificate_authority_data" text not null, "token" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "workspace_id" bigint not null);`);

    this.addSql(`create table "project" ("id" bigserial primary key, "name" varchar(255) not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "workspace_id" bigint not null, "cluster_id" bigint not null);`);

    this.addSql(`create table "service" ("id" bigserial primary key, "name" varchar(255) not null, "image_registry" varchar(255) null, "image_name" varchar(255) not null, "image_tag" varchar(255) null, "image_digest" varchar(255) null, "image_username" varchar(255) null, "image_password" varchar(255) null, "replicas" int not null default 1, "ports" text[] not null default '{}', "environment_variables" jsonb not null default '[]', "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "workspace_id" bigint not null, "project_id" bigint not null);`);
    this.addSql(`alter table "service" add constraint "service_project_id_name_unique" unique ("project_id", "name");`);

    this.addSql(`create table "volume" ("id" bigserial primary key, "name" varchar(255) not null, "size" int not null, "mount_path" varchar(255) null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "workspace_id" bigint not null, "service_id" bigint not null);`);
    this.addSql(`alter table "volume" add constraint "volume_service_id_name_unique" unique ("service_id", "name");`);

    this.addSql(`create table "domain" ("id" bigserial primary key, "host" varchar(255) not null, "path" varchar(255) not null default '/', "service_port" int not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "workspace_id" bigint not null, "service_id" bigint not null);`);

    this.addSql(`create table "workspace_member" ("id" bigserial primary key, "name" varchar(255) not null, "searchable_name" tsvector null, "email" varchar(255) null, "role" text check ("role" in ('OWNER', 'ADMIN', 'MEMBER')) not null default 'MEMBER', "permissions" text[] not null default '{}', "invited_by_id" bigint null, "invited_by_user_name" varchar(255) null, "invite_token" text null, "invite_status" text check ("invite_status" in ('PENDING', 'ACCEPTED', 'EXPIRED')) null, "invite_expires_at" timestamptz null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "user_id" bigint null, "workspace_id" bigint not null);`);
    this.addSql(`create index "workspace_member_searchable_name_index" on "public"."workspace_member" using gin("searchable_name");`);
    this.addSql(`alter table "workspace_member" add constraint "workspace_member_email_workspace_id_unique" unique ("email", "workspace_id");`);
    this.addSql(`alter table "workspace_member" add constraint "workspace_member_invite_token_workspace_id_unique" unique ("invite_token", "workspace_id");`);
    this.addSql(`alter table "workspace_member" add constraint "workspace_member_user_id_workspace_id_unique" unique ("user_id", "workspace_id");`);

    this.addSql(`alter table "session" add constraint "session_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`);

    this.addSql(`alter table "account" add constraint "account_user_id_foreign" foreign key ("user_id") references "user" ("id") on delete cascade;`);

    this.addSql(`alter table "cluster" add constraint "cluster_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);

    this.addSql(`alter table "project" add constraint "project_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
    this.addSql(`alter table "project" add constraint "project_cluster_id_foreign" foreign key ("cluster_id") references "cluster" ("id") on update cascade;`);

    this.addSql(`alter table "service" add constraint "service_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
    this.addSql(`alter table "service" add constraint "service_project_id_foreign" foreign key ("project_id") references "project" ("id") on update cascade;`);

    this.addSql(`alter table "volume" add constraint "volume_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
    this.addSql(`alter table "volume" add constraint "volume_service_id_foreign" foreign key ("service_id") references "service" ("id") on update cascade;`);

    this.addSql(`alter table "domain" add constraint "domain_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade;`);
    this.addSql(`alter table "domain" add constraint "domain_service_id_foreign" foreign key ("service_id") references "service" ("id") on update cascade;`);

    this.addSql(`alter table "workspace_member" add constraint "workspace_member_invited_by_id_foreign" foreign key ("invited_by_id") references "user" ("id") on update cascade on delete set null;`);
    this.addSql(`alter table "workspace_member" add constraint "workspace_member_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;`);
    this.addSql(`alter table "workspace_member" add constraint "workspace_member_workspace_id_foreign" foreign key ("workspace_id") references "workspace" ("id") on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "session" drop constraint "session_user_id_foreign";`);

    this.addSql(`alter table "account" drop constraint "account_user_id_foreign";`);

    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_invited_by_id_foreign";`);

    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_user_id_foreign";`);

    this.addSql(`alter table "cluster" drop constraint "cluster_workspace_id_foreign";`);

    this.addSql(`alter table "project" drop constraint "project_workspace_id_foreign";`);

    this.addSql(`alter table "service" drop constraint "service_workspace_id_foreign";`);

    this.addSql(`alter table "volume" drop constraint "volume_workspace_id_foreign";`);

    this.addSql(`alter table "domain" drop constraint "domain_workspace_id_foreign";`);

    this.addSql(`alter table "workspace_member" drop constraint "workspace_member_workspace_id_foreign";`);

    this.addSql(`alter table "project" drop constraint "project_cluster_id_foreign";`);

    this.addSql(`alter table "service" drop constraint "service_project_id_foreign";`);

    this.addSql(`alter table "volume" drop constraint "volume_service_id_foreign";`);

    this.addSql(`alter table "domain" drop constraint "domain_service_id_foreign";`);

    this.addSql(`drop table if exists "user" cascade;`);

    this.addSql(`drop table if exists "session" cascade;`);

    this.addSql(`drop table if exists "account" cascade;`);

    this.addSql(`drop table if exists "verification" cascade;`);

    this.addSql(`drop table if exists "workspace" cascade;`);

    this.addSql(`drop table if exists "cluster" cascade;`);

    this.addSql(`drop table if exists "project" cascade;`);

    this.addSql(`drop table if exists "service" cascade;`);

    this.addSql(`drop table if exists "volume" cascade;`);

    this.addSql(`drop table if exists "domain" cascade;`);

    this.addSql(`drop table if exists "workspace_member" cascade;`);
  }

}
