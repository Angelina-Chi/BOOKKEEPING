// Mock data, currency utils, categories, payment methods

const CURRENCIES = {
  NTD: { code: 'NTD', symbol: 'NT$', label: '新台幣', locale: 'zh-TW' },
  JPY: { code: 'JPY', symbol: '¥',   label: '日圓',   locale: 'ja-JP' },
  USD: { code: 'USD', symbol: '$',   label: '美元',   locale: 'en-US' },
  EUR: { code: 'EUR', symbol: '€',   label: '歐元',   locale: 'en-US' },
  KRW: { code: 'KRW', symbol: '₩',   label: '韓元',   locale: 'ko-KR' },
};

// Manual reference rates (to NTD) — mock values
const RATES_TO_NTD = {
  NTD: 1, JPY: 0.21, USD: 32, EUR: 34.5, KRW: 0.023,
};

function fmtMoney(amount, currency = 'NTD', opts = {}) {
  const c = CURRENCIES[currency] || CURRENCIES.NTD;
  const n = Math.round(amount);
  const withSep = n.toLocaleString('en-US');
  const sign = opts.noSymbol ? '' : c.symbol + ' ';
  return sign + withSep;
}

const CATEGORIES = [
  { id: 'food',    emoji: '🍜', label: '餐飲', color: '#C9AE89' },
  { id: 'transit', emoji: '🚗', label: '交通', color: '#9BB4A4' },
  { id: 'fun',     emoji: '🎬', label: '娛樂', color: '#B6A3B8' },
  { id: 'shop',    emoji: '🛍️', label: '購物', color: '#C4A8A0' },
  { id: 'travel',  emoji: '✈️', label: '旅遊', color: '#94B3A9' },
  { id: 'home',    emoji: '🏠', label: '日常', color: '#B6A994' },
  { id: 'other',   emoji: '✨', label: '其他', color: '#A89F97' },
];

const PAYMENT_METHODS = [
  { id: 'cash',    emoji: '💵', label: '現金',    tokenVar: '--pm-cash' },
  { id: 'credit',  emoji: '💳', label: '信用卡',  tokenVar: '--pm-credit' },
  { id: 'linepay', emoji: '📱', label: 'LINE Pay', tokenVar: '--pm-line' },
  { id: 'apple',   emoji: '🍎', label: 'Apple Pay', tokenVar: '--pm-apple' },
  { id: 'bank',    emoji: '🏦', label: '轉帳',    tokenVar: '--pm-bank' },
];

// People
const PEOPLE = {
  ava: { id: 'ava', name: '小鹿',   colorVar: '--p-ava', initial: 'A' },
  kai: { id: 'kai', name: '阿凱',   colorVar: '--p-kai', initial: 'K' },
};

// Helpers to get category / pm
const byId = (arr, id) => arr.find(x => x.id === id);
const getCat = (id) => byId(CATEGORIES, id) || CATEGORIES[CATEGORIES.length - 1];
const getPM  = (id, customList = []) =>
  byId(PAYMENT_METHODS, id) || byId(customList, id) ||
  { id, emoji: '✨', label: id, tokenVar: '--pm-custom' };

// Date helpers
const d = (s) => s; // keep as ISO string

// MOCK ENTRIES — daily project (NTD)
const DAILY_ENTRIES = [
  { id: 'e01', date: '2026-04-18', catId: 'food',    pm: 'linepay', payer: 'ava', amount: 520,  note: '晚餐・義式小館',      split: 'even' },
  { id: 'e02', date: '2026-04-18', catId: 'home',    pm: 'credit',  payer: 'kai', amount: 1280, note: '衛生紙＋洗衣精',       split: 'even' },
  { id: 'e03', date: '2026-04-17', catId: 'transit', pm: 'cash',    payer: 'ava', amount: 140,  note: '計程車',                split: 'even' },
  { id: 'e04', date: '2026-04-16', catId: 'fun',     pm: 'linepay', payer: 'kai', amount: 760,  note: '電影・沙丘 3',          split: 'even' },
  { id: 'e05', date: '2026-04-15', catId: 'food',    pm: 'cash',    payer: 'ava', amount: 230,  note: '早午餐',                split: 'even' },
  { id: 'e06', date: '2026-04-14', catId: 'shop',    pm: 'credit',  payer: 'kai', amount: 2490, note: '她的生日禮物',          split: 'kai' },
  { id: 'e07', date: '2026-04-12', catId: 'food',    pm: 'apple',   payer: 'ava', amount: 380,  note: '咖啡與甜點',            split: 'even' },
  { id: 'e08', date: '2026-04-10', catId: 'home',    pm: 'bank',    payer: 'kai', amount: 3600, note: '電費帳單',              split: 'even' },
];

// MOCK ENTRIES — Tokyo trip (JPY)
const TOKYO_ENTRIES = [
  { id: 't01', date: '2026-05-03', catId: 'food',    pm: 'cash',    payer: 'ava', amount: 3800,  note: '築地市場朝食',          split: 'even' },
  { id: 't02', date: '2026-05-03', catId: 'transit', pm: 'credit',  payer: 'kai', amount: 5400,  note: 'Suica 儲值',            split: 'even' },
  { id: 't03', date: '2026-05-02', catId: 'travel',  pm: 'credit',  payer: 'kai', amount: 48000, note: '飯店 3 晚',             split: 'even' },
  { id: 't04', date: '2026-05-02', catId: 'food',    pm: 'linepay', payer: 'ava', amount: 2400,  note: '一蘭拉麵',              split: 'even' },
  { id: 't05', date: '2026-05-01', catId: 'shop',    pm: 'apple',   payer: 'ava', amount: 12400, note: '表參道購物',            split: 'ava' },
  { id: 't06', date: '2026-05-01', catId: 'fun',     pm: 'cash',    payer: 'kai', amount: 6200,  note: 'teamLab 門票',          split: 'even' },
  { id: 't07', date: '2026-04-30', catId: 'travel',  pm: 'credit',  payer: 'kai', amount: 32800, note: '機票補差價',            split: 'even' },
  { id: 't08', date: '2026-04-30', catId: 'food',    pm: 'cash',    payer: 'ava', amount: 1800,  note: '機場便當',              split: 'even' },
];

const INITIAL_PROJECTS = [
  {
    id: 'daily',
    name: '日常生活',
    emoji: '🌿',
    currency: 'NTD',
    type: 'ongoing',
    dateRange: null,
    budget: 30000,
    cover: { kind: 'solid', value: '#E4EBE4' },
    entries: DAILY_ENTRIES,
    subtitle: '每月固定',
  },
  {
    id: 'tokyo',
    name: '2026 東京旅遊',
    emoji: '✈️',
    currency: 'JPY',
    type: 'trip',
    dateRange: { start: '2026-04-30', end: '2026-05-05' },
    budget: 240000,
    cover: { kind: 'gradient', value: 'linear-gradient(135deg, #94B3A9 0%, #B9967E 100%)' },
    entries: TOKYO_ENTRIES,
    subtitle: '4/30 – 5/5',
  },
];

// Stats helpers (pure)
function projectTotal(project) {
  return project.entries.reduce((s, e) => s + e.amount, 0);
}
function personPaid(project, pid) {
  return project.entries.filter(e => e.payer === pid).reduce((s, e) => s + e.amount, 0);
}
function personShare(project, pid) {
  // Each entry contributes pid's share based on split rule
  return project.entries.reduce((sum, e) => {
    if (e.split === 'even') return sum + e.amount / 2;
    if (e.split === pid) return sum + e.amount; // only that person bears it
    if (typeof e.split === 'object' && e.split[pid] != null) return sum + e.amount * e.split[pid];
    return sum + e.amount / 2;
  }, 0);
}
function balance(project) {
  // Positive => ava owes kai; negative => kai owes ava
  const avaPaid = personPaid(project, 'ava');
  const kaiPaid = personPaid(project, 'kai');
  const avaShare = personShare(project, 'ava');
  const kaiShare = personShare(project, 'kai');
  // ava owes: shareAva - paidAva
  const avaOwes = avaShare - avaPaid;
  return { avaOwes, kaiOwes: -avaOwes, avaPaid, kaiPaid, avaShare, kaiShare };
}
function byCategory(project) {
  const m = {};
  for (const e of project.entries) { m[e.catId] = (m[e.catId] || 0) + e.amount; }
  return Object.entries(m).map(([catId, amount]) => ({ catId, amount, cat: getCat(catId) }))
    .sort((a, b) => b.amount - a.amount);
}
function byPaymentMethod(project) {
  const m = {};
  for (const e of project.entries) { m[e.pm] = (m[e.pm] || 0) + e.amount; }
  return Object.entries(m).map(([pmId, amount]) => ({ pmId, amount, pm: getPM(pmId) }))
    .sort((a, b) => b.amount - a.amount);
}
function groupByDate(entries) {
  const groups = {};
  for (const e of entries) {
    (groups[e.date] = groups[e.date] || []).push(e);
  }
  return Object.entries(groups)
    .sort(([a], [b]) => b.localeCompare(a))
    .map(([date, items]) => ({ date, items, total: items.reduce((s, e) => s + e.amount, 0) }));
}
function formatDateLabel(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const wd = ['日','一','二','三','四','五','六'][date.getDay()];
  return { md: `${m}/${d}`, weekday: `週${wd}`, full: `${y}.${String(m).padStart(2,'0')}.${String(d).padStart(2,'0')}` };
}

// Rough monthly trend for line chart — returns last 3 month buckets using entry dates
function monthlyTrend(entries) {
  const m = {};
  for (const e of entries) {
    const key = e.date.slice(0, 7); // YYYY-MM
    m[key] = (m[key] || 0) + e.amount;
  }
  const keys = Object.keys(m).sort();
  return keys.map(k => ({ key: k, value: m[k] }));
}

Object.assign(window, {
  CURRENCIES, RATES_TO_NTD, fmtMoney,
  CATEGORIES, PAYMENT_METHODS, PEOPLE,
  getCat, getPM,
  INITIAL_PROJECTS,
  projectTotal, personPaid, personShare, balance,
  byCategory, byPaymentMethod, groupByDate, formatDateLabel, monthlyTrend,
});
