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
const M = {"15710:100":"15752:122","15710:1543":"15752:1454","15710:150":"15752:167","15710:442":"15752:443","15710:669":"15752:644","15710:752":"15752:721","15710:786":"15752:753","15710:1010":"15752:954","15710:1048":"15752:989","15710:1102":"15752:1038","15710:15":"15752:41","15710:1179":"15752:1102","15710:1276":"15752:1189","15710:1302":"15752:1214","15710:2043":"15752:1932","15710:1845":"15752:1755","15708:8":"15752:1983","15708:22":"15752:1996","15708:44":"15752:2003","15708:46":"15752:2014","15708:64":"15752:2030","15708:155":"15752:2107","15708:365":"15752:2264","15708:475":"15752:2373","15708:529":"15752:2410","15708:550":"15752:2428","15708:630":"15752:2492","15708:729":"15752:2578","15708:787":"15752:2625","15736:5":"15752:2956","15736:47":"15752:2990","15736:203":"15752:3121","15736:579":"15752:3470","15744:8":"15752:3724","15744:39":"15752:3765","15744:38":"15752:3746","15744:100":"15752:3749","15744:121":"15752:3814","15713:5":"15752:4065","15713:91":"15752:4134","15713:175":"15752:4209","15713:294":"15752:4306","15713:320":"15752:4329","15713:341":"15752:4347","15727:5":"15752:4603","15727:73":"15752:4655","15727:498":"15752:5025","15727:548":"15752:5064","15727:603":"15752:5104","15727:667":"15752:5168","15722:5":"15752:5426","15722:58":"15752:5467","15722:372":"15752:5725","15722:530":"15752:5862","15722:623":"15752:5934","15722:1766":"15752:6934","15722:2016":"15752:7151","15722:2080":"15752:7209","15722:2137":"15752:7265","15729:5":"15752:7516","15729:51":"15752:7550","15729:87":"15752:7579","15729:281":"15752:7754","15729:495":"15752:7965","15738:5":"15752:8210","15738:103":"15752:8283","15746:5":"15752:8629","15746:46":"15752:8662","15746:152":"15752:8746","15746:261":"15752:8841","15746:405":"15752:8963","15746:473":"15752:9022","15746:523":"15752:9059","15746:589":"15752:9114","15714:5":"15752:9429","15714:46":"15752:9462","15714:349":"15752:9691","15714:543":"15752:9846","15714:610":"15752:9895","15714:813":"15752:10062","15714:703":"15752:9973","15723:5":"15752:10362","15723:45":"15752:10394","15723:89":"15752:10424","15723:194":"15752:10507","15723:378":"15752:10668","15723:440":"15752:10726","15723:278":"15752:10575","15723:494":"15752:10775","15731:5":"15752:11062","15731:38":"15752:11087","15731:77":"15752:11116","15731:102":"15752:11137","15731:168":"15752:11195","15731:799":"15752:11719","15731:891":"15752:11797","15731:304":"15752:11309","15731:382":"15752:11372","15731:722":"15752:11655","15740:5":"15752:12043","15740:386":"15752:12383","15740:492":"15752:12474","15740:804":"15752:12723","15740:45":"15752:12075","15740:973":"15752:12864","15717:5":"15752:13110","15717:28":"15752:13127","15717:1108":"15752:14099","15725:16":"15752:14392","15751:5":"15753:31","15751:2602":"15753:48","15751:1478":"15753:1318","15751:2092":"15753:1901","15751:2552":"15753:2241","15751:2581":"15753:2268"};
const F = {"home":"15752:28","locations":"15753:28","club":"15752:1978","events":"15752:2953","event":"15752:3718","app":"15752:4600","academy":"15752:5423","magazine":"15752:7513","article":"15752:8207","franchise":"15752:8626","investors":"15752:9426","partners":"15752:10359","about":"15752:11059","jobs":"15752:12040","faqPage":"15752:13107","legal":"15752:14379","heroEvent":"15752:4062"};
// capture → [page type, [[module (or "pageType:module"), original nodes…]]]
const A = {
  home: ['home', [['heroHome','15710:100'],['factTicker','15710:1543'],['leaderMap','15710:150'],['clubShowcase','15710:442'],['audienceEntries','15710:669'],['seriesATeaser','15710:752'],['featuredEvents','15710:786'],['newsMagazine','15710:1010'],['community','15710:1048'],['testimonials','15710:1102'],['socialWall','15710:15'],['voucherTeaser','15710:1179'],['appCta','15710:1276'],['partnerLogos','15710:1302'],['global:siteNavigation','15710:2043'],['global:siteFooter','15710:1845']]],
  locations: ['locations', [['pageHero','15751:5'],['locationFinder','15751:2602'],['plannedClubs','15751:1478'],['cityIndex','15751:2092'],['franchiseTeaser','15751:2552'],['home:appCta','15751:2581']]],
  club: ['club', [['clubHero','15708:8','15708:22'],['clubHours','15708:44'],['clubDescription','15708:46'],['clubContact','15708:64'],['clubPricing','15708:155'],['facilityGrid','15708:365'],['clubHighlights','15708:475'],['clubEvents','15708:529'],['clubCoaches','15708:550'],['appBooking','15708:630'],['clubDirections','15708:729'],['nearbyClubs','15708:787']]],
  events: ['events', [['pageHero','15736:5'],['heroEvents','15736:47'],['eventList','15736:203'],['home:appCta','15736:579']]],
  event: ['event', [['eventHero','15744:8'],['eventSignupCard','15744:39'],['richText','15744:38'],['formatSteps','15744:100'],['home:appCta','15744:121']]],
  heroEvent: ['event', [['eventHero','15713:5'],['eventIntro','15713:5'],['factGrid','15713:91'],['formatSteps','15713:175'],['videoEmbed','15713:294'],['eventPartners','15713:320'],['eventSignupCard','15713:341']]],
  app: ['app', [['appHero','15727:5'],['featureStory','15727:73'],['appStoreGallery','15727:498'],['howItWorks','15727:548'],['faq','15727:603'],['appFinalCta','15727:667']]],
  academy: ['academy', [['pageHero','15722:5'],['levelPath','15722:58'],['programmeGrid','15722:372'],['priceTable','15722:530'],['coachCarousel','15722:623'],['academyLocations','15722:1766'],['videoTeaserGrid','15722:2016'],['faq','15722:2080'],['home:appCta','15722:2137']]],
  magazine: ['magazine', [['pageHero','15729:5'],['article','15729:51'],['contentHubs','15729:87'],['pressLogos','15729:281']]],
  article: ['magazine', [['article','15738:5'],['relatedArticles','15738:103']]],
  franchise: ['franchise', [['franchiseContent','15746:5','15746:46','15746:152','15746:261','15746:405','15746:473'],['clubList','15746:523'],['contactCard','15746:589'],['leadForm','15746:589']]],
  investors: ['investors', [['investorsContent','15714:5','15714:46','15714:349','15714:543','15714:610','15714:813'],['peopleGrid','15714:703']]],
  partners: ['partners', [['partnersContent','15723:5','15723:45','15723:89','15723:194','15723:378','15723:440'],['partnerLogoWall','15723:278'],['leadForm','15723:494']]],
  about: ['about', [['aboutContent','15731:5','15731:38','15731:77','15731:102','15731:168','15731:799','15731:891'],['peopleGrid','15731:304','15731:382'],['testimonials','15731:722']]],
  jobs: ['jobs', [['jobsContent','15740:5','15740:386','15740:492','15740:804'],['openings','15740:45'],['contactCard','15740:973']]],
  faqPage: ['faqPage', [['pageHero','15717:5'],['faqExplorer','15717:28'],['contactTeaser','15717:1108']]],
  legal: ['legal', [['legalPage','15725:16']]],
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
