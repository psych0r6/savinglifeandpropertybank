import { useState, useEffect, useRef, useCallback } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, CartesianGrid
} from "recharts";

/* ─── THEME TOKENS ─────────────────────────────────────────── */
const TOKENS = {
  light: {
    bg:        "#FAFAF8",
    bgAlt:     "#F4F3EF",
    surface:   "#FFFFFF",
    surfaceAlt:"#F8F7F3",
    border:    "rgba(0,0,0,0.08)",
    borderStrong:"rgba(0,0,0,0.14)",
    text:      "#0F0F0E",
    textSub:   "#6B6860",
    textMuted: "#A09E98",
    gold:      "#B8860B",
    goldLight: "#D4A017",
    goldBg:    "#FBF4E3",
    goldBorder:"rgba(184,134,11,0.25)",
    green:     "#1A6B3C",
    greenBg:   "#EBF5EE",
    red:       "#B91C1C",
    redBg:     "#FEE2E2",
    blue:      "#1D4ED8",
    shadow:    "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
    shadowMd:  "0 4px 12px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
    shadowLg:  "0 10px 40px rgba(0,0,0,0.10), 0 4px 12px rgba(0,0,0,0.06)",
    nav:       "#FFFFFF",
    navBorder: "rgba(0,0,0,0.08)",
    activeNav: "#FBF4E3",
    chartGrid: "rgba(0,0,0,0.05)",
    tooltipBg: "#FFFFFF",
  },
  dark: {
    bg:        "#0C0C0A",
    bgAlt:     "#111110",
    surface:   "#181816",
    surfaceAlt:"#1E1E1B",
    border:    "rgba(255,255,255,0.07)",
    borderStrong:"rgba(255,255,255,0.12)",
    text:      "#F0EDE8",
    textSub:   "#8C8980",
    textMuted: "#5A5855",
    gold:      "#D4A017",
    goldLight: "#E8B824",
    goldBg:    "#1C1608",
    goldBorder:"rgba(212,160,23,0.2)",
    green:     "#34D399",
    greenBg:   "#052E1A",
    red:       "#F87171",
    redBg:     "#2A0A0A",
    blue:      "#60A5FA",
    shadow:    "0 1px 3px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)",
    shadowMd:  "0 4px 12px rgba(0,0,0,0.4), 0 2px 6px rgba(0,0,0,0.3)",
    shadowLg:  "0 10px 40px rgba(0,0,0,0.5), 0 4px 12px rgba(0,0,0,0.3)",
    nav:       "#181816",
    navBorder: "rgba(255,255,255,0.07)",
    activeNav: "#1C1608",
    chartGrid: "rgba(255,255,255,0.04)",
    tooltipBg: "#1E1E1B",
  }
};

/* ─── GLOBAL CSS ────────────────────────────────────────────── */
const buildCSS = (T) => `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  
  html {
    height: 100%;
    height: -webkit-fill-available;
    height: 100dvh;
  }
  body {
    margin: 0; padding: 0;
    min-height: 100vh;
    min-height: -webkit-fill-available;
    min-height: 100dvh;
    width: 100%;
    -webkit-text-size-adjust: 100%;
    overflow: hidden;
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
  }
  #root {
    height: 100vh;
    height: 100dvh;
    width: 100%;
    overflow: hidden;
  }
  
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
  
  .slb { font-family: 'Inter', sans-serif; }
  .slb-serif { font-family: 'Playfair Display', serif; }
  .slb-mono { font-family: 'DM Mono', monospace; }
  .slb-balance { font-family: 'Inter', sans-serif; font-variant-numeric: tabular-nums; letter-spacing: -0.04em; font-weight: 700; }
  
  /* ── DESKTOP: sidebar visible, no bottom nav ── */
  @media (min-width: 769px) {
    .mobile-bottom-nav { display: none !important; }
    .mobile-sidebar-overlay { display: none !important; }
  }

  /* ── MOBILE: bulletproof layout ── */
  @media (max-width: 768px) {
    .mobile-bottom-nav {
      display: flex !important;
      position: fixed !important;
      bottom: 0 !important; left: 0 !important; right: 0 !important;
      width: 100% !important; z-index: 100 !important;
      padding-bottom: env(safe-area-inset-bottom, 0px) !important;
      padding-top: 6px !important;
    }
    .main-content {
      padding-left: 14px !important;
      padding-right: 14px !important;
      padding-top: 16px !important;
      padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)) !important;
    }
    .topbar-search { display: none !important; }
    .topbar-user-name { display: none !important; }
    .stat-cards-row { flex-direction: column !important; gap: 10px !important; }
    .stat-cards-row > div { min-width: unset !important; width: 100% !important; }
    .chart-grid-2 { grid-template-columns: 1fr !important; }
    .chart-grid-3 { grid-template-columns: 1fr !important; }
    .grid-2col { grid-template-columns: 1fr !important; }
    .grid-2col-inv { grid-template-columns: 1fr !important; }
    .hero-balance-row { flex-direction: column !important; gap: 12px !important; }
    .hero-balance-right { text-align: left !important; }
    .card-page-grid { grid-template-columns: 1fr !important; }
    .transfers-grid { grid-template-columns: 1fr !important; }
    .help-grid { grid-template-columns: 1fr !important; }
    .settings-grid { grid-template-columns: 1fr !important; }
    .help-contact-grid { grid-template-columns: 1fr !important; }
    .txn-table-header { display: none !important; }
    .txn-table-row { grid-template-columns: 36px 1fr auto !important; }
    .txn-table-row .txn-date { display: none !important; }
    .txn-table-row .txn-cat { display: none !important; }
    .txn-table-row .txn-status { display: none !important; }
    .bal-amount { font-size: 34px !important; }
    .bal-cents { font-size: 26px !important; }
    .hero-balance-card { padding: 20px 18px !important; }
    .page-title { font-size: 19px !important; }
  }

  @media (max-width: 400px) {
    .main-content {
      padding-left: 10px !important;
      padding-right: 10px !important;
      padding-top: 12px !important;
      padding-bottom: calc(72px + env(safe-area-inset-bottom, 0px)) !important;
    }
    .bal-amount { font-size: 28px !important; }
  }
  
  .fade-in { animation: fadeIn 0.35s ease; }
  @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
  
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px; cursor: pointer;
    font-size: 13.5px; font-weight: 400; color: ${T.textSub};
    transition: background 0.15s, color 0.15s; user-select: none;
    border-left: 2px solid transparent; font-family: 'Inter', sans-serif;
  }
  .nav-item:hover { background: ${T.surfaceAlt}; color: ${T.text}; }
  .nav-item.active { background: ${T.activeNav}; color: ${T.gold}; border-left-color: ${T.gold}; font-weight: 500; }
  
  .card {
    background: ${T.surface}; border: 1px solid ${T.border};
    border-radius: 12px; box-shadow: ${T.shadow};
  }
  .card-elevated {
    background: ${T.surface}; border: 1px solid ${T.borderStrong};
    border-radius: 14px; box-shadow: ${T.shadowMd};
  }
  
  .btn-primary {
    background: ${T.gold}; color: #FFFFFF; border: none;
    padding: 10px 20px; border-radius: 8px; font-size: 13px;
    font-weight: 500; cursor: pointer; font-family: 'Inter', sans-serif;
    transition: opacity 0.15s, transform 0.1s; letter-spacing: 0.01em;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  
  .btn-secondary {
    background: transparent; color: ${T.textSub};
    border: 1px solid ${T.border}; padding: 9px 18px;
    border-radius: 8px; font-size: 13px; font-weight: 400;
    cursor: pointer; font-family: 'Inter', sans-serif;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .btn-secondary:hover { background: ${T.surfaceAlt}; border-color: ${T.borderStrong}; color: ${T.text}; }
  
  .input-field {
    width: 100%; background: ${T.surfaceAlt}; border: 1px solid ${T.border};
    border-radius: 8px; padding: 10px 13px; font-size: 13.5px;
    color: ${T.text}; outline: none; font-family: 'Inter', sans-serif;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .input-field:focus { border-color: ${T.gold}; box-shadow: 0 0 0 3px ${T.goldBorder}; }
  .input-field::placeholder { color: ${T.textMuted}; }
  
  .pill-badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 9px; border-radius: 20px;
    font-size: 11.5px; font-weight: 500; letter-spacing: 0.01em;
  }
  .badge-green { background: ${T.greenBg}; color: ${T.green}; }
  .badge-red { background: ${T.redBg}; color: ${T.red}; }
  .badge-gold { background: ${T.goldBg}; color: ${T.gold}; }
  
  .table-row {
    display: grid; align-items: center; padding: 12px 20px;
    border-bottom: 1px solid ${T.border}; transition: background 0.12s; cursor: pointer;
  }
  .table-row:hover { background: ${T.surfaceAlt}; }
  .table-row:last-child { border-bottom: none; }
  
  .divider { border: none; border-top: 1px solid ${T.border}; }
  
  .tag-filter {
    padding: 6px 14px; border-radius: 20px; font-size: 12px;
    font-weight: 500; cursor: pointer; border: 1px solid ${T.border};
    background: transparent; color: ${T.textSub};
    font-family: 'Inter', sans-serif; transition: all 0.15s;
  }
  .tag-filter:hover { border-color: ${T.goldBorder}; color: ${T.gold}; background: ${T.goldBg}; }
  .tag-filter.active { background: ${T.gold}; color: #fff; border-color: ${T.gold}; }
  
  .hover-lift { transition: transform 0.2s, box-shadow 0.2s; cursor: pointer; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: ${T.shadowMd}; }
  
  .toggle-track {
    width: 44px; height: 24px; border-radius: 12px; cursor: pointer;
    position: relative; transition: background 0.2s; flex-shrink: 0;
  }
  .toggle-thumb {
    position: absolute; top: 3px; width: 18px; height: 18px;
    border-radius: 50%; background: #fff; transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0,0,0,0.2);
  }
  
  .mobile-bottom-nav {
    position: fixed;
    bottom: 0; left: 0; right: 0;
    z-index: 100;
    background: ${T.nav};
    border-top: 1px solid ${T.navBorder};
    padding-top: 7px;
    padding-bottom: max(env(safe-area-inset-bottom, 0px), 8px);
    justify-content: space-around;
    align-items: center;
    width: 100%;
  }
`;

/* ─── TIME UTILS ────────────────────────────────────────────── */
function getUSEasternHour() {
  const now = new Date();
  const etStr = now.toLocaleString("en-US", {
    timeZone: "America/New_York", hour: "numeric", hour12: false
  });
  return parseInt(etStr, 10);
}
function getGreeting() {
  const h = getUSEasternHour();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  return "Good evening";
}
function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  });
}
function formatTime(date) {
  return date.toLocaleTimeString("en-US", {
    timeZone: "America/New_York",
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true
  });
}
function useLiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
}

/* ─── BRAND MARK ────────────────────────────────────────────── */
const BrandMark = ({ size = 36 }) => {
  const h = size * 1.15;
  return (
    <svg width={size} height={h} viewBox="0 0 100 115" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shieldGold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E8C96A"/>
          <stop offset="30%" stopColor="#C9A84C"/>
          <stop offset="65%" stopColor="#B8860B"/>
          <stop offset="100%" stopColor="#8B6510"/>
        </linearGradient>
        <linearGradient id="shieldNavy" x1="0%" y1="0%" x2="60%" y2="100%">
          <stop offset="0%" stopColor="#1A3A6B"/>
          <stop offset="100%" stopColor="#0D2154"/>
        </linearGradient>
        <linearGradient id="goldText" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0D978"/>
          <stop offset="50%" stopColor="#D4A017"/>
          <stop offset="100%" stopColor="#9A7010"/>
        </linearGradient>
        <filter id="shieldShadow" x="-10%" y="-5%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#00000040"/>
        </filter>
      </defs>
      <path d="M50 3 L95 18 L95 58 Q95 90 50 112 Q5 90 5 58 L5 18 Z" fill="url(#shieldGold)" filter="url(#shieldShadow)"/>
      <path d="M50 9 L90 22 L90 58 Q90 87 50 107 Q10 87 10 58 L10 22 Z" fill="url(#shieldNavy)"/>
      <path d="M50 12 L87 24 L87 58 Q87 85 50 104 Q13 85 13 58 L13 24 Z" fill="none" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.35"/>
      <text x="32" y="58" fontSize="36" fontWeight="700" fill="url(#goldText)" fontFamily="Georgia, 'Times New Roman', serif" letterSpacing="-1">S</text>
      <text x="55" y="54" fontSize="28" fontWeight="700" fill="#FFFFFF" fontFamily="Georgia, 'Times New Roman', serif" letterSpacing="0" opacity="0.95">L</text>
      <path d="M28 72 L50 56 L72 72" stroke="#C9A84C" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M34 72 L34 84 L66 84 L66 72" stroke="#C9A84C" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      <rect x="44" y="74" width="12" height="10" rx="1" stroke="#C9A84C" strokeWidth="1.5" fill="none"/>
      <line x1="50" y1="74" x2="50" y2="84" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.6"/>
      <line x1="44" y1="79" x2="56" y2="79" stroke="#C9A84C" strokeWidth="1" strokeOpacity="0.6"/>
      <path d="M22 82 Q36 92 50 90 Q64 92 78 82" stroke="white" strokeWidth="3.5" fill="none" strokeLinecap="round" opacity="0.9"/>
      <path d="M22 82 Q18 80 20 77" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85"/>
      <path d="M78 82 Q82 80 80 77" stroke="white" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.85"/>
    </svg>
  );
};

/* ─── STATIC DATA ───────────────────────────────────────────── */
// No "salary" term used anywhere — replaced with professional alternatives
const TXNS = [
  { id:1,  name:"Apple Store",            type:"debit",  amount:-1299.00, date:"Jun 14, 2026", cat:"Shopping",     ref:"TXN-2026-0114", status:"Settled" },
  { id:2,  name:"Wire Transfer Out — Sarah Johnson", type:"debit", amount:-2500.00, date:"Jun 12, 2026", cat:"Transfer", ref:"TXN-2026-0113", status:"Settled" },
  { id:3,  name:"Incoming Wire Transfer", type:"credit", amount:52000.00, date:"Jun 10, 2026", cat:"Transfer",     ref:"TXN-2026-0112", status:"Settled" },
  { id:4,  name:"Netflix",                type:"debit",  amount:-15.99,   date:"Jun 9, 2026",  cat:"Entertainment",ref:"TXN-2026-0111", status:"Settled" },
  { id:5,  name:"Monthly Remuneration",   type:"credit", amount:18500.00, date:"Jun 5, 2026",  cat:"Income",       ref:"TXN-2026-0109", status:"Settled" },
  { id:6,  name:"Wire Transfer Out — David Brown",   type:"debit", amount:-7800.00, date:"Jun 3, 2026", cat:"Transfer", ref:"TXN-2026-0108", status:"Settled" },
  { id:7,  name:"Amazon",                 type:"debit",  amount:-245.60,  date:"Jun 1, 2026",  cat:"Shopping",     ref:"TXN-2026-0107", status:"Settled" },
  { id:8,  name:"Dividend Payment",       type:"credit", amount:3240.00,  date:"May 29, 2026", cat:"Investment",   ref:"TXN-2026-0106", status:"Settled" },
  { id:9,  name:"Marriott New York",      type:"debit",  amount:-890.00,  date:"May 27, 2026", cat:"Travel",       ref:"TXN-2026-0105", status:"Settled" },
  { id:10, name:"Consulting Fee",         type:"credit", amount:5500.00,  date:"May 24, 2026", cat:"Income",       ref:"TXN-2026-0104", status:"Settled" },
  { id:11, name:"Gold's Gym",             type:"debit",  amount:-120.00,  date:"May 21, 2026", cat:"Health",       ref:"TXN-2026-0103", status:"Settled" },
  { id:12, name:"Wire Transfer In — Consulting Retainer", type:"credit", amount:9200.00, date:"May 18, 2026", cat:"Transfer", ref:"TXN-2026-0102", status:"Settled" },
  { id:13, name:"Whole Foods Market",     type:"debit",  amount:-186.42,  date:"May 16, 2026", cat:"Shopping",     ref:"TXN-2026-0101", status:"Settled" },
  { id:14, name:"Spotify Premium",        type:"debit",  amount:-11.99,   date:"May 14, 2026", cat:"Entertainment",ref:"TXN-2026-0100", status:"Settled" },
];
const BALANCE_TREND = [
  {m:"Dec",v:590000},{m:"Jan",v:618000},{m:"Feb",v:645000},{m:"Mar",v:629000},
  {m:"Apr",v:682000},{m:"May",v:718000},{m:"Jun",v:765465},
];
const CASHFLOW = [
  {d:"Mon",out:1200,in:0},{d:"Tue",out:300,in:52000},{d:"Wed",out:890,in:0},
  {d:"Thu",out:245,in:18500},{d:"Fri",out:1299,in:0},{d:"Sat",out:160,in:0},{d:"Sun",out:0,in:3240},
];
const PIE_DATA = [
  {name:"Equities",v:45,hex:"#B8860B"},{name:"Fixed Income",v:25,hex:"#1D4ED8"},
  {name:"Alternatives",v:15,hex:"#1A6B3C"},{name:"Real Assets",v:15,hex:"#6D28D9"},
];
const INV_TREND = [
  {m:"Q1 '24",v:180000},{m:"Q2 '24",v:195000},{m:"Q3 '24",v:188000},{m:"Q4 '24",v:210000},
  {m:"Q1 '25",v:225000},{m:"Q2 '25",v:248000},{m:"Q3 '25",v:235000},{m:"Q4 '25",v:268000},
  {m:"Q1 '26",v:285000},{m:"Q2 '26",v:312000},
];
const BENEFICIARIES = [
  {name:"Sarah Johnson",  bank:"JPMorgan Chase",  acc:"••••4521", initials:"SJ", color:"#6D28D9"},
  {name:"Michael Chen",   bank:"Wells Fargo",     acc:"••••8834", initials:"MC", color:"#1D4ED8"},
  {name:"Emma Williams",  bank:"Citibank",        acc:"••••2290", initials:"EW", color:"#1A6B3C"},
  {name:"David Brown",    bank:"Bank of America", acc:"••••6677", initials:"DB", color:"#B8860B"},
];

/* ─── ICON COMPONENTS ───────────────────────────────────────── */
const Icon = ({ name, size = 16, color = "currentColor", style = {} }) => {
  const paths = {
    home:        "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6",
    list:        "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2",
    card:        "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
    transfer:    "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
    chart:       "M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z",
    settings:    "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    help:        "M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    bell:        "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    sun:         "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z",
    moon:        "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z",
    eye:         "M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z",
    eyeOff:      "M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21",
    lock:        "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
    menu:        "M4 6h16M4 12h16M4 18h16",
    search:      "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    send:        "M12 19l9 2-9-18-9 18 9-2zm0 0v-8",
    plus:        "M12 4v16m8-8H4",
    check:       "M5 13l4 4L19 7",
    arrow:       "M17 8l4 4m0 0l-4 4m4-4H3",
    shield:      "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z",
    building:    "M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4",
    coins:       "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    trend:       "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
    downtrend:   "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6",
    user:        "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
    portfolio:   "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    dollar:      "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
    phone:       "M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z",
    mail:        "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
    chat:        "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
    doc:         "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z",
    globe:       "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
    location:    "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z",
    arrowLeft:   "M10 19l-7-7m0 0l7-7m-7 7h18",
    x:           "M6 18L18 6M6 6l12 12",
    dots:        "M5 12h.01M12 12h.01M19 12h.01",
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={style}>
      {(paths[name] || "").split(" M").map((d, i) => (
        <path key={i} d={i === 0 ? d : "M" + d} />
      ))}
    </svg>
  );
};

const IconCircle = ({ iconName, size = 38, T }) => (
  <div style={{
    width: size, height: size, borderRadius: size/2,
    background: T.goldBg, border: `1px solid ${T.goldBorder}`,
    display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
  }}>
    <Icon name={iconName} size={size * 0.44} color={T.gold} />
  </div>
);

/* ─── MERCHANT LOGOS ────────────────────────────────────────── */
// Recognizable brand marks rendered as simple inline SVGs for transaction rows.
const MERCHANT_LOGOS = {
  netflix: (sz) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#000000"/>
      <path d="M8 3 L8 21 L10.8 21 L10.8 12 L14 21 L16.8 21 L16.8 3 L14 3 L14 12.2 L10.9 3 Z" fill="#E50914"/>
    </svg>
  ),
  spotify: (sz) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="12" fill="#1ED760"/>
      <path d="M6.5 9.6c3.2-.9 6.7-.7 9.6 1 .3.2.4.6.2.9-.2.3-.6.4-.9.2-2.6-1.5-5.7-1.7-8.5-.9-.4.1-.7-.1-.8-.4-.1-.4.1-.7.4-.8zm-.2 2.6c2.7-.8 5.7-.6 8.2.8.3.2.4.5.2.8-.2.3-.5.4-.8.2-2.2-1.2-4.9-1.4-7.2-.7-.3.1-.6-.1-.7-.4-.1-.3.1-.6.3-.7zm-.2 2.5c2.3-.6 4.8-.5 6.9.7.2.1.3.4.2.6-.1.2-.4.3-.6.2-1.9-1-4.1-1.1-6.1-.6-.2.1-.5-.1-.5-.3-.1-.2.1-.5.1-.6z" fill="#000"/>
    </svg>
  ),
  amazon: (sz) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#131921"/>
      <text x="4.2" y="14" fontFamily="Arial, sans-serif" fontSize="11" fontWeight="700" fill="#FFFFFF">amazon</text>
      <path d="M5 17 C9 19.5 15 19.5 19 17" stroke="#FF9900" strokeWidth="1.6" fill="none" strokeLinecap="round"/>
      <path d="M18 16.3 L19.2 16 L19.6 17.1 Z" fill="#FF9900"/>
    </svg>
  ),
  apple: (sz) => (
    <svg width={sz} height={sz} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <rect width="24" height="24" rx="5" fill="#000000"/>
      <path transform="translate(5.5,4) scale(0.56)" fill="#FFFFFF" d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.12 0-.23-.02-.3-.03-.014-.07-.04-.23-.04-.4 0-1.13.55-2.27 1.23-3.06.74-.86 2.03-1.55 3.07-1.6.015.13.03.28.03.44zm4.565 15.71c-.03.07-.463 1.58-1.518 3.12-.972 1.42-1.99 2.84-3.55 2.87-1.52.03-2.01-.89-3.75-.89-1.73 0-2.28.86-3.72.92-1.5.06-2.64-1.52-3.62-2.93-1.95-2.84-3.45-8.04-1.44-11.55.99-1.74 2.77-2.84 4.7-2.87 1.5-.03 2.91.99 3.75.99.83 0 2.5-1.22 4.22-1.04.72.03 2.74.29 4.04 2.2-.1.07-2.41 1.4-2.38 4.18.03 3.33 2.93 4.45 2.97 4.46z"/>
    </svg>
  ),
};
function getMerchantLogo(name) {
  const n = name.toLowerCase();
  if (n.includes("netflix")) return MERCHANT_LOGOS.netflix;
  if (n.includes("spotify")) return MERCHANT_LOGOS.spotify;
  if (n.includes("amazon")) return MERCHANT_LOGOS.amazon;
  if (n.includes("apple")) return MERCHANT_LOGOS.apple;
  return null;
}
const TxnIcon = ({ txn, size = 16, T }) => {
  const logo = getMerchantLogo(txn.name);
  if (logo) return <div style={{ width: size, height: size, borderRadius: size * 0.28, overflow: "hidden" }}>{logo(size)}</div>;
  return <Icon name={txn.type === "credit" ? "dollar" : "card"} size={size} color={T.gold} />;
};

const Avatar = ({ initials, color, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: size / 2,
    background: color + "18", border: `1px solid ${color}30`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.33, fontWeight: 500, color, flexShrink: 0,
    fontFamily: "Inter, sans-serif"
  }}>{initials}</div>
);

/* ─── STAT CARD ─────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon, trend, T }) => (
  <div className="card hover-lift" style={{ padding: "18px 20px", flex: 1, minWidth: 160 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <span style={{ fontSize: 11, fontWeight: 500, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      <IconCircle iconName={icon} size={34} T={T} />
    </div>
    <div style={{ fontSize: 22, fontWeight: 700, color: T.text, fontFamily: "Inter, sans-serif", letterSpacing: "-0.02em" }}>{value}</div>
    {sub && (
      <div style={{ fontSize: 12, marginTop: 5, color: trend === "up" ? T.green : trend === "down" ? T.red : T.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
        {trend === "up" && <Icon name="trend" size={12} color={T.green} />}
        {trend === "down" && <Icon name="downtrend" size={12} color={T.red} />}
        {sub}
      </div>
    )}
  </div>
);

/* ─── CUSTOM TOOLTIP ─────────────────────────────────────────── */
const CustomTooltip = ({ active, payload, label, T, prefix = "$" }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: T.tooltipBg, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 14px", boxShadow: T.shadowMd }}>
      <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ fontSize: 13, fontWeight: 500, color: p.color || T.text, fontFamily: "DM Mono" }}>
          {prefix}{typeof p.value === "number" ? p.value.toLocaleString("en-US", { minimumFractionDigits: 0 }) : p.value}
        </div>
      ))}
    </div>
  );
};

/* ─── LOGIN ─────────────────────────────────────────────────── */
function LoginPage({ username, setUsername, password, setPassword, rememberMe, setRememberMe, loading, onLogin, T }) {
  const [showPw, setShowPw] = useState(false);
  const now = useLiveClock();
  return (
    <div className="slb" style={{ minHeight: "100dvh", background: T.bgAlt, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight}, ${T.gold})`, zIndex: 10 }} />

      <div className="fade-in" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <BrandMark size={80} />
          </div>
          <div className="slb-serif" style={{ fontSize: 22, color: "#1A3A6B", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Saving Life
          </div>
          <div style={{ fontSize: 12, color: T.gold, letterSpacing: "0.18em", fontWeight: 600, textTransform: "uppercase", margin: "2px 0" }}>
            — and property —
          </div>
          <div className="slb-serif" style={{ fontSize: 20, color: "#1A3A6B", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Bank
          </div>
          <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.18em", marginTop: 5, textTransform: "uppercase" }}>
            Securing Today, Empowering Tomorrow
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "36px 32px", boxShadow: T.shadowLg }}>
          <div style={{ marginBottom: 28 }}>
            <div className="slb-serif" style={{ fontSize: 18, fontWeight: 600, color: T.text }}>Welcome back</div>
            <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>{formatDate(now)} · {formatTime(now)} ET</div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.textSub, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>Username / Email</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <Icon name="user" size={16} color={T.textMuted} />
              </div>
              <input className="input-field" type="text" value={username} onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username" style={{ paddingLeft: 36 }} />
            </div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.textSub, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>Password</label>
            <div style={{ position: "relative" }}>
              <div style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }}>
                <Icon name="lock" size={16} color={T.textMuted} />
              </div>
              <input className="input-field" type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                placeholder="Enter your password" style={{ paddingLeft: 36, paddingRight: 40 }} />
              <button onClick={() => setShowPw(!showPw)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: T.textMuted, display: "flex", padding: 0 }}>
                <Icon name={showPw ? "eyeOff" : "eye"} size={16} />
              </button>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: T.textSub }}>
              <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)} style={{ accentColor: T.gold, width: 14, height: 14 }} />
              Remember me
            </label>
            <span style={{ fontSize: 13, color: T.gold, cursor: "pointer", fontWeight: 500 }}>Forgot Password?</span>
          </div>

          <button className="btn-primary" onClick={onLogin} style={{ width: "100%", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14 }}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Authenticating...
              </span>
            ) : (
              <>
                <Icon name="lock" size={15} color="white" />
                Sign In to Online Banking
              </>
            )}
          </button>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20, fontSize: 11.5, color: T.textMuted }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="shield" size={13} color={T.textMuted} />
              256-bit SSL Encrypted
            </div>
            <span>·</span>
            <span>PCI DSS Level 1</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11.5, color: T.textMuted }}>
          © 2026 Saving Life and Property Bank, N.A. · Member FDIC
        </div>
      </div>
    </div>
  );
}



/* ─── VERIFICATION CODE ─────────────────────────────────────── */
function VerifyCodePage({ code, setCode, loading, onVerify, onBack, T }) {
  const now = useLiveClock();
  return (
    <div className="slb" style={{ minHeight: "100dvh", background: T.bgAlt, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px", overflowY: "auto", WebkitOverflowScrolling: "touch" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight}, ${T.gold})`, zIndex: 10 }} />

      <div className="fade-in" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <BrandMark size={80} />
          </div>
          <div className="slb-serif" style={{ fontSize: 22, color: "#1A3A6B", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>
            Saving Life
          </div>
          <div style={{ fontSize: 12, color: T.gold, letterSpacing: "0.18em", fontWeight: 600, textTransform: "uppercase", margin: "2px 0" }}>
            — and property —
          </div>
          <div className="slb-serif" style={{ fontSize: 20, color: "#1A3A6B", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            Bank
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "36px 32px", boxShadow: T.shadowLg }}>
          <div style={{ marginBottom: 24, textAlign: "center" }}>
            <div style={{ width: 52, height: 52, borderRadius: 26, background: T.goldBg, border: `1px solid ${T.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
              <Icon name="shield" size={24} color={T.gold} />
            </div>
            <div className="slb-serif" style={{ fontSize: 18, fontWeight: 600, color: T.text }}>Two-Factor Verification</div>
            <div style={{ fontSize: 13, color: T.textSub, marginTop: 8, lineHeight: 1.6 }}>
              For your security, we've sent a 6-digit verification code to your registered device. Please enter it below to continue.
            </div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 8 }}>{formatDate(now)} · {formatTime(now)} ET</div>
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 11.5, fontWeight: 500, color: T.textSub, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 7 }}>Verification Code</label>
            <input className="input-field" type="text" inputMode="numeric" maxLength={6} value={code}
              onChange={e => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="• • • • • •"
              style={{ textAlign: "center", fontSize: 22, letterSpacing: "0.5em", fontFamily: "DM Mono", padding: "12px 13px" }} />
          </div>

          <button className="btn-primary" onClick={onVerify} style={{ width: "100%", padding: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 14 }} disabled={code.length !== 6}>
            {loading ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                  <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                Verifying...
              </span>
            ) : (
              <>
                <Icon name="shield" size={15} color="white" />
                Verify & Continue
              </>
            )}
          </button>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 18 }}>
            <span onClick={onBack} style={{ fontSize: 13, color: T.textSub, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name="arrowLeft" size={13} color={T.textSub} /> Back
            </span>
            <span style={{ fontSize: 13, color: T.gold, cursor: "pointer", fontWeight: 500 }}>Resend Code</span>
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 20, fontSize: 11.5, color: T.textMuted }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <Icon name="shield" size={13} color={T.textMuted} />
              256-bit SSL Encrypted
            </div>
            <span>·</span>
            <span>PCI DSS Level 1</span>
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: 20, fontSize: 11.5, color: T.textMuted }}>
          © 2026 Saving Life and Property Bank, N.A. · Member FDIC
        </div>
      </div>
    </div>
  );
}



/* ─── SIDEBAR ───────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: "home",     group: "main" },
  { id: "transactions", label: "Transactions", icon: "list",     group: "main" },
  { id: "cards",        label: "Cards",        icon: "card",     group: "main" },
  { id: "transfers",    label: "Transfers",    icon: "transfer", group: "main" },
  { id: "investments",  label: "Investments",  icon: "chart",    group: "main" },
  { id: "settings",     label: "Settings",     icon: "settings", group: "account" },
  { id: "help",         label: "Help Center",  icon: "help",     group: "account" },
];

function Sidebar({ currentPage, setCurrentPage, isOpen, onClose, T, isMobile, onLogout }) {
  return (
    <>
      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div onClick={onClose} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)",
          zIndex: 55, backdropFilter: "blur(2px)"
        }} />
      )}

      {/* Sidebar panel */}
      <div style={{
        position: isMobile ? "fixed" : "relative",
        top: 0, left: 0, bottom: 0,
        width: isOpen ? 234 : (isMobile ? 0 : 0),
        zIndex: isMobile ? 60 : "auto",
        overflow: "hidden",
        background: T.nav,
        borderRight: `1px solid ${T.navBorder}`,
        flexShrink: 0,
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "100vh" : "100%",
      }}>
        <div style={{ width: 234, height: "100%", display: "flex", flexDirection: "column", padding: "20px 14px", overflowY: "auto" }}>
          {/* Close button on mobile */}
          {isMobile && (
            <button onClick={onClose} style={{ alignSelf: "flex-end", background: "none", border: "none", cursor: "pointer", color: T.textSub, marginBottom: 8, padding: 4 }}>
              <Icon name="x" size={20} color={T.textSub} />
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 4, marginBottom: 28 }}>
            <BrandMark size={40} />
            <div>
              <div className="slb-serif" style={{ fontSize: 12.5, color: "#1A3A6B", letterSpacing: "0.05em", lineHeight: 1.2, fontWeight: 700, textTransform: "uppercase" }}>Saving Life</div>
              <div style={{ fontSize: 9, color: T.gold, letterSpacing: "0.12em", textTransform: "uppercase", fontWeight: 600, lineHeight: 1.4 }}>and property</div>
              <div className="slb-serif" style={{ fontSize: 11, color: "#1A3A6B", letterSpacing: "0.1em", fontWeight: 700, textTransform: "uppercase", lineHeight: 1.2 }}>Bank</div>
            </div>
          </div>

          <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, marginBottom: 8, paddingLeft: 6 }}>Main</div>
          {NAV_ITEMS.filter(n => n.group === "main").map(item => (
            <div key={item.id} className={`nav-item${currentPage === item.id ? " active" : ""}`}
              onClick={() => { setCurrentPage(item.id); if (isMobile) onClose(); }}>
              <Icon name={item.icon} size={16} color={currentPage === item.id ? T.gold : T.textSub} />
              {item.label}
            </div>
          ))}

          <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, margin: "20px 0 8px", paddingLeft: 6 }}>Account</div>
          {NAV_ITEMS.filter(n => n.group === "account").map(item => (
            <div key={item.id} className={`nav-item${currentPage === item.id ? " active" : ""}`}
              onClick={() => { setCurrentPage(item.id); if (isMobile) onClose(); }}>
              <Icon name={item.icon} size={16} color={currentPage === item.id ? T.gold : T.textSub} />
              {item.label}
            </div>
          ))}
          <div className="nav-item" onClick={onLogout}>
            <Icon name="arrowLeft" size={16} color={T.textSub} />
            Log Out
          </div>

          <div style={{ marginTop: "auto", background: T.goldBg, border: `1px solid ${T.goldBorder}`, borderRadius: 10, padding: "12px 14px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Avatar initials="DS" color={T.gold} size={34} />
              <div style={{ overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text, whiteSpace: "nowrap" }}>Daniel Scott</div>
                <div style={{ fontSize: 11, color: T.gold, display: "flex", alignItems: "center", gap: 4 }}>
                  <Icon name="shield" size={11} color={T.gold} /> Platinum Member
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── TOP BAR ───────────────────────────────────────────────── */
function TopBar({ setSidebarOpen, sidebarOpen, showNotif, setShowNotif, dark, setDark, T, NOTIFS, isMobile, onLogout }) {
  const unread = NOTIFS.filter(n => !n.read).length;
  return (
    <div style={{ background: T.nav, borderBottom: `1px solid ${T.navBorder}`, padding: "0 16px 0 16px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "relative", zIndex: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 6, borderRadius: 6, color: T.textSub }}>
          <Icon name="menu" size={20} color={T.textSub} />
        </button>
        {!isMobile && (
          <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px" }}>
            <Icon name="search" size={15} color={T.textMuted} />
            <input placeholder="Search transactions, accounts..." className="slb" style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: 13, width: 220 }} />
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <button onClick={() => setDark(!dark)}
          style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", display: "flex", cursor: "pointer" }}>
          <Icon name={dark ? "sun" : "moon"} size={16} color={T.textSub} />
        </button>

        <div style={{ position: "relative" }}>
          <button onClick={() => setShowNotif(!showNotif)}
            style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 10px", position: "relative", display: "flex", cursor: "pointer" }}>
            <Icon name="bell" size={16} color={T.textSub} />
            {unread > 0 && (
              <span style={{ position: "absolute", top: -4, right: -4, background: T.red, color: "#fff", borderRadius: "50%", width: 17, height: 17, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 600 }}>{unread}</span>
            )}
          </button>
          {showNotif && (
            <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 300, maxWidth: "calc(100vw - 24px)", background: T.surface, border: `1px solid ${T.borderStrong}`, borderRadius: 12, boxShadow: T.shadowLg, zIndex: 100 }}>
              <div style={{ padding: "14px 16px 10px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 500, color: T.text, fontSize: 14 }}>Notifications</span>
                <span style={{ fontSize: 12, color: T.gold, cursor: "pointer" }}>Mark all read</span>
              </div>
              {NOTIFS.map(n => (
                <div key={n.id} style={{ padding: "12px 16px", borderBottom: `1px solid ${T.border}`, background: !n.read ? T.goldBg + "80" : "transparent", display: "flex", gap: 10, alignItems: "flex-start" }}>
                  <div style={{ marginTop: 2 }}>
                    <Icon name={n.type === "success" ? "check" : n.type === "warning" ? "shield" : "bell"} size={15}
                      color={n.type === "success" ? T.green : n.type === "warning" ? T.red : T.gold} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{n.title}</div>
                    <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>{n.msg}</div>
                    <div style={{ fontSize: 11, color: T.textMuted, marginTop: 3 }}>{n.time}</div>
                  </div>
                  {!n.read && <div style={{ width: 7, height: 7, borderRadius: "50%", background: T.gold, flexShrink: 0, marginTop: 5 }} />}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 8, borderLeft: `1px solid ${T.border}`, marginLeft: 2 }}>
          <Avatar initials="DS" color={T.gold} size={34} />
        </div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD ─────────────────────────────────────────────── */
function DashboardHome({ setCurrentPage, T }) {
  const [fromAmt, setFromAmt] = useState("1000");
  const [toCurr, setToCurr] = useState("EUR");
  const convRate = { EUR: 0.9234, GBP: 0.7891, JPY: 157.42, CAD: 1.3612 };
  const converted = (parseFloat(fromAmt || 0) * convRate[toCurr]).toLocaleString("en-US", { maximumFractionDigits: 2 });
  const now = useLiveClock();

  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif" style={{ fontSize: 24, color: T.text, fontWeight: 500 }}>
          {getGreeting()}, Daniel
        </div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 5, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          <span>{formatDate(now)}</span>
          <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <Icon name="location" size={13} color={T.textMuted} />
            Eastern Time: {formatTime(now)}
          </span>
          <span className="pill-badge badge-gold" style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <Icon name="shield" size={11} color={T.gold} /> Platinum Member
          </span>
        </div>
      </div>

      {/* Hero Balance */}
      <div className="hero-balance-card" style={{ background: T.surface, border: `1px solid ${T.borderStrong}`, borderRadius: 16, padding: "28px 32px", marginBottom: 20, boxShadow: T.shadowMd, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight}, ${T.gold})` }} />
        <div className="hero-balance-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, marginBottom: 10 }}>Total Balance</div>
            {/* Inter font for balance as requested */}
            <div className="slb-balance bal-amount" style={{ fontSize: 48, color: T.text, lineHeight: 1, fontFamily: "Inter, sans-serif" }}>
              $765,465<span className="bal-cents" style={{ color: T.gold, fontSize: 38, fontFamily: "Inter, sans-serif" }}>.44</span>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 18, flexWrap: "wrap" }}>
              <div>
                {/* Changed from "Available" to "Available Balance" */}
                <div style={{ fontSize: 10.5, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>Available Balance</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: T.green, fontFamily: "DM Mono" }}>$762,120.10</div>
              </div>
              <div style={{ width: 1, background: T.border }} />
              <div>
                <div style={{ fontSize: 10.5, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>Pending</div>
                <div style={{ fontSize: 18, fontWeight: 600, color: "#D97706", fontFamily: "DM Mono" }}>$3,345.34</div>
              </div>
            </div>
          </div>
          <div className="hero-balance-right" style={{ textAlign: "right" }}>
            <span className="pill-badge badge-green" style={{ marginBottom: 12, display: "inline-flex" }}>
              <Icon name="trend" size={11} color={T.green} /> +12.4% this month
            </span>
            <div style={{ fontSize: 12.5, color: T.textSub }}>Premium Checking Account</div>
            {/* Blurred/masked account number — only last 4 shown */}
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 5, fontFamily: "DM Mono" }}>••••&nbsp;&nbsp;••••&nbsp;&nbsp;••••&nbsp;&nbsp;2210</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>Member since 2018</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stat-cards-row" style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Monthly Income"  value="$74,240"  icon="dollar"    trend="up"   sub="+18% vs last month" T={T} />
        <StatCard label="Monthly Spend"   value="$11,670"  icon="card"      trend="down" sub="-5% vs last month"  T={T} />
        <StatCard label="Portfolio Value" value="$312,000" icon="portfolio" trend="up"   sub="+12.4% this year"   T={T} />
        <StatCard label="Savings Rate"    value="84.3%"    icon="shield"    sub="Excellent standing"              T={T} />
      </div>

      {/* Charts */}
      <div className="chart-grid-2" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Balance History</div>
              <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>6-month trend</div>
            </div>
            <span className="pill-badge badge-gold">+23.2%</span>
          </div>
          <ResponsiveContainer width="100%" height={155}>
            <AreaChart data={BALANCE_TREND}>
              <defs>
                <linearGradient id="balGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.gold} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={T.gold} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid} />
              <XAxis dataKey="m" tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip T={T} />} />
              <Area type="monotone" dataKey="v" stroke={T.gold} fill="url(#balGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Weekly Cash Flow</div>
              <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>Income vs expenses</div>
            </div>
            <div style={{ display: "flex", gap: 12, fontSize: 11.5 }}>
              <span style={{ color: T.green, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: T.green, display: "inline-block" }} />In</span>
              <span style={{ color: T.red, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 8, height: 8, borderRadius: 4, background: T.red, display: "inline-block" }} />Out</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={155}>
            <BarChart data={CASHFLOW} barGap={3}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid} />
              <XAxis dataKey="d" tick={{ fill: T.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip T={T} />} />
              <Bar dataKey="in"  fill={T.green} radius={[3, 3, 0, 0]} maxBarSize={22} />
              <Bar dataKey="out" fill={T.red}   radius={[3, 3, 0, 0]} maxBarSize={22} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom grid */}
      <div className="chart-grid-3" style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Transactions */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Recent Activity</div>
            <button className="btn-secondary" onClick={() => setCurrentPage("transactions")} style={{ padding: "5px 12px", fontSize: 12 }}>View all</button>
          </div>
          {TXNS.slice(0, 5).map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.goldBg, border: `1px solid ${T.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <TxnIcon txn={t} size={16} T={T} />
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{t.name}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{t.date} · {t.cat}</div>
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: t.type === "credit" ? T.green : T.text, fontFamily: "DM Mono", whiteSpace: "nowrap" }}>
                {t.type === "credit" ? "+" : "−"}${Math.abs(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
              </div>
            </div>
          ))}
        </div>

        {/* Portfolio pie */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2 }}>Portfolio Mix</div>
          <div style={{ fontSize: 12, color: T.textSub, marginBottom: 12 }}>$312,000 AUM</div>
          <ResponsiveContainer width="100%" height={120}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={36} outerRadius={54} dataKey="v" strokeWidth={2} stroke={T.surface}>
                {PIE_DATA.map((e, i) => <Cell key={i} fill={e.hex} />)}
              </Pie>
              <Tooltip contentStyle={{ background: T.tooltipBg, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.text }} formatter={(v, n) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
          {PIE_DATA.map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginTop: 7 }}>
              <span style={{ color: T.textSub, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 4, background: e.hex, display: "inline-block" }} />
                {e.name}
              </span>
              <span style={{ color: T.text, fontWeight: 500, fontFamily: "DM Mono" }}>{e.v}%</span>
            </div>
          ))}
        </div>

        {/* FX Converter */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 2, display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="globe" size={15} color={T.gold} /> FX Converter
          </div>
          <div style={{ fontSize: 12, color: T.textSub, marginBottom: 16 }}>Live exchange rates</div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, display: "block" }}>USD Amount</label>
            <input type="number" value={fromAmt} onChange={e => setFromAmt(e.target.value)}
              className="input-field" style={{ fontFamily: "DM Mono" }} />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6, display: "block" }}>Convert To</label>
            <select value={toCurr} onChange={e => setToCurr(e.target.value)}
              className="input-field" style={{ fontFamily: "Inter" }}>
              {Object.keys(convRate).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ background: T.goldBg, borderRadius: 10, padding: "14px", textAlign: "center", border: `1px solid ${T.goldBorder}` }}>
            <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>Result</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: T.gold, fontFamily: "DM Mono" }}>{converted}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>1 USD = {convRate[toCurr]} {toCurr}</div>
          </div>
        </div>
      </div>

      {/* Beneficiaries + Security */}
      <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Saved Beneficiaries</div>
            <button className="btn-primary" style={{ padding: "5px 14px", fontSize: 12, display: "flex", alignItems: "center", gap: 5 }}>
              <Icon name="plus" size={13} color="white" /> Add
            </button>
          </div>
          {BENEFICIARIES.map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <Avatar initials={b.initials} color={b.color} size={36} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{b.name}</div>
                <div style={{ fontSize: 11, color: T.textMuted }}>{b.bank} · {b.acc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="shield" size={15} color={T.gold} /> Account Details
          </div>
          {[
            { label: "Account Number", value: "••••  ••••  ••••  2210" },
            { label: "Routing Number", value: "0210-••••-1" },
            { label: "IBAN",           value: "US64FTBK••••••••••91" },
            { label: "SWIFT/BIC",      value: "FTBKUS44" },
          ].map((r, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontSize: 12, color: T.textSub }}>{r.label}</span>
              <span className="slb-mono" style={{ fontSize: 12, fontWeight: 500, color: T.text }}>{r.value}</span>
            </div>
          ))}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
            <span className="pill-badge badge-green"><Icon name="check" size={11} color={T.green} /> 2FA Active</span>
            <span className="pill-badge badge-gold"><Icon name="lock" size={11} color={T.gold} /> SSL Verified</span>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "3px 9px", borderRadius: 20, fontSize: 11.5, fontWeight: 500, background: "#EDE9FE", color: "#7C3AED" }}>
              <Icon name="shield" size={11} color="#7C3AED" /> Platinum KYC
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TRANSACTIONS ──────────────────────────────────────────── */
function TransactionsPage({ T }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Income", "Shopping", "Transfer", "Entertainment", "Travel", "Investment", "Health"];
  const list = filter === "All" ? TXNS : TXNS.filter(t => filter === "Income" ? t.type === "credit" : t.cat === filter);
  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif page-title" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Transactions</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Full transaction history and activity</div>
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }} className="stat-cards-row">
        <StatCard label="Total Credits" value="$70,500.00" icon="dollar"   trend="up"   sub="This month" T={T} />
        <StatCard label="Total Debits"  value="$11,860.59" icon="card"     trend="down" sub="This month" T={T} />
        <StatCard label="Net Cash Flow" value="+$58,639.41" icon="trend"   trend="up"   sub="Positive"   T={T} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} className={`tag-filter${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div className="txn-table-header" style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "36px 1fr 130px 110px 110px 100px", gap: 12 }}>
          {["", "Description", "Date", "Category", "Amount", "Status"].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 500, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {list.map(t => (
          <div key={t.id} className="table-row txn-table-row" style={{ gridTemplateColumns: "36px 1fr 130px 110px 110px 100px" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.goldBg, border: `1px solid ${T.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <TxnIcon txn={t} size={14} T={T} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{t.name}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{t.ref}</div>
            </div>
            <div style={{ fontSize: 12, color: T.textSub }} className="txn-date">{t.date}</div>
            <span className="pill-badge txn-cat" style={{ background: T.surfaceAlt, color: T.textSub, border: `1px solid ${T.border}`, fontSize: 11 }}>{t.cat}</span>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.type === "credit" ? T.green : T.text, fontFamily: "DM Mono" }}>
              {t.type === "credit" ? "+" : "−"}${Math.abs(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="pill-badge badge-green txn-status" style={{ fontSize: 11 }}>
              <Icon name="check" size={10} color={T.green} /> Settled
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CARDS ─────────────────────────────────────────────────── */
function CardsPage({ T }) {
  const [selected, setSelected] = useState(0);
  const CARDS = [
    { label: "Premium Debit", num: "4589 •••• •••• 2210", exp: "08/29", name: "DANIEL SCOTT", network: "VISA", value: "$762,120.10", valueLabel: "Available Balance", accent: T.gold },
    { label: "World Credit",  num: "5211 •••• •••• 8840", exp: "12/27", name: "DANIEL SCOTT", network: "MC",   value: "$50,000",      valueLabel: "Credit Limit",      accent: "#7C3AED" },
    { label: "Travel Rewards",num: "3782 •••• •••• 8220", exp: "03/28", name: "DANIEL SCOTT", network: "AMEX", value: "$2,341",        valueLabel: "Cashback Earned",   accent: "#1A6B3C" },
  ];
  const c = CARDS[selected];
  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif page-title" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Cards</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Manage your debit and credit cards</div>
      </div>
      <div className="card-page-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
            {CARDS.map((cd, i) => (
              <button key={i} onClick={() => setSelected(i)}
                style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${selected === i ? cd.accent : T.border}`, background: selected === i ? cd.accent + "14" : T.surface, color: selected === i ? cd.accent : T.textSub, transition: "all 0.15s", fontFamily: "Inter" }}>
                {cd.label}
              </button>
            ))}
          </div>

          {/* Card visual */}
          <div style={{ width: "100%", aspectRatio: "1.586", borderRadius: 16, background: T.surfaceAlt, border: `1px solid ${T.borderStrong}`, padding: 24, position: "relative", overflow: "hidden", boxShadow: T.shadowLg }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c.accent}, ${c.accent}88, ${c.accent})` }} />
            <div style={{ position: "absolute", right: -30, bottom: -40, width: 200, height: 200, borderRadius: "50%", border: `1px solid ${c.accent}15` }} />
            <div style={{ position: "absolute", right: 10, bottom: -20, width: 150, height: 150, borderRadius: "50%", border: `1px solid ${c.accent}08` }} />
            <div style={{ width: 42, height: 32, borderRadius: 5, background: "linear-gradient(135deg, #D4AF37, #A07830)", marginBottom: 20, position: "relative" }}>
              <div style={{ position: "absolute", inset: 4, border: "1px solid rgba(255,255,255,0.3)", borderRadius: 3 }} />
            </div>
            <div style={{ fontFamily: "DM Mono", fontSize: 16, letterSpacing: "0.15em", color: T.text, fontWeight: 400, marginBottom: 18 }}>
              {c.num}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>Card Holder</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text, letterSpacing: "0.05em", fontFamily: "DM Mono" }}>{c.name}</div>
              </div>
              <div>
                <div style={{ fontSize: 9, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 3 }}>Expires</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: "DM Mono" }}>{c.exp}</div>
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: c.accent, letterSpacing: 1 }}>{c.network}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {[
              { label: "Freeze Card", icon: "lock" },
              { label: "Set Limits",  icon: "shield" },
              { label: "Replace",     icon: "dots" },
            ].map((btn, i) => (
              <button key={i} className="btn-secondary" style={{ flex: 1, padding: "9px 6px", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Icon name={btn.icon} size={13} color={T.textSub} /> {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 14 }}>Card Details</div>
            {[
              { l: "Card Type",   v: c.label },
              { l: "Network",     v: c.network },
              { l: "Card Number", v: c.num },
              { l: "Expiry",      v: c.exp },
              { l: "CVV",         v: "•••" },
              { l: c.valueLabel,  v: c.value },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 12, color: T.textSub }}>{r.l}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: ["Card Number", "CVV", "Expiry"].includes(r.l) ? "DM Mono" : "Inter" }}>{r.v}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Icon name="plus" size={14} color="white" /> Add New Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TRANSFERS ─────────────────────────────────────────────── */
function TransfersPage({ T }) {
  const [step, setStep] = useState(1);
  const [recip, setRecip] = useState("");
  const [acctNum, setAcctNum] = useState("");
  const [routingNum, setRoutingNum] = useState("");
  const [amt, setAmt] = useState("");
  const [note, setNote] = useState("");
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [showDeclined, setShowDeclined] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const resetForm = () => {
    setStep(1); setRecip(""); setAcctNum(""); setRoutingNum("");
    setAmt(""); setNote(""); setPin(""); setPinError(false);
  };

  const handleAuthorize = () => {
    if (pin.length !== 4) return;
    setVerifying(true);
    setPinError(false);
    setTimeout(() => {
      setVerifying(false);
      if (pin === "3215") {
        // Per spec: this PIN appears valid but the transaction is declined
        setShowDeclined(true);
      } else {
        setPinError(true);
      }
    }, 1400);
  };

  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif page-title" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Send Money</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Domestic and international wire transfers</div>
      </div>
      <div className="transfers-grid" style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        <div className="card-elevated" style={{ padding: 28 }}>
          {/* Stepper */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28, flexWrap: "wrap" }}>
            {[1, 2, 3, 4].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{ width: 28, height: 28, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 600, transition: "all 0.3s", background: step >= s ? T.gold : T.border, color: step >= s ? "#fff" : T.textMuted, border: `2px solid ${step >= s ? T.gold : T.border}` }}>
                  {step > s ? <Icon name="check" size={12} color="white" /> : s}
                </div>
                {s < 4 && <div style={{ width: 28, height: 2, background: step > s ? T.gold : T.border, borderRadius: 1 }} />}
              </div>
            ))}
            <span style={{ fontSize: 12, color: T.textSub, marginLeft: 8 }}>
              {step === 1 ? "Recipient Details" : step === 2 ? "Enter Amount" : step === 3 ? "Review & Confirm" : "Authorize Transfer"}
            </span>
          </div>

          {step === 1 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 16 }}>Select Recipient</div>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 10 }}>Saved Contacts</div>
                {BENEFICIARIES.map((b, i) => (
                  <div key={i} onClick={() => setRecip(b.name)}
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: 12, borderRadius: 10, border: `1px solid ${recip === b.name ? T.goldBorder : T.border}`, cursor: "pointer", marginBottom: 8, background: recip === b.name ? T.goldBg : "transparent", transition: "all 0.15s" }}>
                    <Avatar initials={b.initials} color={b.color} size={34} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{b.name}</div>
                      <div style={{ fontSize: 11, color: T.textMuted }}>{b.bank} · {b.acc}</div>
                    </div>
                    {recip === b.name && <Icon name="check" size={16} color={T.gold} />}
                  </div>
                ))}
              </div>
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Or Enter Recipient Name</div>
                <input className="input-field" placeholder="Full name on recipient's account" value={recip} onChange={e => setRecip(e.target.value)} />
              </div>
              <div className="grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Account Number</label>
                  <input className="input-field" inputMode="numeric" placeholder="e.g. 0123456789" value={acctNum}
                    onChange={e => setAcctNum(e.target.value.replace(/\D/g, ""))} style={{ fontFamily: "DM Mono" }} />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Routing Number</label>
                  <input className="input-field" inputMode="numeric" placeholder="9-digit ABA number" value={routingNum}
                    onChange={e => setRoutingNum(e.target.value.replace(/\D/g, "").slice(0, 9))} style={{ fontFamily: "DM Mono" }} />
                </div>
              </div>
              <button className="btn-primary" onClick={() => setStep(2)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }} disabled={!recip || !acctNum || !routingNum}>
                Continue <Icon name="arrow" size={14} color="white" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 16 }}>Transfer Amount</div>
              <div style={{ background: T.goldBg, border: `1px solid ${T.goldBorder}`, borderRadius: 10, padding: "12px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 10 }}>
                <Avatar initials={BENEFICIARIES.find(b => b.name === recip)?.initials || recip.slice(0, 2).toUpperCase()} color={T.gold} size={32} />
                <div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>Sending to</div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{recip}</div>
                </div>
              </div>
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Amount (USD)</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: T.gold, fontSize: 18, fontFamily: "Playfair Display", fontWeight: 500 }}>$</span>
                  <input className="input-field" type="number" placeholder="0.00" value={amt} onChange={e => setAmt(e.target.value)}
                    style={{ paddingLeft: 28, fontSize: 22, fontFamily: "DM Mono", fontWeight: 500 }} />
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                {["500", "1000", "5000", "10000"].map(q => (
                  <button key={q} className="btn-secondary" onClick={() => setAmt(q)} style={{ flex: 1, fontSize: 12, padding: "7px 4px" }}>
                    ${parseInt(q).toLocaleString()}
                  </button>
                ))}
              </div>
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: "block", fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Reference / Note</label>
                <input className="input-field" placeholder="Optional payment reference..." value={note} onChange={e => setNote(e.target.value)} />
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  <Icon name="arrowLeft" size={14} color={T.textSub} /> Back
                </button>
                <button className="btn-primary" onClick={() => setStep(3)} style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }} disabled={!amt}>
                  Review Transfer <Icon name="arrow" size={14} color="white" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 16 }}>Confirm Transfer</div>
              <div style={{ background: T.surfaceAlt, borderRadius: 12, padding: 18, marginBottom: 16, border: `1px solid ${T.border}` }}>
                {[
                  { l: "From Account",   v: "Daniel Scott — Premium Checking" },
                  { l: "Recipient",      v: recip },
                  { l: "Account Number", v: acctNum },
                  { l: "Routing Number", v: routingNum },
                  { l: "Amount",         v: `$${parseFloat(amt).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, highlight: true },
                  { l: "Transfer Fee",   v: "$0.00 — Platinum Benefit" },
                  { l: "Reference",      v: note || "N/A" },
                  { l: "Est. Arrival",   v: "2–5 Business Days" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 12, color: T.textSub }}>{r.l}</span>
                    <span style={{ fontSize: 13, fontWeight: r.highlight ? 600 : 500, color: r.highlight ? T.gold : T.text, fontFamily: r.highlight || ["Account Number","Routing Number"].includes(r.l) ? "DM Mono" : "Inter" }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: T.greenBg, border: `1px solid ${T.green}30`, borderRadius: 10, padding: "10px 14px", fontSize: 12.5, color: T.green, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <Icon name="shield" size={14} color={T.green} />
                Protected by Saving Life Bank's Secure Transfer Guarantee
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn-secondary" onClick={() => setStep(2)} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  <Icon name="arrowLeft" size={14} color={T.textSub} /> Edit
                </button>
                <button className="btn-primary" onClick={() => setStep(4)}
                  style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  <Icon name="lock" size={14} color="white" /> Authorize & Send
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 8 }}>Enter Transaction PIN</div>
              <div style={{ fontSize: 12.5, color: T.textSub, marginBottom: 20, lineHeight: 1.6 }}>
                For your security, please enter your 4-digit transaction PIN to authorize this transfer of{" "}
                <span style={{ color: T.gold, fontWeight: 600, fontFamily: "DM Mono" }}>${amt ? parseFloat(amt).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}</span>{" "}
                to {recip}.
              </div>
              <div style={{ marginBottom: 8 }}>
                <input className="input-field" type="password" inputMode="numeric" maxLength={4} value={pin}
                  onChange={e => { setPin(e.target.value.replace(/\D/g, "").slice(0, 4)); setPinError(false); }}
                  placeholder="• • • •"
                  style={{ textAlign: "center", fontSize: 24, letterSpacing: "0.6em", fontFamily: "DM Mono", padding: "12px 13px", borderColor: pinError ? T.red : undefined }} />
              </div>
              {pinError && (
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: T.red, fontSize: 12, marginBottom: 12 }}>
                  <Icon name="shield" size={13} color={T.red} /> Incorrect PIN. Please try again.
                </div>
              )}
              <div style={{ height: pinError ? 0 : 12 }} />
              <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                <button className="btn-secondary" onClick={() => { setStep(3); setPin(""); setPinError(false); }} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                  <Icon name="arrowLeft" size={14} color={T.textSub} /> Back
                </button>
                <button className="btn-primary" onClick={handleAuthorize}
                  style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }} disabled={pin.length !== 4 || verifying}>
                  {verifying ? (
                    <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                      Authorizing...
                    </span>
                  ) : (
                    <><Icon name="lock" size={14} color="white" /> Confirm & Send</>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 14 }}>Transfer Limits</div>
            {[
              { l: "Daily Limit",    total: 100000 },
              { l: "Monthly Limit",  total: 500000 },
              { l: "International",  total: 50000  },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: i < 2 ? `1px solid ${T.border}` : "none" }}>
                <span style={{ fontSize: 12, color: T.textSub }}>{r.l}</span>
                <span style={{ color: T.text, fontWeight: 500, fontFamily: "DM Mono", fontSize: 13 }}>${r.total.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transaction Declined Modal */}
      {showDeclined && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 20 }}
          onClick={() => setShowDeclined(false)}>
          <div className="fade-in" onClick={e => e.stopPropagation()}
            style={{ background: T.surface, borderRadius: 16, padding: "32px 28px", maxWidth: 400, width: "100%", boxShadow: T.shadowLg, border: `1px solid ${T.borderStrong}`, textAlign: "center" }}>
            <div style={{ width: 60, height: 60, borderRadius: 30, background: T.redBg, border: `1px solid ${T.red}30`, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <Icon name="x" size={28} color={T.red} />
            </div>
            <div className="slb-serif" style={{ fontSize: 18, fontWeight: 600, color: T.text, marginBottom: 8 }}>Transaction Declined</div>
            <div style={{ fontSize: 13, color: T.textSub, lineHeight: 1.7, marginBottom: 18 }}>
              We were unable to complete this transfer. Your account has not been debited. This may be due to a temporary issue with the recipient's bank or a security hold placed on this transaction.
            </div>
            <div style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: "12px 14px", marginBottom: 18, textAlign: "left" }}>
              {[
                { l: "Recipient", v: recip },
                { l: "Amount", v: `$${amt ? parseFloat(amt).toLocaleString("en-US", { minimumFractionDigits: 2 }) : "0.00"}` },
                { l: "Status", v: "Declined" },
                { l: "Reference", v: "ERR-4471-AUTH" },
              ].map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ fontSize: 12, color: T.textSub }}>{r.l}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 500, color: r.l === "Status" ? T.red : T.text, fontFamily: r.l === "Reference" ? "DM Mono" : "Inter" }}>{r.v}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button className="btn-secondary" onClick={() => { setShowDeclined(false); resetForm(); }} style={{ flex: 1 }}>
                Close
              </button>
              <button className="btn-primary" onClick={() => { setShowDeclined(false); setStep(4); setPin(""); }} style={{ flex: 1 }}>
                Try Again
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── INVESTMENTS ───────────────────────────────────────────── */
function InvestmentsPage({ T }) {
  const HOLDINGS = [
    { sym: "AAPL", name: "Apple Inc.",   shares: 45,  price: 198.40, chg: +2.3, val: 8928  },
    { sym: "TSLA", name: "Tesla Inc.",   shares: 30,  price: 248.70, chg: -1.1, val: 7461  },
    { sym: "NVDA", name: "NVIDIA Corp.", shares: 20,  price: 880.50, chg: +4.8, val: 17610 },
    { sym: "MSFT", name: "Microsoft",    shares: 35,  price: 425.20, chg: +0.9, val: 14882 },
    { sym: "IBIT", name: "Bitcoin ETF",  shares: 100, price: 52.80,  chg: +3.2, val: 5280  },
    { sym: "VOO",  name: "S&P 500 ETF",  shares: 80,  price: 510.40, chg: +0.4, val: 40832 },
  ];
  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif page-title" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Investment Portfolio</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Track, analyze and manage your investments</div>
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }} className="stat-cards-row">
        <StatCard label="Total AUM"      value="$312,000" icon="portfolio" trend="up" sub="+12.4% this year" T={T} />
        <StatCard label="Today's Gain"   value="+$1,840"  icon="trend"    trend="up" sub="+0.59% today"     T={T} />
        <StatCard label="Dividends YTD"  value="$8,640"   icon="coins"    sub="4 payments"                  T={T} />
        <StatCard label="Unrealized P&L" value="+$44,200" icon="chart"    trend="up" sub="Since inception"  T={T} />
      </div>
      <div className="grid-2col-inv" style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Portfolio Performance</div>
              <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>Quarterly since Q1 2024</div>
            </div>
            <span className="pill-badge badge-green">+73.3% total</span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={INV_TREND}>
              <defs>
                <linearGradient id="invGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor={T.green} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={T.green} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.chartGrid} />
              <XAxis dataKey="m" tick={{ fill: T.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip content={<CustomTooltip T={T} />} />
              <Area type="monotone" dataKey="v" stroke={T.green} fill="url(#invGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 14 }}>Asset Allocation</div>
          <ResponsiveContainer width="100%" height={150}>
            <PieChart>
              <Pie data={PIE_DATA} cx="50%" cy="50%" innerRadius={44} outerRadius={66} dataKey="v" strokeWidth={3} stroke={T.surface}>
                {PIE_DATA.map((e, i) => <Cell key={i} fill={e.hex} />)}
              </Pie>
              <Tooltip contentStyle={{ background: T.tooltipBg, border: `1px solid ${T.border}`, borderRadius: 8, fontSize: 12, color: T.text }} formatter={(v, n) => [`${v}%`, n]} />
            </PieChart>
          </ResponsiveContainer>
          {PIE_DATA.map((e, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 10, height: 10, borderRadius: 5, background: e.hex }} />
                <span style={{ fontSize: 12, color: T.textSub }}>{e.name}</span>
              </div>
              <div>
                <span style={{ fontSize: 12, fontWeight: 500, color: T.text, fontFamily: "DM Mono" }}>{e.v}%</span>
                <span style={{ fontSize: 11, color: T.textMuted, marginLeft: 8, fontFamily: "DM Mono" }}>${(312000 * e.v / 100).toLocaleString("en-US", { maximumFractionDigits: 0 })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card" style={{ padding: 20 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 16 }}>Current Holdings</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
          {HOLDINGS.map((s, i) => (
            <div key={i} className="hover-lift" style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: T.text, fontFamily: "DM Mono" }}>{s.sym}</div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{s.name}</div>
                </div>
                <span className={`pill-badge ${s.chg > 0 ? "badge-green" : "badge-red"}`} style={{ display: "flex", alignItems: "center", gap: 3 }}>
                  <Icon name={s.chg > 0 ? "trend" : "downtrend"} size={10} color={s.chg > 0 ? T.green : T.red} />
                  {s.chg > 0 ? "+" : ""}{s.chg}%
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                <span style={{ color: T.textMuted }}>{s.shares} shares @ ${s.price.toLocaleString()}</span>
                <span style={{ color: T.text, fontWeight: 500, fontFamily: "DM Mono" }}>${s.val.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── SETTINGS ──────────────────────────────────────────────── */
function SettingsPage({ T }) {
  const [t2fa, setT2fa] = useState(true);
  const [notif, setNotif] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [stmts, setStmts] = useState(true);

  const Toggle = ({ on, set }) => (
    <div className="toggle-track" onClick={() => set(!on)} style={{ background: on ? T.gold : T.border }}>
      <div className="toggle-thumb" style={{ left: on ? 23 : 3 }} />
    </div>
  );

  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif page-title" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Settings</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Manage account preferences and security</div>
      </div>
      <div className="settings-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: 16, background: T.goldBg, borderRadius: 12, border: `1px solid ${T.goldBorder}` }}>
            <Avatar initials="DS" color={T.gold} size={56} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 600, color: T.text }}>Daniel Scott</div>
              <div style={{ fontSize: 12, color: T.gold, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Icon name="shield" size={12} color={T.gold} /> Platinum Member · Since 2018
              </div>
              <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>daniel.scott@email.com</div>
            </div>
          </div>
          {[
            { l: "Full Name", v: "Daniel Scott" },
            { l: "Email",     v: "daniel.scott@email.com" },
            { l: "Phone",     v: "+1 (555) 842-9210" },
            { l: "Address",   v: "1420 Harbor Blvd, Suite 300" },
            { l: "City",      v: "New York, NY 10001" },
          ].map((r, i) => (
            <div key={i} style={{ marginBottom: 12 }}>
              <label style={{ display: "block", fontSize: 11, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>{r.l}</label>
              <input className="input-field" defaultValue={r.v} />
            </div>
          ))}
          <button className="btn-primary" style={{ width: "100%", marginTop: 8 }}>Save Changes</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <div className="slb-serif" style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 16 }}>Security Preferences</div>
            {[
              { l: "Two-Factor Authentication", sub: "SMS & Authenticator app",     on: t2fa,      set: setT2fa      },
              { l: "Push Notifications",        sub: "Transaction and login alerts", on: notif,     set: setNotif     },
              { l: "Biometric Login",           sub: "Face ID / Fingerprint",       on: biometric,  set: setBiometric  },
              { l: "E-Statements",              sub: "Monthly PDF statements",      on: stmts,     set: setStmts     },
            ].map((s, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{s.l}</div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{s.sub}</div>
                </div>
                <Toggle on={s.on} set={s.set} />
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div className="slb-serif" style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 16 }}>Change Password</div>
            {["Current Password", "New Password", "Confirm New Password"].map((p, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>{p}</label>
                <input type="password" className="input-field" placeholder="••••••••••" />
              </div>
            ))}
            <button className="btn-secondary" style={{ width: "100%" }}>Update Password</button>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div className="slb-serif" style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 12 }}>Login Activity</div>
            {[
              { loc: "New York, NY",   time: "Today 9:14 AM",     device: "Chrome · Windows 11", current: true  },
              { loc: "Boston, MA",     time: "May 26, 4:22 PM",   device: "Safari · iPhone 15",  current: false },
              { loc: "New York, NY",   time: "May 24, 11:08 AM",  device: "Chrome · Windows 11", current: false },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                <div style={{ width: 8, height: 8, borderRadius: 4, background: a.current ? T.green : T.border, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>
                    {a.loc} {a.current && <span style={{ fontSize: 11, color: T.green, fontWeight: 400 }}>(Current)</span>}
                  </div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{a.device} · {a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── HELP ──────────────────────────────────────────────────── */
function HelpPage({ T }) {
  const [openFaq, setOpenFaq] = useState(null);
  const FAQS = [
    { q: "How long do domestic transfers take to process?", a: "Domestic transfers between U.S. banks are typically processed within 2–5 business days, depending on the receiving institution's processing schedule. Transfers initiated after business hours or on weekends and holidays will begin processing on the next business day." },
    { q: "How long do international wire transfers take?", a: "International wire transfers generally take 2–7 business days to reach the recipient's account, depending on the destination country, intermediary banks, and any required compliance review. Additional documentation may extend processing time." },
    { q: "How do I add a new beneficiary?", a: "Navigate to Transfers, then select Saved Contacts and choose Add New. Enter the recipient's full name, account number, and routing information. New beneficiaries are subject to a standard verification period of up to 1 business day before they can be used for transfers." },
    { q: "What are the fees for Platinum accounts?", a: "Platinum members enjoy zero monthly maintenance fees and zero domestic wire fees on transfers up to $50,000 per month. International wire transfers may be subject to intermediary bank fees, which vary by destination and are disclosed prior to confirmation." },
    { q: "How do I dispute a transaction?", a: "Select the transaction in your transaction history and choose Dispute Transaction. Our team will review the dispute and respond within 2–5 business days. If additional investigation is required, resolution may take up to 10 business days, and you will be notified of the outcome by email." },
    { q: "How do I request an increase to my transfer limit?", a: "Limit increase requests can be submitted by contacting Priority Banking support. Requests are reviewed on a case-by-case basis and typically processed within 2–3 business days." },
  ];
  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif page-title" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Help Center</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>24/7 Platinum Priority Support</div>
      </div>
      <div className="help-contact-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "phone", label: "Call Us",      sub: "1-800-SLB-PLAT" },
          { icon: "chat",  label: "Live Chat",    sub: "Under 30 sec wait" },
          { icon: "mail",  label: "Email Support", sub: "platinum@slbank.com" },
        ].map((c, i) => (
          <div key={i} className="card hover-lift" style={{ padding: 20, textAlign: "center", cursor: "pointer" }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: T.goldBg, border: `1px solid ${T.goldBorder}`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <Icon name={c.icon} size={20} color={T.gold} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 3 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: T.gold, fontWeight: 500 }}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div className="help-grid" style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <div className="slb-serif" style={{ fontSize: 15, fontWeight: 500, color: T.text, marginBottom: 16 }}>Frequently Asked Questions</div>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
              <div onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", cursor: "pointer" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{f.q}</span>
                <div style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", flexShrink: 0, marginLeft: 12 }}>
                  <Icon name="plus" size={16} color={T.gold} />
                </div>
              </div>
              {openFaq === i && (
                <div style={{ padding: "0 0 14px", fontSize: 13, color: T.textSub, lineHeight: 1.7 }}>{f.a}</div>
              )}
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <div className="slb-serif" style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 14 }}>Quick Actions</div>
            {[
              { label: "Download Statement",    icon: "doc" },
              { label: "Freeze Card Instantly", icon: "lock" },
              { label: "Credit Report",         icon: "chart" },
              { label: "Rewards Catalog",       icon: "shield" },
              { label: "ATM Locator",           icon: "location" },
              { label: "FATCA Declaration",     icon: "doc" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", borderRadius: 8, fontSize: 13, color: T.text, cursor: "pointer", border: `1px solid ${T.border}`, marginBottom: 6, transition: "all 0.15s" }}
                onMouseEnter={e => { e.currentTarget.style.background = T.goldBg; e.currentTarget.style.borderColor = T.goldBorder; }}
                onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = T.border; }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Icon name={a.icon} size={14} color={T.textSub} />
                  {a.label}
                </div>
                <Icon name="arrow" size={14} color={T.gold} />
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20, borderTop: `3px solid ${T.gold}` }}>
            <div style={{ fontSize: 11, color: T.gold, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Platinum Priority</div>
            <div className="slb-serif" style={{ fontSize: 15, fontWeight: 500, color: T.text, marginBottom: 6 }}>Your Relationship Manager</div>
            <div style={{ fontSize: 12.5, color: T.textSub, marginBottom: 14, lineHeight: 1.6 }}>Your personal banker is available 24/7 for all your banking and investment needs.</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Victoria Okonkwo</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 14, display: "flex", alignItems: "center", gap: 5, marginTop: 3 }}>
              <Icon name="phone" size={12} color={T.textMuted} /> +1 (800) 752-4821 ext. 3
            </div>
            <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
              <Icon name="phone" size={14} color="white" /> Schedule a Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── MOBILE BOTTOM NAV ─────────────────────────────────────── */
function MobileNav({ page, setPage, T }) {
  const items = [
    { id: "dashboard",    label: "Home",    icon: "home"     },
    { id: "transactions", label: "History", icon: "list"     },
    { id: "transfers",    label: "Send",    icon: "transfer" },
    { id: "investments",  label: "Invest",  icon: "chart"    },
    { id: "settings",     label: "Account", icon: "settings" },
  ];
  return (
    <div className="mobile-bottom-nav">
      {items.map(item => (
        <button key={item.id} onClick={() => setPage(item.id)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 8px", minWidth: 52 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: page === item.id ? T.goldBg : "transparent", border: page === item.id ? `1px solid ${T.goldBorder}` : "1px solid transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.15s" }}>
            <Icon name={item.icon} size={17} color={page === item.id ? T.gold : T.textMuted} />
          </div>
          <span style={{ fontSize: 10, fontWeight: page === item.id ? 500 : 400, color: page === item.id ? T.gold : T.textMuted, fontFamily: "Inter, sans-serif", letterSpacing: "0.01em" }}>{item.label}</span>
        </button>
      ))}
    </div>
  );
}

/* ─── NOTIFICATIONS DATA ────────────────────────────────────── */
const NOTIFS = [
  { id:1, title:"Card Transaction",        msg:"Apple Store — $1,299.00 debited",          time:"Jun 14, 2026", read:false, type:"info"    },
  { id:2, title:"Wire Transfer Sent",      msg:"$2,500.00 sent to Sarah Johnson",          time:"Jun 12, 2026", read:false, type:"info"    },
  { id:3, title:"Wire Transfer Received",  msg:"+$52,000.00 incoming wire credited",       time:"Jun 10, 2026", read:false, type:"success" },
  { id:4, title:"Card Transaction",        msg:"Netflix — $15.99 debited",                 time:"Jun 9, 2026",  read:true,  type:"info"    },
  { id:5, title:"Deposit Received",        msg:"Monthly remuneration of $18,500.00 credited", time:"Jun 5, 2026", read:true,  type:"success" },
  { id:6, title:"Wire Transfer Sent",      msg:"$7,800.00 sent to David Brown",            time:"Jun 3, 2026",  read:true,  type:"info"    },
  { id:7, title:"Statement Available",     msg:"May 2026 statement ready for download",    time:"Jun 1, 2026",  read:true,  type:"info"    },
];

/* ─── APP ROOT ──────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(false);
  const T = TOKENS[dark ? "dark" : "light"];

  const [isMobile, setIsMobile] = useState(() => typeof window !== "undefined" && window.innerWidth <= 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const [stage, setStage] = useState("login");
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true); // always defaults open on desktop
  const [showNotif, setShowNotif] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [code, setCode] = useState("");

  // Close sidebar by default on mobile
  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
    else setSidebarOpen(true);
  }, [isMobile]);

  useEffect(() => {
    const el = document.createElement("style");
    el.id = "slb-global-styles";
    el.textContent = buildCSS(T);
    const existing = document.getElementById("slb-global-styles");
    if (existing) existing.remove();
    document.head.appendChild(el);
  }, [dark]);

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStage("verify"); }, 1500);
  };

  const handleVerify = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); setStage("dashboard"); setPage("dashboard"); }, 1500);
  };

  const handleLogout = () => {
    setStage("loggingOut");
    setShowNotif(false);
    setTimeout(() => {
      setUsername("");
      setPassword("");
      setCode("");
      setPage("dashboard");
      setStage("login");
    }, 900);
  };

  const handlePageChange = (p) => {
    setPage(p);
    setShowNotif(false);
    if (isMobile) setSidebarOpen(false);
  };

  if (stage === "login") return (
    <LoginPage username={username} setUsername={setUsername}
      password={password} setPassword={setPassword}
      rememberMe={rememberMe} setRememberMe={setRememberMe}
      loading={loading} onLogin={handleLogin} T={T} />
  );

  if (stage === "verify") return (
    <VerifyCodePage code={code} setCode={setCode}
      loading={loading} onVerify={handleVerify}
      onBack={() => { setCode(""); setStage("login"); }} T={T} />
  );

  if (stage === "loggingOut") return (
    <div className="slb fade-in" style={{ minHeight: "100dvh", background: T.bgAlt, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}>
        <BrandMark size={64} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10, color: T.textSub, fontSize: 14 }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        Signing you out securely...
      </div>
    </div>
  );


  return (
    <div className="slb" style={{ display: "flex", height: "100dvh", minHeight: "-webkit-fill-available", background: T.bgAlt, color: T.text, overflow: "hidden", position: "relative", width: "100%" }}>

      {/* Desktop sidebar — always in flow */}
      {!isMobile && (
        <Sidebar currentPage={page} setCurrentPage={handlePageChange}
          isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
          T={T} isMobile={false} onLogout={handleLogout} />
      )}

      {/* Mobile sidebar — fixed/overlay */}
      {isMobile && (
        <Sidebar currentPage={page} setCurrentPage={handlePageChange}
          isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}
          T={T} isMobile={true} onLogout={handleLogout} />
      )}

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar
          setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}
          showNotif={showNotif} setShowNotif={setShowNotif}
          dark={dark} setDark={setDark} T={T} NOTIFS={NOTIFS} isMobile={isMobile} onLogout={handleLogout}
        />

        <main onClick={() => setShowNotif(false)}
          className="main-content"
          style={{ flex: 1, overflowY: "auto", overflowX: "hidden", padding: "24px 28px", background: T.bgAlt, WebkitOverflowScrolling: "touch" }}>
          {page === "dashboard"    && <DashboardHome setCurrentPage={handlePageChange} T={T} />}
          {page === "transactions" && <TransactionsPage T={T} />}
          {page === "cards"        && <CardsPage T={T} />}
          {page === "transfers"    && <TransfersPage T={T} />}
          {page === "investments"  && <InvestmentsPage T={T} />}
          {page === "settings"     && <SettingsPage T={T} />}
          {page === "help"         && <HelpPage T={T} />}
        </main>

        {/* Mobile bottom nav — fixed at bottom */}
        {isMobile && <MobileNav page={page} setPage={handlePageChange} T={T} />}
      </div>
    </div>
  );
}
