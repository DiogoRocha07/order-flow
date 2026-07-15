"use client";

import { useCallback } from "react";

import { EmptyState } from "@/features/orders/components/ui/empty-state";
import { ErrorState } from "@/features/orders/components/ui/error-state";
import { LoadingState } from "@/features/orders/components/ui/loading-state";
import { OrderDashboard } from "@/features/orders/components/order-dashboard";
import { OrderFilters } from "@/features/orders/components/order-filters";
import { OrderTable } from "@/features/orders/components/order-table";
import { useOrderFilters } from "@/features/orders/hooks/use-orders-filters";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { useUpdateOrderStatus } from "@/features/orders/hooks/use-update-order-status";

export function OrdersOverview() {
  const { orders, stats, isLoading, error, refetch } = useOrders();

  const {
    filters,
    filteredOrders,
    hasActiveFilters,
    updateFilter,
    clearFilters,
  } = useOrderFilters(orders);

  const retryOrders = useCallback(() => {
    void refetch();
  }, [refetch]);

  const refreshAfterStatusUpdate = useCallback(
    () =>
      refetch({
        showLoading: false,
      }),
    [refetch],
  );

  const {
    updatingOrderId,
    updateError,
    successMessage,
    updateStatus,
    clearFeedback,
  } = useUpdateOrderStatus({ onUpdated: refreshAfterStatusUpdate });

  if (isLoading) {
    return <LoadingState message='Carregando pedidos' />;
  }

  if (error) {
    return (
      <ErrorState
        title='Não foi possivel carregar os pedidos.'
        message={error}
        onRetry={retryOrders}
      />
    );
  }

  if (!stats) {
    return (
      <ErrorState
        title='Os dados do dashboard estão indisponíveis.'
        message='As estatísticas dos pedidos não foram retornadas corretamente.'
        onRetry={retryOrders}
      />
    );
  }

  const hasOrders = orders.length > 0;
  const hasVisibleOrders = filteredOrders.length > 0;

  return (
    <div className='space-y-8'>
      <OrderDashboard stats={stats} />

      {successMessage && (
        <div
          role='status'
          className='flex items-start justify-between gap-4 rounded-x1 border border-emerald-200 bg-emerald-50 p-4'
        >
          <p className='text-sm font-medium text-emerald-800'>
            {successMessage}
          </p>

          <button
            type='button'
            onClick={clearFeedback}
            className='text-sm font-medium text-emerald-800 hover:underline cursor-pointer'
          >
            Fechar
          </button>
        </div>
      )}

      {updateError && (
        <div
          role='alert'
          className='flex items-start justify-between gap-4 rounded-x1 border border-red-200 bg-red-50 p-4'
        >
          <div>
            <p className='font-medium text-red-800'>
              Não foi possível alterar o status.
            </p>

            <p className='mt-1 text-sm text-red-700'>{updateError}</p>
          </div>

          <button
            type='button'
            onClick={clearFeedback}
            className='text-sm font-medium text-red-800 hover:underline cursor-pointer'
          >
            Fechar
          </button>
        </div>
      )}

      {hasOrders && (
        <OrderFilters
          filters={filters}
          hasActiveFilters={hasActiveFilters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
        />
      )}

      {hasVisibleOrders ? (
        <OrderTable
          orders={filteredOrders}
          updatingOrderId={updatingOrderId}
          onStatusChange={updateStatus}
        />
      ) : (
        <EmptyState
          title={
            hasActiveFilters
              ? "Nenhum pedido encontrado"
              : "Nenhum pedido cadastrado"
          }
          description={
            hasActiveFilters
              ? "Nenhum pedido corresponde aos filtros selecionados. Altere ou limpe os filtros para visualizar outros resultados."
              : "Ainda não existem pedidos disponíveis para exibição."
          }
          actionLabel={hasActiveFilters ? "Limpar filtros" : undefined}
          onAction={hasActiveFilters ? clearFilters : undefined}
        />
      )}
    </div>
  );
}
