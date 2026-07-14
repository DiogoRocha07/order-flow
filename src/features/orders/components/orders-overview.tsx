"use client";

import { OrderDashboard } from "@/features/orders/components/order-dashboard";
import { useOrders } from "@/features/orders/hooks/use-orders";
import { OrderTable } from "@/features/orders/components/order-table";

export function OrdersOverview() {
  const { orders, stats, isLoading, error } = useOrders();

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

      <OrderTable orders={orders} />
    </div>
  );
}
