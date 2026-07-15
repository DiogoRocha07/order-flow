import type { Order, OrderFiltersState } from "@/features/orders/types/order";

function normalizeText(value: string): string {
  return value.trim().toLocaleLowerCase("pt-BR");
}

export function filterOrders(
  orders: readonly Order[],
  filters: OrderFiltersState,
): Order[] {
  const normalizedCustomerName = normalizeText(filters.customerName);

  return orders.filter((order) => {
    const matchesCustomer =
      normalizedCustomerName.length === 0 ||
      normalizeText(order.customerName).includes(normalizedCustomerName);

    const matchesStatus =
      filters.status === "all" || order.status === filters.status;

    const orderDate = order.createdAt.slice(0, 10);

    const matchesStartDate =
      filters.startDate === "" || orderDate >= filters.startDate;

    const matchesEndDate =
      filters.endDate === "" || orderDate <= filters.endDate;

    return (
      matchesCustomer && matchesStatus && matchesStartDate && matchesEndDate
    );
  });
}
