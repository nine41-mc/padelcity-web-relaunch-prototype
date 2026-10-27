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
const M = {"15588:100":"15629:122","15588:1525":"15629:1434","15588:150":"15629:167","15588:442":"15629:443","15588:669":"15629:644","15588:752":"15629:721","15588:786":"15629:753","15588:1010":"15629:954","15588:1048":"15629:989","15588:1102":"15629:1038","15588:15":"15629:41","15588:1179":"15629:1102","15588:1257":"15629:1169","15588:1284":"15629:1194","15588:2233":"15629:2116","15588:1827":"15629:1735","15595:8":"15629:2168","15595:89":"15629:2180","15595:90":"15629:2191","15595:92":"15629:2242","15595:241":"15629:2349","15595:303":"15629:2410","15595:353":"15629:2457","15595:407":"15629:2494","15595:428":"15629:2512","15595:508":"15629:2576","15595:627":"15629:2678","15595:685":"15629:2725","15599:5":"15629:3260","15599:47":"15629:3294","15599:205":"15629:3428","15599:588":"15629:3784","15606:8":"15629:4242","15606:28":"15629:4273","15606:27":"15629:4254","15606:89":"15629:4257","15606:110":"15629:4322","15586:5":"15629:4777","15586:77":"15629:4831","15586:486":"15629:5186","15586:536":"15629:5225","15586:591":"15629:5265","15586:655":"15629:5329","15589:5":"15629:5791","15589:58":"15629:5832","15589:375":"15629:6093","15589:536":"15629:6233","15589:624":"15629:6301","15589:1846":"15629:7391","15589:2096":"15629:7608","15589:2160":"15629:7666","15589:2217":"15629:7722","15590:5":"15629:8177","15590:51":"15629:8211","15590:87":"15629:8240","15590:281":"15629:8415","15590:495":"15629:8626","15594:5":"15629:9576","15594:120":"15629:9666","15598:5":"15629:10216","15598:46":"15629:10249","15598:152":"15629:10333","15598:261":"15629:10428","15598:405":"15629:10550","15598:473":"15629:10609","15598:523":"15629:10646","15598:589":"15629:10701","15605:5":"15629:11220","15605:46":"15629:11253","15605:349":"15629:11482","15605:543":"15629:11637","15605:610":"15629:11686","15605:813":"15629:11853","15605:703":"15629:11764","15612:5":"15629:12357","15612:45":"15629:12389","15612:89":"15629:12419","15612:194":"15629:12502","15612:378":"15629:12663","15612:440":"15629:12721","15612:278":"15629:12570","15612:495":"15629:12770","15617:5":"15629:13261","15617:38":"15629:13286","15617:77":"15629:13315","15617:102":"15629:13336","15617:168":"15629:13394","15617:798":"15629:13917","15617:890":"15629:13995","15617:303":"15629:13507","15617:381":"15629:13570","15617:721":"15629:13853","15592:5":"15629:14445","15592:386":"15629:14785","15592:490":"15629:14874","15592:802":"15629:15123","15592:972":"15629:15264","15592:45":"15629:14477","15602:16":"15629:15724","15628:5":"15632:532","15628:2598":"15632:549","15628:1441":"15632:1787","15628:2088":"15632:2402","15628:2547":"15632:2742","15628:2576":"15632:2769","15631:5":"15632:3219","15631:28":"15632:3236","15631:1108":"15632:4208"};
const F = {home:"15629:28",locations:"15632:529",club:"15629:2162",events:"15629:3257",event:"15629:4236",app:"15629:4774",academy:"15629:5788",magazine:"15629:8174",article:"15629:9573",franchise:"15629:10213",investors:"15629:11217",partners:"15629:12354",about:"15629:13258",jobs:"15629:14442",faqPage:"15632:3216",legal:"15629:15711"};
// capture → [page type, [[module (or "pageType:module"), original nodes…]]]
const A = {
  home: ['home', [['heroHome','15588:100'],['factTicker','15588:1525'],['leaderMap','15588:150'],['clubShowcase','15588:442'],['audienceEntries','15588:669'],['seriesATeaser','15588:752'],['featuredEvents','15588:786'],['academyMagazineTeaser','15588:1010'],['community','15588:1048'],['testimonials','15588:1102'],['socialWall','15588:15'],['voucherTeaser','15588:1179'],['appCta','15588:1257'],['partnerLogos','15588:1284'],['global:siteNavigation','15588:2233'],['global:siteFooter','15588:1827']]],
  locations: ['locations', [['pageHero','15628:5'],['locationFinder','15628:2598'],['plannedClubs','15628:1441'],['cityIndex','15628:2088'],['franchiseTeaser','15628:2547'],['home:appCta','15628:2576']]],
  club: ['club', [['clubHero','15595:8'],['clubDescription','15595:89'],['clubContact','15595:90'],['clubHours','15595:92'],['clubPricing','15595:92'],['facilityGrid','15595:241'],['courtOverview','15595:303'],['clubHighlights','15595:353'],['clubEvents','15595:407'],['clubCoaches','15595:428'],['appBooking','15595:508'],['clubDirections','15595:627'],['nearbyClubs','15595:685']]],
  events: ['events', [['pageHero','15599:5'],['heroEvents','15599:47'],['eventList','15599:205'],['home:appCta','15599:588']]],
  event: ['event', [['eventHero','15606:8'],['eventSignupCard','15606:28'],['richText','15606:27'],['formatSteps','15606:89'],['home:appCta','15606:110']]],
  app: ['app', [['appHero','15586:5'],['featureStory','15586:77'],['appStoreGallery','15586:486'],['howItWorks','15586:536'],['faq','15586:591'],['appFinalCta','15586:655']]],
  academy: ['academy', [['pageHero','15589:5'],['levelPath','15589:58'],['programmeGrid','15589:375'],['priceTable','15589:536'],['coachCarousel','15589:624'],['academyLocations','15589:1846'],['videoTeaserGrid','15589:2096'],['faq','15589:2160'],['home:appCta','15589:2217']]],
  magazine: ['magazine', [['pageHero','15590:5'],['article','15590:51'],['contentHubs','15590:87'],['pressLogos','15590:281'],['newsletterSignup','15590:495']]],
  article: ['magazine', [['article','15594:5'],['relatedArticles','15594:120']]],
  franchise: ['franchise', [['franchiseContent','15598:5','15598:46','15598:152','15598:261','15598:405','15598:473'],['clubList','15598:523'],['contactCard','15598:589'],['leadForm','15598:589']]],
  investors: ['investors', [['investorsContent','15605:5','15605:46','15605:349','15605:543','15605:610','15605:813'],['peopleGrid','15605:703']]],
  partners: ['partners', [['partnersContent','15612:5','15612:45','15612:89','15612:194','15612:378','15612:440'],['partnerLogoWall','15612:278'],['leadForm','15612:495']]],
  about: ['about', [['aboutContent','15617:5','15617:38','15617:77','15617:102','15617:168','15617:798','15617:890'],['peopleGrid','15617:303','15617:381'],['testimonials','15617:721']]],
  jobs: ['jobs', [['jobsContent','15592:5','15592:386','15592:490','15592:802'],['openings','15592:45'],['contactCard','15592:972']]],
  faqPage: ['faqPage', [['pageHero','15631:5'],['faqExplorer','15631:28'],['contactTeaser','15631:1108']]],
  legal: ['legal', [['legalPage','15602:16']]],
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
  const page = P[pt];
  const missing = key === 'article' ? [] : page.modules.filter((m) => !used.has(m.id));
  const lines = [`**${page.name}** · \`${page.path}\``, ...(page.text ? [page.text] : [])];
  if (key === 'magazine') lines.push('Artikel-Detail: siehe nächster Frame.');
  const listModule = (m) => [`- **${m.name}** · \`${m.id}\``, ...m.fields.map((f) => '  ' + line(f, true))];
  if (missing.length) { lines.push('', '**Im Modell, aber nicht in diesem Design sichtbar:**'); for (const m of missing) lines.push(...listModule(m)); }
  if (key === 'home') { lines.push('', '**Global (alle Seiten, nicht als eigene Sektion sichtbar):**'); for (const id of ['seo', 'consent', 'deeplinks']) lines.push(...listModule(mod('global', id))); }
  out.push({ n: F[key], c: 'Seite', md: lines.join('\n') });
}
fs.writeFileSync(path.join(here, 'annotations.json'), JSON.stringify(out));
const count = {}; for (const x of out) count[x.c] = (count[x.c] || 0) + 1;
console.log(out.length, 'annotations', JSON.stringify(count));
