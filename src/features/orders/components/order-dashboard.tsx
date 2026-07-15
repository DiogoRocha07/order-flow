import { DashboardCard } from "@/features/orders/components/dashboard-card";
import type { OrderStats } from "@/features/orders/types/order";
import { formatCurrency } from "@/features/orders/utils/format-currency";

type OrderDashboardProps = {
  stats: OrderStats;
};

export function OrderDashboard({ stats }: OrderDashboardProps) {
  return (
    <section aria-labelledby='dashboard-title'>
      <div className='mb-4'>
        <h2
          id='dashboard-title'
          className='text-x1 font-semibold text-slate-900'
        >
          Resumo dos pedidos
        </h2>

        <p className='mt-1 text-sm text-slate-600'>
          Acompanhe os principais indicadores da operação.
        </p>
      </div>

      <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-5'>
        <DashboardCard
          title='Total de pedidos'
          value={stats.totalOrders}
          description='Todos os pedidos registrados'
        />

        <DashboardCard
          title='Pendentes'
          value={stats.pendingOrders}
          description='Aguardaando preparação'
        />

        <DashboardCard
          title='Em preparação'
          value={stats.preparingOrders}
          description='Pedidos em andamento'
        />

        <DashboardCard
          title='Concluídos'
          value={stats.completedOrders}
          description='Pedidos finalizados'
        />

        <DashboardCard
          title='Valor total'
          value={formatCurrency(stats.totalValue)}
          description='Desconsiderando cancelados'
        />
      </div>
    </section>
  );
}
