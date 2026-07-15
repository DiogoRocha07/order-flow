"use client";

import { useCallback } from "react";

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
    return (
      <div className='rounded-x1 border border-slate-200 bg-white p-6'>
        <p className='text-sm text-slate-600'>
          Carregando resumo dos pedidos...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='rounded-x1 border border-red-200 bg-red-50 p-6'>
        <p className='font-medium text-red-800'>
          Não foi possivel carregar o dashboard.
        </p>

        <p className='mt-1 text-sm text-red-700'>{error}</p>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

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
            className='text-sm font-medium text-emerald-800 hover:underline'
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
            className='text-sm font-medium text-red-800 hover:underline'
          >
            Fechar
          </button>
        </div>
      )}

      <OrderFilters
        filters={filters}
        hasActiveFilters={hasActiveFilters}
        onFilterChange={updateFilter}
        onClearFilters={clearFilters}
      />

      <OrderTable
        orders={filteredOrders}
        updatingOrderId={updatingOrderId}
        onStatusChange={updateStatus}
      />
    </div>
  );
}
