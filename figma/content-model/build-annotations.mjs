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
const M = {"15107:100":"15234:123","15107:1520":"15234:1433","15107:156":"15234:171","15107:408":"15234:407","15107:657":"15234:637","15107:740":"15234:714","15107:774":"15234:746","15107:998":"15234:947","15107:1036":"15234:982","15107:15":"15234:42","15107:1167":"15234:1095","15107:1252":"15234:1168","15107:1279":"15234:1193","15107:2228":"15234:2115","15107:1822":"15234:1734","15110:5":"15234:2164","15110:2218":"15234:2181","15110:1103":"15234:3170","15110:1784":"15234:3818","15110:2196":"15234:4134","15115:8":"15234:4586","15115:156":"15234:4604","15115:157":"15234:4660","15115:178":"15234:4719","15115:226":"15234:4765","15115:261":"15234:4797","15115:333":"15234:4862","15115:400":"15234:4915","15123:5":"15234:5581","15123:47":"15234:5615","15123:204":"15234:5749","15123:586":"15234:6105","15126:8":"15234:6563","15126:28":"15234:6594","15126:27":"15234:6575","15126:89":"15234:6578","15126:110":"15234:6644","15119:5":"15234:7099","15119:292":"15234:7365","15119:563":"15234:7602","15119:613":"15234:7641","15119:668":"15234:7681","15129:5":"15234:8207","15129:58":"15234:8248","15129:375":"15234:8509","15129:536":"15234:8649","15129:624":"15234:8719","15129:1905":"15234:9882","15129:2177":"15234:10129","15129:2241":"15234:10187","15129:2298":"15234:10243","15141:84":"15234:10758","15141:48":"15234:10729","15144:5":"15234:11593","15141:278":"15234:10933","15141:492":"15234:11144","15145:5":"15234:12232","15145:46":"15234:12265","15145:152":"15234:12349","15145:261":"15234:12444","15145:405":"15234:12569","15145:473":"15234:12628","15145:523":"15234:12665","15145:651":"15234:12780","15148:5":"15234:13299","15148:46":"15234:13332","15148:349":"15234:13561","15148:543":"15234:13716","15148:610":"15234:13765","15148:809":"15234:13928","15148:699":"15234:13839","15150:5":"15234:14432","15150:45":"15234:14464","15150:89":"15234:14494","15150:194":"15234:14577","15150:378":"15234:14738","15150:440":"15234:14796","15150:278":"15234:14645","15150:495":"15234:14845","15152:5":"15234:15336","15152:38":"15234:15361","15152:77":"15234:15390","15152:102":"15234:15409","15152:168":"15234:15467","15152:798":"15234:15990","15152:886":"15234:16064","15152:303":"15234:15580","15152:381":"15234:15643","15152:721":"15234:15926","15130:5":"15234:16514","15130:386":"15234:16854","15130:490":"15234:16943","15130:802":"15234:17192","15130:972":"15234:17333","15130:45":"15234:16546","15133:28":"15234:17800","15135:16":"15234:19269","15107:1090":"15234:1031","15110:2167":"15234:4107","15115:541":"15234:5034","15119:732":"15234:7745","15141:5":"15234:10698","15144:119":"15234:11682","15133:5":"15234:17783","15133:1108":"15234:18772"};
const F = {home:"15234:29",locations:"15234:2161",club:"15234:4581",events:"15234:5578",event:"15234:6557",app:"15234:7096",academy:"15234:8204",magazine:"15234:10695",article:"15234:11590",franchise:"15234:12229",investors:"15234:13296",partners:"15234:14429",about:"15234:15333",jobs:"15234:16511",faqPage:"15234:17780",legal:"15234:19256"};
// capture → [page type, [[module (or "pageType:module"), original nodes…]]]
const A = {
  home: ['home', [['heroHome','15107:100'],['factTicker','15107:1520'],['leaderMap','15107:156'],['clubShowcase','15107:408'],['audienceEntries','15107:657'],['seriesATeaser','15107:740'],['featuredEvents','15107:774'],['academyMagazineTeaser','15107:998'],['community','15107:1036'],['testimonials','15107:1090'],['socialWall','15107:15'],['voucherTeaser','15107:1167'],['appCta','15107:1252'],['partnerLogos','15107:1279'],['global:siteNavigation','15107:2228'],['global:siteFooter','15107:1822']]],
  locations: ['locations', [['pageHero','15110:5'],['locationFinder','15110:2218'],['plannedClubs','15110:1103'],['cityIndex','15110:1784'],['franchiseTeaser','15110:2167'],['home:appCta','15110:2196']]],
  club: ['club', [['clubHero','15115:8'],['clubDescription','15115:156'],['clubReach','15115:157','15115:333'],['clubPricing','15115:178'],['clubCoaches','15115:226'],['clubEvents','15115:261'],['appBooking','15115:400'],['nearbyClubs','15115:541']]],
  events: ['events', [['pageHero','15123:5'],['heroEvents','15123:47'],['eventList','15123:204'],['home:appCta','15123:586']]],
  event: ['event', [['eventHero','15126:8'],['eventSignupCard','15126:28'],['richText','15126:27'],['formatSteps','15126:89'],['home:appCta','15126:110']]],
  app: ['app', [['appHero','15119:5'],['featureStory','15119:292'],['appStoreGallery','15119:563'],['howItWorks','15119:613'],['faq','15119:668'],['appFinalCta','15119:732']]],
  academy: ['academy', [['pageHero','15129:5'],['levelPath','15129:58'],['programmeGrid','15129:375'],['priceTable','15129:536'],['coachCarousel','15129:624'],['academyLocations','15129:1905'],['videoTeaserGrid','15129:2177'],['faq','15129:2241'],['home:appCta','15129:2298']]],
  magazine: ['magazine', [['pageHero','15141:5'],['article','15141:48'],['contentHubs','15141:84'],['pressLogos','15141:278'],['newsletterSignup','15141:492']]],
  article: ['magazine', [['article','15144:5'],['relatedArticles','15144:119']]],
  franchise: ['franchise', [['franchiseContent','15145:5','15145:46','15145:152','15145:261','15145:405','15145:473'],['clubList','15145:523'],['contactCard','15145:651'],['leadForm','15145:651']]],
  investors: ['investors', [['investorsContent','15148:5','15148:46','15148:349','15148:543','15148:610','15148:809'],['peopleGrid','15148:699']]],
  partners: ['partners', [['partnersContent','15150:5','15150:45','15150:89','15150:194','15150:378','15150:440'],['partnerLogoWall','15150:278'],['leadForm','15150:495']]],
  about: ['about', [['aboutContent','15152:5','15152:38','15152:77','15152:102','15152:168','15152:798','15152:886'],['peopleGrid','15152:303','15152:381'],['testimonials','15152:721']]],
  jobs: ['jobs', [['jobsContent','15130:5','15130:386','15130:490','15130:802'],['openings','15130:45'],['contactCard','15130:972']]],
  faqPage: ['faqPage', [['pageHero','15133:5'],['faqExplorer','15133:28'],['contactTeaser','15133:1108']]],
  legal: ['legal', [['legalPage','15135:16']]],
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
