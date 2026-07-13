import { INITIAL_ORDERS } from "@/features/orders/data/orders";
import type { Order, OrderStatus } from "@/features/orders/types/order";

let orders: Order[] = INITIAL_ORDERS.map((order) => ({ ...order }));

function cloneOrder(order: Order): Order {
  return { ...order };
}

export function getOrders(): Order[] {
  return orders.map(cloneOrder);
}

export function findOrderById(id: string): Order | undefined {
  const order = orders.find((currentOrder) => currentOrder.id === id);

  return order ? cloneOrder(order) : undefined;
}

export function updateOrderStatus(
  id: string,
  status: OrderStatus,
): Order | undefined {
  const orderIndex = orders.findIndex((currentOrder) => currentOrder.id === id);

  if (orderIndex === -1) return undefined;

  const updatedOrder: Order = {
    ...orders[orderIndex],
    status,
  };

  orders = [
    ...orders.slice(0, orderIndex),
    updatedOrder,
    ...orders.slice(orderIndex + 1),
  ];

  return cloneOrder(updatedOrder);
}
