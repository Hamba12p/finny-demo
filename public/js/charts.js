// Finny — lightweight SVG chart builders. No dependency: hand-rolled donut,
// bar and line charts that inherit the ledger palette via CSS custom
// properties, since these strings are injected as live DOM (not <img>).

const CHART_PALETTE = ["var(--navy)", "var(--brass)", "var(--ink)", "var(--phosphor-dim)", "var(--muted)"];

const Charts = {
  // segments: [{ label, value, color? }]
  donut(segments, opts = {}) {
    const size = opts.size || 150;
    const thickness = opts.thickness || 18;
    const r = (size - thickness) / 2;
    const cx = size / 2, cy = size / 2;
    const circumference = 2 * Math.PI * r;
    const total = segments.reduce((s, x) => s + x.value, 0) || 1;
    let offset = 0;
    const arcs = segments.map((seg, i) => {
      const color = seg.color || CHART_PALETTE[i % CHART_PALETTE.length];
      const frac = seg.value / total;
      const dash = frac * circumference;
      const circle = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" style="stroke:${color}" stroke-width="${thickness}" stroke-dasharray="${dash} ${circumference - dash}" stroke-dashoffset="${-offset}" transform="rotate(-90 ${cx} ${cy})" />`;
      offset += dash;
      return circle;
    }).join("");
    const svg = `<div class="chart-shell"><svg class="chart-svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="var(--hairline)" stroke-width="${thickness}" />
      ${arcs}
      ${opts.centerNum !== undefined ? `<text x="${cx}" y="${cy - 2}" text-anchor="middle" class="chart-center-num">${opts.centerNum}</text>` : ""}
      ${opts.centerSub ? `<text x="${cx}" y="${cy + 16}" text-anchor="middle" class="chart-center-sub">${opts.centerSub}</text>` : ""}
    </svg></div>`;
    const legend = `<div class="legend">${segments.map((seg, i) => `<div class="legend-row"><span class="dot" style="background:${seg.color || CHART_PALETTE[i % CHART_PALETTE.length]}"></span>${seg.label} — ${seg.value}</div>`).join("")}</div>`;
    return `<div class="donut-wrap">${svg}${legend}</div>`;
  },

  // data: [{ label, value }]
  bars(data, opts = {}) {
    const w = opts.width || 460, h = opts.height || 180;
    const padL = 34, padB = 24, padT = 10, padR = 8;
    const innerW = w - padL - padR, innerH = h - padT - padB;
    const max = Math.max(...data.map((d) => d.value), 1) * 1.15;
    const bw = innerW / data.length;
    const color = opts.color || "var(--accent)";
    const fmt = opts.valueFormat || ((v) => v);
    const bars = data.map((d, i) => {
      const barH = (d.value / max) * innerH;
      const x = padL + i * bw + bw * 0.18;
      const y = padT + innerH - barH;
      const bw2 = bw * 0.64;
      return `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${bw2.toFixed(1)}" height="${barH.toFixed(1)}" rx="3" style="fill:${color}" />
        <text x="${(x + bw2 / 2).toFixed(1)}" y="${(y - 5).toFixed(1)}" text-anchor="middle" class="chart-value">${fmt(d.value)}</text>
        <text x="${(x + bw2 / 2).toFixed(1)}" y="${h - 6}" text-anchor="middle" class="chart-label">${d.label}</text>`;
    }).join("");
    return `<div class="chart-shell"><svg class="chart-svg" viewBox="0 0 ${w} ${h}">
      <line x1="${padL}" y1="${padT + innerH}" x2="${w - padR}" y2="${padT + innerH}" class="chart-axis" />
      ${bars}
    </svg></div>`;
  },

  // points: [{ label, value }]
  line(points, opts = {}) {
    const w = opts.width || 460, h = opts.height || 150;
    const padL = 34, padB = 22, padT = 14, padR = 12;
    const innerW = w - padL - padR, innerH = h - padT - padB;
    const max = Math.max(...points.map((p) => p.value), 1) * 1.1;
    const min = Math.min(0, Math.min(...points.map((p) => p.value)));
    const range = max - min || 1;
    const step = innerW / Math.max(points.length - 1, 1);
    const coords = points.map((p, i) => {
      const x = padL + i * step;
      const y = padT + innerH - ((p.value - min) / range) * innerH;
      return [x, y];
    });
    const path = coords.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    const area = `${path} L${coords[coords.length - 1][0].toFixed(1)},${padT + innerH} L${coords[0][0].toFixed(1)},${padT + innerH} Z`;
    const color = opts.color || "var(--accent)";
    const dots = coords.map(([x, y], i) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.6" style="fill:${color}" />`).join("");
    const labels = points.map((p, i) => `<text x="${coords[i][0].toFixed(1)}" y="${h - 5}" text-anchor="middle" class="chart-label">${p.label}</text>`).join("");
    return `<div class="chart-shell"><svg class="chart-svg" viewBox="0 0 ${w} ${h}">
      <line x1="${padL}" y1="${padT + innerH}" x2="${w - padR}" y2="${padT + innerH}" class="chart-axis" />
      <path d="${area}" style="fill:${color}; opacity:.09" stroke="none" />
      <path d="${path}" style="stroke:${color}" fill="none" stroke-width="2" />
      ${dots}${labels}
    </svg></div>`;
  },
};
