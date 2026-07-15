import { useCallback, useState } from "react";
import { updateOrderStatus as updateOrderStatusRequest } from "@/features/orders/services/orders-api";
import type { OrderStatus } from "@/features/orders/types/order";
import { getOrderStatusLabel } from "@/features/orders/utils/order-status";

type UseUpdateOrderStatusOptions = {
  onUpdated: () => Promise<void>;
};

type UseUpdateOrderStatusResult = {
  updatingOrderId: string | null;
  updateError: string | null;
  successMessage: string | null;
  updateStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  clearFeedback: () => void;
};

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Ocorreu um erro inesperado durante a atualização.";
}

export function useUpdateOrderStatus({
  onUpdated,
}: UseUpdateOrderStatusOptions): UseUpdateOrderStatusResult {
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const [updateError, setUpdateError] = useState<string | null>(null);

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const updateStatus = useCallback(
    async (orderId: string, status: OrderStatus): Promise<void> => {
      setUpdatingOrderId(orderId);
      setUpdateError(null);
      setSuccessMessage(null);

      try {
        const updatedOrder = await updateOrderStatusRequest(orderId, status);

        await onUpdated();

        setSuccessMessage(
          `Status do pedido ${updatedOrder.id} atualizado para ${getOrderStatusLabel(updatedOrder.status)}.`,
        );
      } catch (error) {
        setUpdateError(getErrorMessage(error));
      } finally {
        setUpdatingOrderId(null);
      }
    },
    [onUpdated],
  );

  const clearFeedback = useCallback(() => {
    setUpdateError(null);
    setSuccessMessage(null);
  }, []);

  return {
    updatingOrderId,
    updateError,
    successMessage,
    updateStatus,
    clearFeedback,
  };
}
