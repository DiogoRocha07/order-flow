type DashboardCardProps = {
  title: string;
  value: string | number;
  description: string;
};

export function DashboardCard({
  title,
  value,
  description,
}: DashboardCardProps) {
  return (
    <article className='rounded-xl border border-slate-200 bg-white p-5 shadow-sm'>
      <p className='text-sm font-medium text-slate-500'>{title}</p>

      <p className='mt-2 text-3x1 font-bold text-slate-900'>{value}</p>

      <p className='mt-2 text-sm text-slate-500'>{description}</p>
    </article>
  );
}
