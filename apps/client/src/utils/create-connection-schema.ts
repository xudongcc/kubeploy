import { z } from "zod";
import type { EnumLike } from "zod";

import { OrderDirection } from "@/gql/graphql";

export interface CreateConnectionSchemaOptions<OrderField extends EnumLike> {
  pageSize: number;
  orderField: OrderField;
  defaultOrderField: OrderField[keyof OrderField];
  defaultOrderDirection: OrderDirection;
}

export function createConnectionSchema<OrderField extends EnumLike>(
  options: CreateConnectionSchemaOptions<OrderField>,
) {
  return z
    .object({
      first: z.number().int().positive().optional(),
      last: z.number().int().positive().optional(),
      after: z.string().optional(),
      before: z.string().optional(),
      query: z.string().optional(),
      orderBy: z
        .object({
          field: z
            .nativeEnum(options.orderField)
            .default(options.defaultOrderField),
          direction: z
            .nativeEnum(OrderDirection)
            .default(options.defaultOrderDirection),
        })
        .optional(),
    })
    .transform((data) => {
      const { first, last, after, before, ...rest } = data;

      if (first !== undefined || after !== undefined) {
        return {
          ...rest,
          first: first ?? options.pageSize,
          after,
        };
      }

      if (last !== undefined || before !== undefined) {
        return {
          ...rest,
          last: last ?? options.pageSize,
          before,
        };
      }

      return {
        ...rest,
        first: options.pageSize,
      };
    });
}
