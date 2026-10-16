import type { Tutorial } from '../types'
import { ATTACKER, CACHE, BROWSER, TARGET, VICTIM } from '../cast'

export const foundationsTutorials: Tutorial[] = [
  {
    id: 'cache-basics',
    title: 'How a web cache works',
    subtitle: 'The shared copy between you and the origin.',
    category: 'Foundations',
    level: 'beginner',
    accent: 'ember',
    summary:
      'A web cache stores copies of responses so the next request can be answered without reaching the origin. It decides what to keep with a cache key, and it keeps each copy only for a limited time.',
    keyPoints: [
      'A cache answers with a saved copy instead of asking the origin again.',
      'Caches live in the browser, at the CDN edge, and in reverse proxies.',
      'A HIT is a stored copy; a MISS fetches from the origin and may store the result.',
    ],
    scenes: [
      {
        id: 's1',
        title: 'A copy, not the original',
        duration: 10,
        caption:
          'Every request to a real application costs work: a database query, some computation, a rendered page. A cache removes most of that cost by keeping a copy of the answer.',
        visual: {
          kind: 'title',
          badge: 'Foundations',
          title: 'How a web cache works',
          subtitle: 'The shared copy between you and the origin.',
        },
      },
      {
        id: 's2',
        title: 'What a cache is',
        duration: 11,
        caption:
          'A cache is a store of previously fetched responses. When a matching request arrives, the cache answers directly from that store instead of contacting the origin server.',
        visual: {
          kind: 'bullets',
          heading: 'A cache is a saved copy',
          items: [
            'The origin server produces the real response.',
            'The cache stores a copy of that response.',
            'The next matching request is answered from the copy.',
          ],
        },
      },
      {
        id: 's3',
        title: 'Where caches live',
        duration: 12,
        caption:
          'Caches are not one thing. A single page load can pass through several of them, from your own device out to a global edge network.',
        visual: {
          kind: 'bullets',
          heading: 'Three common places',
          items: [
            'Browser cache: images, CSS and JS stored on your device.',
            'CDN or edge cache: servers in hundreds of cities, close to users.',
            'Reverse proxy cache: sits directly in front of the origin.',
          ],
        },
      },
      {
        id: 's4',
        title: 'HIT versus MISS',
        duration: 11,
        caption:
          'When a request arrives, the cache asks one question: do I already have a copy? A HIT means yes. A MISS means no, so the request is forwarded to the origin.',
        visual: {
          kind: 'bullets',
          heading: 'HIT and MISS',
          items: [
            'HIT: the saved copy is returned. The origin never sees the request.',
            'MISS: no copy exists. The origin answers, and the cache may store it.',
            'BYPASS: the cache was told not to store or serve anything.',
          ],
        },
      },
      {
        id: 's5',
        title: 'The normal cache flow',
        duration: 13,
        caption:
          'Here is the ordinary path. The browser asks the cache, the cache misses, the origin produces the response, the cache stores a copy, and the browser receives it.',
        visual: {
          kind: 'flow',
          nodes: [BROWSER, CACHE, TARGET],
          packets: [
            { from: 'browser', to: 'cache', label: 'GET /product?id=5', at: 0.05, tone: 'request' },
            { from: 'cache', to: 'target', label: 'MISS — forward it', at: 0.3, tone: 'request' },
            { from: 'target', to: 'cache', label: 'fresh response', at: 0.55, tone: 'good' },
            { from: 'cache', to: 'browser', label: 'serves response', at: 0.8, tone: 'good' },
          ],
          note: 'The cache stores the response so the next visitor gets a HIT.',
        },
      },
      {
        id: 's6',
        title: 'How long a copy lives: TTL',
        duration: 12,
        caption:
          'Caches do not keep copies forever. The origin sets a time to live with Cache-Control: max-age. Until that time expires, the cache may keep serving the same copy.',
        visual: {
          kind: 'code',
          lang: 'http',
          title: 'The origin sets the lifetime',
          code: 'HTTP/1.1 200 OK\nCache-Control: max-age=120\nX-Cache: MISS\n\nProduct #5 — Back to home',
        },
      },
      {
        id: 's7',
        title: 'Reading a real response',
        duration: 13,
        caption:
          'Two headers tell you what happened. Age shows how long the cache has held this copy. X-Cache tells you whether it came from the cache or from the origin.',
        visual: {
          kind: 'code',
          lang: 'http',
          title: 'A cached response',
          code: 'HTTP/1.1 200 OK\nCache-Control: max-age=120\nAge: 47\nX-Cache: HIT\n\nProduct #5 — Back to home',
        },
      },
      {
        id: 's8',
        title: 'A second visitor gets the copy',
        duration: 12,
        caption:
          'The next visitor asks for the same page. The copy is still inside its lifetime, so the cache answers immediately. The origin is not involved at all.',
        visual: {
          kind: 'flow',
          nodes: [VICTIM, BROWSER, CACHE, TARGET],
          packets: [
            { from: 'browser', to: 'cache', label: 'GET /product?id=5', at: 0.08, tone: 'request' },
            { from: 'cache', to: 'browser', label: 'HIT — Age: 47', at: 0.45, tone: 'good' },
            { from: 'browser', to: 'target', label: 'origin never asked', at: 0.8, tone: 'blocked' },
          ],
          note: 'Faster for the user, cheaper for the site — and shared.',
        },
      },
      {
        id: 's9',
        title: 'Why sites bother',
        duration: 11,
        caption:
          'Caching exists for speed and for money. Pages load faster, the origin handles far less traffic, and bandwidth and compute costs drop sharply.',
        visual: {
          kind: 'impact',
          heading: 'Why caches exist',
          before: 'every visitor hits the origin',
          after: 'most visitors hit a nearby copy',
          note: 'Speed, cost, and load — that is the whole motivation.',
        },
      },
    ],
  },
  {
    id: 'the-cache-key',
    title: 'The cache key decides everything',
    subtitle: 'Why two visitors can receive the same response.',
    category: 'Foundations',
    level: 'beginner',
    accent: 'ember',
    summary:
      'A cache matches requests using a small fingerprint called the cache key, usually the scheme, host and path. Anything left out of that key is invisible to the cache, even when it changes the response.',
    keyPoints: [
      'The cache key is usually scheme plus host plus path, often with the query string.',
      'Most headers, cookies, and the request body are not part of the key.',
      'Vary tells a cache which extra headers to include; everything else is unkeyed input.',
    ],
    scenes: [
      {
        id: 's1',
        title: 'One question, one fingerprint',
        duration: 10,
        caption:
          'A cache holds many copies at once. To pick the right one, it builds a fingerprint of the request — the cache key — and looks for an exact match.',
        visual: {
          kind: 'title',
          badge: 'Foundations',
          title: 'The cache key decides everything',
          subtitle: 'The fingerprint behind every HIT.',
        },
      },
      {
        id: 's2',
        title: 'What the key usually is',
        duration: 12,
        caption:
          'By default the key is the scheme, the host and the path. Many configurations also include the query string. Two identical keys mean the cache treats the requests as the same document.',
        visual: {
          kind: 'bullets',
          heading: 'Key = scheme + host + path',
          items: [
            'https + shop.example + /product/id=5 — one key.',
            'A different path produces a different key.',
            'A different query string often produces a different key too.',
          ],
        },
      },
      {
        id: 's3',
        title: 'Exact match, or nothing',
        duration: 11,
        caption:
          'A cache hit only happens on an exact key match. Change any part of the key and the cache treats the request as something it has never seen.',
        visual: {
          kind: 'code',
          lang: 'http',
          title: 'Three requests, two keys',
          code: 'GET /product?id=5      -> key A\nGET /product?id=7      -> key B\nGET /product?id=5      -> key A again (HIT)',
        },
      },
      {
        id: 's4',
        title: 'What is not in the key',
        duration: 13,
        caption:
          'Here is the part that matters. Most of what travels with a request never reaches the key. The cache ignores it completely, even when the origin server reads it.',
        visual: {
          kind: 'bullets',
          heading: 'Usually NOT in the key',
          items: [
            'Most request headers, including many proxy headers.',
            'Cookies and the Authorization header.',
            'The request body — even on a request the app treats as a GET.',
          ],
        },
      },
      {
        id: 's5',
        title: 'Two visitors, one key',
        duration: 13,
        caption:
          'Two requests that differ only in an unkeyed detail share the same key. Whatever the first response contained is what the second visitor will receive.',
        visual: {
          kind: 'flow',
          nodes: [ATTACKER, BROWSER, CACHE, TARGET],
          packets: [
            { from: 'browser', to: 'cache', label: 'GET /product?id=5', at: 0.05, tone: 'request' },
            { from: 'cache', to: 'target', label: 'MISS', at: 0.28, tone: 'request' },
            { from: 'target', to: 'cache', label: 'response stored', at: 0.52, tone: 'good' },
            { from: 'browser', to: 'cache', label: 'same key later', at: 0.78, tone: 'cookie' },
          ],
          note: 'Same key means the same stored response, for everyone.',
        },
      },
      {
        id: 's6',
        title: 'Vary: the exception',
        duration: 12,
        caption:
          'The origin can ask the cache to look at extra headers. Vary: User-Agent, for example, makes mobile and desktop receive separate cached copies.',
        visual: {
          kind: 'code',
          lang: 'http',
          title: 'Extending the key with Vary',
          code: 'HTTP/1.1 200 OK\nCache-Control: max-age=300\nVary: User-Agent, Accept-Encoding\n\nThe cache now keys on those headers too.',
        },
      },
      {
        id: 's7',
        title: 'Unkeyed input, defined',
        duration: 12,
        caption:
          'Any part of a request that changes the response but is not part of the cache key is called unkeyed input. That single term is the core of everything that follows.',
        visual: {
          kind: 'bullets',
          heading: 'Unkeyed input',
          items: [
            'It changes what the origin returns.',
            'It does not change the cache key.',
            'So the cache stores one response and serves it under one key.',
          ],
        },
      },
      {
        id: 's8',
        title: 'The takeaway',
        duration: 10,
        caption:
          'The cache key is the only thing the cache uses to tell requests apart. Know what is inside it — and more importantly, know what is not.',
        visual: {
          kind: 'bullets',
          heading: 'Remember',
          items: [
            'The key is usually scheme, host, path and query.',
            'Headers, cookies and bodies are usually unkeyed.',
            'Vary is how an origin pulls a header into the key.',
          ],
        },
      },
    ],
  },
  {
    id: 'unkeyed-inputs',
    title: 'Unkeyed inputs',
    subtitle: 'State that changes the response but not the key.',
    category: 'Foundations',
    level: 'beginner',
    accent: 'steel',
    summary:
      'An unkeyed input is anything the origin server reads and reflects, but the cache leaves out of its key. Proxy headers, cookies, query parameters and the request body are the common families.',
    keyPoints: [
      'Proxy headers such as X-Forwarded-Host are read by origins and ignored by cache keys.',
      'Query parameters and the request body can influence a response without entering the key.',
      'If the response changes but the key does not, the cache will store that change for everyone.',
    ],
    scenes: [
      {
        id: 's1',
        title: 'The gap that matters',
        duration: 10,
        caption:
          'The origin server and the cache read the same request with different priorities. Whatever the origin uses but the cache ignores is an unkeyed input.',
        visual: {
          kind: 'title',
          badge: 'Foundations',
          title: 'Unkeyed inputs',
          subtitle: 'Changes the response. Never changes the key.',
        },
      },
      {
        id: 's2',
        title: 'The definition again',
        duration: 11,
        caption:
          'Ask two questions. Does this value change the response the origin produces? And is it part of the cache key? If the answers are yes and no, it is unkeyed.',
        visual: {
          kind: 'bullets',
          heading: 'Two questions',
          items: [
            'Does the origin read this value?',
            'Does the value appear in the cache key?',
            'Yes and no means unkeyed — and that is the risk.',
          ],
        },
      },
      {
        id: 's3',
        title: 'Family one: proxy headers',
        duration: 13,
        caption:
          'Applications behind a proxy often trust headers that describe the original request. Those headers are attacker-controlled, and caches almost never put them in the key.',
        visual: {
          kind: 'bullets',
          heading: 'Proxy and forwarding headers',
          items: [
            'X-Forwarded-Host — used to build links and redirects.',
            'X-Forwarded-Scheme — decides http or https in generated URLs.',
            'X-Original-URL and X-Rewrite-URL — can change which route the app handles.',
            'Forwarded — the standardised version of the same idea.',
          ],
        },
      },
      {
        id: 's4',
        title: 'A response that reflects the header',
        duration: 13,
        caption:
          'Suppose the application builds a "Back to home" link from X-Forwarded-Host. One header changes the response body — while the key stays exactly the same.',
        visual: {
          kind: 'code',
          lang: 'http',
          title: 'The origin reflects the header',
          code: 'GET /product?id=5 HTTP/1.1\nHost: shop.example\nX-Forwarded-Host: evil.example\n\n=> <a href="https://evil.example/home">Back to home</a>',
        },
      },
      {
        id: 's5',
        title: 'Family two: cookies',
        duration: 12,
        caption:
          'Cookies are rarely part of the key. If the origin reads a cookie and renders it into a public page, the cache can store that personalised output under a public key.',
        visual: {
          kind: 'code',
          lang: 'http',
          title: 'A cookie that reaches the body',
          code: 'GET /product?id=5 HTTP/1.1\nHost: shop.example\nCookie: theme=dark; pref=attacker\n\n=> the page renders the attacker-chosen preference',
        },
      },
      {
        id: 's6',
        title: 'Family three: query parameters',
        duration: 12,
        caption:
          'Query parameters are a mixed case. Some CDNs key on the whole query string, some only on selected parameters, and some ignore it. Any parameter the key drops is unkeyed.',
        visual: {
          kind: 'bullets',
          heading: 'Query parameters',
          items: [
            'Tracking parameters like utm_source are often ignored by the key.',
            'A parameter that changes output but not the key is unkeyed.',
            'The cache does not know which parameters matter to the app.',
          ],
        },
      },
      {
        id: 's7',
        title: 'Family four: the request body',
        duration: 12,
        caption:
          'Caches do not key on the request body, even when the application treats the request as a read. That combination is often called a fat GET.',
        visual: {
          kind: 'code',
          lang: 'http',
          title: 'A fat GET',
          code: 'GET /product?id=5 HTTP/1.1\nHost: shop.example\nContent-Type: application/x-www-form-urlencoded\n\nutm_source=attacker&note=poisoned',
        },
      },
      {
        id: 's8',
        title: 'Why one example is enough',
        duration: 13,
        caption:
          'The header was unkeyed, so the cache stored the response under the ordinary key. From that moment, every visitor receives the attacker-influenced copy.',
        visual: {
          kind: 'impact',
          heading: 'One unkeyed value, one stored copy',
          before: 'href="https://shop.example/home"',
          after: 'href="https://evil.example/home"',
          note: 'The key never changed. The response did.',
        },
      },
      {
        id: 's9',
        title: 'The habit to build',
        duration: 11,
        caption:
          'When you test, do not only ask whether a value changes the response. Ask whether the cache will save that change and hand it to other people.',
        visual: {
          kind: 'bullets',
          heading: 'The habit',
          items: [
            'Watch X-Cache and Age on every response.',
            'Change one unkeyed value and re-send the same key.',
            'If the change persists, the cache stored it.',
          ],
        },
      },
    ],
  },
  {
    id: 'shared-trust',
    title: 'The trust problem of a shared cache',
    subtitle: 'One response, served to everyone.',
    category: 'Foundations',
    level: 'beginner',
    accent: 'ember',
    summary:
      'A cache has no idea who a response is for. It stores bytes and returns them to whoever asks with the right key. If an unkeyed input shaped that response, the cache will serve that shape to every visitor.',
    keyPoints: [
      'A cache answers from stored bytes, with no session or authorisation check.',
      'Poisoning stores a bad response and serves it to innocent visitors.',
      'Deception stores a private response and serves it to unauthenticated readers.',
    ],
    scenes: [
      {
        id: 's1',
        title: 'Built for sharing',
        duration: 10,
        caption:
          'Everything about a cache is designed around reuse. That is its entire purpose — and it is also the source of every cache attack there is.',
        visual: {
          kind: 'title',
          badge: 'Foundations',
          title: 'The trust problem of a shared cache',
          subtitle: 'One response, served to everyone.',
        },
      },
      {
        id: 's2',
        title: 'The cache does not know you',
        duration: 12,
        caption:
          'The cache has no concept of a logged-in user, of a private page, or of who originally produced a response. It applies a rule about the URL and stores what it is given.',
        visual: {
          kind: 'bullets',
          heading: 'What the cache cannot see',
          items: [
            'It does not inspect whether a response is private.',
            'It does not check a session or an authorisation header.',
            'It only matches a key and returns the bytes it holds.',
          ],
        },
      },
      {
        id: 's3',
        title: 'One key, many people',
        duration: 12,
        caption:
          'A single cache node can answer thousands of visitors. Whatever is stored under one key is what all of those visitors receive — identical, every time.',
        visual: {
          kind: 'flow',
          nodes: [VICTIM, BROWSER, CACHE],
          packets: [
            { from: 'browser', to: 'cache', label: 'GET /product?id=5', at: 0.08, tone: 'request' },
            { from: 'cache', to: 'browser', label: 'stored response', at: 0.45, tone: 'good' },
            { from: 'victim', to: 'browser', label: 'another visitor', at: 0.75, tone: 'request' },
          ],
          note: 'The cache answers without asking who is asking.',
        },
      },
      {
        id: 's4',
        title: 'The dangerous combination',
        duration: 13,
        caption:
          'Put the pieces together. An unkeyed input changes the response, the key does not change, so the cache stores that altered response under an ordinary public key.',
        visual: {
          kind: 'bullets',
          heading: 'The combination',
          items: [
            'An unkeyed value reaches the origin and changes the output.',
            'The cache key stays the same as for normal visitors.',
            'The cache stores the altered response and shares it.',
          ],
        },
      },
      {
        id: 's5',
        title: 'Poison: a bad response, stored',
        duration: 13,
        caption:
          'In cache poisoning, the attacker causes the origin to produce a malicious response, the cache stores it, and every later visitor receives the attacker version.',
        visual: {
          kind: 'flow',
          nodes: [ATTACKER, BROWSER, CACHE, TARGET],
          packets: [
            { from: 'browser', to: 'cache', label: 'poisoned request', at: 0.06, tone: 'forged' },
            { from: 'cache', to: 'target', label: 'MISS', at: 0.28, tone: 'request' },
            { from: 'target', to: 'cache', label: 'poisoned response', at: 0.52, tone: 'forged' },
            { from: 'cache', to: 'browser', label: 'served to visitors', at: 0.78, tone: 'good' },
          ],
          note: 'The stored copy carries the attacker influence forward.',
        },
      },
      {
        id: 's6',
        title: 'Poison, seen directly',
        duration: 11,
        caption:
          'The visible effect is simple. A page that used to link to the real site now links somewhere else, and every visitor sees the same wrong destination.',
        visual: {
          kind: 'impact',
          heading: 'Poisoned for everyone',
          before: 'href="https://shop.example/home"',
          after: 'href="https://evil.example/home"',
          note: 'The key was innocent. The stored copy was not.',
        },
      },
      {
        id: 's7',
        title: 'Deception: a private response, stored',
        duration: 13,
        caption:
          'Cache deception runs the other way. A logged-in user is tricked into requesting a private page through a URL the cache decides to store. The private response is saved under a public-looking key.',
        visual: {
          kind: 'flow',
          nodes: [VICTIM, BROWSER, CACHE, TARGET],
          packets: [
            { from: 'browser', to: 'cache', label: 'GET /account.css', at: 0.06, tone: 'cookie' },
            { from: 'cache', to: 'target', label: 'MISS', at: 0.3, tone: 'request' },
            { from: 'target', to: 'cache', label: 'private response', at: 0.54, tone: 'cookie' },
            { from: 'cache', to: 'browser', label: 'stored under public key', at: 0.8, tone: 'good' },
          ],
          note: 'The cache treated private data as a static asset.',
        },
      },
      {
        id: 's8',
        title: 'Deception, the read',
        duration: 12,
        caption:
          'Now an unauthenticated reader requests the same URL. The cache answers from the stored copy. No session, no password — the private data is simply handed over.',
        visual: {
          kind: 'flow',
          nodes: [ATTACKER, BROWSER, CACHE],
          packets: [
            { from: 'browser', to: 'cache', label: 'GET /account.css', at: 0.08, tone: 'forged' },
            { from: 'cache', to: 'browser', label: 'HIT — private copy', at: 0.45, tone: 'good' },
            { from: 'browser', to: 'attacker', label: 'reads the data', at: 0.78, tone: 'forged' },
          ],
          note: 'A cache hit skips every authorisation check.',
        },
      },
      {
        id: 's9',
        title: 'The takeaway',
        duration: 12,
        caption:
          'A cache is a performance tool, not a security boundary. It shares whatever it stores, so anything you allow into a stored response is shared too.',
        visual: {
          kind: 'bullets',
          heading: 'Remember',
          items: [
            'A cache serves stored bytes with no identity check.',
            'Poisoning puts a bad response where good visitors will get it.',
            'Deception puts a private response where anyone can read it.',
          ],
        },
      },
    ],
  },
]
