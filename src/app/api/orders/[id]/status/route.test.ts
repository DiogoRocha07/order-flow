/**
 * @jest-environment node
 */

import { PATCH } from "@/app/api/orders/[id]/status/route";
import { updateOrderStatus } from "@/features/orders/server/order-store";
import type { Order } from "@/features/orders/types/order";

jest.mock("@/features/orders/server/order-store", () => ({
  updateOrderStatus: jest.fn(),
}));

const mockedUpdateOrderStatus = jest.mocked(updateOrderStatus);

const updatedOrder: Order = {
  id: "ORD-1001",
  customerName: "Ana Souza",
  total: 150,
  status: "completed",
  createdAt: "2026-07-01T00:00:00.000Z",
  itemCount: 2,
};

function createRequest(body: unknown): Request {
  return new Request("http://localhost/api/orders/ORD-1001/status", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

function createInvalidJsonRequest(): Request {
  return new Request("http://localhost/api/orders/ORD-1001/status", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: "{ status inválido",
  });
}

function createContext(id = "ORD-1001") {
  return {
    params: Promise.resolve({ id }),
  };
}

describe("PATCH /api/orders/[id]/status", () => {
  let consoleErrorSpy: jest.SpiedFunction<typeof console.error>;

  beforeEach(() => {
    jest.resetAllMocks();

    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("retorna erro 400 quando o corpo não contém um JSON válido", async () => {
    const response = await PATCH(createInvalidJsonRequest(), createContext());

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "O corpo da requisição não contém um JSON válido.",
      },
    });

    expect(mockedUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it.each([
    {
      description: "um objeto sem status",
      requestBody: {
        customerName: "Ana Souza",
      },
    },
    {
      description: "um valor nulo",
      requestBody: null,
    },
    {
      description: "um array",
      requestBody: [],
    },
    {
      description: "um valor primitivo",
      requestBody: "completed",
    },
  ])(
    "retorna erro 400 quando o corpo contém $description",
    async ({ requestBody }) => {
      const response = await PATCH(createRequest(requestBody), createContext());

      const body = await response.json();

      expect(response.status).toBe(400);

      expect(body).toEqual({
        success: false,
        error: {
          code: "INVALID_BODY",
          message: "O campo status é obrigatório.",
        },
      });

      expect(mockedUpdateOrderStatus).not.toHaveBeenCalled();
    },
  );

  it("retorna erro 400 quando o status é inválido", async () => {
    const response = await PATCH(
      createRequest({ status: "shipped" }),
      createContext(),
    );

    const body = await response.json();

    expect(response.status).toBe(400);

    expect(body).toEqual({
      success: false,
      error: {
        code: "INVALID_STATUS",
        message: "O status informado não é válido.",
      },
    });

    expect(mockedUpdateOrderStatus).not.toHaveBeenCalled();
  });

  it("retorna erro 404 quando o pedido não existe", async () => {
    mockedUpdateOrderStatus.mockReturnValue(undefined);

    const response = await PATCH(
      createRequest({
        status: "completed",
      }),
      createContext("ORD-404"),
    );

    const body = await response.json();

    expect(response.status).toBe(404);

    expect(body).toEqual({
      success: false,
      error: {
        code: "ORDER_NOT_FOUND",
        message: "Pedido não encontrado",
      },
    });

    expect(mockedUpdateOrderStatus).toHaveBeenCalledTimes(1);

    expect(mockedUpdateOrderStatus).toHaveBeenCalledWith(
      "ORD-404",
      "completed",
    );
  });

  it("atualiza o status e retorna o pedido atualizado", async () => {
    mockedUpdateOrderStatus.mockReturnValue(updatedOrder);

    const response = await PATCH(
      createRequest({
        status: "completed",
      }),
      createContext(),
    );

    const body = await response.json();

    expect(response.status).toBe(200);

    expect(body).toEqual({
      success: true,
      data: updatedOrder,
    });

    expect(mockedUpdateOrderStatus).toHaveBeenCalledTimes(1);

    expect(mockedUpdateOrderStatus).toHaveBeenCalledWith(
      "ORD-1001",
      "completed",
    );

    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it("retorna erro 500 quando ocorre uma falha inesperada", async () => {
    const error = new Error("Falha no armazenamento de pedidos.");

    mockedUpdateOrderStatus.mockImplementation(() => {
      throw error;
    });

    const response = await PATCH(
      createRequest({
        status: "completed",
      }),
      createContext(),
    );

    const body = await response.json();

    expect(response.status).toBe(500);

    expect(body).toEqual({
      success: false,
      error: {
        code: "ORDER_UPDATE_FAILED",
        message: "Não foi possível atualizar o status do pedido.",
      },
    });

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Failed to update order status:",
      error,
    );
  });
});
