import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Cell,
} from 'recharts'
import { ChartCard } from './ChartCard'
import type { RatingDatum } from '../hooks/useInsightsData'

const TOOLTIP_STYLE = {
  backgroundColor: '#FFFFFF',
  border: '1px solid #F0DCDC',
  borderRadius: '0.5rem',
  fontSize: 12,
  color: '#2A0009',
}

// Intensity by star level: dimmer for low, brighter for high
const STAR_COLORS = ['#F0DCDC', '#F4A98C', '#E8C27A', '#E0A458', '#D4913A']

export function RatingDistribution({ data }: { data: RatingDatum[] }) {
  const hasAnyRating = data.some(d => d.count > 0)

  return (
    <ChartCard
      title="Distribución de ratings"
      isEmpty={!hasAnyRating}
      emptyMessage="Califica tus citas completadas para ver la distribución"
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F0DCDC" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 13, fill: '#7A5560' }}
            axisLine={false}
            tickLine={false}
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
            formatter={(v) => [v, 'citas']}
          />
          <Bar dataKey="count" radius={[4, 4, 0, 0]} maxBarSize={48}>
            {data.map((d) => (
              <Cell key={d.stars} fill={STAR_COLORS[d.stars - 1]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  )
}
