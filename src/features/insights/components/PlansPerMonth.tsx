import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from 'recharts'
import { ChartCard } from './ChartCard'
import type { PlansByMonthDatum } from '../hooks/useInsightsData'

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #F0DCDC',
  borderRadius: '0.5rem',
  fontSize: 12,
  color: '#2A0009',
}

export function PlansPerMonth({ data }: { data: PlansByMonthDatum[] }) {
  return (
    <ChartCard
      title="Citas por mes"
      isEmpty={data.length === 0}
      emptyMessage="Crea planes para ver tu actividad mensual"
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0DCDC" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#7A5560' }}
            axisLine={false}
            tickLine={false}
            minTickGap={8}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#7A5560' }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip
            cursor={{ fill: '#FDF4F4' }}
            contentStyle={TOOLTIP_STYLE}
            formatter={(v) => [v, 'planes']}
          />
          <Bar dataKey="count" fill="#4A0011" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
