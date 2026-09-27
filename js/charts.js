/**
 * CHARTS — radar, donut e barras verticais em SVG puro, sem dependências.
 */
const HfpCharts = (() => {

  function renderRadar(container, axes) {
    // Canvas maior e raio menor que o espaço disponível: dá margem suficiente
    // para os rótulos dos eixos (mesmo os mais longos, quebrados em 2 linhas)
    // nunca serem cortados pela viewBox, em qualquer largura de tela.
    const size = 320;
    const center = size / 2;
    const maxRadius = center - 78;
    const n = axes.length;

    const points = axes.map((axis, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const r = maxRadius * axis.value;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
        labelX: center + (maxRadius + 30) * Math.cos(angle),
        labelY: center + (maxRadius + 30) * Math.sin(angle),
        label: axis.label
      };
    });

    const polygon = points.map((p) => `${p.x},${p.y}`).join(' ');
    const gridLevels = [0.25, 0.5, 0.75, 1].map((level) => {
      const gridPoints = axes.map((_, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        return `${center + maxRadius * level * Math.cos(angle)},${center + maxRadius * level * Math.sin(angle)}`;
      }).join(' ');
      return `<polygon points="${gridPoints}" fill="none" stroke="rgba(210,215,255,.68)" stroke-width="1"/>`;
    }).join('');

    const axisLines = axes.map((_, i) => {
      const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
      const x = center + maxRadius * Math.cos(angle);
      const y = center + maxRadius * Math.sin(angle);
      return `<line x1="${center}" y1="${center}" x2="${x}" y2="${y}" stroke="var(--gray)" stroke-width="1" opacity="0.5"/>`;
    }).join('');

    // Quebra rótulos com mais de uma palavra em até 2 linhas, para caber na
    // largura disponível sem sair da viewBox.
    function wrapLabel(label) {
      const words = label.split(' ');
      if (words.length <= 1) return [label];
      const mid = Math.ceil(words.length / 2);
      return [words.slice(0, mid).join(' '), words.slice(mid).join(' ')];
    }

    const labels = points.map((p) => {
      const anchor = p.labelX < center - 5 ? 'end' : (p.labelX > center + 5 ? 'start' : 'middle');
      const lines = wrapLabel(p.label);
      const lineHeight = 12;
      const startOffset = -((lines.length - 1) * lineHeight) / 2;
      const tspans = lines.map((line, i) =>
        `<tspan x="${p.labelX}" dy="${i === 0 ? startOffset : lineHeight}">${line}</tspan>`
      ).join('');
      return `<text x="${p.labelX}" y="${p.labelY}" text-anchor="${anchor}" class="hfp-chart-label">${tspans}</text>`;
    }).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${size} ${size}" class="hfp-radar" role="img" aria-label="Gráfico de barreiras identificadas">
        ${gridLevels}
        ${axisLines}
        <polygon points="${polygon}" fill="#6258F6" fill-opacity="0.28" stroke="#756CFF" stroke-width="2.2"/>
        ${points.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#756CFF" stroke="#bcb8ff" stroke-width="1"/>`).join('')}
        ${labels}
      </svg>
    `;
  }

  function renderDonut(container, segments) {
    const size = 220;
    const center = size / 2;
    const radius = 80;
    const strokeWidth = 34;
    const circumference = 2 * Math.PI * radius;

    let offsetAcc = 0;
    const arcs = segments.map((seg) => {
      const fraction = seg.value / 100;
      const dash = fraction * circumference;
      const gap = circumference - dash;
      const rotation = (offsetAcc / 100) * 360 - 90;
      offsetAcc += seg.value;
      return `<circle cx="${center}" cy="${center}" r="${radius}"
                fill="none" stroke="${seg.color}" stroke-width="${strokeWidth}"
                stroke-dasharray="${dash} ${gap}"
                transform="rotate(${rotation} ${center} ${center})" />`;
    }).join('');

    const legend = segments.map((seg) => `
      <li><span class="hfp-legend-dot" style="background:${seg.color}"></span>${seg.label} ${seg.value}%</li>
    `).join('');

    container.innerHTML = `
      <svg viewBox="0 0 ${size} ${size}" class="hfp-donut" role="img" aria-label="Gráfico de origem da dúvida">
        ${arcs}
      </svg>
      <ul class="hfp-legend">${legend}</ul>
    `;
  }

  function renderBars(container, items) {
    const cards = items.map((item) => `
      <div class="hfp-bar-card">
        <div class="hfp-bar-track">
          <div class="hfp-bar-fill" style="height:${item.value}%"></div>
          <span class="hfp-bar-value">${item.value}%</span>
        </div>
        <p class="hfp-bar-label">${item.label}</p>
      </div>
    `).join('');
    container.innerHTML = `<div class="hfp-bars">${cards}</div>`;
  }

  return { renderRadar, renderDonut, renderBars };
})();
