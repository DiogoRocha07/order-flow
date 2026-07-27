import type { Order } from "@/features/orders/types/order";
import { calculateOrderStats } from "@/features/orders/utils/calculate-order-stats";

function createOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "ORD-TEST",
    customerName: "Diogo Rocha Teste",
    total: 100,
    status: "pending",
    createdAt: "2026-07-17T10:00:00.000Z",
    itemCount: 1,
    ...overrides,
  };
}

describe("calculateOrdersStats", () => {
  it("Retorna estatísticas zeradas quando não existem pedidos", () => {
    const result = calculateOrderStats([]);

    expect(result).toEqual({
      totalOrders: 0,
      pendingOrders: 0,
      preparingOrders: 0,
      completedOrders: 0,
      totalValue: 0,
    });
  });

  it("Calcula a quantidade total e a quantidade por status", () => {
    const orders: Order[] = [
      createOrder({
        id: "ORD-1001",
        status: "pending",
      }),
      createOrder({
        id: "ORD-1002",
        status: "pending",
      }),
      createOrder({
        id: "ORD-1003",
        status: "preparing",
      }),
      createOrder({
        id: "ORD-1004",
        status: "completed",
      }),
      createOrder({
        id: "ORD-1005",
        status: "cancelled",
      }),
    ];

    const result = calculateOrderStats(orders);

    expect(result.totalOrders).toBe(5);
    expect(result.pendingOrders).toBe(2);
    expect(result.preparingOrders).toBe(1);
    expect(result.completedOrders).toBe(1);
  });

  it("não inclui pedidos cancelados no valor total", () => {
    const orders: Order[] = [
      createOrder({
        id: "ORD-1001",
        status: "pending",
        total: 100.1,
      }),
      createOrder({
        id: "ORD-1002",
        status: "preparing",
        total: 200.2,
      }),
      createOrder({
        id: "ORD-1003",
        status: "completed",
        total: 50,
      }),
      createOrder({
        id: "ORD-1004",
        status: "cancelled",
        total: 999.99,
      }),
    ];

    const result = calculateOrderStats(orders);

    expect(result.totalOrders).toBe(4);
    expect(result.totalValue).toBeCloseTo(350.3, 2);
  });
});
