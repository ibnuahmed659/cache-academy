import {
  AlertTriangle,
  ArrowRight,
  Bug,
  Check,
  Database,
  Eye,
  Flag,
  Globe,
  Info,
  Lightbulb,
  Lock,
  LockOpen,
  RotateCcw,
  Send,
  ShieldAlert,
  ShieldCheck,
  Target,
  User,
  Wrench,
} from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import type { AttackResult, Defense, DefenseKey, LabScenario, TraceStatus } from '@/lib/lab'
import { DEFENSE_META, INJECT_POINTS, requestSnippet, runCache } from '@/lib/lab'
import { useProgress } from '@/lib/progress'
import { BrowserChrome } from './BrowserChrome'
import { ProxyPanel, type Exchange } from './ProxyPanel'
import { type Finding, type HttpHeader, type HttpRequest, type HttpResponse } from './HttpInspector'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { CodeBlock } from '@/components/ui/CodeBlock'
import { Switch } from '@/components/ui/Switch'
import { cn } from '@/lib/utils'

const ATTACKER_ORIGIN = 'https://evil.example'
const ATTACKER_PAGE = `${ATTACKER_ORIGIN}/deal-of-the-day`
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'

type StepId = 'brief' | 'recon' | 'craft' | 'fire' | 'impact' | 'defend' | 'recap'

const STEPS: { id: StepId; label: string; icon: typeof Target }[] = [
  { id: 'brief', label: 'Hordhac', icon: Target },
  { id: 'recon', label: 'Sahmin', icon: Eye },
  { id: 'craft', label: 'Diyaari', icon: Bug },
  { id: 'fire', label: 'Fuli', icon: Send },
  { id: 'impact', label: 'Saamaynta', icon: ShieldAlert },
  { id: 'defend', label: 'Difaac', icon: ShieldCheck },
  { id: 'recap', label: 'Soo koobid', icon: Lightbulb },
]

const enc = (s: string) => encodeURIComponent(s)
const asPath = (s: string) => (s.startsWith('/') ? s : `/${s}`)

export function InteractiveLab({ scenario }: { scenario: LabScenario }) {
  const { markLabSolved } = useProgress()
  const isDeception = scenario.mode === 'deception'
  const origin = `https://${scenario.victim.site}`
  const targetUrl = `${origin}${scenario.path}`

  const [step, setStep] = useState(0)
  const [maxStep, setMaxStep] = useState(0)

  const [inject, setInject] = useState(scenario.injects[0])
  const [payload, setPayload] = useState(INJECT_POINTS[scenario.injects[0]].defaultPayload)
  const [deployed, setDeployed] = useState(false)

  const [history, setHistory] = useState<Exchange[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const nextId = useRef(1)
  const [lastResult, setLastResult] = useState<AttackResult | null>(null)
  const [running, setRunning] = useState(false)

  const [defense, setDefense] = useState<Defense>(scenario.defense)
  const [pwnedOnce, setPwnedOnce] = useState(false)
  const [defendedOnce, setDefendedOnce] = useState(false)

  const suffix = asPath(payload.trim())
  const craftedUrl = `${origin}${scenario.path}${suffix}`
  const solved = pwnedOnce && defendedOnce

  useEffect(() => {
    if (solved) markLabSolved(scenario.id)
  }, [solved, markLabSolved, scenario.id])

  // Capture the victim's initial (legitimate) page load.
  useEffect(() => {
    const ex = legitExchange()
    setHistory([ex])
    setSelectedId(ex.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const goto = (i: number) => {
    setStep(i)
    setMaxStep((m) => Math.max(m, i))
  }

  /* ---------------- engine ---------------- */
  const pickInject = (id: string) => {
    setInject(id)
    setPayload(INJECT_POINTS[id].defaultPayload)
  }

  const evaluate = (): AttackResult => runCache(scenario, defense, { inject, payload })

  function legitExchange(): Exchange {
    const id = nextId.current++
    const request: HttpRequest = {
      method: 'GET',
      path: scenario.path,
      headers: [
        { name: 'Host', value: scenario.victim.site },
        { name: 'User-Agent', value: UA, flag: 'muted' },
        { name: 'Cookie', value: `session=${scenario.victim.name.toLowerCase()}_2f9c7d`, flag: 'good' },
      ],
    }
    const response: HttpResponse = {
      status: '200 OK',
      headers: [
        { name: 'Content-Type', value: isDeception ? 'text/html; charset=utf-8' : 'text/html; charset=utf-8' },
        { name: 'Cache-Control', value: isDeception ? 'private, no-cache' : 'public, max-age=600' },
        { name: 'X-Cache', value: 'MISS', flag: 'muted' },
      ],
      body: isDeception ? victimBody('private') : victimBody('normal'),
    }
    const findings: Finding[] = isDeception
      ? [
          {
            level: 'info',
            title: 'Bog private oo session-ka ku xidhan',
            detail:
              'Response-kan waxaa lala xiriirayaa cookie-ga dhibanaha. Waa in aanu waligiis gelin cache wadaag ah.',
          },
        ]
      : [
          {
            level: 'info',
            title: 'Codsiga caadiga ah ee dhibanaha',
            detail:
              'Browser-ku wuxuu u soo dirayaa ' +
              scenario.path +
              ' isagoo wata cookie-ga session-ka. Cache key-gu waa scheme + host + path.',
          },
        ]
    return { id, kind: 'same-origin', request, response, findings }
  }

  function attackRequest(): HttpRequest {
    const ip = INJECT_POINTS[inject]
    const headers: HttpHeader[] = [{ name: 'Host', value: scenario.victim.site }]
    let path = scenario.path

    if (isDeception) {
      path = scenario.path + suffix
      headers.push({
        name: 'Cookie',
        value: `session=${scenario.victim.name.toLowerCase()}_2f9c7d`,
        flag: 'good',
      })
    } else if (ip.kind === 'header') {
      headers.push({ name: ip.field, value: payload.trim() || ip.defaultPayload, flag: 'suspect', note: ip.blurb })
    } else if (ip.kind === 'cookie') {
      headers.push({ name: 'Cookie', value: `${ip.field}=${enc(payload.trim() || ip.defaultPayload)}`, flag: 'suspect', note: ip.blurb })
    } else if (ip.kind === 'query') {
      const sep = scenario.path.includes('?') ? '&' : '?'
      path = `${scenario.path}${sep}${ip.field}=${enc(payload.trim() || ip.defaultPayload)}`
    } else if (ip.kind === 'path') {
      path = asPath(payload.trim() || ip.defaultPayload)
    }
    headers.push({ name: 'User-Agent', value: UA, flag: 'muted' })
    return { method: 'GET', path, headers }
  }

  function makePending(): Exchange {
    const id = nextId.current++
    return {
      id,
      kind: isDeception ? 'same-origin' : 'cross-site',
      request: attackRequest(),
      response: null,
      findings: [
        {
          level: 'warning',
          title: 'Codsiga xun ayaa la qabtay',
          detail: isDeception
            ? 'Dhibanuhu wuxuu furayaa URL u eg fayl static. Fiirso in cache-ku u arki doono mid la keydin karo.'
            : 'Weeraryahanku wuxuu dirayaa codsi leh input aan cache key-gu ka reebin. Halkan ayaa cache-ka la wasakhayn karaa.',
        },
      ],
      pending: true,
    }
  }

  function blockedHeaders(): HttpHeader[] {
    return [
      { name: 'Content-Type', value: 'text/html; charset=utf-8' },
      { name: 'X-Cache', value: 'BYPASS', flag: 'good' },
      { name: 'Cache-Control', value: 'no-store', flag: 'good' },
    ]
  }

  function completeAttack(ex: Exchange, res: AttackResult): Exchange {
    const done: Exchange = { ...ex, pending: false, pwned: res.pwned, blockedBy: res.blockedBy }
    if (res.pwned) {
      done.response = {
        status: '200 OK',
        headers: [
          { name: 'Content-Type', value: 'text/html; charset=utf-8' },
          { name: 'Cache-Control', value: 'public, max-age=600' },
          { name: 'X-Cache', value: 'MISS', flag: 'muted' },
          { name: 'Age', value: '0' },
        ],
        body: isDeception ? victimBody('private') : victimBody('poisoned'),
      }
      done.findings = isDeception
        ? [
            {
              level: 'danger',
              title: 'Bog private ah ayaa la cache-gareeyay',
              detail:
                'Cache-ku wuxuu u aqoonsaday URL-ka mid static ah wuxuuna kaydiyay response-ka private. Hadda waa entry cache wadaag ah.',
            },
          ]
        : [
            {
              level: 'danger',
              title: 'Input aan la keyin la soo celiyey oo la kaydiyey',
              detail: `Origin-ku wuxuu soo celiyey qiimaha ${INJECT_POINTS[inject].field} wuxuuna cache-ku ku kaydiyay hoos ${scenario.path}.`,
            },
          ]
    } else {
      done.response = { status: '200 OK', headers: blockedHeaders(), body: `blocked: ${res.blockedBy}` }
      done.findings = [
        {
          level: 'success',
          title: 'Cache-ku waligiis ma kaydin sunta',
          detail: `Waxaa joojiyay ${res.blockedBy}.`,
        },
      ]
    }
    return done
  }

  function victimHitExchange(): Exchange {
    const id = nextId.current++
    return {
      id,
      kind: 'same-origin',
      request: {
        method: 'GET',
        path: scenario.path,
        headers: [
          { name: 'Host', value: scenario.victim.site },
          { name: 'User-Agent', value: UA, flag: 'muted' },
        ],
      },
      response: {
        status: '200 OK',
        headers: [
          { name: 'Content-Type', value: 'text/html; charset=utf-8' },
          { name: 'X-Cache', value: 'HIT', flag: 'suspect' },
          { name: 'Age', value: '37' },
        ],
        body: victimBody('poisoned'),
      },
      findings: [
        {
          level: 'danger',
          title: 'Cache HIT — nuqul la wasakheeyey',
          detail:
            'Cache-ku wuxuu soo celiyay nuqulkii weeraryahanka isagoo aan origin-ka taaban. Booqde kasta wuxuu helayaa isla jawaabta.',
        },
      ],
      pwned: true,
    }
  }

  function readbackExchange(): Exchange {
    const id = nextId.current++
    return {
      id,
      kind: 'cross-site',
      request: {
        method: 'GET',
        path: `${scenario.path}${suffix}`,
        headers: [
          { name: 'Host', value: scenario.victim.site },
          { name: 'User-Agent', value: UA, flag: 'muted' },
        ],
      },
      response: {
        status: '200 OK',
        headers: [
          { name: 'Content-Type', value: 'text/html; charset=utf-8' },
          { name: 'X-Cache', value: 'HIT', flag: 'suspect' },
          { name: 'Age', value: '18' },
        ],
        body: victimBody('leaked'),
      },
      findings: [
        {
          level: 'danger',
          title: 'Xog private oo la shaaciyey',
          detail: 'Ma jiro cookie loo baahnaa - cache-ku wuxuu si toos ah u siiyey bogga private ee dhibanaha.',
        },
      ],
      pwned: true,
    }
  }

  function sendAttack() {
    if (!deployed) return
    const ex = makePending()
    setHistory((h) => [...h, ex])
    setSelectedId(ex.id)
    goto(3)
  }

  function forwardPending() {
    const ex = history.find((h) => h.id === selectedId && h.pending)
    if (!ex) return
    setRunning(true)
    window.setTimeout(() => {
      const res = evaluate()
      const done = completeAttack(ex, res)
      setHistory((h) => h.map((x) => (x.id === ex.id ? done : x)))
      setSelectedId(ex.id)
      setLastResult(res)
      setRunning(false)
      if (res.pwned) setPwnedOnce(true)
      else setDefendedOnce(true)
    }, 500)
  }

  function dropPending() {
    setHistory((h) => h.filter((x) => !(x.id === selectedId && x.pending)))
  }

  const showImpact = () => {
    if (lastResult?.pwned) {
      const ex = isDeception ? readbackExchange() : victimHitExchange()
      setHistory((h) => [...h, ex])
      setSelectedId(ex.id)
    }
    goto(4)
  }

  const retest = () => {
    const ex = makePending()
    setHistory((h) => [...h, ex])
    setSelectedId(ex.id)
    setRunning(true)
    window.setTimeout(() => {
      const res = evaluate()
      const done = completeAttack(ex, res)
      setHistory((h) => h.map((x) => (x.id === ex.id ? done : x)))
      setSelectedId(ex.id)
      setLastResult(res)
      setRunning(false)
      if (res.pwned) setPwnedOnce(true)
      else setDefendedOnce(true)
    }, 450)
  }

  const restore = () => {
    setDefense(scenario.defense)
    setLastResult(null)
  }

  const setDef = <K extends DefenseKey>(key: K, value: Defense[K]) =>
    setDefense((d) => ({ ...d, [key]: value }))

  const current = STEPS[step].id
  const compromised = lastResult?.pwned === true

  const bookmarks = [
    { label: `Bartilmaameed · ${scenario.victim.site}`, url: targetUrl },
    ...(isDeception ? [{ label: 'Link la khiyaaneeyey', url: craftedUrl }] : []),
  ]

  const proxy = (
    <ProxyPanel
      exchanges={history}
      selectedId={selectedId}
      onSelect={setSelectedId}
      onForward={forwardPending}
      onDrop={dropPending}
      title={current === 'fire' ? 'Proxy-ga dhexgeliya' : 'Taariikhda HTTP'}
      toolbar={
        current === 'defend' ? (
          <Button variant="danger" size="sm" onClick={retest} disabled={running}>
            <Send className="size-3.5" /> Mar kale orodsi
          </Button>
        ) : undefined
      }
    />
  )

  return (
    <div className="flex flex-col gap-6">
      <Stepper steps={STEPS} active={step} maxReached={maxStep} onSelect={goto} locked={{ impact: !lastResult }} />

      <div className="flex min-w-0 flex-col gap-6">
        {/* ---------------- Briefing ---------------- */}
        {current === 'brief' && (
          <Card className="p-6">
            <StepHeader kicker="Warbixinta howsha" title={scenario.title}>
              {scenario.summary} Waxaad tahay weeraryahanka: cache wadaag ah ayaa horyaalla {origin}. Hadafkaagu
              waa inaad {isDeception ? 'ka dhigto cache-ku inuu kaydiyo bog private' : 'wasakhayso nuqulka la wadaago'}.
            </StepHeader>

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <InfoTile icon={<Database className="size-4" />} title="Cache key-gu">
                Cache-ku wuxuu wax ku keydiyaa kaliya <span className="font-mono">scheme + host + path</span>.
                Wax kasta oo kale waa <span className="font-mono">unkeyed</span> — halkaas ayaa jabku ku jiraa.
              </InfoTile>
              <InfoTile icon={<Bug className="size-4" />} title={isDeception ? 'Kala-saarka URL-ka' : 'Input aan la keyin'}>
                {isDeception ? (
                  <>
                    Cache-ku wuxuu URL-ka ku kala saaraa extension-ka; origin-kuna wuxuu ku kala saaraa route-ka.
                    Labadaa isma raacaan.
                  </>
                ) : (
                  <>
                    Origin-ku wuxuu bogga ka dhisaa <span className="font-mono">{INJECT_POINTS[inject].field}</span>,
                    laakiin cache key-gu header-kaas ma ku jiro.
                  </>
                )}
              </InfoTile>
              <InfoTile icon={<Target className="size-4" />} title="Hadafkaaga">
                {isDeception ? (
                  <>
                    U dir dhibanaha link la khiyaaneeyey, kadibna <span className="font-mono text-danger">akhri cache-ka</span>{' '}
                    adigoon haysan session.
                  </>
                ) : (
                  <>
                    Hal codsi oo la diray ayaa booqde kasta u soo bandhigaya bog la{' '}
                    <span className="font-mono text-danger">wasakheeyey</span>.
                  </>
                )}
              </InfoTile>
            </div>

            <div className="mt-6 flex items-center gap-3">
              <Button variant="forge" onClick={() => goto(1)}>
                Bilow — sahmi codsiga <ArrowRight className="size-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ---------------- Recon ---------------- */}
        {current === 'recon' && (
          <Card className="p-6">
            <StepHeader kicker="Tallaabo 1 — sahmin" title="Fiirso codsiga dhabta ah iyo cache key-ga">
              {scenario.victim.name} wuxuu soo galay <span className="font-mono">{scenario.victim.site}</span>.
              Proxy-gu wuxuu qabtay codsigii ugu horreeyay — baar headers-ka, cache key-ga, iyo waxa la keydiyay.
            </StepHeader>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
              <BrowserChrome
                kind="victim"
                url={targetUrl}
                tabTitle={`${scenario.victim.site}${scenario.path}`}
                bookmarks={bookmarks}
                identity={<IdentityChip name={scenario.victim.name} />}
              >
                <SitePage scenario={scenario} variant={isDeception ? 'private' : 'normal'} />
              </BrowserChrome>
              {proxy}
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-lg border border-brand/30 bg-brand-soft p-4">
              <Info className="mt-0.5 size-4 shrink-0 text-brand" />
              <p className="text-sm leading-relaxed text-muted">
                {isDeception ? (
                  <>
                    Boggan waa <span className="font-semibold text-ink">private</span> oo wuxuu ku xidhan yahay
                    cookie-ga. Cache-ku ma aha inuu keydiyo — laakiin URL-ka oo dheeraad ah ayaa khiyaanayn kara.
                  </>
                ) : (
                  <>
                    Cache key-gu waa <span className="font-mono">scheme + host + path</span>. Fiiri tab-ka{' '}
                    <span className="font-semibold text-ink">Aragtiyo</span> si aad u aragto waxa aan la keydin.
                  </>
                )}
              </p>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Button variant="forge" onClick={() => goto(2)}>
                Diyaari dabinka <ArrowRight className="size-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ---------------- Craft ---------------- */}
        {current === 'craft' && (
          <Card className="p-6">
            <StepHeader
              kicker="Tallaabo 2 — diyaari"
              title={isDeception ? 'Samee URL u eg fayl static' : `Samee codsi soo celiya ${INJECT_POINTS[inject].field}`}
            >
              {isDeception ? (
                <>
                  Ku dar suffix static ah bogga private <span className="font-mono">{scenario.path}</span> si cache-ku
                  u arko asset. Kadibna u dir dhibanaha link-ga.
                </>
              ) : (
                <>
                  Dooro input aan key lahayn oo payload xun. Dhaji kadibna dir hal codsi si aad u prime-gareyso cache-ka.
                </>
              )}
            </StepHeader>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
              <PayloadPanel
                scenario={scenario}
                inject={inject}
                payload={payload}
                onPickInject={pickInject}
                onPayload={setPayload}
              />

              <div className="flex min-w-0 flex-col gap-3">
                <BrowserChrome
                  kind="attacker"
                  url={ATTACKER_PAGE}
                  tabTitle="Deal of the day!"
                  trusted={false}
                >
                  <AttackerLure />
                </BrowserChrome>
                <Collapse title="Sababta cache-ku u khiyaanaysto" icon={<Info className="size-4" />}>
                  {isDeception ? (
                    <>
                      Cache-ku wuxuu go'aamiyaa waxa uu keydiyo isagoo eegaya <span className="font-medium text-ink">URL</span>,
                      halka origin-ku eegayo <span className="font-medium text-ink">content-ka</span>. Marka labaduba iswaafaqsan
                      waayaan, bog private ayaa si qaldan loo keydiyaa.
                    </>
                  ) : (
                    <>
                      Origin-ku wuxuu aaminsan yahay header-ka wuxuuna ku dhisaa jawaabta; cache-ku se ma uu aqoonsado inuu
                      qiimaha beddelo — sidaas darteed wuxuu kaydiyaa nuqul keliya oo dhammaan la wadaagaan.
                    </>
                  )}
                </Collapse>
              </div>
            </div>

            <div className="mt-5">
              <Hints hints={scenario.hints} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button variant="secondary" onClick={() => setDeployed(true)}>
                <Wrench className="size-4" /> {isDeception ? 'Diyaari link-ga' : 'Diyaari codsiga'}
              </Button>
              <Button variant="forge" onClick={sendAttack} disabled={!deployed}>
                <Send className="size-4" /> {isDeception ? `Dir ${scenario.victim.name}` : 'Fuli sunta'}
              </Button>
              {deployed && (
                <span className="inline-flex items-center gap-1.5 text-[12.5px] text-success">
                  <Check className="size-3.5" /> Waa la diyaarsaday.
                </span>
              )}
            </div>
          </Card>
        )}

        {/* ---------------- Fire ---------------- */}
        {current === 'fire' && (
          <Card className="p-6">
            <StepHeader
              kicker="Tallaabo 3 — fulinta"
              title={isDeception ? `${scenario.victim.name} wuxuu furayaa link-ga la khiyaaneeyey` : 'Codsiga xun wuxuu gaarayaa origin-ka'}
            >
              Proxy-gu wuxuu qabtay codsiga. Fiirso in cache-ku uu kaydin doono. Dabadeed{' '}
              <strong>U gudbi</strong> codsiga si aad u aragto go'aanka cache-ka.
            </StepHeader>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
              {isDeception ? (
                <BrowserChrome
                  kind="victim"
                  url={craftedUrl}
                  tabTitle={`${scenario.victim.site}${scenario.path}${suffix}`}
                  bookmarks={bookmarks}
                  identity={<IdentityChip name={scenario.victim.name} />}
                >
                  <SitePage scenario={scenario} variant="private" submitting={running} />
                </BrowserChrome>
              ) : (
                <BrowserChrome kind="attacker" url={ATTACKER_PAGE} tabTitle="Deal of the day!" trusted={false}>
                  <AttackerLure submitting={running} />
                </BrowserChrome>
              )}
              {proxy}
            </div>

            {lastResult && (
              <div className="scene-in mt-5">
                <TraceList result={lastResult} />
                {lastResult.pwned ? (
                  <Banner tone="danger" icon={<ShieldAlert className="size-5" />} title="Cache-ka waa la wasakheeyey">
                    {isDeception
                      ? 'Cache-ku wuxuu kaydiyay bogga private. Hadda waxaa loo adeegayaa qof kasta oo codsada URL-kaas.'
                      : 'Origin-ku wuxuu soo celiyey payload-ka, cache-kuna wuxuu kaydiyay hoos ' + scenario.path + '.'}
                  </Banner>
                ) : (
                  <Banner tone="success" icon={<ShieldCheck className="size-5" />} title="Weerarka waa la joojiyay">
                    Waxaa joojiyay <span className="font-medium text-ink">{lastResult.blockedBy}</span>. Cache-ku
                    marnaba ma kaydin nuqulkii la farsameeyey.
                  </Banner>
                )}
              </div>
            )}

            <div className="mt-5 flex items-center gap-3">
              <Button variant="forge" onClick={showImpact} disabled={!lastResult}>
                {lastResult?.pwned ? (isDeception ? 'Akhri cache-ka' : 'Arag saamaynta') : 'U gudbi natiijada'}{' '}
                <ArrowRight className="size-4" />
              </Button>
              {!lastResult && (
                <span className="text-[12.5px] text-muted">U gudbi codsiga la qabtay si aad u sii wadato.</span>
              )}
            </div>
          </Card>
        )}

        {/* ---------------- Impact ---------------- */}
        {current === 'impact' && (
          <Card className="p-6">
            <StepHeader
              kicker="Tallaabo 4 — saamaynta"
              title={
                lastResult?.pwned
                  ? isDeception
                    ? 'Xogta private ee dhibanaha, iyada oo aan cookie la hayn'
                    : `Bogga ${scenario.victim.site}, isagoo aan ${scenario.victim.name} waxba samayn`
                  : 'Difaacu wuu istaagay'
              }
            >
              {lastResult?.pwned
                ? isDeception
                  ? 'Weeraryahanku hadda wuxuu soo qaadayaa URL-ka la khiyaaneeyey isagoon session lahayn — cache-ku wuxuu siiyaa bogga private.'
                  : 'Fur bogga: cache-ku wuxuu u adeegaa nuqul la wasakheeyey isagoo aan origin-ka taaban — booqde kasta.'
                : 'Cache-ku wuu diiday keydinta. Xaqiiji in aan nuxurka la beddelin oo aqoonso difaaca joojiyay.'}
            </StepHeader>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
              {lastResult?.pwned && isDeception ? (
                <BrowserChrome kind="attacker" url={craftedUrl} tabTitle={`${scenario.victim.site}${scenario.path}${suffix}`} trusted={false}>
                  <SitePage scenario={scenario} variant="leaked" />
                </BrowserChrome>
              ) : (
                <BrowserChrome
                  kind="victim"
                  url={targetUrl}
                  tabTitle={`${scenario.victim.site}${scenario.path}`}
                  bookmarks={bookmarks}
                  identity={<IdentityChip name={scenario.victim.name} />}
                >
                  <SitePage scenario={scenario} variant={lastResult?.pwned && !isDeception ? 'poisoned' : 'normal'} />
                </BrowserChrome>
              )}

              <div className="flex min-w-0 flex-col gap-4">
                <div className="grid grid-cols-2 gap-3">
                  <StateBox label="Hore" value={isDeception ? 'bog private, qarsoodi ah' : 'bog caadi ah'} />
                  <StateBox
                    label="Kadib"
                    value={lastResult?.pwned ? (isDeception ? scenario.secret ?? 'la shaaciyey' : 'HTML la wasakheeyey') : 'sidiisii'}
                    danger={lastResult?.pwned}
                  />
                </div>
                {proxy}
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <Button variant="forge" onClick={() => goto(5)}>
                Hadda difaac <ShieldCheck className="size-4" />
              </Button>
            </div>
          </Card>
        )}

        {/* ---------------- Defend ---------------- */}
        {current === 'defend' && (
          <Card className="p-6">
            <StepHeader kicker="Tallaabo 5 — difaac & dib-u-tijaabi" title="Xir cilladda, dabadeed mar kale weerar">
              Beddel kontoroolada cache-ka iyo origin-ka, dabadeed mar kale orodsi isla weerarkii. Xal wanaagsan ayaa
              weerarka fashilmiya <em>isagoon</em> ku tiirsanayn in weeraryahanku si wanaagsan u dhaqmo.
            </StepHeader>

            <div className="mt-5 grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
              <div className="flex min-w-0 flex-col gap-4">
                <BrowserChrome
                  kind={isDeception ? 'victim' : 'victim'}
                  url={isDeception ? craftedUrl : targetUrl}
                  tabTitle={`${scenario.victim.site}${scenario.path}`}
                  bookmarks={bookmarks}
                  identity={<IdentityChip name={scenario.victim.name} />}
                >
                  <SitePage
                    scenario={scenario}
                    variant={isDeception ? 'private' : compromised ? 'poisoned' : 'normal'}
                    onRestore={restore}
                  />
                </BrowserChrome>

                <DefensePanel
                  scenario={scenario}
                  defense={defense}
                  setDef={setDef}
                  onApplySecure={() => setDefense(scenario.secure)}
                  onResetVuln={() => setDefense(scenario.defense)}
                />
              </div>

              <div className="flex min-w-0 flex-col gap-4">
                {proxy}
                {lastResult && (
                  <div className="scene-in flex flex-col gap-3">
                    {lastResult.pwned ? (
                      <Banner tone="danger" icon={<ShieldAlert className="size-5" />} title="Weli nugul">
                        Weerarku wuu guuleystay. Daar difaacyo dheeraad ah oo mar kale isku day.
                      </Banner>
                    ) : (
                      <Banner tone="success" icon={<ShieldCheck className="size-5" />} title="Weerarka waa la xannibay">
                        Waxaa joojiyay <span className="font-medium text-ink">{lastResult.blockedBy}</span>.
                      </Banner>
                    )}
                    <TraceList result={lastResult} />
                  </div>
                )}
              </div>
            </div>

            {defendedOnce && (
              <div className="mt-5 flex items-center justify-between gap-4 rounded-lg border border-success/40 bg-success-soft p-4">
                <p className="text-sm text-muted">
                  <span className="font-semibold text-ink">La difaacay.</span> Weerarkii hore hadda waa la joojinayaa
                  ka hor inta uusan cache-ku wax xun kaydin.
                </p>
                <Button variant="success" onClick={() => goto(6)}>
                  Soo koobid & imtixaan <ArrowRight className="size-4" />
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* ---------------- Recap ---------------- */}
        {current === 'recap' && <RecapStep scenario={scenario} solved={solved} />}
      </div>

      {current !== 'recap' && (
        <aside className="flex flex-col gap-5 lg:sticky lg:top-20 lg:self-start">
          <CaseFile scenario={scenario} pwned={pwnedOnce} defended={defendedOnce} fired={lastResult != null} />
          <PostureCard scenario={scenario} defense={defense} />
        </aside>
      )}
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Stepper / header / tiles
 * ------------------------------------------------------------------ */
function Stepper({
  steps,
  active,
  maxReached,
  onSelect,
  locked,
}: {
  steps: { id: StepId; label: string; icon: typeof Target }[]
  active: number
  maxReached: number
  onSelect: (i: number) => void
  locked: Record<string, boolean>
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {steps.map((s, i) => {
        const Icon = s.icon
        const isActive = i === active
        const done = i < maxReached
        const isLocked = locked[s.id]
        return (
          <button
            key={s.id}
            type="button"
            onClick={() => !isLocked && onSelect(i)}
            className={cn(
              'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12.5px] font-medium transition',
              isActive
                ? 'border-brand bg-brand-soft text-brand'
                : done
                  ? 'border-line bg-surface-2 text-ink hover:border-line-strong'
                  : 'border-line bg-surface-2 text-muted hover:border-line-strong',
              isLocked && 'cursor-not-allowed opacity-50',
            )}
          >
            <span
              className={cn(
                'grid size-5 place-items-center rounded-full text-[10px]',
                isActive ? 'bg-brand text-brand-fg' : done ? 'bg-success/20 text-success' : 'bg-surface-3 text-faint',
              )}
            >
              {done && !isActive ? <Check className="size-3" /> : <Icon className="size-3" />}
            </span>
            {s.label}
          </button>
        )
      })}
    </div>
  )
}

function StepHeader({ kicker, title, children }: { kicker: string; title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">{kicker}</span>
      <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
      {children && <p className="max-w-2xl text-sm leading-relaxed text-muted">{children}</p>}
    </div>
  )
}

function InfoTile({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-4">
      <div className="flex items-center gap-2 text-brand">
        {icon}
        <p className="text-[13px] font-semibold text-ink">{title}</p>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">{children}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Simulated pages
 * ------------------------------------------------------------------ */
function victimBody(variant: 'normal' | 'poisoned' | 'private' | 'leaked'): string {
  switch (variant) {
    case 'poisoned':
      return '<html> ... attacker-controlled markup served from cache ... </html>'
    case 'private':
      return '<html> ... private account page (session-bound) ... </html>'
    case 'leaked':
      return '<html> ... private account page, served with no cookie ... </html>'
    default:
      return '<html> ... normal page ... </html>'
  }
}

function SitePage({
  scenario,
  variant,
  submitting,
  onRestore,
}: {
  scenario: LabScenario
  variant: 'normal' | 'poisoned' | 'private' | 'leaked'
  submitting?: boolean
  onRestore?: () => void
}) {
  const isDeception = scenario.mode === 'deception'
  const initial = scenario.victim.name[0].toUpperCase()
  return (
    <div className="p-5">
      <div className="mx-auto max-w-md">
        <div className="flex items-center gap-2">
          <span className="grid size-8 place-items-center rounded-lg bg-accent-soft text-sm font-black text-accent">{initial}</span>
          <div>
            <p className="text-sm font-bold text-ink">{scenario.victim.site}</p>
            <p className="text-[11px] text-faint">{scenario.path}</p>
          </div>
          <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-success">
            <span className="size-1.5 rounded-full bg-success" /> wuu soo galay
          </span>
        </div>

        {variant === 'poisoned' && (
          <div className="scene-in mt-4 flex items-start gap-2.5 rounded-lg border border-danger/40 bg-danger-soft p-3">
            <ShieldAlert className="mt-0.5 size-4 shrink-0 text-danger" />
            <p className="text-[13px] text-muted">
              Cache-ku wuxuu u adeegay <span className="font-semibold text-ink">nuqul la wasakheeyey</span>. Boggu
              wuxuu si otomaatig ah u rarayaa <span className="font-mono text-danger">evil.example</span>.
            </p>
          </div>
        )}

        {variant === 'leaked' && (
          <div className="scene-in mt-4 flex items-start gap-2.5 rounded-lg border border-danger/40 bg-danger-soft p-3">
            <LockOpen className="mt-0.5 size-4 shrink-0 text-danger" />
            <p className="text-[13px] text-muted">
              Ma jiro cookie. Cache-ku wuxuu siiyey bogga private ee {scenario.victim.name}.
            </p>
          </div>
        )}

        {(variant === 'private' || variant === 'leaked') && scenario.secret && (
          <div className="mt-3 rounded-lg border border-line bg-surface-2 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">Xog private</p>
            <p className={cn('mt-1 break-all font-mono text-[12.5px]', variant === 'leaked' ? 'font-semibold text-danger' : 'text-ink')}>
              {scenario.secret}
            </p>
          </div>
        )}

        {variant === 'normal' && (
          <div className="mt-4 rounded-lg border border-line bg-surface-2 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
              {isDeception ? 'Bog guud' : 'Nuxurka bogga'}
            </p>
            <p className="mt-1.5 text-[13px] text-muted">
              {isDeception ? 'Boggan waxba kama qarsoona — laakin bogga private ayaa la mid ah.' : 'Nuxur caadi ah oo aan waxyeello lahayn.'}
            </p>
          </div>
        )}

        {submitting && (
          <p className="scene-in mt-3 font-mono text-[11px] text-danger">codsiga waa la dirayaa…</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {onRestore && (
            <Button type="button" variant="ghost" size="sm" onClick={onRestore}>
              <RotateCcw className="size-3.5" /> Soo celi
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

function AttackerLure({ submitting }: { submitting?: boolean }) {
  return (
    <div className="p-6">
      <div className="mx-auto max-w-md rounded-xl border border-line bg-surface p-6 text-center">
        <Target className="mx-auto size-10 text-warning" />
        <h3 className="mt-3 text-lg font-bold text-ink">Deal of the day</h3>
        <p className="mt-1 text-sm text-muted">Boggan wuxuu si qarsoon u diraa codsi/bog la bartilmaameedsaday.</p>
        <span className="mt-4 inline-flex items-center gap-2 rounded-md bg-gradient-to-r from-[#ff5b2e] to-[#ffb020] px-4 py-2 text-sm font-bold text-[#170b06]">
          <Globe className="size-4" /> {ATTACKER_ORIGIN}
        </span>
        {submitting && <p className="scene-in mt-3 font-mono text-[11px] text-danger">codsiga wuu baxayaa…</p>}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Payload panel (craft)
 * ------------------------------------------------------------------ */
function PayloadPanel({
  scenario,
  inject,
  payload,
  onPickInject,
  onPayload,
}: {
  scenario: LabScenario
  inject: string
  payload: string
  onPickInject: (id: string) => void
  onPayload: (v: string) => void
}) {
  const isDeception = scenario.mode === 'deception'
  const snippet = requestSnippet(scenario, { inject, payload })

  return (
    <div className="flex min-w-0 flex-col gap-4">
      <div className="rounded-xl border border-line bg-surface p-4 shadow-card">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-faint">
          1 · {isDeception ? 'Qaabka khiyaanka' : 'Input aan la keyin'}
        </p>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
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
                  active ? 'border-brand bg-brand-soft' : 'border-line bg-surface-2 hover:border-line-strong',
                )}
              >
                <span className="flex items-center gap-2">
                  <span className="text-[13px] font-semibold text-ink">{ip.label}</span>
                  <Badge tone="neutral" className="ml-auto">
                    {ip.kind}
                  </Badge>
                </span>
                <span className="text-[11px] leading-relaxed text-muted">{ip.blurb}</span>
              </button>
            )
          })}
        </div>

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-faint">
          2 · {isDeception ? 'URL suffix' : 'Payload'}
        </p>
        <input
          value={payload}
          onChange={(e) => onPayload(e.target.value)}
          spellCheck={false}
          className="mt-2 h-10 w-full rounded-md border border-line bg-surface-2 px-3 font-mono text-[13px] text-ink outline-none transition focus:border-brand focus:ring-2 focus:ring-[var(--brand-ring)]"
        />

        <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-faint">3 · Codsiga la diyaariyay</p>
      </div>

      <CodeBlock code={snippet} title="qalabka-weerarka" wrap />
    </div>
  )
}

function Collapse({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-4">
      <div className="flex items-center gap-2 text-brand">
        {icon}
        <p className="text-[13px] font-semibold text-ink">{title}</p>
      </div>
      <p className="mt-2 text-[13px] leading-relaxed text-muted">{children}</p>
    </div>
  )
}

function Hints({ hints }: { hints: string[] }) {
  const [shown, setShown] = useState(0)
  if (hints.length === 0) return null
  return (
    <div className="rounded-lg border border-line bg-surface-2 p-4">
      <div className="flex items-center gap-2">
        <Lightbulb className="size-4 text-warning" />
        <p className="text-[13px] font-semibold text-ink">Tilmaamo</p>
        <span className="ml-auto text-[11px] text-faint">
          {shown}/{hints.length} la muujiyay
        </span>
      </div>
      <ul className="mt-2 flex flex-col gap-2">
        {hints.slice(0, shown).map((h, i) => (
          <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-muted">
            <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-warning-soft text-[10px] font-bold text-warning">
              {i + 1}
            </span>
            {h}
          </li>
        ))}
      </ul>
      {shown < hints.length ? (
        <button
          type="button"
          onClick={() => setShown((s) => s + 1)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-2.5 py-1.5 text-[12px] font-medium text-muted transition hover:border-line-strong hover:text-ink"
        >
          <Eye className="size-3.5" /> {shown === 0 ? 'Muuji tilmaan' : 'Muuji tilmaan kale'}
        </button>
      ) : (
        <p className="mt-3 text-[12px] text-faint">Taasi waa tilmaamihii oo dhan — hadda adigaa isku filan.</p>
      )}
    </div>
  )
}

function StateBox({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
  return (
    <div className={cn('rounded-lg border p-3', danger ? 'border-danger/40 bg-danger-soft' : 'border-line bg-surface-2')}>
      <p className="text-[11px] uppercase tracking-wide text-faint">{label}</p>
      <p className={cn('mt-1 break-all font-mono text-[12.5px]', danger ? 'font-semibold text-danger' : 'text-muted')}>{value}</p>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Defense panel
 * ------------------------------------------------------------------ */
function DefensePanel({
  scenario,
  defense,
  setDef,
  onApplySecure,
  onResetVuln,
}: {
  scenario: LabScenario
  defense: Defense
  setDef: <K extends DefenseKey>(key: K, value: Defense[K]) => void
  onApplySecure: () => void
  onResetVuln: () => void
}) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Lock className="size-4 text-brand" />
        <h3 className="text-sm font-semibold text-ink">Panel-ka difaaca</h3>
        <span className="ml-auto text-[11px] text-faint">adigaa difaacaya</span>
      </div>

      <div className="flex flex-col gap-3.5">
        {scenario.controls.map((key) => {
          const meta = DEFENSE_META[key]
          return (
            <ToggleRow
              key={key}
              label={meta.label}
              hint={meta.hint}
              checked={defense[key]}
              onChange={(v) => setDef(key, v)}
            />
          )
        })}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <Button variant="secondary" size="sm" onClick={onApplySecure}>
          <Wrench className="size-3.5" /> Dalbo set-ka la soo jeediyay
        </Button>
        <Button variant="ghost" size="sm" onClick={onResetVuln}>
          <RotateCcw className="size-3.5" /> Ku celi xaaladda nugul
        </Button>
      </div>
    </div>
  )
}

function ToggleRow({ label, hint, checked, onChange }: { label: string; hint: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-[13px] font-medium text-ink">{label}</p>
        <p className="text-[11.5px] leading-snug text-muted">{hint}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} label={label} />
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Recap + knowledge check
 * ------------------------------------------------------------------ */
function fixesFrom(scenario: LabScenario): string[] {
  const out: string[] = []
  const s = scenario.secure
  if (s.canonicalHost) out.push('host canonical oo la dhiso')
  if (s.keyUnkeyed) out.push('input-ka aan la keyin oo la key-gareeyay')
  if (s.varyOnInput) out.push('Vary oo lagu daray header-ka')
  if (s.normalizePath) out.push('URL normalisation')
  if (s.staticOnly) out.push('cache kaliya content static')
  if (s.respectCacheControl) out.push('ixtiraam Cache-Control')
  if (s.originNoStore) out.push('no-store boggaga private')
  return out
}

const CACHE_QUIZ: { q: string; options: { text: string; correct?: boolean }[] }[] = [
  {
    q: 'Maxaa cache-ka u noqda “nugul” marka leh input aan la keyin?',
    options: [
      { text: 'Wuxuu keydiyaa hal jawaab oo dhammaan booqdeyaasha la wadaagaan, iyadoo key-gu uusan ka tarjumayn input-kii beddelay jawaabta.', correct: true },
      { text: 'Ma keydiyo waxba' },
      { text: 'Wuxuu keydiyaa headers kasta si gooni ah' },
      { text: 'Wuxuu kaliya keydiyaa faylasha .js' },
    ],
  },
  {
    q: 'Waa maxay difaaca ugu muhiimsan ee cache deception?',
    options: [
      { text: 'Calaamadee boggaga private sida no-store IYO kaliya cache-garee jawaabaha dhab ahaan static ah', correct: true },
      { text: 'Isticmaal HTTPS' },
      { text: 'Magac beddel endpoint-ka' },
      { text: 'Qari link-ga' },
    ],
  },
]

function RecapStep({ scenario, solved }: { scenario: LabScenario; solved: boolean }) {
  const [answers, setAnswers] = useState<(number | null)[]>([null, null])
  const allCorrect = CACHE_QUIZ.every((q, i) => answers[i] != null && q.options[answers[i]!].correct === true)
  const fixes = fixesFrom(scenario)

  return (
    <div className="flex flex-col gap-6">
      <Card className="p-6">
        <StepHeader kicker="Tallaabo 6 — soo koobid" title="Asalka dhibka, xalka, iyo caddaynta">
          {solved
            ? "Waad ka faa'iidaysatay cilladda dabadeed waad xirtay. Wareegga weerar → xal → dib-u-tijaabi waa shaqada oo dhan."
            : 'Ka shaqee soo koobidda iyo hubinta aqoonta si aad casharka u xajiso.'}
        </StepHeader>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-danger/30 bg-danger-soft p-4">
            <div className="flex items-center gap-2 text-danger">
              <ShieldAlert className="size-4" />
              <p className="text-[13px] font-semibold text-ink">Asalka dhibka</p>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">{scenario.takeaway}</p>
          </div>
          <div className="rounded-lg border border-success/30 bg-success-soft p-4">
            <div className="flex items-center gap-2 text-success">
              <ShieldCheck className="size-4" />
              <p className="text-[13px] font-semibold text-ink">Xalka</p>
            </div>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              Bartilmaameedkan waa inuu adeegsadaa {fixes.join(', ')}. Hal dejin keliya kuma filna — lakab u samee
              difaac qoto dheer.
            </p>
          </div>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          {scenario.walkthrough.map((w, i) => (
            <div key={i} className="rounded-lg border border-line bg-surface-2 p-4">
              <p className="text-[13px] font-semibold text-ink">{w.title}</p>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{w.body}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="size-4 text-brand" />
          <h3 className="text-sm font-semibold text-ink">Hubinta aqoonta</h3>
          {allCorrect && (
            <Badge tone="success" className="ml-auto">
              <Check className="size-3" /> Dhammaan waa sax
            </Badge>
          )}
        </div>
        <div className="mt-4 flex flex-col gap-5">
          {CACHE_QUIZ.map((q, qi) => {
            const chosen = answers[qi]
            return (
              <div key={qi} className="flex flex-col gap-2">
                <p className="text-sm font-medium text-ink">
                  {qi + 1}. {q.q}
                </p>
                <div className="flex flex-col gap-1.5">
                  {q.options.map((o, oi) => {
                    const isChosen = chosen === oi
                    return (
                      <button
                        key={oi}
                        type="button"
                        onClick={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                        className={cn(
                          'flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left text-[13px] transition',
                          isChosen
                            ? o.correct
                              ? 'border-success/50 bg-success-soft text-ink'
                              : 'border-danger/50 bg-danger-soft text-ink'
                            : 'border-line bg-surface-2 text-muted hover:border-line-strong',
                        )}
                      >
                        <span
                          className={cn(
                            'grid size-4 shrink-0 place-items-center rounded-full border',
                            isChosen ? (o.correct ? 'border-success bg-success text-white' : 'border-danger bg-danger text-white') : 'border-line-strong',
                          )}
                        >
                          {isChosen && (o.correct ? <Check className="size-2.5" /> : <AlertTriangle className="size-2.5" />)}
                        </span>
                        {o.text}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}

/* ------------------------------------------------------------------ *
 * Shared bits
 * ------------------------------------------------------------------ */
function IdentityChip({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-2 py-0.5 text-[11px] text-muted">
      <User className="size-3 text-accent" /> {name}
    </span>
  )
}

function Banner({ tone, icon, title, children }: { tone: 'danger' | 'success'; icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className={cn('mt-4 flex items-start gap-3 rounded-xl border p-4', tone === 'danger' ? 'border-danger/40 bg-danger-soft' : 'border-success/40 bg-success-soft')}>
      <span className={cn('mt-0.5 shrink-0', tone === 'danger' ? 'text-danger' : 'text-success')}>{icon}</span>
      <div>
        <p className="font-semibold text-ink">{title}</p>
        <p className="mt-0.5 text-sm text-muted">{children}</p>
      </div>
    </div>
  )
}

const STATUS_STYLE: Record<TraceStatus, string> = {
  ok: 'border-success/40 bg-success-soft text-success',
  block: 'border-danger/40 bg-danger-soft text-danger',
  warn: 'border-warning/40 bg-warning-soft text-warning',
  info: 'border-line bg-surface-2 text-muted',
}

function TraceList({ result }: { result: AttackResult }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-4 shadow-card">
      <div className="mb-3 flex items-center gap-2">
        <Flag className="size-4 text-brand" />
        <h3 className="text-sm font-semibold text-ink">Waxa dhacay, tallaabo kasta</h3>
      </div>
      <ol className="flex flex-col">
        {result.trace.map((s, i) => (
          <li key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span className={cn('grid size-7 shrink-0 place-items-center rounded-full border text-[11px] font-bold', STATUS_STYLE[s.status])}>
                {s.status === 'ok' ? (
                  <Check className="size-3.5" />
                ) : s.status === 'block' ? (
                  <ShieldAlert className="size-3.5" />
                ) : s.status === 'warn' ? (
                  <AlertTriangle className="size-3.5" />
                ) : (
                  i + 1
                )}
              </span>
              {i < result.trace.length - 1 && <span className="my-0.5 w-px flex-1 bg-line" />}
            </div>
            <div className="pb-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-faint">{s.phase}</span>
                <span className="text-sm font-semibold text-ink">{s.label}</span>
              </div>
              <p className="mt-0.5 text-sm leading-relaxed text-muted">{s.detail}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

function CaseFile({ scenario, pwned, defended, fired }: { scenario: LabScenario; pwned: boolean; defended: boolean; fired: boolean }) {
  return (
    <Card className="p-4">
      <div className="flex items-center gap-2">
        <span className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-sky-400/30 to-sky-600/20 text-sm font-bold text-sky-200">
          {scenario.victim.name[0]}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{scenario.victim.name}</p>
          <p className="truncate font-mono text-[11px] text-faint">{scenario.victim.site}</p>
        </div>
        <span className="ml-auto">
          {defended ? (
            <Badge tone="success">La difaacay</Badge>
          ) : pwned ? (
            <Badge tone="danger">La jabsaday</Badge>
          ) : fired ? (
            <Badge tone="warning">La isku dayay</Badge>
          ) : (
            <Badge tone="neutral">Bartilmaameed</Badge>
          )}
        </span>
      </div>
      <p className="mt-3 text-[12.5px] leading-relaxed text-muted">{scenario.victim.disclosure}</p>
      <ul className="mt-4 flex flex-col gap-2.5 border-t border-line pt-4">
        {scenario.objectives.map((o, i) => {
          const done = i === 0 ? pwned || defended : defended
          return (
            <li key={i} className="flex gap-2.5 text-[13px]">
              <span className={cn('mt-0.5 grid size-[1.05rem] shrink-0 place-items-center rounded-full border text-[10px]', done ? 'border-success/50 bg-success text-white' : 'border-line-strong text-faint')}>
                {done ? <Check className="size-3" /> : i + 1}
              </span>
              <span className={done ? 'text-muted line-through' : 'text-muted'}>{o}</span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

function PostureCard({ scenario, defense }: { scenario: LabScenario; defense: Defense }) {
  const rows = scenario.controls.map((key) => ({ key, label: DEFENSE_META[key].label, ok: defense[key] }))
  return (
    <Card className="p-4">
      <h3 className="text-sm font-semibold text-ink">Xaaladda cache-ka</h3>
      <ul className="mt-3 flex flex-col gap-2">
        {rows.map((r) => (
          <li key={r.key} className="flex items-center justify-between gap-2 text-[12.5px]">
            <span className="text-muted">{r.label}</span>
            <span className={cn('inline-flex items-center gap-1 font-mono text-[11px]', r.ok ? 'text-success' : 'text-danger')}>
              <span className={cn('size-1.5 rounded-full', r.ok ? 'bg-success' : 'bg-danger')} />
              {r.ok ? 'daaran' : 'damsan'}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  )
}
