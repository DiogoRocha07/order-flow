import {
  ORDER_STATUSES,
  type OrderFiltersState,
} from "@/features/orders/types/order";
import { getOrderStatusLabel } from "@/features/orders/utils/order-status";

type OrderFiltersProps = {
  filters: OrderFiltersState;
  hasActiveFilters: boolean;
  onFilterChange: <Key extends keyof OrderFiltersState>(
    field: Key,
    value: OrderFiltersState[Key],
  ) => void;
  onClearFilters: () => void;
};

export function OrderFilters({
  filters,
  hasActiveFilters,
  onFilterChange,
  onClearFilters,
}: OrderFiltersProps) {
  return (
    <section
      aria-labelledby='order-filters-title'
      className='rounded-x1 border border-slate-200 bg-white p-5 shadow-sm'
    >
      <div className='mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h2
            id='order-filters-title'
            className='text-lg font-semibold text-slate-900'
          >
            Filtros
          </h2>

          <p className='mt-1 text-sm text-slate-600'>
            Refine a lista por cliente, status ou período.
          </p>
        </div>

        <button
          type='button'
          onClick={onClearFilters}
          disabled={!hasActiveFilters}
          className='self-start rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:self-auto'
        >
          Limpar filtros
        </button>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <label className='block'>
          <span className='mb-1.5 block text-sm font-medium text-slate-700'>
            Cliente
          </span>

          <input
            type='search'
            value={filters.customerName}
            onChange={(event) =>
              onFilterChange("customerName", event.target.value)
            }
            placeholder='Buscar por nome'
            className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus-rind-2 focus:ring-blue-100'
          />
        </label>

        <label className='block'>
          <span className='mb-1.5 block text-sm font-medium text-slate-700'>
            Status
          </span>

          <select
            value={filters.status}
            onChange={(event) =>
              onFilterChange(
                "status",
                event.target.value as OrderFiltersState["status"],
              )
            }
            className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          >
            <option value='all'>Todos os status</option>

            {ORDER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {getOrderStatusLabel(status)}
              </option>
            ))}
          </select>
        </label>

        <label className='block'>
          <span className='mb-1.5 block text-sm font-medium text-slate-700'>
            Data inicial
          </span>

          <input
            type='date'
            value={filters.startDate}
            max={filters.endDate || undefined}
            onChange={(event) =>
              onFilterChange("startDate", event.target.value)
            }
            className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          />
        </label>

        <label className='block'>
          <span className='mb-1.5 block text-sm font-medium text-slate-700'>
            Data final
          </span>

          <input
            type='date'
            value={filters.endDate}
            min={filters.startDate || undefined}
            onChange={(event) => onFilterChange("endDate", event.target.value)}
            className='w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100'
          />
        </label>
      </div>
    </section>
  );
}
