import {
  Entity,
  ManyToOne,
  Opt,
  PrimaryKey,
  Property,
  Ref,
  t,
  Unique,
} from '@mikro-orm/core';
import { Sonyflake } from 'sonyflake-js';

import { User } from '@/user/user.entity';
import { Workspace } from '@/workspace/workspace.entity';

import { GitProvider } from './git-provider.entity';

@Entity()
@Unique({ properties: ['workspace', 'provider', 'providerUserId'] })
export class GitProviderAccount {
  @PrimaryKey({ type: t.bigint })
  id: string = Sonyflake.next().toString();

  @Property({ type: t.string })
  providerUserId!: string;

  @Property({ type: t.string, nullable: true })
  username?: string;

  @Property({ type: t.text })
  accessToken!: string;

  @Property({ type: t.text, nullable: true })
  refreshToken?: string;

  @Property({ type: t.datetime, nullable: true })
  expiresAt?: Date;

  @Property({ type: t.datetime, defaultRaw: 'now()' })
  createdAt: Opt<Date> = new Date();

  @Property({
    type: t.datetime,
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt: Opt<Date> = new Date();

  @ManyToOne(() => Workspace)
  workspace!: Ref<Workspace>;

  @ManyToOne(() => User)
  user!: Ref<User>;

  @ManyToOne(() => GitProvider)
  provider!: Ref<GitProvider>;
}
