import { StatusBadge } from "@/features/orders/components/status-badge";
import { StatusSelect } from "@/features/orders/components/status-select";
import type { Order, OrderStatus } from "@/features/orders/types/order";
import { formatCurrency } from "@/features/orders/utils/format-currency";
import { formatOrderDate } from "@/features/orders/utils/format-order-date";

type OrderTableProps = {
  orders: readonly Order[];
  updatingOrderId: string | null;
  onStatusChange: (orderId: string, status: OrderStatus) => Promise<void>;
};

export function OrderTable({
  orders,
  updatingOrderId,
  onStatusChange,
}: OrderTableProps) {
  const isUpdating = updatingOrderId !== null;

  return (
    <section
      aria-labelledby='orders-table-tittle'
      className='overflow-hidden rounded-x1 border border-slate-200 bg-white shadow-sm'
    >
      <div className='border-b border-slate-200 px-5 py-4'>
        <h2
          id='orders-table-tittle'
          className='text-x1 font-semibold text-slate-900'
        >
          Pedidos
        </h2>

        <p className='mt-1 text-sm text-slate-600'>
          {orders.length} pedidos exibidos
        </p>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full border-collapse'>
          <caption className='sr-only'>Lista de pedidos da loja</caption>

          <thead className='bg-slate-50'>
            <tr>
              <th
                scope='col'
                className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'
              >
                Pedido
              </th>

              <th
                scope='col'
                className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'
              >
                Cliente
              </th>

              <th
                scope='col'
                className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'
              >
                Data
              </th>

              <th
                scope='col'
                className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'
              >
                Itens
              </th>

              <th
                scope='col'
                className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'
              >
                Status atual
              </th>

              <th
                scope='col'
                className='px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500'
              >
                Alterar status
              </th>

              <th
                scope='col'
                className='px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500'
              >
                Valor
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-200'>
            {orders.map((order) => (
              <tr
                key={order.id}
                className='transition-colors hover:bg-slate-50'
              >
                <td className='whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900'>
                  {order.id}
                </td>

                <td className='whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900'>
                  {order.customerName}
                </td>

                <td className='whitespace-nowrap px-5 py-4 text-sm text-slate-600'>
                  {formatOrderDate(order.createdAt)}
                </td>

                <td className='whitespace-nowrap px-5 py-4 text-sm text-slate-600'>
                  {order.itemCount} {order.itemCount === 1 ? "item" : "itens"}
                </td>

                <td className='whitespace-nowrap px-5 py-4'>
                  <StatusBadge status={order.status} />
                </td>

                <td className='whitespace-nowrap px-5 py-4'>
                  <div className='flex flex-col gap-1.5'>
                    <StatusSelect
                      orderId={order.id}
                      status={order.status}
                      disabled={isUpdating}
                      onStatusChange={(status) => {
                        void onStatusChange(order.id, status);
                      }}
                    />

                    {updatingOrderId === order.id && (
                      <span role='status' className='text-xs text-blue-700'>
                        Atualizando...
                      </span>
                    )}
                  </div>
                </td>

                <td className='whitespace-nowrap px-5 py-4 text-right text-sm font-semibold tabular-nums text-slate-900'>
                  {formatCurrency(order.total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
