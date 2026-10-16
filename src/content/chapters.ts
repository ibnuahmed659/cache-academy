export type Block =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'ul'; items: string[] }
  | { type: 'ol'; items: string[] }
  | { type: 'code'; lang?: string; title?: string; code: string }
  | { type: 'callout'; tone: 'info' | 'warn' | 'danger' | 'success'; title?: string; text: string }
  | { type: 'steps'; items: { title: string; body: string }[] }

export type Chapter = {
  slug: string
  title: string
  subtitle: string
  minutes: number
  level: 'beginner' | 'intermediate' | 'advanced'
  summary: string
  blocks: Block[]
}

export const CHAPTERS: Chapter[] = [
  {
    slug: 'hordhac',
    title: 'Hordhac: cache-ka iyo khiyaanadiisa',
    subtitle: 'Sababta buuggan loo qoray iyo sida loo akhriyo',
    minutes: 4,
    level: 'beginner',
    summary:
      'Cache-ku wuxuu badbaadiyaa waqti iyo kharash, laakiin wuxuu abuuraa lakab cusub oo ammaan ah oo qof walba wadaago. Buuggani wuxuu baraa laba weerar: cache poisoning iyo cache deception.',
    blocks: [
      {
        type: 'p',
        text: 'Web cache waa keyd (storage) u dhexeeya isticmaalaha iyo server-ka. Marka aad booqato bog, cache-ku wuxuu kaydiyaa jawaabta (response). Marka qof kale isla boggaas codsado, cache-ku isla jawaabtaas ayuu siiyaa isagoo aan server-ka gaarin.',
      },
      {
        type: 'p',
        text: 'Tani waa wax wanaagsan: bogagku way degdegaan, server-ku wuu fududaadaa. Laakiin waxaa jira khatar: cache-ku wuxuu isku daraa jawaabaha dad kala duwan. Haddii jawaabta qof gaar ah (private) la keydiyo oo loo adeego qof kale, xog gaar ah ayaa banaanka soo baxda.',
      },
      {
        type: 'h2',
        text: 'Laba weerar oo walaalo ah',
      },
      {
        type: 'p',
        text: 'Buuggani wuxuu ka hadlayaa laba khiyaano oo cache-ka loo isticmaalo si qaldan:',
      },
      {
        type: 'ul',
        items: [
          'Cache Poisoning — attacker-ku wuxuu cache-ka geliyaa jawaab xun (malicious), kadibna dhammaan dadka kale ayay gaadhaa.',
          'Cache Deception — attacker-ku wuxuu khiyaaneeyaa cache-ka si uu u keydiyo xogta gaarka ah ee qof kale, kadibna isagu wuu akhriyaa.',
        ],
      },
      {
        type: 'callout',
        tone: 'info',
        title: 'Fikradda koowaad',
        text: 'Cache-ku wuxuu isticmaalaa "key" (fure) si uu u kala saaro jawaabaha. Haddii wax jawaabta beddela ay ka maqan yihiin furaha, markaas cache-ku wuxuu isku qasayaa laba jawaab oo kala duwan.',
      },
      {
        type: 'p',
        text: 'Qaybaha buuggan: HTTP caching, cache key, unkeyed inputs, cache poisoning, cache deception, iyo difaacyada. Lab-yada iyo tutorial-yada waxay ku siin doonaan tababar gacan-ku-qabad ah.',
      },
    ],
  },
  {
    slug: 'caching-101',
    title: 'Caching 101: sida cache-ku u shaqeeyo',
    subtitle: 'Cache key, TTL, HIT iyo MISS',
    minutes: 6,
    level: 'beginner',
    summary:
      'Fahan aasaasiga: noocyada cache-ka, TTL, hit/miss, iyo header-yada Cache-Control iyo Age.',
    blocks: [
      {
        type: 'h2',
        text: 'Cache-ka noocyadiisa',
      },
      {
        type: 'ul',
        items: [
          'Browser cache — keyd ku yaal browser-ka isticmaalaha.',
          'CDN / edge cache — keyd ku yaal server-yo badan oo adduunka ku kala yaacay (Cloudflare, CloudFront, Akamai).',
          'Reverse proxy cache — keyd ku yaal server dusha ka xijaaba (Varnish, Nginx, Squid).',
          'Application cache — keyd gudaha application-ka (Redis, Memcached).',
        ],
      },
      {
        type: 'h2',
        text: 'HIT iyo MISS',
      },
      {
        type: 'p',
        text: 'Marka request soo gaaro cache-ka, waxaa dhaca laba xaaladood:',
      },
      {
        type: 'ol',
        items: [
          'MISS — cache-ku ma hayo jawaab. Wuxuu u diraa origin server-ka, jawaabta ayuu kaydiyaa, kadibna wuu soo celiyaa.',
          'HIT — cache-ku wuu hayaa jawaab. Si degdeg ah ayuu isticmaalaha u siiyaa, origin-ka lama gaaro.',
        ],
      },
      {
        type: 'code',
        lang: 'http',
        title: 'Dabcan jawaab cache leh',
        code: 'HTTP/1.1 200 OK\nCache-Control: public, max-age=3600\nAge: 120\nX-Cache: HIT',
      },
      {
        type: 'h2',
        text: 'TTL iyo Age',
      },
      {
        type: 'p',
        text: 'TTL (Time To Live) waa inta jawaabtu cache-ka ku sii jirto. "Age" wuxuu sheegaa inta sekond jawaabtu keydka ku jirtay. Marka TTL dhammaado, cache-ku wuu cusboonaysiiyaa (revalidate).',
      },
      {
        type: 'h2',
        text: 'Cache-Control oo kooban',
      },
      {
        type: 'ul',
        items: [
          'public — qof walba wuu keydsan karaa.',
          'private — kaliya browser-ka isticmaalaha, ma aha CDN.',
          'no-store — marnaba ha keydin (xog gaar ah).',
          'no-cache — keydi laakiin mar walba la xaqiiji origin-ka.',
          'max-age=N — inta sekond uu cusub yahay.',
        ],
      },
      {
        type: 'callout',
        tone: 'danger',
        title: 'Dhibaatada',
        text: 'Haddii bog xog gaar ah (profile, settings, token) leh aan la dhigin "no-store", cache-ku wuxuu keydin karaa oo wuxuu siin karaa qof kale. Tan ayaa cache deception ah.',
      },
    ],
  },
  {
    slug: 'cache-key',
    title: 'Cache key: furaha ayaa wax walba go\'aaminaya',
    subtitle: 'Waxa cache-ku tixgeliyo iyo waxa uu ilaabo',
    minutes: 6,
    level: 'beginner',
    summary:
      'Cache key wuxuu go\'aamiyaa goorta laba request isku jawaab la wadaagaan. Wax kasta oo ka baxsan key-ga waa "unkeyed input".',
    blocks: [
      {
        type: 'p',
        text: 'Cache key waa qoraal (string) uu cache-ku isticmaalo si uu u aqoonsado jawaabaha. Caadi ahaan wuxuu ka kooban yahay:',
      },
      {
        type: 'code',
        lang: 'text',
        title: 'Cache key caadi ah',
        code: 'GET https://shop.example/en/home\n\nkey = scheme + host + path\n    = https + shop.example + /en/home',
      },
      {
        type: 'h2',
        text: 'Waxa badanaa ka baxsan key-ga',
      },
      {
        type: 'ul',
        items: [
          'Header-yada badan (X-Forwarded-Host, User-Agent, Accept-Language, cookies).',
          'Query parameters qaarkood (marka cache-ku ixtiraamo liis gaar ah).',
          'Body-ga request-ka.',
          'Cookies (badanaa unkeyed yihiin).',
        ],
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Qeexidda',
        text: 'Unkeyed input = wax kasta oo jawaabta beddela, laakiin aan cache key-ga ku jirin. Waa matoorka dhammaan weerarrada buuggan.',
      },
      {
        type: 'h2',
        text: 'Vary header',
      },
      {
        type: 'p',
        text: 'Vary wuxuu sheegaa cache-ka inuu key-ga ku daro header gaar ah. Tusaale, "Vary: Accept-Encoding" wuxuu cache-ka ku qasbaa inuu kala keydiyo gzip iyo aan-gzip. Haddii Vary maqan yahay laakiin jawaabtu headerka ku xidhan tahay, cache-ku wuu isku qasaa.',
      },
      {
        type: 'code',
        lang: 'http',
        title: 'Vary oo sax ah',
        code: 'Vary: Accept-Language\n\n# Hadda jaantus kasta oo luqadeed ayaa si gaar ah loo keydiyaa.',
      },
      {
        type: 'h2',
        text: 'Key normalization',
      },
      {
        type: 'p',
        text: 'Cache-ku wuxuu URL-ka "nadiifiyaa" (normalize) ka hor key-ga: wuxuu tirtiraa dot-segments, wuxuu decode-gareeyaa qaar, wuxuu beddelaa xarafka weyn. Origin server-ku waxaa laga yaabaa inuu si kale u sameeyo. Farqigaas ayaa waa laga faa\'iidayaa.',
      },
    ],
  },
  {
    slug: 'unkeyed',
    title: 'Unkeyed inputs oo faahfaahsan',
    subtitle: 'Goobaha attacker-ku ka geli karo wax cache-ku ma arko',
    minutes: 7,
    level: 'intermediate',
    summary:
      'Header-yada proxy-ga, cookies, query params, iyo body-ga — dhammaantood waxay noqon karaan unkeyed.',
    blocks: [
      {
        type: 'h2',
        text: 'Header-yada proxy-ga (ugu halista badan)',
      },
      {
        type: 'ul',
        items: [
          'X-Forwarded-Host — wuxuu sheegaa host-ka asalka ah. Waxaa loo isticmaalaa absolute URL-yo.',
          'X-Forwarded-Scheme — wuxuu sheegaa scheme (http/https). Waxaa loo isticmaalaa redirect.',
          'X-Host, X-Forwarded-Server — noocyo kale oo host ah.',
          'Forwarded — RFC 7239, wuxuu isku daraa host iyo scheme.',
          'X-Original-URL, X-Rewrite-URL — wuxuu beddelaa path-ka uu server-ku isticmaalo.',
        ],
      },
      {
        type: 'callout',
        tone: 'danger',
        title: 'Sababta',
        text: 'Header-yadan waxaa loo abuuray proxy-yada. Laakiin haddii origin-ku si toos ah u aqbalo (aan la xaqiijin proxy-ga), attacker-ku wuu soo diri karaa. Cache ma arko, origin wuu aaminsan yahay.',
      },
      {
        type: 'h2',
        text: 'Cookies',
      },
      {
        type: 'p',
        text: 'Cache key caadi ahaan lama daro cookies. Haddii boggu cookie ku soo bandhigo (tusaale "Hello, <prefs>"), attacker-ku wuxuu soo diri karaa cookie khiyaano leh, cache-kuna wuu keydiyaa jawaabta.',
      },
      {
        type: 'h2',
        text: 'Query parameters',
      },
      {
        type: 'p',
        text: 'Cache-yada qaar waxay key-geliyaan query params oo dhan; qaar kale waxay iska indhatiraan kuwa aan la aqoon (utm_*, tracking). Haddii origin-ku soo bandhigo mid aan la key-gelin, waa unkeyed.',
      },
      {
        type: 'h2',
        text: 'Parser mismatch iyo parameter cloaking',
      },
      {
        type: 'p',
        text: 'Cache iyo backend-ku siyaabo kala duwan ayey u akhriyaan query-ga:',
      },
      {
        type: 'code',
        lang: 'text',
        title: 'Cloaking',
        code: 'Request: GET /search?q=test;utm=evil\n\nCache  -> key: q=test;utm=evil   (param hal)\nBackend-> q=test, utm=evil       (laba param)\n\n# Haddii utm la soo bandhigo, cache-ku tiradaas kama jiro key-ga midka uu backend-ku arko.',
      },
      {
        type: 'p',
        text: 'Fat GET: GET request oo leh body. Backend-ku wuu akhriyaa body-ga; cache-ku wuu iloobaa. Waa unkeyed input oo qarsoodi ah.',
      },
    ],
  },
  {
    slug: 'poison-anatomy',
    title: 'Anatomy of cache poisoning',
    subtitle: 'Sida jawaab xun cache-ka loo geliyo',
    minutes: 7,
    level: 'intermediate',
    summary:
      'Saddex tallaabo: goobi unkeyed input, soo saar jawaab xun, keydi. Kadibna dhammaan dadka ayaa qaata.',
    blocks: [
      {
        type: 'h2',
        text: 'Saddexda tallaabo',
      },
      {
        type: 'steps',
        items: [
          {
            title: '1. Goobi unkeyed input',
            body: 'Attacker-ku wuxuu tijaabiyaa header-yada iyo params-ka si uu u ogaado midka jawaabta beddela laakiin cache-ku key-gelin.',
          },
          {
            title: '2. Soo saar jawaab xun',
            body: 'Wuxuu soo diraa request leh payload (tusaale X-Forwarded-Host: evil.example). Origin-ku wuxuu ku darayaa jawaabta.',
          },
          {
            title: '3. Keydi',
            body: 'Cache-ku jawaabta xuntaa wuxuu ku kaydiyaa key caadi ah (URL nadiif ah). Hadda qof kasta oo isla URL codsada jawaabta xun ayuu helaa.',
          },
        ],
      },
      {
        type: 'code',
        lang: 'http',
        title: 'Priming request',
        code: 'GET /en/home HTTP/1.1\nHost: shop.example\nX-Forwarded-Host: evil.example\n\n# Origin -> <script src="https://evil.example/app.js">\n# Cache  -> stores under /en/home (header not in key)\n\nGET /en/home HTTP/1.1\nHost: shop.example\n\n# Cache  -> HIT, returns the poisoned HTML to everyone',
      },
      {
        type: 'h2',
        text: 'Sababta loo adeegsado bogag badan',
      },
      {
        type: 'p',
        text: 'Cache-ka waxaa laga helaa CDN-yo waaweyn. Hal request oo attacker-ku diraa waxay saameyn kartaa malaayiin qof — waana sababta cache poisoning loo arko mid aad u khatar badan.',
      },
      {
        type: 'callout',
        tone: 'warn',
        title: 'Xusuus',
        text: 'Poisoning ma aha XSS caadi ah — waa XSS oo ay cache-ku gaarsiiyo qof walba, iyadoo aan victim-ku waxba riixin.',
      },
    ],
  },
  {
    slug: 'poison-vectors',
    title: 'Noocyada cache poisoning',
    subtitle: 'Header, cookie, param, redirect, DoS',
    minutes: 8,
    level: 'advanced',
    summary:
      'Nooc kasta oo poisoning ah, iyo sida loo aqoonsado.',
    blocks: [
      {
        type: 'h2',
        text: 'Poisoning header-ka host',
      },
      {
        type: 'p',
        text: 'X-Forwarded-Host / X-Host oo lagu daro absolute URL (script src, link href, Location). Waa midka ugu caansan. Saamaynta: XSS la keydiyay ama open redirect la keydiyay.',
      },
      {
        type: 'h2',
        text: 'Poisoning scheme-ka',
      },
      {
        type: 'p',
        text: 'X-Forwarded-Scheme: nothttps ayaa server-ku u maleeyaa in request-ku http yahay, wuxuuna u leexiyaa https. Haddii redirect-ka host-ku header kale ka yimaado, waad xakamayn kartaa.',
      },
      {
        type: 'h2',
        text: 'Poisoning query parameter',
      },
      {
        type: 'p',
        text: 'Param aan la key-gelin (utm_content) oo lagu soo bandhigo bogga. Klassik.',
      },
      {
        type: 'h2',
        text: 'Poisoning response header-ka (CRLF)',
      },
      {
        type: 'p',
        text: 'Haddii input lagu soo celiyo header (Set-Cookie, Location), CRLF (%0d%0a) ayaa lagu dari karaa header cusub. Tani waxay u ogolaataa in cookie la beero ama redirect la abuuro — kadib waa la keydiyaa.',
      },
      {
        type: 'code',
        lang: 'text',
        title: 'CRLF header injection',
        code: 'Input : test%0d%0aSet-Cookie:%20session=attacker\nOutput: X-Test: test\\r\\nSet-Cookie: session=attacker',
      },
      {
        type: 'h2',
        text: 'Poisoning DoS',
      },
      {
        type: 'p',
        text: 'Haddii jawaab cusub oo kasta key gaar ah abuurto (cache busting), attacker-ku wuxuu buuxin karaa keydka ilaa uu buux dhaafo. Tani waa cache-busting DoS.',
      },
      {
        type: 'h2',
        text: 'DOM-based cache poisoning',
      },
      {
        type: 'p',
        text: 'Xogta la keydiyay (JSON, HTML) oo JavaScript-ku si xun u akhriyo bogga kale — XSS aan response-ka la arkin laakiin DOM-ka dhexdiisa.',
      },
    ],
  },
  {
    slug: 'deception',
    title: 'Web cache deception',
    subtitle: 'Sida xog gaar ah cache loogu keydiyo',
    minutes: 8,
    level: 'advanced',
    summary:
      'Cache-ku wuxuu URL-ka ku kala saaraa "static" iyo "dynamic". Attacker-ku wuxuu khiyaaneeyaa si xog gaar ah loo kaydiyo oo isagu u akhriyo.',
    blocks: [
      {
        type: 'p',
        text: 'Cache deception waa mid caan ah sababtoo ah ma u baahna jawaab xun. Waxtarku waa: cache-ku jawaab xog gaar ah ayuu si qaldan u keydiyaa, kadib attacker-ku isla URL-ka ayuu codsadaa (isagoon cookie lahayn) oo wuu akhriyaa.',
      },
      {
        type: 'h2',
        text: 'Fikradda: laba parser',
      },
      {
        type: 'p',
        text: 'Cache-ku wuxuu ku go\'aamiyaa "ma jawaabtan ayaan keydiyaa?" iyadoo eegaya URL-ka (gaar ahaan extension-ka). Origin-ku wuxuu ku go\'aamiyaa "sidee ayaan u wareejiyaa?" isagoo isticmaalaya router-kiisa. Labadooda markay is qabsadaan, waa bug.',
      },
      {
        type: 'code',
        lang: 'text',
        title: 'Matal',
        code: 'Private page : https://bank.example/account/profile\nAttacker URL : https://bank.example/account/profile/nonexistent.css\n\nCache  : ".css" -> static asset, waa la keydiyaa\nOrigin : wuu iska indhatiraa suffix-ka -> wuxuu soo celiyaa profile-ka\n\n=> Profile-ka qofka gaarka ah ayaa cache lagu keydiyay.',
      },
      {
        type: 'h2',
        text: 'Noocyada khiyaanada',
      },
      {
        type: 'ul',
        items: [
          'Extension: /profile.css, /profile.js, /profile.json',
          'Delimiter: /profile;.css, /profile;.js (matrix parameters)',
          'Encoded: /profile%2f.css, /profile%00.css, /profile%23, /profile%3f',
          'Dot-segment: /profile/..%2faccount, /profile/.css',
          'Fat path: /profile/anything.css',
        ],
      },
      {
        type: 'h2',
        text: 'Sida looga faa\'iidaysto',
      },
      {
        type: 'steps',
        items: [
          {
            title: '1. Soo hel bog gaar ah',
            body: 'Bog leh xog qofka gaarka ah (email, token, profile) oo aan la keydin.',
          },
          {
            title: '2. Samee URL khiyaano leh',
            body: 'Ku dar suffix static ah si cache-ku u maleeyo inay asset tahay, laakiin origin-ku wali profile-ka soo celiyo.',
          },
          {
            title: '3. Dhiib victim-ka',
            body: 'Ku qas victim-ka (oo soo galay) inuu furto link-ga. Cache-ku profile-ka wuu keydiyaa.',
          },
          {
            title: '4. Akhri',
            body: 'Attacker-ku isla URL-ka wuu codsadaa, isagoon cookie lahayn. Cache-ku wuu siiyaa xogta gaarka ah.',
          },
        ],
      },
      {
        type: 'callout',
        tone: 'danger',
        title: 'Dhibaatada weyn',
        text: 'Deception waxay u baahan tahay kaliya hal victim oo uu qofka qaldan u furo link-ga. Kadib xogta waa mid dadweyne (public).',
      },
    ],
  },
  {
    slug: 'defenses',
    title: 'Difaacyada: sida loo xiro',
    subtitle: 'Origin-side iyo cache-side',
    minutes: 8,
    level: 'advanced',
    summary:
      'Difaaca cache-ka iyo difaaca origin-ka. Waa in labaduba isla shaqeeyaan.',
    blocks: [
      {
        type: 'h2',
        text: 'Origin-side',
      },
      {
        type: 'ul',
        items: [
          'Ha aammin Host / X-Forwarded-* — ka dhis URL-yada host canonical ah (config).',
          'soo celi oo ha soo bandhigin header-yada proxy-ga.',
          'Dhig Cache-Control: private, no-store bogag kasta oo xog gaar ah.',
          'soo dir Vary marka jawaabtu header ku xidhan tahay.',
          'redirect canonical ah ka hor cache-ka (scheme/host normalization).',
          'Ha aqbalin X-Original-URL / X-Rewrite-URL haddii aysan proxy-gaaga soo dirin.',
        ],
      },
      {
        type: 'h2',
        text: 'Cache-side',
      },
      {
        type: 'ul',
        items: [
          'Dhis key-ga si uu u daro input-ka jawaabta beddela (key on unkeyed input).',
          'Xaqiiji Cache-Control (private/no-store) — ha keydin wax private ah.',
          'Keydi kaliya jawaabaha static (extension/content-type allowlist).',
          'Normalize URL-ka si waafaqsan origin-ka (dot-segments, encodings, delimiters).',
          'Ha keydin jawaabaha qalad (4xx, 5xx) si dadyahow.',
        ],
      },
      {
        type: 'code',
        lang: 'nginx',
        title: 'Matal Nginx',
        code: '# Kaliya keydi assets\nlocation ~* \\.(css|js|png|jpg|svg)$ {\n    proxy_cache my_cache;\n    proxy_cache_valid 200 1h;\n    add_header Cache-Control "public";\n}\n\n# Bogag gaar ah: no-store\nlocation /account/ {\n    add_header Cache-Control "private, no-store";\n    proxy_cache off;\n}',
      },
      {
        type: 'callout',
        tone: 'success',
        title: 'Xeerka dahabka',
        text: 'Haddii jawaabtu ku xidhan tahay input, mid ka mid ah: (1) ha soo bandhigin input-ka, (2) geli key-ga, ama (3) ha keydin jawaabta.',
      },
    ],
  },
  {
    slug: 'testing',
    title: 'Sida loo tijaabiyo si ammaan ah',
    subtitle: 'Recon, testing, iyo anshaxa',
    minutes: 6,
    level: 'advanced',
    summary:
      'Habka bug hunter-ku u raadiyo cache bugs, iyo xeerarka anshaxa.',
    blocks: [
      {
        type: 'h2',
        text: 'Recon',
      },
      {
        type: 'ol',
        items: [
          'Geli header-yo kala duwan (X-Forwarded-Host: test.example) oo eeg jawaabta — ma soo bandhigtay?',
          'Eeg X-Cache / Age si aad u ogaato in boggu cache leeyahay.',
          'Tijaabi in headerku key-ga ku jiro: dir mar payload leh, kadibna dir request nadiif ah — HIT ma ku siiyaa payload-ka?',
        ],
      },
      {
        type: 'h2',
        text: 'Cache ayaa keydinaya?',
      },
      {
        type: 'code',
        lang: 'text',
        title: 'Calaamadaha cache-ka',
        code: 'X-Cache: HIT / MISS\nCF-Cache-Status: HIT\nAge: 42\nX-Cache-Hits: 1',
      },
      {
        type: 'h2',
        text: 'Anshaxa',
      },
      {
        type: 'callout',
        tone: 'danger',
        title: 'Ogow xadka',
        text: 'Cache poisoning iyo deception waxay saameeyaan dad kale. Tijaabi kaliya nidaamka aad haysato ama aad fasax cad u haysato. Ha u geysan waxyeello dadka kale.',
      },
      {
        type: 'ul',
        items: [
          'Ha ku dhaqmin bug cache ah oo dadweyne — waxay dhaawacdaa isticmaalayaasha.',
          'Isticmaal account-kaaga tijaabada (ma aha account kale).',
          'Soo sheeg si mas\'uuliyad leh (responsible disclosure).',
        ],
      },
    ],
  },
]

export const CHAPTER_BY_SLUG: Record<string, Chapter> = Object.fromEntries(
  CHAPTERS.map((c) => [c.slug, c]),
)
