import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell,
} from 'recharts'
import { ChartCard } from './ChartCard'
import type { CategoryDatum } from '../hooks/useInsightsData'

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #F0DCDC',
  borderRadius: '0.5rem',
  fontSize: 12,
  color: '#2A0009',
}

// Alternating shades for visual variety
const CATEGORY_COLORS = ['#CDB8DD', '#D9C6E6', '#C5ADDA', '#D1BDE2', '#C8B4DC']

export function TopCategories({ data }: { data: CategoryDatum[] }) {
  return (
    <ChartCard
      title="Categorías favoritas"
      isEmpty={data.length === 0}
      emptyMessage="Añade categorías a tus planes para verlas aquí"
    >
      <ResponsiveContainer width="100%" height={Math.max(180, data.length * 36)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 8, left: 0, bottom: 0 }}
        >
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fontSize: 11, fill: '#7A5560' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="category"
            width={90}
            tick={{ fontSize: 11, fill: '#2A0009' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: string) =>
              v.length > 12 ? `${v.slice(0, 11)}…` : v
            }
          />
          <Tooltip
            cursor={{ fill: '#FDF4F4' }}
            contentStyle={TOOLTIP_STYLE}
            formatter={(v) => [v, 'planes']}
          />
          <Bar dataKey="count" radius={[0, 4, 4, 0]} maxBarSize={28}>
            {data.map((_, i) => (
              <Cell key={i} fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
