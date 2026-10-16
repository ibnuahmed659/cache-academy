import type { Tutorial } from './types'
import { foundationsTutorials } from './series/foundations'
import { attackTutorials } from './series/attacks'
import { defenseTutorials } from './series/defenses'
import { bypassTutorials } from './series/bypass'
import { realWorldTutorials } from './series/realworld'

/*
 * A shared cast for the animated flow diagrams.
 * Positions are normalised (0–100) so they scale to any stage size.
 */
const ATTACKER = { id: 'attacker', label: 'Attacker', sub: 'evil.example', x: 14, y: 22, tone: 'attacker' as const }
const VICTIM = { id: 'victim', label: 'Victim', sub: 'signed in', x: 14, y: 80, tone: 'victim' as const }
const BROWSER = { id: 'browser', label: "Victim's browser", sub: 'sends requests', x: 34, y: 51, tone: 'browser' as const }
const CACHE = { id: 'cache', label: 'CDN cache', sub: 'shared edge', x: 62, y: 51, tone: 'neutral' as const }
const TARGET = { id: 'target', label: 'Origin server', sub: 'app.example', x: 86, y: 51, tone: 'target' as const }

export const TUTORIALS: Tutorial[] = [
  {
    id: 'what-is-cache-poisoning',
    title: 'What cache poisoning actually is',
    subtitle: 'One bad response, cached and served to everyone.',
    category: 'Foundations',
    level: 'beginner',
    accent: 'ember',
    summary:
      'In six animated minutes, see why a shared cache that trusts an unkeyed input is the whole game.',
    keyPoints: [
      'A cache stores one response and serves it to many users.',
      'Any input that changes the response but is not in the cache key can be abused.',
      'The attacker poisons the cache once; every visitor gets the payload.',
    ],
    scenes: [
      {
        id: 's1',
        title: 'Cold open',
        duration: 6,
        caption: 'Web cache poisoning plants a malicious response inside a shared cache, where everyone will fetch it.',
        visual: {
          kind: 'title',
          badge: 'Tutorial 01',
          title: 'Web Cache Poisoning',
          subtitle: 'Poison once. Serve to everyone.',
        },
      },
      {
        id: 's2',
        title: 'The core idea',
        duration: 9,
        caption: 'A cache stores responses so it can answer future requests without bothering the origin. That is the feature — and the risk.',
        visual: {
          kind: 'bullets',
          heading: 'The problem in one line',
          items: [
            'A cache serves one stored response to many users.',
            'The cache key decides which requests share a response.',
            'Anything outside the key that changes the response is a lever.',
          ],
        },
      },
      {
        id: 's3',
        title: 'The cast',
        duration: 10,
        caption: 'Four actors: the victim, their browser, the CDN cache, and the origin server.',
        visual: {
          kind: 'flow',
          nodes: [VICTIM, BROWSER, CACHE, TARGET],
          packets: [
            { from: 'victim', to: 'browser', label: 'opens the site', at: 0.05, tone: 'request' },
            { from: 'browser', to: 'cache', label: 'GET /home', at: 0.35, tone: 'request' },
            { from: 'cache', to: 'target', label: 'MISS → origin', at: 0.62, tone: 'request' },
          ],
          note: 'On a miss the origin answers; the cache then keeps a copy.',
        },
      },
      {
        id: 's4',
        title: 'The poisoned request',
        duration: 12,
        caption: 'The attacker sends a request with an unkeyed header. The origin reflects it into the response, and the cache stores it under the clean URL.',
        visual: {
          kind: 'flow',
          nodes: [ATTACKER, CACHE, TARGET],
          packets: [
            { from: 'attacker', to: 'cache', label: 'X-Forwarded-Host: evil', at: 0.1, tone: 'forged' },
            { from: 'cache', to: 'target', label: 'MISS → origin', at: 0.4, tone: 'request' },
            { from: 'target', to: 'cache', label: 'reflects the host', at: 0.68, tone: 'forged' },
            { from: 'cache', to: 'attacker', label: 'stores under /home', at: 0.88, tone: 'good' },
          ],
          note: 'The header is not in the key — so the poisoned copy is public.',
        },
      },
      {
        id: 's5',
        title: 'The payload',
        duration: 9,
        caption: 'The reflected value lands in a script tag or redirect, and the cache now serves it to every visitor.',
        visual: {
          kind: 'code',
          title: 'poisoned response',
          lang: 'http',
          code: 'GET /home HTTP/1.1\nHost: app.example\nX-Forwarded-Host: evil.example\n\nHTTP/1.1 200 OK\nCache-Control: public, max-age=3600\n\n<script src="https://evil.example/app.js"></script>',
        },
      },
      {
        id: 's6',
        title: 'Impact',
        duration: 7,
        caption: 'Every subsequent visitor receives the attacker’s script — a stored XSS delivered by the cache.',
        visual: {
          kind: 'impact',
          heading: 'One request, every user',
          before: '<script src="https://app.example/app.js">',
          after: '<script src="https://evil.example/app.js">',
          note: 'No click from the victim. No interaction. Just the cache.',
        },
      },
      {
        id: 's7',
        title: 'Recap',
        duration: 8,
        caption: 'A cache key that ignores an input the origin trusts is the bug. Close that gap and the attack dies.',
        visual: {
          kind: 'bullets',
          heading: 'Remember',
          items: [
            'Caches serve one response to many users.',
            'Unkeyed inputs are the lever.',
            'The fix is a correct key, or no shared caching at all.',
          ],
        },
      },
    ],
  },
  {
    id: 'hit-miss-key',
    title: 'HIT, MISS and the cache key',
    subtitle: 'The three ideas that make caching (and its bugs) understandable.',
    category: 'Foundations',
    level: 'beginner',
    accent: 'steel',
    summary:
      'Walk through a cache miss, a hit, and the key that decides which requests share a response.',
    keyPoints: [
      'A MISS goes to the origin; a HIT is served from the cache.',
      'The cache key is usually scheme + host + path.',
      'Headers, cookies and the body are usually not keyed.',
    ],
    scenes: [
      {
        id: 's1',
        title: 'Cold open',
        duration: 5,
        caption: 'Every cache behaviour comes down to two events and one key.',
        visual: { kind: 'title', badge: 'Tutorial 02', title: 'HIT, MISS and the cache key', subtitle: 'The mechanics behind the attacks.' },
      },
      {
        id: 's2',
        title: 'A MISS',
        duration: 10,
        caption: 'The first request is not in the cache. It goes all the way to the origin, and the cache keeps a copy.',
        visual: {
          kind: 'flow',
          nodes: [BROWSER, CACHE, TARGET],
          packets: [
            { from: 'browser', to: 'cache', label: 'GET /home', at: 0.1, tone: 'request' },
            { from: 'cache', to: 'target', label: 'MISS → origin', at: 0.5, tone: 'request' },
            { from: 'target', to: 'cache', label: '200 + Cache-Control', at: 0.8, tone: 'good' },
          ],
          note: 'MISS: the response had to be generated.',
        },
      },
      {
        id: 's3',
        title: 'A HIT',
        duration: 9,
        caption: 'The next request matches the key, so the cache answers instantly and the origin is never touched.',
        visual: {
          kind: 'flow',
          nodes: [BROWSER, CACHE, TARGET],
          packets: [
            { from: 'browser', to: 'cache', label: 'GET /home', at: 0.1, tone: 'request' },
            { from: 'cache', to: 'browser', label: 'HIT (stored copy)', at: 0.45, tone: 'good' },
          ],
          note: 'HIT: fast — and exactly what an attacker wants to control.',
        },
      },
      {
        id: 's4',
        title: 'The key',
        duration: 11,
        caption: 'The cache builds a key from the request. Two requests with the same key share one response.',
        visual: {
          kind: 'code',
          title: 'the cache key',
          lang: 'text',
          code: 'GET https://app.example/en/home\n\nkey = scheme + host + path\n    = https + app.example + /en/home\n\n# Not in the key:\n#   most headers, cookies, the query tail, the body',
        },
      },
      {
        id: 's5',
        title: 'Signals',
        duration: 8,
        caption: 'Response headers tell you it is a cache: Age, X-Cache, and vendor-specific status headers.',
        visual: {
          kind: 'code',
          title: 'is it a cache?',
          lang: 'http',
          code: 'Age: 42\nX-Cache: HIT\nCF-Cache-Status: HIT\nCache-Control: public, max-age=3600',
        },
      },
      {
        id: 's6',
        title: 'The gap',
        duration: 10,
        caption: 'If a response depends on something that is not in the key, the cache cannot tell those responses apart — and serves the wrong one.',
        visual: {
          kind: 'bullets',
          heading: 'The gap',
          items: [
            'The origin uses a header the key ignores.',
            'Two different responses collapse into one key.',
            'Whoever fills it first wins.',
          ],
        },
      },
      {
        id: 's7',
        title: 'Recap',
        duration: 7,
        caption: 'MISS fills the cache, HIT serves it, and the key decides who shares. That is the whole playground.',
        visual: {
          kind: 'bullets',
          heading: 'Remember',
          items: [
            'MISS reaches the origin.',
            'HIT never does.',
            'The key must cover everything the response depends on.',
          ],
        },
      },
    ],
  },
  {
    id: 'what-is-cache-deception',
    title: 'What cache deception is',
    subtitle: 'Tricking the cache into storing someone else’s private data.',
    category: 'Deception',
    level: 'beginner',
    accent: 'danger',
    summary:
      'Cache deception needs no malicious response: it makes a shared cache store a private page, then reads it back.',
    keyPoints: [
      'The cache decides "static" or "dynamic" from the URL.',
      'The origin’s router decides the real page.',
      'When they disagree, a private page ends up cached.',
    ],
    scenes: [
      {
        id: 's1',
        title: 'Cold open',
        duration: 6,
        caption: 'Cache deception weaponises the cache’s hunger for static files.',
        visual: { kind: 'title', badge: 'Tutorial 03', title: 'Web Cache Deception', subtitle: 'Make the cache store what it should never keep.' },
      },
      {
        id: 's2',
        title: 'The two parsers',
        duration: 11,
        caption: 'The cache asks "does this look static?" The origin asks "which handler routes this?" Two parsers, one URL.',
        visual: {
          kind: 'bullets',
          heading: 'Two questions',
          items: [
            'Cache: does the URL end like an asset (.css, .js)?',
            'Origin: which route matches the path?',
            'A mismatch between the answers is the bug.',
          ],
        },
      },
      {
        id: 's3',
        title: 'The crafted URL',
        duration: 12,
        caption: 'The attacker appends a static-looking suffix to a private page. The cache sees an asset; the origin ignores the suffix.',
        visual: {
          kind: 'code',
          title: 'the trick',
          lang: 'text',
          code: 'private page : https://bank.example/account/profile\nattacker URL : https://bank.example/account/profile.css\n\ncache  -> ".css" => static, cacheable\norigin -> router ignores suffix => profile page',
        },
      },
      {
        id: 's4',
        title: 'The victim loads it',
        duration: 11,
        caption: 'The victim is signed in and opens the crafted link. The cache misses, fetches the origin, and stores the private profile.',
        visual: {
          kind: 'flow',
          nodes: [VICTIM, BROWSER, CACHE, TARGET],
          packets: [
            { from: 'victim', to: 'browser', label: 'opens the link', at: 0.05, tone: 'request' },
            { from: 'browser', to: 'cache', label: 'GET /profile.css', at: 0.3, tone: 'request' },
            { from: 'cache', to: 'target', label: 'MISS → origin', at: 0.52, tone: 'request' },
            { from: 'target', to: 'cache', label: 'private profile', at: 0.75, tone: 'forged' },
          ],
          note: 'The private response is now a cache entry.',
        },
      },
      {
        id: 's5',
        title: 'The attacker reads it',
        duration: 10,
        caption: 'The attacker requests the same URL without a session. The cache happily returns the stored private page.',
        visual: {
          kind: 'flow',
          nodes: [ATTACKER, CACHE],
          packets: [
            { from: 'attacker', to: 'cache', label: 'GET /profile.css (no cookie)', at: 0.2, tone: 'forged' },
            { from: 'cache', to: 'attacker', label: 'HIT → victim’s profile', at: 0.65, tone: 'cookie' },
          ],
        },
      },
      {
        id: 's6',
        title: 'Impact',
        duration: 8,
        caption: 'Tokens, emails and account data leave the origin without a single exploit payload.',
        visual: {
          kind: 'impact',
          heading: 'Private data, public cache',
          before: 'GET /account/profile  →  200, private',
          after: 'GET /account/profile.css  →  HIT, public',
          note: 'The attacker never hacked the server — only the cache.',
        },
      },
      {
        id: 's7',
        title: 'Recap',
        duration: 8,
        caption: 'Deceive the cache about what a URL is, and it stores what it must never store.',
        visual: {
          kind: 'bullets',
          heading: 'Remember',
          items: [
            'Deception needs no injected payload.',
            'Two parsers disagreeing is the bug.',
            'Private pages must be no-store, always.',
          ],
        },
      },
    ],
  },
  {
    id: 'anatomy-poisoned-response',
    title: 'Anatomy of a poisoned response',
    subtitle: 'Follow one request, hop by hop, from header to cached payload.',
    category: 'Foundations',
    level: 'intermediate',
    accent: 'ember',
    summary:
      'A frame-by-frame trace of cache poisoning: recon, priming, storage, and delivery to every visitor.',
    keyPoints: [
      'The attacker only has to find one unkeyed input.',
      'Priming stores the malicious response under a clean key.',
      'Defenses inspect the response’s provenance, not its appearance.',
    ],
    scenes: [
      {
        id: 's1',
        title: 'Cold open',
        duration: 5,
        caption: 'One request. Five hops. A payload cached for millions.',
        visual: { kind: 'title', badge: 'Tutorial 04', title: 'Anatomy of a poisoned response', subtitle: 'A frame-by-frame trace.' },
      },
      {
        id: 's2',
        title: 'Hop 1 — recon',
        duration: 9,
        caption: 'The attacker probes for inputs the origin reflects but the cache key ignores.',
        visual: {
          kind: 'code',
          title: 'probing',
          lang: 'http',
          code: 'GET /home HTTP/1.1\nHost: app.example\nX-Forwarded-Host: test.example\n\n# reflect back? -> candidate',
        },
      },
      {
        id: 's3',
        title: 'Hop 2 — prime',
        duration: 10,
        caption: 'With the input confirmed, the attacker sends the malicious request on a clean URL.',
        visual: {
          kind: 'flow',
          nodes: [ATTACKER, CACHE, TARGET],
          packets: [
            { from: 'attacker', to: 'cache', label: 'X-Forwarded-Host: evil', at: 0.15, tone: 'forged' },
            { from: 'cache', to: 'target', label: 'MISS → origin', at: 0.45, tone: 'request' },
          ],
          note: 'The key is still just /home.',
        },
      },
      {
        id: 's4',
        title: 'Hop 3 — reflect',
        duration: 9,
        caption: 'The origin trusts the header and writes it into the response body.',
        visual: {
          kind: 'code',
          title: 'origin response',
          lang: 'html',
          code: '<link rel="canonical" href="https://evil.example/">\n<script src="https://evil.example/app.js"></script>',
        },
      },
      {
        id: 's5',
        title: 'Hop 4 — store',
        duration: 10,
        caption: 'The cache stores the response under /home. The header was never in the key, so the payload is now public.',
        visual: {
          kind: 'flow',
          nodes: [CACHE, BROWSER, TARGET],
          packets: [
            { from: 'target', to: 'cache', label: '200 + payload', at: 0.3, tone: 'forged' },
            { from: 'cache', to: 'browser', label: 'HIT → payload', at: 0.72, tone: 'forged' },
          ],
        },
      },
      {
        id: 's6',
        title: 'Hop 5 — impact',
        duration: 8,
        caption: 'Every visitor now receives the attacker’s response — a stored XSS delivered by the cache.',
        visual: {
          kind: 'impact',
          heading: 'Served to everyone',
          before: 'clean HTML',
          after: 'attacker’s script',
          note: 'The blast radius is the whole user base.',
        },
      },
    ],
  },
  {
    id: 'reading-cache-signals',
    title: 'Reading cache signals',
    subtitle: 'How to tell a target is cached — and what its key is.',
    category: 'Recon',
    level: 'advanced',
    accent: 'steel',
    summary:
      'The recon skills behind every cache bug: detect the cache, then fingerprint its key and normalisation.',
    keyPoints: [
      'Age, X-Cache and vendor headers reveal a cache.',
      'Compare HIT/MISS across inputs to map the key.',
      'Normalisation differences between cache and origin are the exploit.',
    ],
    scenes: [
      {
        id: 's1',
        title: 'Cold open',
        duration: 5,
        caption: 'Strong cache bugs start with patient recon.',
        visual: { kind: 'title', badge: 'Tutorial 05', title: 'Reading cache signals', subtitle: 'Detect, map, exploit.' },
      },
      {
        id: 's2',
        title: 'Is it cached?',
        duration: 10,
        caption: 'Send the same request twice and compare cache-related headers. A HIT on the second try confirms a cache.',
        visual: {
          kind: 'code',
          title: 'cache headers',
          lang: 'http',
          code: 'Age: 12\nX-Cache: HIT\nX-Served-By: cache-lhr-1\nCF-Cache-Status: HIT',
        },
      },
      {
        id: 's3',
        title: 'Map the key',
        duration: 11,
        caption: 'Vary one input at a time: if the response changes but the cache still HITs, that input is unkeyed.',
        visual: {
          kind: 'flow',
          nodes: [ATTACKER, CACHE, TARGET],
          packets: [
            { from: 'attacker', to: 'cache', label: 'change header A', at: 0.15, tone: 'forged' },
            { from: 'cache', to: 'attacker', label: 'still HIT → unkeyed', at: 0.6, tone: 'good' },
          ],
          note: 'Repeat per header, cookie and parameter.',
        },
      },
      {
        id: 's4',
        title: 'Normalisation',
        duration: 11,
        caption: 'Then probe how each side normalises the URL: path case, encodings, dot-segments, delimiters.',
        visual: {
          kind: 'code',
          title: 'normalisation probes',
          lang: 'text',
          code: '/home  vs  /HOME       (case)\n/a/../home             (dot-segments)\n/home%2f             (encoding)\n/home;x=y              (matrix param)',
        },
      },
      {
        id: 's5',
        title: 'Where they differ',
        duration: 10,
        caption: 'A difference between the cache’s view and the origin’s view is the exact seam an attacker exploits.',
        visual: {
          kind: 'bullets',
          heading: 'The seam',
          items: [
            'Cache keys one way, origin routes another.',
            'One side decodes, the other does not.',
            'That gap becomes poisoning or deception.',
          ],
        },
      },
      {
        id: 's6',
        title: 'Recap',
        duration: 8,
        caption: 'Detect the cache, map the key, fingerprint normalisation — then the exploit is mechanical.',
        visual: {
          kind: 'bullets',
          heading: 'Your recon checklist',
          items: [
            'Confirm a cache with Age / X-Cache.',
            'Find unkeyed inputs by varying one at a time.',
            'Probe normalisation on both sides.',
          ],
        },
      },
    ],
  },
  ...foundationsTutorials,
  ...attackTutorials,
  ...defenseTutorials,
  ...bypassTutorials,
  ...realWorldTutorials,
]

export const TUTORIAL_BY_ID = Object.fromEntries(TUTORIALS.map((t) => [t.id, t]))
