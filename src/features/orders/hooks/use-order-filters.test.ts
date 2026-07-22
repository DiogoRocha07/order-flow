import { act, renderHook } from "@testing-library/react";

import { useOrderFilters } from "@/features/orders/hooks/use-order-filters";
import type { Order } from "@/features/orders/types/order";

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
    status: "preparing",
    createdAt: "2026-07-10T15:00:00.000Z",
    itemCount: 4,
  },
  {
    id: "ORD-1003",
    customerName: "Ana Martins",
    total: 200,
    status: "completed",
    createdAt: "2026-07-20T12:00:00.000Z",
    itemCount: 1,
  },
];

describe("useOrdersFilters", () => {
  it("inicia com filtros vazios e retorna todos os pedidos", () => {
    const { result } = renderHook(() => useOrderFilters(orders));

    expect(result.current.filters).toEqual({
      customerName: "",
      status: "all",
      startDate: "",
      endDate: "",
    });

    expect(result.current.filteredOrders).toEqual(orders);
    expect(result.current.hasActiveFilters).toBe(false);
  });

  it("atualiza o filtro pelo nome do cliente", () => {
    const { result } = renderHook(() => useOrderFilters(orders));

    act(() => {
      result.current.updateFilter("customerName", "Ana");
    });

    expect(result.current.filters.customerName).toBe("Ana");

    expect(result.current.filteredOrders).toEqual([orders[0], orders[2]]);

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("preserva os filtros anteriores ao atualizar outro campo", () => {
    const { result } = renderHook(() => useOrderFilters(orders));

    act(() => {
      result.current.updateFilter("customerName", "Ana");

      result.current.updateFilter("status", "completed");
    });

    expect(result.current.filters).toEqual({
      customerName: "Ana",
      status: "completed",
      startDate: "",
      endDate: "",
    });

    expect(result.current.filteredOrders).toEqual([orders[2]]);

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("atualiza os filtros de período", () => {
    const { result } = renderHook(() => useOrderFilters(orders));

    act(() => {
      result.current.updateFilter("startDate", "2026-07-05");

      result.current.updateFilter("endDate", "2026-07-15");
    });

    expect(result.current.filters.startDate).toBe("2026-07-05");
    expect(result.current.filters.endDate).toBe("2026-07-15");

    expect(result.current.filteredOrders).toEqual([orders[1]]);

    expect(result.current.hasActiveFilters).toBe(true);
  });

  it("não considera espaços vazios como um filtro ativo de cliente", () => {
    const { result } = renderHook(() => useOrderFilters(orders));

    act(() => {
      result.current.updateFilter("customerName", "   ");
    });

    expect(result.current.filters.customerName).toBe("   ");

    expect(result.current.hasActiveFilters).toBe(false);
    expect(result.current.filteredOrders).toEqual(orders);
  });

  it("limpa todos os filtros e volta a exibir todos os pedidos", () => {
    const { result } = renderHook(() => useOrderFilters(orders));

    act(() => {
      result.current.updateFilter("customerName", "Ana");

      result.current.updateFilter("status", "completed");
    });

    expect(result.current.hasActiveFilters).toBe(true);
    expect(result.current.filteredOrders).toEqual([orders[2]]);

    act(() => {
      result.current.clearFilters();
    });

    expect(result.current.filters).toEqual({
      customerName: "",
      status: "all",
      startDate: "",
      endDate: "",
    });

    expect(result.current.filteredOrders).toEqual(orders);
    expect(result.current.hasActiveFilters).toBe(false);
  });
});
