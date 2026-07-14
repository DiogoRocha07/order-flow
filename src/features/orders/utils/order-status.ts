import {
  ORDER_STATUSES,
  type OrderStatus,
} from "@/features/orders/types/order";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "Pendente",
  preparing: "Em preparação",
  completed: "Concluído",
  cancelled: "Cancelado",
};

export function isOrderStatus(value: unknown): value is OrderStatus {
  return (
    typeof value === "string" &&
    ORDER_STATUSES.some((status) => status === value)
  );
}

export function getOrderStatusLabel(status: OrderStatus): string {
  return ORDER_STATUS_LABELS[status];
}
