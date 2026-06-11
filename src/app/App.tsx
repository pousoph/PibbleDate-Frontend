import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { PlanForm } from '@/features/plans/components/PlanForm'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-background text-foreground font-sans">
        <header className="px-6 py-4 border-b border-border">
          <h1 className="font-display text-2xl font-semibold">Pibble Date</h1>
        </header>
        <main className="p-6 max-w-2xl mx-auto">
          <Routes>
            <Route path="/" element={<PlanForm />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
