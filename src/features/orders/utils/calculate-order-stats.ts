import type { Order, OrderStats } from "@/features/orders/types/order";

export function calculateOrderStats(orders: readonly Order[]): OrderStats {
  return orders.reduce<OrderStats>(
    (stats, order) => {
      stats.totalOrders += 1;

      if (order.status === "pending") stats.pendingOrders += 1;

      if (order.status === "preparing") stats.preparingOrders += 1;

      if (order.status === "completed") stats.completedOrders += 1;

      if (order.status !== "cancelled") stats.totalValue += order.total;

      return stats;
    },
    {
      totalOrders: 0,
      pendingOrders: 0,
      preparingOrders: 0,
      completedOrders: 0,
      totalValue: 0,
    },
  );
}
