import { Ref, RequiredEntityData } from '@mikro-orm/core';
import { IdEntity, IdOrEntity } from '@nest-boot/mikro-orm';

/**
 * 提取 Ref<T> 中的实体类型，并确保它满足 IdEntity 约束
 */
type ExtractRefEntity<T> = T extends Ref<infer U extends IdEntity> ? U : never;

/**
 * 判断类型是否为 Ref<T>
 */
type IsRef<T> = T extends Ref<IdEntity> ? true : false;

/**
 * 将 RequiredEntityData 中的 Ref<T> 属性转换为 IdOrEntity<T>
 * 用于简化 service.create() 方法的参数类型
 *
 * @example
 * // 原始 RequiredEntityData<Service> 中：
 * // project: Ref<Project> | RequiredEntityData<Project> | ...
 * //
 * // 使用 CreateEntityData<Service> 后：
 * // project: IdOrEntity<Project>
 */
export type CreateEntityData<Entity extends IdEntity> = {
  [K in keyof RequiredEntityData<Entity>]: IsRef<Entity[K]> extends true
    ? IdOrEntity<ExtractRefEntity<Entity[K]>>
    : RequiredEntityData<Entity>[K];
};
