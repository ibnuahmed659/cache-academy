import { fill, t } from './copy'
import {
  INJECT_POINTS,
  type AttackInput,
  type AttackResult,
  type Defense,
  type LabScenario,
  type TraceStep,
} from './types'

function step(
  phase: string,
  label: string,
  detail: string,
  status: TraceStep['status'],
): TraceStep {
  return { phase, label, detail, status }
}

/** Injections that exploit a parser disagreement between cache and origin. */
const PARSER_MISMATCH = [
  'query-cloak',
  'query-fat',
  'path-extension',
  'path-delimiter',
  'path-encoded',
  'path-traversal',
  'x-original-url',
  'x-rewrite-url',
]

export function runCache(
  scn: LabScenario,
  defense: Defense,
  attack: AttackInput,
): AttackResult {
  const inject = INJECT_POINTS[attack.inject] ?? INJECT_POINTS['x-forwarded-host']
  const payload = attack.payload.trim() || inject.defaultPayload
  return scn.mode === 'deception'
    ? runDeception(scn, defense, inject.field, payload, attack.inject)
    : runPoison(scn, defense, inject.field, payload, attack.inject)
}

function runPoison(
  scn: LabScenario,
  defense: Defense,
  field: string,
  payload: string,
  injectId: string,
): AttackResult {
  const trace: TraceStep[] = []
  const origin = `https://${scn.victim.site}`

  trace.push(
    step(
      t('trace.phase.recon'),
      t('trace.poison.recon.label'),
      fill('trace.poison.recon.detail', { origin, path: scn.path, field }),
      'info',
    ),
  )

  trace.push(
    step(
      t('trace.phase.attacker'),
      t('trace.poison.prime.label'),
      fill('trace.poison.prime.detail', { field, payload }),
      'info',
    ),
  )

  const accepts = scn.accepts.includes(injectId)
  const reflected = reflectsFor(scn.reflection, payload)

  if (!accepts || reflected == null) {
    trace.push(
      step(
        t('trace.phase.origin'),
        t('trace.poison.noReflection.label'),
        fill('trace.poison.noReflection.detail', { field }),
        'warn',
      ),
    )
    return { pwned: false, blockedBy: t('trace.blocked.noReflection'), trace }
  }

  if (defense.canonicalHost) {
    trace.push(
      step(
        t('trace.phase.origin'),
        t('trace.poison.canonical.label'),
        fill('trace.poison.canonical.detail', { field }),
        'block',
      ),
    )
    return { pwned: false, blockedBy: t('trace.blocked.canonical'), trace }
  }

  trace.push(
    step(
      t('trace.phase.origin'),
      t('trace.poison.reflected.label'),
      fill('trace.poison.reflected.detail', {
        field,
        reflected: reflected.replace(/\n/g, ' ⏎ '),
      }),
      'warn',
    ),
  )

  if (defense.keyUnkeyed) {
    trace.push(
      step(
        t('trace.phase.cache'),
        t('trace.poison.keyed.label'),
        fill('trace.poison.keyed.detail', { field }),
        'block',
      ),
    )
    return { pwned: false, blockedBy: t('trace.blocked.keyed'), trace }
  }

  if (defense.varyOnInput) {
    trace.push(
      step(
        t('trace.phase.origin'),
        t('trace.poison.vary.label'),
        fill('trace.poison.vary.detail', { field }),
        'block',
      ),
    )
    return { pwned: false, blockedBy: t('trace.blocked.vary'), trace }
  }

  if (defense.staticOnly) {
    trace.push(
      step(
        t('trace.phase.cache'),
        t('trace.poison.staticOnly.label'),
        t('trace.poison.staticOnly.detail'),
        'block',
      ),
    )
    return { pwned: false, blockedBy: t('trace.blocked.staticOnly'), trace }
  }

  if (defense.normalizePath && PARSER_MISMATCH.includes(injectId)) {
    trace.push(
      step(
        t('trace.phase.cache'),
        t('trace.poison.parser.label'),
        t('trace.poison.parser.detail'),
        'block',
      ),
    )
    return { pwned: false, blockedBy: t('trace.blocked.normalise'), trace }
  }

  trace.push(
    step(
      t('trace.phase.cache'),
      t('trace.poison.stored.label'),
      fill('trace.poison.stored.detail', { origin, path: scn.path, field }),
      'warn',
    ),
  )

  trace.push(
    step(
      t('trace.phase.victim'),
      fill('trace.poison.victim.label', { name: scn.victim.name }),
      fill('trace.poison.victim.detail', { name: scn.victim.name, field }),
      'info',
    ),
  )

  trace.push(
    step(
      t('trace.phase.cache'),
      t('trace.poison.hit.label'),
      t('trace.poison.hit.detail'),
      'ok',
    ),
  )

  trace.push(step(t('trace.phase.impact'), t('trace.poison.impact.label'), scn.impact, 'ok'))

  trace.push(
    step(
      t('trace.phase.analysis'),
      t('trace.poison.analysis.label'),
      fill('trace.poison.analysis.detail', { kind: unkeyedKind(scn.reflection) }),
      'info',
    ),
  )

  return { pwned: true, trace }
}

function runDeception(
  scn: LabScenario,
  defense: Defense,
  field: string,
  payload: string,
  injectId: string,
): AttackResult {
  const trace: TraceStep[] = []
  const suffix = payload.startsWith('/') ? payload : `/${payload}`
  const crafted = scn.path + suffix
  const origin = `https://${scn.victim.site}`

  trace.push(
    step(
      t('trace.phase.recon'),
      t('trace.deception.recon.label'),
      fill('trace.deception.recon.detail', { origin, path: scn.path }),
      'info',
    ),
  )

  trace.push(
    step(
      t('trace.phase.attacker'),
      t('trace.deception.craft.label'),
      fill('trace.deception.craft.detail', { origin, crafted, field }),
      'info',
    ),
  )

  const accepts = scn.accepts.includes(injectId)

  if (!accepts) {
    trace.push(
      step(
        t('trace.phase.origin'),
        t('trace.deception.elsewhere.label'),
        t('trace.deception.elsewhere.detail'),
        'warn',
      ),
    )
    return { pwned: false, blockedBy: t('trace.blocked.deceptionElsewhere'), trace }
  }

  trace.push(
    step(
      t('trace.phase.victim'),
      fill('trace.deception.victim.label', { name: scn.victim.name }),
      fill('trace.deception.victim.detail', { name: scn.victim.name, origin, crafted }),
      'info',
    ),
  )

  trace.push(
    step(
      t('trace.phase.origin'),
      t('trace.deception.confusion.label'),
      fill('trace.deception.confusion.detail', { path: scn.path }),
      'warn',
    ),
  )

  // --- Cache store decision -------------------------------------------------
  if (defense.originNoStore) {
    if (!defense.respectCacheControl) {
      trace.push(
        step(
          t('trace.phase.cache'),
          t('trace.deception.nostore.label'),
          t('trace.deception.nostore.detail'),
          'warn',
        ),
      )
    } else {
      trace.push(
        step(
          t('trace.phase.cache'),
          t('trace.deception.nostoreHonoured.label'),
          t('trace.deception.nostoreHonoured.detail'),
          'block',
        ),
      )
      return { pwned: false, blockedBy: t('trace.blocked.noStoreHonoured'), trace }
    }
  }

  if (defense.staticOnly) {
    trace.push(
      step(
        t('trace.phase.cache'),
        t('trace.deception.typeMismatch.label'),
        t('trace.deception.typeMismatch.detail'),
        'block',
      ),
    )
    return { pwned: false, blockedBy: t('trace.blocked.staticType'), trace }
  }

  if (defense.normalizePath && PARSER_MISMATCH.includes(injectId)) {
    trace.push(
      step(
        t('trace.phase.cache'),
        t('trace.deception.parser.label'),
        t('trace.deception.parser.detail'),
        'block',
      ),
    )
    return { pwned: false, blockedBy: t('trace.blocked.normaliseParsing'), trace }
  }

  trace.push(
    step(
      t('trace.phase.cache'),
      t('trace.deception.stored.label'),
      fill('trace.deception.stored.detail', { name: scn.victim.name, crafted }),
      'warn',
    ),
  )

  trace.push(
    step(
      t('trace.phase.attacker'),
      t('trace.deception.fetch.label'),
      fill('trace.deception.fetch.detail', { origin, crafted }),
      'info',
    ),
  )

  trace.push(
    step(
      t('trace.phase.cache'),
      t('trace.deception.hit.label'),
      fill('trace.deception.hit.detail', { name: scn.victim.name }) +
        ' ' +
        (scn.secret ? fill('trace.deception.leaked', { secret: scn.secret }) : scn.impact),
      'ok',
    ),
  )

  trace.push(step(t('trace.phase.impact'), t('trace.deception.impact.label'), scn.impact, 'ok'))

  trace.push(
    step(
      t('trace.phase.analysis'),
      t('trace.deception.analysis.label'),
      t('trace.deception.analysis.detail'),
      'info',
    ),
  )

  return { pwned: true, trace }
}

function reflectsFor(
  reflection: LabScenario['reflection'],
  payload: string,
): string | null {
  switch (reflection) {
    case 'host-in-html':
      return `<link rel="canonical" href="https://${payload}/">`
    case 'host-in-script':
      return `<script src="https://${payload}/static/app.js"></script>`
    case 'host-in-redirect':
      return `Location: https://${payload}/`
    case 'scheme-redirect':
      return `Location: https://${payload}/login`
    case 'header-crlf':
      return `X-Forwarded-Host: ${payload}`
    case 'param-reflected':
      return `<div class="promo">${payload}</div>`
    case 'cookie-reflected':
      return `<div class="prefs">${payload}</div>`
    case 'ip-reflected':
      return `<div>Your IP address is ${payload}</div>`
    case 'path-smuggled':
      return `response body of ${payload} (served under the original URL)`
    case 'private-page':
    case 'none':
    default:
      return null
  }
}

function unkeyedKind(reflection: LabScenario['reflection']): string {
  switch (reflection) {
    case 'cookie-reflected':
      return t('trace.kind.cookie')
    case 'param-reflected':
      return t('trace.kind.param')
    default:
      return t('trace.kind.header')
  }
}

/**
 * Render the raw HTTP request the attacker primes the cache with.
 */
export function requestSnippet(scn: LabScenario, attack: AttackInput): string {
  const inject = INJECT_POINTS[attack.inject] ?? INJECT_POINTS['x-forwarded-host']
  const payload = attack.payload.trim() || inject.defaultPayload

  if (scn.mode === 'deception') {
    const suffix = payload.startsWith('/') ? payload : `/${payload}`
    return [
      `GET ${scn.path}${suffix} HTTP/1.1`,
      `Host: ${scn.victim.site}`,
      `Cookie: session=${scn.victim.name.toLowerCase()}_secret`,
      ``,
      `# ${t('snip.deception_comment')}`,
    ].join('\n')
  }

  if (inject.kind === 'header') {
    return [
      `GET ${scn.path} HTTP/1.1`,
      `Host: ${scn.victim.site}`,
      `${inject.field}: ${payload}`,
      ``,
      `# ${inject.blurb}`,
    ].join('\n')
  }
  if (inject.kind === 'cookie') {
    return [
      `GET ${scn.path} HTTP/1.1`,
      `Host: ${scn.victim.site}`,
      `Cookie: ${inject.field}=${encodeURIComponent(payload)}`,
      ``,
      `# ${inject.blurb}`,
    ].join('\n')
  }
  if (inject.id === 'query-fat') {
    return [
      `GET ${scn.path} HTTP/1.1`,
      `Host: ${scn.victim.site}`,
      `Content-Type: application/x-www-form-urlencoded`,
      ``,
      `${payload}`,
      ``,
      `# ${inject.blurb}`,
    ].join('\n')
  }
  // query
  const sep = scn.path.includes('?') ? '&' : '?'
  return [
    `GET ${scn.path}${sep}${inject.field}=${encodeURIComponent(payload)} HTTP/1.1`,
    `Host: ${scn.victim.site}`,
    ``,
    `# ${inject.blurb}`,
  ].join('\n')
}
