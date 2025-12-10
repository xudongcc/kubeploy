import { Migration } from '@mikro-orm/migrations';

export class Migration20251210122627 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "service" add column "resource_usage_cpu" int null, add column "resource_usage_memory" int null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "service" drop column "resource_usage_cpu", drop column "resource_usage_memory";`);
  }

}
