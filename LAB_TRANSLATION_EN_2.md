# Cache Forge — Translation file 2 (remaining UI: labs list, playground, request trace)

Badiiyadan soo socda waa qoraallada Ingiriisi ee hadhay ee aan weli Somali ku qornayn.
Fadlan qoraalka ka dib `:` u beddel Somali. **HA beddelin** furayaasha (key) iyo
meelaha placeholder-ka sida `{origin}`, `{path}`, `{field}`, `{payload}`, `{name}`,
`{crafted}`, `{reflected}`, `{kind}`, `{secret}`, `{n}`, `{blockedBy}`, `{title}`.

Translate only the text after ": ". Keep the keys and the `{...}` placeholders exactly
as they are (you may move a placeholder within the sentence if Somali grammar needs it).

---

## F. Labs list page

labs.badge: Attack Labs
labs.title: Poison real caches
labs.intro: Each lab is a live target behind a simulated CDN. Find the unkeyed input, fill the cache, then flip the defenses and break your own exploit.
labs.solved: Solved
labs.count: {n} labs
labs.poison: Poison
labs.deception: Deception
labs.open: Open lab

## G. Lab detail header (Lab page)

lab.all: All labs
lab.solved: Solved
lab.next: Next: {title}
lab.mode_poison: Cache Poisoning
lab.mode_deception: Cache Deception

## H. Inject kind badges

kind.header: header
kind.query: query
kind.cookie: cookie
kind.path: path

## I. Playground page

pg.badge: Playground
pg.title: Cache playground
pg.intro: Build your own scenario: pick the target, the unkeyed input, and the cache rules, then watch the request resolve hop by hop.
pg.target: Target
pg.mode_poison: Poisoning
pg.mode_deception: Deception
pg.site: Site
pg.private_path: Private path
pg.endpoint_path: Endpoint path
pg.disguise_url_with: Disguise the URL with
pg.unkeyed_input: Unkeyed input
pg.url_suffix: URL suffix
pg.payload: Payload
pg.reflection: Reflection
pg.cache_rules: Cache rules & defenses
pg.request: Request
pg.run: Run
pg.attack_succeeded: Attack succeeded
pg.attack_blocked: Attack blocked
pg.now_serves: The shared cache now serves the attacker version.
pg.stopped_by: Stopped by: {blockedBy}
pg.trace: Trace

pg.ref.host_script: Host -> script src
pg.ref.host_link: Host -> canonical link
pg.ref.host_redirect: Host -> redirect
pg.ref.scheme_redirect: Scheme -> redirect
pg.ref.param_html: Param -> HTML
pg.ref.cookie_html: Cookie -> HTML
pg.ref.xff_html: XFF -> HTML
pg.ref.route_override: Route override

## J. Request trace — phase labels (reused)

trace.phase.recon: Recon
trace.phase.attacker: Attacker
trace.phase.origin: Origin
trace.phase.cache: Cache
trace.phase.victim: Victim
trace.phase.impact: Impact
trace.phase.analysis: Analysis

## K. Request trace — poisoning mode

trace.poison.recon.label: Attacker studies the cache
trace.poison.recon.detail: The attacker notices {origin}{path} is cached. Probing shows the response varies with the {field} header, yet every response is stored under the same key.
trace.poison.prime.label: Prime the cache
trace.poison.prime.detail: They send one GET with {field}: {payload}. A normal user would never send this header - but the cache does not care.
trace.poison.noReflection.label: Nothing reflected
trace.poison.noReflection.detail: The origin does not use the {field} header when building this response, so the injected value never appears. This input cannot poison the cache here.
trace.poison.canonical.label: Canonical host enforced
trace.poison.canonical.detail: The application builds absolute URLs from a hard-coded origin instead of trusting {field}. The attacker's value is ignored, so the response is benign.
trace.poison.reflected.label: Injected value reflected
trace.poison.reflected.detail: Because the origin trusts {field}, the payload lands in the response: {reflected}
trace.poison.keyed.label: Input is part of the key
trace.poison.keyed.detail: The cache key now includes {field}. The priming request is stored under a key that includes the payload, so an unprimed request looks up a different entry and misses.
trace.poison.vary.label: Vary sent for the header
trace.poison.vary.detail: The origin responds with Vary: {field}. A compliant cache stores this variant separately, so a clean request no longer shares the poisoned copy.
trace.poison.staticOnly.label: Dynamic response not stored
trace.poison.staticOnly.detail: Static-only caching refuses to store this response (it is neither a static type nor on the asset allowlist), so the poisoned copy is discarded.
trace.poison.parser.label: Parser normalised
trace.poison.parser.detail: The cache normalises the request (delimiters, encodings, parameter boundaries) the same way the origin does, so the smuggled input can no longer hide from the key.
trace.poison.stored.label: Malicious response stored (MISS -> stored)
trace.poison.stored.detail: The cache had no entry for this key, so it fetched from the origin and stored the reflected response under {origin}{path}. The unkeyed {field} header is now baked into a shared entry.
trace.poison.victim.label: {name} requests the same URL
trace.poison.victim.detail: A clean GET from {name} carries no {field} header - but the URL is identical, so the cache looks up the poisoned entry.
trace.poison.hit.label: HIT - the poisoned copy is served
trace.poison.hit.detail: The cache has a hit and returns the poisoned response without ever contacting the origin. Every subsequent visitor gets the attacker's version.
trace.poison.impact.label: Poison delivered
trace.poison.analysis.label: What went wrong
trace.poison.analysis.detail: The response depended on {kind} that the cache key ignored, and the origin trusted it enough to echo it. Fix one: stop reflecting it, key on it, or stop caching it.

## L. Request trace — deception mode

trace.deception.recon.label: Attacker studies URL handling
trace.deception.recon.detail: The private page {origin}{path} must never be cached. The attacker tests whether the app still serves it when extra path data is appended.
trace.deception.craft.label: Craft a static-looking URL
trace.deception.craft.detail: They build {origin}{crafted}. It ends in a file extension ({field}) so the CDN classifies it as a static asset worth caching.
trace.deception.elsewhere.label: URL routes elsewhere
trace.deception.elsewhere.detail: With this trick the origin does not return the private page - it serves a real asset or a 404, so there is nothing private to cache.
trace.deception.victim.label: {name} opens the crafted URL
trace.deception.victim.detail: The attacker sends {name} (who is signed in) a link to {origin}{crafted}. The browser attaches the session cookie.
trace.deception.confusion.label: Path confusion - private page returned
trace.deception.confusion.detail: The origin ignores the extra suffix and renders the private page {path} with a 200 and Content-Type: text/html. The attacker's URL and the private page are, to the origin, the same resource.
trace.deception.nostore.label: no-store sent - but the cache may ignore it
trace.deception.nostore.detail: The origin now replies Cache-Control: private, no-store. That is the correct fix, but it only works if the CDN actually honours it. Turn on "Honour Origin Cache-Control" to make this reliable.
trace.deception.nostoreHonoured.label: no-store honoured - response refused
trace.deception.nostoreHonoured.detail: The origin marked the page private, no-store, and the cache respects it. A private page is never written to a shared cache.
trace.deception.typeMismatch.label: Content-type mismatch - refused
trace.deception.typeMismatch.detail: The URL looks static but the body is text/html. A cache that only stores responses whose type matches a static allowlist refuses to store it.
trace.deception.parser.label: Parser normalised - inputs reconciled
trace.deception.parser.detail: The cache now normalises the request the same way the origin does, so the two parsers no longer disagree. The smuggled input is no longer hidden from the key.
trace.deception.stored.label: Response stored under the crafted URL
trace.deception.stored.detail: The cache sees a 200 on a ".css"-style URL and stores {name}'s private page under {crafted}. It is now a shared cache entry.
trace.deception.fetch.label: Fetch the poisoned entry
trace.deception.fetch.detail: The attacker now requests {origin}{crafted} with no cookie. The cache does not need one - it already holds the private response.
trace.deception.hit.label: HIT - secret leaked
trace.deception.hit.detail: The cache serves {name}'s private page to the attacker.
trace.deception.leaked: Leaked: {secret}
trace.deception.impact.label: Private data disclosed
trace.deception.analysis.label: What went wrong
trace.deception.analysis.detail: The cache classified a dynamic, authenticated response as static and shared it. Fix: mark private pages no-store AND only cache responses that are genuinely static.

## M. Request trace — blocked reasons

trace.blocked.noReflection: No reflection of the injected input
trace.blocked.canonical: Canonical host
trace.blocked.keyed: Cache key includes the input
trace.blocked.vary: Vary on the unkeyed header
trace.blocked.staticOnly: Static-only caching
trace.blocked.normalise: URL normalisation
trace.blocked.deceptionElsewhere: Crafted URL does not reach the private page
trace.blocked.noStoreHonoured: no-store honoured by the cache
trace.blocked.staticType: Static-only caching (type check)
trace.blocked.normaliseParsing: Normalised request parsing

## N. Request trace — unkeyed kind phrases

trace.kind.cookie: a cookie value
trace.kind.param: a query parameter
trace.kind.header: a request header

## O. Request snippet comments

snip.deception_comment: The CDN classifies this as a static asset and caches the private page.
