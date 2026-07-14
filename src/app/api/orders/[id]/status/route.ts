import { updateOrderStatus } from "@/features/orders/server/order-store";
import { isOrderStatus } from "@/features/orders/utils/order-status";
import { errorResponse, successResponse } from "@/lib/http/api-response";

type OrderStatusRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(
  request: Request,
  { params }: OrderStatusRouteContext,
): Promise<Response> {
  try {
    const { id } = await params;

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return errorResponse(
        "INVALID_JSON",
        "O corpo da requisição não contém um JSON válido.",
        400,
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body) ||
      !("status" in body)
    ) {
      return errorResponse(
        "INVALID_BODY",
        "O campo status é obrigatório.",
        400,
      );
    }

    const status = body.status;

    if (!isOrderStatus(status)) {
      return errorResponse(
        "INVALID_STATUS",
        "O status informado não é válido.",
        400,
      );
    }

    const updatedOrder = updateOrderStatus(id, status);

    if (!updatedOrder) {
      return errorResponse("ORDER_NOT_FOUND", "Pedido não encontrado", 404);
    }

    return successResponse(updatedOrder);
  } catch (error) {
    console.error("Failed to update order status:", error);

    return errorResponse(
      "ORDER_UPDATE_FAILED",
      "Não foi possível atualizar o status do pedido.",
      500,
    );
  }
}
