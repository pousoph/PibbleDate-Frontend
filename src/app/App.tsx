import { BrowserRouter, Routes, Route } from 'react-router-dom'

export function App() {
  return (
    <BrowserRouter>
      <div className="min-h-svh bg-background text-foreground font-sans">
        <header className="px-6 py-4 border-b border-border">
          <h1 className="font-display text-2xl font-semibold">
            Pibble Date
          </h1>
        </header>
        <main className="p-6">
          <Routes>
            <Route
              path="/"
              element={
                <p className="text-muted-foreground">
                  Setup completo — M0 listo.
                </p>
              }
            />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
