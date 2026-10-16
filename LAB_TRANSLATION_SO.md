# Cache Forge — Lab content: English source for Somali translation

Translate the value on the right of each `key:` line. Hay `key:` si sax ah sidii uu yahay oo sii hay
`<placeholders>` like `{name}` / `{code}` untouched. Send the file back with Somali text filled in.

## A. Shared lab UI labels

ui.prime_cache: U diyaari cache
ui.disguise_request: Qari request
ui.reset: Dib u celi
ui.unkeyed_input: Input aan key lahayn
ui.disguise_url: Qari URL
ui.payload: Payload
ui.url_suffix: URL suffix
ui.priming_request: Priming request
ui.the_lure: Khiyaanka
ui.from_evil: from evil.example
ui.attacker_tool: Qalabka weerarka
ui.run_poison: Fuli sunta
ui.send_lure: Dir khiyaanka
ui.one_request_note: Hal request ayaa qoraya shared cache entry qof kasta.
ui.one_visitor_note: Hal booqde waa ku filan. Kadib akhri cache-ka.
ui.the_target: Bartilmaameedka
ui.private_page: Bog Private
ui.cache_classifies_by: Cache-ku wuxuu kala saaraa
ui.origin_classifies_by: Origin-ku wuxuu kala saaraa
ui.url_extension: URL extension
ui.routed_path: routed path
ui.at_risk: Halista:
ui.cache_key: Cache key
ui.scheme_host_path: scheme + host + path
ui.everything_else: Wax kasta oo kale
ui.unkeyed: unkeyed
ui.cache_poisoned: Cache la suntey
ui.secret_disclosed: Sir la shaaciyey
ui.attack_blocked: Attack waa la joojiyey
ui.stopped_by: Waxaa joojiyey:
ui.never_stored: Shared cache-ka marnaba ma kaydin nuqulkii weeraryahanka.
ui.request_trace: Request trace
ui.trace_empty: Fuli attack si aad ula socoto request-ka dhex mara cache iyo origin — tallaabo tallaabo.
ui.trace_running: Raad-raacaya request-ka dhex mara CDN…
ui.defense_panel: Guddi Difaac
ui.defended: La difaacay
ui.defense_intro: Adigu hadda waxaad tahay difaacaha. Beddel kontoroolada hoose, ka dibna dib u orod isla attack-kii. Ka dhig inuu guuldareysto.
ui.apply_recommended: Difaacyada la taliyay dhaqan geli
ui.rerun_attack: Dib u orod attack
ui.config_changed: Qaabeynta waa la beddelay
ui.now_rejected: Isla attack-kii hadda waa la diiday. Istaraatijiyadda la taliyay:
ui.defense_in_depth: defense-in-depth
ui.the_victim: Dhibbanaha
ui.shared_cache_note: authenticated response, shared cache
ui.trusts_cache_note: Wuxuu cache-ka u aaminan yahay URL-kan
ui.objectives: Ujeeddooyinka
ui.solved: La xaliyey
ui.poison: Sunto
ui.deception: Deception
ui.hints: Talooyin
ui.reveal_hints: Muuji talooyinka
ui.guided_walkthrough: Hagitaan talaabo-talaabo
ui.takeaway: Casharka

## B. Stage & mode labels

stage.beginner: Bilowga
stage.intermediate: Dhexdhexaad
stage.advanced: Horumarsan
stage.professional: Xirfadle
mode.poison: Cache Poisoning
mode.deception: Cache Deception

## C. Defense controls (label / side / hint)

defense.canonicalHost.label: host-ka u qaabee qaab canonical
defense.canonicalHost.side: origin
defense.canonicalHost.hint: Ha aaminin Host/X-Forwarded-*; dhis URLs adoo ka soo qaadanaya origin go'an.

defense.varyOnInput.label: Vary ku samee header-ka aan key-ga lahayn.
defense.varyOnInput.side: origin
defense.varyOnInput.hint: Dir Vary si caches ay key ugu sameeyaan header halkii ay ka wadaagi lahaayeen hal nuqul.

defense.respectCacheControl.label: Ixtiraam Origin Cache-Control
defense.respectCacheControl.side: cache
defense.respectCacheControl.hint: Ixtiraam private/no-store; waligaa ha cache-gareyn waxa origin uu calaamadiyo inuu private yahay.

defense.staticOnly.label: Cache kaliya content static ah.
defense.staticOnly.side: cache
defense.staticOnly.hint: Kaydi responses kaliya marka type/extension dhab ahaan ay static tahay.

defense.keyUnkeyed.label: Key ku samee unkeyed input.
defense.keyUnkeyed.side: cache
defense.keyUnkeyed.hint: Ku dar header/param gudaha cache key si variants ay u sii ahaadaan kuwo kala duwan.

defense.normalizePath.label: URL-ka caadiyee
defense.normalizePath.side: cache
defense.normalizePath.hint: Ka saar extensions oo decode garee delimiters kahor inta aan hashing lagu sameyn key-ga.

defense.originNoStore.label: no-store bogagga private
defense.originNoStore.side: origin
defense.originNoStore.hint: Dir Cache-Control: private, no-store loogu talagalay authenticated content.

## D. Inject points (label / blurb)

inject.x-forwarded-host.label: X-Forwarded-Host
inject.x-forwarded-host.blurb: Header load-balancer ah oo apps badan ay ku tiirsan yihiin si ay u dhisaan absolute URLs.

inject.x-forwarded-scheme.label: X-Forwarded-Scheme
inject.x-forwarded-scheme.blurb: Waxay app-ka u sheegtaa in client-ku yimid over scheme — badanaa waxaa loo isticmaalaa redirect logic.

inject.x-host.label: X-Host
inject.x-host.blurb: Header xilligii hore oo host-override ah oo frameworks qaar ay weli akhriyaan.

inject.forwarded.label: Forwarded
inject.forwarded.blurb: Waa standard-ka RFC 7239 ee beddelka X-Forwarded-*.

inject.x-forwarded-server.label: X-Forwarded-Server
inject.x-forwarded-server.blurb: Tilmaame proxy oo kale oo apps mararka qaar ku soo celin karaan links.

inject.x-original-url.label: X-Original-URL
inject.x-original-url.blurb: Header rewrite ah oo si qarsoodi ah u gudbin kara path kala duwan iyadoo ka ag maraya cache.

inject.x-rewrite-url.label: X-Rewrite-URL
inject.x-rewrite-url.blurb: Nooc la mid ah X-Original-URL oo ay isticmaalaan qaar ka mid ah reverse proxies.

inject.x-forwarded-for.label: X-Forwarded-For
inject.x-forwarded-for.blurb: Client IP hint, badanaa lagu soo bandhigo page-ka ("your IP is ...").

inject.user-agent.label: User-Agent
inject.user-agent.blurb: Badanaa waa unkeyed xitaa marka lagu muujiyo page-ka "browser unsupported".

inject.accept-language.label: Accept-Language
inject.accept-language.blurb: Locale negotiation ayaa lagu soo celiyaa markup-ka laakiin marmar kama mid aha key-ga.

inject.x-country.label: X-Forwarded-For (geo)
inject.x-country.blurb: Waxaa loo isticmaalaa geo-redirect logic; poisoned redirect ayaa la cache-gareyn karaa.

inject.query-unkeyed.label: Query param aan key-ga lahayn.
inject.query-unkeyed.blurb: Parameter tracking ah oo origin uu soo celiyo balse cache uu ka reebo key-ga.

inject.query-cloak.label: Parameter cloaking
inject.query-cloak.blurb: Parser mismatch: cache waxay aragtaa laba params, backend-ku wuxuu arkaa hal.

inject.query-fat.label: Fat GET body
inject.query-fat.blurb: GET leh body oo backend-ku akhriyo laakiin cache-ku iska indhatirayo.

inject.cookie-unkeyed.label: Cookie aan key-ga lahayn
inject.cookie-unkeyed.blurb: A cookie tracking/preference lagu soo celiyo HTML-ka laakiin marna looma keyin (unkeyed).

inject.path-extension.label: Kordhin la lifaaqay
inject.path-extension.blurb: Ku khiyaanee cache-ka si uu bog private u tixgeliyo sida static asset.

inject.path-delimiter.label: Kala-soocaha path
inject.path-delimiter.blurb: Matrix/semicolon confusion: cache-ku wuxuu key gareeyaa hal path, origin-kuna mid kale.

inject.path-encoded.label: Xarfo la encoded
inject.path-encoded.blurb: Percent-encoded slash/dot: edge-ku wuu caadiyeeyaa, origin-kuna wuu kala furfurayaa.

inject.path-traversal.label: Dot-segment
inject.path-traversal.blurb: Isfahan la'aan Dot-segment oo u dhaxaysa cache normalizer-ka iyo router-ka.

## E. Lab scenarios (16)

### host-header-script  [beginner · poison]

title: host header la suntey, cached script
category: Header aan la keyin
summary: Dukaanku wuxuu ku tiirsan yahay X-Forwarded-Host marka uu dhiso asset URLs. Cache-ku waligiis kama key gareeyo header-kaas, sidaas darteed hal request oo attacker ah ayaa HTML-ka u poison gareeya dhammaan.
takeaway: Haddii response-ku uu ku xirnaado input ay cache-ku iska indhatirto, hal request ayaa xaqa u go'aamin kara booqde kasta.
victim.name: Hodan
victim.disclosure: Shopper signed-in oo ku jira cache wadaag ah.
objective.0: Ogow header-ka origin-ku ku soo celiyo bogga.
objective.1: Prime cache-ka hal request oo si farsamo loo sameeyay.
objective.2: Daawo victim request nadiif ah oo helaysa nuqul la poisoned.
hint.0: Boggu wuxuu dhisaa absolute script URLs isagoo ka qaadanaya request host-ka.
hint.1: Cache key-gu waa kaliya scheme + host + path — headers-na way u muuqdaan kuwo aan jirin.
hint.2: Isku day X-Forwarded-Host ama X-Host adigoo isticmaalaya hostname aad adigu maamusho.
walk.0.title: 1. Xaqiiji reflection-ka
walk.0.body: Request /en/home oo ogow in script/link URLs ay isticmaalaan host-ka aad dirtay. Taasi waa unkeyed input.
walk.1.title: 2. Prime the cache
walk.1.body: Dir hal GET oo wata X-Forwarded-Host: evil.example. Origin-ku wuxuu soo saaraa <script src="https://evil.example/..."> iyo cache-ku wuxuu kaydiyaa hoos /en/home.
walk.2.title: 3. Serve the poison
walk.2.body: Booqde kasta oo requesting /en/home hadda wuxuu helayaa cached, attacker-controlled HTML. Hal request, booqdeyaal aan xadidnayn.
impact: Booqde kasta oo taga /en/home wuxuu helayaa HTML soo rarka JavaScript ka socda evil.example. Script-kaas wuxuu ka shaqeeyaa shop origin — stored XSS, looma baahna phishing.

### host-header-redirect  [beginner · poison]

title: Cached open redirect
category: Header aan la keyin
summary: Redirect endpoint-ku wuxuu akhriyaa host-ka isagoo ka qaadanaya proxy header. Hal mar u poison redirect-ka kadib cache-ku wuxuu sii wadaa inuu users u diro attacker-ka.
takeaway: Open redirect-ku wuu ka sii daran yahay marka redirect-ka laftiisu la cached yahay.
victim.name: Warsame
victim.disclosure: Akhriste raaco link-ka /go.
objective.0: Raadi redirect endpoint-ka halka Location ay isticmaasho request host.
objective.1: Poison redirect-ka si loogu kaydiyo cache-ka.
objective.2: Xaqiiji in victim la redirect gareeyey una socday attacker-ka.
hint.0: Redirects badanaa si xawli ah ayaa loo cache gareeyaa.
hint.1: Location header waxaa laga dhisaa X-Forwarded-Host / Forwarded.
hint.2: 3xx leh absolute Location waa payload-ka aad rabto in la cached gareeyo.
walk.0.title: 1. Sababta /go u cache gareeyo
walk.0.body: Redirect-ku wuu u muuqdaa static, sidaas darteed CDN-ku wuu kaydiyaa. Hadafka (target)-na waxaa laga dhisaa header-ka key-gu ka reebmo.
walk.1.title: 2. Poison Location-ka
walk.1.body: Dir X-Forwarded-Host: evil.example iyo origin-ku wuxuu ka jawaabaa Location: https://evil.example/. Cache-ku wuu kaydiyaa.
walk.2.title: 3. Saamaynta
walk.2.body: Victims raaca links lagu kalsoon yahay ee /go waxaa loo leexiyaa attacker-ka. Cached open redirects waa primitive caan ku ah phishing-ka.
impact: Cached 301-ku wuxuu diro booqde kasta oo /go ah una diraa https://evil.example/. Maaddaama la cached yahay, redirect-ku wuu sii jiraa xitaa ka dib marka attacker-ka joojiyo dirista headers.

### deception-extension  [beginner · deception]

title: File .css oo abid jirin
category: Cache deception
summary: Cache deception: u ekaanshee bog private sida static asset si CDN-ku uu u stores ka dibna u shares gareeyo.
takeaway: Cache-ku wuxuu go'aamiyaa waxa la store gareeyo iyadoo laga eegayo URL, maahan content-ka. Haddii labaduba ka duwan yihiin, xogta private way dhex baxdaa.
victim.name: Amina
victim.disclosure: Customer signed-in oo daawanaysa profile-keeda.
objective.0: Raadi suffix ka dhigaya in bogga private la gaari karo.
objective.1: Ka dhig CDN inuu cache gareeyo response-ka private.
objective.2: Soo celi adoon haysan session si aad u caddeyso in xog la daadiyey.
hint.0: Ku dar .css, .js ama .json path-ka private.
hint.1: Origin-ku wuu iska indhatiraa path-ka dheeraadka ah; cache-ku waxa uu u isticmaalaa si uu u kala saaro asset-ka.
hint.2: Attacker-ku marnaba uma baahna victim cookie — kaliya cached URL-ka.
walk.0.title: 1. Is-maandhaafka
walk.0.body: /account/profile waa dynamic oo private. /account/profile.css waxay u muuqataa static. Router-ku wuxuu ka jarayaa extension-ka, sidaas darteed labaduba waxay soo bandhigayaan isla page-ka.
walk.1.title: 2. Ku khiyaaneeya victim-ka
walk.1.body: U dir victim-ka saxiixan link u ah /account/profile.css. Origin-ku wuxuu soo celiyaa profile-ka isagoo wata 200 iyo HTML body; CDN-ku wuxuu ku keydiyaa sida asset.
walk.2.title: 3. Akhri cache-ka
walk.2.body: Codso URL-kii isla markaana aan lahayn cookie. Cache-ku wuxuu ka jawaabaa kaydka (storage) wuxuuna attacker-ka siiya profile-ka.
impact: Attacker-ku waxa uu akhriyi karaa profile kasta oo victim ah oo lagu khiyaaneeyo inuu furto link-ga la farsameeyey: name, IBAN, and balance.

### unkeyed-cookie  [intermediate · poison]

title: Unkeyed cookie poisons the banner
category: Unkeyed cookie
summary: Preference cookie ayaa lagu soo celiyey page-ka laakiin laga reebay cache key-ga, sidaas darteed Cookie header la farsameeyey ayaa wasakhaynaysa nuqulka la wadaago.
takeaway: Cookies sidoo kale waa inputs. Haddii response-ku uu mid ka mid ah ka tarjumayo oo cache-ku iska indhatiray, waa unkeyed.
victim.name: Yusuf
victim.disclosure: Akhriste ku degaya inbox promo banner-ka.
objective.0: Aqoonsado cookie-ga lagu soo bandhigay page-ka.
objective.1: U dir Cookie header la farsameeyey si aad u prime-gareyso cache-ka.
objective.2: Xaqiiji in markup-ga la duray lagu sii daayo served booqde nadiif ah.
hint.0: Banner-ku waxa uu daabacaa preference si toos ah uga imanaysa cookie.
hint.1: Cookies badanaa waa unkeyed — cache key-gu waxa uu ku salaysan yahay URL.
hint.2: Deji preference cookie-ga si uu u noqdo HTML/script payload.
walk.0.title: 1. Tarjumidda
walk.0.body: Qiimaha prefs cookie waxaa lagu qoraa banner markup-ka iyadoo aan la samayn encoding.
walk.1.title: 2. Prime
walk.1.body: Send Cookie: prefs=\"><script>...</script>. The origin reflects it, and the cache — which never included the cookie — stores it.
walk.2.title: 3. Saamaynta
walk.2.body: Qof kasta oo fura /inbox wuxuu helayaa banner-ka wasakhaysan ilaa entry-gu ka dhacayo.
impact: Promo banner-ku wuxuu isu beddelaa attacker HTML. Maaddaama cache-ku uu kaydiyo, qof kasta wuu arkaa markup-ga la duray — stored XSS oo ay keentay cookie.

### unkeyed-query  [intermediate · poison]

title: The tracking parameter nobody keys
category: Unkeyed parameter
summary: Marketing parameter ayaa lagu soo bandhigay page-ka laakiin laga saaray cache key-ga — input unkeyed oo caadi ah.
takeaway: Analytics parameters waa vector unkeyed oo caadi ah: waxaa loo tarjumaa analytics, cache-kuna wuu iska indhatiraa.
victim.name: Ilhan
victim.disclosure: Booqde furaya bogga natiijooyinka search.
objective.0: Raadi query parameter-ka gaara HTML-ka.
objective.1: Wasakhayn bogga search ee cached-ka adigoo adeegsanaya.
objective.2: Tusi request nadiif ah oo helaya payload-ka.
hint.0: Marketing tags sida utm_content badanaa waa la tarjumaa laakiin laga xoqaa key-ga.
hint.1: Cache key-gu waxa uu ka kooban yahay path-ka iyo "real" params — ma ahan tag-ga.
hint.2: Percent-encode payload-ka si uu uga badbaado request line-ka.
walk.0.title: 1. Ufiirso reflection-ka
walk.0.body: Page-ku wuxuu utm_content ku celinayaa field qarsoon ama banner iyada oo aan la escaping.
walk.1.title: 2. Prime adigoo adeegsanaya tag-ga
walk.1.body: GET /search?utm_content=<payload>. The origin reflects it; the cache stores the response under /search.
walk.2.title: 3. Qof kasta oo la wasakhiyey
walk.2.body: Request caadi ah /search hadda wuxuu soo celiyaa attacker payload-ka. Unkeyed parameter-ku wuxuu dejiyey runta la wadaago.
impact: Bogga search wuxuu tracking parameter-ka ku soo bandhigayaa iyadoo aan la escaping, sidaas darteed attacker-ku wuxuu kaydiyaa HTML/script oo u ordaaya booqde kasta.

### deception-delimiter  [intermediate · deception]

title: Semicolon confusion ayaa cache-gareysa vault-ka
category: Cache deception
summary: Delimiter-ka matrix-parameter-ka ayaa ka dhigaya cache-ku inuu page private ah u qaato sida static file halka origin-ku wali uu u render-gareeyo.
takeaway: Cache iyo origin waxay URLs u parse-gareeyaan si ka duwan. Attack the disagreement, not the app.
victim.name: Cabdi
victim.disclosure: Isticmaalaha daawanaya file private oo la wadaagay.
objective.0: Raadi kala-qaybiyaha uu cache-ku u aqoonsado inuu yahay xuduud extension.
objective.1: Cache liiska private ee ka dambeeya.
objective.2: Soo hel adigoon isticmaalin credentials.
hint.0: Matrix parameters sida ;.js, ;.css ayaa jahliya caches badan.
hint.1: Origin-ku weli wuu u wadaa bogga private.
hint.2: Cookie looma baahna on the read-back request.
walk.0.title: 1. Khaladka delimiter-ka
walk.0.body: /account/profile;.js waxay u muuqataa JS asset u ah cache-ka, laakiin origin-ku wuu jaraa markuu gaaro semicolon-ka una adeegaa bogga.
walk.1.title: 2. Cache garee
walk.1.body: Dhibanuhu wuxuu furayaa URL-ka la qarinayo. Nuxurka private waxaa lagu kaydiyaa hoostiisa.
walk.2.title: 3. Xado
walk.2.body: Weeraryahanku wuxuu soo qaadaa URL-ka una akhriyaa liiska private ee cache-ka ku jira.
impact: Liiska faylasha private waxaa lagu kaydiyaa cache-ka hoostiisa URL ;.js oo loo adeegsadaa weeraryahanka, taasoo soo bandhigaysa dukumintiga dhibanaha.

### scheme-host-redirect  [intermediate · poison]

title: Scheme + host redirect poisoning
category: Header aan key laheyn
summary: Qaarkood apps waxay ku qasbaan HTTPS iyagoo adeegsanaya X-Forwarded-Scheme. Ku dhufo host header oo cached redirect uu tilmaami karo meel kasta.
takeaway: Poisoning badanaa waa isku darka laba header: mid ayaa dooranaya code path-ka, kan kalena wuxuu siinayaa attacker-ka value.
victim.name: Ilhan
victim.disclosure: Booqdehu oo gaaraya goobta login-ka.
objective.0: Kici redirect-ka ku saleysan scheme-ka.
objective.1: Hagaaji meesha uu u socdo adoo adeegsanaya host header.
objective.2: Daawo poisoned redirect-ka loo adeegsaday dhibane.
hint.0: App-ku wuxuu redirect-gareeyaa ilaa https marka uu u maleeyo in scheme-ku aanu ahayn https.
hint.1: Redirect target-ka waxaa laga dhisaa host header-ka.
hint.2: X-Forwarded-Scheme: nothttps waa trigger caan ah.
walk.0.title: 1. Raadi redirect-ka
walk.0.body: Dir X-Forwarded-Scheme: nothttps kadibna app-ku wuxuu ka jawaabaa 301 ilaa https URL — oo laga dhisay host header.
walk.1.title: 2. Isku dar
walk.1.body: Kudar X-Forwarded-Host: evil.example si 301-ku u tilmaamo weeraryahanka. Labada header waa aan la-keydin.
walk.2.title: 3. Cache bait-ka
walk.2.body: Cache-ku wuxuu kaydiyaa redirect-ka; booqde kasta ee /login hadda waxaa loo diraa bog phishing ah.
impact: Cache-ku wuxuu kaydiyaa redirect u dira booqde kasta bog login oo ay ka taliso attacker-ka — waa entry cache oo ku habboon credential-phishing.

### deception-encoded  [intermediate · deception]

title: Encoded slash exposes the API key
category: Cache deception
summary: Encoded slash wuxuu ka dhigayaa in CDN-ku u arko file static halka origin-ku u decode-gareeyo si uu ugu laabto private API endpoint.
takeaway: Farqiga Normalisation (decoding, dot-segments, case) waa sababta ugu weyn ee ka dambaysa bugs badan oo cache-deception.
victim.name: Cabdi
victim.disclosure: Developer-ka oo daawanaya bogga token-ka.
objective.0: Isticmaal %2f si cache-ku u aqriyo xuduud extension.
objective.1: Cache /v1/me content hoostiisa under the encoded URL.
objective.2: Akhriso key-ga adigoon la aqoonsaneyn.
hint.0: Cache-ku wuxuu encoded slash u arkaa qayb ka mid ah hal static path segment.
hint.1: Backend-ku wuxuu %2f u decode-gareeyaa isagoo ka dhigay slash dhab ah.
hint.2: Isku day jidadka sida /v1/me%2fapp.css.
walk.0.title: 1. Laba parser
walk.0.body: CDN-ku wuxuu %2f u qaataa si literal ah wuxuuna arkaa .css file. Origin-ku wuu decode-gareeyaa wuxuuna u route-gareeyaa /v1/me.
walk.1.title: 2. Cache
walk.1.body: Bogga token-ka dhibanaha waxaa lagu kaydiyaa hoostiisa encoded URL.
walk.2.title: 3. Exfiltrate
walk.2.body: GET caadi ah wuxuu soo celiyaa API key — ma jirto session loo baahan yahay.
impact: API key-ga shaqsiyeed waxaa lagu kaydiyaa CDN-ka waxaana soo heli kara qof kasta oo yaqaan URL-ka la farsameeyey.

### parameter-cloaking  [advanced · poison]

title: Parameter cloaking waxay qarinaysaa payload-ka.
category: Parser mismatch
summary: Cache iyo backend-ku way ku kala aragti duwan yihiin meesha hal parameter uu ka dhammaado, sidaas darteed qiime xun ayaa laga qariyaa key-ga balse app-ku wuu akhriyaa.
takeaway: Marka laba parser ay query string u kala jebiyaan si kala duwan, attacker-ku wuu ka soo qarin karaa value kaas oo kaliya origin-ku arko.
victim.name: Warsame
victim.disclosure: Akhriste ku soo degaya bogga raadinta.
objective.0: Isticmaal semicolon si cache-ku u joojiyo parsing-ka parameter-ka.
objective.1: Qari parameter la soo celiyo oo cache-ku waligiis key ka dhigin.
objective.2: U adeegso sunta booqde nadiif ah.
hint.0: Cache-yada badan waxay ; u tixgeliyaan parameter separator; backends badan ma sameeyaan.
hint.1: Wax kasta oo ka dambeeya ; kuma muuqdaan cache key-ga.
hint.2: Backend-ku weli wuxuu parse-gareeyaa q= oo wuu soo celiyaa.
walk.0.title: 1. Khilaafka
walk.0.body: ?q=lb;animal=cat — cache-ku wuxuu key-gareeyaa q=lb;animal=cat, halka backend-ku uu akhriyo kaliya q=lb iyo animal param gooni ah.
walk.1.title: 2. Qari
walk.1.body: Qari parameter la soo celiyo ka dib ; si cache-ku u iska indho tiro laakiin origin-ku uu soo bandhigo.
walk.2.title: 3. Sun
walk.2.body: Bogga waxaa lagu cached gareeyaa isagoo wata attacker markup hoos ku jira key u muuqda mid aan waxba galabsan.
impact: Qiimaha qarsoon ayaa ku soo muuqda bogga la cached-gareeyay, isaga sumaynaya dhammaan isticmaaleyaasha halka cache key-gu uu gebi ahaanba nadiif u muuqdo.

### original-url  [advanced · poison]

title: Rewrite header wuxuu qariyaa /admin
category: Unkeyed header
summary: Rewrite header ayaa ka dhigaysa origin-ka inuu u adeego /admin halka cache-ku uu kaydiyo response-ka hoos ku jira public path aan waxba galabsan.
takeaway: Path-rewrite headers waxay beddelaan waxa origin-ku soo celiyo iyadoo aan la beddelin URL-ka uu cache-ku key gareeyo — tani waa silent privilege leak.
victim.name: Ilhan
victim.disclosure: Booqde kusoo rogaya bogga hore ee guud.
objective.0: Dir rewrite header si aad u beddesho route-ka la adeegayo.
objective.1: Cache garee privileged response-ka hoos yimaada public URL-ka.
objective.2: Soo hel bogga xasaasiga ah adigoo ah qof dibadda ah.
hint.0: Qaar ka mid ah proxies waxay route-ga ku salaynayaan X-Original-URL ama X-Rewrite-URL.
hint.1: Cache-ku waligiis ma arko header-ka — kaliya URL-ka ayuu arkaa.
hint.2: Response body-gu waa bogga xasaasiga ah, key-gu ma ahan.
walk.0.title: 1. Beddelka route-ka
walk.0.body: X-Original-URL: /admin waxay ka dhigtaa origin-ka inuu soo bandhigo admin panel halka request URL-ku uu ahaanayo /en/home.
walk.1.title: 2. Cache garee
walk.1.body: Cache-ku wuxuu kaydiyaa admin body-ga hoos yimaada public path-ka.
walk.2.title: 3. Leak
walk.2.body: Qof kasta oo codsada homepage-ka waxaa loogu adeegaa admin panel-ka.
impact: Admin panel-ku waxaa lagu cached gareeyey hoos /en/home. Booqde kasta — oo ay ku jiraan kuwa aan la xaqiijin (unauthenticated) — hadda waxay arkaan bogga admin-ka.

### xff-ip  [advanced · poison]

title: IP-gaaga, ayaa lagu cache-gareeyey qof kasta.
category: Unkeyed header
summary: Bogga faallooyinka wuxuu daabacaa client IP-ka laga helay X-Forwarded-For. Maadaama cache-ku uusan key ka dhigin header-kan (unkeyed), hal codsi ayaa kaydiya XSS dhammaantood.
takeaway: Wax kasta oo bogga lagu soo bandhigo waa injection surface — xataa headers-ka aad u malaynaysay inay yihiin macluumaad kaliya.
victim.name: Hodan
victim.disclosure: Booqde akhrinaya thread-ka.
objective.0: Raadi meesha client IP lagu soo bandhigo.
objective.1: Geli markup adigoo adeegsanaya X-Forwarded-For.
objective.2: Xaqiiji in thread-ka la cached-gareeyey uu u adeego dadka kale.
hint.0: Bogagga muujinaya "your IP" waa bartilmaameedyo muhiim ah.
hint.1: Header-ka si verbatim ah ayaa loo soo celiyaa, unescaped.
hint.2: Cache-ku uma key-gareeyo X-Forwarded-For.
walk.0.title: 1. Reflection
walk.0.body: Footer-ka thread-ka wuxuu daabacaa requester IP-ka laga helay X-Forwarded-For.
walk.1.title: 2. Prime
walk.1.body: Dir qiime IP ah oo ka kooban HTML/script. Origin-ku wuxuu ku kaydiyaa response-ka; cache-ku wuxuu kaydiyaa response-ka.
walk.2.title: 3. Spread
walk.2.body: Dhammaan akhristayaasha thread-ka waxay helaan script-kii la geliyey.
impact: Booqde kasta oo u yimaada thread-ka wuxuu helaa attacker markup xariiqda "posted from" — stored XSS guud ahaan forum-ka.

### deception-dotseg  [advanced · deception]

title: Dot-segment waxay xadaa API token-ka
category: Cache deception
summary: Jid la been abuuray oo leh ..%2f wuxuu ka dhigaa cache-ka inuu keydiyo bog token ah hoos URL u muuqda mid static.
takeaway: Edge-ka iyo origin-ka waa in ay dot-segments u xalliyaan si isku mid ah, haddii kalena cache-ku wuxuu shay qaldan ku kaydin doonaa key qaldan.
victim.name: Yusuf
victim.disclosure: Horumariyaha bogga personal access tokens.
objective.0: Samee dot-segment path kaas oo origin-ku u xalliyo bogga tokens.
objective.1: Cache garee liiska token-ka sida asset.
objective.2: Dib u akhri token-ka adigoon cookie haysan.
hint.0: Cache-ku wuxuu ..%2f u caadiyeeyaa hal dariiqo, origin-ku dariiqo kale.
hint.1: Ku soo gabagabee path-ka adigoo ku dhamaanaya extension static si cache-ku uu u keydiyo.
hint.2: Endpoint-ku waa la xaqiijiyay, laakiin nuqulka cached ma aha.
walk.0.title: 1. Khalad geli resolver-ka
walk.0.body: /settings/..%2fsettings/tokens.css waxay ku xallisaa si ka duwan edge-ka marka loo eego origin-ka.
walk.1.title: 2. Cache garee tokens-ka
walk.1.body: Origin-ku wuxuu soo celiyaa liiska token-ka; cache-ku wuu kaydiyaa.
walk.2.title: 3. Xado
walk.2.body: A cookie-less request waxay soo celineysaa developer secrets.
impact: Personal access token nool ayaa la cached-gareeyay laguna heli karaa attacker-ka, taasoo u saamaxaysa qabsashada koontada gebi ahaan.

### mass-xss  [professional · poison]

title: Hal request, dhammaan isticmaaleyaasha: cached XSS
category: Silsiladda saameynta
summary: Hal unkeyed header oo aan la key-garin ayaa bog marketing ah ka dhigi kara mass stored XSS, isagoo ka faa'iideysanaya cache-ka sidii delivery amplifier.
takeaway: Bug yar oo unkeyed-input ah ayaa isu ballaarin karta ilaa xad aan xad lahayn maadaama cache-ku uu si weyn u dheereeyo saamayntiisa.
victim.name: Amina
victim.disclosure: Qof kasta oo booqda bogga hore ee cached.
objective.0: Aqoonso unkeyed host input-ka ku jira homepage-ka.
objective.1: Poison garee cached bundle URL-ka.
objective.2: Xaqiiji mass execution-ka marka visitor nadiif ah yimaado.
hint.0: Homepage-ku wuxuu tixraacaa JS bundle oo leh absolute URL.
hint.1: URL-kaas waxaa laga dhisaa request header.
hint.2: Cache-ku wuxuu hayaa hal nuqul oo u wada jira dhamaan isticmaaleyaasha.
walk.0.title: 1. Raadi input-ka
walk.0.body: Absolute asset URLs-ka ku jira homepage-ka waxay ka yimaadaan request host-ka.
walk.1.title: 2. Weaponise
walk.1.body: U jeedi bundle-ka origin-kaaga adigoo adeegsanaya X-Forwarded-Host.
walk.2.title: 3. Scale
walk.2.body: Bogga cached-ku wuxuu script-kaaga u gaarsiiyaa visitor kasta.
impact: Homepage-ka waxaa la cached gareeyey isagoo main bundle-kiisa u tilmaamaya evil.example. Akhriste kasta wuxuu fulinayaa attacker JavaScript-ka on the news origin — account takeover at scale.

### deception-pii  [professional · deception]

title: Cache deception waxay exfiltrates PII
category: Cache deception
summary: Diiwaanka cashuurta ee private ah ayaa lagu cached gareeyaa hoos static URL oo si buuxda ayaa loo soo qaadaa.
takeaway: Cache deception waa data-breach primitive: ma jiraan XSS, ma jiro phishing page — kaliya response cached oo si qaldan loo kala saaray.
victim.name: Amina
victim.disclosure: Citizen oo daawanaya tax statement-kooda.
objective.0: Qari statement-ka sidii static asset.
objective.1: Cache geli gudaha shared CDN-ka.
objective.2: Soo celi dhammaan PII record-ka.
hint.0: Noocyo badan oo suffix ah ayaa u gudbin doona isla private page-ka.
hint.1: Cache-ku wuxuu kaydiyaa iyadoo lagu salaynayo URL-ka, ma aha xasaasiyadda.
hint.2: Read-back-ku waa gabi ahaanba unauthenticated.
walk.0.title: 1. Classify
walk.0.body: Ku dar .css / ;.js / %2f si cache-ku u arko asset.
walk.1.title: 2. Store
walk.1.body: Victim-ku wuu furayaa link-ga; PII page-ka waa la cached-gareeyaa.
walk.2.title: 3. Dump
walk.2.body: Attacker-ku wuxuu fetch-gareeyaa URL-ka wuxuuna akhriyaa record-ka.
impact: Diiwaan aqoonsi oo buuxa — name, national ID, address, income — ayaa la cached-gareeyay waxaana akhrin kara attacker-ku.

### fat-get  [professional · poison]

title: GET body weyn ayaa qarinaya sunta
category: Parser iswaafaq la'aan
summary: GET request oo leh GET body oo backend-ku akhriyo laakiin cache-ku iska indhatirayo ayaa tahriibiya qiime aan key lahayn.
takeaway: Kaliya ma aha headers: GET body waa mid aan caadi ahayn, aan heeraysan, oo badanaa aan key lahayn.
victim.name: Warsame
victim.disclosure: Iibsadaha oo soo degaya bogga alaabta.
objective.0: Dir GET leh GET body oo backend-ku fasiro.
objective.1: Muuji qiime cache-ku waligiis ma key-gareeyo.
objective.2: Gaarsii sunta request nadiif ah.
hint.0: Qaar ka mid ah servers waxay ka akhriyaan parameters GET body; caches-na ma akhriyaan.
hint.1: GET body-gu waa aan la arki karin marka laga eego cache key-ga.
hint.2: Content-Type: application/x-www-form-urlencoded waxay ka caawisaa backend-ka inuu fasiro.
walk.0.title: 1. Aan caadi ahayn, laakiin la oggol yahay
walk.0.body: GET waxay wadan kartaa GET body. Backend-ku wuxuu ku daraa parameters-keeda.
walk.1.title: 2. Tahriib
walk.1.body: Geli parameter la soo celiyey gudaha GET body — cache-ku gabi ahaanba wuu iska indha-tiraa.
walk.2.title: 3. Sunta
walk.2.body: Response-ka waxaa lagu cache-gareeyaa URL nadiif ah iyadoo qiimaha weeraryahanka lagu dhex ritay.
impact: Bogga alaabta ayaa soo bandhigaya markup-ka weeraryahanka oo ka yimid request body-ga la iska indha-tiray, laguna cache-gareeyey dhammaan iibsadayaasha.

### vary-confusion  [professional · poison]

title: Wareerka Vary wuxuu sababiyaa in cache-ku keydiyo variant qaldan.
category: Parser iswaafaq la'aan
summary: Vary header oo iska indha-tiraysa input dhabta ah, ama ka key-garaysa kan qaldan, waxay u ogolaaneysaa hal variant inuu mid kale ku beddelo.
takeaway: Vary waa ballan sheegaya inputs-ka muhiimka ah. Haddii liiska si qaldan loo qoro, cache-ku wuxuu u adeegayaa response qaldan isticmaalaha qaldan.
victim.name: Hodan
victim.disclosure: Akhriste ku soo degaya bogga hore ee la habeeyey ee luqadda.
objective.0: Raadi input beddela bogga laakiin aan ku jirin liiska Vary.
objective.1: Cache-garee variant loogu talagalay qof walba.
objective.2: Tus nuqul qaldan oo loo adeegay booqde nadiif ah.
hint.0: Boggu wuxuu ka tarjumayaa Accept-Language ama User-Agent content.
hint.1: Haddii Vary maqan tahay, cache-ku wuxuu u qaataa variants inay isku mid yihiin.
hint.2: Cache-ku wuxuu kaydiyaa variant-ka marka hore yimaada.
walk.0.title: 1. Variants
walk.0.body: Origin-ku wuxuu bogga ku kala duwiyaa header, laakiin marnaba kuma xayaysiinayo Vary.
walk.1.title: 2. Qoraa-kii hore ayaa guuleysta
walk.1.body: Weeraryahanku wuxuu dalbadaa variant-ka ku jira payload-kooda; cache-ku wuu kaydiyaa URL-ka oo dhan.
walk.2.title: 3. Dhammaan way wadaagaan
walk.2.body: Booqdayaasha nadiifka ah waxaa loo adeegiyaa variant-ka weeraryahanka.
impact: Bogga la habeeyey ee luqadda waxaa lagu cache-gareeyaa dhammaan luqadaha, qiimaha la durayna waxaa loo adeegiyaa guud ahaan goobta.
