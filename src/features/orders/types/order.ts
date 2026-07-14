export const ORDER_STATUSES = [
  "pending",
  "preparing",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export type Order = {
  id: string;
  customerName: string;
  total: number;
  status: OrderStatus;
  createdAt: string;
  itemCount: number;
};

export type OrderStats = {
  totalOrders: number;
  pendingOrders: number;
  preparingOrders: number;
  completedOrders: number;
  totalValue: number;
};

export type OrdersListData = {
  orders: Order[];
  total: number;
};
