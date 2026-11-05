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
const M = {"16497:93":"16661:115","16497:1553":"16661:1445","16497:141":"16661:158","16497:436":"16661:437","16497:656":"16661:630","16497:735":"16661:693","16497:953":"16661:888","16497:1077":"16661:1000","16497:1126":"16661:1044","16497:14":"16661:40","16497:1198":"16661:1103","16497:1291":"16661:1186","16497:1317":"16661:1211","16497:2006":"16661:1875","16497:1824":"16661:1714","16574:5":"16661:1935","16574:23":"16661:1949","16574:1474":"16661:3218","16574:2058":"16661:3778","16574:2088":"16661:3804","16516:8":"16661:4124","16516:22":"16661:4137","16516:32":"16661:4145","16516:45":"16661:4154","16516:64":"16661:4171","16516:176":"16661:4272","16516:390":"16661:4428","16516:500":"16661:4537","16516:554":"16661:4574","16516:575":"16661:4592","16516:655":"16661:4656","16516:697":"16661:4680","16516:698":"16661:4694","16516:742":"16661:4735","16516:782":"16661:4763","16527:5":"16661:5089","16527:41":"16661:5118","16527:193":"16661:5244","16527:250":"16661:5291","16527:259":"16661:5298","16527:757":"16661:5761","16571:5":"16661:6007","16571:23":"16661:6020","16571:213":"16661:6175","16561:8":"16661:6431","16561:86":"16661:6541","16561:169":"16661:6497","16561:84":"16661:6451","16561:228":"16661:6518","16561:230":"16661:6607","16576:8":"16661:6855","16576:110":"16661:6875","16576:111":"16661:6880","16576:113":"16661:7011","16576:223":"16661:6967","16576:195":"16661:6944","16576:283":"16661:6945","16576:285":"16661:6988","16576:287":"16661:7076","16576:353":"16661:7136","16576:376":"16661:7155","16576:652":"16661:7417","16513:5":"16661:7663","16513:73":"16661:7715","16513:394":"16661:7984","16572:5":"16661:8265","16572:38":"16661:8291","16572:349":"16661:8544","16572:503":"16661:8676","16572:592":"16661:8744","16572:1731":"16661:9738","16572:1977":"16661:9950","16572:2037":"16661:10003","16572:2095":"16661:10055","16562:5":"16661:10301","16562:15":"16661:10307","16562:52":"16661:10336","16562:246":"16661:10511","16566:5":"16661:10940","16566:103":"16661:11013","16563:5":"16661:11336","16563:40":"16661:11364","16563:142":"16661:11444","16563:247":"16661:11535","16563:387":"16661:11656","16563:451":"16661:11711","16563:497":"16661:11746","16563:559":"16661:11797","16567:5":"16661:12107","16567:41":"16661:12136","16567:344":"16661:12365","16567:534":"16661:12516","16567:602":"16661:12563","16567:822":"16661:12750","16567:691":"16661:12636","16568:5":"16661:13038","16568:40":"16661:13066","16568:84":"16661:13096","16568:185":"16661:13175","16568:370":"16661:13329","16568:428":"16661:13383","16568:264":"16661:13238","16568:478":"16661:13430","16568:497":"16661:13445","16575:5":"16661:13727","16575:33":"16661:13748","16575:68":"16661:13775","16575:94":"16661:13796","16575:156":"16661:13850","16575:820":"16661:14418","16575:908":"16661:14491","16575:288":"16661:13967","16575:385":"16661:14053","16575:748":"16661:14359","16569:5":"16661:14732","16569:374":"16661:15062","16569:476":"16661:15149","16569:784":"16661:15396","16569:40":"16661:14760","16569:961":"16661:15545","16564:5":"16661:15786","16564:23":"16661:15799","16564:1166":"16661:16771","16573:13":"16661:17052","16502:5":"16661:17311","16502:34":"16661:17333","16502:115":"16661:17393","16502:221":"16661:17482","16502:250":"16661:17506","16502:346":"16661:17595"};
const F = {"home":"16661:28","locations":"16661:1932","club":"16661:4119","events":"16661:5086","eventInquiry":"16661:6004","event":"16661:6426","heroEvent":"16661:6850","app":"16661:7660","academy":"16661:8262","magazine":"16661:10298","article":"16661:10937","franchise":"16661:11333","investors":"16661:12104","partners":"16661:13035","about":"16661:13724","jobs":"16661:14729","faqPage":"16661:15783","legal":"16661:17042","company":"16661:17308"};
// capture → [page type, [[module (or "pageType:module"), original nodes…]]]
const A = {
  home: ['home', [['heroHome','16497:93'],['factTicker','16497:1553'],['leaderMap','16497:141'],['clubShowcase','16497:436'],['newcomers','16497:656'],['featuredEvents','16497:735'],['newsMagazine','16497:953'],['community','16497:1077'],['testimonials','16497:1126'],['socialWall','16497:14'],['voucherTeaser','16497:1198'],['appCta','16497:1291'],['partnerLogos','16497:1317'],['global:siteNavigation','16497:2006'],['global:siteFooter','16497:1824']]],
  locations: ['locations', [['pageHero','16574:5'],['locationFinder','16574:23'],['plannedClubs','16574:1474'],['franchiseTeaser','16574:2058'],['cityIndex','16574:2088']]],
  club: ['club', [['clubHero','16516:8','16516:22'],['clubHours','16516:32'],['clubDescription','16516:45'],['clubContact','16516:64'],['clubPricing','16516:176'],['facilityGrid','16516:390'],['clubHighlights','16516:500'],['clubEvents','16516:554'],['clubCoaches','16516:575'],['appBooking','16516:655'],['recurringBooking','16516:697'],['clubFaq','16516:698'],['clubDirections','16516:742'],['nearbyClubs','16516:782']]],
  events: ['events', [['pageHero','16527:5'],['heroEvents','16527:41'],['eventInquiryTeaser','16527:193'],['eventList','16527:250'],['eventFormats','16527:259'],['home:appCta','16527:757']]],
  eventInquiry: ['eventInquiry', [['pageHero','16571:5'],['eventInquiryForm','16571:23'],['eventInquiryFacts','16571:213']]],
  event: ['event', [['eventHero','16561:8'],['eventSignupCard','16561:86','16561:169'],['richText','16561:84'],['formatSteps','16561:228'],['home:appCta','16561:230']]],
  heroEvent: ['event', [['eventHero','16576:8'],['eventIntro','16576:110','16576:111'],['eventSignupCard','16576:113','16576:223'],['factGrid','16576:195','16576:283'],['formatSteps','16576:285','16576:287'],['videoEmbed','16576:353'],['eventPartners','16576:376'],['home:appCta','16576:652']]],
  app: ['app', [['appHero','16513:5'],['featureStory','16513:73'],['faq','16513:394']]],
  academy: ['academy', [['pageHero','16572:5'],['levelPath','16572:38'],['programmeGrid','16572:349'],['priceTable','16572:503'],['coachCarousel','16572:592'],['academyLocations','16572:1731'],['videoTeaserGrid','16572:1977'],['faq','16572:2037'],['home:appCta','16572:2095']]],
  magazine: ['magazine', [['pageHero','16562:5'],['article','16562:15'],['contentHubs','16562:52'],['pressLogos','16562:246']]],
  article: ['magazine', [['article','16566:5'],['relatedArticles','16566:103']]],
  franchise: ['franchise', [['franchiseContent','16563:5','16563:40','16563:142','16563:247','16563:387','16563:451'],['clubList','16563:497'],['contactCard','16563:559'],['leadForm','16563:559']]],
  investors: ['investors', [['investorsContent','16567:5','16567:41','16567:344','16567:534','16567:602','16567:822'],['peopleGrid','16567:691']]],
  partners: ['partners', [['partnersContent','16568:5','16568:40','16568:84','16568:185','16568:370','16568:428'],['partnerLogoWall','16568:264'],['partnerStance','16568:478'],['leadForm','16568:497']]],
  about: ['about', [['aboutContent','16575:5','16575:33','16575:68','16575:94','16575:156','16575:820','16575:908'],['peopleGrid','16575:288','16575:385'],['testimonials','16575:748']]],
  jobs: ['jobs', [['jobsContent','16569:5','16569:374','16569:476','16569:784'],['openings','16569:40'],['contactCard','16569:961']]],
  faqPage: ['faqPage', [['pageHero','16564:5'],['faqExplorer','16564:23'],['contactTeaser','16564:1166']]],
  legal: ['legal', [['legalPage','16573:13']]],
  company: ['company', [['pageHero','16502:5'],['companyIntro','16502:34'],['milestoneTimeline','16502:115'],['visionMission','16502:221'],['audienceEntries','16502:250'],['seriesATeaser','16502:346']]],
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
