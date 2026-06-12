import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  NavLink,
  useLocation,
  useParams,
  useNavigate,
} from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import logoPng from '@/app/assets/logo-pibbledate.png'
import { PlanList } from '@/features/plans/components/PlanList'
import { PlanDetail } from '@/features/plans/components/PlanDetail'
import { PlanForm } from '@/features/plans/components/PlanForm'
import { MemoriesPage } from '@/features/memories/components/MemoriesPage'
import { usePlan } from '@/features/plans/hooks/usePlan'
import { cn } from '@/shared/lib/utils'

/* ── Página: nuevo plan ── */
function NewPlanPage() {
  const navigate = useNavigate()
  return (
    <section className="space-y-6">
      <BackLink />
      <h1 className="font-display text-2xl font-semibold">Nuevo plan</h1>
      <PlanForm onSuccess={() => navigate('/')} />
    </section>
  )
}

/* ── Página: editar plan ── */
function EditPlanPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const plan = usePlan(id!)

  if (plan === undefined) {
    return (
      <div className="flex justify-center py-16" role="status" aria-live="polite">
        <span className="text-sm text-muted-foreground">Cargando…</span>
      </div>
    )
  }

  if (plan === null) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center">
        <p className="text-sm text-muted-foreground">Plan no encontrado.</p>
        <button
          onClick={() => navigate('/')}
          className="text-sm text-primary underline underline-offset-2"
        >
          Volver a mis planes
        </button>
      </div>
    )
  }

  return (
    <section className="space-y-6">
      <BackLink />
      <h1 className="font-display text-2xl font-semibold">Editar plan</h1>
      <PlanForm plan={plan} onSuccess={() => navigate(`/plan/${id}`)} />
    </section>
  )
}

/* ── Página: detalle de plan ── */
function PlanDetailPage() {
  const { id } = useParams<{ id: string }>()
  return (
    <section className="space-y-6">
      <BackLink />
      <PlanDetail id={id!} />
    </section>
  )
}

/* ── Back link compartido ── */
function BackLink() {
  const navigate = useNavigate()
  return (
    <button
      onClick={() => navigate('/')}
      className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      aria-label="Volver a mis planes"
    >
      <ArrowLeft className="size-4" aria-hidden="true" />
      Mis planes
    </button>
  )
}

/* ── Header — vive dentro de AppShell para usar NavLink ── */
function AppHeader() {
  return (
    <header className="relative bg-secondary z-10">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-3 group"
          aria-label="Pibble Date — inicio"
        >
          <img
            src={logoPng}
            alt=""
            className="h-11 w-auto rounded-lg shrink-0 shadow-sm"
            aria-hidden="true"
          />
          <span className="font-display text-2xl font-semibold text-secondary-foreground group-hover:text-primary transition-colors select-none">
            Pibble Date
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1" aria-label="Navegación principal">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              cn(
                'px-2.5 py-1 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-secondary-foreground',
              )
            }
          >
            Planes
          </NavLink>
          <NavLink
            to="/recuerdos"
            className={({ isActive }) =>
              cn(
                'px-2.5 py-1 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-secondary-foreground',
              )
            }
          >
            Recuerdos
          </NavLink>
        </nav>
      </div>

      {/* Scalloped edge */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 right-0 h-[14px] translate-y-full pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 50% 0%, var(--surface-blush) 13px, transparent 14px)',
          backgroundSize: '28px 28px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'center 0',
        }}
      />
    </header>
  )
}

/* ── Shell con transición de páginas ── */
function AppShell() {
  const location = useLocation()
  const rm = useReducedMotion()

  return (
    <div className="min-h-svh bg-background text-foreground font-sans">
      <AppHeader />

      <main className="px-4 pt-10 pb-10 max-w-2xl mx-auto">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{
              opacity: rm ? 1 : 0,
              y:       rm ? 0 : 8,
            }}
            animate={{ opacity: 1, y: 0 }}
            exit={{
              opacity: rm ? 1 : 0,
              y:       rm ? 0 : -5,
            }}
            transition={{ duration: rm ? 0.001 : 0.17, ease: 'easeInOut' }}
          >
            <Routes location={location}>
              <Route path="/"                element={<PlanList />} />
              <Route path="/nuevo"           element={<NewPlanPage />} />
              <Route path="/plan/:id"        element={<PlanDetailPage />} />
              <Route path="/plan/:id/editar" element={<EditPlanPage />} />
              <Route path="/recuerdos"       element={<MemoriesPage />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  )
}

/* ── Entry point ── */
export function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  )
}
