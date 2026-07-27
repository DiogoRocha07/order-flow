import { act, renderHook } from "@testing-library/react";

import { useUpdateOrderStatus } from "@/features/orders/hooks/use-update-order-status";
import { updateOrderStatus } from "@/features/orders/services/orders-api";
import type { Order } from "@/features/orders/types/order";

jest.mock("@/features/orders/services/orders-api", () => ({
  updateOrderStatus: jest.fn(),
}));

const mockedUpdateOrderStatus = jest.mocked(updateOrderStatus);

const updatedOrder: Order = {
  id: "ORD-1001",
  customerName: "Ana Souza",
  total: 150,
  status: "completed",
  createdAt: "2026-07-01T10:00:00.000Z",
  itemCount: 2,
};

function createDeferred<T>() {
  let resolve!: (value: T) => void;

  const promise = new Promise<T>((promiseResolve) => {
    resolve = promiseResolve;
  });

  return {
    promise,
    resolve,
  };
}

describe("useUpdateOrderStatus", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("inicia sem pedido em atualização e sem mensagens de feedback", () => {
    const onUpdated = jest.fn(async (): Promise<void> => {});

    const { result } = renderHook(() => useUpdateOrderStatus({ onUpdated }));

    expect(result.current.updatingOrderId).toBeNull();
    expect(result.current.updateError).toBeNull();
    expect(result.current.successMessage).toBeNull();

    expect(result.current.clearFeedback).toEqual(expect.any(Function));
  });

  it("atualiza o status, recarrega os dados e exibe uma mensagem de sucesso", async () => {
    const requestDeferred = createDeferred<Order>();
    const onUpdated = jest.fn(async (): Promise<void> => {});

    mockedUpdateOrderStatus.mockReturnValue(requestDeferred.promise);

    const { result } = renderHook(() => useUpdateOrderStatus({ onUpdated }));

    let updatePromise!: Promise<void>;

    act(() => {
      updatePromise = result.current.updateStatus("ORD-1001", "completed");
    });

    expect(result.current.updatingOrderId).toBe("ORD-1001");

    expect(result.current.updateError).toBeNull();
    expect(result.current.successMessage).toBeNull();

    expect(mockedUpdateOrderStatus).toHaveBeenCalledWith(
      "ORD-1001",
      "completed",
    );

    await act(async () => {
      requestDeferred.resolve(updatedOrder);
      await updatePromise;
    });

    expect(onUpdated).toHaveBeenCalledTimes(1);

    expect(result.current.updatingOrderId).toBeNull();
    expect(result.current.updateError).toBeNull();

    expect(result.current.successMessage).toBe(
      "Status do pedido ORD-1001 atualizado para Concluído.",
    );
  });

  it("exibe a mensagem de erro quando a atualização falha", async () => {
    const onUpdated = jest.fn(async (): Promise<void> => {});

    mockedUpdateOrderStatus.mockRejectedValue(
      new Error("Não foi possível atualizar o pedido."),
    );

    const { result } = renderHook(() => useUpdateOrderStatus({ onUpdated }));

    await act(async () => {
      await result.current.updateStatus("ORD-1001", "completed");
    });

    expect(mockedUpdateOrderStatus).toHaveBeenCalledWith(
      "ORD-1001",
      "completed",
    );

    expect(onUpdated).not.toHaveBeenCalled();

    expect(result.current.updatingOrderId).toBeNull();
    expect(result.current.updateError).toBe(
      "Não foi possível atualizar o pedido.",
    );
    expect(result.current.successMessage).toBeNull();
  });

  it("utiliza uma mensagem padrão quando ocorre um erro desconhecido", async () => {
    const onUpdated = jest.fn(async (): Promise<void> => {});

    mockedUpdateOrderStatus.mockRejectedValue("falha desconhecida");

    const { result } = renderHook(() => useUpdateOrderStatus({ onUpdated }));

    await act(async () => {
      await result.current.updateStatus("ORD-1001", "preparing");
    });

    expect(result.current.updatingOrderId).toBeNull();

    expect(result.current.updateError).toBe(
      "Ocorreu um erro inesperado durante a atualização.",
    );

    expect(result.current.successMessage).toBeNull();
    expect(onUpdated).not.toHaveBeenCalled();
  });

  it("exibe um erro quando o recarregamento dos dados falha", async () => {
    mockedUpdateOrderStatus.mockResolvedValue(updatedOrder);

    const onUpdated = jest.fn(async (): Promise<void> => {
      throw new Error("Não foi possível recarregar os pedidos.");
    });

    const { result } = renderHook(() => useUpdateOrderStatus({ onUpdated }));

    await act(async () => {
      await result.current.updateStatus("ORD-1001", "completed");
    });

    expect(mockedUpdateOrderStatus).toHaveBeenCalledTimes(1);
    expect(onUpdated).toHaveBeenCalledTimes(1);

    expect(result.current.updatingOrderId).toBeNull();

    expect(result.current.updateError).toBe(
      "Não foi possível recarregar os pedidos.",
    );

    expect(result.current.successMessage).toBeNull();
  });

  it("limpa a mensagem de erro", async () => {
    const onUpdated = jest.fn(async (): Promise<void> => {});

    mockedUpdateOrderStatus.mockRejectedValue(new Error("Falha ao atualizar."));

    const { result } = renderHook(() => useUpdateOrderStatus({ onUpdated }));

    await act(async () => {
      await result.current.updateStatus("ORD-1001", "completed");
    });

    expect(result.current.updateError).toBe("Falha ao atualizar.");

    act(() => {
      result.current.clearFeedback();
    });

    expect(result.current.updateError).toBeNull();
    expect(result.current.successMessage).toBeNull();
  });

  it("limpa a mensagem de sucesso", async () => {
    const onUpdated = jest.fn(async (): Promise<void> => {});

    mockedUpdateOrderStatus.mockResolvedValue(updatedOrder);

    const { result } = renderHook(() => useUpdateOrderStatus({ onUpdated }));

    await act(async () => {
      await result.current.updateStatus("ORD-1001", "completed");
    });

    expect(result.current.successMessage).toBe(
      "Status do pedido ORD-1001 atualizado para Concluído.",
    );

    act(() => {
      result.current.clearFeedback();
    });

    expect(result.current.updateError).toBeNull();
    expect(result.current.successMessage).toBeNull();
  });
});
