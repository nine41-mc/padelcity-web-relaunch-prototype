// Builds the annotations for the Figma page „🧩 Content-Modell“ from src/lib/content/contentModel.ts.
// One annotation per module and data source, labels as on /content-modell. Writes annotations.json next to this file;
// apply it with use_figma (see README.md). Run: node figma/content-model/build-annotations.mjs
import fs from 'fs';
import path from 'path';
import { execFileSync } from 'child_process';
const here = path.dirname(new URL(import.meta.url).pathname);
const bundle = path.join(here, '.contentModel.mjs');
execFileSync('npx', ['-y', 'esbuild', path.join(here, '../../src/lib/content/contentModel.ts'), '--bundle', '--format=esm', '--platform=node', '--log-level=error', `--outfile=${bundle}`]);
const { contentModel: pages } = await import(bundle);
fs.rmSync(bundle);
// original capture node → node in the copies on the "🧩 Content-Modell" page
const M = {"16020:5":"16023:1281","16020:2578":"16023:1298","16020:1478":"16023:2568","16020:2067":"16023:3133","16020:2528":"16023:3473","16020:2557":"16023:3499","16014:5":"16023:31","16014:47":"16023:65","16014:203":"16023:196","16014:263":"16023:246","16014:639":"16023:595","16017:5":"16023:846","16017:28":"16023:863","16017:222":"16023:1022","15805:8":"15848:6270","15805:92":"15848:6383","15805:182":"15848:6339","15805:90":"15848:6290","15805:241":"15848:6360","15805:243":"15848:6453","15811:8":"15848:6706","15811:116":"15848:6726","15811:117":"15848:6731","15811:119":"15848:6865","15811:236":"15848:6821","15811:208":"15848:6798","15811:296":"15848:6799","15811:298":"15848:6842","15811:300":"15848:6934","15811:370":"15848:6998","15811:397":"15848:7021","15811:679":"15848:7289","15822:5":"15848:7540","15822:73":"15848:7592","15822:489":"15848:7954","15822:541":"15848:7993","15822:599":"15848:8036","15822:663":"15848:8100","15817:5":"15848:8358","15817:58":"15848:8399","15817:372":"15848:8657","15817:530":"15848:8794","15817:623":"15848:8866","15817:1766":"15848:9866","15817:2016":"15848:10083","15817:2080":"15848:10141","15817:2137":"15848:10197","15825:5":"15848:10448","15825:20":"15848:10459","15825:57":"15848:10488","15825:251":"15848:10663","15830:5":"15848:11097","15830:103":"15848:11170","15807:5":"15848:11498","15807:46":"15848:11531","15807:152":"15848:11615","15807:261":"15848:11710","15807:405":"15848:11835","15807:473":"15848:11894","15807:523":"15848:11933","15807:589":"15848:11988","15814:5":"15848:12303","15814:46":"15848:12336","15814:349":"15848:12565","15814:543":"15848:12720","15814:614":"15848:12771","15814:842":"15848:12966","15814:707":"15848:12848","15827:5":"15848:13966","15827:38":"15848:13991","15827:77":"15848:14020","15827:102":"15848:14041","15827:168":"15848:14099","15827:849":"15848:14684","15827:941":"15848:14761","15827:304":"15848:14220","15827:405":"15848:14310","15827:772":"15848:14620","15834:5":"15848:15007","15834:386":"15848:15347","15834:492":"15848:15438","15834:804":"15848:15687","15834:45":"15848:15039","15834:985":"15848:15840","15836:5":"15848:16086","15836:28":"15848:16103","15836:1108":"15848:17075","15837:16":"15848:17368","16221:99":"16253:121","16221:1606":"16253:1501","16221:149":"16253:166","16221:449":"16253:450","16221:674":"16253:649","16221:758":"16253:717","16221:982":"16253:918","16221:1111":"16253:1036","16221:1165":"16253:1085","16221:14":"16253:40","16221:1242":"16253:1149","16221:1339":"16253:1236","16221:1365":"16253:1261","16221:2093":"16253:1964","16221:1885":"16253:1778","16239:8":"16253:2026","16239:22":"16253:2039","16239:32":"16253:2047","16239:45":"16253:2056","16239:64":"16253:2073","16239:155":"16253:2150","16239:369":"16253:2306","16239:479":"16253:2415","16239:533":"16253:2452","16239:554":"16253:2470","16239:634":"16253:2534","16239:748":"16253:2620","16239:749":"16253:2634","16239:793":"16253:2675","16239:851":"16253:2722","16230:5":"16253:3073","16230:38":"16253:3098","16230:61":"16253:3120","16230:142":"16253:3193","16313:5":"16392:31","16313:45":"16392:63","16313:89":"16392:93","16313:194":"16392:176","16313:378":"16392:337","16313:440":"16392:395","16313:278":"16392:244","16313:494":"16392:444","16313:518":"16392:464"};
const F = {"home":"16253:28","locations":"16023:1278","club":"16253:2021","events":"16023:28","eventInquiry":"16023:843","event":"15848:6265","heroEvent":"15848:6701","app":"15848:7537","academy":"15848:8355","magazine":"15848:10445","article":"15848:11094","franchise":"15848:11495","investors":"15848:12300","partners":"16392:28","about":"15848:13963","jobs":"15848:15004","faqPage":"15848:16083","legal":"15848:17355","company":"16253:3070"};
// capture → [page type, [[module (or "pageType:module"), original nodes…]]]
const A = {
  home: ['home', [['heroHome','16221:99'],['factTicker','16221:1606'],['leaderMap','16221:149'],['clubShowcase','16221:449'],['newcomers','16221:674'],['featuredEvents','16221:758'],['newsMagazine','16221:982'],['community','16221:1111'],['testimonials','16221:1165'],['socialWall','16221:14'],['voucherTeaser','16221:1242'],['appCta','16221:1339'],['partnerLogos','16221:1365'],['global:siteNavigation','16221:2093'],['global:siteFooter','16221:1885']]],
  locations: ['locations', [['pageHero','16020:5'],['locationFinder','16020:2578'],['plannedClubs','16020:1478'],['cityIndex','16020:2067'],['franchiseTeaser','16020:2528'],['home:appCta','16020:2557']]],
  club: ['club', [['clubHero','16239:8','16239:22'],['clubHours','16239:32'],['clubDescription','16239:45'],['clubContact','16239:64'],['clubPricing','16239:155'],['facilityGrid','16239:369'],['clubHighlights','16239:479'],['clubEvents','16239:533'],['clubCoaches','16239:554'],['appBooking','16239:634'],['recurringBooking','16239:748'],['clubFaq','16239:749'],['clubDirections','16239:793'],['nearbyClubs','16239:851']]],
  events: ['events', [['pageHero','16014:5'],['heroEvents','16014:47'],['eventInquiryTeaser','16014:203'],['eventList','16014:263'],['home:appCta','16014:639']]],
  eventInquiry: ['eventInquiry', [['pageHero','16017:5'],['eventInquiryForm','16017:28'],['eventInquiryFacts','16017:222']]],
  event: ['event', [['eventHero','15805:8'],['eventSignupCard','15805:92','15805:182'],['richText','15805:90'],['formatSteps','15805:241'],['home:appCta','15805:243']]],
  heroEvent: ['event', [['eventHero','15811:8'],['eventIntro','15811:116','15811:117'],['eventSignupCard','15811:119','15811:236'],['factGrid','15811:208','15811:296'],['formatSteps','15811:298','15811:300'],['videoEmbed','15811:370'],['eventPartners','15811:397'],['home:appCta','15811:679']]],
  app: ['app', [['appHero','15822:5'],['featureStory','15822:73'],['appStoreGallery','15822:489'],['howItWorks','15822:541'],['faq','15822:599'],['appFinalCta','15822:663']]],
  academy: ['academy', [['pageHero','15817:5'],['levelPath','15817:58'],['programmeGrid','15817:372'],['priceTable','15817:530'],['coachCarousel','15817:623'],['academyLocations','15817:1766'],['videoTeaserGrid','15817:2016'],['faq','15817:2080'],['home:appCta','15817:2137']]],
  magazine: ['magazine', [['pageHero','15825:5'],['article','15825:20'],['contentHubs','15825:57'],['pressLogos','15825:251']]],
  article: ['magazine', [['article','15830:5'],['relatedArticles','15830:103']]],
  franchise: ['franchise', [['franchiseContent','15807:5','15807:46','15807:152','15807:261','15807:405','15807:473'],['clubList','15807:523'],['contactCard','15807:589'],['leadForm','15807:589']]],
  investors: ['investors', [['investorsContent','15814:5','15814:46','15814:349','15814:543','15814:614','15814:842'],['peopleGrid','15814:707']]],
  partners: ['partners', [['partnersContent','16313:5','16313:45','16313:89','16313:194','16313:378','16313:440'],['partnerLogoWall','16313:278'],['partnerStance','16313:494'],['leadForm','16313:518']]],
  about: ['about', [['aboutContent','15827:5','15827:38','15827:77','15827:102','15827:168','15827:849','15827:941'],['peopleGrid','15827:304','15827:405'],['testimonials','15827:772']]],
  jobs: ['jobs', [['jobsContent','15834:5','15834:386','15834:492','15834:804'],['openings','15834:45'],['contactCard','15834:985']]],
  faqPage: ['faqPage', [['pageHero','15836:5'],['faqExplorer','15836:28'],['contactTeaser','15836:1108']]],
  legal: ['legal', [['legalPage','15837:16']]],
  company: ['company', [['pageHero','16230:5'],['companyIntro','16230:38'],['audienceEntries','16230:61'],['seriesATeaser','16230:142']]],
};
// labels exactly as on /content-modell (ContentModelExplorer SOURCES)
const SRC = { api: 'API · vorhanden', apiExtend: 'API · erweitern', cms: 'Neuer Contentful-Space', external: 'Externer Dienst', unknown: 'Unklar' };
const P = Object.fromEntries(pages.map((p) => [p.id, p]));
const mod = (pt, id) => P[pt].modules.find((m) => m.id === id);
const line = (f, withSource) => `- ${f.name}${withSource ? ` — **${SRC[f.source]}**` : ''}${f.ref ? ` \`${f.ref}\`` : ''}${f.note ? ` · ${f.note}` : ''}`;
const groups = (m) => { const order = []; for (const f of m.fields) if (!order.includes(f.source)) order.push(f.source); return order.map((src) => ({ src, fields: m.fields.filter((f) => f.source === src) })); };
const out = [];
for (const [key, [pt, list]] of Object.entries(A)) {
  const used = new Set();
  for (const [ref, ...nodes] of list) {
    const [mpt, mid] = ref.includes(':') ? ref.split(':') : [pt, ref];
    const m = mod(mpt, mid);
    if (!m) throw new Error('missing ' + ref);
    if (mpt === pt) used.add(mid);
    const extra = mpt !== pt ? ` · wie ${P[mpt].name}` : '';
    const gs = groups(m);
    nodes.forEach((n, i) => {
      if (!M[n]) throw new Error('no clone for ' + n);
      if (i > 0) { out.push({ n: M[n], c: SRC[gs[0].src], md: `**${m.name}** · \`${m.id}\` · Fortsetzung – Felder siehe erste Sektion dieses Moduls` }); return; }
      for (const g of gs) {
        const count = gs.length > 1 ? ` · ${g.fields.length} von ${m.fields.length} Feldern` : '';
        out.push({ n: M[n], c: SRC[g.src], md: [`**${m.name}** · \`${m.id}\`${extra}${count}`, ...(m.text && g === gs[0] ? [m.text] : []), ...g.fields.map((f) => line(f, false))].join('\n') });
      }
    });
  }
  if (key === 'magazine') for (const [r] of A.article[1]) used.add(r);
  // one event detail page, shown twice (base only / with every optional module) – each frame points to the other instead of listing its modules
  const sibling = { event: 'heroEvent', heroEvent: 'event' }[key];
  if (sibling) for (const [r] of A[sibling][1]) used.add(r);
  const page = P[pt];
  const missing = key === 'article' ? [] : page.modules.filter((m) => !used.has(m.id));
  const lines = [`**${page.name}** · \`${page.path}\``, ...(page.text ? [page.text] : [])];
  if (key === 'magazine') lines.push('Artikel-Detail: siehe nächster Frame.');
  if (key === 'event') lines.push('Eine Seite für alle Events; optionale Module erscheinen nur, wenn gepflegt. Mit allen optionalen Modulen: siehe Frame „Event-Detail (Hero-Event)“.');
  if (key === 'heroEvent') lines.push('Dieselbe Seite mit allen optionalen Modulen (One Point Challenge). Nur die Basis: siehe Frame „Event-Detail“.');
  const listModule = (m) => [`- **${m.name}** · \`${m.id}\``, ...m.fields.map((f) => '  ' + line(f, true))];
  if (missing.length) { lines.push('', '**Im Modell, aber nicht in diesem Design sichtbar:**'); for (const m of missing) lines.push(...listModule(m)); }
  if (key === 'home') { lines.push('', '**Global (alle Seiten, nicht als eigene Sektion sichtbar):**'); for (const id of ['seo', 'consent', 'deeplinks']) lines.push(...listModule(mod('global', id))); }
  out.push({ n: F[key], c: 'Seite', md: lines.join('\n') });
}
fs.writeFileSync(path.join(here, 'annotations.json'), JSON.stringify(out));
const count = {}; for (const x of out) count[x.c] = (count[x.c] || 0) + 1;
console.log(out.length, 'annotations', JSON.stringify(count));
