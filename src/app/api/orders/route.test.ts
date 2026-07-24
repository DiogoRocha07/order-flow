/**
 * @jest-environment node
 */

import { GET } from "@/app/api/orders/route";
import { getOrders } from "@/features/orders/server/order-store";
import type { Order } from "@/features/orders/types/order";

jest.mock("@/features/orders/server/order-store", () => ({
  getOrders: jest.fn(),
}));

const mockedGetOrders = jest.mocked(getOrders);

const orders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Ana Souza",
    total: 150,
    status: "pending",
    createdAt: "2026-07-01T10:00:00.000Z",
    itemCount: 2,
  },
  {
    id: "ORD-1002",
    customerName: "Bruno Lima",
    total: 300,
    status: "completed",
    createdAt: "2026-07-02T15:00:00.000Z",
    itemCount: 4,
  },
];

describe("GET /api/orders", () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    jest.resetAllMocks();

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("retorna a lista e o total de pedidos", async () => {
    mockedGetOrders.mockReturnValue(orders);

    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body).toEqual({
      success: true,
      data: {
        orders,
        total: 2,
      },
    });

    expect(mockedGetOrders).toHaveBeenCalledTimes(1);
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("retorna erro 500 quando não é possível buscar os pedidos", async () => {
    const error = new Error("Falha no armazenamento de pedidos.");

    mockedGetOrders.mockImplementation(() => {
      throw error;
    });

    const response = GET();
    const body = await response.json();

    expect(response.status).toBe(500);

    expect(body).toEqual({
      success: false,
      error: {
        code: "ORDERS_FETCH_FAILED",
        message: "Não foi possível carregar os pedidos",
      },
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to retrieve orders:",
      error,
    );
  });
});
