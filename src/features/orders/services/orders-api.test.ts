import {
  fetchOrders,
  fetchOrdersStats,
  updateOrderStatus,
} from "@/features/orders/services/orders-api";
import type {
  Order,
  OrderStats,
  OrdersListData,
} from "@/features/orders/types/order";

const orders: Order[] = [
  {
    id: "ORD-1001",
    customerName: "Ana Souza",
    total: 150,
    status: "pending",
    createdAt: "2026-07-01T10:00:00.000Z",
    itemCount: 2,
  },
];

const ordersData: OrdersListData = {
  orders,
  total: orders.length,
};

const stats: OrderStats = {
  totalOrders: 1,
  pendingOrders: 1,
  preparingOrders: 0,
  completedOrders: 0,
  totalValue: 150,
};

const updatedOrder: Order = {
  ...orders[0],
  status: "completed",
};

const fetchMock = jest.fn();

function createJsonResponse(payload: unknown, ok = true): Response {
  return {
    ok,
    json: jest.fn().mockResolvedValue(payload),
  } as unknown as Response;
}

function createInvalidJsonResponse(): Response {
  return {
    ok: true,
    json: jest.fn().mockRejectedValue(new SyntaxError("Unexpected token")),
  } as unknown as Response;
}

describe("orders-api", () => {
  const originalFetch = global.fetch;

  beforeAll(() => {
    global.fetch = fetchMock as unknown as typeof fetch;
  });

  beforeEach(() => {
    fetchMock.mockReset();
  });

  afterAll(() => {
    global.fetch = originalFetch;
  });

  it("busca a lista de pedidos sem utilizar cache", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({ success: true, data: ordersData }),
    );

    const result = await fetchOrders();

    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledWith("/api/orders", {
      cache: "no-store",
    });

    expect(result).toEqual(ordersData);
  });

  it("busca as estatísticas dos pedidos sem utilizar cache", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({ success: true, data: stats }),
    );

    const result = await fetchOrdersStats();

    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledWith("/api/orders/stats", {
      cache: "no-store",
    });

    expect(result).toEqual(stats);
  });

  it("envia a atualização de status com método, headers e body corretos", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse({
        success: true,
        data: updatedOrder,
      }),
    );

    const result = await updateOrderStatus("ORD 1001/A", "completed");

    expect(fetchMock).toHaveBeenCalledTimes(1);

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/orders/ORD%201001%2FA/status",
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "completed",
        }),
      },
    );

    expect(result).toEqual(updatedOrder);
  });

  it("utiliza a mensagem de erro retornada pelo BFF", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          success: false,
          error: {
            code: "ORDER_NOT_FOUND",
            message: "Pedido não encontrado.",
          },
        },
        false,
      ),
    );

    await expect(updateOrderStatus("ORD-404", "completed")).rejects.toThrow(
      "Pedido não encontrado.",
    );
  });

  it("lança um erro quando o servidor retornar um JSON inválido", async () => {
    fetchMock.mockResolvedValue(createInvalidJsonResponse());

    await expect(fetchOrders()).rejects.toThrow(
      "O servidor retornou uma resposta inválida.",
    );
  });

  it("lança um erro genérico quando a resposta HTTP não é bem-sucedida", async () => {
    fetchMock.mockResolvedValue(
      createJsonResponse(
        {
          success: true,
          data: ordersData,
        },
        false,
      ),
    );

    await expect(fetchOrders()).rejects.toThrow(
      "Não foi possível concluir a solicitação.",
    );
  });
});
