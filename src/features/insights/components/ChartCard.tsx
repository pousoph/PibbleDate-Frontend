interface ChartCardProps {
  title: string
  children: React.ReactNode
  isEmpty?: boolean
  emptyMessage?: string
}

export function ChartCard({ title, children, isEmpty, emptyMessage }: ChartCardProps) {
  return (
    <div className="bg-card border border-border rounded-xl p-4 space-y-3">
      <p className="text-[0.65rem] font-bold tracking-[0.15em] text-muted-foreground uppercase">
        {title}
      </p>
      {isEmpty ? (
        <p className="text-sm text-muted-foreground text-center py-8">
          {emptyMessage ?? 'No hay datos aún'}
        </p>
      ) : (
        children
      )}
    </div>
  )
}
