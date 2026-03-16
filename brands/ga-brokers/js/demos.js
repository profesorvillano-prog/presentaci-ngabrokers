/* =========================================
   DEMOS.JS — Pipeline CRM + Dashboard
   ========================================= */

/* ── DATA ──────────────────────────────── */
const LEADS = [
  { name:"Carlos M.",   state:"TX", age:34, interest:"Ahorro",    status:"calificado" },
  { name:"Ana Torres",  state:"FL", age:28, interest:"Protección", status:"citado"     },
  { name:"Luis P.",     state:"NJ", age:41, interest:"Ahorro",    status:"nuevo"       },
  { name:"Diana R.",    state:"TX", age:30, interest:"Protección", status:"calificado" },
  { name:"Héctor G.",   state:"FL", age:45, interest:"Ahorro",    status:"cerrado"     },
  { name:"Valeria S.",  state:"NJ", age:26, interest:"Protección", status:"nuevo"       },
  { name:"Miguel A.",   state:"TX", age:38, interest:"Ahorro",    status:"perdido"     },
  { name:"Sofía V.",    state:"FL", age:33, interest:"Protección", status:"citado"     },
  { name:"Andrés L.",   state:"NJ", age:29, interest:"Ahorro",    status:"calificado" },
  { name:"Carolina B.", state:"TX", age:36, interest:"Protección", status:"cerrado"     },
  { name:"Ramón C.",    state:"FL", age:42, interest:"Ahorro",    status:"nuevo"       },
  { name:"Fernanda O.", state:"NJ", age:31, interest:"Protección", status:"citado"     },
];

const STAGES = [
  { key:"nuevo",       label:"Nuevo lead",       color:"#3D72B4" },
  { key:"calificado",  label:"Calificado",        color:"#10B981" },
  { key:"citado",      label:"Cita agendada",     color:"#F59E0B" },
  { key:"cerrado",     label:"Cerrado",           color:"#00C2B2" },
  { key:"perdido",     label:"No califica",       color:"#EF4444" },
];

const STATUS_BADGE = {
  nuevo:      { bg:"rgba(61,114,180,0.15)",  border:"#3D72B4", text:"#7EB3F0", label:"Nuevo"     },
  calificado: { bg:"rgba(16,185,129,0.15)",  border:"#10B981", text:"#10B981", label:"Calificado" },
  citado:     { bg:"rgba(245,158,11,0.15)",  border:"#F59E0B", text:"#F59E0B", label:"Cita agendada" },
  cerrado:    { bg:"rgba(0,194,178,0.15)",   border:"#00C2B2", text:"#00C2B2", label:"Cerrado"    },
  perdido:    { bg:"rgba(239,68,68,0.12)",   border:"#EF4444", text:"#EF4444", label:"No califica"},
};

/* ── PIPELINE ──────────────────────────── */
function buildPipeline(leads) {
  const container = document.getElementById('pipeline-cols');
  if (!container) return;
  container.innerHTML = '';

  STAGES.forEach(stage => {
    const stageLeds = leads.filter(l => l.status === stage.key);
    const col = document.createElement('div');
    col.className = 'pipe-col';
    col.innerHTML = `
      <div class="pipe-col-header" style="border-top:2px solid ${stage.color}">
        <span class="pipe-col-title">${stage.label}</span>
        <span class="pipe-col-count" style="background:${stage.color}22;color:${stage.color}">${stageLeds.length}</span>
      </div>
      <div class="pipe-cards">
        ${stageLeds.map(l => {
          const b = STATUS_BADGE[l.status];
          return `<div class="pipe-card">
            <div class="pipe-card-top">
              <div class="pipe-avatar">${l.name.split(' ').map(w=>w[0]).join('').slice(0,2)}</div>
              <div>
                <div class="pipe-name">${l.name}</div>
                <div class="pipe-meta">${l.state} · ${l.age} años</div>
              </div>
            </div>
            <div class="pipe-card-bottom">
              <span class="pipe-interest">${l.interest}</span>
              <span class="pipe-badge" style="background:${b.bg};border:1px solid ${b.border};color:${b.text}">${b.label}</span>
            </div>
          </div>`;
        }).join('')}
        ${stageLeds.length === 0 ? `<div class="pipe-empty">Sin leads</div>` : ''}
      </div>`;
    container.appendChild(col);
  });

  // animate cards in
  gsap.from('.pipe-card', {
    opacity: 0, y: 16, duration: 0.4, stagger: 0.04, ease: 'power2.out'
  });
}

function refreshPipeline() {
  const shuffled = [...LEADS].sort(() => Math.random() - 0.5);
  const statuses = ["nuevo","calificado","citado","cerrado","perdido"];
  shuffled.forEach((l, i) => {
    l.status = statuses[Math.floor(Math.random() * statuses.length)];
  });
  buildPipeline(shuffled);
}

/* ── DASHBOARD KPIs ────────────────────── */
const KPI_DATA = [
  { label:"Leads generados", value:247, suffix:"", trend:"+18%", up:true  },
  { label:"Costo por lead",  value:23,  suffix:"$", trend:"-8%", up:true  },
  { label:"Citas agendadas", value:89,  suffix:"",  trend:"+22%", up:true  },
  { label:"Tasa calificación",value:64, suffix:"%",  trend:"+5%", up:true  },
  { label:"Cierres",         value:18,  suffix:"",  trend:"+12%", up:true  },
  { label:"CPL Meta Ads",    value:21,  suffix:"$",  trend:"-11%", up:true  },
];

function buildKPIs() {
  const container = document.getElementById('dash-kpis');
  if (!container) return;
  container.innerHTML = KPI_DATA.map(k => `
    <div class="dash-kpi">
      <div class="dash-kpi-label">${k.label}</div>
      <div class="dash-kpi-value">${k.suffix === '$' ? '$' : ''}${k.value}${k.suffix !== '$' ? k.suffix : ''}</div>
      <div class="dash-kpi-trend ${k.up ? 'up' : 'down'}">${k.trend} este mes</div>
    </div>
  `).join('');
}

/* ── CHARTS ────────────────────────────── */
let chartsBuilt = false;

function buildCharts() {
  if (chartsBuilt) return;
  chartsBuilt = true;

  const GRID  = 'rgba(255,255,255,0.05)';
  const TICK  = 'rgba(255,255,255,0.35)';
  const ACCENT = '#00C2B2';

  const baseOpts = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800, easing: 'easeOutQuart' },
  };

  // Chart 1 — Leads por semana (line)
  const c1 = document.getElementById('chart-leads');
  if (c1) new Chart(c1, {
    type: 'line',
    data: {
      labels: ['S1','S2','S3','S4','S5','S6','S7','S8'],
      datasets: [{
        data: [18,27,22,35,41,38,52,67],
        borderColor: ACCENT,
        backgroundColor: 'rgba(0,194,178,0.09)',
        borderWidth: 2,
        pointBackgroundColor: ACCENT,
        pointRadius: 3,
        tension: 0.4,
        fill: true,
      }]
    },
    options: {
      ...baseOpts,
      plugins: { legend: { display: false } },
      scales: {
        x: { grid:{ color:GRID }, ticks:{ color:TICK, font:{size:10} } },
        y: { grid:{ color:GRID }, ticks:{ color:TICK, font:{size:10} }, beginAtZero:true,
             max: 80 }
      }
    }
  });

  // Chart 2 — Origen (doughnut)
  const c2 = document.getElementById('chart-origen');
  if (c2) new Chart(c2, {
    type: 'doughnut',
    data: {
      labels: ['Meta Ads','Instagram DM','Orgánico'],
      datasets: [{
        data: [58,27,15],
        backgroundColor: ['#00C2B2','#1A8FE3','#F59E0B'],
        borderWidth: 0,
        hoverOffset: 4,
      }]
    },
    options: {
      ...baseOpts,
      cutout: '65%',
      plugins: {
        legend: {
          display: true, position: 'bottom',
          labels: { color: TICK, font:{ size:10 }, padding:10, boxWidth:9, usePointStyle:true }
        }
      }
    }
  });

  // Chart 3 — Conversión por etapa (horizontal bar, fixed data)
  const c3 = document.getElementById('chart-conv');
  if (c3) new Chart(c3, {
    type: 'bar',
    data: {
      labels: ['Nuevo','Calif.','Cita','Cerrado'],
      datasets: [{
        data: [100,64,36,18],
        backgroundColor: ['#3D72B4','#10B981','#F59E0B','#00C2B2'],
        borderRadius: 3,
        borderSkipped: false,
        barThickness: 18,
      }]
    },
    options: {
      ...baseOpts,
      indexAxis: 'y',
      plugins: { legend: { display: false } },
      scales: {
        x: {
          grid:{ color:GRID }, ticks:{ color:TICK, font:{size:10} },
          beginAtZero:true, max:120,
          border:{ display:false }
        },
        y: {
          grid:{ display:false }, ticks:{ color:TICK, font:{size:10} },
          border:{ display:false }
        }
      },
      layout: { padding: { top:4, bottom:4 } }
    }
  });
}

/* ── ANIMATE LIVE NUMBERS ──────────────── */
function animateDashNums() {
  const vals = document.querySelectorAll('.dash-kpi-value');
  vals.forEach(el => {
    const txt = el.textContent;
    const hasDollar = txt.startsWith('$');
    const hasPct = txt.endsWith('%');
    const num = parseFloat(txt.replace(/[$%]/g,''));
    gsap.fromTo({v:0},{v:num},{
      duration:1.4, ease:'power2.out',
      onUpdate() {
        const v = this.targets()[0].v;
        const rounded = Number.isInteger(num) ? Math.round(v) : v.toFixed(1);
        el.textContent = (hasDollar?'$':'') + rounded + (hasPct?'%':'');
      }
    });
  });
}

/* ── SCROLL INIT ───────────────────────── */
function initDemos() {
  buildPipeline(LEADS);
  buildKPIs();

  ScrollTrigger.create({
    trigger: '#demo-dashboard',
    start: 'top 80%',
    once: true,
    onEnter() {
      buildCharts();
      animateDashNums();
      gsap.from('.dash-kpi', { opacity:0, y:24, duration:0.5, stagger:0.08, ease:'power2.out' });
      gsap.from('.dash-chart-card', { opacity:0, y:30, duration:0.6, stagger:0.12, delay:0.3, ease:'power2.out' });
    }
  });

  ScrollTrigger.create({
    trigger: '#demo-pipeline',
    start: 'top 80%',
    once: true,
    onEnter() {
      gsap.from('.pipe-col', { opacity:0, y:28, duration:0.5, stagger:0.1, ease:'power2.out' });
    }
  });
}

window.addEventListener('DOMContentLoaded', () => {
  // slight delay to let main.js init first
  setTimeout(initDemos, 200);
});
