import { AlertTriangle, Check, Play, ShieldAlert, ShieldCheck, Terminal } from 'lucide-react'
import { useState } from 'react'
import type { AttackResult, Defense, DefenseKey, LabScenario } from '@/lib/lab'
import { ALL_DEFENSES_OFF, DEFENSE_META, INJECT_POINTS, requestSnippet, runCache, t } from '@/lib/lab'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Segmented } from '@/components/ui/Segmented'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/utils'

const REFLECTIONS: { value: LabScenario['reflection']; key: string }[] = [
  { value: 'host-in-script', key: 'pg.ref.host_script' },
  { value: 'host-in-html', key: 'pg.ref.host_link' },
  { value: 'host-in-redirect', key: 'pg.ref.host_redirect' },
  { value: 'scheme-redirect', key: 'pg.ref.scheme_redirect' },
  { value: 'param-reflected', key: 'pg.ref.param_html' },
  { value: 'cookie-reflected', key: 'pg.ref.cookie_html' },
  { value: 'ip-reflected', key: 'pg.ref.xff_html' },
  { value: 'path-smuggled', key: 'pg.ref.route_override' },
]

const INJECT_IDS = [
  'x-forwarded-host',
  'x-host',
  'forwarded',
  'x-forwarded-scheme',
  'x-forwarded-for',
  'user-agent',
  'query-unkeyed',
  'query-cloak',
  'query-fat',
  'cookie-unkeyed',
  'x-original-url',
  'x-rewrite-url',
]

export default function Playground() {
  const [mode, setMode] = useState<'poison' | 'deception'>('poison')
  const [site, setSite] = useState('shop.example')
  const [path, setPath] = useState('/en/home')
  const [inject, setInject] = useState('x-forwarded-host')
  const [payload, setPayload] = useState(INJECT_POINTS['x-forwarded-host'].defaultPayload)
  const [reflection, setReflection] = useState<LabScenario['reflection']>('host-in-script')
  const [defense, setDefense] = useState<Defense>(ALL_DEFENSES_OFF)
  const [result, setResult] = useState<AttackResult | null>(null)

  const set = <K extends DefenseKey>(key: K, value: Defense[K]) =>
    setDefense({ ...defense, [key]: value })

  const switchMode = (m: 'poison' | 'deception') => {
    setMode(m)
    setResult(null)
    if (m === 'deception') {
      setPath('/account/profile')
      setInject('path-extension')
      setPayload(INJECT_POINTS['path-extension'].defaultPayload)
    }
  }

  const deceptionInjects = ['path-extension', 'path-delimiter', 'path-encoded', 'path-traversal']

  return (
    <div className="container-page py-10">
      <header className="mb-8 flex flex-col gap-3">
        <Badge tone="accent" className="w-fit">
          <Terminal className="size-3" /> {t('pg.badge')}
        </Badge>
        <h1 className="text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {t('pg.title')}
        </h1>
        <p className="max-w-2xl text-muted">{t('pg.intro')}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="text-sm font-semibold text-ink">{t('pg.target')}</h2>
              <Segmented
                aria-label="Mode"
                size="sm"
                value={mode}
                onChange={(v) => switchMode(v)}
                options={[
                  { value: 'poison', label: t('pg.mode_poison') },
                  { value: 'deception', label: t('pg.mode_deception') },
                ]}
              />
            </div>
            <div className="flex flex-col gap-3">
              <Field label={t('pg.site')} value={site} onChange={setSite} mono />
              <Field
                label={t(mode === 'deception' ? 'pg.private_path' : 'pg.endpoint_path')}
                value={path}
                onChange={setPath}
                mono
              />
              <div className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-faint">
                  {t(mode === 'deception' ? 'pg.disguise_url_with' : 'pg.unkeyed_input')}
                </span>
                <select
                  value={inject}
                  onChange={(e) => {
                    setInject(e.target.value)
                    setPayload(INJECT_POINTS[e.target.value].defaultPayload)
                  }}
                  className="h-10 rounded-md border border-line bg-surface-2 px-3 font-mono text-[13px] text-ink outline-none focus:border-brand"
                >
                  {(mode === 'deception' ? deceptionInjects : INJECT_IDS).map((id) => (
                    <option key={id} value={id}>
                      {INJECT_POINTS[id].label} — {INJECT_POINTS[id].blurb}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label={t(mode === 'deception' ? 'pg.url_suffix' : 'pg.payload')}
                value={payload}
                onChange={setPayload}
                mono
              />
              {mode === 'poison' && (
                <div className="flex flex-col gap-1.5">
                  <span className="text-[11px] font-semibold uppercase tracking-wide text-faint">
                    {t('pg.reflection')}
                  </span>
                  <select
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value as LabScenario['reflection'])}
                    className="h-10 rounded-md border border-line bg-surface-2 px-3 text-[13px] text-ink outline-none focus:border-brand"
                  >
                    {REFLECTIONS.map((r) => (
                      <option key={r.value} value={r.value}>
                        {t(r.key)}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="mb-4 text-sm font-semibold text-ink">{t('pg.cache_rules')}</h2>
            <div className="flex flex-col gap-3.5">
              {(Object.keys(DEFENSE_META) as DefenseKey[]).map((key) => (
                <div key={key} className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-ink">{DEFENSE_META[key].label}</p>
                    <p className="text-[11px] text-muted">{DEFENSE_META[key].hint}</p>
                  </div>
                  <Switch
                    checked={defense[key]}
                    onCheckedChange={(v) => set(key, v)}
                    label={DEFENSE_META[key].label}
                  />
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="flex flex-col gap-5">
          <Card className="p-5">
            <div className="mb-3 flex items-center gap-2">
              <h2 className="text-sm font-semibold text-ink">{t('pg.request')}</h2>
              <Button
                variant="danger"
                size="sm"
                className="ml-auto"
                onClick={() => setResult(runCache(buildScenario(), defense, { inject, payload }))}
              >
                <Play className="size-3.5 fill-current" /> {t('pg.run')}
              </Button>
            </div>
            <CodeBlock code={requestSnippet(buildScenario(), { inject, payload })} title={`https://${site}`} wrap />
          </Card>

          {result && (
            <div
              className={cn(
                'flex items-start gap-3 rounded-xl border p-4',
                result.pwned
                  ? 'border-danger/40 bg-danger-soft'
                  : 'border-success/40 bg-success-soft',
              )}
            >
              {result.pwned ? (
                <ShieldAlert className="mt-0.5 size-5 shrink-0 text-danger" />
              ) : (
                <ShieldCheck className="mt-0.5 size-5 shrink-0 text-success" />
              )}
              <div>
                <p className="font-semibold text-ink">
                  {t(result.pwned ? 'pg.attack_succeeded' : 'pg.attack_blocked')}
                </p>
                <p className="text-sm text-muted">
                  {result.pwned
                    ? t('pg.now_serves')
                    : t('pg.stopped_by').replace('{blockedBy}', String(result.blockedBy))}
                </p>
              </div>
            </div>
          )}

          {result && (
            <Card className="p-5">
              <h2 className="mb-3 text-sm font-semibold text-ink">{t('pg.trace')}</h2>
              <ol className="flex flex-col gap-3">
                {result.trace.map((s, i) => (
                  <li key={i} className="flex gap-3">
                    <span
                      className={cn(
                        'mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border text-[10px] font-bold',
                        s.status === 'ok' && 'border-success/40 bg-success-soft text-success',
                        s.status === 'block' && 'border-success/40 bg-success-soft text-success',
                        s.status === 'warn' && 'border-warning/40 bg-warning-soft text-warning',
                        s.status === 'info' && 'border-line bg-surface-2 text-muted',
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
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
                        {s.phase}
                      </p>
                      <p className="text-sm font-medium text-ink">{s.label}</p>
                      <p className="text-sm text-muted">{s.detail}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          )}
        </div>
      </div>
    </div>
  )

  function buildScenario(): LabScenario {
    const accepts = mode === 'deception' ? deceptionInjects : [inject]
    return {
      id: 'playground',
      title: 'Playground',
      stage: 'beginner',
      category: 'Custom',
      mode,
      summary: '',
      takeaway: '',
      victim: { name: 'Victim', site, disclosure: 'Signed-in user.' },
      path,
      injects: accepts,
      accepts,
      reflection,
      impact:
        mode === 'deception'
          ? 'The private page is cached under a static-looking URL and served to the attacker.'
          : 'A shared cache entry now serves the attacker-controlled response to every visitor.',
      secret: mode === 'deception' ? 'private account data' : undefined,
      defense,
      secure: defense,
      controls: [],
      objectives: [],
      hints: [],
      walkthrough: [],
    }
  }
}

function Field({
  label,
  value,
  onChange,
  mono,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  mono?: boolean
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-faint">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-10 rounded-md border border-line bg-surface-2 px-3 text-sm text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-[var(--brand-ring)]',
          mono && 'font-mono text-[13px]',
        )}
      />
    </label>
  )
}
