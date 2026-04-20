// Shared small components: icons, avatars, chips

function Icon({ name, size = 20, stroke = 1.6, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: stroke, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'home':   return <svg {...p}><path d="M3 11l9-7 9 7"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/></svg>;
    case 'list':   return <svg {...p}><path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>;
    case 'chart':  return <svg {...p}><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-6"/></svg>;
    case 'gear':   return <svg {...p}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case 'plus':   return <svg {...p}><path d="M12 5v14M5 12h14"/></svg>;
    case 'back':   return <svg {...p}><path d="M15 6l-6 6 6 6"/></svg>;
    case 'close':  return <svg {...p}><path d="M6 6l12 12M18 6L6 18"/></svg>;
    case 'left':   return <svg {...p}><path d="M15 6l-6 6 6 6"/></svg>;
    case 'right':  return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    case 'search': return <svg {...p}><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>;
    case 'filter': return <svg {...p}><path d="M3 5h18M6 12h12M10 19h4"/></svg>;
    case 'calendar': return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>;
    case 'trash':  return <svg {...p}><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13"/></svg>;
    case 'check':  return <svg {...p}><path d="M4 12l5 5L20 6"/></svg>;
    case 'drag':   return <svg {...p}><circle cx="9" cy="6" r="1.2" fill={color}/><circle cx="15" cy="6" r="1.2" fill={color}/><circle cx="9" cy="12" r="1.2" fill={color}/><circle cx="15" cy="12" r="1.2" fill={color}/><circle cx="9" cy="18" r="1.2" fill={color}/><circle cx="15" cy="18" r="1.2" fill={color}/></svg>;
    case 'wallet': return <svg {...p}><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M16 13h2"/><path d="M3 10h14a4 4 0 0 1 4 4"/></svg>;
    case 'chevron': return <svg {...p}><path d="M9 6l6 6-6 6"/></svg>;
    default: return null;
  }
}

function Avatar({ person, size = 28 }) {
  if (!person) return null;
  const color = `var(${person.colorVar})`;
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color,
      color: '#fbf7f1',
      fontFamily: 'var(--serif)',
      fontSize: size * 0.44,
      fontWeight: 500,
      display: 'grid', placeItems: 'center',
      letterSpacing: 0,
      boxShadow: 'inset 0 0 0 2px rgba(255,255,255,0.25)',
    }}>{person.initial}</div>
  );
}

function PMChip({ pm, small = false }) {
  const color = `var(${pm.tokenVar})`;
  if (small) {
    return (
      <span className="chip-pm" style={{
        background: `color-mix(in oklch, ${color} 22%, #fff)`,
        color: `color-mix(in oklch, ${color} 70%, #2F3A34)`,
        border: `1px solid color-mix(in oklch, ${color} 40%, transparent)`,
      }}>
        <span style={{ fontSize: 10 }}>{pm.emoji}</span>{pm.label}
      </span>
    );
  }
  return null;
}

function StatusBar() {
  return (
    <div className="status-bar">
      <div>9:41</div>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><rect x="0" y="7" width="3" height="4" rx="0.5" fill="currentColor"/><rect x="4.5" y="5" width="3" height="6" rx="0.5" fill="currentColor"/><rect x="9" y="3" width="3" height="8" rx="0.5" fill="currentColor"/><rect x="13.5" y="0" width="3" height="11" rx="0.5" fill="currentColor"/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 3C9.6 3 11.5 3.8 13 5.1l.9-1C12.2 2.5 10 1.5 7.5 1.5S2.8 2.5 1.1 4.1l.9 1C3.5 3.8 5.4 3 7.5 3z" fill="currentColor"/><path d="M7.5 6C8.8 6 10 6.5 10.8 7.3l.9-1C10.6 5.2 9.1 4.5 7.5 4.5S4.4 5.2 3.3 6.3l.9 1C5 6.5 6.2 6 7.5 6z" fill="currentColor"/><circle cx="7.5" cy="9" r="1.3" fill="currentColor"/></svg>
        <svg width="24" height="11" viewBox="0 0 24 11"><rect x="0.5" y="0.5" width="20" height="10" rx="2.5" fill="none" stroke="currentColor" strokeOpacity="0.5"/><rect x="2" y="2" width="16" height="7" rx="1.5" fill="currentColor"/><rect x="21" y="4" width="1.5" height="3" rx="0.5" fill="currentColor" fillOpacity="0.5"/></svg>
      </div>
    </div>
  );
}

Object.assign(window, { Icon, Avatar, PMChip, StatusBar });
