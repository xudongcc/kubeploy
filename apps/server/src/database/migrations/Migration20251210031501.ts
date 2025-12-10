import { Migration } from '@mikro-orm/migrations';

export class Migration20251210031501 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "service" add column "description" varchar(255) null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "service" drop column "description";`);
  }

}
