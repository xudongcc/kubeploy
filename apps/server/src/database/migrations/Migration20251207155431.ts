import { Migration } from '@mikro-orm/migrations';

export class Migration20251207155431 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table "volume" rename column "storage_class" to "mount_path";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table "volume" rename column "mount_path" to "storage_class";`);
  }

}
