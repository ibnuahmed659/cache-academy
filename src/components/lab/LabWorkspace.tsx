import {
  AlertTriangle,
  Check,
  ChevronDown,
  Database,
  Flag,
  Lightbulb,
  Lock,
  Play,
  Send,
  Server,
  ShieldAlert,
  ShieldCheck,
  Target,
  User,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { AttackResult, Defense, DefenseKey, LabScenario } from '@/lib/lab'
import { DEFENSE_META, INJECT_POINTS, requestSnippet, runCache, t } from '@/lib/lab'
import { useProgress } from '@/lib/progress'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/utils'

export function LabWorkspace({ scenario }: { scenario: LabScenario }) {
  const { markLabSolved } = useProgress()
  const firstInject = scenario.injects[0]
  const [inject, setInject] = useState(firstInject)
  const [payload, setPayload] = useState(INJECT_POINTS[firstInject].defaultPayload)
  const [defense, setDefense] = useState<Defense>(scenario.defense)
  const [result, setResult] = useState<AttackResult | null>(null)
  const [running, setRunning] = useState(false)

  const attack = useMemo(() => ({ inject, payload }), [inject, payload])
  const snippet = useMemo(() => requestSnippet(scenario, attack), [scenario, attack])

  const changedDefense = useMemo(
    () => JSON.stringify(defense) !== JSON.stringify(scenario.defense),
    [defense, scenario.defense],
  )

  const solved = result?.pwned ?? false
  const defended = result != null && !result.pwned && changedDefense

  useEffect(() => {
    if (solved) markLabSolved(scenario.id)
  }, [solved, scenario.id, markLabSolved])

  const pickInject = (id: string) => {
    setInject(id)
    setPayload(INJECT_POINTS[id].defaultPayload)
  }

  const run = (override?: Defense) => {
    const def = override ?? defense
    setRunning(true)
    const res = runCache(scenario, def, { inject, payload })
    window.setTimeout(() => {
      setResult(res)
      setRunning(false)
    }, 550)
  }

  const applyRecommended = () => {
    setDefense(scenario.secure)
    run(scenario.secure)
  }

  const reset = () => {
    setDefense(scenario.defense)
    setResult(null)
    setPayload(INJECT_POINTS[inject].defaultPayload)
  }

  const set = <K extends DefenseKey>(key: K, value: Defense[K]) =>
    setDefense({ ...defense, [key]: value })

  return (
    <div className="flex flex-col gap-5">
      <ForgeCard
        scenario={scenario}
        inject={inject}
        payload={payload}
        snippet={snippet}
        onPickInject={pickInject}
        onPayload={setPayload}
        onReset={reset}
        running={running}
        onRun={() => run()}
      />

      <TargetCard scenario={scenario} />

      {result && <ResultBanner scenario={scenario} result={result} />}

      <TraceCard result={result} running={running} />

      <DefenseCard
        scenario={scenario}
        defense={defense}
        set={set}
        changed={changedDefense}
        defended={defended}
        onApplyRecommended={applyRecommended}
        onRunDefense={() => run()}
        running={running}
      />

      <WalkthroughCard scenario={scenario} />

      <div className="grid gap-5 lg:grid-cols-2">
        <VictimCard scenario={scenario} />
        <div className="flex flex-col gap-5">
          <ObjectivesCard scenario={scenario} solved={solved} />
          <HintsCard scenario={scenario} />
        </div>
      </div>
    </div>
  )
}

function SectionCard({
  title,
  icon,
  action,
  children,
}: {
  title: string
  icon?: ReactNode
  action?: ReactNode
  children: ReactNode
}) {
  return (
    <Card className="overflow-hidden">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        {icon && <span className="text-brand">{icon}</span>}
        <span className="text-sm font-semibold text-ink">{title}</span>
        {action && <span className="ml-auto">{action}</span>}
      </div>
      <div className="p-4">{children}</div>
    </Card>
  )
}

function ForgeCard({
  scenario,
  inject,
  payload,
  snippet,
  onPickInject,
  onPayload,
  onReset,
  running,
  onRun,
}: {
  scenario: LabScenario
  inject: string
  payload: string
  snippet: string
  onPickInject: (id: string) => void
  onPayload: (v: string) => void
  onReset: () => void
  running: boolean
  onRun: () => void
}) {
  return (
    <SectionCard
      title={scenario.mode === 'deception' ? 'Qari request' : 'U diyaari cache'}
      icon={scenario.mode === 'deception' ? <Send className="size-4" /> : <ShieldAlert className="size-4" />}
      action={
        <Button variant="ghost" size="sm" onClick={onReset}>
          Dib u celi
        </Button>
      }
    >
      <div className="flex flex-col gap-4">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-faint">
            {scenario.mode === 'deception' ? 'Qari URL' : 'Input aan key lahayn'}
          </label>
          <div className="grid gap-2 sm:grid-cols-2">
            {scenario.injects.map((id) => {
              const ip = INJECT_POINTS[id]
              const active = id === inject
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onPickInject(id)}
                  className={cn(
                    'flex flex-col gap-1 rounded-lg border p-2.5 text-left transition',
                    active
                      ? 'border-brand bg-brand-soft'
                      : 'border-line bg-surface-2 hover:border-line-strong',
                  )}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-[13px] font-semibold text-ink">{ip.label}</span>
                    <Badge tone="neutral" className="ml-auto">
                      {t('kind.' + ip.kind)}
                    </Badge>
                  </span>
                  <span className="text-[11px] leading-relaxed text-muted">{ip.blurb}</span>
                </button>
              )
            })}
          </div>
        </div>

        <label className="flex flex-col gap-1.5">
          <span className="text-xs font-semibold uppercase tracking-wide text-faint">
            {scenario.mode === 'deception' ? 'URL suffix' : 'Payload'}
          </span>
          <input
            value={payload}
            onChange={(e) => onPayload(e.target.value)}
            className="h-10 rounded-md border border-line bg-surface-2 px-3 font-mono text-[13px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-[var(--brand-ring)]"
          />
        </label>

        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wide text-faint">
              {scenario.mode === 'deception' ? 'Khiyaanka' : 'Priming request'}
            </span>
            <Badge tone="danger" className="ml-auto">
              from evil.example
            </Badge>
          </div>
          <CodeBlock code={snippet} title="Qalabka weerarka" wrap />
        </div>

        <div className="flex items-center gap-3">
          <Button variant="danger" size="lg" loading={running} onClick={onRun}>
            {!running && <Play className="size-4 fill-current" />}
            {scenario.mode === 'deception' ? 'Dir khiyaanka' : 'Fuli sunta'}
          </Button>
          <p className="text-[12px] text-muted">
            {scenario.mode === 'deception'
              ? 'Hal booqde waa ku filan. Kadib akhri cache-ka.'
              : 'Hal request ayaa qoraya shared cache entry qof kasta.'}
          </p>
        </div>
      </div>
    </SectionCard>
  )
}

function TargetCard({ scenario }: { scenario: LabScenario }) {
  if (scenario.mode === 'deception') {
    return (
      <SectionCard title="Bartilmaameedka" icon={<Target className="size-4" />}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-ink">Bog Private</span>
            <span className="font-mono text-[11px] text-faint">{scenario.path}</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded-lg border border-line bg-surface-2 p-3">
              <p className="text-[11px] uppercase tracking-wide text-faint">Cache-ku wuxuu kala saaraa</p>
              <p className="mt-1 font-mono text-[13px] text-muted">URL extension</p>
            </div>
            <div className="rounded-lg border border-line bg-surface-2 p-3">
              <p className="text-[11px] uppercase tracking-wide text-faint">Origin-ku wuxuu kala saaraa</p>
              <p className="mt-1 font-mono text-[13px] text-muted">routed path</p>
            </div>
          </div>
          {scenario.secret && (
            <p className="text-[12px] text-muted">
              Halista:{' '}
              <span className="font-mono text-danger">{scenario.secret}</span>
            </p>
          )}
        </div>
      </SectionCard>
    )
  }
  return (
    <SectionCard title="Bartilmaameedka" icon={<Server className="size-4" />}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-sm">
          <span className="font-semibold text-ink">{scenario.victim.site}</span>
          <span className="font-mono text-[11px] text-faint">{scenario.path}</span>
        </div>
        <div className="grid gap-2 sm:grid-cols-2">
          <div className="rounded-lg border border-line bg-surface-2 p-3">
            <p className="text-[11px] uppercase tracking-wide text-faint">Cache key</p>
            <p className="mt-1 font-mono text-[13px] text-muted">scheme + host + path</p>
          </div>
          <div className="rounded-lg border border-line bg-surface-2 p-3">
            <p className="text-[11px] uppercase tracking-wide text-faint">Wax kasta oo kale</p>
            <p className="mt-1 font-mono text-[13px] text-warning">unkeyed</p>
          </div>
        </div>
      </div>
    </SectionCard>
  )
}

function ResultBanner({ scenario, result }: { scenario: LabScenario; result: AttackResult }) {
  if (result.pwned) {
    return (
      <div className="scene-in flex items-start gap-3 rounded-xl border border-danger/40 bg-danger-soft p-4">
        <ShieldAlert className="mt-0.5 size-5 shrink-0 text-danger" />
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-ink">
            {scenario.mode === 'deception' ? 'Sir la shaaciyey' : 'Cache la suntey'}
          </p>
          <p className="text-sm text-muted">{scenario.impact}</p>
        </div>
      </div>
    )
  }
  return (
    <div className="scene-in flex items-start gap-3 rounded-xl border border-success/40 bg-success-soft p-4">
      <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
      <div className="flex flex-col gap-1">
        <p className="font-semibold text-ink">Attack waa la joojiyey</p>
        <p className="text-sm text-muted">
          Waxaa joojiyey: <span className="font-medium text-ink">{result.blockedBy}</span>.
          Shared cache-ka marnaba ma kaydin nuqulkii weeraryahanka.
        </p>
      </div>
    </div>
  )
}

function TraceCard({ result, running }: { result: AttackResult | null; running: boolean }) {
  return (
    <SectionCard title="Request trace" icon={<Flag className="size-4" />}>
      {!result && !running && (
        <p className="text-sm text-muted">
          Fuli attack si aad ula socoto request-ka dhex mara cache iyo origin — tallaabo tallaabo.
        </p>
      )}
      {running && <p className="text-sm text-muted">Raad-raacaya request-ka dhex mara CDN…</p>}
      {result && (
        <ol className="flex flex-col gap-0">
          {result.trace.map((s, i) => (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span
                  className={cn(
                    'grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold',
                    s.status === 'ok' && 'border-success/40 bg-success-soft text-success',
                    s.status === 'block' && 'border-success/40 bg-success-soft text-success',
                    s.status === 'warn' && 'border-warning/40 bg-warning-soft text-warning',
                    s.status === 'info' && 'border-line bg-surface-2 text-faint',
                  )}
                >
                  {s.status === 'ok' ? (
                    <ShieldAlert className="size-3.5" />
                  ) : s.status === 'block' ? (
                    <Check className="size-3.5" />
                  ) : s.status === 'warn' ? (
                    <AlertTriangle className="size-3.5" />
                  ) : (
                    i + 1
                  )}
                </span>
                {i < result.trace.length - 1 && <span className="my-0.5 w-px flex-1 bg-line" />}
              </div>
              <div className="pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-faint">
                    {s.phase}
                  </span>
                  <span className="text-sm font-medium text-ink">{s.label}</span>
                </div>
                <p className="text-sm text-muted">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>
      )}
    </SectionCard>
  )
}

function DefenseCard({
  scenario,
  defense,
  set,
  changed,
  defended,
  onApplyRecommended,
  onRunDefense,
  running,
}: {
  scenario: LabScenario
  defense: Defense
  set: <K extends DefenseKey>(key: K, value: Defense[K]) => void
  changed: boolean
  defended: boolean
  onApplyRecommended: () => void
  onRunDefense: () => void
  running: boolean
}) {
  return (
    <SectionCard
      title="Guddi Difaac"
      icon={<Lock className="size-4" />}
      action={
        defended ? (
          <Badge tone="success">
            <Check className="size-3" /> La difaacay
          </Badge>
        ) : undefined
      }
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-muted">
          Adigu hadda waxaad tahay difaacaha. Beddel kontoroolada hoose, ka dibna dib u orod isla
          attack-kii. Ka dhig inuu guuldareysto.
        </p>

        {scenario.controls.map((key) => {
          const meta = DEFENSE_META[key]
          return (
            <div key={key} className="flex items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-medium text-ink">
                  {meta.label}
                  <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-faint">
                    {meta.side}
                  </span>
                </p>
                <p className="text-[12px] text-muted">{meta.hint}</p>
              </div>
              <Switch
                checked={defense[key]}
                onCheckedChange={(v) => set(key, v)}
                label={meta.label}
              />
            </div>
          )
        })}

        <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
          <Button variant="secondary" onClick={onApplyRecommended} disabled={running}>
            Difaacyada la taliyay dhaqan geli
          </Button>
          <Button variant="primary" loading={running} onClick={onRunDefense}>
            Dib u orod attack
          </Button>
          {changed && <span className="text-[12px] text-faint">Qaabeynta waa la beddelay</span>}
        </div>

        {defended && (
          <p className="rounded-lg border border-success/40 bg-success-soft p-3 text-sm text-muted">
            Isla attack-kii hadda waa la diiday. Istaraatijiyadda la taliyay:{' '}
            <span className="font-medium text-ink">
              {scenario.controls
                .filter((k) => scenario.secure[k])
                .map((k) => DEFENSE_META[k].label)
                .join(', ') || 'defense-in-depth'}
            </span>
            .
          </p>
        )}
      </div>
    </SectionCard>
  )
}

function VictimCard({ scenario }: { scenario: LabScenario }) {
  return (
    <SectionCard title="Dhibbanaha" icon={<User className="size-4" />}>
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="grid size-10 place-items-center rounded-full bg-brand-soft text-brand">
            <User className="size-5" />
          </span>
          <div>
            <p className="text-sm font-semibold text-ink">{scenario.victim.name}</p>
            <p className="font-mono text-[11px] text-faint">{scenario.victim.site}</p>
          </div>
        </div>
        <p className="text-sm text-muted">{scenario.victim.disclosure}</p>
        <div className="flex items-center gap-2 rounded-lg border border-line bg-surface-2 px-3 py-2 text-[12px] text-muted">
          <Database className="size-3.5 text-warning" />
          {scenario.mode === 'deception'
            ? 'authenticated response, shared cache'
            : 'Wuxuu cache-ka u aaminan yahay URL-kan'}
        </div>
      </div>
    </SectionCard>
  )
}

function ObjectivesCard({ scenario, solved }: { scenario: LabScenario; solved: boolean }) {
  return (
    <SectionCard
      title="Ujeeddooyinka"
      icon={<Target className="size-4" />}
      action={
        solved ? (
          <Badge tone="success">
            <Check className="size-3" /> La xaliyey
          </Badge>
        ) : (
          <Badge tone="neutral">{scenario.mode === 'deception' ? 'Deception' : 'Poison'}</Badge>
        )
      }
    >
      <ul className="flex flex-col gap-2.5">
        {scenario.objectives.map((o, i) => (
          <li key={i} className="flex gap-2.5 text-sm text-muted">
            <span className="mt-0.5 grid size-[1.125rem] shrink-0 place-items-center rounded-full border border-line-strong text-[10px] text-faint">
              {i + 1}
            </span>
            {o}
          </li>
        ))}
      </ul>
    </SectionCard>
  )
}

function HintsCard({ scenario }: { scenario: LabScenario }) {
  const [open, setOpen] = useState(false)
  return (
    <SectionCard title="Talooyin" icon={<Lightbulb className="size-4" />}>
      {!open ? (
        <Button variant="secondary" size="sm" onClick={() => setOpen(true)}>
          Muuji talooyinka
        </Button>
      ) : (
        <ul className="flex flex-col gap-2.5">
          {scenario.hints.map((h, i) => (
            <li key={i} className="flex gap-2.5 text-sm text-muted">
              <Lightbulb className="mt-0.5 size-4 shrink-0 text-warning" />
              {h}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}

function WalkthroughCard({ scenario }: { scenario: LabScenario }) {
  const [open, setOpen] = useState(false)
  return (
    <Card className="overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-2 px-4 py-3 text-left"
      >
        <span className="text-brand">
          <Flag className="size-4" />
        </span>
        <span className="text-sm font-semibold text-ink">Hagitaan talaabo-talaabo</span>
        <ChevronDown
          className={cn('ml-auto size-4 text-muted transition-transform', open && 'rotate-180')}
        />
      </button>
      {open && (
        <div className="flex flex-col gap-4 border-t border-line p-4">
          {scenario.walkthrough.map((w, i) => (
            <div key={i} className="flex flex-col gap-1">
              <p className="text-sm font-semibold text-ink">{w.title}</p>
              <p className="text-sm leading-relaxed text-muted">{w.body}</p>
            </div>
          ))}
          <div className="rounded-lg border border-brand/30 bg-brand-soft p-3">
            <p className="text-sm font-semibold text-ink">Casharka</p>
            <p className="mt-1 text-sm text-muted">{scenario.takeaway}</p>
          </div>
        </div>
      )}
    </Card>
  )
}
