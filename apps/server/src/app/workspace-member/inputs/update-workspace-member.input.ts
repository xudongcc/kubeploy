import { Field, InputType } from '@nest-boot/graphql';
import {
  IsArray,
  IsEmail,
  IsIn,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

import { WorkspaceMemberRole } from '@/workspace-member/enums/workspace-member-role.enum';
import { WorkspaceMemberPermission } from '@/workspace-member/workspace-member-permission.enum';

@InputType()
export class UpdateWorkspaceMemberInput {
  @IsOptional()
  @IsString()
  @MaxLength(255)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: '邮箱格式不正确' })
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @IsIn([WorkspaceMemberRole.MEMBER, WorkspaceMemberRole.ADMIN], {
    message: '角色必须是管理员或者成员',
  })
  @Field(() => WorkspaceMemberRole, { nullable: true })
  role?: WorkspaceMemberRole;

  @IsOptional()
  @IsArray()
  @Field(() => [WorkspaceMemberPermission], { nullable: true })
  permissions?: WorkspaceMemberPermission[];
}
