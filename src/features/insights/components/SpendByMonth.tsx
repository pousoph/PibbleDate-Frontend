import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { ChartCard } from './ChartCard'
import type { SpendByMonthDatum } from '../hooks/useInsightsData'

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #F0DCDC',
  borderRadius: '0.5rem',
  fontSize: 12,
  color: '#2A0009',
}

function formatBudget(v: number) {
  return v >= 1000
    ? `$${(v / 1000).toFixed(1)}k`
    : `$${Math.round(v)}`
}

export function SpendByMonth({ data }: { data: SpendByMonthDatum[] }) {
  return (
    <ChartCard
      title="Gasto acumulado"
      isEmpty={data.length === 0}
      emptyMessage="Añade presupuesto a tus citas completadas para verlo aquí"
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -4, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0DCDC" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#7A5560' }}
            axisLine={false}
            tickLine={false}
            minTickGap={8}
          />
          <YAxis
            tickFormatter={formatBudget}
            tick={{ fontSize: 11, fill: '#7A5560' }}
            axisLine={false}
            tickLine={false}
            width={36}
          />
          <Tooltip
            cursor={{ fill: '#FDF4F4' }}
            contentStyle={TOOLTIP_STYLE}
            formatter={(v) => [`$${Number(v).toLocaleString('es')}`, 'gasto']}
          />
          <Bar dataKey="total" fill="#F4A98C" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
