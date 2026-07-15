import type { OrderStatus } from "@/features/orders/types/order";
import { getOrderStatusLabel } from "@/features/orders/utils/order-status";

type StatusBadgeProps = {
  status: OrderStatus;
};

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: "bg-amber-100 text-amber-800",
  preparing: "bg-blue-100 text-blue-800",
  completed: "bg-emerald-100 text-emerald-800",
  cancelled: "bg-red-100 text-red-800",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[status]}`}
    >
      {getOrderStatusLabel(status)}
    </span>
  );
}
