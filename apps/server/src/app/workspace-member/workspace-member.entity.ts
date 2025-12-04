import { Opt } from '@mikro-orm/core';
import {
  Entity,
  Enum,
  FullTextType,
  Index,
  ManyToOne,
  PrimaryKey,
  Property,
  Ref,
  t,
  Unique,
} from '@mikro-orm/postgresql';
import { Field, HideField, ID, ObjectType } from '@nest-boot/graphql';
import { Sonyflake } from 'sonyflake-js';

import { SearchableProperty } from '@/common/decorators/searchable-property.decorator';
import { User } from '@/user/user.entity';
import { Workspace } from '@/workspace/workspace.entity';

import { WorkspaceMemberInviteStatus } from './enums/invite-status.enum';
import { WorkspaceMemberRole } from './enums/workspace-member-role.enum';
import { WorkspaceMemberPermission } from './workspace-member-permission.enum';

@ObjectType()
@Entity()
@Unique({ properties: ['user', 'workspace'] })
@Unique({ properties: ['inviteToken', 'workspace'] })
@Unique({ properties: ['email', 'workspace'] })
@Index({ properties: ['searchableName'], type: 'fulltext' })
export class WorkspaceMember {
  @Field(() => ID)
  @PrimaryKey({
    type: t.bigint,
  })
  id: string = Sonyflake.next().toString();

  @Field(() => String)
  @Property({ type: t.string })
  name!: string;

  // eslint-disable-next-line @nest-boot/entity-property-config-from-types
  @HideField()
  @SearchableProperty({
    type: FullTextType,
    properties: ['name'],
    nullable: true,
  })
  searchableName?: string;

  /** 成员邮箱 */
  @Field(() => String, { nullable: true })
  @Property({ type: t.string, nullable: true })
  email?: Opt<string> | null = null;

  @Field(() => WorkspaceMemberRole)
  @Enum({
    items: () => WorkspaceMemberRole,
    default: WorkspaceMemberRole.MEMBER,
  })
  role: Opt<WorkspaceMemberRole> = WorkspaceMemberRole.MEMBER;

  @Field(() => [WorkspaceMemberPermission])
  @Enum({
    array: true,
    items: () => WorkspaceMemberPermission,
    default: [],
  })
  permissions: Opt<WorkspaceMemberPermission[]> = [];

  /** 邀请者，删除时设置为 null */
  @ManyToOne(() => User, { nullable: true, deleteRule: 'set null' })
  invitedBy?: Ref<User>;

  /** 存储一个邀请者名称，以免 invitedBy 被删除后，丢失邀请者信息 */
  @Field(() => String, { nullable: true })
  @Property({ type: t.string, nullable: true })
  invitedByUserName?: Opt<string> | null = null;

  /** 邀请 token，用于邀请用户加入 workspace */
  @Field(() => String, { nullable: true })
  @Property({ type: t.text, nullable: true })
  inviteToken?: Opt<string> | null = null;

  /** 邀请状态 */
  @Field(() => WorkspaceMemberInviteStatus, { nullable: true })
  @Enum({
    items: () => WorkspaceMemberInviteStatus,
    nullable: true,
  })
  inviteStatus?: Opt<WorkspaceMemberInviteStatus> | null = null;

  /** 邀请过期时间 */
  @Field(() => Date, { nullable: true })
  @Property({ type: t.datetime, nullable: true })
  inviteExpiresAt?: Opt<Date> | null = null;

  @Field(() => Date)
  @Property({ type: t.datetime, defaultRaw: 'now()' })
  createdAt: Opt<Date> = new Date();

  @Field(() => Date)
  @Property({
    type: t.datetime,
    defaultRaw: 'now()',
    onUpdate: () => new Date(),
  })
  updatedAt: Opt<Date> = new Date();

  @ManyToOne({ updateRule: 'cascade', deleteRule: 'cascade', nullable: true })
  user?: Ref<User>;

  @ManyToOne({ updateRule: 'cascade', deleteRule: 'cascade' })
  workspace!: Ref<Workspace>;
}
