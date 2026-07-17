import type { Order, OrderFiltersState } from "@/features/orders/types/order";
import { filterOrders } from "@/features/orders/utils/filter-orders";

function createOrder(overrides: Partial<Order> = {}): Order {
  return {
    id: "ORD-TEST",
    customerName: "Diogo Rocha Teste",
    total: 100,
    status: "pending",
    createdAt: "2026-07-01T10:00:00.000Z",
    itemCount: 1,
    ...overrides,
  };
}

function createFilters(
  overrides: Partial<OrderFiltersState> = {},
): OrderFiltersState {
  return {
    customerName: "",
    status: "all",
    startDate: "",
    endDate: "",
    ...overrides,
  };
}

const orders: Order[] = [
  createOrder({
    id: "ORD-1001",
    customerName: "Ana Souza",
    status: "pending",
    createdAt: "2026-07-01T10:00:00.000Z",
  }),
  createOrder({
    id: "ORD-1002",
    customerName: "Bruno Lima",
    status: "preparing",
    createdAt: "2026-07-05T14:30:00.000Z",
  }),
  createOrder({
    id: "ORD-1003",
    customerName: "Carla Mendes",
    status: "completed",
    createdAt: "2026-07-10T18:45:00.000Z",
  }),
  createOrder({
    id: "ORD-1004",
    customerName: "Ana Oliveira",
    status: "cancelled",
    createdAt: "2026-07-15T09:15:00.000Z",
  }),
];

describe("filterOrders", () => {
  it("retorna todos os pedidos quando não existem filtros ativos", () => {
    const result = filterOrders(orders, createFilters());

    expect(result).toEqual(orders);
    expect(result).toHaveLength(4);
  });

  it("filtra pelo nome do cliente ignorando maiúsculas, minúsculas e espaços", () => {
    const result = filterOrders(
      orders,
      createFilters({
        customerName: "     aNa     ",
      }),
    );

    expect(result.map((order) => order.id)).toEqual(["ORD-1001", "ORD-1004"]);
  });

  it("filtra os pedidos pelo status selecionado", () => {
    const result = filterOrders(
      orders,
      createFilters({
        status: "preparing",
      }),
    );

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      id: "ORD-1002",
      status: "preparing",
    });
  });

  it("inclui pedidos criados exatamente nas datas inicial", () => {
    const result = filterOrders(
      orders,
      createFilters({
        endDate: "2026-07-10",
      }),
    );

    expect(result.map((order) => order.id)).toEqual([
      "ORD-1001",
      "ORD-1002",
      "ORD-1003",
    ]);
  });

  it("inclui pedidos dentro do período", () => {
    const result = filterOrders(
      orders,
      createFilters({
        endDate: "2026-07-10",
      }),
    );

    expect(result.map((order) => order.id)).toEqual([
      "ORD-1001",
      "ORD-1002",
      "ORD-1003",
    ]);
  });

  it("filtra pedidos dentro do período", () => {
    const result = filterOrders(
      orders,
      createFilters({
        startDate: "2026-07-05",
        endDate: "2026-07-10",
      }),
    );

    expect(result.map((order) => order.id)).toEqual(["ORD-1002", "ORD-1003"]);
  });

  it("combina os filtros de cliente, status e período", () => {
    const result = filterOrders(
      orders,
      createFilters({
        customerName: "Ana",
        status: "pending",
        startDate: "2026-07-01",
        endDate: "2026-07-10",
      }),
    );

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("ORD-1001");
  });

  it("retorna uma lista vazia quando nenhum pedido atendo aos filtros", () => {
    const result = filterOrders(
      orders,
      createFilters({
        customerName: "Cliente inexistente",
      }),
    );

    expect(result).toEqual([]);
  });
});
