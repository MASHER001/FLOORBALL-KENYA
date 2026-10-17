"""
Writes the FloorballKenya CSS design system.
Run from frontend/:  python write_css.py
"""
import os
from pathlib import Path

CSS_DIR = Path(__file__).parent / "css"
CSS_DIR.mkdir(exist_ok=True)

FILES = {}

FILES["variables.css"] = """
:root {
  --fk-green: #0F5132;
  --fk-green-600: #166534;
  --fk-green-500: #16A34A;
  --fk-green-100: #DCFCE7;
  --fk-red: #C8102E;
  --fk-red-600: #A80D26;
  --fk-red-100: #FEE2E2;
  --fk-black: #0A0A0A;
  --fk-ink: #111827;
  --fk-slate-700: #374151;
  --fk-slate-500: #6B7280;
  --fk-slate-300: #D1D5DB;
  --fk-slate-200: #E5E7EB;
  --fk-slate-100: #F3F4F6;
  --fk-slate-50: #F9FAFB;
  --fk-gold: #C99A2E;
  --fk-white: #FFFFFF;

  --color-bg: var(--fk-white);
  --color-surface: var(--fk-white);
  --color-surface-alt: var(--fk-slate-50);
  --color-border: var(--fk-slate-200);
  --color-text: var(--fk-ink);
  --color-text-muted: var(--fk-slate-500);
  --color-primary: var(--fk-green);
  --color-accent: var(--fk-red);
  --color-success: var(--fk-green-500);
  --color-warning: #B45309;
  --color-danger: var(--fk-red);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-pill: 999px;

  --shadow-sm: 0 1px 2px rgba(15,23,42,.05);
  --shadow-md: 0 4px 12px rgba(15,23,42,.08);
  --shadow-lg: 0 12px 32px rgba(15,23,42,.12);

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;

  --font-sans: "Poppins", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  --font-heading: "Poppins", system-ui, sans-serif;

  --container: 1200px;
  --nav-height: 68px;
}
"""

FILES["reset.css"] = """
*, *::before, *::after { box-sizing: border-box; }
html { -webkit-text-size-adjust: 100%; }
body, h1, h2, h3, h4, h5, h6, p, figure, blockquote, dl, dd { margin: 0; }
ul[role="list"], ol[role="list"] { list-style: none; padding: 0; }
html, body { height: 100%; }
body { line-height: 1.5; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
img, picture, svg, video { display: block; max-width: 100%; height: auto; }
input, button, textarea, select { font: inherit; color: inherit; }
button { cursor: pointer; background: none; border: none; padding: 0; }
a { color: inherit; text-decoration: none; }
table { border-collapse: collapse; border-spacing: 0; }
:focus-visible { outline: 2px solid var(--color-primary); outline-offset: 2px; border-radius: 4px; }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; }
}
"""

FILES["base.css"] = """
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap");

body { font-family: var(--font-sans); font-size: 15px; color: var(--color-text); background: var(--color-bg); }
h1, h2, h3, h4 { font-family: var(--font-heading); color: var(--fk-ink); line-height: 1.2; font-weight: 700; }
h1 { font-size: clamp(28px, 4vw, 44px); font-weight: 800; letter-spacing: -0.02em; }
h2 { font-size: clamp(22px, 3vw, 32px); font-weight: 700; }
h3 { font-size: 20px; font-weight: 600; }
h4 { font-size: 17px; font-weight: 600; }
p { color: var(--fk-slate-700); }
a { color: var(--color-primary); }
a:hover { text-decoration: underline; }
small { font-size: 12px; color: var(--color-text-muted); }

.container { max-width: var(--container); margin-inline: auto; padding-inline: 20px; }
.section { padding-block: 56px; }
.section-tight { padding-block: 32px; }
.section-header { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
.section-header h2 { margin: 0; }
.section-header .link { color: var(--color-primary); font-weight: 600; font-size: 14px; }
.eyebrow { display: inline-block; text-transform: uppercase; letter-spacing: .12em; font-size: 12px; font-weight: 700; color: var(--color-primary); margin-bottom: 8px; }
.text-muted { color: var(--color-text-muted); }
.text-center { text-align: center; }
.stack > * + * { margin-top: var(--space-4); }
.row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
.spacer { flex: 1; }
.hidden { display: none !important; }
.sr-only { position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px; overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0; }
"""

FILES["components.css"] = """
.btn {
  display: inline-flex; align-items: center; justify-content: center; gap: 8px;
  padding: 11px 20px; border-radius: var(--radius-sm);
  font-weight: 600; font-size: 14px; line-height: 1;
  background: var(--color-primary); color: #fff; border: 1px solid transparent;
  transition: filter .15s ease, transform .05s ease;
  white-space: nowrap; text-decoration: none;
}
.btn:hover { filter: brightness(1.1); text-decoration: none; }
.btn:active { transform: translateY(1px); }
.btn:disabled, .btn[disabled] { opacity: .55; cursor: not-allowed; }
.btn-primary { background: var(--color-primary); color: #fff; }
.btn-accent { background: var(--color-accent); color: #fff; }
.btn-dark { background: var(--fk-black); color: #fff; }
.btn-outline { background: transparent; border-color: var(--color-border); color: var(--fk-ink); }
.btn-outline:hover { background: var(--fk-slate-50); }
.btn-ghost { background: transparent; color: var(--fk-ink); padding: 8px 12px; }
.btn-sm { padding: 8px 14px; font-size: 13px; }
.btn-lg { padding: 14px 26px; font-size: 15px; }
.btn-block { width: 100%; }

.card { background: var(--color-surface); border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; transition: box-shadow .15s ease, transform .15s ease; }
.card:hover { box-shadow: var(--shadow-md); }
.card-body { padding: 18px; }
.card-media { aspect-ratio: 16/10; overflow: hidden; background: var(--fk-slate-100); }
.card-media img { width: 100%; height: 100%; object-fit: cover; }
.card-title { font-size: 16px; font-weight: 700; margin-bottom: 4px; }
.card-sub { font-size: 13px; color: var(--color-text-muted); }
.card-footer { padding: 12px 18px; border-top: 1px solid var(--color-border); display: flex; align-items: center; justify-content: space-between; background: var(--fk-slate-50); }

.badge { display: inline-flex; align-items: center; gap: 4px; padding: 3px 10px; border-radius: var(--radius-pill); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
.badge-green { background: var(--fk-green-100); color: var(--fk-green-600); }
.badge-red { background: var(--fk-red-100); color: var(--fk-red-600); }
.badge-gold { background: #FEF3C7; color: #92400E; }
.badge-gray { background: var(--fk-slate-100); color: var(--fk-slate-700); }
.badge-dark { background: var(--fk-black); color: #fff; }

.stat-strip { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 0; border-top: 1px solid var(--color-border); border-bottom: 1px solid var(--color-border); }
.stat-strip .stat { padding: 22px 20px; border-right: 1px solid var(--color-border); }
.stat-strip .stat:last-child { border-right: 0; }
.stat-strip .stat-value { font-size: 26px; font-weight: 800; color: var(--fk-ink); display: flex; align-items: center; gap: 8px; }
.stat-strip .stat-label { font-size: 13px; color: var(--color-text-muted); margin-top: 2px; }

.tabs { display: flex; gap: 6px; padding: 4px; border: 1px solid var(--color-border); border-radius: var(--radius-pill); background: var(--fk-slate-50); width: fit-content; }
.tabs button { padding: 7px 16px; border-radius: var(--radius-pill); font-size: 13px; font-weight: 600; color: var(--fk-slate-700); }
.tabs button.active { background: var(--fk-green); color: #fff; }

.chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border: 1px solid var(--color-border); border-radius: var(--radius-pill); font-size: 12px; font-weight: 600; background: #fff; cursor: pointer; }
.chip.active { background: var(--fk-black); color: #fff; border-color: var(--fk-black); }

.alert { padding: 12px 16px; border-radius: var(--radius-sm); border: 1px solid transparent; font-size: 14px; }
.alert-info { background: #EFF6FF; color: #1E40AF; border-color: #BFDBFE; }
.alert-success { background: var(--fk-green-100); color: var(--fk-green-600); border-color: #A7F3D0; }
.alert-warning { background: #FEF3C7; color: #92400E; border-color: #FDE68A; }
.alert-danger { background: var(--fk-red-100); color: var(--fk-red-600); border-color: #FECACA; }
"""

FILES["layout.css"] = """
.site-header { position: sticky; top: 0; z-index: 100; background: #fff; border-bottom: 1px solid var(--color-border); }
.site-header__inner { max-width: var(--container); margin-inline: auto; padding: 0 20px; height: var(--nav-height); display: flex; align-items: center; gap: 24px; }
.brand { display: flex; align-items: center; gap: 10px; font-weight: 800; color: var(--fk-ink); font-size: 15px; letter-spacing: .02em; text-transform: uppercase; }
.brand img { height: 32px; width: auto; }
.brand .brand-sub { display: block; font-size: 9px; font-weight: 600; color: var(--color-text-muted); letter-spacing: .15em; margin-top: -2px; }

.site-nav { display: flex; gap: 4px; list-style: none; margin: 0; padding: 0; flex: 1; }
.site-nav a { display: inline-block; padding: 8px 12px; font-size: 14px; font-weight: 500; color: var(--fk-slate-700); border-radius: var(--radius-sm); }
.site-nav a:hover { background: var(--fk-slate-100); color: var(--fk-ink); text-decoration: none; }
.site-nav a.active { color: var(--fk-green); font-weight: 700; }

.header-actions { display: flex; align-items: center; gap: 12px; }
.icon-btn { width: 38px; height: 38px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; color: var(--fk-slate-700); position: relative; }
.icon-btn:hover { background: var(--fk-slate-100); }
.icon-btn .dot { position: absolute; top: 6px; right: 6px; width: 8px; height: 8px; border-radius: 50%; background: var(--fk-red); }

.avatar { width: 34px; height: 34px; border-radius: 50%; background: var(--fk-green); color: #fff; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 13px; overflow: hidden; }
.avatar img { width: 100%; height: 100%; object-fit: cover; }

.site-footer { background: var(--fk-black); color: #CBD5E1; padding: 48px 0 24px; margin-top: 64px; }
.site-footer a { color: #CBD5E1; }
.site-footer a:hover { color: #fff; text-decoration: none; }
.footer-grid { max-width: var(--container); margin-inline: auto; padding-inline: 20px; display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 40px; }
.footer-brand { font-size: 16px; font-weight: 800; color: #fff; letter-spacing: .02em; text-transform: uppercase; margin-bottom: 12px; }
.footer-tagline { font-size: 14px; color: #94A3B8; line-height: 1.6; }
.footer-col h4 { color: #fff; font-size: 13px; text-transform: uppercase; letter-spacing: .1em; margin-bottom: 14px; }
.footer-col ul { list-style: none; padding: 0; margin: 0; }
.footer-col li { margin-bottom: 8px; font-size: 14px; }
.footer-social { display: flex; gap: 10px; margin-top: 16px; }
.footer-social a { width: 34px; height: 34px; display: inline-flex; align-items: center; justify-content: center; border-radius: 50%; background: #1F2937; color: #fff; }
.footer-social a:hover { background: var(--fk-green); }
.footer-newsletter { display: flex; gap: 6px; margin-top: 12px; }
.footer-newsletter input { flex: 1; padding: 10px 12px; border-radius: var(--radius-sm); border: 1px solid #334155; background: #1F2937; color: #fff; font-size: 13px; }
.footer-newsletter button { padding: 10px 18px; background: var(--fk-green); color: #fff; border-radius: var(--radius-sm); font-weight: 600; font-size: 13px; }
.footer-bottom { max-width: var(--container); margin: 40px auto 0; padding: 20px; border-top: 1px solid #1F2937; display: flex; justify-content: space-between; align-items: center; font-size: 13px; color: #94A3B8; }

@media (max-width: 900px) {
  .footer-grid { grid-template-columns: 1fr 1fr; }
  .footer-bottom { flex-direction: column; gap: 8px; text-align: center; }
}

.page { min-height: 100vh; display: flex; flex-direction: column; }
.page-main { flex: 1; }

.hero { position: relative; min-height: 480px; background-size: cover; background-position: center; color: #fff; overflow: hidden; }
.hero::before { content: ""; position: absolute; inset: 0; background: linear-gradient(90deg, rgba(0,0,0,.75) 0%, rgba(0,0,0,.35) 55%, transparent 100%); }
.hero-inner { position: relative; max-width: var(--container); margin-inline: auto; padding: 80px 20px 60px; }
.hero h1 { color: #fff; font-size: clamp(32px, 5vw, 56px); max-width: 620px; margin-bottom: 16px; line-height: 1.05; }
.hero p { color: rgba(255,255,255,.85); max-width: 520px; margin-bottom: 28px; font-size: 16px; }
.hero-actions { display: flex; gap: 12px; flex-wrap: wrap; }

@media (max-width: 768px) {
  .site-nav { display: none; }
  .hero { min-height: 380px; }
  .hero-inner { padding: 48px 20px 40px; }
}

.nav-toggle { display: none; width: 38px; height: 38px; align-items: center; justify-content: center; border-radius: var(--radius-sm); }
@media (max-width: 768px) {
  .nav-toggle { display: inline-flex; }
  .site-header.open .site-nav { display: flex; flex-direction: column; position: absolute; top: var(--nav-height); left: 0; right: 0; background: #fff; padding: 16px 20px; border-bottom: 1px solid var(--color-border); box-shadow: var(--shadow-md); }
}
"""

FILES["forms.css"] = """
.form { display: grid; gap: 18px; max-width: 560px; }
.form-row { display: grid; gap: 6px; }
.form-row label { font-weight: 600; font-size: 13px; color: var(--fk-slate-700); }
.form-row label .req { color: var(--fk-red); margin-left: 2px; }
.form-row input, .form-row select, .form-row textarea { width: 100%; padding: 11px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 14px; background: #fff; transition: border-color .15s, box-shadow .15s; }
.form-row input:focus, .form-row select:focus, .form-row textarea:focus { outline: none; border-color: var(--fk-green); box-shadow: 0 0 0 3px rgba(15,81,50,.12); }
.form-row textarea { min-height: 120px; resize: vertical; }
.form-row .hint { font-size: 12px; color: var(--color-text-muted); }
.form-row .error { font-size: 12px; color: var(--fk-red); min-height: 16px; }
.form-row input.error, .form-row select.error { border-color: var(--fk-red); }
.form-actions { display: flex; gap: 12px; justify-content: flex-end; padding-top: 8px; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
@media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }

.auth-card { max-width: 440px; margin: 48px auto; padding: 32px; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-md); box-shadow: var(--shadow-sm); }
.auth-card h1 { font-size: 24px; margin-bottom: 6px; }
.auth-card p.sub { color: var(--color-text-muted); margin-bottom: 24px; font-size: 14px; }
.auth-card .form { max-width: none; }
.auth-card .form-actions { justify-content: stretch; }
.auth-card .form-actions .btn { width: 100%; }
.auth-card .alt { margin-top: 20px; text-align: center; font-size: 14px; color: var(--color-text-muted); }
"""

FILES["tables.css"] = """
.table-wrap { overflow-x: auto; border: 1px solid var(--color-border); border-radius: var(--radius-md); background: #fff; }
table.data { width: 100%; border-collapse: collapse; font-size: 14px; }
table.data th, table.data td { padding: 12px 16px; text-align: left; border-bottom: 1px solid var(--color-border); white-space: nowrap; }
table.data th { background: var(--fk-slate-50); font-weight: 700; font-size: 11px; text-transform: uppercase; letter-spacing: .06em; color: var(--fk-slate-500); }
table.data tbody tr:hover { background: var(--fk-slate-50); }
table.data tbody tr:last-child td { border-bottom: 0; }
.status { display: inline-block; padding: 3px 10px; border-radius: var(--radius-pill); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .04em; }
.status-active, .status-approved, .status-confirmed, .status-completed { background: var(--fk-green-100); color: var(--fk-green-600); }
.status-pending, .status-scheduled { background: #FEF3C7; color: #92400E; }
.status-rejected, .status-declined, .status-cancelled, .status-failed { background: var(--fk-red-100); color: var(--fk-red-600); }
.status-draft, .status-archived { background: var(--fk-slate-100); color: var(--fk-slate-700); }
"""

FILES["dashboard.css"] = """
.dashboard { display: grid; grid-template-columns: 240px 1fr; min-height: calc(100vh - var(--nav-height)); }
.dashboard-sidebar { background: #0F172A; color: #CBD5E1; padding: 20px 0; position: sticky; top: var(--nav-height); align-self: start; height: calc(100vh - var(--nav-height)); overflow-y: auto; }
.dashboard-sidebar .brand-slot { padding: 0 20px 20px; font-size: 11px; letter-spacing: .1em; text-transform: uppercase; color: #64748B; }
.dashboard-sidebar a { display: flex; align-items: center; gap: 10px; padding: 10px 20px; color: #CBD5E1; text-decoration: none; font-size: 14px; border-left: 3px solid transparent; transition: background .12s; }
.dashboard-sidebar a:hover { background: #1E293B; color: #fff; }
.dashboard-sidebar a.active { background: #1E293B; color: #fff; border-left-color: var(--fk-green); font-weight: 600; }
.dashboard-sidebar .group-title { padding: 18px 20px 8px; font-size: 11px; text-transform: uppercase; letter-spacing: .1em; color: #64748B; }
.dashboard-main { padding: 32px; background: var(--fk-slate-50); }
.dashboard-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; gap: 16px; flex-wrap: wrap; }
.dashboard-header h1 { margin: 0; font-size: 24px; font-weight: 700; }
.dashboard-header p.sub { color: var(--color-text-muted); font-size: 14px; margin-top: 2px; }
.dashboard-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px; }
.stat-card { background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; }
.stat-card .label { font-size: 12px; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: .05em; margin-bottom: 8px; }
.stat-card .value { font-size: 28px; font-weight: 800; color: var(--fk-ink); line-height: 1; }
.stat-card .delta { font-size: 12px; color: var(--fk-green-600); margin-top: 4px; font-weight: 600; }
.stat-card .icon { width: 40px; height: 40px; border-radius: var(--radius-sm); background: var(--fk-green-100); color: var(--fk-green-600); display: inline-flex; align-items: center; justify-content: center; flex-shrink: 0; }
.panel { background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; margin-bottom: 16px; }
.panel h3 { margin-bottom: 14px; font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: .05em; color: var(--fk-slate-700); }

@media (max-width: 900px) {
  .dashboard { grid-template-columns: 1fr; }
  .dashboard-sidebar { position: static; height: auto; display: flex; overflow-x: auto; padding: 8px 0; }
  .dashboard-sidebar .group-title { display: none; }
  .dashboard-sidebar a { white-space: nowrap; border-left: 0; border-bottom: 3px solid transparent; }
  .dashboard-sidebar a.active { border-left: 0; border-bottom-color: var(--fk-green); }
  .dashboard-main { padding: 20px; }
}
"""

FILES["sports.css"] = """
.fixture { display: grid; grid-template-columns: auto 1fr auto 1fr auto; gap: 14px; align-items: center; padding: 14px 18px; background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-md); margin-bottom: 10px; }
.fixture .team { display: flex; align-items: center; gap: 10px; font-weight: 600; }
.fixture .team img { width: 28px; height: 28px; border-radius: 50%; object-fit: cover; }
.fixture .vs { padding: 6px 12px; background: var(--fk-slate-100); border-radius: var(--radius-sm); font-size: 12px; font-weight: 700; color: var(--fk-slate-700); min-width: 48px; text-align: center; }
.fixture .score { font-size: 18px; font-weight: 800; letter-spacing: .02em; min-width: 48px; text-align: center; }
.fixture .meta { font-size: 12px; color: var(--color-text-muted); }

table.standings th:nth-child(1), table.standings td:nth-child(1) { width: 40px; text-align: center; }
table.standings td:nth-child(1) { font-weight: 700; }
table.standings td.num { text-align: right; font-variant-numeric: tabular-nums; }
table.standings tbody tr.qualify-1 { border-left: 3px solid var(--fk-green-500); }
table.standings tbody tr.qualify-2 { border-left: 3px solid var(--fk-green-100); }

.bracket { display: grid; gap: 24px; }
.bracket-round { display: grid; gap: 12px; }
.bracket-match { padding: 12px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: #fff; font-size: 13px; }

.group-block { border: 1px solid var(--color-border); border-radius: var(--radius-md); background: #fff; overflow: hidden; }
.group-block .group-header { padding: 12px 16px; background: var(--fk-slate-50); font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: .05em; }
.group-block ul { list-style: none; padding: 0; margin: 0; }
.group-block li { padding: 10px 16px; border-top: 1px solid var(--color-border); display: flex; justify-content: space-between; }
"""

FILES["marketplace.css"] = """
.product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 20px; }
.product-card { background: #fff; border: 1px solid var(--color-border); border-radius: var(--radius-md); overflow: hidden; display: flex; flex-direction: column; transition: box-shadow .15s, transform .15s; }
.product-card:hover { box-shadow: var(--shadow-md); transform: translateY(-2px); }
.product-card .media { aspect-ratio: 1/1; background: var(--fk-slate-100); overflow: hidden; }
.product-card .media img { width: 100%; height: 100%; object-fit: cover; }
.product-card .info { padding: 14px; flex: 1; display: flex; flex-direction: column; }
.product-card .name { font-weight: 600; font-size: 14px; margin-bottom: 4px; }
.product-card .vendor { font-size: 12px; color: var(--color-text-muted); margin-bottom: 8px; }
.product-card .price { font-weight: 800; color: var(--fk-ink); font-size: 16px; margin-top: auto; }
.product-card .actions { padding: 12px 14px; border-top: 1px solid var(--color-border); display: flex; gap: 8px; }

.cart-line { display: grid; grid-template-columns: 80px 1fr auto auto; gap: 16px; align-items: center; padding: 14px 0; border-bottom: 1px solid var(--color-border); }
.cart-line img { width: 80px; height: 80px; object-fit: cover; border-radius: var(--radius-sm); }
.cart-summary { background: var(--fk-slate-50); border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: 20px; position: sticky; top: calc(var(--nav-height) + 20px); }
.cart-summary .row-line { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; }
.cart-summary .row-line.total { border-top: 1px solid var(--color-border); margin-top: 10px; padding-top: 12px; font-size: 18px; font-weight: 800; }
"""

FILES["advertising.css"] = """
.ad-banner { position: relative; border-radius: var(--radius-md); overflow: hidden; background: linear-gradient(135deg, var(--fk-green) 0%, #0B3B23 100%); color: #fff; padding: 28px; display: flex; justify-content: space-between; align-items: center; gap: 20px; min-height: 140px; }
.ad-banner h3 { color: #fff; font-size: 22px; margin-bottom: 6px; }
.ad-banner p { color: rgba(255,255,255,.85); }
.sponsored-label { position: absolute; top: 10px; right: 10px; background: rgba(0,0,0,.4); color: #fff; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: .1em; padding: 3px 8px; border-radius: var(--radius-pill); }
.ad-slot { margin-block: 24px; }
.ad-slot[data-empty="true"] { display: none; }
.sponsor-strip { display: flex; flex-wrap: wrap; gap: 20px; align-items: center; justify-content: center; padding: 20px 0; }
.sponsor-strip img { max-height: 44px; opacity: .7; transition: opacity .15s; }
.sponsor-strip img:hover { opacity: 1; }
"""

FILES["admin.css"] = """
.admin-toolbar { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; flex-wrap: wrap; }
.admin-toolbar .search { flex: 1; min-width: 220px; padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); font-size: 14px; background: #fff; }
.admin-toolbar select { padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm); background: #fff; font-size: 14px; }
.admin-actions { display: flex; gap: 6px; }
.deployment-row { display: grid; grid-template-columns: 80px 1fr auto; gap: 14px; align-items: center; padding: 12px 0; border-bottom: 1px solid var(--color-border); }
.deployment-row .version { font-weight: 700; font-size: 13px; }
.deployment-row .env { display: inline-block; padding: 2px 8px; border-radius: var(--radius-pill); font-size: 11px; font-weight: 600; background: var(--fk-slate-100); color: var(--fk-slate-700); }
"""

FILES["animations.css"] = """
@keyframes fkSpin { to { transform: rotate(360deg); } }
@keyframes fkToastIn { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
@keyframes fkFadeIn { from { opacity: 0; } to { opacity: 1; } }
.fade-in { animation: fkFadeIn .3s ease both; }
"""

FILES["responsive.css"] = """
@media (max-width: 1024px) { :root { --container: 100%; } }
@media (max-width: 768px) {
  h1 { font-size: 30px; }
  h2 { font-size: 22px; }
  .section { padding-block: 36px; }
  .stat-strip .stat { border-right: 0; border-bottom: 1px solid var(--color-border); }
  .stat-strip .stat:last-child { border-bottom: 0; }
}
@media (max-width: 480px) {
  .container { padding-inline: 16px; }
  .btn { padding: 10px 16px; font-size: 13px; }
}
"""

FILES["navigation.css"] = """
.breadcrumbs { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--color-text-muted); padding: 14px 0; }
.breadcrumbs a { color: var(--fk-slate-700); }
.breadcrumbs .current { color: var(--fk-ink); font-weight: 600; }
.breadcrumbs .sep { color: var(--fk-slate-300); }
.mobile-drawer-toggle { display: none; width: 40px; height: 40px; align-items: center; justify-content: center; }
@media (max-width: 768px) { .mobile-drawer-toggle { display: inline-flex; } }
"""

FILES["style.css"] = """
@import "variables.css";
@import "reset.css";
@import "base.css";
@import "layout.css";
@import "components.css";
@import "forms.css";
@import "tables.css";
@import "navigation.css";
@import "sports.css";
@import "marketplace.css";
@import "advertising.css";
@import "dashboard.css";
@import "admin.css";
@import "animations.css";
@import "responsive.css";
"""

for name, content in FILES.items():
    path = CSS_DIR / name
    path.write_text(content.strip() + "\n", encoding="utf-8")
    print(f"  wrote {name:24s} ({len(content)} bytes)")

print()
print(f"Done. {len(FILES)} files written to {CSS_DIR}")