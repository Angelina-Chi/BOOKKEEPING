// Dashboard page — inside a project

function Dashboard({ project, onBack, onQuickAdd, onGoToRecord, onGoToStats }) {
  const total = projectTotal(project);
  const bal = balance(project);
  const budgetPct = project.budget ? Math.min(100, (total / project.budget) * 100) : 0;
  const recent = [...project.entries].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 5);
  const ava = PEOPLE.ava, kai = PEOPLE.kai;

  return (
    <div className="page-enter" style={{ paddingBottom: 24 }}>
      {/* Top bar */}
      <div style={{ padding: '4px 20px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button className="pressable" onClick={onBack}
          style={{
            width: 40, height: 40, borderRadius: '50%',
            background: 'var(--surface)',
            display: 'grid', placeItems: 'center',
            boxShadow: 'var(--shadow-sm)',
            color: 'var(--ink-soft)',
          }}>
          <Icon name="back" size={18}/>
        </button>
        <div style={{ textAlign: 'center' }}>
          <div className="serif" style={{ fontSize: 18, fontWeight: 500 }}>
            {project.emoji} {project.name}
          </div>
          <div style={{ fontSize: 10, color: 'var(--muted)', letterSpacing: 0.15, marginTop: 1 }}>
            {project.currency} · {project.subtitle}
          </div>
        </div>
        <div style={{ display: 'flex', gap: -6 }}>
          <Avatar person={ava} size={32}/>
          <div style={{ marginLeft: -8 }}><Avatar person={kai} size={32}/></div>
        </div>
      </div>

      {/* Hero — total & budget */}
      <div style={{ padding: '0 20px' }}>
        <div style={{
          background: 'linear-gradient(160deg, #F5EFE4 0%, #EAE3D4 100%)',
          borderRadius: 'var(--r-hero)',
          padding: '22px 22px 18px',
          position: 'relative', overflow: 'hidden',
          boxShadow: 'var(--shadow-sm)',
        }}>
          {/* soft deco */}
          <div style={{ position: 'absolute', top: -40, right: -40, width: 140, height: 140, borderRadius: '50%', background: 'radial-gradient(circle, rgba(143,175,159,0.35), transparent 70%)' }}/>

          <div className="label">本月共同支出</div>
          <div style={{ marginTop: 8, display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span className="num" style={{ fontSize: 36, fontWeight: 500, color: 'var(--ink)', letterSpacing: -0.5 }}>
              {fmtMoney(total, project.currency)}
            </span>
          </div>

          {project.budget && (
            <div style={{ marginTop: 14 }}>
              <div className="progress-track" style={{ background: 'rgba(255,255,255,0.55)' }}>
                <div className="progress-fill" style={{ width: `${budgetPct}%` }}/>
              </div>
              <div className="row between" style={{ marginTop: 8, fontSize: 12, color: 'var(--ink-soft)' }}>
                <span>預算 <span className="num">{fmtMoney(project.budget, project.currency)}</span></span>
                <span className="num">{budgetPct.toFixed(0)}% 已用</span>
              </div>
            </div>
          )}
        </div>

        {/* Split summary */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 12 }}>
          <SplitCard person={ava} share={bal.avaShare} paid={bal.avaPaid} currency={project.currency}/>
          <SplitCard person={kai} share={bal.kaiShare} paid={bal.kaiPaid} currency={project.currency}/>
        </div>

        {/* Owe banner */}
        {Math.abs(bal.avaOwes) > 0.5 && (
          <button onClick={onGoToStats} className="pressable"
            style={{
              width: '100%', marginTop: 12,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              background: 'var(--primary-faint)',
              borderRadius: 16, padding: '12px 16px',
              border: '1px solid color-mix(in oklch, var(--primary) 30%, transparent)',
            }}>
            <div style={{ fontSize: 13, color: 'var(--accent-deep)' }}>
              {bal.avaOwes > 0 ? (
                <>💚 <b>{ava.name}</b> 要給 <b>{kai.name}</b></>
              ) : (
                <>💚 <b>{kai.name}</b> 要給 <b>{ava.name}</b></>
              )}
            </div>
            <div className="num" style={{ fontWeight: 600, color: 'var(--accent-deep)' }}>
              {fmtMoney(Math.abs(bal.avaOwes), project.currency)}
            </div>
          </button>
        )}
      </div>

      {/* Recent entries */}
      <div style={{ padding: '24px 20px 12px' }}>
        <div className="row between" style={{ marginBottom: 12 }}>
          <div className="section-title">最近紀錄</div>
          <button onClick={onGoToRecord} style={{ color: 'var(--accent)', fontSize: 12, fontWeight: 500 }}>
            查看全部 →
          </button>
        </div>
        <div className="card" style={{ padding: '4px 0' }}>
          {recent.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
              還沒有任何紀錄，開始記第一筆吧 ✨
            </div>
          )}
          {recent.map((e, i) => (
            <EntryRow key={e.id} entry={e} currency={project.currency} isLast={i === recent.length - 1}/>
          ))}
        </div>
      </div>
    </div>
  );
}

function SplitCard({ person, share, paid, currency }) {
  const net = paid - share; // >0 => paid more than share (creditor)
  return (
    <div className="card" style={{ padding: '14px 14px 12px' }}>
      <div className="row" style={{ gap: 8, marginBottom: 10 }}>
        <Avatar person={person} size={24}/>
        <div style={{ fontSize: 13, fontWeight: 500 }}>{person.name}</div>
      </div>
      <div className="label" style={{ fontSize: 10 }}>應分擔</div>
      <div className="num" style={{ fontSize: 17, fontWeight: 600, color: 'var(--ink)', marginTop: 2 }}>
        {fmtMoney(share, currency)}
      </div>
      <div style={{
        marginTop: 8, paddingTop: 8,
        borderTop: '1px dashed var(--line)',
        fontSize: 11, color: net >= 0 ? 'var(--accent)' : 'var(--pm-bank)',
      }}>
        已付 <span className="num">{fmtMoney(paid, currency)}</span>
      </div>
    </div>
  );
}

function EntryRow({ entry, currency, isLast, onClick }) {
  const cat = getCat(entry.catId);
  const pm = getPM(entry.pm);
  const person = PEOPLE[entry.payer];
  return (
    <button onClick={onClick} className="pressable"
      style={{
        width: '100%', textAlign: 'left',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '12px 14px',
        borderBottom: isLast ? 'none' : '1px solid var(--line-soft)',
        background: 'transparent',
      }}>
      <div className="cat-icon" style={{ background: `color-mix(in oklch, ${cat.color} 25%, #fff)` }}>
        {cat.emoji}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {entry.note}
        </div>
        <div className="row" style={{ gap: 6, marginTop: 3 }}>
          <PMChip pm={pm} small/>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>·</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)' }}>
            <Avatar person={person} size={14}/>
            {person.name} 付
          </span>
        </div>
      </div>
      <div className="num" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>
        {fmtMoney(entry.amount, currency)}
      </div>
    </button>
  );
}

Object.assign(window, { Dashboard, EntryRow, SplitCard });
