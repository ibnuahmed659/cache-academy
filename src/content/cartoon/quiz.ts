import type { CartoonQuiz } from '@/lib/cartoon/types'

export const cartoonQuizzes: Record<string, CartoonQuiz> = {
  cf1: {
    questions: [
      { q: 'What is a web cache?', options: ['A shared copy of a response stored to serve many visitors', 'A database of passwords', 'A firewall rule set'], answer: 0 },
      { q: 'Why do sites use caches?', options: ['Faster responses and less origin load', 'To store user passwords', 'To encrypt traffic'], answer: 0 },
      { q: 'Who can receive a cached response?', options: ['Any request that matches the cache key', 'Only the original requester', 'Only administrators'], answer: 0 },
    ],
  },
  cf2: {
    questions: [
      { q: 'The cache key usually contains…', options: ['Scheme, host and path', 'Every header', 'The request body'], answer: 0 },
      { q: 'Which is usually NOT part of the cache key?', options: ['Most headers and cookies', 'The path', 'The host'], answer: 0 },
      { q: 'Two requests with the same key…', options: ['Share one cached response', 'Are always handled separately', 'Both reach the origin'], answer: 0 },
    ],
  },
  cf3: {
    questions: [
      { q: 'A cache MISS means…', options: ['The cache must fetch from the origin', 'The response was served from cache', 'The request failed'], answer: 0 },
      { q: 'A cache HIT means…', options: ['The stored copy is served without reaching the origin', 'The origin was updated', 'The cache was cleared'], answer: 0 },
      { q: 'Which header signals freshness?', options: ['Age', 'Content-Length', 'Server'], answer: 0 },
    ],
  },
  cf4: {
    questions: [
      { q: 'An unkeyed input is…', options: ['Something that changes the response but is not in the cache key', 'A key that is missing', 'An expired cookie'], answer: 0 },
      { q: 'Why are unkeyed inputs dangerous?', options: ['They let one user influence a response served to many', 'They slow the cache', 'They break TLS'], answer: 0 },
      { q: 'Which category is commonly unkeyed?', options: ['Proxy headers like X-Forwarded-Host', 'The path', 'The scheme'], answer: 0 },
    ],
  },
  cf5: {
    questions: [
      { q: 'Cache deception exploits…', options: ['A disagreement between the cache and the origin about a URL', 'A weak password', 'An expired certificate'], answer: 0 },
      { q: 'The cache decides to cache based on…', options: ['Whether the URL looks static', 'The user’s role', 'The session cookie'], answer: 0 },
      { q: 'The origin router decides based on…', options: ['Which route matches the path', 'The Cache-Control header', 'The Age header'], answer: 0 },
    ],
  },
  pa1: {
    questions: [
      { q: 'Which header is commonly reflected into absolute URLs?', options: ['X-Forwarded-Host', 'Accept-Language', 'Content-Type'], answer: 0 },
      { q: 'Why is X-Forwarded-Host poisoning effective?', options: ['It is often not in the cache key', 'It is encrypted', 'It is set by the browser'], answer: 0 },
      { q: 'The typical impact is…', options: ['Stored XSS served by the cache', 'Data loss', 'Downtime'], answer: 0 },
    ],
  },
  pa2: {
    questions: [
      { q: 'Priming the cache means…', options: ['Sending a request that makes the cache store your response', 'Deleting the cache', 'Flushing DNS'], answer: 0 },
      { q: 'The poisoned copy is stored under…', options: ['The clean cache key of the URL', 'The attacker’s host', 'A random key'], answer: 0 },
      { q: 'Who receives the poisoned response?', options: ['Every request matching that key', 'Only the attacker', 'Only logged-in users'], answer: 0 },
    ],
  },
  pa3: {
    questions: [
      { q: 'Which header can cause a scheme downgrade and redirect?', options: ['X-Forwarded-Scheme', 'X-Forwarded-For', 'Vary'], answer: 0 },
      { q: 'A poisoned redirect is dangerous because…', options: ['All visitors are sent to the attacker', 'It reveals the server version', 'It slows the origin'], answer: 0 },
      { q: 'Which status code is typical for a redirect?', options: ['301', '500', '204'], answer: 0 },
    ],
  },
  pa4: {
    questions: [
      { q: 'Cookies are usually…', options: ['Excluded from the cache key', 'The only key component', 'Encrypted in the cache'], answer: 0 },
      { q: 'Cookie poisoning works when the app…', options: ['Reflects a cookie value into the response', 'Deletes the cookie', 'Signs the cookie'], answer: 0 },
      { q: 'The fix is to…', options: ['Never reflect cookies, or key on them', 'Store more cookies', 'Disable caching entirely'], answer: 0 },
    ],
  },
  pa5: {
    questions: [
      { q: 'Parameter cloaking exploits…', options: ['Different parsing of the query by cache and backend', 'Weak TLS', 'Open ports'], answer: 0 },
      { q: 'A fat GET is…', options: ['A GET request that carries a body', 'A large cookie', 'A slow response'], answer: 0 },
      { q: 'Why is a fat GET useful to an attacker?', options: ['The cache ignores the body but the backend reads it', 'It bypasses authentication', 'It disables logging'], answer: 0 },
    ],
  },
  dc1: {
    questions: [
      { q: 'Cache deception appends what to a private URL?', options: ['A static-looking extension like .css', 'A session token', 'A nonce'], answer: 0 },
      { q: 'The cache caches because…', options: ['The URL looks like a static asset', 'The user is an admin', 'The cookie is present'], answer: 0 },
      { q: 'The origin returns…', options: ['The private page, ignoring the suffix', 'A 404', 'A static file'], answer: 0 },
    ],
  },
  dc2: {
    questions: [
      { q: 'Which character can split parsers in path handling?', options: [';', '&', '#'], answer: 0 },
      { q: 'A matrix parameter looks like…', options: ['/profile;.css', '/profile?.css', '/profile#css'], answer: 0 },
      { q: 'Delimiter deception works when…', options: ['One parser treats the delimiter as data and the other does not', 'TLS is weak', 'The server is offline'], answer: 0 },
    ],
  },
  dc3: {
    questions: [
      { q: 'Which encoding is commonly used in deception?', options: ['%2f', '%20', '%41'], answer: 0 },
      { q: 'A null byte (%00) can…', options: ['Make parsers disagree about the URL', 'Encrypt the request', 'Reset the cache'], answer: 0 },
      { q: 'The core problem is…', options: ['Encoding handled differently by cache and origin', 'Missing firewall', 'Weak password'], answer: 0 },
    ],
  },
  dc4: {
    questions: [
      { q: 'Dot-segment traversal uses…', options: ['../ and encoded variants', 'Cookies only', 'POST bodies'], answer: 0 },
      { q: 'The two parsers may…', options: ['Resolve dot-segments in different orders', 'Always agree', 'Ignore the host'], answer: 0 },
      { q: 'The goal of dot-segment deception is to…', options: ['Make a private page look cacheable', 'Overflow the server', 'Guess a password'], answer: 0 },
    ],
  },
  dc5: {
    questions: [
      { q: 'In the full chain, the victim must be…', options: ['Authenticated when loading the crafted link', 'Logged out', 'An administrator'], answer: 0 },
      { q: 'The attacker reads the data…', options: ['By requesting the same URL without a session', 'By cracking encryption', 'Through the origin logs'], answer: 0 },
      { q: 'The best fix is…', options: ['Mark private pages no-store', 'Disable cookies', 'Use longer URLs'], answer: 0 },
    ],
  },
  cd1: {
    questions: [
      { q: 'The safest source of the host value is…', options: ['Your own configuration', 'X-Forwarded-Host', 'The Host header'], answer: 0 },
      { q: 'Proxy headers should be…', options: ['Stripped or trusted only from your proxy', 'Always believed', 'Reflected into URLs'], answer: 0 },
      { q: 'Canonical validation means…', options: ['Checking the host against an allowlist', 'Using any host', 'Logging the host'], answer: 0 },
    ],
  },
  cd2: {
    questions: [
      { q: 'Which directive keeps a response out of shared caches?', options: ['private, no-store', 'public, max-age=3600', 'immutable'], answer: 0 },
      { q: 'Authenticated pages should generally be…', options: ['no-store', 'public', 'cached for a day'], answer: 0 },
      { q: 'no-cache means…', options: ['Store but always revalidate', 'Never store', 'Store forever'], answer: 0 },
    ],
  },
  cd3: {
    questions: [
      { q: 'Vary tells the cache…', options: ['Which headers the response depends on', 'When to delete entries', 'Which cookies to ignore'], answer: 0 },
      { q: 'Vary: Accept-Language prevents…', options: ['Serving the wrong language from cache', 'Cross-site scripting', 'SQL injection'], answer: 0 },
      { q: 'A Vary pitfall is…', options: ['Cache fragmentation with high-cardinality headers', 'Slower TLS', 'Larger cookies'], answer: 0 },
    ],
  },
  cd4: {
    questions: [
      { q: 'Key normalisation should match…', options: ['The origin’s routing logic', 'The attacker’s request', 'The browser’s cache'], answer: 0 },
      { q: 'Which must be normalised consistently?', options: ['Dot-segments, encodings and delimiters', 'Only the scheme', 'Only cookies'], answer: 0 },
      { q: 'Aligned parsing prevents…', options: ['Both poisoning and deception seams', 'Slow responses', 'TLS errors'], answer: 0 },
    ],
  },
  cd5: {
    questions: [
      { q: 'The safest caching policy is…', options: ['An allowlist of static extensions/content types', 'Caching everything', 'A denylist of bad URLs'], answer: 0 },
      { q: 'Should 4xx/5xx responses be cached broadly?', options: ['No', 'Yes', 'Only 404s'], answer: 0 },
      { q: 'Caching only static assets reduces…', options: ['The risk of poisoning and deception', 'Site speed', 'Availability'], answer: 0 },
    ],
  },
  cm1: {
    questions: [
      { q: 'Cache-busting DoS relies on…', options: ['Creating endless unique cache keys', 'Stealing cookies', 'Weak passwords'], answer: 0 },
      { q: 'The effect on legitimate users is…', options: ['More misses and origin overload', 'Faster pages', 'Better caching'], answer: 0 },
      { q: 'A mitigation is…', options: ['Key normalisation and rate limiting', 'Bigger servers only', 'Disabling HTTPS'], answer: 0 },
    ],
  },
  cm2: {
    questions: [
      { q: 'Mass XSS via cache poisoning starts with…', options: ['An unkeyed input reflected into a cached response', 'A database breach', 'A phishing email'], answer: 0 },
      { q: 'Why is the blast radius huge?', options: ['Every visitor receives the cached payload', 'Only the attacker is affected', 'It needs many requests'], answer: 0 },
      { q: 'The victim interaction required is…', options: ['None — just visiting the site', 'Clicking a link', 'Typing a password'], answer: 0 },
    ],
  },
  cm3: {
    questions: [
      { q: 'CDN confusion arises from…', options: ['The edge and origin normalising URLs differently', 'Slow DNS', 'Large payloads'], answer: 0 },
      { q: 'Which header reveals an edge cache?', options: ['X-Cache / CF-Cache-Status', 'Content-Type', 'Server'], answer: 0 },
      { q: 'Attackers map cache behaviour to…', options: ['Find the parsing seam', 'Increase bandwidth', 'Steal TLS keys'], answer: 0 },
    ],
  },
  cw1: {
    questions: [
      { q: 'The poisoned homepage attack used…', options: ['An unchecked host header reflected into HTML', 'A SQL query', 'A weak password'], answer: 0 },
      { q: 'Every visitor received…', options: ['Attacker-controlled JavaScript', 'A login prompt', 'An error page'], answer: 0 },
      { q: 'The root cause was…', options: ['Trusting an unkeyed input', 'Slow servers', 'Missing CDN'], answer: 0 },
    ],
  },
  cw2: {
    questions: [
      { q: 'The leaked profile case began with…', options: ['A crafted link ending in a static extension', 'A brute-force attack', 'A stolen laptop'], answer: 0 },
      { q: 'The private data ended up…', options: ['In a shared cache', 'In the attacker’s database only', 'In DNS'], answer: 0 },
      { q: 'The fix is…', options: ['no-store on private responses', 'Shorter URLs', 'Disabling cookies'], answer: 0 },
    ],
  },
  cw3: {
    questions: [
      { q: 'The hijacked redirect was caused by…', options: ['Scheme header poisoning of a cached 301', 'A typo in DNS', 'An expired domain'], answer: 0 },
      { q: 'Users were sent to…', options: ['A phishing page', 'The correct site', 'A 404'], answer: 0 },
      { q: 'The defense is…', options: ['Build redirect URLs from a canonical host', 'Allow any scheme', 'Remove redirects'], answer: 0 },
    ],
  },
  cw4: {
    questions: [
      { q: 'The stolen API response was…', options: ['User-specific JSON cached publicly', 'A static image', 'A CSS file'], answer: 0 },
      { q: 'Deception worked because the endpoint…', options: ['Looked cacheable to the CDN', 'Required no auth', 'Was unencrypted'], answer: 0 },
      { q: 'The best fix is…', options: ['Cache-Control: private, no-store on API data', 'Longer tokens', 'More logging'], answer: 0 },
    ],
  },
  cap1: {
    questions: [
      { q: 'First recon step for cache bugs…', options: ['Confirm a cache exists (Age / X-Cache)', 'Guess passwords', 'Scan ports'], answer: 0 },
      { q: 'To map the key you…', options: ['Vary one input at a time and watch HIT/MISS', 'Send one request', 'Read the source code only'], answer: 0 },
      { q: 'Normalisation probes include…', options: ['Case, encodings, dot-segments, delimiters', 'Only the path', 'Only cookies'], answer: 0 },
    ],
  },
  cap2: {
    questions: [
      { q: 'The full poisoning chain is…', options: ['Find unkeyed input, prime, store, serve', 'Scan, exploit, pivot', 'Phish, click, submit'], answer: 0 },
      { q: 'After priming, the payload is stored under…', options: ['A clean, shared cache key', 'A private key', 'The attacker’s host'], answer: 0 },
      { q: 'The outcome for visitors is…', options: ['They receive the attacker’s response', 'They see a 403', 'Nothing changes'], answer: 0 },
    ],
  },
  cap3: {
    questions: [
      { q: 'Effective cache defense is…', options: ['Layered: host, no-store, Vary, normalisation, allowlist', 'A single firewall rule', 'Longer passwords'], answer: 0 },
      { q: 'Why does the attacker fail at each layer?', options: ['Multiple independent controls cover the gap', 'The server is faster', 'The CDN is bigger'], answer: 0 },
      { q: 'The core rule is…', options: ['If the response depends on an input, key it or don’t cache it', 'Cache everything', 'Trust all headers'], answer: 0 },
    ],
  },
}

export function getQuiz(id: string): CartoonQuiz | undefined {
  return cartoonQuizzes[id]
}
