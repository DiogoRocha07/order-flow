import { useCallback, useMemo, useState } from "react";
import type { Order, OrderFiltersState } from "@/features/orders/types/order";
import { filterOrders } from "../utils/filter-orders";

const INITIAL_FILTERS: OrderFiltersState = {
  customerName: "",
  status: "all",
  startDate: "",
  endDate: "",
};

type UseOrderFiltersResult = {
  filters: OrderFiltersState;
  filteredOrders: Order[];
  hasActiveFilters: boolean;
  updateFilter: <Key extends keyof OrderFiltersState>(
    field: Key,
    value: OrderFiltersState[Key],
  ) => void;
  clearFilters: () => void;
};

export function useOrderFilters(
  orders: readonly Order[],
): UseOrderFiltersResult {
  const [filters, setFilters] = useState(INITIAL_FILTERS);

  const filteredOrders = useMemo(
    () => filterOrders(orders, filters),
    [orders, filters],
  );

  const hasActiveFilters =
    filters.customerName.trim() !== "" ||
    filters.status !== "all" ||
    filters.startDate !== "" ||
    filters.endDate !== "";

  const updateFilter = useCallback(
    <Key extends keyof OrderFiltersState>(
      field: Key,
      value: OrderFiltersState[Key],
    ) => {
      setFilters((currentFilters) => ({
        ...currentFilters,
        [field]: value,
      }));
    },
    [],
  );

  const clearFilters = useCallback(() => {
    setFilters({ ...INITIAL_FILTERS });
  }, []);

  return {
    filters,
    filteredOrders,
    hasActiveFilters,
    updateFilter,
    clearFilters,
  };
}
