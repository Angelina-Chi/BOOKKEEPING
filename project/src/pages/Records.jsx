// Records page — full history with filters

function Records({ project }) {
  const [filter, setFilter] = React.useState('all'); // 'all' | 'mine' | 'theirs'
  const [pmFilter, setPmFilter] = React.useState('all');
  const [showFilter, setShowFilter] = React.useState(false);
  const [monthOffset, setMonthOffset] = React.useState(0);
  const [deletedIds, setDeletedIds] = React.useState([]);
  const [swipedId, setSwipedId] = React.useState(null);

  const isTrip = project.type === 'trip';
  const [tripView, setTripView] = React.useState('all'); // 'all' | 'date'

  let entries = project.entries.filter(e => !deletedIds.includes(e.id));
  if (filter === 'mine')   entries = entries.filter(e => e.payer === 'ava');
  if (filter === 'theirs') entries = entries.filter(e => e.payer === 'kai');
  if (pmFilter !== 'all')  entries = entries.filter(e => e.pm === pmFilter);

  // For non-trip, month filter
  let monthLabel = '';
  if (!isTrip) {
    const now = new Date();
    now.setMonth(now.getMonth() + monthOffset);
    const y = now.getFullYear();
    const m = now.getMonth();
    monthLabel = `${y}.${String(m + 1).padStart(2, '0')}`;
    entries = entries.filter(e => {
      const [ey, em] = e.date.split('-').map(Number);
      return ey === y && em === m + 1;
    });
  }

  const groups = groupByDate(entries);

  return (
    <div className="page-enter" style={{ padding: '0 0 24px' }}>
      {/* Top bar — month or trip toggle */}
      <div style={{ padding: '4px 20px 16px' }}>
        {isTrip ? (
          <div className="row between">
            <div>
              <div className="label">旅程紀錄</div>
              <div className="serif" style={{ fontSize: 22, fontWeight: 500 }}>{project.name}</div>
            </div>
            <div style={{ display: 'flex', background: 'var(--surface)', borderRadius: 12, padding: 3, boxShadow: 'var(--shadow-sm)' }}>
              {[{k:'all',l:'全部'},{k:'date',l:'依日期'}].map(o => (
                <button key={o.k} onClick={() => setTripView(o.k)}
                  style={{
                    padding: '6px 12px', borderRadius: 10, fontSize: 12,
                    background: tripView === o.k ? 'var(--accent)' : 'transparent',
                    color: tripView === o.k ? '#fbf7f1' : 'var(--ink-soft)',
                    fontWeight: 500,
                  }}>{o.l}</button>
              ))}
            </div>
          </div>
        ) : (
          <div className="row between">
            <button onClick={() => setMonthOffset(m => m - 1)} className="pressable"
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <Icon name="left" size={16}/>
            </button>
            <div style={{ textAlign: 'center' }}>
              <div className="label">月份</div>
              <div className="serif num" style={{ fontSize: 22, fontWeight: 500 }}>{monthLabel}</div>
            </div>
            <button onClick={() => setMonthOffset(m => m + 1)} className="pressable"
              style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)', display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-sm)' }}>
              <Icon name="right" size={16}/>
            </button>
          </div>
        )}
      </div>

      {/* Filter row */}
      <div style={{ padding: '0 20px', display: 'flex', gap: 6, overflowX: 'auto' }}>
        {[
          { k: 'all',    l: '全部' },
          { k: 'mine',   l: `${PEOPLE.ava.name} 付的` },
          { k: 'theirs', l: `${PEOPLE.kai.name} 付的` },
        ].map(o => (
          <button key={o.k} onClick={() => setFilter(o.k)}
            className={'chip' + (filter === o.k ? ' active' : '')}>
            {o.l}
          </button>
        ))}
        <button onClick={() => setShowFilter(v => !v)}
          className={'chip' + (pmFilter !== 'all' ? ' active' : '')}
          style={{ marginLeft: 'auto', flexShrink: 0 }}>
          <Icon name="filter" size={12}/>
          {pmFilter === 'all' ? '付款方式' : getPM(pmFilter).label}
        </button>
      </div>

      {showFilter && (
        <div style={{ padding: '10px 20px 0', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <button onClick={() => { setPmFilter('all'); setShowFilter(false); }}
            className={'chip' + (pmFilter === 'all' ? ' active' : '')}>全部</button>
          {PAYMENT_METHODS.map(m => (
            <button key={m.id} onClick={() => { setPmFilter(m.id); setShowFilter(false); }}
              className={'chip' + (pmFilter === m.id ? ' active' : '')}
              style={pmFilter === m.id ? {
                background: `var(${m.tokenVar})`,
                borderColor: `var(${m.tokenVar})`,
              } : {}}>
              {m.emoji} {m.label}
            </button>
          ))}
        </div>
      )}

      {/* Summary strip */}
      <div style={{ padding: '16px 20px 0' }}>
        <div className="card-soft" style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <div className="label" style={{ fontSize: 10 }}>合計</div>
            <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 2, color: 'var(--accent-deep)' }}>
              {fmtMoney(entries.reduce((s, e) => s + e.amount, 0), project.currency)}
            </div>
          </div>
          <div>
            <div className="label" style={{ fontSize: 10 }}>筆數</div>
            <div className="num" style={{ fontSize: 18, fontWeight: 600, marginTop: 2, color: 'var(--accent-deep)' }}>
              {entries.length}
            </div>
          </div>
        </div>
      </div>

      {/* Groups */}
      <div style={{ padding: '12px 20px' }}>
        {groups.length === 0 && (
          <div style={{ padding: '40px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 13 }}>
            這個區間沒有紀錄 ·͜·
          </div>
        )}
        {groups.map(g => {
          const d = formatDateLabel(g.date);
          return (
            <div key={g.date} style={{ marginBottom: 18 }}>
              <div className="row between" style={{ padding: '4px 6px 8px' }}>
                <div className="row" style={{ gap: 8 }}>
                  <span className="num" style={{ fontSize: 15, fontWeight: 600, color: 'var(--ink)' }}>{d.md}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{d.weekday}</span>
                </div>
                <span className="num" style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {fmtMoney(g.total, project.currency)}
                </span>
              </div>
              <div className="card" style={{ padding: '2px 0' }}>
                {g.items.map((e, i) => (
                  <SwipeRow key={e.id}
                    swiped={swipedId === e.id}
                    onSwipe={() => setSwipedId(swipedId === e.id ? null : e.id)}
                    onDelete={() => { setDeletedIds(d => [...d, e.id]); setSwipedId(null); }}>
                    <EntryRow entry={e} currency={project.currency} isLast={i === g.items.length - 1} onClick={() => setSwipedId(swipedId === e.id ? null : e.id)}/>
                  </SwipeRow>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SwipeRow({ children, swiped, onSwipe, onDelete }) {
  return (
    <div style={{ position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0,
        width: 80, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--pm-bank)', color: '#fff',
      }}>
        <button onClick={onDelete} style={{ color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <Icon name="trash" size={18} color="#fff"/>
          <span style={{ fontSize: 10 }}>刪除</span>
        </button>
      </div>
      <div style={{
        transform: swiped ? 'translateX(-80px)' : 'translateX(0)',
        transition: 'transform 0.25s cubic-bezier(0.22,1,0.36,1)',
        background: 'var(--surface)', position: 'relative',
      }}>
        {children}
      </div>
    </div>
  );
}

Object.assign(window, { Records });
