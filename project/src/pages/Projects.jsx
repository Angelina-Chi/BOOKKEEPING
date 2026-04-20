// Project picker (app root) + new project sheet

function ProjectList({ projects, onOpen, onNew, pinnedId, onTogglePin }) {
  const sorted = [
    ...projects.filter(p => p.id === pinnedId),
    ...projects.filter(p => p.id !== pinnedId),
  ];
  return (
    <div className="page-enter" style={{ paddingBottom: 40 }}>
      {/* Header */}
      <div style={{ padding: '12px 24px 24px' }}>
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="label" style={{ marginBottom: 8 }}>OUR LEDGER</div>
            <div className="serif" style={{ fontSize: 32, lineHeight: 1.1, color: 'var(--ink)', fontWeight: 500 }}>
              一起記的<br/>小帳本
            </div>
          </div>
          <button className="pressable" onClick={onNew}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'var(--accent)', color: '#fbf7f1',
              display: 'grid', placeItems: 'center',
              boxShadow: '0 6px 14px rgba(92,122,107,0.3)',
            }}>
            <Icon name="plus" size={20} stroke={2} />
          </button>
        </div>
        <div style={{ marginTop: 14, color: 'var(--muted)', fontSize: 13 }}>
          與 <span style={{ color: `var(--p-ava)`, fontWeight: 600 }}>小鹿</span>・
          <span style={{ color: `var(--p-kai)`, fontWeight: 600 }}>阿凱</span> 共用
        </div>
      </div>

      {/* Projects */}
      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div className="label" style={{ padding: '0 4px' }}>你們的專案・{projects.length}</div>
        {sorted.map(p => (
          <ProjectCard key={p.id} project={p}
            onOpen={() => onOpen(p.id)}
            onTogglePin={() => onTogglePin(p.id)}
            pinned={pinnedId === p.id}/>
        ))}

        <button className="pressable" onClick={onNew}
          style={{
            height: 72, borderRadius: 'var(--r-card)',
            border: '1.5px dashed var(--primary-soft)',
            background: 'transparent',
            color: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
            fontSize: 14, fontWeight: 500,
          }}>
          <Icon name="plus" size={18} />
          新增專案
        </button>

        <div style={{ textAlign: 'center', color: 'var(--muted-soft)', fontSize: 11, padding: '24px 0 12px', letterSpacing: 0.1 }}>
          ━━━  made for two  ━━━
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, onOpen, onTogglePin, pinned }) {
  const total = projectTotal(project);
  const isGradient = project.cover.kind === 'gradient';
  const isImage = project.cover.kind === 'image';
  const budgetPct = project.budget ? Math.min(100, (total / project.budget) * 100) : 0;

  const coverStyle = isImage
    ? { backgroundImage: `url(${project.cover.value})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : { background: project.cover.value };

  return (
    <div style={{ position: 'relative' }}>
    <button className="pressable" onClick={onOpen}
      style={{
        textAlign: 'left', width: '100%',
        background: 'var(--surface)',
        borderRadius: 'var(--r-hero)',
        overflow: 'hidden',
        boxShadow: pinned ? '0 0 0 2px var(--primary), var(--shadow-md)' : 'var(--shadow-md)',
        padding: 0,
        display: 'block',
      }}>
      {/* Cover */}
      <div style={{
        height: 108,
        ...coverStyle,
        position: 'relative',
        display: 'flex', alignItems: 'flex-end',
        padding: 18,
      }}>
        {isImage && (
          <div style={{ position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(47,58,52,0.25) 100%)' }} />
        )}
        {isGradient && (
          <div style={{ position: 'absolute', inset: 0,
            background: 'radial-gradient(circle at 20% 100%, rgba(255,255,255,0.25), transparent 60%)' }} />
        )}
        <div style={{
          width: 52, height: 52,
          borderRadius: 16,
          background: 'rgba(255,255,255,0.82)',
          backdropFilter: 'blur(8px)',
          display: 'grid', placeItems: 'center',
          fontSize: 26,
          boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
          position: 'relative', zIndex: 1,
        }}>{project.emoji}</div>

        {/* Currency tag */}
        <div style={{
          position: 'absolute', top: 14, right: 14,
          padding: '5px 10px',
          background: 'rgba(251,247,241,0.88)',
          backdropFilter: 'blur(6px)',
          borderRadius: 10,
          fontSize: 11, fontWeight: 600,
          color: 'var(--accent-deep)',
          letterSpacing: 0.08,
          fontFamily: 'var(--mono)',
          zIndex: 1,
        }}>{project.currency}</div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 18px' }}>
        <div className="row between" style={{ alignItems: 'flex-start' }}>
          <div>
            <div className="serif" style={{ fontSize: 20, fontWeight: 500, color: 'var(--ink)' }}>
              {project.name}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              {project.subtitle}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div className="label" style={{ fontSize: 10 }}>TOTAL</div>
            <div className="num" style={{ fontSize: 18, fontWeight: 600, color: 'var(--accent-deep)', marginTop: 2 }}>
              {fmtMoney(total, project.currency)}
            </div>
          </div>
        </div>

        {project.budget && (
          <div style={{ marginTop: 14 }}>
            <div className="progress-track"><div className="progress-fill" style={{ width: `${budgetPct}%` }}/></div>
            <div className="row between" style={{ marginTop: 6, fontSize: 11, color: 'var(--muted)' }}>
              <span>預算 {fmtMoney(project.budget, project.currency)}</span>
              <span className="num">{budgetPct.toFixed(0)}%</span>
            </div>
          </div>
        )}
      </div>
    </button>
    {/* Pin button */}
    <button onClick={(e) => { e.stopPropagation(); onTogglePin(); }} className="pressable"
      style={{
        position: 'absolute', top: 12, left: 12, zIndex: 2,
        width: 30, height: 30, borderRadius: '50%',
        background: pinned ? 'var(--accent)' : 'rgba(251,247,241,0.88)',
        backdropFilter: 'blur(6px)',
        display: 'grid', placeItems: 'center',
        color: pinned ? '#fbf7f1' : 'var(--muted)',
        boxShadow: pinned ? '0 4px 10px rgba(92,122,107,0.35)' : '0 2px 6px rgba(0,0,0,0.08)',
      }} title={pinned ? '取消釘選' : '釘選 · 打開 App 直接進入'}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 17v5"/>
        <path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>
      </svg>
    </button>
    </div>
  );
}

// ── New project sheet ──
const EMOJI_SET = ['🌿','✈️','🏠','🍱','🎡','🗻','🏖️','☕','🎂','🌸','🎁','🐈','🌊','🍷','📚','🎨'];
const COVER_PRESETS = [
  { kind: 'solid',    value: '#E4EBE4' },
  { kind: 'solid',    value: '#E8DFD1' },
  { kind: 'solid',    value: '#D9C8C0' },
  { kind: 'gradient', value: 'linear-gradient(135deg, #94B3A9 0%, #B9967E 100%)' },
  { kind: 'gradient', value: 'linear-gradient(135deg, #C4A8A0 0%, #8FAF9F 100%)' },
  { kind: 'gradient', value: 'linear-gradient(135deg, #B6A3B8 0%, #94B3A9 100%)' },
];

function NewProjectSheet({ open, onClose, onCreate }) {
  const [name, setName] = React.useState('');
  const [emoji, setEmoji] = React.useState('🌿');
  const [currency, setCurrency] = React.useState('NTD');
  const [ccSearch, setCcSearch] = React.useState('');
  const [dateStart, setDateStart] = React.useState('');
  const [dateEnd, setDateEnd] = React.useState('');
  const [budget, setBudget] = React.useState('');
  const [coverIdx, setCoverIdx] = React.useState(0);
  const [uploadedImage, setUploadedImage] = React.useState(null);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    if (open) {
      setName(''); setEmoji('🌿'); setCurrency('NTD'); setCcSearch('');
      setDateStart(''); setDateEnd(''); setBudget(''); setCoverIdx(0);
      setUploadedImage(null);
    }
  }, [open]);

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setUploadedImage(ev.target.result); setCoverIdx(-1); };
    reader.readAsDataURL(file);
  };

  if (!open) return null;

  const currencyList = Object.values(CURRENCIES).filter(c =>
    !ccSearch || c.code.toLowerCase().includes(ccSearch.toLowerCase()) || c.label.includes(ccSearch)
  );

  const canCreate = name.trim().length > 0;

  const submit = () => {
    if (!canCreate) return;
    const cover = uploadedImage
      ? { kind: 'image', value: uploadedImage }
      : COVER_PRESETS[coverIdx];
    const range = (dateStart && dateEnd) ? { start: dateStart, end: dateEnd } : null;
    onCreate({
      id: 'p' + Date.now(),
      name: name.trim(),
      emoji,
      currency,
      type: range ? 'trip' : 'ongoing',
      dateRange: range,
      budget: budget ? Number(budget) : null,
      cover,
      entries: [],
      subtitle: range ? `${range.start.slice(5)} – ${range.end.slice(5)}` : '每月固定',
    });
  };

  return (
    <>
      <div className="sheet-backdrop" onClick={onClose}/>
      <div className="sheet">
        <div className="sheet-handle"/>
        <div className="row between" style={{ marginBottom: 18 }}>
          <div className="serif" style={{ fontSize: 24, fontWeight: 500 }}>新增專案</div>
          <button onClick={onClose} style={{ color: 'var(--muted)' }}><Icon name="close" size={22}/></button>
        </div>

        <Field label="專案名稱">
          <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="例：蜜月・京都賞楓"/>
        </Field>

        <Field label="封面 EMOJI">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: 8 }}>
            {EMOJI_SET.map(e => (
              <button key={e} onClick={() => setEmoji(e)}
                className="pressable"
                style={{
                  aspectRatio: '1/1', borderRadius: 12,
                  background: emoji === e ? 'var(--primary-faint)' : 'var(--surface)',
                  border: `1.5px solid ${emoji === e ? 'var(--primary)' : 'var(--line)'}`,
                  fontSize: 20,
                }}>{e}</button>
            ))}
          </div>
        </Field>

        <Field label="卡片封面">
          {uploadedImage && (
            <div style={{ marginBottom: 10, position: 'relative', height: 100, borderRadius: 14, overflow: 'hidden',
              border: '2px solid var(--accent)',
              backgroundImage: `url(${uploadedImage})`,
              backgroundSize: 'cover', backgroundPosition: 'center' }}>
              <button onClick={() => { setUploadedImage(null); setCoverIdx(0); }}
                style={{ position: 'absolute', top: 6, right: 6, width: 26, height: 26, borderRadius: '50%',
                  background: 'rgba(47,58,52,0.7)', color: '#fff', display: 'grid', placeItems: 'center' }}>
                <Icon name="close" size={14} color="#fff"/>
              </button>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 8 }}>
            {COVER_PRESETS.map((c, i) => (
              <button key={i} onClick={() => { setCoverIdx(i); setUploadedImage(null); }}
                className="pressable"
                style={{
                  aspectRatio: '1/1', borderRadius: 12,
                  background: c.value,
                  border: `2px solid ${coverIdx === i && !uploadedImage ? 'var(--accent)' : 'transparent'}`,
                  boxShadow: coverIdx === i && !uploadedImage ? '0 0 0 2px var(--bg)' : 'var(--shadow-inset)',
                }}/>
            ))}
            <button onClick={() => fileInputRef.current?.click()} className="pressable"
              style={{
                aspectRatio: '1/1', borderRadius: 12,
                background: 'var(--surface)',
                border: '1.5px dashed var(--primary-soft)',
                display: 'grid', placeItems: 'center',
                color: 'var(--accent)', fontSize: 18,
              }}>📷</button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageUpload}
              style={{ display: 'none' }}/>
          </div>
        </Field>

        <Field label="幣別">
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            border: '1px solid var(--line)',
            background: 'var(--surface)',
            borderRadius: 14, padding: '8px 12px', marginBottom: 8,
          }}>
            <Icon name="search" size={16} color="var(--muted)"/>
            <input value={ccSearch} onChange={e => setCcSearch(e.target.value)}
              placeholder="搜尋 NTD / JPY / USD..."
              style={{ flex: 1, border: 'none', outline: 'none', fontSize: 14, background: 'transparent' }}/>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {currencyList.map(c => (
              <button key={c.code} onClick={() => setCurrency(c.code)}
                className="pressable"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '12px 14px', borderRadius: 12,
                  background: currency === c.code ? 'var(--primary-faint)' : 'var(--surface)',
                  border: `1px solid ${currency === c.code ? 'var(--primary)' : 'var(--line)'}`,
                }}>
                <div className="row" style={{ gap: 10 }}>
                  <span className="num" style={{ fontSize: 16, color: 'var(--accent-deep)', width: 28 }}>{c.symbol}</span>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{c.code}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)' }}>{c.label}</span>
                </div>
                {currency === c.code && <Icon name="check" size={18} color="var(--accent)"/>}
              </button>
            ))}
          </div>
        </Field>

        <Field label="時間區間（選填）">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <input type="date" className="input" value={dateStart} onChange={e => setDateStart(e.target.value)}/>
            <input type="date" className="input" value={dateEnd} onChange={e => setDateEnd(e.target.value)}/>
          </div>
        </Field>

        <Field label="預算（選填）">
          <input className="input num" type="number" inputMode="numeric"
            value={budget} onChange={e => setBudget(e.target.value)}
            placeholder={`例：${currency === 'JPY' ? '200000' : '30000'}`}/>
        </Field>

        <button onClick={submit} disabled={!canCreate}
          className="pressable"
          style={{
            width: '100%', marginTop: 24,
            height: 54, borderRadius: 18,
            background: canCreate ? 'var(--accent)' : 'var(--muted-soft)',
            color: '#fbf7f1',
            fontSize: 16, fontWeight: 600,
            boxShadow: canCreate ? '0 10px 22px rgba(92,122,107,0.3)' : 'none',
          }}>建立這個小帳本</button>
      </div>
    </>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 18 }}>
      <div className="label" style={{ marginBottom: 8 }}>{label}</div>
      {children}
    </div>
  );
}

Object.assign(window, { ProjectList, NewProjectSheet, Field });
