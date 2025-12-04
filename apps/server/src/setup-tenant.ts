import { EntityManager } from '@mikro-orm/postgresql';
import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  app.enableShutdownHooks();

  const logger = app.get(Logger);

  const knex = app.get(EntityManager).fork().getKnex();

  logger.log('Creating authenticated role...');
  await knex.raw(/* SQL */ `
    DO $$
    BEGIN
      IF NOT EXISTS (
          SELECT 1 FROM pg_roles
          WHERE rolname = 'authenticated'
      ) THEN
          CREATE ROLE authenticated NOLOGIN;
      END IF;
    END
    $$;
  `);

  logger.log('Creating anonymous role...');
  await knex.raw(/* SQL */ `
    DO $$
    BEGIN
      IF NOT EXISTS (
          SELECT 1 FROM pg_roles
          WHERE rolname = 'anonymous'
      ) THEN
          CREATE ROLE anonymous NOLOGIN;
      END IF;
    END
    $$;
  `);

  logger.log('Granting privileges to authenticated role...');
  await knex.raw(/* SQL */ `
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO authenticated;
  `);
  await knex.raw(/* SQL */ `
    GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
  `);

  logger.log('Granting privileges to anonymous role...');
  await knex.raw(/* SQL */ `
    ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anonymous;
  `);
  await knex.raw(/* SQL */ `
    GRANT ALL ON ALL TABLES IN SCHEMA public TO anonymous;
  `);

  logger.log('Creating extensions schema...');
  await knex.raw(/* SQL */ `
    CREATE SCHEMA IF NOT EXISTS extensions;
  `);

  logger.log('Granting usage on extensions schema...');
  await knex.raw(/* SQL */ `
    GRANT USAGE ON SCHEMA extensions TO authenticated;
  `);
  await knex.raw(/* SQL */ `
    GRANT USAGE ON SCHEMA extensions TO anonymous;
  `);

  logger.log('Creating get_user_id function...');
  await knex.raw(/* SQL */ `
    CREATE OR REPLACE FUNCTION get_user_id() RETURNS bigint AS $$
    DECLARE
      user_id text;
    BEGIN
      user_id := current_setting('auth.user_id', true);
      IF user_id IS NULL OR user_id = '' THEN
        RETURN NULL;
      END IF;
      RETURN user_id::bigint;
    END;
    $$ LANGUAGE plpgsql;
  `);

  logger.log('Creating get_workspace_id function...');
  await knex.raw(/* SQL */ `
    CREATE OR REPLACE FUNCTION get_workspace_id() RETURNS bigint AS $$
    DECLARE
      workspace_id text;
    BEGIN
      workspace_id := current_setting('auth.workspace_id', true);
      IF workspace_id IS NULL OR workspace_id = '' THEN
        RETURN NULL;
      END IF;
      RETURN workspace_id::bigint;
    END;
    $$ LANGUAGE plpgsql;
  `);

  logger.log('Enabling RLS for tables with workspace_id column...');
  await knex.raw(/* SQL */ `
    DO $$
    DECLARE
        rec RECORD;
    BEGIN
        FOR rec IN
            SELECT table_schema, table_name
            FROM information_schema.columns
            WHERE column_name = 'workspace_id'
              AND table_schema = 'public'
        LOOP
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY;', rec.table_schema, rec.table_name);

            EXECUTE format('DROP POLICY IF EXISTS workspace_based_access_policy ON %I.%I;', rec.table_schema, rec.table_name);

            EXECUTE format(
                    'CREATE POLICY workspace_based_access_policy ON %I.%I AS PERMISSIVE FOR ALL TO authenticated USING ((SELECT get_workspace_id()) = workspace_id) WITH CHECK ((SELECT get_workspace_id()) = workspace_id);',
                    rec.table_schema, rec.table_name);
        END LOOP;
    END
    $$;
  `);

  logger.log('Enabling RLS for tables with user_id column...');
  await knex.raw(/* SQL */ `
    DO $$
    DECLARE
        rec RECORD;
    BEGIN
        FOR rec IN
            SELECT table_schema, table_name
            FROM information_schema.columns
            WHERE column_name = 'user_id'
              AND table_schema = 'public'
        LOOP
            EXECUTE format('ALTER TABLE %I.%I ENABLE ROW LEVEL SECURITY;', rec.table_schema, rec.table_name);

            EXECUTE format('DROP POLICY IF EXISTS user_based_access_policy ON %I.%I;', rec.table_schema, rec.table_name);

            EXECUTE format(
                    'CREATE POLICY user_based_access_policy ON %I.%I AS PERMISSIVE FOR ALL TO authenticated USING ((SELECT get_user_id()) = user_id) WITH CHECK ((SELECT get_user_id()) = user_id);',
                    rec.table_schema, rec.table_name);
        END LOOP;
    END
    $$;
  `);

  logger.log('Creating workspace_member invite access policy...');
  await knex.raw(/* SQL */ `
    DO $$
    BEGIN
        EXECUTE 'DROP POLICY IF EXISTS workspace_member_invite_access_policy ON public.workspace_member;';

        EXECUTE 'CREATE POLICY workspace_member_invite_access_policy ON public.workspace_member AS PERMISSIVE FOR ALL TO authenticated USING (
            get_workspace_id() = workspace_id OR user_id IS NULL
        ) WITH CHECK (
            get_workspace_id() = workspace_id AND (user_id IS NULL OR get_user_id() = user_id)
        );';
    END
    $$;
  `);

  logger.log('Tenant setup completed successfully!');

  await app.close();
}

void bootstrap();
