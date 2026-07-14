import { getOrders } from "@/features/orders/server/order-store";
import { calculateOrderStats } from "@/features/orders/utils/calculate-order-stats";
import { errorResponse, successResponse } from "@/lib/http/api-response";

export function GET(): Response {
  try {
    const orders = getOrders();
    const stats = calculateOrderStats(orders);

    return successResponse(stats);
  } catch (error) {
    console.error("Failed to calculate order stats:", error);

    return errorResponse(
      "ORDER_STATS_FAILED",
      "Não foi possível calcular as estatísticas dos pedidos",
      500,
    );
  }
}
