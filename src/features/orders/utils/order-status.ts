import {
  ORDER_STATUSES,
  type OrderStatus,
} from "@/features/orders/types/order";

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    ORDER_STATUSES.some((status) => status === value)
  );
}
