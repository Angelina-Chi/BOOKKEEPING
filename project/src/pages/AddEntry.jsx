// Add entry page

function AddEntry({ project, onClose, onSave, customPMs = [] }) {
  const [amount, setAmount] = React.useState('');
  const [catId, setCatId] = React.useState('food');
  const [note, setNote] = React.useState('');
  const [payer, setPayer] = React.useState('ava');
  const [pm, setPm] = React.useState('linepay');
  const [split, setSplit] = React.useState('even'); // 'even' | 'ava' | 'kai' | 'percent' | 'amount'
  const [customSplit, setCustomSplit] = React.useState(50); // ava's %
  const [avaAmount, setAvaAmount] = React.useState(''); // manual split amount for ava
  const [date, setDate] = React.useState(new Date().toISOString().slice(0, 10));
  const [showCustomPM, setShowCustomPM] = React.useState(false);
  const [customPMName, setCustomPMName] = React.useState('');

  const allPMs = [...PAYMENT_METHODS, ...customPMs];
  const sym = CURRENCIES[project.currency].symbol;

  const canSave = amount && Number(amount) > 0;

  const handleSave = () => {
    if (!canSave) return;
    let splitRule = split;
    if (split === 'percent') splitRule = { ava: customSplit / 100, kai: (100 - customSplit) / 100 };
    if (split === 'amount') {
      const a = Number(avaAmount) || 0;
      const total = Number(amount) || 1;
      splitRule = { ava: a / total, kai: (total - a) / total };
    }
    onSave({
      id: 'e' + Date.now(),
      date,
      catId,
      pm,
      payer,
      amount: Number(amount),
      note: note.trim() || getCat(catId).label,
      split: splitRule,
    });
  };

  const handleAddCustomPM = () => {
    if (!customPMName.trim()) return;
    setShowCustomPM(false);
    setCustomPMName('');
    // Parent stores custom PM list — here we just push to window for simplicity
    if (window.__addCustomPM) window.__addCustomPM(customPMName.trim());
  };

  const keypad = [1,2,3,4,5,6,7,8,9,'.',0,'⌫'];
  const tapKey = (k) => {
    if (k === '⌫') return setAmount(a => a.slice(0, -1));
    if (k === '.' && amount.includes('.')) return;
    setAmount(a => (a + k).replace(/^0(?!\.)/, ''));
  };

  return (
    <div className="page-enter" style={{ height: '100%', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      {/* Top */}
      <div className="row between" style={{ padding: '4px 20px 8px' }}>
        <button onClick={onClose} className="pressable"
          style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--surface)',
            display: 'grid', placeItems: 'center', boxShadow: 'var(--shadow-sm)', color: 'var(--ink-soft)' }}>
          <Icon name="close" size={18}/>
        </button>
        <div className="serif" style={{ fontSize: 18, fontWeight: 500 }}>新增一筆</div>
        <div style={{ width: 36 }}/>
      </div>

      <div className="scroll" style={{ padding: '0 20px 20px' }}>
        {/* Amount */}
        <div style={{
          marginTop: 8,
          background: 'linear-gradient(160deg, #F5EFE4 0%, #EAE3D4 100%)',
          borderRadius: 22, padding: '20px 22px',
        }}>
          <div className="label">金額 ({project.currency})</div>
          <div className="row" style={{ alignItems: 'baseline', gap: 8, marginTop: 6 }}>
            <span className="num" style={{ fontSize: 28, color: 'var(--muted)' }}>{sym}</span>
            <span className="num" style={{ fontSize: 44, fontWeight: 500, color: 'var(--ink)', letterSpacing: -0.5 }}>
              {amount ? Number(amount).toLocaleString('en-US') : <span style={{ color: 'var(--muted-soft)' }}>0</span>}
            </span>
          </div>
        </div>

        {/* Category */}
        <Label>分類</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setCatId(c.id)} className="pressable"
              style={{
                padding: '12px 6px',
                borderRadius: 14,
                background: catId === c.id ? `color-mix(in oklch, ${c.color} 25%, #fff)` : 'var(--surface)',
                border: `1.5px solid ${catId === c.id ? c.color : 'var(--line)'}`,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              }}>
              <span style={{ fontSize: 22 }}>{c.emoji}</span>
              <span style={{ fontSize: 11, color: 'var(--ink-soft)' }}>{c.label}</span>
            </button>
          ))}
        </div>

        {/* Note */}
        <Label>備註</Label>
        <input className="input" value={note} onChange={e => setNote(e.target.value)}
          placeholder="吃了什麼、買了什麼..."/>

        {/* Payer */}
        <Label>誰付的</Label>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
          {['ava','kai'].map(pid => {
            const p = PEOPLE[pid];
            const active = payer === pid;
            return (
              <button key={pid} onClick={() => setPayer(pid)} className="pressable"
                style={{
                  padding: '12px', borderRadius: 14,
                  background: active ? `color-mix(in oklch, var(${p.colorVar}) 18%, #fff)` : 'var(--surface)',
                  border: `1.5px solid ${active ? `var(${p.colorVar})` : 'var(--line)'}`,
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                <Avatar person={p} size={28}/>
                <div style={{ fontSize: 14, fontWeight: 500 }}>{p.name}</div>
              </button>
            );
          })}
        </div>

        {/* Payment method */}
        <Label>付款方式</Label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {allPMs.map(m => (
            <button key={m.id} onClick={() => setPm(m.id)}
              className={'chip' + (pm === m.id ? ' active' : '')}
              style={pm === m.id ? {
                background: `var(${m.tokenVar})`,
                borderColor: `var(${m.tokenVar})`,
                boxShadow: `0 4px 10px color-mix(in oklch, var(${m.tokenVar}) 40%, transparent)`,
              } : {}}>
              <span>{m.emoji}</span>{m.label}
            </button>
          ))}
          <button onClick={() => setShowCustomPM(true)} className="chip"
            style={{ borderStyle: 'dashed' }}>
            <Icon name="plus" size={12}/>自訂
          </button>
        </div>

        {/* Split */}
        <Label>分帳方式</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 4 }}>
          {[
            {id:'even', label:'平均分'},
            {id:'ava',  label:PEOPLE.ava.name+'全付'},
            {id:'kai',  label:PEOPLE.kai.name+'全付'},
            {id:'percent', label:'自訂比例'},
            {id:'amount', label:'自訂金額'},
          ].map(s => (
            <button key={s.id} onClick={() => setSplit(s.id)} className="pressable"
              style={{
                padding: '10px 2px', borderRadius: 12,
                background: split === s.id ? 'var(--accent)' : 'var(--surface)',
                color: split === s.id ? '#fbf7f1' : 'var(--ink-soft)',
                border: `1px solid ${split === s.id ? 'var(--accent)' : 'var(--line)'}`,
                fontSize: 10.5, fontWeight: 500, lineHeight: 1.2,
              }}>{s.label}</button>
          ))}
        </div>
        {split === 'amount' && (
          <div style={{ marginTop: 10, padding: 14, background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--line)' }}>
            <div className="label" style={{ marginBottom: 8 }}>各自負擔金額（{project.currency}）</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div className="row" style={{ gap: 10, alignItems: 'center' }}>
                <Avatar person={PEOPLE.ava} size={22}/>
                <span style={{ fontSize: 13, width: 42 }}>{PEOPLE.ava.name}</span>
                <div className="row" style={{ flex: 1, gap: 6, alignItems: 'center',
                  border: '1px solid var(--line)', borderRadius: 10, padding: '6px 10px',
                  background: 'var(--bg-card)' }}>
                  <span className="num" style={{ color: 'var(--muted)', fontSize: 13 }}>{sym}</span>
                  <input type="number" inputMode="numeric" value={avaAmount}
                    onChange={e => setAvaAmount(e.target.value)}
                    placeholder="0"
                    style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent',
                      fontFamily: 'var(--mono)', fontSize: 14 }}/>
                </div>
              </div>
              <div className="row" style={{ gap: 10, alignItems: 'center' }}>
                <Avatar person={PEOPLE.kai} size={22}/>
                <span style={{ fontSize: 13, width: 42 }}>{PEOPLE.kai.name}</span>
                <div className="row" style={{ flex: 1, gap: 6, alignItems: 'center',
                  border: '1px solid var(--line-soft)', borderRadius: 10, padding: '6px 10px',
                  background: 'var(--bg-card)', opacity: 0.85 }}>
                  <span className="num" style={{ color: 'var(--muted)', fontSize: 13 }}>{sym}</span>
                  <span className="num" style={{ flex: 1, fontSize: 14, color: 'var(--ink)' }}>
                    {amount ? Math.max(0, Number(amount) - (Number(avaAmount) || 0)).toLocaleString('en-US') : '0'}
                  </span>
                  <span style={{ fontSize: 10, color: 'var(--muted)' }}>自動</span>
                </div>
              </div>
            </div>
            {amount && Number(avaAmount) > Number(amount) && (
              <div style={{ marginTop: 8, fontSize: 11, color: 'var(--pm-bank)' }}>
                ⚠ 金額超過總額
              </div>
            )}
          </div>
        )}
        {split === 'percent' && (
          <div style={{ marginTop: 10, padding: 12, background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--line)' }}>
            <div className="row between" style={{ fontSize: 12, marginBottom: 8 }}>
              <span><Avatar person={PEOPLE.ava} size={16}/> <b>{customSplit}%</b></span>
              <span><b>{100 - customSplit}%</b> <Avatar person={PEOPLE.kai} size={16}/></span>
            </div>
            <input type="range" min="0" max="100" step="5" value={customSplit}
              onChange={e => setCustomSplit(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent)' }}/>
          </div>
        )}

        {/* Date */}
        <Label>日期</Label>
        <div className="row" style={{ gap: 8, alignItems: 'center',
          background: 'var(--surface)', border: '1px solid var(--line)',
          borderRadius: 14, padding: '10px 14px' }}>
          <Icon name="calendar" size={18} color="var(--muted)"/>
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            style={{ border: 'none', outline: 'none', fontSize: 15, background: 'transparent', flex: 1 }}/>
        </div>

        {/* Keypad */}
        <Label>快速輸入</Label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
          {keypad.map(k => (
            <button key={k} onClick={() => tapKey(String(k))} className="pressable"
              style={{
                height: 46, borderRadius: 12,
                background: 'var(--surface)',
                border: '1px solid var(--line)',
                fontSize: 18, fontFamily: 'var(--mono)', color: 'var(--ink)',
              }}>{k}</button>
          ))}
        </div>

        <button onClick={handleSave} disabled={!canSave}
          className="pressable"
          style={{
            width: '100%', marginTop: 22,
            height: 54, borderRadius: 18,
            background: canSave ? 'var(--accent)' : 'var(--muted-soft)',
            color: '#fbf7f1',
            fontSize: 16, fontWeight: 600,
            boxShadow: canSave ? '0 10px 22px rgba(92,122,107,0.3)' : 'none',
          }}>
          記下這一筆 ✓
        </button>
      </div>

      {/* Custom PM sheet */}
      {showCustomPM && (
        <>
          <div className="sheet-backdrop" onClick={() => setShowCustomPM(false)}/>
          <div className="sheet">
            <div className="sheet-handle"/>
            <div className="serif" style={{ fontSize: 20, fontWeight: 500, marginBottom: 14 }}>自訂付款方式</div>
            <input className="input" autoFocus value={customPMName}
              onChange={e => setCustomPMName(e.target.value)}
              placeholder="例：街口、悠遊付、家人帳戶..."/>
            <button onClick={handleAddCustomPM} className="pressable"
              style={{ width: '100%', marginTop: 14, height: 48, borderRadius: 14,
                background: 'var(--accent)', color: '#fbf7f1', fontSize: 15, fontWeight: 600 }}>
              新增
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Label({ children }) {
  return <div className="label" style={{ marginTop: 18, marginBottom: 8 }}>{children}</div>;
}

Object.assign(window, { AddEntry, Label });
