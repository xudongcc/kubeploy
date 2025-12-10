import { Migration } from '@mikro-orm/migrations';

export class Migration20251210031343 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "service" alter column "image_name" type varchar(255) using ("image_name"::varchar(255));`);
    this.addSql(`alter table "service" alter column "image_name" drop not null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "service" alter column "image_name" type varchar(255) using ("image_name"::varchar(255));`);
    this.addSql(`alter table "service" alter column "image_name" set not null;`);
  }

}
