import { getOrders } from "@/features/orders/server/order-store";
import { errorResponse, successResponse } from "@/lib/http/api-response";

export function GET(): Response {
  try {
    const orders = getOrders();

    return successResponse({
      orders,
      total: orders.length,
    });
  } catch (error) {
    console.error("Failed to retrieve orders:", error);

    return errorResponse(
      "ORDERS_FETCH_FAILED",
      "Não foi possível carregar os pedidos",
      500,
    );
  }
}
