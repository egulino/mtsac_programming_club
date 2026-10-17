import { useState } from 'react';
import {
  Circle, Square, Triangle, ArrowRight, ArrowDownRight,
  Shield, Lock, FileText, ChevronRight
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  PieChart, Pie, Cell, CartesianGrid
} from 'recharts';

const RED = '#E2261C';
const BLUE = '#1E50C8';
const YELLOW = '#F5B700';
const INK = '#121212';
const PAPER = '#F4F0E6';

const QUARTERLY = {
  2022: [
    { q: 'Q1', phishing: 2840, ransomware: 1210, supply: 640, credential: 510 },
    { q: 'Q2', phishing: 3120, ransomware: 1380, supply: 720, credential: 590 },
    { q: 'Q3', phishing: 2960, ransomware: 1540, supply: 880, credential: 640 },
    { q: 'Q4', phishing: 3480, ransomware: 1690, supply: 940, credential: 710 },
  ],
  2023: [
    { q: 'Q1', phishing: 3620, ransomware: 1740, supply: 1010, credential: 760 },
    { q: 'Q2', phishing: 3890, ransomware: 1820, supply: 1140, credential: 820 },
    { q: 'Q3', phishing: 4010, ransomware: 1960, supply: 1230, credential: 880 },
    { q: 'Q4', phishing: 4480, ransomware: 2110, supply: 1310, credential: 950 },
  ],
  2024: [
    { q: 'Q1', phishing: 4210, ransomware: 1880, supply: 1340, credential: 920 },
    { q: 'Q2', phishing: 4660, ransomware: 2040, supply: 1480, credential: 1010 },
    { q: 'Q3', phishing: 4930, ransomware: 2280, supply: 1620, credential: 1120 },
    { q: 'Q4', phishing: 5410, ransomware: 2510, supply: 1790, credential: 1240 },
  ],
};

const COMPOSITION = {
  2022: [
    { name: 'Phishing — Petit Four Lures', value: 41, color: RED },
    { name: 'Ransomware — The Frozen Tier', value: 21, color: BLUE },
    { name: 'Supply Chain — Spoiled Ingredients', value: 15, color: YELLOW },
    { name: 'Credential Theft — Recipe Leaks', value: 14, color: INK },
    { name: 'Insider — The Sour Starter', value: 9, color: '#8a8a86' },
  ],
  2023: [
    { name: 'Phishing — Petit Four Lures', value: 39, color: RED },
    { name: 'Ransomware — The Frozen Tier', value: 22, color: BLUE },
    { name: 'Supply Chain — Spoiled Ingredients', value: 16, color: YELLOW },
    { name: 'Credential Theft — Recipe Leaks', value: 14, color: INK },
    { name: 'Insider — The Sour Starter', value: 9, color: '#8a8a86' },
  ],
  2024: [
    { name: 'Phishing — Petit Four Lures', value: 38, color: RED },
    { name: 'Ransomware — The Frozen Tier', value: 22, color: BLUE },
    { name: 'Supply Chain — Spoiled Ingredients', value: 17, color: YELLOW },
    { name: 'Credential Theft — Recipe Leaks', value: 14, color: INK },
    { name: 'Insider — The Sour Starter', value: 9, color: '#8a8a86' },
  ],
};

const LAYERS = [
  { n: '01', name: 'Perimeter Crust', detail: 'Edge & DNS filtration, baked at the boundary', pct: 99.2, color: RED },
  { n: '02', name: 'Lamination Firewall', detail: '1,024 alternating folds of policy and inspection', pct: 97.8, color: BLUE },
  { n: '03', name: 'Custard Core Encryption', detail: 'AES-256 at rest — nothing leaks from the centre', pct: 99.9, color: YELLOW },
  { n: '04', name: 'Proofing Room Identity', detail: 'Zero-trust access. Every hand washed, every badge checked', pct: 96.4, color: INK },
  { n: '05', name: 'Glaze Endpoint Telemetry', detail: 'EDR finish on every device that leaves the kitchen', pct: 98.1, color: RED },
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: INK, color: PAPER }} className="px-4 py-3 text-xs font-nav uppercase tracking-widest">
      <div className="mb-2 text-[11px] opacity-60">{label} — Contained</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 mb-1">
          <span style={{ background: p.fill }} className="w-2.5 h-2.5 inline-block" />
          <span>{p.name}</span>
          <span className="ml-auto pl-4">{p.value.toLocaleString()}</span>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [year, setYear] = useState(2024);
  const [hoverLayer, setHoverLayer] = useState(null);

  const quarterly = QUARTERLY[year];
  const composition = COMPOSITION[year];
  const yearTotal = quarterly.reduce(
    (s, q) => s + q.phishing + q.ransomware + q.supply + q.credential, 0
  );

  return (
    <div style={{ background: PAPER, color: INK }} className="min-h-screen w-full font-nav antialiased">
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700;9..144,900&family=Oswald:wght@400;500;600;700&display=swap" rel="stylesheet" />
      <style dangerouslySetInnerHTML={{ __html: `
        .font-serif-w { font-family: 'Fraunces', Georgia, serif; letter-spacing: 0.01em; }
        .font-nav { font-family: 'Oswald', 'Arial Narrow', sans-serif; }
        @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .marquee-track { animation: marquee 28s linear infinite; }
        .stripes-blue { background: repeating-linear-gradient(45deg, ${BLUE} 0 10px, ${PAPER} 10px 20px); }
        .stripes-red-v { background: repeating-linear-gradient(90deg, ${RED} 0 12px, ${PAPER} 12px 24px); }
        .diag-yellow { background: linear-gradient(135deg, ${YELLOW} 0 50%, ${PAPER} 50% 100%); }
        .layer-bar { transition: width .7s cubic-bezier(.7,0,.2,1); }
        ::selection { background: ${YELLOW}; color: ${INK}; }
        .num-tab { transition: background .2s, color .2s; }
        .cta-shift svg { transition: transform .25s; }
        .cta-shift:hover svg { transform: translateX(6px); }
      `}} />

      {/* ───────── top strip ───────── */}
      <div style={{ background: INK, color: PAPER }} className="text-[11px] uppercase tracking-[0.25em] flex items-center justify-between px-6 py-2">
        <span>Maison Millefeuille — Cyber Pâtisserie · Est. 1919, Dessau</span>
        <span className="hidden md:block">Annual Threat Report · Ref. MF-24/0091</span>
      </div>

      {/* ───────── nav ───────── */}
      <header className="border-b-2 border-black">
        <div className="max-w-[1320px] mx-auto flex items-stretch">
          <div className="flex items-center gap-3 pl-6 pr-8 py-5 border-r-2 border-black">
            <span style={{ background: RED }} className="w-5 h-5 rounded-full inline-block" />
            <span style={{ background: BLUE }} className="w-5 h-5 inline-block" />
            <span style={{ width: 0, height: 0, borderLeft: '11px solid transparent', borderRight: '11px solid transparent', borderBottom: `20px solid ${YELLOW}` }} className="inline-block" />
            <span className="font-serif-w font-bold text-xl tracking-tight ml-2">MILLEFEUILLE</span>
          </div>
          <nav className="hidden lg:flex items-stretch flex-1">
            {['The Report', 'Threat Counter', 'Defense Layers', 'The Proofing Room', 'Provenance'].map((item, i) => (
              <a key={item} href="#" className={`flex items-center px-7 text-[13px] uppercase tracking-[0.18em] border-r-2 border-black hover:bg-black hover:text-[#F4F0E6] transition-colors ${i === 0 ? 'bg-black text-[#F4F0E6]' : ''}`}>
                {item}
              </a>
            ))}
          </nav>
          <a href="#" style={{ background: RED }} className="cta-shift ml-auto flex items-center gap-3 px-8 text-[#F4F0E6] text-[13px] uppercase tracking-[0.2em] font-medium hover:bg-[#1E50C8] transition-colors">
            Commission an Audit <ArrowRight size={16} />
          </a>
        </div>
      </header>

      {/* ───────── hero ───────── */}
      <section className="border-b-2 border-black">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-7 border-r-0 lg:border-r-2 border-black px-6 md:px-12 py-14 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-4 mb-10">
                <span style={{ background: YELLOW }} className="text-[12px] uppercase tracking-[0.3em] px-3 py-1.5 border-2 border-black font-medium">Annual Threat Pâtisserie · 2024</span>
                <span className="text-[12px] uppercase tracking-[0.3em] opacity-60">Vol. CV</span>
              </div>
              <h1 className="font-serif-w font-black leading-[0.95] text-[clamp(3rem,7vw,6.5rem)]">
                A thousand layers.<br />
                <span style={{ color: RED }}>Zero</span> breaches.
              </h1>
              <p className="mt-8 max-w-xl text-[15px] leading-relaxed tracking-wide uppercase opacity-80">
                Defense in depth, laminated daily. This is the complete record of what
                approached our clients' kitchens in 2024 — what we caught at the crust,
                what we contained in the fold, and what never reached the custard.
              </p>
            </div>
            <div className="mt-14 grid grid-cols-3 gap-0 border-2 border-black">
              {[
                { k: '57,431', v: 'Intrusion attempts glazed over', c: RED },
                { k: '36 min', v: 'Median oven-to-containment', c: BLUE },
                { k: '99.98%', v: 'Proofing room (SOC) uptime', c: YELLOW },
              ].map((s, i) => (
                <div key={s.k} className={`p-5 ${i < 2 ? 'border-r-2 border-black' : ''}`}>
                  <div style={{ background: s.c }} className="w-4 h-4 mb-4" />
                  <div className="font-serif-w font-bold text-3xl">{s.k}</div>
                  <div className="text-[11px] uppercase tracking-[0.18em] mt-1 opacity-70">{s.v}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Kandinsky grid composition */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-3 grid-rows-3 h-full min-h-[520px]">
              {/* row 1 */}
              <div className="border-b-2 border-r-2 border-black flex items-center justify-center p-6">
                <div style={{ background: RED }} className="w-3/4 aspect-square rounded-full" />
              </div>
              <div className="border-b-2 border-r-2 border-black stripes-blue" />
              <div className="border-b-2 border-black flex items-end justify-end">
                <div style={{ background: INK, clipPath: 'polygon(100% 0, 100% 100%, 0 100%)' }} className="w-full h-full" />
              </div>
              {/* row 2 */}
              <div className="border-b-2 border-r-2 border-black flex items-end justify-center">
                <div style={{ background: YELLOW, borderRadius: '999px 999px 0 0' }} className="w-3/4 h-1/2" />
              </div>
              <div className="border-b-2 border-r-2 border-black flex items-center justify-center p-6">
                <div className="w-3/4 aspect-square rounded-full border-[10px] border-black flex items-center justify-center">
                  <div style={{ background: BLUE }} className="w-1/2 aspect-square rounded-full" />
                </div>
              </div>
              <div className="border-b-2 border-black diag-yellow" />
              {/* row 3 */}
              <div className="border-r-2 border-black stripes-red-v" />
              <div className="border-r-2 border-black flex items-start justify-start">
                <div style={{ background: BLUE, borderBottomRightRadius: '100%' }} className="w-full h-full" />
              </div>
              <div style={{ background: INK }} className="flex flex-col items-center justify-center gap-3 p-6">
                <span style={{ background: YELLOW }} className="w-6 h-6 rounded-full" />
                <span className="text-[#F4F0E6] text-[11px] uppercase tracking-[0.3em] text-center leading-relaxed">Form follows<br />function.<br />Crust follows core.</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── marquee ───────── */}
      <div style={{ background: YELLOW }} className="border-b-2 border-black overflow-hidden py-3">
        <div className="marquee-track flex whitespace-nowrap text-[13px] uppercase tracking-[0.35em] font-medium">
          {[0, 1].map((d) => (
            <span key={d} className="flex items-center">
              {['Zero trust, full butter', 'Defense in depth · laminated daily', 'Fresh threat intelligence every morning', 'No breach has ever left this kitchen', 'Est. 1919 — still the standard'].map((t) => (
                <span key={t} className="flex items-center">
                  <span className="px-8">{t}</span>
                  <span style={{ background: INK }} className="w-3 h-3 rounded-full" />
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ───────── chart section ───────── */}
      <section className="border-b-2 border-black">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12">
          {/* left rail */}
          <div className="lg:col-span-3 border-r-0 lg:border-r-2 border-black px-6 md:px-10 py-12 flex flex-col">
            <div className="text-[12px] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
              <span style={{ background: BLUE }} className="w-3 h-3 inline-block" /> Section 02
            </div>
            <h2 className="font-serif-w font-bold text-4xl leading-[1.05] mb-6">The Morning Bake</h2>
            <p className="text-[13px] uppercase tracking-[0.14em] leading-relaxed opacity-75 mb-10">
              Every incident contained, counted by quarter and category. Select a vintage —
              the recipe holds, the volume rises.
            </p>

            {/* year tabs */}
            <div className="border-2 border-black flex">
              {[2022, 2023, 2024].map((y) => (
                <button
                  key={y}
                  onClick={() => setYear(y)}
                  className={`num-tab flex-1 py-3 text-[13px] uppercase tracking-[0.2em] font-medium ${year === y ? 'bg-black text-[#F4F0E6]' : 'hover:bg-[#e8e2d2]'}`}
                >
                  {y}
                </button>
              ))}
            </div>

            <div className="mt-auto pt-12">
              <div className="font-serif-w font-black text-6xl" style={{ color: RED }}>{yearTotal.toLocaleString()}</div>
              <div className="text-[11px] uppercase tracking-[0.25em] mt-2 opacity-70">Total incidents contained · {year}</div>
              <div className="mt-6 flex gap-2">
                <span style={{ background: RED }} className="w-5 h-5" />
                <span style={{ background: BLUE }} className="w-5 h-5 rounded-full" />
                <span style={{ width: 0, height: 0, borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderBottom: `20px solid ${YELLOW}` }} />
              </div>
            </div>
          </div>

          {/* bar chart */}
          <div className="lg:col-span-6 border-r-0 lg:border-r-2 border-black px-6 md:px-10 py-12">
            <div className="flex items-baseline justify-between mb-8">
              <h3 className="text-[13px] uppercase tracking-[0.25em] font-medium">Incidents contained by quarter</h3>
              <span className="text-[11px] uppercase tracking-[0.2em] opacity-60">Units: confirmed events</span>
            </div>
            <div className="h-[380px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={quarterly} barCategoryGap="28%">
                  <CartesianGrid stroke="#cfc8b6" vertical={false} />
                  <XAxis dataKey="q" stroke={INK} tick={{ fontFamily: 'Oswald', fontSize: 13, letterSpacing: 2 }} axisLine={{ stroke: INK, strokeWidth: 2 }} tickLine={false} />
                  <YAxis stroke={INK} tick={{ fontFamily: 'Oswald', fontSize: 12 }} axisLine={{ stroke: INK, strokeWidth: 2 }} tickLine={false} />
                  <Tooltip cursor={{ fill: '#e8e2d2' }} content={<ChartTooltip />} />
                  <Bar dataKey="phishing" name="Phishing" stackId="a" fill={RED} />
                  <Bar dataKey="ransomware" name="Ransomware" stackId="a" fill={BLUE} />
                  <Bar dataKey="supply" name="Supply chain" stackId="a" fill={YELLOW} />
                  <Bar dataKey="credential" name="Credential theft" stackId="a" fill={INK} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
              {[['Phishing', RED], ['Ransomware', BLUE], ['Supply chain', YELLOW], ['Credential theft', INK]].map(([n, c]) => (
                <span key={n} className="flex items-center gap-2 text-[12px] uppercase tracking-[0.2em]">
                  <span style={{ background: c }} className="w-3 h-3 inline-block" />{n}
                </span>
              ))}
            </div>
          </div>

          {/* pie */}
          <div className="lg:col-span-3 px-6 md:px-10 py-12 flex flex-col">
            <h3 className="text-[13px] uppercase tracking-[0.25em] font-medium mb-6">What walked through the door</h3>
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={composition} dataKey="value" nameKey="name" innerRadius={0} outerRadius={105} stroke={PAPER} strokeWidth={3} startAngle={90} endAngle={-270}>
                    {composition.map((c) => <Cell key={c.name} fill={c.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 border-t-2 border-black">
              {composition.map((c) => (
                <div key={c.name} className="flex items-center gap-3 py-2.5 border-b border-black/30 text-[11px] uppercase tracking-[0.14em]">
                  <span style={{ background: c.color }} className="w-3 h-3 rounded-full shrink-0" />
                  <span className="leading-tight">{c.name}</span>
                  <span className="ml-auto font-serif-w font-bold text-base">{c.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ───────── layers section ───────── */}
      <section className="border-b-2 border-black">
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 border-r-0 lg:border-r-2 border-black px-6 md:px-12 py-14">
            <div className="text-[12px] uppercase tracking-[0.3em] mb-4 flex items-center gap-3">
              <span style={{ background: RED }} className="w-3 h-3 rounded-full inline-block" /> Section 03
            </div>
            <h2 className="font-serif-w font-bold text-5xl leading-[1.02]">Defense,<br />laminated.</h2>
            <p className="mt-8 text-[13px] uppercase tracking-[0.14em] leading-relaxed opacity-75">
              A millefeuille fails if a single fold is rushed. So does a network. Five layers,
              each scored against attack-simulation coverage across 412 client estates.
            </p>
            <a href="#" className="cta-shift mt-10 inline-flex items-center gap-3 border-2 border-black px-6 py-3 text-[13px] uppercase tracking-[0.2em] font-medium hover:bg-black hover:text-[#F4F0E6] transition-colors">
              Read the methodology <ArrowDownRight size={16} />
            </a>
          </div>
          <div className="lg:col-span-8 px-6 md:px-12 py-14">
            {LAYERS.map((l, i) => (
              <div
                key={l.n}
                onMouseEnter={() => setHoverLayer(i)}
                onMouseLeave={() => setHoverLayer(null)}
                className="group border-b-2 border-black py-5 first:pt-0 cursor-default"
              >
                <div className="flex items-baseline gap-5">
                  <span className="font-serif-w font-bold text-2xl w-10" style={{ color: l.color === INK ? INK : l.color }}>{l.n}</span>
                  <span className="text-[14px] uppercase tracking-[0.2em] font-medium">{l.name}</span>
                  <span className="hidden md:block text-[11px] uppercase tracking-[0.14em] opacity-60">{l.detail}</span>
                  <span className="ml-auto font-serif-w font-black text-3xl">{l.pct}%</span>
                </div>
                <div className="mt-3 h-6 border-2 border-black relative overflow-hidden">
                  <div
                    className="layer-bar h-full"
                    style={{ width: `${hoverLayer === null || hoverLayer === i ? l.pct : l.pct * 0.35}%`, background: l.color }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-6 text-[11px] uppercase tracking-[0.2em] opacity-60 flex items-center gap-3">
              <span style={{ background: INK }} className="w-2.5 h-2.5 rounded-full" />
              Coverage measured by red-team simulation, 18,940 scenarios · FY24
            </div>
          </div>
        </div>
      </section>

      {/* ───────── footer / CTA ───────── */}
      <footer style={{ background: INK, color: PAPER }}>
        <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-8 px-6 md:px-12 py-16 border-r-0 lg:border-r border-[#3a3a36]">
            <div className="flex gap-3 mb-10">
              <span style={{ background: RED }} className="w-6 h-6 rounded-full" />
              <span style={{ background: BLUE }} className="w-6 h-6" />
              <span style={{ width: 0, height: 0, borderLeft: '13px solid transparent', borderRight: '13px solid transparent', borderBottom: `24px solid ${YELLOW}` }} />
            </div>
            <h2 className="font-serif-w font-black text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.98]">
              Commission your audit.<br />
              <span style={{ color: YELLOW }}>The oven is already hot.</span>
            </h2>
            <div className="mt-10 flex flex-wrap gap-4">
              <a href="#" style={{ background: RED }} className="cta-shift inline-flex items-center gap-3 px-8 py-4 text-[13px] uppercase tracking-[0.22em] font-medium hover:bg-[#1E50C8] transition-colors">
                Request the full report <ArrowRight size={16} />
              </a>
              <a href="#" className="inline-flex items-center gap-3 px-8 py-4 border border-[#F4F0E6]/40 text-[13px] uppercase tracking-[0.22em] hover:border-[#F4F0E6] transition-colors">
                <FileText size={15} /> Download the dossier (PDF, 4.2 MB)
              </a>
            </div>
          </div>
          <div className="lg:col-span-4 px-6 md:px-12 py-16 text-[12px] uppercase tracking-[0.2em] flex flex-col gap-8">
            <div>
              <div className="opacity-50 mb-3">The House</div>
              {['Threat counter', 'Defense layers', 'The proofing room', 'Provenance & compliance'].map((l) => (
                <a key={l} href="#" className="flex items-center gap-2 py-1.5 hover:text-[#F5B700] transition-colors"><ChevronRight size={13} />{l}</a>
              ))}
            </div>
            <div>
              <div className="opacity-50 mb-3">Certifications</div>
              <div className="flex flex-wrap gap-2">
                {['ISO 27001', 'SOC 2 Type II', 'NIS2', 'PCI DSS'].map((c) => (
                  <span key={c} className="border border-[#F4F0E6]/40 px-3 py-1.5">{c}</span>
                ))}
              </div>
            </div>
            <div className="mt-auto flex items-center gap-3 opacity-70">
              <Shield size={14} /> <Lock size={14} /> No breach has ever left this kitchen.
            </div>
          </div>
        </div>
        <div className="border-t border-[#3a3a36]">
          <div className="max-w-[1320px] mx-auto px-6 md:px-12 py-5 flex flex-wrap gap-4 justify-between text-[11px] uppercase tracking-[0.25em] opacity-60">
            <span>© 1919–2024 Maison Millefeuille Cyber Pâtisserie GmbH · Dessau · Zürich · New York</span>
            <span>Set in Fraunces & Oswald · Printed on the grid</span>
          </div>
        </div>
      </footer>
    </div>
  );
}