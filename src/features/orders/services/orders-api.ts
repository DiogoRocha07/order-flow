import type { OrderStats, OrdersListData } from "@/features/orders/types/order";
import type { ApiResponse } from "@/lib/http/api-response";

async function parseApiResponse<T>(response: Response): Promise<T> {
  let payload: ApiResponse<T>;

  try {
    payload = (await response.json()) as ApiResponse<T>;
  } catch {
    throw new Error("O servidor retornou uma resposta inválida.");
  }

  if (!payload.success) {
    throw new Error(payload.error.message);
  }

  if (!response.ok) {
    throw new Error("Não foi possível concluir a solicitação.");
  }

  return payload.data;
}

export async function fetchOrders(): Promise<OrdersListData> {
  const response = await fetch("/api/orders", {
    cache: "no-store",
  });

  return parseApiResponse<OrdersListData>(response);
}

export async function fetchOrdersStats(): Promise<OrderStats> {
  const response = await fetch("/api/orders/stats", {
    cache: "no-store",
  });

  return parseApiResponse<OrderStats>(response);
}
