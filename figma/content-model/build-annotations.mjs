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
const M = {"16221:99":"16253:121","16221:1606":"16253:1501","16221:149":"16253:166","16221:449":"16253:450","16221:674":"16253:649","16221:758":"16253:717","16221:982":"16253:918","16221:1111":"16253:1036","16221:1165":"16253:1085","16221:14":"16253:40","16221:1242":"16253:1149","16221:1339":"16253:1236","16221:1365":"16253:1261","16221:2093":"16253:1964","16221:1885":"16253:1778","16239:8":"16253:2026","16239:22":"16253:2039","16239:32":"16253:2047","16239:45":"16253:2056","16239:64":"16253:2073","16239:155":"16253:2150","16239:369":"16253:2306","16239:479":"16253:2415","16239:533":"16253:2452","16239:554":"16253:2470","16239:634":"16253:2534","16239:748":"16253:2620","16239:749":"16253:2634","16239:793":"16253:2675","16239:851":"16253:2722","16230:5":"16253:3073","16230:38":"16253:3098","16230:61":"16253:3120","16230:142":"16253:3193","16313:5":"16392:31","16313:45":"16392:63","16313:89":"16392:93","16313:194":"16392:176","16313:378":"16392:337","16313:440":"16392:395","16313:278":"16392:244","16313:494":"16392:444","16313:518":"16392:464","16282:5":"16394:31","16282:2578":"16394:48","16282:1478":"16394:1318","16282:2067":"16394:1883","16282:2528":"16394:2223","16282:2557":"16394:2249","16265:5":"16394:2515","16265:47":"16394:2549","16265:203":"16394:2680","16265:263":"16394:2730","16265:639":"16394:3079","16362:5":"16394:3350","16362:28":"16394:3367","16362:222":"16394:3526","16286:5":"16394:3805","16286:20":"16394:3816","16286:57":"16394:3845","16286:251":"16394:4020","16293:5":"16394:4474","16293:103":"16394:4547","16299:5":"16394:4895","16299:46":"16394:4928","16299:152":"16394:5012","16299:261":"16394:5107","16299:405":"16394:5232","16299:473":"16394:5291","16299:523":"16394:5330","16299:589":"16394:5385","16309:5":"16394:5720","16309:46":"16394:5753","16309:349":"16394:5982","16309:543":"16394:6137","16309:614":"16394:6188","16309:842":"16394:6383","16309:707":"16394:6265","16321:5":"16394:6703","16321:38":"16394:6728","16321:77":"16394:6757","16321:102":"16394:6778","16321:168":"16394:6836","16321:849":"16394:7421","16321:941":"16394:7498","16321:304":"16394:6957","16321:405":"16394:7047","16321:772":"16394:7357","16325:5":"16394:7764","16325:386":"16394:8104","16325:492":"16394:8195","16325:804":"16394:8444","16325:45":"16394:7796","16325:985":"16394:8597","16380:16":"16394:8873","16275:8":"16394:9159","16275:86":"16394:9269","16275:169":"16394:9225","16275:84":"16394:9179","16275:228":"16394:9246","16275:230":"16394:9335","16257:5":"16394:9606","16257:73":"16394:9658","16257:489":"16394:10020","16257:539":"16394:10057","16257:597":"16394:10100","16257:666":"16394:10164","16371:5":"16394:10442","16371:58":"16394:10483","16371:372":"16394:10741","16371:530":"16394:10878","16371:623":"16394:10950","16371:1766":"16394:11950","16371:2016":"16394:12167","16371:2080":"16394:12225","16371:2142":"16394:12281","16330:5":"16394:12552","16330:28":"16394:12569","16330:1170":"16394:13541","16381:8":"16394:13846","16381:110":"16394:13866","16381:111":"16394:13871","16381:113":"16394:14002","16381:223":"16394:13958","16381:195":"16394:13935","16381:283":"16394:13936","16381:285":"16394:13979","16381:287":"16394:14067","16381:357":"16394:14131","16381:384":"16394:14154","16381:666":"16394:14422"};
const F = {"home":"16253:28","locations":"16394:28","club":"16253:2021","events":"16394:2512","eventInquiry":"16394:3347","event":"16394:9154","heroEvent":"16394:13841","app":"16394:9603","academy":"16394:10439","magazine":"16394:3802","article":"16394:4471","franchise":"16394:4892","investors":"16394:5717","partners":"16392:28","about":"16394:6700","jobs":"16394:7761","faqPage":"16394:12549","legal":"16394:8860","company":"16253:3070"};
// capture → [page type, [[module (or "pageType:module"), original nodes…]]]
const A = {
  home: ['home', [['heroHome','16221:99'],['factTicker','16221:1606'],['leaderMap','16221:149'],['clubShowcase','16221:449'],['newcomers','16221:674'],['featuredEvents','16221:758'],['newsMagazine','16221:982'],['community','16221:1111'],['testimonials','16221:1165'],['socialWall','16221:14'],['voucherTeaser','16221:1242'],['appCta','16221:1339'],['partnerLogos','16221:1365'],['global:siteNavigation','16221:2093'],['global:siteFooter','16221:1885']]],
  locations: ['locations', [['pageHero','16282:5'],['locationFinder','16282:2578'],['plannedClubs','16282:1478'],['cityIndex','16282:2067'],['franchiseTeaser','16282:2528'],['home:appCta','16282:2557']]],
  club: ['club', [['clubHero','16239:8','16239:22'],['clubHours','16239:32'],['clubDescription','16239:45'],['clubContact','16239:64'],['clubPricing','16239:155'],['facilityGrid','16239:369'],['clubHighlights','16239:479'],['clubEvents','16239:533'],['clubCoaches','16239:554'],['appBooking','16239:634'],['recurringBooking','16239:748'],['clubFaq','16239:749'],['clubDirections','16239:793'],['nearbyClubs','16239:851']]],
  events: ['events', [['pageHero','16265:5'],['heroEvents','16265:47'],['eventInquiryTeaser','16265:203'],['eventList','16265:263'],['home:appCta','16265:639']]],
  eventInquiry: ['eventInquiry', [['pageHero','16362:5'],['eventInquiryForm','16362:28'],['eventInquiryFacts','16362:222']]],
  event: ['event', [['eventHero','16275:8'],['eventSignupCard','16275:86','16275:169'],['richText','16275:84'],['formatSteps','16275:228'],['home:appCta','16275:230']]],
  heroEvent: ['event', [['eventHero','16381:8'],['eventIntro','16381:110','16381:111'],['eventSignupCard','16381:113','16381:223'],['factGrid','16381:195','16381:283'],['formatSteps','16381:285','16381:287'],['videoEmbed','16381:357'],['eventPartners','16381:384'],['home:appCta','16381:666']]],
  app: ['app', [['appHero','16257:5'],['featureStory','16257:73'],['appStoreGallery','16257:489'],['howItWorks','16257:539'],['faq','16257:597'],['appFinalCta','16257:666']]],
  academy: ['academy', [['pageHero','16371:5'],['levelPath','16371:58'],['programmeGrid','16371:372'],['priceTable','16371:530'],['coachCarousel','16371:623'],['academyLocations','16371:1766'],['videoTeaserGrid','16371:2016'],['faq','16371:2080'],['home:appCta','16371:2142']]],
  magazine: ['magazine', [['pageHero','16286:5'],['article','16286:20'],['contentHubs','16286:57'],['pressLogos','16286:251']]],
  article: ['magazine', [['article','16293:5'],['relatedArticles','16293:103']]],
  franchise: ['franchise', [['franchiseContent','16299:5','16299:46','16299:152','16299:261','16299:405','16299:473'],['clubList','16299:523'],['contactCard','16299:589'],['leadForm','16299:589']]],
  investors: ['investors', [['investorsContent','16309:5','16309:46','16309:349','16309:543','16309:614','16309:842'],['peopleGrid','16309:707']]],
  partners: ['partners', [['partnersContent','16313:5','16313:45','16313:89','16313:194','16313:378','16313:440'],['partnerLogoWall','16313:278'],['partnerStance','16313:494'],['leadForm','16313:518']]],
  about: ['about', [['aboutContent','16321:5','16321:38','16321:77','16321:102','16321:168','16321:849','16321:941'],['peopleGrid','16321:304','16321:405'],['testimonials','16321:772']]],
  jobs: ['jobs', [['jobsContent','16325:5','16325:386','16325:492','16325:804'],['openings','16325:45'],['contactCard','16325:985']]],
  faqPage: ['faqPage', [['pageHero','16330:5'],['faqExplorer','16330:28'],['contactTeaser','16330:1170']]],
  legal: ['legal', [['legalPage','16380:16']]],
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
