import { act, renderHook, waitFor } from "@testing-library/react";

import {
  fetchOrders,
  fetchOrdersStats,
} from "@/features/orders/services/orders-api";
import type {
  Order,
  OrderStats,
  OrdersListData,
} from "@/features/orders/types/order";
import { useOrders } from "@/features/orders/hooks/use-orders";

jest.mock("@/features/orders/services/orders-api", () => ({
  fetchOrders: jest.fn(),
  fetchOrdersStats: jest.fn(),
}));

const mockedFetchOrders = jest.mocked(fetchOrders);
const mockedFetchOrdersStats = jest.mocked(fetchOrdersStats);

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

const ordersData: OrdersListData = {
  orders,
  total: orders.length,
};

const stats: OrderStats = {
  totalOrders: 2,
  pendingOrders: 1,
  preparingOrders: 0,
  completedOrders: 1,
  totalValue: 450,
};

const updatedOrders: Order[] = [
  ...orders,
  {
    id: "ORD-1003",
    customerName: "Carla Mendes",
    total: 200,
    status: "preparing",
    createdAt: "2026-07-03T12:00:00.000Z",
    itemCount: 3,
  },
];

const updatedOrdersData: OrdersListData = {
  orders: updatedOrders,
  total: updatedOrders.length,
};

const updatedStats: OrderStats = {
  totalOrders: 3,
  pendingOrders: 1,
  preparingOrders: 1,
  completedOrders: 1,
  totalValue: 650,
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

describe("useOrders", () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it("inicia com carregamento ativo e dados vazios", () => {
    mockedFetchOrders.mockReturnValue(new Promise(() => {}));

    mockedFetchOrdersStats.mockReturnValue(new Promise(() => {}));

    const { result } = renderHook(() => useOrders());

    expect(result.current.orders).toEqual([]);
    expect(result.current.stats).toBeNull();
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it("carrega os pedidos e as estatísticas com sucesso", async () => {
    mockedFetchOrders.mockResolvedValue(ordersData);
    mockedFetchOrdersStats.mockResolvedValue(stats);

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(mockedFetchOrders).toHaveBeenCalledTimes(1);
    expect(mockedFetchOrdersStats).toHaveBeenCalledTimes(1);

    expect(result.current.orders).toEqual(orders);
    expect(result.current.stats).toEqual(stats);
    expect(result.current.error).toBeNull();
  });

  it("armazena a mensagem quando ocorre um erro no carregamento", async () => {
    mockedFetchOrders.mockRejectedValue(
      new Error("Não foi possível carregar os pedidos."),
    );

    mockedFetchOrdersStats.mockResolvedValue(stats);

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Não foi possível carregar os pedidos.");

    expect(result.current.orders).toEqual([]);
    expect(result.current.stats).toBeNull();
  });

  it("utiliza uma mensagem padrão quando o erro não é uma instância de Error", async () => {
    mockedFetchOrders.mockRejectedValue("Falha desconhecida");

    mockedFetchOrdersStats.mockResolvedValue(stats);

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Ocorreu um erro inesperado.");

    expect(result.current.orders).toEqual([]);
    expect(result.current.stats).toBeNull();
  });

  it("recarrega os dados, limpa o erro anterior e ativa o carregamento padrão", async () => {
    const ordersDeferred = createDeferred<OrdersListData>();

    const statsDeferred = createDeferred<OrderStats>();

    mockedFetchOrders
      .mockRejectedValueOnce(new Error("Falha no carregamento inicial."))
      .mockReturnValueOnce(ordersDeferred.promise);

    mockedFetchOrdersStats
      .mockResolvedValueOnce(stats)
      .mockReturnValueOnce(statsDeferred.promise);

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.error).toBe("Falha no carregamento inicial.");

    let refetchPromise!: Promise<void>;

    act(() => {
      refetchPromise = result.current.refetch();
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();

    await act(async () => {
      ordersDeferred.resolve(ordersData);
      statsDeferred.resolve(stats);

      await refetchPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.orders).toEqual(orders);
    expect(result.current.stats).toEqual(stats);
    expect(result.current.error).toBeNull();

    expect(mockedFetchOrders).toHaveBeenCalledTimes(2);
    expect(mockedFetchOrdersStats).toHaveBeenCalledTimes(2);
  });

  it("recarrega os dados sem ativar o carregamento quando showLoading é false", async () => {
    const ordersDeferred = createDeferred<OrdersListData>();

    const statsDeferred = createDeferred<OrderStats>();

    mockedFetchOrders
      .mockResolvedValueOnce(ordersData)
      .mockReturnValueOnce(ordersDeferred.promise);

    mockedFetchOrdersStats
      .mockResolvedValueOnce(stats)
      .mockReturnValueOnce(statsDeferred.promise);

    const { result } = renderHook(() => useOrders());

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.orders).toEqual(orders);
    expect(result.current.stats).toEqual(stats);

    let refetchPromise!: Promise<void>;

    act(() => {
      refetchPromise = result.current.refetch({
        showLoading: false,
      });
    });

    expect(result.current.isLoading).toBe(false);

    // Enquanto a requisição está pendente,
    // os dados anteriores continuam disponíveis
    expect(result.current.orders).toEqual(orders);
    expect(result.current.stats).toEqual(stats);

    await act(async () => {
      ordersDeferred.resolve(updatedOrdersData);
      statsDeferred.resolve(updatedStats);

      await refetchPromise;
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.orders).toEqual(updatedOrders);
    expect(result.current.stats).toEqual(updatedStats);
    expect(result.current.error).toBeNull();
  });
});
