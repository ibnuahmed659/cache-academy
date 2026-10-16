# Cache Forge — Lab content: English source for Somali translation

Translate the value on the right of each `key:` line. Keep the `key:` exactly as-is and keep
`<placeholders>` like `{name}` / `{code}` untouched. Send the file back with Somali text filled in.

## A. Shared lab UI labels

ui.prime_cache: Prime the cache
ui.disguise_request: Disguise the request
ui.reset: Reset
ui.unkeyed_input: Unkeyed input
ui.disguise_url: Disguise the URL
ui.payload: Payload
ui.url_suffix: URL suffix
ui.priming_request: Priming request
ui.the_lure: The lure
ui.from_evil: from evil.example
ui.attacker_tool: attacker tool
ui.run_poison: Run the poison
ui.send_lure: Send the lure
ui.one_request_note: One request writes the shared cache entry for everyone.
ui.one_visitor_note: One visitor is enough. Then read the cache back.
ui.the_target: The target
ui.private_page: Private page
ui.cache_classifies_by: The cache classifies by
ui.origin_classifies_by: The origin classifies by
ui.url_extension: URL extension
ui.routed_path: routed path
ui.at_risk: At risk:
ui.cache_key: Cache key
ui.scheme_host_path: scheme + host + path
ui.everything_else: Everything else
ui.unkeyed: unkeyed
ui.cache_poisoned: Cache poisoned
ui.secret_disclosed: Secret disclosed
ui.attack_blocked: Attack blocked
ui.stopped_by: Stopped by:
ui.never_stored: The shared cache never stored the attacker’s version.
ui.request_trace: Request trace
ui.trace_empty: Run the attack to follow the request through the cache and the origin — step by step.
ui.trace_running: Tracing the request through the CDN…
ui.defense_panel: Defense panel
ui.defended: Defended
ui.defense_intro: You are the defender now. Flip the controls below, then re-run the same attack. Make it fail.
ui.apply_recommended: Apply recommended defenses
ui.rerun_attack: Re-run attack
ui.config_changed: Configuration changed
ui.now_rejected: The same attack is now rejected. Recommended posture:
ui.defense_in_depth: defense-in-depth
ui.the_victim: The victim
ui.shared_cache_note: authenticated response, shared cache
ui.trusts_cache_note: trusts the cache for this URL
ui.objectives: Objectives
ui.solved: Solved
ui.poison: Poison
ui.deception: Deception
ui.hints: Hints
ui.reveal_hints: Reveal hints
ui.guided_walkthrough: Guided walkthrough
ui.takeaway: Takeaway

## B. Stage & mode labels

stage.beginner: Beginner
stage.intermediate: Intermediate
stage.advanced: Advanced
stage.professional: Professional
mode.poison: Cache Poisoning
mode.deception: Cache Deception

## C. Defense controls (label / side / hint)

defense.canonicalHost.label: Canonicalise the host
defense.canonicalHost.side: origin
defense.canonicalHost.hint: Stop trusting Host/X-Forwarded-*; build URLs from a fixed origin.

defense.varyOnInput.label: Vary on the unkeyed header
defense.varyOnInput.side: origin
defense.varyOnInput.hint: Send Vary so caches key on the header instead of sharing one copy.

defense.respectCacheControl.label: Honour Origin Cache-Control
defense.respectCacheControl.side: cache
defense.respectCacheControl.hint: Respect private/no-store; never cache what the origin marks private.

defense.staticOnly.label: Cache only static content
defense.staticOnly.side: cache
defense.staticOnly.hint: Store responses only when the type/extension is truly static.

defense.keyUnkeyed.label: Key on the unkeyed input
defense.keyUnkeyed.side: cache
defense.keyUnkeyed.hint: Fold the header/param into the cache key so variants stay separate.

defense.normalizePath.label: Normalise the URL
defense.normalizePath.side: cache
defense.normalizePath.hint: Strip extensions and decode delimiters before hashing the key.

defense.originNoStore.label: no-store on private pages
defense.originNoStore.side: origin
defense.originNoStore.hint: Send Cache-Control: private, no-store for authenticated content.

## D. Inject points (label / blurb)

inject.x-forwarded-host.label: X-Forwarded-Host
inject.x-forwarded-host.blurb: A load-balancer header many apps trust to build absolute URLs.

inject.x-forwarded-scheme.label: X-Forwarded-Scheme
inject.x-forwarded-scheme.blurb: Tells the app the client arrived over a scheme — often used in redirect logic.

inject.x-host.label: X-Host
inject.x-host.blurb: A legacy host-override header some frameworks still read.

inject.forwarded.label: Forwarded
inject.forwarded.blurb: The RFC 7239 standard replacement for X-Forwarded-*.

inject.x-forwarded-server.label: X-Forwarded-Server
inject.x-forwarded-server.blurb: Another proxy hint apps sometimes echo into links.

inject.x-original-url.label: X-Original-URL
inject.x-original-url.blurb: A rewrite header that can smuggle a different path past the cache.

inject.x-rewrite-url.label: X-Rewrite-URL
inject.x-rewrite-url.blurb: Sibling of X-Original-URL used by some reverse proxies.

inject.x-forwarded-for.label: X-Forwarded-For
inject.x-forwarded-for.blurb: Client IP hint, frequently rendered onto the page ("your IP is ...").

inject.user-agent.label: User-Agent
inject.user-agent.blurb: Often unkeyed even when reflected into a "browser unsupported" page.

inject.accept-language.label: Accept-Language
inject.accept-language.blurb: Locale negotiation echoed into markup but rarely part of the key.

inject.x-country.label: X-Forwarded-For (geo)
inject.x-country.blurb: Used by geo-redirect logic; a poisoned redirect can be cached.

inject.query-unkeyed.label: Unkeyed query param
inject.query-unkeyed.blurb: A tracking parameter the origin reflects but the cache excludes from the key.

inject.query-cloak.label: Parameter cloaking
inject.query-cloak.blurb: Parser mismatch: cache sees two params, the backend sees one.

inject.query-fat.label: Fat GET body
inject.query-fat.blurb: A GET with a body the backend reads but the cache ignores.

inject.cookie-unkeyed.label: Unkeyed cookie
inject.cookie-unkeyed.blurb: A tracking/preference cookie echoed into the HTML but never keyed.

inject.path-extension.label: Appended extension
inject.path-extension.blurb: Trick the cache into treating a private page as a static asset.

inject.path-delimiter.label: Path delimiter
inject.path-delimiter.blurb: Matrix/semicolon confusion: the cache keys one path, the origin another.

inject.path-encoded.label: Encoded chars
inject.path-encoded.blurb: Percent-encoded slash/dot: the edge normalizes, the origin decodes.

inject.path-traversal.label: Dot-segment
inject.path-traversal.blurb: Dot-segment confusion between the cache normalizer and the router.

## E. Lab scenarios (16)

### host-header-script  [beginner · poison]

title: Poisoned host header, cached script
category: Unkeyed header
summary: The shop trusts X-Forwarded-Host when it builds asset URLs. The cache never keys on that header, so one attacker request poisons the HTML for everyone.
takeaway: If a response depends on an input the cache ignores, one request can set the truth for every visitor.
victim.name: Hodan
victim.disclosure: Signed-in shopper on a shared cache.
objective.0: Find which header the origin reflects into the page.
objective.1: Prime the cache with a single crafted request.
objective.2: Watch a clean victim request receive the poisoned copy.
hint.0: The page builds absolute script URLs from the request host.
hint.1: The cache key is just scheme + host + path — headers are invisible to it.
hint.2: Try X-Forwarded-Host or X-Host with a hostname you control.
walk.0.title: 1. Confirm the reflection
walk.0.body: Request /en/home and note that script/link URLs use whatever host you send. That is the unkeyed input.
walk.1.title: 2. Prime the cache
walk.1.body: Send one GET with X-Forwarded-Host: evil.example. The origin emits <script src="https://evil.example/..."> and the cache stores it under /en/home.
walk.2.title: 3. Serve the poison
walk.2.body: Any visitor requesting /en/home now gets the cached, attacker-controlled HTML. One request, unlimited victims.
impact: Every visitor to /en/home receives HTML that loads JavaScript from evil.example. That script runs on the shop origin — stored XSS, no phishing required.

### host-header-redirect  [beginner · poison]

title: Cached open redirect
category: Unkeyed header
summary: A redirect endpoint reads the host from a proxy header. Poison the redirect once and the cache keeps sending users to the attacker.
takeaway: An open redirect becomes far worse when the redirect itself is cached.
victim.name: Warsame
victim.disclosure: Reader who follows a /go link.
objective.0: Locate the redirect endpoint whose Location uses the request host.
objective.1: Poison the redirect into the cache.
objective.2: Confirm the victim is redirected to the attacker.
hint.0: Redirects are often cached aggressively.
hint.1: The Location header is built from X-Forwarded-Host / Forwarded.
hint.2: A 3xx with an absolute Location is the payload you want cached.
walk.0.title: 1. Why /go caches
walk.0.body: The redirect looks static, so the CDN stores it. Its target, however, is built from a header the key omits.
walk.1.title: 2. Poison the Location
walk.1.body: Send X-Forwarded-Host: evil.example and the origin replies Location: https://evil.example/. The cache saves it.
walk.2.title: 3. Impact
walk.2.body: Victims following trusted links to /go are bounced to the attacker. Cached open redirects are a favourite phishing primitive.
impact: The cached 301 sends every visitor of /go to https://evil.example/. Because it is cached, the redirect persists even after the attacker stops sending headers.

### deception-extension  [beginner · deception]

title: The .css that never existed
category: Cache deception
summary: Cache deception: disguise a private page as a static asset so the CDN stores and then shares it.
takeaway: The cache decides what to store from the URL, not the content. If those disagree, private data leaks.
victim.name: Amina
victim.disclosure: Signed-in customer viewing her profile.
objective.0: Find a suffix that keeps the private page reachable.
objective.1: Make the CDN cache the private response.
objective.2: Fetch it back with no session to prove the leak.
hint.0: Append .css, .js or .json to the private path.
hint.1: The origin ignores the extra path; the cache uses it to classify the asset.
hint.2: The attacker never needs the victim cookie — only the cached URL.
walk.0.title: 1. The mismatch
walk.0.body: /account/profile is dynamic and private. /account/profile.css looks static. The router strips the extension, so both render the same page.
walk.1.title: 2. Lure the victim
walk.1.body: Send the signed-in victim a link to /account/profile.css. The origin returns the profile with a 200 and an HTML body; the CDN caches it as an asset.
walk.2.title: 3. Read the cache
walk.2.body: Request the same URL with no cookie. The cache answers from storage and hands the attacker the profile.
impact: The attacker can read any victim profile that is tricked into opening the crafted link: name, IBAN, and balance.

### unkeyed-cookie  [intermediate · poison]

title: Unkeyed cookie poisons the banner
category: Unkeyed cookie
summary: A preference cookie is echoed into the page but left out of the cache key, so a crafted Cookie header poisons the shared copy.
takeaway: Cookies are inputs too. If a response reflects one and the cache ignores it, it is unkeyed.
victim.name: Yusuf
victim.disclosure: Reader landing on the inbox promo banner.
objective.0: Identify the cookie reflected into the page.
objective.1: Send the crafted Cookie header to prime the cache.
objective.2: Confirm the injected markup is served to a clean visitor.
hint.0: The banner prints a preference straight from a cookie.
hint.1: Cookies are usually unkeyed — the cache key is URL-based.
hint.2: Set the preference cookie to an HTML/script payload.
walk.0.title: 1. The reflection
walk.0.body: A prefs cookie value is written into the banner markup with no encoding.
walk.1.title: 2. Prime
walk.1.body: Send Cookie: prefs="><script>...</script>. The origin reflects it, and the cache — which never included the cookie — stores it.
walk.2.title: 3. Impact
walk.2.body: Everyone who loads /inbox gets the poisoned banner until the entry expires.
impact: The promo banner becomes attacker HTML. Because the cache stores it, every user sees the injected markup — stored XSS delivered by a cookie.

### unkeyed-query  [intermediate · poison]

title: The tracking parameter nobody keys
category: Unkeyed parameter
summary: A marketing parameter is rendered onto the page but excluded from the cache key — a classic unkeyed input.
takeaway: Analytics parameters are a classic unkeyed vector: reflected for analytics, ignored by the cache.
victim.name: Ilhan
victim.disclosure: Visitor opening the search results page.
objective.0: Find the query parameter that reaches the HTML.
objective.1: Poison the cached search page with it.
objective.2: Show a clean request receiving the payload.
hint.0: Marketing tags like utm_content are often reflected but stripped from the key.
hint.1: The cache key includes the path and the "real" params — not the tag.
hint.2: Percent-encode the payload so it survives the request line.
walk.0.title: 1. Spy the reflection
walk.0.body: The page echoes utm_content into a hidden field or banner without escaping.
walk.1.title: 2. Prime with the tag
walk.1.body: GET /search?utm_content=<payload>. The origin reflects it; the cache stores the response under /search.
walk.2.title: 3. Anyone poisoned
walk.2.body: A plain /search request now returns the attacker payload. The unkeyed parameter set the shared truth.
impact: The search page renders the tracking parameter unescaped, so the attacker stores HTML/script that runs for every visitor.

### deception-delimiter  [intermediate · deception]

title: Semicolon confusion caches the vault
category: Cache deception
summary: A matrix-parameter delimiter makes the cache treat a private page as a static file while the origin still renders it.
takeaway: Cache and origin parse URLs differently. Attack the disagreement, not the app.
victim.name: Cabdi
victim.disclosure: User viewing a private shared file.
objective.0: Find the delimiter the cache treats as an extension boundary.
objective.1: Cache the private listing behind it.
objective.2: Retrieve it without credentials.
hint.0: Matrix parameters like ;.js, ;.css confuse many caches.
hint.1: The origin still routes to the private page.
hint.2: No cookie needed on the read-back request.
walk.0.title: 1. Delimiter confusion
walk.0.body: /account/profile;.js looks like a JS asset to the cache, but the origin trims at the semicolon and serves the page.
walk.1.title: 2. Cache it
walk.1.body: The victim opens the disguised URL. The private body is stored under it.
walk.2.title: 3. Steal it
walk.2.body: The attacker fetches the URL and reads the private listing from cache.
impact: The private file listing is cached under a ;.js URL and served to the attacker, exposing the victim document.

### scheme-host-redirect  [intermediate · poison]

title: Scheme + host redirect poisoning
category: Unkeyed header
summary: Some apps force HTTPS using X-Forwarded-Scheme. Pair it with a host header and a cached redirect points anywhere.
takeaway: Poisoning is often two headers combined: one selects the code path, the other supplies the attacker value.
victim.name: Ilhan
victim.disclosure: Visitor hitting the login entry point.
objective.0: Trigger the scheme-based redirect.
objective.1: Steer its destination with a host header.
objective.2: Observe the poisoned redirect served to a victim.
hint.0: The app redirects to https when it thinks the scheme is not https.
hint.1: The redirect target is built from the host header.
hint.2: X-Forwarded-Scheme: nothttps is a classic trigger.
walk.0.title: 1. Find the redirect
walk.0.body: Send X-Forwarded-Scheme: nothttps and the app answers with a 301 to the https URL — built from a host header.
walk.1.title: 2. Combine
walk.1.body: Add X-Forwarded-Host: evil.example so the 301 points at the attacker. Both headers are unkeyed.
walk.2.title: 3. Cache the bait
walk.2.body: The cache stores the redirect; every visitor to /login is now sent to the phishing page.
impact: The cache stores a redirect that sends every visitor to an attacker-controlled login page — a perfect credential-phishing cache entry.

### deception-encoded  [intermediate · deception]

title: Encoded slash exposes the API key
category: Cache deception
summary: An encoded slash makes the CDN see a static file while the origin decodes it back to the private API endpoint.
takeaway: Normalisation differences (decoding, dot-segments, case) are the engine behind most cache-deception bugs.
victim.name: Cabdi
victim.disclosure: Developer viewing the token page.
objective.0: Use %2f so the cache reads an extension boundary.
objective.1: Cache /v1/me content under the encoded URL.
objective.2: Read the key back unauthenticated.
hint.0: The cache sees an encoded slash as part of one static path segment.
hint.1: The backend decodes %2f back into a real slash.
hint.2: Try /v1/me%2fapp.css style paths.
walk.0.title: 1. Two parsers
walk.0.body: The CDN treats %2f literally and sees a .css file. The origin decodes it and routes to /v1/me.
walk.1.title: 2. Cache
walk.1.body: The victim token page is stored under the encoded URL.
walk.2.title: 3. Exfiltrate
walk.2.body: A plain GET returns the API key — no session required.
impact: The personal API key is stored in the CDN and retrievable by anyone who knows the crafted URL.

### parameter-cloaking  [advanced · poison]

title: Parameter cloaking hides the payload
category: Parser mismatch
summary: The cache and the backend disagree on where one parameter ends, so a malicious value is hidden from the key but read by the app.
takeaway: When two parsers split a query string differently, an attacker can smuggle a value that only the origin sees.
victim.name: Warsame
victim.disclosure: Reader landing on the search page.
objective.0: Use a semicolon to make the cache stop parsing the parameter.
objective.1: Smuggle a reflected parameter the cache never keys.
objective.2: Serve the poison to a clean visitor.
hint.0: Many caches treat ; as a parameter separator; many backends do not.
hint.1: Everything after the ; is invisible to the cache key.
hint.2: The backend still parses q= and reflects it.
walk.0.title: 1. The disagreement
walk.0.body: ?q=lb;animal=cat — the cache keys q=lb;animal=cat, while the backend reads only q=lb and a separate animal param.
walk.1.title: 2. Smuggle
walk.1.body: Hide a reflected parameter after the ; so the cache ignores it but the origin renders it.
walk.2.title: 3. Poison
walk.2.body: The page is cached with the attacker markup under the innocuous-looking key.
impact: The hidden value renders into the cached page, poisoning it for everyone while the cache key looks completely clean.

### original-url  [advanced · poison]

title: Rewrite header smuggles /admin
category: Unkeyed header
summary: A rewrite header makes the origin serve /admin while the cache caches the response under a harmless public path.
takeaway: Path-rewrite headers change what the origin returns without changing the URL the cache keys on — a silent privilege leak.
victim.name: Ilhan
victim.disclosure: Visitor loading the public homepage.
objective.0: Send a rewrite header to change the served route.
objective.1: Cache the privileged response under the public URL.
objective.2: Retrieve the sensitive page as an outsider.
hint.0: Some proxies route on X-Original-URL or X-Rewrite-URL.
hint.1: The cache never sees the header — only the URL.
hint.2: The response body is the sensitive page, the key is not.
walk.0.title: 1. Route override
walk.0.body: X-Original-URL: /admin makes the origin render the admin panel while the request URL stays /en/home.
walk.1.title: 2. Cache it
walk.1.body: The cache stores the admin body under the public path.
walk.2.title: 3. Leak
walk.2.body: Everyone requesting the homepage is served the admin panel.
impact: The admin panel is cached under /en/home. Any visitor — including unauthenticated ones — now sees the admin page.

### xff-ip  [advanced · poison]

title: Your IP, cached for everyone
category: Unkeyed header
summary: The comment page prints the client IP from X-Forwarded-For. Because the cache is unkeyed on it, one request stores XSS for all.
takeaway: Anything rendered onto the page is an injection surface — including headers you thought were informational.
victim.name: Hodan
victim.disclosure: Visitor reading a thread.
objective.0: Find where the client IP is rendered.
objective.1: Inject markup through X-Forwarded-For.
objective.2: Confirm the cached thread serves it to others.
hint.0: Pages that show "your IP" are prime targets.
hint.1: The header is reflected verbatim, unescaped.
hint.2: The cache does not key on X-Forwarded-For.
walk.0.title: 1. Reflection
walk.0.body: The thread footer prints the requester IP from X-Forwarded-For.
walk.1.title: 2. Prime
walk.1.body: Send an IP value containing HTML/script. The origin stores it in the response; the cache stores the response.
walk.2.title: 3. Spread
walk.2.body: All readers of the thread get the injected script.
impact: Every visitor to the thread receives attacker markup in the "posted from" line — stored XSS across the whole forum.

### deception-dotseg  [advanced · deception]

title: Dot-segment steals the API token
category: Cache deception
summary: A doctored path with ..%2f makes the cache store a token page under a static-looking URL.
takeaway: The edge and the origin must resolve dot-segments identically, or the cache will store the wrong thing under the wrong key.
victim.name: Yusuf
victim.disclosure: Developer on the personal access tokens page.
objective.0: Craft a dot-segment path the origin resolves to the tokens page.
objective.1: Cache the token listing as an asset.
objective.2: Read the token back with no cookie.
hint.0: The cache normalises ..%2f one way, the origin another.
hint.1: End the path in a static extension to invite caching.
hint.2: The endpoint is authenticated, but the cached copy is not.
walk.0.title: 1. Confuse the resolver
walk.0.body: /settings/..%2fsettings/tokens.css resolves differently at the edge than at the origin.
walk.1.title: 2. Cache the tokens
walk.1.body: The origin returns the token list; the cache stores it.
walk.2.title: 3. Steal
walk.2.body: A cookie-less request returns the developer secrets.
impact: A live personal access token is cached and retrievable by the attacker, enabling full account takeover.

### mass-xss  [professional · poison]

title: One request, every user: cached XSS
category: Impact chain
summary: A single unkeyed header turn turns a marketing site into mass stored XSS, exploiting the cache as a delivery amplifier.
takeaway: A small unkeyed-input bug scales to an unlimited-victim exploit precisely because the cache amplifies it.
victim.name: Amina
victim.disclosure: Any visitor to the cached front page.
objective.0: Identify the unkeyed host input on the homepage.
objective.1: Poison the cached bundle URL.
objective.2: Confirm mass execution for a clean visitor.
hint.0: The homepage references a JS bundle by absolute URL.
hint.1: That URL is built from a request header.
hint.2: The cache holds one copy for all users.
walk.0.title: 1. Find the input
walk.0.body: Absolute asset URLs on the homepage come from the request host.
walk.1.title: 2. Weaponise
walk.1.body: Point the bundle at your own origin with X-Forwarded-Host.
walk.2.title: 3. Scale
walk.2.body: The cached page delivers your script to every visitor.
impact: The homepage is cached pointing its main bundle at evil.example. Every reader executes attacker JavaScript on the news origin — account takeover at scale.

### deception-pii  [professional · deception]

title: Cache deception exfiltrates PII
category: Cache deception
summary: A private tax record is cached under a static URL and retrieved wholesale.
takeaway: Cache deception is a data-breach primitive: no XSS, no phishing page — just a misclassified cached response.
victim.name: Amina
victim.disclosure: Citizen viewing their tax statement.
objective.0: Disguise the statement as a static asset.
objective.1: Cache it in the shared CDN.
objective.2: Pull the whole PII record back.
hint.0: Many suffix variants will route to the same private page.
hint.1: The cache stores based on the URL, not the sensitivity.
hint.2: The read-back is fully unauthenticated.
walk.0.title: 1. Classify
walk.0.body: Append .css / ;.js / %2f so the cache sees an asset.
walk.1.title: 2. Store
walk.1.body: The victim opens the link; the PII page is cached.
walk.2.title: 3. Dump
walk.2.body: The attacker fetches the URL and reads the record.
impact: A full identity record — name, national ID, address, income — is cached and readable by the attacker.

### fat-get  [professional · poison]

title: Fat GET body hides the poison
category: Parser mismatch
summary: A GET request with a body the backend reads but the cache ignores smuggles an unkeyed value.
takeaway: Not just headers: a GET body is untraditional, unstandardised, and frequently unkeyed.
victim.name: Warsame
victim.disclosure: Shopper landing on a product page.
objective.0: Send a GET with a body the backend parses.
objective.1: Reflect a value the cache never keys.
objective.2: Deliver the poison to a clean request.
hint.0: Some servers read parameters from a GET body; caches do not.
hint.1: The body is invisible to the cache key.
hint.2: Content-Type: application/x-www-form-urlencoded helps the backend parse it.
walk.0.title: 1. Unusual, but allowed
walk.0.body: A GET can carry a body. The backend merges it into its parameters.
walk.1.title: 2. Smuggle
walk.1.body: Put a reflected parameter in the body — the cache ignores it entirely.
walk.2.title: 3. Poison
walk.2.body: The response is cached under the clean URL with the attacker value baked in.
impact: The product page renders attacker markup from the ignored request body, cached for every shopper.

### vary-confusion  [professional · poison]

title: Vary confusion caches the wrong variant
category: Parser mismatch
summary: A Vary header that ignores a real input, or keys on the wrong one, lets one variant overwrite another.
takeaway: Vary is a promise about which inputs matter. Get the list wrong and the cache serves the wrong response to the wrong user.
victim.name: Hodan
victim.disclosure: Reader landing on the localised homepage.
objective.0: Find an input that changes the page but not the Vary list.
objective.1: Cache a variant for everyone.
objective.2: Show the wrong copy served to a clean visitor.
hint.0: The page reflects Accept-Language or User-Agent content.
hint.1: A missing Vary means the cache treats variants as identical.
hint.2: The cache stores whichever variant arrives first.
walk.0.title: 1. Variants
walk.0.body: The origin varies the page by a header but never advertises it with Vary.
walk.1.title: 2. First-writer wins
walk.1.body: The attacker requests the variant containing their payload; the cache stores it for the whole URL.
walk.2.title: 3. Everyone shares it
walk.2.body: Clean visitors are served the attacker variant.
impact: The localized page is cached for all languages and the injected value is served site-wide.
