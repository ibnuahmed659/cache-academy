export type Method = 'GET' | 'POST'

/** Two families of cache attack: poisoning (force a bad stored response)
 * and deception (trick the cache into storing a victim's private response). */
export type LabMode = 'poison' | 'deception'

export type Stage = 'beginner' | 'intermediate' | 'advanced' | 'professional'

/**
 * Where the attacker plants an input that the origin reflects but the cache
 * does NOT include in its key. That gap is the whole game.
 */
export type InjectKind = 'header' | 'query' | 'cookie' | 'path'

export type InjectPoint = {
  id: string
  label: string
  kind: InjectKind
  /** The actual field name, e.g. "X-Forwarded-Host". */
  field: string
  /** What the attacker sets it to by default. */
  defaultPayload: string
  blurb: string
}

export const INJECT_POINTS: Record<string, InjectPoint> = {
  'x-forwarded-host': {
    id: 'x-forwarded-host',
    label: 'X-Forwarded-Host',
    kind: 'header',
    field: 'X-Forwarded-Host',
    defaultPayload: 'evil.example',
    blurb: 'Header load-balancer ah oo apps badan ay ku tiirsan yihiin si ay u dhisaan absolute URLs.',
  },
  'x-forwarded-scheme': {
    id: 'x-forwarded-scheme',
    label: 'X-Forwarded-Scheme',
    kind: 'header',
    field: 'X-Forwarded-Scheme',
    defaultPayload: 'nothttps',
    blurb: 'Waxay app-ka u sheegtaa in client-ku yimid over scheme — badanaa waxaa loo isticmaalaa redirect logic.',
  },
  'x-host': {
    id: 'x-host',
    label: 'X-Host',
    kind: 'header',
    field: 'X-Host',
    defaultPayload: 'evil.example',
    blurb: 'Header xilligii hore oo host-override ah oo frameworks qaar ay weli akhriyaan.',
  },
  forwarded: {
    id: 'forwarded',
    label: 'Forwarded',
    kind: 'header',
    field: 'Forwarded',
    defaultPayload: 'host=evil.example',
    blurb: 'Waa standard-ka RFC 7239 ee beddelka X-Forwarded-*.',
  },
  'x-forwarded-server': {
    id: 'x-forwarded-server',
    label: 'X-Forwarded-Server',
    kind: 'header',
    field: 'X-Forwarded-Server',
    defaultPayload: 'evil.example',
    blurb: 'Tilmaame proxy oo kale oo apps mararka qaar ku soo celin karaan links.',
  },
  'x-original-url': {
    id: 'x-original-url',
    label: 'X-Original-URL',
    kind: 'header',
    field: 'X-Original-URL',
    defaultPayload: '/admin',
    blurb: 'Header rewrite ah oo si qarsoodi ah u gudbin kara path kala duwan iyadoo ka ag maraya cache.',
  },
  'x-rewrite-url': {
    id: 'x-rewrite-url',
    label: 'X-Rewrite-URL',
    kind: 'header',
    field: 'X-Rewrite-URL',
    defaultPayload: '/admin',
    blurb: 'Nooc la mid ah X-Original-URL oo ay isticmaalaan qaar ka mid ah reverse proxies.',
  },
  'x-forwarded-for': {
    id: 'x-forwarded-for',
    label: 'X-Forwarded-For',
    kind: 'header',
    field: 'X-Forwarded-For',
    defaultPayload: '1.2.3.4',
    blurb: 'Client IP hint, badanaa lagu soo bandhigo page-ka ("your IP is ...").',
  },
  'user-agent': {
    id: 'user-agent',
    label: 'User-Agent',
    kind: 'header',
    field: 'User-Agent',
    defaultPayload: '"><script>alert(1)</script>',
    blurb: 'Badanaa waa unkeyed xitaa marka lagu muujiyo page-ka "browser unsupported".',
  },
  'accept-language': {
    id: 'user-agent2',
    label: 'Accept-Language',
    kind: 'header',
    field: 'Accept-Language',
    defaultPayload: 'en"><script>alert(1)</script>',
    blurb: 'Locale negotiation ayaa lagu soo celiyaa markup-ka laakiin marmar kama mid aha key-ga.',
  },
  'x-country': {
    id: 'x-forwarded-for-2',
    label: 'X-Forwarded-For (geo)',
    kind: 'header',
    field: 'X-Forwarded-For',
    defaultPayload: '127.0.0.1',
    blurb: 'Waxaa loo isticmaalaa geo-redirect logic; poisoned redirect ayaa la cache-gareyn karaa.',
  },
  'query-unkeyed': {
    id: 'query-unkeyed',
    label: 'Query param aan key-ga lahayn.',
    kind: 'query',
    field: 'utm_content',
    defaultPayload: '"><script>alert(1)</script>',
    blurb: 'Parameter tracking ah oo origin uu soo celiyo balse cache uu ka reebo key-ga.',
  },
  'query-cloak': {
    id: 'query-cloak',
    label: 'Parameter cloaking',
    kind: 'query',
    field: 'utm=1&utm',
    defaultPayload: '=%3f',
    blurb: 'Parser mismatch: cache waxay aragtaa laba params, backend-ku wuxuu arkaa hal.',
  },
  'query-fat': {
    id: 'query-fat',
    label: 'Fat GET body',
    kind: 'query',
    field: 'GET body',
    defaultPayload: 'cb=evil',
    blurb: 'GET leh body oo backend-ku akhriyo laakiin cache-ku iska indhatirayo.',
  },
  'cookie-unkeyed': {
    id: 'cookie-unkeyed',
    label: 'Cookie aan key-ga lahayn',
    kind: 'cookie',
    field: 'Prefs',
    defaultPayload: '"><script>alert(1)</script>',
    blurb: 'A cookie tracking/preference lagu soo celiyo HTML-ka laakiin marna looma keyin (unkeyed).',
  },
  'path-extension': {
    id: 'path-extension',
    label: 'Kordhin la lifaaqay',
    kind: 'path',
    field: 'path',
    defaultPayload: '/profile.css',
    blurb: 'Ku khiyaanee cache-ka si uu bog private u tixgeliyo sida static asset.',
  },
  'path-delimiter': {
    id: 'path-delimiter',
    label: 'Kala-soocaha path',
    kind: 'path',
    field: 'path',
    defaultPayload: '/profile;.js',
    blurb: 'Matrix/semicolon confusion: cache-ku wuxuu key gareeyaa hal path, origin-kuna mid kale.',
  },
  'path-encoded': {
    id: 'path-encoded',
    label: 'Xarfo la encoded',
    kind: 'path',
    field: 'path',
    defaultPayload: '/profile%2f.css',
    blurb: 'Percent-encoded slash/dot: edge-ku wuu caadiyeeyaa, origin-kuna wuu kala furfurayaa.',
  },
  'path-traversal': {
    id: 'path-traversal',
    label: 'Dot-segment',
    kind: 'path',
    field: 'path',
    defaultPayload: '/profile/..%2faccount',
    blurb: 'Isfahan la\'aan Dot-segment oo u dhaxaysa cache normalizer-ka iyo router-ka.',
  },
}

export type InjectId = keyof typeof INJECT_POINTS

/**
 * What the reflected input turns into in the cached response — the weapon.
 */
export type Reflection =
  | 'none'
  | 'html' // reflected into the HTML body
  | 'script-src' // reflected into an absolute <script src>
  | 'redirect' // reflected into a Location header / 3xx
  | 'set-cookie' // CRLF into a Set-Cookie response header
  | 'link' // reflected into a <link>/canonical href
  | 'header'

export type Impact = 'xss' | 'redirect' | 'cookie' | 'dos' | 'deface' | 'leak' | 'open-redirect'

/**
 * The defender's controls. Origin-side keys stop the response being dangerous
 * in the first place; cache-side keys stop it being stored or served wrongly.
 */
export type Defense = {
  /** Origin: stop trusting Host/X-Forwarded-* — always build canonical URLs. */
  canonicalHost: boolean
  /** Origin: send private/no-store on sensitive responses. */
  originNoStore: boolean
  /** Origin: emit Vary on the unkeyed header so caches key on it. */
  varyOnInput: boolean
  /** Cache: include the unkeyed header/param in the cache key. */
  keyUnkeyed: boolean
  /** Cache: normalize path (strip extensions, decode delimiters) before keying. */
  normalizePath: boolean
  /** Cache: only store responses that are genuinely static. */
  staticOnly: boolean
  /** Cache: honour the origin's Cache-Control when deciding to store. */
  respectCacheControl: boolean
}

export type DefenseKey = keyof Defense

export const DEFENSE_META: Record<
  DefenseKey,
  { label: string; hint: string; side: 'origin' | 'cache' }
> = {
  canonicalHost: {
    label: 'host-ka u qaabee qaab canonical',
    hint: 'Ha aaminin Host/X-Forwarded-*; dhis URLs adoo ka soo qaadanaya origin go\'an.',
    side: 'origin',
  },
  varyOnInput: {
    label: 'Vary ku samee header-ka aan key-ga lahayn.',
    hint: 'Dir Vary si caches ay key ugu sameeyaan header halkii ay ka wadaagi lahaayeen hal nuqul.',
    side: 'origin',
  },
  respectCacheControl: {
    label: 'Ixtiraam Origin Cache-Control',
    hint: 'Ixtiraam private/no-store; waligaa ha cache-gareyn waxa origin uu calaamadiyo inuu private yahay.',
    side: 'cache',
  },
  staticOnly: {
    label: 'Cache kaliya content static ah.',
    hint: 'Kaydi responses kaliya marka type/extension dhab ahaan ay static tahay.',
    side: 'cache',
  },
  keyUnkeyed: {
    label: 'Key ku samee unkeyed input.',
    hint: 'Ku dar header/param gudaha cache key si variants ay u sii ahaadaan kuwo kala duwan.',
    side: 'cache',
  },
  normalizePath: {
    label: 'URL-ka caadiyee',
    hint: 'Ka saar extensions oo decode garee delimiters kahor inta aan hashing lagu sameyn key-ga.',
    side: 'cache',
  },
  originNoStore: {
    label: 'no-store bogagga private',
    hint: 'Dir Cache-Control: private, no-store loogu talagalay authenticated content.',
    side: 'origin',
  },
}

export type TraceStatus = 'ok' | 'block' | 'info' | 'warn'

export type TraceStep = {
  phase: string
  label: string
  detail: string
  status: TraceStatus
}

export type AttackInput = {
  inject: string
  payload: string
}

export type AttackResult = {
  /** Did the attack land (poison a victim / leak a secret)? */
  pwned: boolean
  /** The first control that stopped it, if any. */
  blockedBy?: string
  trace: TraceStep[]
}

export const STAGE_ORDER: Stage[] = [
  'beginner',
  'intermediate',
  'advanced',
  'professional',
]

export const STAGE_LABEL: Record<Stage, string> = {
  beginner: 'Bilowga',
  intermediate: 'Dhexdhexaad',
  advanced: 'Horumarsan',
  professional: 'Xirfadle',
}

export const MODE_LABEL: Record<'poison' | 'deception', string> = {
  poison: 'Cache Poisoning',
  deception: 'Cache Deception',
}

/**
 * A single lab. `mode` picks the engine path; the rest describes the target,
 * the flaw, and the controls that close it.
 */
export type LabScenario = {
  id: string
  title: string
  stage: Stage
  category: string
  mode: 'poison' | 'deception'
  summary: string
  takeaway: string
  victim: { name: string; site: string; disclosure: string }
  /** The target endpoint the attacker is trying to poison or leak from. */
  path: string
  /** The input the lab lets you try (includes decoys). */
  injects: string[]
  /** The inject id(s) that actually land against this target. */
  accepts: string[]
  /** What the reflected value becomes in the response. */
  reflection:
    | 'host-in-html'
    | 'host-in-script'
    | 'host-in-redirect'
    | 'scheme-redirect'
    | 'header-crlf'
    | 'param-reflected'
    | 'cookie-reflected'
    | 'ip-reflected'
    | 'path-smuggled'
    | 'none'
    | 'private-page'
  /** Plain-language impact shown once poisoned. */
  impact: string
  /** The private content a deception target leaks. */
  secret?: string
  /** The vulnerable configuration the lab opens with. */
  defense: Defense
  /** A posture that fully blocks the attack. */
  secure: Defense
  /** Which controls are worth showing for this lab. */
  controls: DefenseKey[]
  objectives: string[]
  hints: string[]
  walkthrough: { title: string; body: string }[]
}

export const ALL_DEFENSES_OFF: Defense = {
  canonicalHost: false,
  varyOnInput: false,
  respectCacheControl: false,
  staticOnly: false,
  keyUnkeyed: false,
  normalizePath: false,
  originNoStore: false,
}
