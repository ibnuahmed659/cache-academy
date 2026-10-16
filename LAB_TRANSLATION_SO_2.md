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
labs.title: Wasakhayn caches-ka dhabta ah
labs.intro: Shaybaarradu waa bartilmaameedyo nool oo ku jira gadaal ka dambeeya CDN la soo sawiray. Raadi input aan la key-gareyn, buuxi cache-ka, markaasna sii beddel difaacyada oo jebbi exploit-kaaga.
labs.solved: Xalliyey
labs.count: {n} shaybaar
labs.poison: Wasakhayn
labs.deception: Deception
labs.open: Fur shaybaar

## G. Lab detail header (Lab page)

lab.all: Dhammaan shaybaarada
lab.solved: Xalliyey
lab.next: Xiga: {title}
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
pg.intro: Dhis xaaladdaada: dooro target-ka, unkeyed input-ka, iyo cache rules-ka, ka dibna daawo request-ku sida uu hop-kii-hop ugu xalliyo.
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
pg.trace: Raad-raac

pg.ref.host_script: Host -> script src
pg.ref.host_link: Host -> canonical link
pg.ref.host_redirect: Host -> redirect
pg.ref.scheme_redirect: Scheme -> redirect
pg.ref.param_html: Param -> HTML
pg.ref.cookie_html: Cookie -> HTML
pg.ref.xff_html: XFF -> HTML
pg.ref.route_override: Bedelka route-ka

## J. Request trace — phase labels (reused)

trace.phase.recon: Recon
trace.phase.attacker: Attacker
trace.phase.origin: Origin
trace.phase.cache: Cache
trace.phase.victim: Victim
trace.phase.impact: Impact
trace.phase.analysis: Analysis

## K. Request trace — poisoning mode

trace.poison.recon.label: Attacker wuxuu barto cache-ka
trace.poison.recon.detail: Weeraryahanku wuxuu ogaadaa {origin}{path} in la cached yahay. Baaritaanno waxay muujinayaan in response-ku ku kala duwanaado iyadoo lagu salaynayo header-ka {field}, haddana response kasta waxaa lagu kaydiyaa isla key-ga.
trace.poison.prime.label: Uruuri cache-ka (Prime the cache)
trace.poison.prime.detail: Waxay diraan hal GET oo leh {field}: {payload}. Isticmaale caadi ah marnaba ma diri lahaa header-kan - laakiin cache-ku waxba kama qabo.
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
trace.deception.parser.detail: Cache-ku hadda wuxuu u sameeynayaa normalisation codsiga si la mid ah sida origin-ka u sameeyo, sidaas darteed labada parser mar dambe ma khilaafaan. Input-kii la smuggle-gareeyay hadda kuma qarsoona key-ga.
trace.deception.stored.label: Response lagu keydiyey URL-kii la sameeyay
trace.deception.stored.detail: Cache-ku wuxuu arkayaa 200 oo ku saabsan URL nooca ".css" ah wuxuuna kaydiyaa bogga private ee {name} hoos {crafted}. Hadda waa entry cache wadaag ah.
trace.deception.fetch.label: Soo hel entry-ga la wasakheeyey
trace.deception.fetch.detail: Afduubuhu hadda wuxuu codsanayaa {origin}{crafted} adigoon cookie lahayn. Cache-ku uma baahna mid - horey ayuu u haystaa response-kii private.
trace.deception.hit.label: HIT - sir ayaa soo baxay
trace.deception.hit.detail: Cache-ku wuxuu u adeegaa afduubaha bogga private ee {name}.
trace.deception.leaked: La dhuftay: {secret}
trace.deception.impact.label: Xog gaar ah oo la shaaciyey
trace.deception.analysis.label: Maxaa qaldamay
trace.deception.analysis.detail: Cache-ku wuxuu u aqoonsaday response firfircoon oo la xaqiijiyay inuu yahay static wuxuuna wadaagay. Xalka: calaamadee boggaga private sida no-store IYO kaliya cache-garee responses dhab ahaan static ah.

## M. Request trace — blocked reasons

trace.blocked.noReflection: Ma jirto muuqaalka input-kii la duray
trace.blocked.canonical: Host-ka canonical
trace.blocked.keyed: Cache key-gu wuxuu ku jiraa input-ka
trace.blocked.vary: Vary on the unkeyed header
trace.blocked.staticOnly: Kaliya caching static
trace.blocked.normalise: URL normalisation
trace.blocked.deceptionElsewhere: URL-ka la sameeyay ma gaadho bogga private
trace.blocked.noStoreHonoured: no-store waxaa ixtiraamay cache-ku
trace.blocked.staticType: Kaliya caching static (hubinta nooca)
trace.blocked.normaliseParsing: Fasiraad codsi oo la normaliseeyey

## N. Request trace — unkeyed kind phrases

trace.kind.cookie: qiimaha cookie-ga
trace.kind.param: parameter-ka query-ga
trace.kind.header: header-ka codsiga

## O. Request snippet comments

snip.deception_comment: CDN-ku wuxuu tan u aqoonsaday inay tahay static asset wuxuuna cache-gareeyey bogga private.
