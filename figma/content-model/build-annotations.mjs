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
const M = {"15643:100":"15697:122","15643:1521":"15697:1432","15643:150":"15697:167","15643:442":"15697:443","15643:669":"15697:644","15643:752":"15697:721","15643:786":"15697:753","15643:1010":"15697:954","15643:1048":"15697:989","15643:1102":"15697:1038","15643:15":"15697:41","15643:1179":"15697:1102","15643:1254":"15697:1167","15643:1280":"15697:1192","15643:2021":"15697:1910","15643:1823":"15697:1733","15647:5":"15697:1959","15647:2602":"15697:1976","15647:1478":"15697:3246","15647:2092":"15697:3829","15647:2552":"15697:4169","15647:2581":"15697:4196","15687:8":"15697:4444","15687:22":"15697:4457","15687:44":"15697:4464","15687:46":"15697:4475","15687:64":"15697:4491","15687:155":"15697:4568","15687:345":"15697:4705","15687:407":"15697:4766","15687:461":"15697:4803","15687:482":"15697:4821","15687:562":"15697:4885","15687:654":"15697:4964","15687:712":"15697:5011","15688:5":"15697:5342","15688:47":"15697:5376","15688:203":"15697:5507","15688:579":"15697:5856","15670:8":"15697:6110","15670:39":"15697:6151","15670:38":"15697:6132","15670:100":"15697:6135","15670:121":"15697:6200","15658:5":"15697:6451","15658:73":"15697:6503","15658:483":"15697:6858","15658:533":"15697:6897","15658:588":"15697:6937","15658:652":"15697:7001","15644:5":"15697:7259","15644:58":"15697:7300","15644:372":"15697:7558","15644:530":"15697:7695","15644:623":"15697:7767","15644:1766":"15697:8767","15644:2016":"15697:8984","15644:2080":"15697:9042","15644:2137":"15697:9098","15649:5":"15697:9349","15649:51":"15697:9383","15649:87":"15697:9412","15649:281":"15697:9587","15649:495":"15697:9798","15654:5":"15697:10043","15654:103":"15697:10116","15662:5":"15697:10462","15662:46":"15697:10495","15662:152":"15697:10579","15662:261":"15697:10674","15662:405":"15697:10796","15662:473":"15697:10855","15662:523":"15697:10892","15662:589":"15697:10947","15693:5":"15697:11262","15693:46":"15697:11295","15693:349":"15697:11524","15693:543":"15697:11679","15693:610":"15697:11728","15693:813":"15697:11895","15693:703":"15697:11806","15674:5":"15697:12195","15674:45":"15697:12227","15674:89":"15697:12257","15674:194":"15697:12340","15674:378":"15697:12501","15674:440":"15697:12559","15674:278":"15697:12408","15674:494":"15697:12608","15679:5":"15697:12895","15679:38":"15697:12920","15679:77":"15697:12949","15679:102":"15697:12970","15679:168":"15697:13028","15679:798":"15697:13551","15679:890":"15697:13629","15679:303":"15697:13141","15679:381":"15697:13204","15679:721":"15697:13487","15681:5":"15697:13875","15681:386":"15697:14215","15681:490":"15697:14304","15681:802":"15697:14553","15681:45":"15697:13907","15681:971":"15697:14694","15660:5":"15697:14940","15660:28":"15697:14957","15660:1108":"15697:15929","15694:16":"15697:16222"};
const F = {"home":"15697:28","locations":"15697:1956","club":"15697:4439","events":"15697:5339","event":"15697:6104","app":"15697:6448","academy":"15697:7256","magazine":"15697:9346","article":"15697:10040","franchise":"15697:10459","investors":"15697:11259","partners":"15697:12192","about":"15697:12892","jobs":"15697:13872","faqPage":"15697:14937","legal":"15697:16209"};
// capture → [page type, [[module (or "pageType:module"), original nodes…]]]
const A = {
  home: ['home', [['heroHome','15643:100'],['factTicker','15643:1521'],['leaderMap','15643:150'],['clubShowcase','15643:442'],['audienceEntries','15643:669'],['seriesATeaser','15643:752'],['featuredEvents','15643:786'],['academyMagazineTeaser','15643:1010'],['community','15643:1048'],['testimonials','15643:1102'],['socialWall','15643:15'],['voucherTeaser','15643:1179'],['appCta','15643:1254'],['partnerLogos','15643:1280'],['global:siteNavigation','15643:2021'],['global:siteFooter','15643:1823']]],
  locations: ['locations', [['pageHero','15647:5'],['locationFinder','15647:2602'],['plannedClubs','15647:1478'],['cityIndex','15647:2092'],['franchiseTeaser','15647:2552'],['home:appCta','15647:2581']]],
  club: ['club', [['clubHero','15687:8','15687:22'],['clubHours','15687:44'],['clubDescription','15687:46'],['clubContact','15687:64'],['clubPricing','15687:155'],['facilityGrid','15687:345'],['clubHighlights','15687:407'],['clubEvents','15687:461'],['clubCoaches','15687:482'],['appBooking','15687:562'],['clubDirections','15687:654'],['nearbyClubs','15687:712']]],
  events: ['events', [['pageHero','15688:5'],['heroEvents','15688:47'],['eventList','15688:203'],['home:appCta','15688:579']]],
  event: ['event', [['eventHero','15670:8'],['eventSignupCard','15670:39'],['richText','15670:38'],['formatSteps','15670:100'],['home:appCta','15670:121']]],
  app: ['app', [['appHero','15658:5'],['featureStory','15658:73'],['appStoreGallery','15658:483'],['howItWorks','15658:533'],['faq','15658:588'],['appFinalCta','15658:652']]],
  academy: ['academy', [['pageHero','15644:5'],['levelPath','15644:58'],['programmeGrid','15644:372'],['priceTable','15644:530'],['coachCarousel','15644:623'],['academyLocations','15644:1766'],['videoTeaserGrid','15644:2016'],['faq','15644:2080'],['home:appCta','15644:2137']]],
  magazine: ['magazine', [['pageHero','15649:5'],['article','15649:51'],['contentHubs','15649:87'],['pressLogos','15649:281'],['newsletterSignup','15649:495']]],
  article: ['magazine', [['article','15654:5'],['relatedArticles','15654:103']]],
  franchise: ['franchise', [['franchiseContent','15662:5','15662:46','15662:152','15662:261','15662:405','15662:473'],['clubList','15662:523'],['contactCard','15662:589'],['leadForm','15662:589']]],
  investors: ['investors', [['investorsContent','15693:5','15693:46','15693:349','15693:543','15693:610','15693:813'],['peopleGrid','15693:703']]],
  partners: ['partners', [['partnersContent','15674:5','15674:45','15674:89','15674:194','15674:378','15674:440'],['partnerLogoWall','15674:278'],['leadForm','15674:494']]],
  about: ['about', [['aboutContent','15679:5','15679:38','15679:77','15679:102','15679:168','15679:798','15679:890'],['peopleGrid','15679:303','15679:381'],['testimonials','15679:721']]],
  jobs: ['jobs', [['jobsContent','15681:5','15681:386','15681:490','15681:802'],['openings','15681:45'],['contactCard','15681:971']]],
  faqPage: ['faqPage', [['pageHero','15660:5'],['faqExplorer','15660:28'],['contactTeaser','15660:1108']]],
  legal: ['legal', [['legalPage','15694:16']]],
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
