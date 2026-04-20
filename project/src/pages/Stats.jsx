// Stats page — pie, bar, settle card, line chart

function Stats({ project }) {
  const total = projectTotal(project);
  const bal = balance(project);
  const cats = byCategory(project);
  const pms = byPaymentMethod(project);
  const trend = monthlyTrend(project.entries);
  const isNotNTD = project.currency !== 'NTD';
  const ntdEquivalent = Math.abs(bal.avaOwes) * (RATES_TO_NTD[project.currency] || 1);

  return (
    <div className="page-enter" style={{ padding: '0 0 24px' }}>
      <div style={{ padding: '4px 20px 8px' }}>
        <div className="label">分析</div>
        <div className="serif" style={{ fontSize: 26, fontWeight: 500 }}>支出的形狀</div>
      </div>

      {/* Settle card — hero */}
      <div style={{ padding: '14px 20px 0' }}>
        <div style={{
          background: 'linear-gradient(145deg, #8FAF9F 0%, #5C7A6B 100%)',
          borderRadius: 24,
          padding: '22px 22px 20px',
          color: '#FBF7F1',
          position: 'relative', overflow: 'hidden',
          boxShadow: '0 18px 36px rgba(92,122,107,0.3)',
        }}>
          <div style={{ position: 'absolute', top: -30, right: -30, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }}/>
          <div style={{ position: 'absolute', bottom: -40, left: -20, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }}/>

          <div style={{ fontSize: 11, letterSpacing: 0.2, textTransform: 'uppercase', opacity: 0.7 }}>
            THIS MUCH TO GO
          </div>
          {Math.abs(bal.avaOwes) < 0.5 ? (
            <div style={{ marginTop: 16, fontSize: 22, fontFamily: 'var(--serif)' }}>
              兩人已經兩訖 ✿
            </div>
          ) : (
            <>
              <div style={{ marginTop: 14, fontSize: 14, opacity: 0.88 }}>
                {bal.avaOwes > 0 ? (
                  <><b>{PEOPLE.ava.name}</b> 要給 <b>{PEOPLE.kai.name}</b></>
                ) : (
                  <><b>{PEOPLE.kai.name}</b> 要給 <b>{PEOPLE.ava.name}</b></>
                )}
              </div>
              <div className="num serif" style={{ fontSize: 46, fontWeight: 500, lineHeight: 1, marginTop: 8, letterSpacing: -0.5 }}>
                {fmtMoney(Math.abs(bal.avaOwes), project.currency)}
              </div>
              {isNotNTD && (
                <div style={{ fontSize: 11, opacity: 0.75, marginTop: 6 }} className="num">
                  ≈ {fmtMoney(ntdEquivalent, 'NTD')} · 匯率 1 {project.currency} = {(RATES_TO_NTD[project.currency]).toFixed(3)} NTD
                </div>
              )}
              <button className="pressable"
                style={{
                  marginTop: 16, width: '100%', height: 42,
                  background: 'rgba(255,255,255,0.18)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.3)',
                  borderRadius: 12,
                  color: '#FBF7F1', fontSize: 13, fontWeight: 500,
                }}>
                ✓ 記錄這次還款
              </button>
            </>
          )}
        </div>
      </div>

      {/* Pie chart */}
      <Section title="支出分類">
        <div className="card" style={{ padding: 18 }}>
          <div className="row" style={{ gap: 18, alignItems: 'center' }}>
            <PieChart data={cats} total={total}/>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cats.slice(0, 5).map(c => {
                const pct = (c.amount / total) * 100;
                return (
                  <div key={c.catId} className="row" style={{ gap: 8, fontSize: 12 }}>
                    <span style={{ width: 8, height: 8, borderRadius: 2, background: c.cat.color }}/>
                    <span style={{ flex: 1, color: 'var(--ink-soft)' }}>{c.cat.emoji} {c.cat.label}</span>
                    <span className="num" style={{ color: 'var(--muted)', fontSize: 11 }}>{pct.toFixed(0)}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* Payment method bars */}
      <Section title="付款方式分布">
        <div className="card" style={{ padding: '18px' }}>
          {pms.map(p => {
            const pct = (p.amount / total) * 100;
            return (
              <div key={p.pmId} style={{ marginBottom: 12 }}>
                <div className="row between" style={{ fontSize: 12, marginBottom: 5 }}>
                  <span style={{ color: 'var(--ink-soft)' }}>{p.pm.emoji} {p.pm.label}</span>
                  <span className="num" style={{ color: 'var(--muted)' }}>{fmtMoney(p.amount, project.currency)}</span>
                </div>
                <div style={{ height: 8, borderRadius: 8, background: 'var(--primary-faint)', overflow: 'hidden' }}>
                  <div style={{ width: `${pct}%`, height: '100%', borderRadius: 8,
                    background: `var(${p.pm.tokenVar})`,
                    transition: 'width 0.6s ease',
                  }}/>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Two people compare */}
      <Section title="兩人各自支出">
        <div className="card" style={{ padding: 18 }}>
          <TwoPersonBar bal={bal} currency={project.currency}/>
        </div>
      </Section>

      {/* Trend line */}
      <Section title={project.type === 'trip' ? '旅程走勢' : '近期趨勢'}>
        <div className="card" style={{ padding: 18 }}>
          <LineChart data={trend} currency={project.currency}/>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ padding: '22px 20px 0' }}>
      <div className="section-title" style={{ marginBottom: 10 }}>{title}</div>
      {children}
    </div>
  );
}

// ── SVG Pie ──
function PieChart({ data, total }) {
  const size = 120, r = 52, cx = size/2, cy = size/2;
  let angle = -Math.PI / 2;
  const arcs = data.map(d => {
    const slice = (d.amount / total) * Math.PI * 2;
    const x1 = cx + r * Math.cos(angle);
    const y1 = cy + r * Math.sin(angle);
    const end = angle + slice;
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    const large = slice > Math.PI ? 1 : 0;
    const path = `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`;
    angle = end;
    return { path, color: d.cat.color };
  });
  return (
    <svg width={size} height={size}>
      {arcs.map((a, i) => (
        <path key={i} d={a.path} fill={a.color} stroke="#FBF7F1" strokeWidth="1.5"/>
      ))}
      <circle cx={cx} cy={cy} r={28} fill="#FBF7F1"/>
      <text x={cx} y={cy - 2} textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="var(--sans)" letterSpacing="0.1em">TOTAL</text>
      <text x={cx} y={cy + 12} textAnchor="middle" fontSize="13" fill="var(--ink)" fontFamily="var(--mono)" fontWeight="600">
        {(total / 1000).toFixed(total >= 10000 ? 0 : 1)}k
      </text>
    </svg>
  );
}

function TwoPersonBar({ bal, currency }) {
  const max = Math.max(bal.avaPaid, bal.kaiPaid, 1);
  const rows = [
    { p: PEOPLE.ava, v: bal.avaPaid },
    { p: PEOPLE.kai, v: bal.kaiPaid },
  ];
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {rows.map(r => (
        <div key={r.p.id}>
          <div className="row between" style={{ fontSize: 12, marginBottom: 5 }}>
            <div className="row" style={{ gap: 7 }}>
              <Avatar person={r.p} size={18}/>
              <span style={{ color: 'var(--ink-soft)', fontWeight: 500 }}>{r.p.name}</span>
            </div>
            <span className="num" style={{ color: 'var(--ink)', fontWeight: 600 }}>
              {fmtMoney(r.v, currency)}
            </span>
          </div>
          <div style={{ height: 12, borderRadius: 12, background: 'var(--primary-faint)', overflow: 'hidden' }}>
            <div style={{
              width: `${(r.v / max) * 100}%`, height: '100%',
              background: `var(${r.p.colorVar})`,
              borderRadius: 12, transition: 'width 0.6s ease',
            }}/>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── SVG Line ──
function LineChart({ data, currency }) {
  if (data.length === 0) return <div style={{ color: 'var(--muted)', fontSize: 13, textAlign: 'center', padding: 20 }}>暫無資料</div>;
  const W = 310, H = 130, pad = { l: 12, r: 12, t: 14, b: 22 };
  const max = Math.max(...data.map(d => d.value));
  const step = data.length > 1 ? (W - pad.l - pad.r) / (data.length - 1) : 0;
  const y = v => H - pad.b - (v / max) * (H - pad.t - pad.b);
  const pts = data.map((d, i) => ({ x: pad.l + i * step, y: y(d.value), d }));
  const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
  const area = path + ` L${pts[pts.length-1].x},${H - pad.b} L${pad.l},${H - pad.b} Z`;

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#8FAF9F" stopOpacity="0.35"/>
          <stop offset="100%" stopColor="#8FAF9F" stopOpacity="0"/>
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map(f => (
        <line key={f} x1={pad.l} x2={W - pad.r} y1={pad.t + f * (H - pad.t - pad.b)} y2={pad.t + f * (H - pad.t - pad.b)}
          stroke="var(--line-soft)" strokeDasharray="2 3"/>
      ))}
      <path d={area} fill="url(#lineGrad)"/>
      <path d={path} fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      {pts.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="4" fill="#FBF7F1" stroke="var(--accent)" strokeWidth="2"/>
          <text x={p.x} y={H - 6} textAnchor="middle" fontSize="9" fill="var(--muted)" fontFamily="var(--mono)">
            {p.d.key.slice(5)}
          </text>
        </g>
      ))}
    </svg>
  );
}

Object.assign(window, { Stats });
