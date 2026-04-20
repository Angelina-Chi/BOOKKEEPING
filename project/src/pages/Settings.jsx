// Settings page

function Settings({ project, people, onRenamePerson, customPMs, onAddCustomPM, onDeleteCustomPM,
                    customCats, onAddCustomCat, rate, onSetRate, onClearData }) {
  const [editingPerson, setEditingPerson] = React.useState(null);
  const [newPMName, setNewPMName] = React.useState('');
  const [newCatName, setNewCatName] = React.useState('');
  const [newCatEmoji, setNewCatEmoji] = React.useState('✨');
  const [rateInput, setRateInput] = React.useState(String(rate));
  const [confirmClear, setConfirmClear] = React.useState(false);

  return (
    <div className="page-enter" style={{ padding: '0 0 24px' }}>
      <div style={{ padding: '4px 20px 16px' }}>
        <div className="label">你與你</div>
        <div className="serif" style={{ fontSize: 26, fontWeight: 500 }}>設定</div>
      </div>

      {/* People */}
      <Group title="兩人">
        {Object.values(people).map(p => (
          <div key={p.id} className="row between" style={{ padding: '14px 16px', borderBottom: '1px solid var(--line-soft)' }}>
            <div className="row" style={{ gap: 12 }}>
              <Avatar person={p} size={36}/>
              <div>
                {editingPerson === p.id ? (
                  <input autoFocus defaultValue={p.name}
                    onBlur={e => { onRenamePerson(p.id, e.target.value); setEditingPerson(null); }}
                    onKeyDown={e => { if (e.key === 'Enter') e.target.blur(); }}
                    style={{ border: 'none', outline: 'none', fontSize: 15, fontWeight: 500, background: 'var(--primary-faint)', padding: '4px 8px', borderRadius: 6, width: 100 }}/>
                ) : (
                  <div style={{ fontSize: 15, fontWeight: 500 }}>{p.name}</div>
                )}
                <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>
                  頭像色：<span style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 2, background: `var(${p.colorVar})`, verticalAlign: 'middle' }}/>
                </div>
              </div>
            </div>
            <button onClick={() => setEditingPerson(p.id)} style={{ fontSize: 12, color: 'var(--accent)' }}>編輯</button>
          </div>
        ))}
      </Group>

      {/* Budget */}
      <Group title={project.type === 'trip' ? '旅程總預算' : '月預算'}>
        <div style={{ padding: '12px 16px' }}>
          <div className="row" style={{ gap: 8, alignItems: 'center' }}>
            <span className="num" style={{ color: 'var(--muted)' }}>{CURRENCIES[project.currency].symbol}</span>
            <input className="input num" defaultValue={project.budget || ''} placeholder="未設定"
              style={{ flex: 1 }}/>
          </div>
        </div>
      </Group>

      {/* Payment methods */}
      <Group title="付款方式">
        <div style={{ padding: '10px 14px' }}>
          {[...PAYMENT_METHODS, ...customPMs].map(m => (
            <div key={m.id} className="row between" style={{ padding: '10px 4px', borderBottom: '1px solid var(--line-soft)' }}>
              <div className="row" style={{ gap: 10 }}>
                <Icon name="drag" size={14} color="var(--muted-soft)"/>
                <div className="chip-pm" style={{
                  background: `color-mix(in oklch, var(${m.tokenVar}) 22%, #fff)`,
                  color: `color-mix(in oklch, var(${m.tokenVar}) 70%, #2F3A34)`,
                }}>
                  {m.emoji} {m.label}
                </div>
              </div>
              {customPMs.includes(m) && (
                <button onClick={() => onDeleteCustomPM(m.id)} style={{ color: 'var(--muted)' }}>
                  <Icon name="trash" size={14}/>
                </button>
              )}
            </div>
          ))}
          <div className="row" style={{ gap: 8, padding: '12px 4px 4px' }}>
            <input value={newPMName} onChange={e => setNewPMName(e.target.value)}
              placeholder="新付款方式..."
              className="input" style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}/>
            <button onClick={() => { if (newPMName.trim()) { onAddCustomPM(newPMName.trim()); setNewPMName(''); } }}
              className="pressable"
              style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fbf7f1', borderRadius: 10, fontSize: 13 }}>
              新增
            </button>
          </div>
        </div>
      </Group>

      {/* Categories */}
      <Group title="帳目分類">
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
            {[...CATEGORIES, ...customCats].map(c => (
              <div key={c.id} className="chip" style={{ borderColor: c.color }}>
                {c.emoji} {c.label}
              </div>
            ))}
          </div>
          <div className="row" style={{ gap: 6 }}>
            <input value={newCatEmoji} onChange={e => setNewCatEmoji(e.target.value)}
              className="input" style={{ width: 50, fontSize: 16, textAlign: 'center', padding: '8px' }} maxLength="2"/>
            <input value={newCatName} onChange={e => setNewCatName(e.target.value)}
              placeholder="新分類..."
              className="input" style={{ flex: 1, padding: '8px 12px', fontSize: 13 }}/>
            <button onClick={() => { if (newCatName.trim()) { onAddCustomCat(newCatEmoji, newCatName.trim()); setNewCatName(''); setNewCatEmoji('✨'); } }}
              className="pressable"
              style={{ padding: '8px 14px', background: 'var(--accent)', color: '#fbf7f1', borderRadius: 10, fontSize: 13 }}>
              新增
            </button>
          </div>
        </div>
      </Group>

      {/* Currency + rate */}
      <Group title="幣別與匯率">
        <div style={{ padding: '14px 16px' }}>
          <div className="row between" style={{ marginBottom: 10, fontSize: 13 }}>
            <span style={{ color: 'var(--muted)' }}>當前幣別</span>
            <span className="num" style={{ fontWeight: 600 }}>{project.currency} · {CURRENCIES[project.currency].symbol}</span>
          </div>
          <div className="label" style={{ marginTop: 10, marginBottom: 6 }}>參考匯率</div>
          <div className="row" style={{ gap: 6, alignItems: 'center', fontSize: 13 }}>
            <span className="num">1 {project.currency} =</span>
            <input type="number" step="0.001" value={rateInput} onChange={e => setRateInput(e.target.value)}
              onBlur={() => onSetRate(Number(rateInput))}
              className="input num" style={{ width: 100, padding: '8px 10px' }}/>
            <span>NTD</span>
          </div>
        </div>
      </Group>

      {/* Data */}
      <Group title="資料">
        <div style={{ padding: '4px 0' }}>
          <MenuRow icon="📤" label="匯出 CSV"/>
          <MenuRow icon="🗑️" label="清除本專案資料"
            dangerous onClick={() => setConfirmClear(true)} last/>
        </div>
      </Group>

      <div style={{ textAlign: 'center', color: 'var(--muted-soft)', fontSize: 11, padding: '26px 0 8px', letterSpacing: 0.15 }}>
        ━━  v1.0 · made with ♥  ━━
      </div>

      {confirmClear && (
        <>
          <div className="sheet-backdrop" onClick={() => setConfirmClear(false)}/>
          <div className="sheet">
            <div className="sheet-handle"/>
            <div className="serif" style={{ fontSize: 22, fontWeight: 500, marginBottom: 8 }}>確定清除？</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
              本專案的所有帳目將無法復原。
            </div>
            <button onClick={() => { onClearData(); setConfirmClear(false); }} className="pressable"
              style={{ width: '100%', height: 48, borderRadius: 14, background: 'var(--pm-bank)', color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>
              是的，清除
            </button>
            <button onClick={() => setConfirmClear(false)}
              style={{ width: '100%', height: 44, color: 'var(--muted)', fontSize: 13 }}>
              取消
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function Group({ title, children }) {
  return (
    <div style={{ padding: '0 20px', marginBottom: 18 }}>
      <div className="label" style={{ padding: '0 6px 8px' }}>{title}</div>
      <div className="card">{children}</div>
    </div>
  );
}

function MenuRow({ icon, label, dangerous, last, onClick }) {
  return (
    <button onClick={onClick} className="pressable"
      style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 16px',
        borderBottom: last ? 'none' : '1px solid var(--line-soft)',
        textAlign: 'left',
        color: dangerous ? 'var(--pm-bank)' : 'var(--ink)',
      }}>
      <span style={{ fontSize: 16 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14 }}>{label}</span>
      <Icon name="chevron" size={14} color="var(--muted-soft)"/>
    </button>
  );
}

Object.assign(window, { Settings });
