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
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 4px; }
  .slb { font-family: 'DM Sans', sans-serif; }
  .slb-serif { font-family: 'Playfair Display', serif; }
  .slb-mono { font-family: 'DM Mono', monospace; }
  .slb-balance { font-family: 'Playfair Display', serif; font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }
  
  .fade-in { animation: fadeIn 0.35s ease; }
  @keyframes fadeIn { from { opacity:0; transform: translateY(10px); } to { opacity:1; transform: translateY(0); } }
  
  .nav-item {
    display: flex; align-items: center; gap: 10px;
    padding: 9px 12px; border-radius: 8px; cursor: pointer;
    font-size: 13.5px; font-weight: 400; color: ${T.textSub};
    transition: background 0.15s, color 0.15s; user-select: none;
    border-left: 2px solid transparent;
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
    font-weight: 500; cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: opacity 0.15s, transform 0.1s; letter-spacing: 0.01em;
  }
  .btn-primary:hover { opacity: 0.9; transform: translateY(-1px); }
  .btn-primary:active { transform: translateY(0); }
  
  .btn-secondary {
    background: transparent; color: ${T.textSub};
    border: 1px solid ${T.border}; padding: 9px 18px;
    border-radius: 8px; font-size: 13px; font-weight: 400;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .btn-secondary:hover { background: ${T.surfaceAlt}; border-color: ${T.borderStrong}; color: ${T.text}; }
  
  .input-field {
    width: 100%; background: ${T.surfaceAlt}; border: 1px solid ${T.border};
    border-radius: 8px; padding: 10px 13px; font-size: 13.5px;
    color: ${T.text}; outline: none; font-family: 'DM Sans', sans-serif;
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
    font-family: 'DM Sans', sans-serif; transition: all 0.15s;
  }
  .tag-filter:hover { border-color: ${T.goldBorder}; color: ${T.gold}; background: ${T.goldBg}; }
  .tag-filter.active { background: ${T.gold}; color: #fff; border-color: ${T.gold}; }
  
  .account-chip {
    background: ${T.goldBg}; border: 1px solid ${T.goldBorder};
    border-radius: 8px; padding: 5px 12px; font-size: 12px;
    color: ${T.gold}; font-weight: 500;
  }
  
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
const BrandMark = ({ size = 36, dark = false }) => {
  const gold = dark ? "#D4A017" : "#B8860B";
  const bg = dark ? "#1C1608" : "#FBF4E3";
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      <rect width="40" height="40" rx="10" fill={bg}/>
      <rect x="1" y="1" width="38" height="38" rx="9" stroke={gold} strokeWidth="1" strokeOpacity="0.4"/>
      <text x="20" y="27" textAnchor="middle" fontFamily="Playfair Display, serif"
        fontSize="18" fontWeight="600" fill={gold} letterSpacing="-0.5">SL</text>
      <line x1="9" y1="31" x2="31" y2="31" stroke={gold} strokeWidth="1" strokeOpacity="0.4"/>
    </svg>
  );
};

/* ─── STATIC DATA ───────────────────────────────────────────── */
const TXNS = [
  { id:1, name:"Apple Store",        type:"debit",  amount:-1299.00, date:"May 27, 2026", cat:"Shopping",     ref:"TXN-2026-0001" },
  { id:2, name:"Incoming Wire",       type:"credit", amount:52000.00, date:"May 25, 2026", cat:"Transfer",     ref:"TXN-2026-0002" },
  { id:3, name:"Netflix",             type:"debit",  amount:-15.99,   date:"May 24, 2026", cat:"Entertainment",ref:"TXN-2026-0003" },
  { id:4, name:"Salary Deposit",      type:"credit", amount:18500.00, date:"May 20, 2026", cat:"Income",       ref:"TXN-2026-0004" },
  { id:5, name:"Wire Transfer Out",   type:"debit",  amount:-7800.00, date:"May 18, 2026", cat:"Transfer",     ref:"TXN-2026-0005" },
  { id:6, name:"Amazon",              type:"debit",  amount:-245.60,  date:"May 15, 2026", cat:"Shopping",     ref:"TXN-2026-0006" },
  { id:7, name:"Dividend Payment",    type:"credit", amount:3240.00,  date:"May 10, 2026", cat:"Investment",   ref:"TXN-2026-0007" },
  { id:8, name:"Marriott New York",   type:"debit",  amount:-890.00,  date:"May 8, 2026",  cat:"Travel",       ref:"TXN-2026-0008" },
  { id:9, name:"Freelance Income",    type:"credit", amount:5500.00,  date:"May 5, 2026",  cat:"Income",       ref:"TXN-2026-0009" },
  { id:10,name:"Gold's Gym",          type:"debit",  amount:-120.00,  date:"May 1, 2026",  cat:"Health",       ref:"TXN-2026-0010" },
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
  {name:"Sarah Johnson",  bank:"JPMorgan Chase", acc:"••••4521", initials:"SJ", color:"#6D28D9"},
  {name:"Michael Chen",   bank:"Wells Fargo",    acc:"••••8834", initials:"MC", color:"#1D4ED8"},
  {name:"Emma Williams",  bank:"Citibank",       acc:"••••2290", initials:"EW", color:"#1A6B3C"},
  {name:"David Brown",    bank:"Bank of America",acc:"••••6677", initials:"DB", color:"#B8860B"},
];

/* ─── ICON COMPONENTS (professional SVG, no emoji) ─────────── */
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

const Avatar = ({ initials, color, size = 36 }) => (
  <div style={{
    width: size, height: size, borderRadius: size / 2,
    background: color + "18", border: `1px solid ${color}30`,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontSize: size * 0.33, fontWeight: 500, color, flexShrink: 0,
    fontFamily: "DM Sans, sans-serif"
  }}>{initials}</div>
);

/* ─── STAT CARD ──────────────────────────────────────────────── */
const StatCard = ({ label, value, sub, icon, trend, T }) => (
  <div className="card hover-lift" style={{ padding: "18px 20px", flex: 1, minWidth: 160 }}>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
      <span style={{ fontSize: 11, fontWeight: 500, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      <IconCircle iconName={icon} size={34} T={T} />
    </div>
    <div style={{ fontSize: 22, fontWeight: 600, color: T.text, fontFamily: "DM Mono, monospace", letterSpacing: "-0.02em" }}>{value}</div>
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

/* ─── LOGIN ──────────────────────────────────────────────────── */
function LoginPage({ username, setUsername, password, setPassword, rememberMe, setRememberMe, loading, onLogin, T, dark }) {
  const [showPw, setShowPw] = useState(false);
  const now = useLiveClock();
  return (
    <div className="slb" style={{ minHeight: "100vh", background: T.bgAlt, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight}, ${T.gold})` }} />

      <div className="fade-in" style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <BrandMark size={52} dark={dark} />
          </div>
          <div className="slb-serif" style={{ fontSize: 20, color: T.text, fontWeight: 600, letterSpacing: "0.04em" }}>
            Saving Life & Property Bank
          </div>
          <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: "0.12em", marginTop: 4, textTransform: "uppercase" }}>
            Private Banking · Est. 2001
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "36px 32px", boxShadow: T.shadowLg }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 18, fontWeight: 600, color: T.text, fontFamily: "Playfair Display, serif" }}>Welcome back</div>
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

/* ─── PIN PAGE ───────────────────────────────────────────────── */
const CORRECT_PIN = "35685";
function PinPage({ onSuccess, T }) {
  const [pin, setPin] = useState(["", "", "", "", ""]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const inputRefs = [useRef(), useRef(), useRef(), useRef(), useRef()];
  const now = useLiveClock();

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...pin];
    next[i] = val;
    setPin(next);
    setError(false);
    if (val && i < 4) inputRefs[i + 1].current.focus();
    if (next.every(d => d !== "") && val) {
      const entered = next.join("");
      setVerifying(true);
      setTimeout(() => {
        if (entered === CORRECT_PIN) {
          onSuccess();
        } else {
          setShake(true);
          setError(true);
          setVerifying(false);
          setPin(["", "", "", "", ""]);
          setTimeout(() => { setShake(false); inputRefs[0].current.focus(); }, 600);
        }
      }, 900);
    }
  };

  const handleKeyDown = (i, e) => {
    if (e.key === "Backspace" && !pin[i] && i > 0) inputRefs[i - 1].current.focus();
  };

  return (
    <div className="slb" style={{ minHeight: "100vh", background: T.bgAlt, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight}, ${T.gold})` }} />

      <div className="fade-in" style={{ width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <BrandMark size={48} dark={T.bg.startsWith("#0")} />
          </div>
          <div className="slb-serif" style={{ fontSize: 17, color: T.text, fontWeight: 600, letterSpacing: "0.04em" }}>
            Saving Life & Property Bank
          </div>
        </div>

        <div style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 16, padding: "36px 32px", boxShadow: T.shadowLg }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <div style={{ width: 54, height: 54, borderRadius: 27, background: T.goldBg, border: `1px solid ${T.goldBorder}`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <Icon name="shield" size={24} color={T.gold} />
            </div>
            <div className="slb-serif" style={{ fontSize: 18, color: T.text, fontWeight: 500, marginBottom: 6 }}>Security Verification</div>
            <div style={{ fontSize: 13, color: T.textSub }}>Enter your 5-digit PIN to continue</div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
            {pin.map((d, i) => (
              <div key={i} style={{ width: 12, height: 12, borderRadius: 6, background: d ? T.gold : T.border, transition: "background 0.2s" }} />
            ))}
          </div>

          <div style={{
            display: "flex", justifyContent: "center", gap: 10, marginBottom: 8,
            animation: shake ? "shakePin 0.5s ease" : "none"
          }}>
            <style>{`@keyframes shakePin{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
            {pin.map((d, i) => (
              <input key={i} ref={inputRefs[i]} type="password" inputMode="numeric"
                maxLength={1} value={d} onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)} autoFocus={i === 0}
                style={{
                  width: 52, height: 58, borderRadius: 10, textAlign: "center",
                  background: error ? T.redBg : T.surfaceAlt, fontFamily: "DM Mono",
                  border: `1.5px solid ${error ? T.red : d ? T.gold : T.border}`,
                  color: T.text, fontSize: 20, fontWeight: 500, outline: "none",
                  caretColor: "transparent", transition: "all 0.15s",
                  boxShadow: d && !error ? `0 0 0 3px ${T.goldBorder}` : "none"
                }} />
            ))}
          </div>

          {error && (
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: T.red, fontWeight: 500, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Icon name="x" size={14} color={T.red} />
              Incorrect PIN. Please try again.
            </div>
          )}
          {verifying && (
            <div style={{ textAlign: "center", marginTop: 12, fontSize: 13, color: T.gold, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={T.gold} strokeWidth="2" style={{ animation: "spin 1s linear infinite" }}>
                <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
              </svg>
              Verifying...
            </div>
          )}

          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 24, fontSize: 11.5, color: T.textMuted }}>
            <Icon name="shield" size={13} color={T.textMuted} />
            256-bit SSL · PCI DSS Compliant
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 11.5, color: T.textMuted }}>
          © 2026 Saving Life and Property Bank, N.A. · Member FDIC
        </div>
      </div>
    </div>
  );
}

/* ─── SIDEBAR ────────────────────────────────────────────────── */
const NAV_ITEMS = [
  { id: "dashboard",    label: "Dashboard",    icon: "home",      group: "main" },
  { id: "transactions", label: "Transactions", icon: "list",      group: "main" },
  { id: "cards",        label: "Cards",        icon: "card",      group: "main" },
  { id: "transfers",    label: "Transfers",    icon: "transfer",  group: "main" },
  { id: "investments",  label: "Investments",  icon: "chart",     group: "main" },
  { id: "settings",     label: "Settings",     icon: "settings",  group: "account" },
  { id: "help",         label: "Help Center",  icon: "help",      group: "account" },
];

function Sidebar({ currentPage, setCurrentPage, isOpen, T }) {
  return (
    <div style={{
      width: isOpen ? 234 : 0, overflow: "hidden",
      background: T.nav, borderRight: `1px solid ${T.navBorder}`,
      flexShrink: 0, transition: "width 0.3s ease", display: "flex", flexDirection: "column"
    }}>
      <div style={{ width: 234, height: "100%", display: "flex", flexDirection: "column", padding: "20px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 6, marginBottom: 28 }}>
          <BrandMark size={36} dark={T.bg.startsWith("#0")} />
          <div>
            <div className="slb-serif" style={{ fontSize: 13, color: T.text, letterSpacing: "0.03em", lineHeight: 1.2 }}>Saving Life Bank</div>
            <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" }}>Private Banking</div>
          </div>
        </div>

        <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, marginBottom: 8, paddingLeft: 6 }}>Main</div>
        {NAV_ITEMS.filter(n => n.group === "main").map(item => (
          <div key={item.id} className={`nav-item${currentPage === item.id ? " active" : ""}`}
            onClick={() => setCurrentPage(item.id)}>
            <Icon name={item.icon} size={16} color={currentPage === item.id ? T.gold : T.textSub} />
            {item.label}
          </div>
        ))}

        <div style={{ fontSize: 10, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, margin: "20px 0 8px", paddingLeft: 6 }}>Account</div>
        {NAV_ITEMS.filter(n => n.group === "account").map(item => (
          <div key={item.id} className={`nav-item${currentPage === item.id ? " active" : ""}`}
            onClick={() => setCurrentPage(item.id)}>
            <Icon name={item.icon} size={16} color={currentPage === item.id ? T.gold : T.textSub} />
            {item.label}
          </div>
        ))}

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
  );
}

/* ─── TOP BAR ────────────────────────────────────────────────── */
function TopBar({ setSidebarOpen, sidebarOpen, showNotif, setShowNotif, dark, setDark, T, NOTIFS }) {
  const unread = NOTIFS.filter(n => !n.read).length;
  return (
    <div style={{ background: T.nav, borderBottom: `1px solid ${T.navBorder}`, padding: "0 24px", height: 62, display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0, position: "relative", zIndex: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{ background: "none", border: "none", cursor: "pointer", display: "flex", padding: 6, borderRadius: 6, color: T.textSub }}>
          <Icon name="menu" size={18} color={T.textSub} />
        </button>
        <div style={{ display: "flex", alignItems: "center", gap: 8, background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px" }}>
          <Icon name="search" size={15} color={T.textMuted} />
          <input placeholder="Search transactions, accounts..." className="slb" style={{ background: "none", border: "none", outline: "none", color: T.text, fontSize: 13, width: 220 }} />
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
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
            <div style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 320, background: T.surface, border: `1px solid ${T.borderStrong}`, borderRadius: 12, boxShadow: T.shadowLg, zIndex: 100 }}>
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

        <div style={{ display: "flex", alignItems: "center", gap: 10, paddingLeft: 6, borderLeft: `1px solid ${T.border}`, marginLeft: 2 }}>
          <Avatar initials="DS" color={T.gold} size={34} />
          <div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>Daniel Scott</div>
            <div style={{ fontSize: 11, color: T.gold, display: "flex", alignItems: "center", gap: 3 }}>
              <Icon name="shield" size={11} color={T.gold} /> Platinum · Active
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── DASHBOARD ──────────────────────────────────────────────── */
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
      <div style={{ background: T.surface, border: `1px solid ${T.borderStrong}`, borderRadius: 16, padding: "28px 32px", marginBottom: 20, boxShadow: T.shadowMd, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight}, ${T.gold})` }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: T.textMuted, letterSpacing: "0.1em", textTransform: "uppercase", fontWeight: 500, marginBottom: 10 }}>Total Balance</div>
            <div className="slb-balance" style={{ fontSize: 48, color: T.text, lineHeight: 1 }}>
              $765,465<span style={{ color: T.gold, fontSize: 38 }}>.44</span>
            </div>
            <div style={{ display: "flex", gap: 28, marginTop: 18, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 10.5, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>Available</div>
                <div style={{ fontSize: 18, fontWeight: 500, color: T.green, fontFamily: "DM Mono" }}>$762,120.10</div>
              </div>
              <div style={{ width: 1, background: T.border }} />
              <div>
                <div style={{ fontSize: 10.5, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 4 }}>Pending</div>
                <div style={{ fontSize: 18, fontWeight: 500, color: "#D97706", fontFamily: "DM Mono" }}>$3,345.34</div>
              </div>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <span className="pill-badge badge-green" style={{ marginBottom: 12, display: "inline-flex" }}>
              <Icon name="trend" size={11} color={T.green} /> +12.4% this month
            </span>
            <div style={{ fontSize: 12.5, color: T.textSub }}>Premium Checking Account</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 5, fontFamily: "DM Mono" }}>4589-22108</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 3 }}>Member since 2018</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Monthly Income"  value="$74,240" icon="dollar"    trend="up"   sub="+18% vs last month" T={T} />
        <StatCard label="Monthly Spend"   value="$11,670" icon="card"      trend="down" sub="-5% vs last month"  T={T} />
        <StatCard label="Portfolio Value" value="$312,000" icon="portfolio" trend="up"   sub="+12.4% this year"  T={T} />
        <StatCard label="Savings Rate"    value="84.3%"   icon="shield"    sub="Excellent standing" T={T} />
      </div>

      {/* Charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Balance History</div>
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
              <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Weekly Cash Flow</div>
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
      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 1fr", gap: 16, marginBottom: 20 }}>
        {/* Transactions */}
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Recent Activity</div>
            <button className="btn-secondary" onClick={() => setCurrentPage("transactions")} style={{ padding: "5px 12px", fontSize: 12 }}>View all</button>
          </div>
          {TXNS.slice(0, 5).map(t => (
            <div key={t.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: T.goldBg, border: `1px solid ${T.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon name={t.type === "credit" ? "dollar" : "card"} size={16} color={T.gold} />
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
          <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 2 }}>Portfolio Mix</div>
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
          <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 2, display: "flex", alignItems: "center", gap: 7 }}>
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
              className="input-field" style={{ fontFamily: "DM Sans" }}>
              {Object.keys(convRate).map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{ background: T.goldBg, borderRadius: 10, padding: "14px", textAlign: "center", border: `1px solid ${T.goldBorder}` }}>
            <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>Result</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: T.gold, fontFamily: "DM Mono" }}>{converted}</div>
            <div style={{ fontSize: 11, color: T.textMuted, marginTop: 4 }}>1 USD = {convRate[toCurr]} {toCurr}</div>
          </div>
        </div>
      </div>

      {/* Beneficiaries + Security */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Saved Beneficiaries</div>
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
              <button className="btn-secondary" style={{ padding: "4px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 4 }}>
                <Icon name="send" size={12} color={T.textSub} /> Send
              </button>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 16, display: "flex", alignItems: "center", gap: 7 }}>
            <Icon name="shield" size={15} color={T.gold} /> Account Details
          </div>
          {[
            { label: "Account Number",  value: "4589-22108" },
            { label: "Routing Number",  value: "021000021" },
            { label: "IBAN",            value: "US64FTBK4589221088412291" },
            { label: "SWIFT/BIC",       value: "FTBKUS44" },
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

/* ─── TRANSACTIONS ───────────────────────────────────────────── */
function TransactionsPage({ T }) {
  const [filter, setFilter] = useState("All");
  const cats = ["All", "Income", "Shopping", "Transfer", "Entertainment", "Travel", "Investment", "Health"];
  const list = filter === "All" ? TXNS : TXNS.filter(t => filter === "Income" ? t.type === "credit" : t.cat === filter);
  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Transactions</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Full transaction history and activity</div>
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Total Credits" value="$77,480" icon="dollar"   trend="up"   sub="This month" T={T} />
        <StatCard label="Total Debits"  value="$11,670" icon="card"     trend="down" sub="This month" T={T} />
        <StatCard label="Net Cash Flow" value="+$65,810" icon="trend"   trend="up"   sub="Positive"   T={T} />
        <StatCard label="Transactions"  value="10"      icon="list"     sub="This month"              T={T} />
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        {cats.map(c => (
          <button key={c} className={`tag-filter${filter === c ? " active" : ""}`} onClick={() => setFilter(c)}>{c}</button>
        ))}
      </div>
      <div className="card" style={{ overflow: "hidden" }}>
        <div style={{ padding: "12px 20px", borderBottom: `1px solid ${T.border}`, display: "grid", gridTemplateColumns: "36px 1fr 130px 110px 110px 100px", gap: 12 }}>
          {["", "Description", "Date", "Category", "Amount", "Status"].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 500, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {list.map(t => (
          <div key={t.id} className="table-row" style={{ gridTemplateColumns: "36px 1fr 130px 110px 110px 100px" }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: T.goldBg, border: `1px solid ${T.goldBorder}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={t.type === "credit" ? "dollar" : "card"} size={14} color={T.gold} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{t.name}</div>
              <div style={{ fontSize: 11, color: T.textMuted }}>{t.ref}</div>
            </div>
            <div style={{ fontSize: 12, color: T.textSub }}>{t.date}</div>
            <span className="pill-badge" style={{ background: T.surfaceAlt, color: T.textSub, border: `1px solid ${T.border}`, fontSize: 11 }}>{t.cat}</span>
            <div style={{ fontSize: 13, fontWeight: 600, color: t.type === "credit" ? T.green : T.text, fontFamily: "DM Mono" }}>
              {t.type === "credit" ? "+" : "−"}${Math.abs(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </div>
            <span className="pill-badge badge-green" style={{ fontSize: 11 }}>
              <Icon name="check" size={10} color={T.green} /> Settled
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── CARDS ──────────────────────────────────────────────────── */
function CardsPage({ T }) {
  const [selected, setSelected] = useState(0);
  const CARDS = [
    { label: "Premium Debit", num: "4589 •••• •••• 2210", exp: "08/29", name: "DANIEL SCOTT", network: "VISA", value: "$762,120.10", valueLabel: "Available Balance", accent: T.gold, accentBg: "#FAF6EC" },
    { label: "World Credit",  num: "5211 •••• •••• 8840", exp: "12/27", name: "DANIEL SCOTT", network: "MC",   value: "$50,000",      valueLabel: "Credit Limit",      accent: "#7C3AED", accentBg: "#F5F3FF" },
    { label: "Travel Rewards",num: "3782 •••• •••• 8220", exp: "03/28", name: "DANIEL SCOTT", network: "AMEX", value: "$2,341",        valueLabel: "Cashback Earned",    accent: "#1A6B3C", accentBg: "#ECFDF5" },
  ];
  const c = CARDS[selected];
  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Cards</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Manage your debit and credit cards</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
            {CARDS.map((cd, i) => (
              <button key={i} onClick={() => setSelected(i)}
                style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500, cursor: "pointer", border: `1px solid ${selected === i ? cd.accent : T.border}`, background: selected === i ? cd.accent + "14" : T.surface, color: selected === i ? cd.accent : T.textSub, transition: "all 0.15s", fontFamily: "DM Sans" }}>
                {cd.label}
              </button>
            ))}
          </div>

          {/* Card visual */}
          <div style={{ width: "100%", aspectRatio: "1.586", borderRadius: 16, background: T.surfaceAlt, border: `1px solid ${T.borderStrong}`, padding: 24, position: "relative", overflow: "hidden", boxShadow: T.shadowLg }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, ${c.accent}, ${c.accent}88, ${c.accent})` }} />
            <div style={{ position: "absolute", right: -30, bottom: -40, width: 200, height: 200, borderRadius: "50%", border: `1px solid ${c.accent}15` }} />
            <div style={{ position: "absolute", right: 10, bottom: -20, width: 150, height: 150, borderRadius: "50%", border: `1px solid ${c.accent}08` }} />

            {/* Chip */}
            <div style={{ width: 42, height: 32, borderRadius: 5, background: `linear-gradient(135deg, #D4AF37, #A07830)`, marginBottom: 20, position: "relative" }}>
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
            <div style={{ position: "absolute", right: 20, top: 20 }}>
              <Icon name="globe" size={18} color={c.accent + "60"} />
            </div>
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
            {[
              { label: "Freeze Card", icon: "lock" },
              { label: "Set Limits", icon: "shield" },
              { label: "Replace", icon: "dots" },
            ].map((btn, i) => (
              <button key={i} className="btn-secondary" style={{ flex: 1, padding: "9px 6px", fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                <Icon name={btn.icon} size={13} color={T.textSub} /> {btn.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="card" style={{ padding: 20, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 14 }}>Card Details</div>
            {[
              { l: "Card Type",      v: c.label },
              { l: "Network",        v: c.network },
              { l: "Card Number",    v: c.num },
              { l: "Expiry",         v: c.exp },
              { l: "CVV",            v: "•••" },
              { l: c.valueLabel,     v: c.value },
            ].map((r, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontSize: 12, color: T.textSub }}>{r.l}</span>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.text, fontFamily: ["Card Number", "CVV", "Expiry"].includes(r.l) ? "DM Mono" : "DM Sans" }}>{r.v}</span>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 14 }}>Monthly Spending</div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 7 }}>
                <span style={{ color: T.textSub }}>May 2026</span>
                <span style={{ color: T.text, fontWeight: 500, fontFamily: "DM Mono" }}>$11,670 / $30,000</span>
              </div>
              <div style={{ height: 6, borderRadius: 3, background: T.border }}>
                <div style={{ height: "100%", width: "38.9%", borderRadius: 3, background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})` }} />
              </div>
              <div style={{ fontSize: 11, color: T.textMuted, marginTop: 5 }}>38.9% of monthly limit used</div>
            </div>
            <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
              <Icon name="plus" size={14} color="white" /> Add New Card
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── TRANSFERS ──────────────────────────────────────────────── */
function TransfersPage({ T }) {
  const [step, setStep] = useState(1);
  const [recip, setRecip] = useState("");
  const [amt, setAmt] = useState("");
  const [note, setNote] = useState("");

  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Send Money</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Domestic and international wire transfers</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
        <div className="card-elevated" style={{ padding: 28 }}>
          {/* Stepper */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 28 }}>
            {[1, 2, 3].map(s => (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 600, transition: "all 0.3s",
                  background: step > s ? T.gold : step === s ? T.gold : T.border,
                  color: step >= s ? "#fff" : T.textMuted,
                  border: `2px solid ${step >= s ? T.gold : T.border}`,
                }}>
                  {step > s ? <Icon name="check" size={12} color="white" /> : s}
                </div>
                {s < 3 && <div style={{ width: 40, height: 2, background: step > s ? T.gold : T.border, borderRadius: 1 }} />}
              </div>
            ))}
            <span style={{ fontSize: 12, color: T.textSub, marginLeft: 8 }}>
              {step === 1 ? "Select Recipient" : step === 2 ? "Enter Amount" : "Review & Confirm"}
            </span>
          </div>

          {step === 1 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 16 }}>Select Recipient</div>
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
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 11, color: T.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 8 }}>Or Enter Account Number</div>
                <input className="input-field" placeholder="Account number or routing number" value={recip.includes(" ") ? "" : recip} onChange={e => setRecip(e.target.value)} />
              </div>
              <button className="btn-primary" onClick={() => setStep(2)} style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }} disabled={!recip}>
                Continue <Icon name="arrow" size={14} color="white" />
              </button>
            </div>
          )}

          {step === 2 && (
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 16 }}>Transfer Amount</div>
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
              <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 16 }}>Confirm Transfer</div>
              <div style={{ background: T.surfaceAlt, borderRadius: 12, padding: 18, marginBottom: 16, border: `1px solid ${T.border}` }}>
                {[
                  { l: "From Account",    v: "Daniel Scott — Premium Checking" },
                  { l: "To",             v: recip },
                  { l: "Amount",         v: `$${parseFloat(amt).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, highlight: true },
                  { l: "Transfer Fee",   v: "$0.00 — Platinum Benefit" },
                  { l: "Reference",      v: note || "N/A" },
                  { l: "Est. Arrival",   v: "Instant" },
                ].map((r, i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.border}` }}>
                    <span style={{ fontSize: 12, color: T.textSub }}>{r.l}</span>
                    <span style={{ fontSize: 13, fontWeight: r.highlight ? 600 : 500, color: r.highlight ? T.gold : T.text, fontFamily: r.highlight ? "DM Mono" : "DM Sans" }}>{r.v}</span>
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
                <button className="btn-primary" onClick={() => { alert("✓ Transfer Successful — $" + parseFloat(amt).toLocaleString() + " sent to " + recip); setStep(1); setAmt(""); setRecip(""); setNote(""); }}
                  style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}>
                  <Icon name="lock" size={14} color="white" /> Authorize & Send
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 14 }}>Daily & Monthly Limits</div>
            {[
              { l: "Daily Limit",       used: 18500,  total: 100000 },
              { l: "Monthly Limit",     used: 74240,  total: 500000 },
              { l: "International",     used: 7800,   total: 50000  },
            ].map((r, i) => (
              <div key={i} style={{ marginBottom: 14 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                  <span style={{ color: T.textSub }}>{r.l}</span>
                  <span style={{ color: T.text, fontWeight: 500, fontFamily: "DM Mono" }}>${r.used.toLocaleString()} / ${r.total.toLocaleString()}</span>
                </div>
                <div style={{ height: 5, borderRadius: 3, background: T.border }}>
                  <div style={{ height: "100%", width: `${(r.used / r.total * 100).toFixed(0)}%`, borderRadius: 3, background: r.used / r.total > 0.8 ? T.red : r.used / r.total > 0.6 ? "#D97706" : T.gold }} />
                </div>
              </div>
            ))}
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 14 }}>Recent Transfers</div>
            {TXNS.filter(t => t.cat === "Transfer").map((t, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                <IconCircle iconName="transfer" size={34} T={T} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{t.name}</div>
                  <div style={{ fontSize: 11, color: T.textMuted }}>{t.date}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.type === "credit" ? T.green : T.red, fontFamily: "DM Mono" }}>
                  {t.type === "credit" ? "+" : "−"}${Math.abs(t.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── INVESTMENTS ────────────────────────────────────────────── */
function InvestmentsPage({ T }) {
  const HOLDINGS = [
    { sym: "AAPL", name: "Apple Inc.",    shares: 45,  price: 198.40, chg: +2.3, val: 8928  },
    { sym: "TSLA", name: "Tesla Inc.",    shares: 30,  price: 248.70, chg: -1.1, val: 7461  },
    { sym: "NVDA", name: "NVIDIA Corp.",  shares: 20,  price: 880.50, chg: +4.8, val: 17610 },
    { sym: "MSFT", name: "Microsoft",     shares: 35,  price: 425.20, chg: +0.9, val: 14882 },
    { sym: "IBIT", name: "Bitcoin ETF",   shares: 100, price: 52.80,  chg: +3.2, val: 5280  },
    { sym: "VOO",  name: "S&P 500 ETF",   shares: 80,  price: 510.40, chg: +0.4, val: 40832 },
  ];
  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Investment Portfolio</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Track, analyze and manage your investments</div>
      </div>
      <div style={{ display: "flex", gap: 14, marginBottom: 20, flexWrap: "wrap" }}>
        <StatCard label="Total AUM"       value="$312,000" icon="portfolio" trend="up"   sub="+12.4% this year"  T={T} />
        <StatCard label="Today's Gain"    value="+$1,840"  icon="trend"    trend="up"   sub="+0.59% today"      T={T} />
        <StatCard label="Dividends YTD"   value="$8,640"   icon="coins"    sub="4 payments"                     T={T} />
        <StatCard label="Unrealized P&L"  value="+$44,200" icon="chart"    trend="up"   sub="Since inception"   T={T} />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginBottom: 16 }}>
        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: T.text }}>Portfolio Performance</div>
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
          <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 14 }}>Asset Allocation</div>
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
        <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 16 }}>Current Holdings</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 12 }}>
          {HOLDINGS.map((s, i) => (
            <div key={i} className="hover-lift" style={{ background: T.surfaceAlt, border: `1px solid ${T.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text, fontFamily: "DM Mono" }}>{s.sym}</div>
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

/* ─── SETTINGS ───────────────────────────────────────────────── */
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
        <div className="slb-serif" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Settings</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>Manage account preferences and security</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: T.text, marginBottom: 20, fontFamily: "Playfair Display" }}>Profile Information</div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20, padding: 16, background: T.goldBg, borderRadius: 12, border: `1px solid ${T.goldBorder}` }}>
            <Avatar initials="DS" color={T.gold} size={56} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: T.text }}>Daniel Scott</div>
              <div style={{ fontSize: 12, color: T.gold, display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}>
                <Icon name="shield" size={12} color={T.gold} /> Platinum Member · Since 2018
              </div>
              <div style={{ fontSize: 12, color: T.textSub, marginTop: 2 }}>daniel.scott@email.com</div>
            </div>
          </div>
          {[
            { l: "Full Name",  v: "Daniel Scott" },
            { l: "Email",      v: "daniel.scott@email.com" },
            { l: "Phone",      v: "+1 (555) 842-9210" },
            { l: "Address",    v: "1420 Harbor Blvd, Suite 300" },
            { l: "City",       v: "New York, NY 10001" },
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
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 16, fontFamily: "Playfair Display" }}>Security Preferences</div>
            {[
              { l: "Two-Factor Authentication", sub: "SMS & Authenticator app",     on: t2fa,     set: setT2fa     },
              { l: "Push Notifications",         sub: "Transaction and login alerts", on: notif,    set: setNotif    },
              { l: "Biometric Login",            sub: "Face ID / Fingerprint",       on: biometric, set: setBiometric },
              { l: "E-Statements",               sub: "Monthly PDF statements",      on: stmts,    set: setStmts    },
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
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 16, fontFamily: "Playfair Display" }}>Change Password</div>
            {["Current Password", "New Password", "Confirm New Password"].map((p, i) => (
              <div key={i} style={{ marginBottom: 12 }}>
                <label style={{ display: "block", fontSize: 11, color: T.textMuted, letterSpacing: "0.07em", textTransform: "uppercase", marginBottom: 5 }}>{p}</label>
                <input type="password" className="input-field" placeholder="••••••••••" />
              </div>
            ))}
            <button className="btn-secondary" style={{ width: "100%" }}>Update Password</button>
          </div>
          <div className="card" style={{ padding: 20 }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 12, fontFamily: "Playfair Display" }}>Login Activity</div>
            {[
              { loc: "New York, NY", time: "Today 9:14 AM", device: "Chrome · Windows 11", current: true },
              { loc: "Boston, MA",   time: "May 26, 4:22 PM", device: "Safari · iPhone 15", current: false },
              { loc: "New York, NY", time: "May 24, 11:08 AM", device: "Chrome · Windows 11", current: false },
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

/* ─── HELP ───────────────────────────────────────────────────── */
function HelpPage({ T }) {
  const [openFaq, setOpenFaq] = useState(null);
  const FAQS = [
    { q: "How do I increase my transfer limit?", a: "Platinum members can request limit increases by contacting our Priority Banking team at 1-800-SLB-PLAT. Increases are typically approved within one business hour." },
    { q: "How long do international transfers take?", a: "International wire transfers are processed instantly to SWIFT-connected banks. Most recipients receive funds within 0–2 business hours." },
    { q: "How do I add a new beneficiary?", a: "Navigate to Transfers → Saved Contacts → Add New. Enter recipient details and verify via OTP. The beneficiary is active immediately." },
    { q: "What are the fees for Platinum accounts?", a: "Platinum members enjoy zero monthly fees, zero domestic and international wire fees up to $50,000/month, and preferential exchange rates." },
    { q: "How do I dispute a transaction?", a: "Select the transaction in your history and click 'Dispute'. Platinum cases are resolved within 24 hours with provisional credit applied immediately." },
  ];
  return (
    <div className="slb fade-in">
      <div style={{ marginBottom: 24 }}>
        <div className="slb-serif" style={{ fontSize: 22, color: T.text, fontWeight: 500 }}>Help Center</div>
        <div style={{ fontSize: 13, color: T.textSub, marginTop: 4 }}>24/7 Platinum Priority Support</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: 20 }}>
        {[
          { icon: "phone",    label: "Call Us",       sub: "1-800-SLB-PLAT" },
          { icon: "chat",     label: "Live Chat",      sub: "Under 30 sec wait" },
          { icon: "mail",     label: "Email Support",  sub: "platinum@slbank.com" },
        ].map((c, i) => (
          <div key={i} className="card hover-lift" style={{ padding: 20, textAlign: "center", cursor: "pointer" }}>
            <div style={{ width: 44, height: 44, borderRadius: 22, background: T.goldBg, border: `1px solid ${T.goldBorder}`, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
              <Icon name={c.icon} size={20} color={T.gold} />
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 3 }}>{c.label}</div>
            <div style={{ fontSize: 12, color: T.gold, fontWeight: 500 }}>{c.sub}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: 16 }}>
        <div className="card" style={{ padding: 24 }}>
          <div style={{ fontSize: 15, fontWeight: 500, color: T.text, marginBottom: 16, fontFamily: "Playfair Display" }}>Frequently Asked Questions</div>
          {FAQS.map((f, i) => (
            <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
              <div onClick={() => setOpenFaq(openFaq === i ? null : i)}
                style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0", cursor: "pointer" }}>
                <span style={{ fontSize: 13, fontWeight: 500, color: T.text }}>{f.q}</span>
                <div style={{ transform: openFaq === i ? "rotate(45deg)" : "rotate(0deg)", transition: "transform 0.2s", color: T.gold, flexShrink: 0, marginLeft: 12 }}>
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
            <div style={{ fontSize: 14, fontWeight: 500, color: T.text, marginBottom: 14, fontFamily: "Playfair Display" }}>Quick Actions</div>
            {[
              { label: "Download Statement",   icon: "doc" },
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
            <div style={{ fontSize: 15, fontWeight: 500, color: T.text, marginBottom: 6, fontFamily: "Playfair Display" }}>Your Relationship Manager</div>
            <div style={{ fontSize: 12.5, color: T.textSub, marginBottom: 14, lineHeight: 1.6 }}>Your personal banker is available 24/7 for all your banking and investment needs.</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: T.text }}>Victoria Okonkwo</div>
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

/* ─── NOTIFICATIONS DATA ────────────────────────────────────── */
const NOTIFS = [
  { id:1, title:"Wire Transfer Received",  msg:"+$52,000 from J. Harrison",         time:"2h ago",  read:false, type:"success" },
  { id:2, title:"Security Notice",         msg:"New sign-in from New York, NY",      time:"5h ago",  read:false, type:"warning" },
  { id:3, title:"Statement Available",     msg:"May 2026 statement ready",           time:"1d ago",  read:true,  type:"info"    },
  { id:4, title:"Card Transaction",        msg:"Apple Store — $1,299.00",            time:"2d ago",  read:true,  type:"info"    },
  { id:5, title:"Portfolio Milestone",     msg:"Portfolio crossed $310K threshold",  time:"3d ago",  read:true,  type:"success" },
];

/* ─── APP ROOT ───────────────────────────────────────────────── */
export default function App() {
  const [dark, setDark] = useState(false);
  const T = TOKENS[dark ? "dark" : "light"];

  const [stage, setStage] = useState("login");
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showNotif, setShowNotif] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

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
    setTimeout(() => { setLoading(false); setStage("pin"); }, 1500);
  };

  if (stage === "login") return (
    <LoginPage username={username} setUsername={setUsername}
      password={password} setPassword={setPassword}
      rememberMe={rememberMe} setRememberMe={setRememberMe}
      loading={loading} onLogin={handleLogin} T={T} dark={dark} />
  );
  if (stage === "pin") return (
    <PinPage onSuccess={() => setStage("dashboard")} T={T} />
  );

  return (
    <div className="slb" style={{ display: "flex", height: "100vh", background: T.bgAlt, color: T.text, overflow: "hidden" }}>
      <Sidebar currentPage={page} setCurrentPage={p => { setPage(p); setShowNotif(false); }} isOpen={sidebarOpen} T={T} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
        <TopBar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}
          showNotif={showNotif} setShowNotif={setShowNotif}
          dark={dark} setDark={setDark} T={T} NOTIFS={NOTIFS} />
        <main onClick={() => setShowNotif(false)}
          style={{ flex: 1, overflowY: "auto", padding: "24px 28px", background: T.bgAlt }}>
          {page === "dashboard"    && <DashboardHome setCurrentPage={setPage} T={T} />}
          {page === "transactions" && <TransactionsPage T={T} />}
          {page === "cards"        && <CardsPage T={T} />}
          {page === "transfers"    && <TransfersPage T={T} />}
          {page === "investments"  && <InvestmentsPage T={T} />}
          {page === "settings"     && <SettingsPage T={T} />}
          {page === "help"         && <HelpPage T={T} />}
        </main>
      </div>
    </div>
  );
}
