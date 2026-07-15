import {
  ORDER_STATUSES,
  type OrderStatus,
} from "@/features/orders/types/order";
import {
  getOrderStatusLabel,
  isOrderStatus,
} from "@/features/orders/utils/order-status";

type StatusSelectProps = {
  orderId: string;
  status: OrderStatus;
  disabled: boolean;
  onStatusChange: (status: OrderStatus) => void;
};

export function StatusSelect({
  orderId,
  status,
  disabled,
  onStatusChange,
}: StatusSelectProps) {
  return (
    <select
      aria-label={`Alterar status do pedido ${orderId}`}
      value={status}
      disabled={disabled}
      onChange={(event) => {
        const selectedStatus = event.target.value;

        if (isOrderStatus(selectedStatus)) {
          onStatusChange(selectedStatus);
        }
      }}
      className='min-w-40 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:opacity-70'
    >
      {ORDER_STATUSES.map((orderStatus) => (
        <option key={orderStatus} value={orderStatus}>
          {getOrderStatusLabel(orderStatus)}
        </option>
      ))}
    </select>
  );
}
