// App root — project picker + in-project tabs + add-entry modal

function App() {
  const [projects, setProjects] = React.useState(() => {
    const saved = localStorage.getItem('projects_v1');
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return INITIAL_PROJECTS;
  });
  const [pinnedId, setPinnedId] = React.useState(() => localStorage.getItem('pinnedId_v1') || null);
  const [currentId, setCurrentId] = React.useState(() => {
    const last = localStorage.getItem('currentId_v1');
    const pin = localStorage.getItem('pinnedId_v1');
    return pin || last || null;
  });
  const [tab, setTab] = React.useState(() => localStorage.getItem('tab_v1') || 'home');
  const [showNewProject, setShowNewProject] = React.useState(false);
  const [showAddEntry, setShowAddEntry] = React.useState(false);

  const [people, setPeople] = React.useState(() => {
    const saved = localStorage.getItem('people_v1');
    if (saved) { try { return JSON.parse(saved); } catch {} }
    return PEOPLE;
  });
  const [customPMs, setCustomPMs] = React.useState([]);
  const [customCats, setCustomCats] = React.useState([]);
  const [rate, setRate] = React.useState(RATES_TO_NTD.JPY);

  // Persist
  React.useEffect(() => { localStorage.setItem('projects_v1', JSON.stringify(projects)); }, [projects]);
  React.useEffect(() => { if (currentId) localStorage.setItem('currentId_v1', currentId); else localStorage.removeItem('currentId_v1'); }, [currentId]);
  React.useEffect(() => { if (pinnedId) localStorage.setItem('pinnedId_v1', pinnedId); else localStorage.removeItem('pinnedId_v1'); }, [pinnedId]);
  React.useEffect(() => { localStorage.setItem('tab_v1', tab); }, [tab]);
  React.useEffect(() => { localStorage.setItem('people_v1', JSON.stringify(people)); }, [people]);

  const current = projects.find(p => p.id === currentId);

  const openProject = (id) => { setCurrentId(id); setTab('home'); };
  const closeProject = () => { setCurrentId(null); };

  const createProject = (p) => {
    setProjects(ps => [...ps, p]);
    setShowNewProject(false);
    openProject(p.id);
  };

  const addEntry = (entry) => {
    setProjects(ps => ps.map(p => p.id === currentId ? { ...p, entries: [...p.entries, entry] } : p));
    setShowAddEntry(false);
  };

  const addCustomPM = (name) => {
    const id = 'pm_' + Date.now();
    setCustomPMs(xs => [...xs, { id, emoji: '✨', label: name, tokenVar: '--pm-custom' }]);
  };
  const deleteCustomPM = (id) => setCustomPMs(xs => xs.filter(x => x.id !== id));
  const addCustomCat = (emoji, label) => {
    setCustomCats(xs => [...xs, { id: 'c_' + Date.now(), emoji, label, color: '#A89F97' }]);
  };

  const renamePerson = (pid, name) => {
    if (!name.trim()) return;
    setPeople(p => ({ ...p, [pid]: { ...p[pid], name: name.trim() } }));
  };
  const clearData = () => {
    setProjects(ps => ps.map(p => p.id === currentId ? { ...p, entries: [] } : p));
  };

  // Expose for AddEntry's custom PM handler
  React.useEffect(() => { window.__addCustomPM = addCustomPM; }, []);

  return (
    <div className="stage">
      <div className="phone">
        <div className="notch"/>
        <div className="phone-inner">
          <StatusBar/>

          {!current ? (
            <div className="scroll">
              <ProjectList
                projects={projects}
                onOpen={openProject}
                onNew={() => setShowNewProject(true)}
                pinnedId={pinnedId}
                onTogglePin={(id) => setPinnedId(cur => cur === id ? null : id)}
              />
            </div>
          ) : (
            <>
              <div className="scroll" key={tab + current.id}>
                {tab === 'home' && (
                  <Dashboard project={current} onBack={closeProject}
                    onQuickAdd={() => setShowAddEntry(true)}
                    onGoToRecord={() => setTab('records')}
                    onGoToStats={() => setTab('stats')}/>
                )}
                {tab === 'records' && <Records project={current}/>}
                {tab === 'stats' && <Stats project={current}/>}
                {tab === 'settings' && (
                  <Settings project={current} people={people}
                    onRenamePerson={renamePerson}
                    customPMs={customPMs} onAddCustomPM={addCustomPM} onDeleteCustomPM={deleteCustomPM}
                    customCats={customCats} onAddCustomCat={addCustomCat}
                    rate={rate} onSetRate={setRate}
                    onClearData={clearData}/>
                )}
              </div>
              <TabBar current={tab} onChange={setTab} onAdd={() => setShowAddEntry(true)}/>
            </>
          )}

          <div className="home-bar"/>
        </div>
      </div>

      {/* Modals — rendered into phone via portal-like fixed positioning */}
      {showNewProject && (
        <ModalMount>
          <NewProjectSheet open={showNewProject}
            onClose={() => setShowNewProject(false)}
            onCreate={createProject}/>
        </ModalMount>
      )}
      {showAddEntry && current && (
        <ModalMount fullscreen>
          <AddEntry project={current} onClose={() => setShowAddEntry(false)}
            onSave={addEntry} customPMs={customPMs}/>
        </ModalMount>
      )}
    </div>
  );
}

function ModalMount({ children, fullscreen }) {
  // Inject into the .phone-inner via a side-effect — we render fixed inside the stage
  // But simpler: use an absolutely-positioned overlay within the phone that matches it.
  const [host, setHost] = React.useState(null);
  React.useEffect(() => {
    const el = document.querySelector('.phone-inner');
    setHost(el);
  }, []);
  if (!host) return null;
  return ReactDOM.createPortal(
    <div style={{
      position: 'absolute', inset: 0, zIndex: 500,
      background: fullscreen ? 'var(--bg)' : 'transparent',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {fullscreen && <StatusBar/>}
      <div style={{ flex: 1, position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
    </div>,
    host
  );
}

function TabBar({ current, onChange, onAdd }) {
  const tabs = [
    { id: 'home',     label: '首頁', icon: 'home' },
    { id: 'records',  label: '紀錄', icon: 'list' },
    { id: 'add',      label: '',     icon: 'plus', isAdd: true },
    { id: 'stats',    label: '分析', icon: 'chart' },
    { id: 'settings', label: '設定', icon: 'gear' },
  ];
  return (
    <div className="tabbar">
      {tabs.map(t => {
        if (t.isAdd) {
          return (
            <div key={t.id} className="fab-tab">
              <button className="fab pressable" onClick={onAdd}>
                <Icon name="plus" size={26} stroke={2.2} color="#FBF7F1"/>
              </button>
            </div>
          );
        }
        const active = current === t.id;
        return (
          <button key={t.id} className={'tab-btn' + (active ? ' active' : '')}
            onClick={() => onChange(t.id)}>
            <div className="tab-icon">
              <Icon name={t.icon} size={20} stroke={active ? 2 : 1.6}
                color={active ? 'var(--accent)' : 'var(--muted)'}/>
            </div>
            <div>{t.label}</div>
          </button>
        );
      })}
    </div>
  );
}

Object.assign(window, { App, TabBar });

// Mount
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App/>);
