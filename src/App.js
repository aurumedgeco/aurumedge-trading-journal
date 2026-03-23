import { useState, useEffect, useMemo } from "react";
import * as recharts from "recharts";
const { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } = recharts;

const TABS = ["Dashboard", "Trade Log", "Risk Calc", "Strategy", "Monthly", "Psychology", "Tools"];
const MARKETS = ["Forex", "Crypto", "Indices", "Commodities", "Stocks"];
const DIRS = ["Long", "Short"];
const STRATS = ["Scalp", "Day Trade", "Swing", "Position", "Breakout", "Trend Follow", "Range", "News", "Other"];
const SESS = ["London", "New York", "Asia", "Sydney", "Overlap"];
const EMOS = ["Calm", "Confident", "Anxious", "Fearful", "Greedy", "Frustrated", "FOMO", "Revenge", "Neutral"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const RATINGS = ["A+", "A", "B", "C", "F"];
const PAIRS = { "EUR/USD": 1.085, "GBP/USD": 1.265, "USD/JPY": 149.5, "USD/CHF": 0.883, "AUD/USD": 0.655, "USD/CAD": 1.36, "BTC/USD": 67500, "ETH/USD": 3500, "XAU/USD": 2340 };

const init = { trades: [], psych: [], rc: { account: 10000, risk: 1, entry: 0, sl: 0 }, goal: { target: 5000, month: new Date().getMonth() } };

function FormInput({ type, value, onChange, placeholder, style = {} }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
    style={{ background: "#0F1A2E", color: "#C0C0C0", border: "1px solid #2D3748", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", ...style }} />;
}

function FormSelect({ value, onChange, options, style = {} }) {
  return <select value={value} onChange={e => onChange(e.target.value)}
    style={{ background: "#0F1A2E", color: "#C0C0C0", border: "1px solid #2D3748", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", width: "100%", ...style }}>
    {options.map(o => <option key={o} value={o}>{o}</option>)}
  </select>;
}

function TradeForm({ initial, onSubmit, onCancel, isEdit, cs }) {
  const [f, setF] = useState(initial);
  useEffect(() => { setF(initial); }, [initial]);
  const u = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const fields = [
    ["Date", "date", "date"], ["Symbol", "symbol", "text", "EURUSD"],
    ["Market", "market", "sel", MARKETS], ["Direction", "direction", "sel", DIRS],
    ["Entry", "entry", "number"], ["Exit", "exit", "number"],
    ["Stop Loss", "sl", "number"], ["Take Profit", "tp", "number"],
    ["Size", "size", "number"], ["Account", "account", "number"],
    ["Strategy", "strategy", "sel", STRATS], ["Session", "session", "sel", SESS],
    ["Rating", "rating", "sel", RATINGS],
  ];

  return (
    <div style={{ background: "#131A24", border: "1px solid #2D3748", borderRadius: 12, padding: 20, marginBottom: 18 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: cs.gold, marginBottom: 14 }}>{isEdit ? "Edit Trade" : "Log New Trade"}</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
        {fields.map(([lbl, key, type, opts]) => (
          <div key={key}>
            <label style={{ fontSize: 10, color: "#555", display: "block", marginBottom: 3 }}>{lbl}</label>
            {type === "sel"
              ? <FormSelect value={f[key]} onChange={v => u(key, v)} options={opts} />
              : <FormInput type={type} value={f[key]} onChange={v => u(key, v)} placeholder={typeof opts === "string" ? opts : ""} />}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ fontSize: 10, color: "#555" }}>Notes</label>
        <FormInput type="text" value={f.notes} onChange={v => u("notes", v)} placeholder="Trade notes..." />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button onClick={() => onSubmit(f)} style={{ background: "linear-gradient(135deg, #D4A54A, #B8892E)", color: "#0A0A0A", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>{isEdit ? "Update" : "Log Trade"}</button>
        <button onClick={onCancel} style={{ background: "#1C2333", color: "#C0C0C0", border: "1px solid #2D3748", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

function PsychForm({ initial, onSubmit, onCancel, cs }) {
  const [f, setF] = useState(initial);
  const u = (k, v) => setF(prev => ({ ...prev, [k]: v }));

  const fields = [
    ["Date", "date", "date"], ["Symbol", "symbol", "text", "EURUSD"],
    ["Before", "eb", "sel", EMOS], ["After", "ea", "sel", EMOS],
    ["Discipline", "disc", "number"], ["Plan?", "plan", "sel", ["Yes", "No"]],
    ["Revenge?", "rev", "sel", ["Yes", "No"]],
  ];

  return (
    <div style={{ background: "#131A24", border: "1px solid #2D3748", borderRadius: 12, padding: 20, marginBottom: 18 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: cs.gold, marginBottom: 14 }}>Log Entry</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 }}>
        {fields.map(([lbl, key, type, opts]) => (
          <div key={key}>
            <label style={{ fontSize: 10, color: "#555", display: "block", marginBottom: 3 }}>{lbl}</label>
            {type === "sel"
              ? <FormSelect value={f[key]} onChange={v => u(key, v)} options={opts} />
              : <FormInput type={type} value={f[key]} onChange={v => u(key, v)} placeholder={typeof opts === "string" ? opts : ""} />}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <label style={{ fontSize: 10, color: "#555" }}>Notes</label>
        <FormInput type="text" value={f.notes} onChange={v => u("notes", v)} placeholder="Lessons learned..." />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
        <button onClick={() => onSubmit(f)} style={{ background: "linear-gradient(135deg, #D4A54A, #B8892E)", color: "#0A0A0A", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Log Entry</button>
        <button onClick={onCancel} style={{ background: "#1C2333", color: "#C0C0C0", border: "1px solid #2D3748", borderRadius: 10, padding: "11px 22px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>Cancel</button>
      </div>
    </div>
  );
}

// Standalone input that manages its own state — saves on blur, not every keystroke
function LocalInput({ value, onSave, type = "number", style = {} }) {
  const [local, setLocal] = useState(String(value));
  useEffect(() => { setLocal(String(value)); }, [value]);
  return (
    <input type={type} value={local} onChange={e => setLocal(e.target.value)}
      onBlur={() => onSave(type === "number" ? (+local || 0) : local)}
      onKeyDown={e => { if (e.key === "Enter") { e.target.blur(); } }}
      style={{ background: "#0F1A2E", color: "#C0C0C0", border: "1px solid #2D3748", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", ...style }} />
  );
}

function GoalInput({ value, onSave, cs }) {
  const [local, setLocal] = useState(String(value));
  useEffect(() => { setLocal(String(value)); }, [value]);
  return (
    <input type="number" value={local} onChange={e => setLocal(e.target.value)}
      onBlur={() => onSave(+local || 0)}
      onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
      style={{ background: "#0F1A2E", color: cs.silver, border: "1px solid #2D3748", borderRadius: 6, padding: "4px 8px", fontSize: 12, width: 80, outline: "none", textAlign: "right" }} />
  );
}

function RiskCalc({ rc, save, cs, R, Card, Btn, $ }) {
  const [local, setLocal] = useState(rc);
  useEffect(() => { setLocal(rc); }, [rc]);

  const update = (k, v) => setLocal(prev => ({ ...prev, [k]: v }));
  const saveAll = () => save(local);

  const slD = Math.abs((local.entry || 0) - (local.sl || 0));
  const rA = (local.account || 0) * ((local.risk || 0) / 100);
  const pU = slD > 0 ? rA / slD : 0;
  const pL = slD > 0 ? rA / (slD * 100000) : 0;

  return (
    <div style={{ maxWidth: 480 }}>
      <Card t="Inputs">
        <div style={{ display: "grid", gap: 14 }}>
          {[["Account ($)", "account"], ["Risk %", "risk"], ["Entry Price", "entry"], ["Stop Loss", "sl"]].map(([l, k]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontWeight: 600 }}>{l}</span>
              <input type="number" value={local[k]} onChange={e => update(k, e.target.value === "" ? "" : +e.target.value)}
                onBlur={saveAll} onKeyDown={e => { if (e.key === "Enter") e.target.blur(); }}
                style={{ background: "#0F1A2E", color: "#C0C0C0", border: "1px solid #2D3748", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", width: 150, textAlign: "right" }} />
            </div>
          ))}
        </div>
      </Card>
      <div style={{ marginTop: 14 }}>
        <Card t="Results">
          <R l="SL Distance" v={slD.toFixed(5)} c={cs.grn} />
          <R l="Risk Amount" v={$(rA)} c={cs.grn} />
          <R l="Position (units)" v={pU.toLocaleString("en-US", { maximumFractionDigits: 0 })} c={cs.grn} />
          <R l="Position (lots)" v={pL.toFixed(2)} c={cs.grn} />
        </Card>
      </div>
      <Btn onClick={() => { setLocal({ account: 10000, risk: 1, entry: 0, sl: 0 }); save({ account: 10000, risk: 1, entry: 0, sl: 0 }); }} style={{ marginTop: 14 }}>Reset</Btn>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("Dashboard");
  const [data, setData] = useState(init);
  const [showForm, setShowForm] = useState(false);
  const [showPF, setShowPF] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const [subTool, setSubTool] = useState("converter");

  useEffect(() => { (async () => { try { const r = await localStorage.getItem("ae-journal-v2"); if (r?.value) setData(JSON.parse(r.value)); } catch (e) { } })(); }, []);
  const save = async (d) => { setData(d); try { await localStorage.setItem("ae-journal-v2", JSON.stringify(d)); } catch (e) { } };

  const { trades = [], psych = [], rc = init.rc, goal = init.goal } = data;

  const s = useMemo(() => {
    const w = trades.filter(t => t.pnl > 0), l = trades.filter(t => t.pnl < 0), be = trades.filter(t => t.pnl === 0);
    const tp = trades.reduce((a, t) => a + (t.pnl || 0), 0);
    const wr = trades.length ? (w.length / trades.length) * 100 : 0;
    const aw = w.length ? w.reduce((a, t) => a + t.pnl, 0) / w.length : 0;
    const al = l.length ? l.reduce((a, t) => a + t.pnl, 0) / l.length : 0;
    const lsum = Math.abs(l.reduce((a, t) => a + t.pnl, 0));
    const pf = lsum > 0 ? w.reduce((a, t) => a + t.pnl, 0) / lsum : 0;
    const rrt = trades.filter(t => t.rr); const arr = rrt.length ? rrt.reduce((a, t) => a + t.rr, 0) / rrt.length : 0;
    const bt = trades.length ? Math.max(...trades.map(t => t.pnl)) : 0;
    const wt = trades.length ? Math.min(...trades.map(t => t.pnl)) : 0;
    const bm = {}; MARKETS.forEach(m => bm[m] = trades.filter(t => t.market === m).reduce((a, t) => a + (t.pnl || 0), 0));
    const bs = {}; STRATS.forEach(st => { const f = trades.filter(t => t.strategy === st); bs[st] = { c: f.length, w: f.filter(t => t.pnl > 0).length, l: f.filter(t => t.pnl < 0).length, p: f.reduce((a, t) => a + (t.pnl || 0), 0) }; });
    const bse = {}; SESS.forEach(x => bse[x] = trades.filter(t => t.session === x).reduce((a, t) => a + (t.pnl || 0), 0));
    const bmo = {}; MONTHS.forEach((m, i) => { const f = trades.filter(t => new Date(t.date).getMonth() === i); bmo[m] = { c: f.length, w: f.filter(t => t.pnl > 0).length, l: f.filter(t => t.pnl < 0).length, p: f.reduce((a, t) => a + (t.pnl || 0), 0) }; });
    const lp = trades.filter(t => t.direction === "Long").reduce((a, t) => a + (t.pnl || 0), 0);
    const sp2 = trades.filter(t => t.direction === "Short").reduce((a, t) => a + (t.pnl || 0), 0);
    const eq = []; let cum = 0; trades.forEach((t, i) => { cum += t.pnl || 0; eq.push({ x: i + 1, y: Math.round(cum * 100) / 100 }); });
    const ad = psych.filter(p => p.disc).length ? psych.reduce((a, p) => a + (p.disc || 0), 0) / psych.filter(p => p.disc).length : 0;
    const fp = psych.filter(p => p.plan === "Yes").length; const rv = psych.filter(p => p.rev === "Yes").length;
    // Current month P&L for goal
    const cm = new Date().getMonth();
    const cmp = trades.filter(t => new Date(t.date).getMonth() === cm).reduce((a, t) => a + (t.pnl || 0), 0);
    // Rating breakdown
    const br = {}; RATINGS.forEach(r => br[r] = trades.filter(t => t.rating === r).length);
    return { w: w.length, l: l.length, be: be.length, tp, wr, aw, al, pf, arr, bt, wt, bm, bs, bse, bmo, lp, sp: sp2, eq, ad, fp, rv, tp2: psych.length, cmp, br };
  }, [trades, psych]);

  const $ = (n) => { if (n === 0 && !trades.length) return "—"; const sg = n < 0 ? "-" : ""; return `${sg}$${Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; };
  const pct = (n) => !trades.length ? "—" : `${n.toFixed(1)}%`;

  const emptyT = { date: new Date().toISOString().split("T")[0], symbol: "", market: "Forex", direction: "Long", entry: "", exit: "", sl: "", tp: "", size: "", account: "", strategy: "Scalp", session: "New York", notes: "", rating: "B" };
  const [form, setForm] = useState(emptyT);
  const emptyP = { date: new Date().toISOString().split("T")[0], symbol: "", eb: "Calm", ea: "Calm", disc: 5, plan: "Yes", rev: "No", notes: "" };
  const [pf, setPf] = useState(emptyP);
  const [convFrom, setConvFrom] = useState("EUR/USD");
  const [convAmt, setConvAmt] = useState(1000);

  const calc = (t) => {
    const e = +t.entry, x = +t.exit, sl = +t.sl, tp = +t.tp, sz = +t.size, ac = +t.account;
    if (!e || !x || !sz) return { ...t, pnl: 0, pnlP: 0, riskP: 0, riskD: 0, rr: 0 };
    const pnl = t.direction === "Long" ? (x - e) * sz : (e - x) * sz;
    return { ...t, pnl: Math.round(pnl * 100) / 100, pnlP: ac ? Math.round((pnl / ac) * 10000) / 100 : 0, riskP: sl && e ? Math.round(Math.abs(e - sl) / e * 10000) / 100 : 0, riskD: ac && sl && e ? Math.round(ac * Math.abs(e - sl) / e * 100) / 100 : 0, rr: sl && tp && e ? Math.round(Math.abs(tp - e) / Math.abs(e - sl) * 100) / 100 : 0 };
  };

  const submitT = () => { const t = calc(form); const nt = editIdx !== null ? trades.map((tr, i) => i === editIdx ? t : tr) : [...trades, t]; save({ ...data, trades: nt }); setForm(emptyT); setShowForm(false); setEditIdx(null); };
  const delT = (i) => save({ ...data, trades: trades.filter((_, idx) => idx !== i) });
  const submitP = () => { save({ ...data, psych: [...psych, { ...pf, disc: +pf.disc }] }); setPf(emptyP); setShowPF(false); };

  const exportCSV = () => {
    const h = "Date,Symbol,Market,Direction,Entry,Exit,SL,TP,Size,Account,P&L,P&L%,R:R,Rating,Strategy,Session,Notes\n";
    const rows = trades.map(t => `"${t.date}","${t.symbol}","${t.market}","${t.direction}",${t.entry},${t.exit},${t.sl},${t.tp},${t.size},${t.account},${t.pnl},${t.pnlP},${t.rr},"${t.rating||""}","${t.strategy}","${t.session}","${(t.notes||"").replace(/"/g,'""')}"`).join("\n");
    const bom = "\uFEFF";
    const blob = new Blob([bom + h + rows], { type: "text/csv;charset=utf-8" }); const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "aurumedge_trades.csv"; a.click();
  };

  const goalPct = goal.target > 0 ? Math.max(0, Math.min((s.cmp / goal.target) * 100, 100)) : 0;

  // Styles
  const cs = { bg: "#0A0A0A", c1: "#0D1117", c2: "#131A24", card: "#1C2333", bdr: "#2D3520", gold: "#D4A54A", lgold: "#F5D78E", silver: "#C0C0C0", gray: "#8A8A8A", grn: "#48BB78", red: "#FC8181", blue: "#63B3ED", purp: "#B794F4" };

  const KPI = ({ l, v, c = cs.gold }) => (
    <div style={{ background: cs.card, border: `1px solid ${cs.bdr}`, borderRadius: 10, padding: "16px 18px", flex: 1, minWidth: 130 }}>
      <div style={{ fontSize: 10, color: cs.gray, letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 8 }}>{l}</div>
      <div style={{ fontSize: 20, fontWeight: 700, color: c, fontFamily: "'Playfair Display', Georgia, serif" }}>{v}</div>
    </div>
  );

  const Card = ({ t, children, style = {} }) => (
    <div style={{ background: cs.card, border: `1px solid ${cs.bdr}`, borderRadius: 10, padding: "16px 18px", flex: 1, minWidth: 200, ...style }}>
      {t && <div style={{ fontSize: 11, fontWeight: 700, color: cs.gold, letterSpacing: 1.5, marginBottom: 12, textTransform: "uppercase" }}>{t}</div>}
      {children}
    </div>
  );

  const R = ({ l, v, c = cs.silver }) => (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #1a1f2e" }}>
      <span style={{ color: cs.gray, fontSize: 13 }}>{l}</span>
      <span style={{ color: c, fontWeight: 600, fontSize: 13, fontFamily: "'Playfair Display', Georgia, serif" }}>{v}</span>
    </div>
  );

  const Sel = ({ v, onChange, opts, style = {} }) => (
    <select value={v} onChange={e => onChange(e.target.value)} style={{ background: "#0F1A2E", color: cs.silver, border: "1px solid #2D3748", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", ...style }}>
      {opts.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );

  const Inp = ({ v, onChange, type = "text", ph = "", style = {} }) => (
    <input type={type} value={v} onChange={e => onChange(e.target.value)} placeholder={ph}
      style={{ background: "#0F1A2E", color: cs.silver, border: "1px solid #2D3748", borderRadius: 8, padding: "9px 12px", fontSize: 13, outline: "none", width: "100%", boxSizing: "border-box", ...style }} />
  );

  const Btn = ({ children, onClick, gold, sm, style = {} }) => (
    <button onClick={onClick} style={{ background: gold ? "linear-gradient(135deg, #D4A54A, #B8892E)" : cs.card, color: gold ? "#0A0A0A" : cs.silver, border: gold ? "none" : "1px solid #2D3748", borderRadius: 10, padding: sm ? "7px 16px" : "11px 22px", fontSize: sm ? 12 : 14, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, transition: "all 0.2s", ...style }}>{children}</button>
  );

  const TH = ({ children, align = "center" }) => <th style={{ padding: "12px 10px", color: cs.lgold, fontWeight: 700, textAlign: align, fontSize: 11, letterSpacing: 0.5, textTransform: "uppercase" }}>{children}</th>;
  const TD = ({ children, c, fw, align = "center", bg }) => <td style={{ padding: "9px 10px", textAlign: align, color: c || cs.silver, fontWeight: fw || 400, fontSize: 12, background: bg || "transparent" }}>{children}</td>;

  const PIE_COLORS = [cs.grn, cs.red, cs.gold];
  const pieData = [{ name: "Win", value: s.w || 0 }, { name: "Loss", value: s.l || 0 }, { name: "BE", value: s.be || 0 }].filter(d => d.value > 0);

  const ratingColor = (r) => ({ "A+": "#FFD700", "A": cs.grn, "B": cs.blue, "C": "#888", "F": cs.red }[r] || cs.silver);

  const calendarEvents = [
    { time: "Mon 8:30 AM", event: "Non-Farm Payrolls", impact: "High" },
    { time: "Tue 10:00 AM", event: "ISM Manufacturing", impact: "High" },
    { time: "Wed 2:00 PM", event: "FOMC Statement", impact: "High" },
    { time: "Thu 8:30 AM", event: "Initial Jobless Claims", impact: "Medium" },
    { time: "Fri 8:30 AM", event: "CPI Data Release", impact: "High" },
  ];

  return (
    <div style={{ background: cs.bg, minHeight: "100vh", color: cs.silver, fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1E1A0F, #0D0D0D)", borderBottom: "1px solid #2A2210", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <svg width="24" height="34" viewBox="0 0 120 170"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stopColor="#D4A54A" /><stop offset="50%" stopColor="#F5D78E" /><stop offset="100%" stopColor="#C49A3C" /></linearGradient><linearGradient id="g2" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#F5D78E" /><stop offset="100%" stopColor="#B8892E" /></linearGradient></defs><polygon points="60,5 110,85 60,165 10,85" fill="none" stroke="url(#g)" strokeWidth="4" /><polygon points="60,22 95,85 60,148 25,85" fill="url(#g)" opacity="0.12" /><line x1="10" y1="85" x2="110" y2="85" stroke="url(#g)" strokeWidth="1.5" opacity="0.5" /><polyline points="42,100 60,45 78,100" stroke="url(#g2)" strokeWidth="3.5" fill="none" strokeLinecap="round" strokeLinejoin="round" /></svg>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700 }}><span style={{ color: cs.gold }}>AURUM</span> <span style={{ color: cs.silver }}>EDGE</span> <span style={{ color: cs.gray, fontSize: 11, fontFamily: "'DM Sans'" }}>CO.</span></div>
            <div style={{ fontSize: 8, color: "#555", letterSpacing: 3 }}>SMART MONEY STARTS HERE</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Btn sm onClick={exportCSV} style={{ fontSize: 10 }}>Export CSV</Btn>
          {!confirmReset
            ? <Btn sm gold onClick={() => setConfirmReset(true)} style={{ fontSize: 10 }}>Reset All</Btn>
            : <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: "#FC8181" }}>Sure?</span>
                <Btn sm gold onClick={() => { save(init); setConfirmReset(false); }} style={{ fontSize: 10, background: "linear-gradient(135deg, #FC8181, #E74C3C)" }}>Yes, Reset</Btn>
                <Btn sm onClick={() => setConfirmReset(false)} style={{ fontSize: 10 }}>Cancel</Btn>
              </div>
          }
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: cs.c1, borderBottom: "1px solid #1a1f2e", overflowX: "auto" }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? cs.card : "transparent", color: tab === t ? cs.gold : "#555", border: "none", borderBottom: tab === t ? `2px solid ${cs.gold}` : "2px solid transparent", padding: "12px 18px", fontSize: 11, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, whiteSpace: "nowrap", transition: "all 0.15s" }}>{t}</button>
        ))}
      </div>

      <div style={{ padding: "20px", maxWidth: 1200, margin: "0 auto" }}>

        {/* ═══ DASHBOARD ═══ */}
        {tab === "Dashboard" && (<div>
          {/* Goal Tracker */}
          <div style={{ background: cs.card, border: `1px solid ${cs.bdr}`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: cs.gold, letterSpacing: 1.5, textTransform: "uppercase" }}>Monthly Goal</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 10, color: cs.gray }}>Target:</span>
              <GoalInput value={goal.target} onSave={(v) => save({ ...data, goal: { ...goal, target: v } })} cs={cs} />
              </div>
            </div>
            <div style={{ background: "#0D1117", borderRadius: 8, height: 28, overflow: "hidden", position: "relative" }}>
              <div style={{ background: `linear-gradient(90deg, ${cs.gold}, #F5D78E)`, height: "100%", width: `${Math.max(goalPct, 0)}%`, borderRadius: 8, transition: "width 0.5s ease" }} />
              <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: goalPct > 50 ? "#0A0A0A" : cs.silver }}>{$(s.cmp)} / {$(goal.target)} ({goalPct.toFixed(0)}%)</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <KPI l="Total Trades" v={trades.length || "—"} />
            <KPI l="Net P&L" v={$(s.tp)} c={s.tp >= 0 ? cs.grn : cs.red} />
            <KPI l="Win Rate" v={pct(s.wr)} />
            <KPI l="Profit Factor" v={s.pf ? s.pf.toFixed(2) : "—"} c={cs.blue} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 }}>
            <KPI l="Avg Win" v={$(s.aw)} c={cs.grn} />
            <KPI l="Avg Loss" v={$(s.al)} c={cs.red} />
            <KPI l="Best Trade" v={$(s.bt)} c={cs.grn} />
            <KPI l="Worst Trade" v={$(s.wt)} c={cs.red} />
          </div>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
            <KPI l="Wins" v={s.w || "—"} c={cs.grn} />
            <KPI l="Losses" v={s.l || "—"} c={cs.red} />
            <KPI l="Avg R:R" v={s.arr ? s.arr.toFixed(2) : "—"} c={cs.purp} />
            <KPI l="Long / Short" v={`${$(s.lp)} / ${$(s.sp)}`} c={cs.silver} />
          </div>

          {/* Charts */}
          {trades.length > 0 && (
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 20 }}>
              <Card t="Equity Curve" style={{ minWidth: 400, flex: 2 }}>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={s.eq}><XAxis dataKey="x" stroke="#333" tick={{ fill: "#666", fontSize: 10 }} label={{ value: "Trade #", position: "insideBottom", offset: -5, fill: "#555", fontSize: 10 }} /><YAxis stroke="#333" tick={{ fill: "#666", fontSize: 10 }} /><Tooltip contentStyle={{ background: "#1C2333", border: "1px solid #2D3520", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#8A8A8A" }} itemStyle={{ color: "#D4A54A" }} formatter={(v) => ["$" + v.toLocaleString("en-US", { minimumFractionDigits: 2 }), "P&L"]} /><Line type="monotone" dataKey="y" name="Cumulative P&L" stroke="#D4A54A" strokeWidth={2.5} dot={false} /></LineChart>
                </ResponsiveContainer>
              </Card>
              <Card t="Win / Loss" style={{ minWidth: 200 }}>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">{pieData.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}</Pie><Tooltip contentStyle={{ background: "#1C2333", border: "1px solid #2D3520", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#8A8A8A" }} itemStyle={{ color: "#C0C0C0" }} /></PieChart>
                </ResponsiveContainer>
                <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 6 }}>
                  {pieData.map((d, i) => <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10 }}><div style={{ width: 8, height: 8, borderRadius: 2, background: PIE_COLORS[i] }} />{d.name}: {d.value}</div>)}
                </div>
              </Card>
            </div>
          )}

          {/* Rating breakdown */}
          {trades.length > 0 && (
            <Card t="Trade Ratings" style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 16 }}>
                {RATINGS.map(r => <div key={r} style={{ textAlign: "center" }}><div style={{ fontSize: 22, fontWeight: 700, color: ratingColor(r), fontFamily: "'Playfair Display', serif" }}>{s.br[r] || 0}</div><div style={{ fontSize: 10, color: cs.gray }}>{r}</div></div>)}
              </div>
            </Card>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Card t="By Market">{MARKETS.map(m => <R key={m} l={m} v={$(s.bm[m])} c={s.bm[m] > 0 ? cs.grn : s.bm[m] < 0 ? cs.red : cs.silver} />)}</Card>
            <Card t="By Session">{SESS.slice(0, 4).map(x => <R key={x} l={x} v={$(s.bse[x])} />)}</Card>
            <Card t="Top Strategies">{STRATS.slice(0, 5).map(x => <R key={x} l={x} v={$(s.bs[x]?.p || 0)} />)}</Card>
          </div>
        </div>)}

        {/* ═══ TRADE LOG ═══ */}
        {tab === "Trade Log" && (<div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: cs.gray }}>{trades.length} trades</div>
            <Btn gold onClick={() => { setForm(emptyT); setEditIdx(null); setShowForm(true); }}>+ New Trade</Btn>
          </div>

          {showForm && (
            <TradeForm initial={editIdx !== null ? trades[editIdx] : emptyT} onSubmit={(t) => { const ct = calc(t); const nt = editIdx !== null ? trades.map((tr, i) => i === editIdx ? ct : tr) : [...trades, ct]; save({ ...data, trades: nt }); setShowForm(false); setEditIdx(null); }} onCancel={() => { setShowForm(false); setEditIdx(null); }} isEdit={editIdx !== null} cs={cs} />
          )}

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#1A1F2E", borderTop: `2px solid #B8892E`, borderBottom: `2px solid #B8892E` }}>
                {["Date", "Symbol", "Dir", "Entry", "Exit", "P&L", "R:R", "Rating", "Outcome", "Strategy", ""].map(h => <TH key={h}>{h}</TH>)}
              </tr></thead>
              <tbody>
                {!trades.length && <tr><td colSpan={11} style={{ padding: 50, textAlign: "center", color: "#444" }}>No trades yet. Click "+ New Trade" to get started.</td></tr>}
                {trades.map((t, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? cs.c1 : cs.c2, borderBottom: "1px solid #1a1f2e" }}>
                    <TD>{t.date}</TD>
                    <TD fw={700}>{t.symbol}</TD>
                    <TD c={t.direction === "Long" ? cs.grn : cs.red}>{t.direction}</TD>
                    <TD align="right">{t.entry}</TD>
                    <TD align="right">{t.exit}</TD>
                    <TD c={t.pnl > 0 ? cs.grn : t.pnl < 0 ? cs.red : cs.silver} fw={700} bg={t.pnl > 0 ? "#1C2E22" : t.pnl < 0 ? "#2D1F1F" : ""}>{$(t.pnl)}</TD>
                    <TD>{t.rr?.toFixed(2) || "—"}</TD>
                    <TD c={ratingColor(t.rating)} fw={700}>{t.rating || "—"}</TD>
                    <TD c={t.pnl > 0 ? cs.grn : t.pnl < 0 ? cs.red : cs.gold} fw={700}>{t.pnl > 0 ? "Win" : t.pnl < 0 ? "Loss" : "BE"}</TD>
                    <TD>{t.strategy}</TD>
                    <TD><div style={{ display: "flex", gap: 8 }}><button onClick={() => { setEditIdx(i); setShowForm(true); }} style={{ background: "none", border: "none", color: cs.blue, cursor: "pointer", fontSize: 11 }}>edit</button><button onClick={() => delT(i)} style={{ background: "none", border: "none", color: cs.red, cursor: "pointer", fontSize: 11 }}>×</button></div></TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>)}

        {/* ═══ RISK CALC ═══ */}
        {tab === "Risk Calc" && (<RiskCalc rc={rc} save={(newRc) => save({ ...data, rc: newRc })} cs={cs} R={R} Card={Card} Btn={Btn} $={$} />)}

        {/* ═══ STRATEGY ═══ */}
        {tab === "Strategy" && (<div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#1A1F2E", borderTop: "2px solid #B8892E", borderBottom: "2px solid #B8892E" }}>
              {["Strategy", "Trades", "Wins", "Losses", "Win Rate", "Net P&L"].map(h => <TH key={h} align={h === "Strategy" ? "left" : "center"}>{h}</TH>)}
            </tr></thead>
            <tbody>
              {STRATS.map((st, i) => { const d = s.bs[st]; return (
                <tr key={st} style={{ background: i % 2 === 0 ? cs.c1 : cs.c2, borderBottom: "1px solid #1a1f2e" }}>
                  <TD align="left" fw={600}>{st}</TD><TD>{d.c}</TD><TD c={cs.grn}>{d.w}</TD><TD c={cs.red}>{d.l}</TD><TD>{d.c ? ((d.w / d.c) * 100).toFixed(1) + "%" : "—"}</TD><TD c={d.p > 0 ? cs.grn : d.p < 0 ? cs.red : cs.silver} fw={700} align="right">{$(d.p)}</TD>
                </tr>); })}
              <tr style={{ background: "#2A2210", borderTop: "2px solid #B8892E" }}>
                <TD align="left" fw={700} c={cs.gold}>TOTAL</TD><TD fw={700}>{trades.length}</TD><TD fw={700} c={cs.grn}>{s.w}</TD><TD fw={700} c={cs.red}>{s.l}</TD><TD fw={700}>{trades.length ? s.wr.toFixed(1) + "%" : "—"}</TD><TD fw={700} c={cs.gold} align="right">{$(s.tp)}</TD>
              </tr>
            </tbody>
          </table>
        </div>)}

        {/* ═══ MONTHLY ═══ */}
        {tab === "Monthly" && (<div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#1A1F2E", borderTop: "2px solid #B8892E", borderBottom: "2px solid #B8892E" }}>
              {["Month", "Trades", "Wins", "Losses", "Win Rate", "Net P&L"].map(h => <TH key={h} align={h === "Month" ? "left" : "center"}>{h}</TH>)}
            </tr></thead>
            <tbody>
              {MONTHS.map((m, i) => { const d = s.bmo[m]; return (
                <tr key={m} style={{ background: i % 2 === 0 ? cs.c1 : cs.c2, borderBottom: "1px solid #1a1f2e" }}>
                  <TD align="left" fw={600}>{m}</TD><TD>{d.c}</TD><TD c={cs.grn}>{d.w}</TD><TD c={cs.red}>{d.l}</TD><TD>{d.c ? ((d.w / d.c) * 100).toFixed(1) + "%" : "—"}</TD><TD c={d.p > 0 ? cs.grn : d.p < 0 ? cs.red : cs.silver} fw={700} align="right">{$(d.p)}</TD>
                </tr>); })}
              <tr style={{ background: "#2A2210", borderTop: "2px solid #B8892E" }}>
                <TD align="left" fw={700} c={cs.gold}>TOTAL</TD><TD fw={700}>{trades.length}</TD><TD fw={700} c={cs.grn}>{s.w}</TD><TD fw={700} c={cs.red}>{s.l}</TD><TD fw={700}>{trades.length ? s.wr.toFixed(1) + "%" : "—"}</TD><TD fw={700} c={cs.gold} align="right">{$(s.tp)}</TD>
              </tr>
            </tbody>
          </table>
        </div>)}

        {/* ═══ PSYCHOLOGY ═══ */}
        {tab === "Psychology" && (<div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontSize: 13, color: cs.gray }}>{psych.length} entries</div>
            <Btn gold onClick={() => { setPf(emptyP); setShowPF(true); }}>+ New Entry</Btn>
          </div>
          {psych.length > 0 && <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 18 }}><KPI l="Avg Discipline" v={s.ad.toFixed(1) + " / 10"} /><KPI l="Followed Plan" v={`${s.fp} / ${s.tp2}`} c={cs.grn} /><KPI l="Revenge Trades" v={s.rv} c={cs.red} /></div>}
          {showPF && (
            <PsychForm initial={emptyP} onSubmit={(p) => { save({ ...data, psych: [...psych, { ...p, disc: +p.disc }] }); setShowPF(false); }} onCancel={() => setShowPF(false)} cs={cs} />
          )}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead><tr style={{ background: "#1A1F2E", borderTop: "2px solid #B8892E", borderBottom: "2px solid #B8892E" }}>{["Date", "Symbol", "Before", "After", "Disc", "Plan?", "Rev?", "Notes"].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
              <tbody>
                {!psych.length && <tr><td colSpan={8} style={{ padding: 50, textAlign: "center", color: "#444" }}>No entries yet.</td></tr>}
                {psych.map((p, i) => (
                  <tr key={i} style={{ background: i % 2 === 0 ? cs.c1 : cs.c2, borderBottom: "1px solid #1a1f2e" }}>
                    <TD>{p.date}</TD><TD fw={600}>{p.symbol}</TD><TD>{p.eb}</TD><TD>{p.ea}</TD><TD c={cs.gold} fw={700}>{p.disc}</TD><TD c={p.plan === "Yes" ? cs.grn : cs.red} fw={700}>{p.plan}</TD><TD c={p.rev === "Yes" ? cs.red : cs.grn} fw={700}>{p.rev}</TD><TD><span style={{ fontSize: 11, color: cs.gray }}>{p.notes}</span></TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>)}

        {/* ═══ TOOLS ═══ */}
        {tab === "Tools" && (<div>
          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
            {["converter", "calendar"].map(t => <Btn key={t} sm gold={subTool === t} onClick={() => setSubTool(t)}>{t === "converter" ? "Currency Converter" : "Economic Calendar"}</Btn>)}
          </div>

          {subTool === "converter" && (
            <Card t="Currency Converter" style={{ maxWidth: 420 }}>
              <div style={{ display: "grid", gap: 14, marginTop: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontWeight: 600 }}>Pair</span><Sel v={convFrom} onChange={setConvFrom} opts={Object.keys(PAIRS)} style={{ width: 150 }} /></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontWeight: 600 }}>Amount (USD)</span><LocalInput value={convAmt} onSave={v => setConvAmt(v)} style={{ width: 150, textAlign: "right" }} /></div>
              </div>
              <div style={{ marginTop: 16, padding: "14px", background: "#0F1E15", borderRadius: 8, border: "1px solid #2D3520" }}>
                <div style={{ fontSize: 10, color: cs.gray, marginBottom: 4 }}>Rate: 1 {convFrom.split("/")[0]} = {PAIRS[convFrom]} {convFrom.split("/")[1]}</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: cs.grn, fontFamily: "'Playfair Display', serif" }}>
                  {convFrom.includes("JPY") || convFrom.includes("CHF") || convFrom.includes("CAD")
                    ? (convAmt * PAIRS[convFrom]).toLocaleString("en-US", { maximumFractionDigits: 2 }) + " " + convFrom.split("/")[1]
                    : (convAmt / PAIRS[convFrom]).toLocaleString("en-US", { maximumFractionDigits: convFrom.includes("BTC") || convFrom.includes("ETH") ? 6 : 2 }) + " " + convFrom.split("/")[0]}
                </div>
              </div>
              <div style={{ fontSize: 9, color: "#444", marginTop: 8, fontStyle: "italic" }}>Rates are approximate and for reference only.</div>
            </Card>
          )}

          {subTool === "calendar" && (
            <Card t="Economic Calendar — Key Events" style={{ maxWidth: 500 }}>
              <div style={{ fontSize: 10, color: cs.gray, marginBottom: 12, fontStyle: "italic" }}>Major events that move markets. Plan your trades around these.</div>
              {calendarEvents.map((ev, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #1a1f2e" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{ev.event}</div>
                    <div style={{ fontSize: 11, color: cs.gray }}>{ev.time} EST</div>
                  </div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: ev.impact === "High" ? cs.red : cs.gold, background: ev.impact === "High" ? "#2D1F1F" : "#2A2210", padding: "3px 10px", borderRadius: 20 }}>{ev.impact}</div>
                </div>
              ))}
              <div style={{ fontSize: 9, color: "#444", marginTop: 12, fontStyle: "italic" }}>Check ForexFactory.com for live real-time calendar updates.</div>
            </Card>
          )}
        </div>)}
      </div>

      <div style={{ borderTop: "1px solid #1a1f2e", padding: "14px 20px", textAlign: "center", marginTop: 30 }}>
        <div style={{ fontSize: 9, color: "#333", letterSpacing: 2 }}>AURUM EDGE CO.  ·  @aurumedgeco  ·  SMART MONEY STARTS HERE</div>
      </div>
    </div>
  );
}
