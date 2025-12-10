import { Migration } from '@mikro-orm/migrations';

export class Migration20251210155420 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "service" drop column "resource_usage_cpu", drop column "resource_usage_memory";`);

    this.addSql(`alter table "service" add column "resource_limits_cpu" int null, add column "resource_limits_memory" int null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "service" drop column "resource_limits_cpu", drop column "resource_limits_memory";`);

    this.addSql(`alter table "service" add column "resource_usage_cpu" int4 null, add column "resource_usage_memory" int4 null;`);
  }

}
