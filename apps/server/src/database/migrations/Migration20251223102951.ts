import { Migration } from '@mikro-orm/migrations';

export class Migration20251223102951 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "service" add column "health_check_type" text check ("health_check_type" in ('HTTP', 'TCP')) null, add column "health_check_path" varchar(255) null, add column "health_check_port" int null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "service" drop column "health_check_type", drop column "health_check_path", drop column "health_check_port";`);
  }

}
