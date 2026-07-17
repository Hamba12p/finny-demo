// Finny — small inline-SVG icon set. Single-weight line icons, no fills,
// so they inherit currentColor and sit quietly inside ledger-style UI.

const Icon = {
  _wrap(size, inner) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;
  },
  key(size = 16) { return this._wrap(size, '<circle cx="8" cy="15" r="4"/><path d="M10.5 12.5 19 4M16 7l2.5 2.5M13 10l2 2"/>'); },
  wallet(size = 16) { return this._wrap(size, '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><circle cx="16.5" cy="14" r="1"/>'); },
  chart(size = 16) { return this._wrap(size, '<path d="M4 19V9M11 19V4M18 19v-7"/><path d="M2 19h20"/>'); },
  phone(size = 16) { return this._wrap(size, '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 18h4"/>'); },
  shield(size = 16) { return this._wrap(size, '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/>'); },
  alert(size = 16) { return this._wrap(size, '<path d="M12 4 2 20h20L12 4z"/><path d="M12 10v4"/><circle cx="12" cy="17" r="0.6" fill="currentColor" stroke="none"/>'); },
  check(size = 16) { return this._wrap(size, '<path d="M4 12.5 9.5 18 20 6"/>'); },
  cross(size = 16) { return this._wrap(size, '<path d="M5 5l14 14M19 5 5 19"/>'); },
  book(size = 16) { return this._wrap(size, '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5v-16z"/><path d="M20 19H6.5A2.5 2.5 0 0 0 4 21.5"/>'); },
  chat(size = 16) { return this._wrap(size, '<path d="M4 5h16v11H8l-4 4V5z"/>'); },
  arrowRight(size = 16) { return this._wrap(size, '<path d="M5 12h14M13 6l6 6-6 6"/>'); },
  search(size = 16) { return this._wrap(size, '<circle cx="11" cy="11" r="7"/><path d="M20 20l-4.3-4.3"/>'); },
  clock(size = 16) { return this._wrap(size, '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'); },
  building(size = 16) { return this._wrap(size, '<rect x="4" y="3" width="16" height="18"/><path d="M9 8h1M14 8h1M9 12h1M14 12h1M9 16h1M14 16h1"/>'); },
  users(size = 16) { return this._wrap(size, '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.4"/><path d="M15.5 14.2c2.5.4 4.5 2.4 4.5 5.8"/>'); },
  badge(size = 16) { return this._wrap(size, '<circle cx="12" cy="9" r="6"/><path d="M8.5 14 7 21l5-2.5L17 21l-1.5-7"/>'); },
  filter(size = 16) { return this._wrap(size, '<path d="M4 5h16M7 12h10M10 19h4"/>'); },
  send(size = 16) { return this._wrap(size, '<path d="M4 11l16-7-6.5 16-3-6.5L4 11z"/>'); },
  globe(size = 16) { return this._wrap(size, '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 2.5 15.4 0 18M12 3c-2.5 2.6-2.5 15.4 0 18"/>'); },
};
