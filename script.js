/**
 * ========================================================
 * SIMULASI KALOR & PERUBAHAN WUJUD ZAT
 * Laboratorium Virtual Interaktif IPA Kelas 7 SMP
 * ========================================================
 */

// --- KONSTANTA FISIKA (SISTEM INTERNASIONAL) ---
const C_ES = 2100;       // Kalor jenis es: 2.100 J/(kg·°C)
const C_AIR = 4200;      // Kalor jenis air: 4.200 J/(kg·°C)
const C_UAP = 2000;      // Kalor jenis uap: 2.000 J/(kg·°C)
const L_LEBUR = 336000;  // Kalor laten lebur es: 336.000 J/kg
const U_UAP = 2260000;   // Kalor laten penguapan air: 2.260.000 J/kg

// --- STATE UTAMA SIMULASI ---
const state = {
  mass: 0.1,             // Massa zat (kg) -> default 100 gram
  initialTemp: -10.0,    // Suhu awal zat (°C)
  temp: -10.0,           // Suhu zat saat ini (°C)
  heatTotal: 0,          // Total kalor bersih diserap sejak awal (Joule)
  zone: 'freezer',       // 'freezer' (-10°C), 'suhuRuang' (27°C), 'kompor' (150°C)
  flameLevel: 2,         // Intensitas api kompor: 1 (Kecil), 2 (Sedang), 3 (Besar)
  speed: 1,              // Laju kecepatan simulasi: 1x, 2x, 5x
  isPlaying: false,      // Status jalan / jeda
  simTime: 0,            // Waktu proses simulasi berjalan (detik)
  lastTimestamp: null,
  meltProgress: 0,       // 0 (es padat) s/d 1 (cair seluruhnya)
  vaporProgress: 0,      // 0 (cair penuh) s/d 1 (habis menguap)
  particles: [],         // Partikel molekul mikroskopis
  steamParticles: [],    // Partikel uap air yang naik
  bubbles: []            // Gelembung saat air mendidih
};

// --- WEB AUDIO SYNTHESIZER (SOUND FX TANPA FILE EKSTERNAL) ---
class SoundFX {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1200, t);
      osc.frequency.exponentialRampToValueAtTime(250, t + 0.012);
      gain.gain.setValueAtTime(0.06, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.012);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.012);
    } catch (e) {}
  }

  playBoilBubble() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      const startF = 320 + Math.random() * 220;
      osc.frequency.setValueAtTime(startF, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(startF + 320, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch (e) {}
  }

  playChime() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.frequency.value = freq;
        const startTime = this.ctx.currentTime + idx * 0.09;
        gain.gain.setValueAtTime(0.09, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.38);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(startTime);
        osc.stop(startTime + 0.38);
      });
    } catch (e) {}
  }
}

const sound = new SoundFX();

// --- SISTEM MODE TAMPILAN (DARK MODE / LIGHT MODE) ---
function initTheme() {
  const savedTheme = localStorage.getItem('simulasi_kalor_theme');
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
  applyTheme(isDark);
}

function applyTheme(isDark) {
  const html = document.documentElement;
  const themeWrapper = document.getElementById('themeIconWrapper');
  const themeLabel = document.getElementById('themeLabel');

  if (isDark) {
    html.classList.add('dark');
    if (themeWrapper) {
      themeWrapper.innerHTML = '<i data-lucide="sun" class="w-3.5 h-3.5 text-amber-400"></i>';
    }
    if (themeLabel) themeLabel.textContent = 'Terang';
    localStorage.setItem('simulasi_kalor_theme', 'dark');
  } else {
    html.classList.remove('dark');
    if (themeWrapper) {
      themeWrapper.innerHTML = '<i data-lucide="moon" class="w-3.5 h-3.5 text-slate-700"></i>';
    }
    if (themeLabel) themeLabel.textContent = 'Gelap';
    localStorage.setItem('simulasi_kalor_theme', 'light');
  }

  lucide.createIcons();
  render();
}

function toggleTheme() {
  sound.playClick();
  const isDark = !document.documentElement.classList.contains('dark');
  applyTheme(isDark);
}

// --- PERHITUNGAN BATAS TITIK LANDMARK FISIKA (Q1 s/d Q5) ---
function getLandmarks(mass, initT) {
  const deltaT_es = Math.max(0, 0 - initT);
  const q1 = mass * C_ES * deltaT_es;
  const q2 = q1 + mass * L_LEBUR;
  const q3 = q2 + mass * C_AIR * 100;
  const q4 = q3 + mass * U_UAP;
  const q5 = q4 + mass * C_UAP * 20;
  return { q1, q2, q3, q4, q5 };
}

// --- INISIALISASI MOLEKUL MIKROSKOPIS ---
function initParticles() {
  state.particles = [];
  for (let i = 0; i < 36; i++) {
    const col = i % 6;
    const row = Math.floor(i / 6);
    const baseX = 6 + col * 7.5 + (row % 2) * 3.5;
    const baseY = 4 + row * 4;
    state.particles.push({
      x: baseX,
      y: baseY,
      baseX: baseX,
      baseY: baseY,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9
    });
  }
}
initParticles();

// --- DOM REFERENCES ---
const displayTemp = document.getElementById('displayTemp');
const displayHeatKJ = document.getElementById('displayHeatKJ');
const displayHeatJ = document.getElementById('displayHeatJ');
const displayTime = document.getElementById('displayTime');
const displayTimeSub = document.getElementById('displayTimeSub');
const displayMass = document.getElementById('displayMass');
const displayVolume = document.getElementById('displayVolume');
const displayAnomalyStatus = document.getElementById('displayAnomalyStatus');
const badgeFaseZat = document.getElementById('badgeFaseZat');
const btnPlayPause = document.getElementById('btnPlayPause');
const playLabel = document.getElementById('playLabel');
const stageContainer = document.getElementById('stageContainer');
const flameControls = document.getElementById('flameControls');
const tempIconBox = document.getElementById('tempIconBox');

const beakerCanvas = document.getElementById('beakerCanvas');
const bCtx = beakerCanvas.getContext('2d');

const moleculeCanvas = document.getElementById('moleculeCanvas');
const mCtx = moleculeCanvas.getContext('2d');

const graphCanvas = document.getElementById('graphCanvas');
const gCtx = graphCanvas.getContext('2d');

// --- MODE SUDUT PANDANG GRAFIK (DEFAULT: 'focused' / KAMERA FOKUS DI TITIK TENGAH) ---
let graphViewMode = 'focused'; // 'focused' (titik di tengah bergerak) atau 'overview' (stasioner)

function toggleGraphView() {
  sound.playClick();
  graphViewMode = graphViewMode === 'focused' ? 'overview' : 'focused';
  const label = document.getElementById('graphViewModeLabel');
  const icon = document.getElementById('graphViewIcon');
  if (label) {
    label.textContent = graphViewMode === 'focused' ? 'Fokus Titik' : 'Peta Penuh';
  }
  if (icon) {
    icon.setAttribute('data-lucide', graphViewMode === 'focused' ? 'crosshair' : 'maximize-2');
    lucide.createIcons();
  }
  renderGraph();
}

// --- HELPER FISIKA: PERHITUNGAN MASSA & VOLUME (KEKEKALAN MASSA & ANOMALI AIR) ---
function getMassAndVolume() {
  const massG = Math.round(state.mass * 1000); // 50, 100, 200 gram
  const rhoIce = 0.917; // g/mL (massa jenis es)
  const rhoWater = 1.000; // g/mL (massa jenis air cair 4°C)

  const meltFrac = Math.min(1, Math.max(0, state.meltProgress));
  const vaporFrac = Math.min(1, Math.max(0, state.vaporProgress));

  // Massa es dan air cair di dalam bejana
  const iceMass = massG * (1 - meltFrac) * (1 - vaporFrac);
  const waterMass = massG * meltFrac * (1 - vaporFrac);
  const totalMass = iceMass + waterMass;

  // Volume zat (es batu memiliki volume lebih besar dari air karena berongga)
  const iceVol = iceMass / rhoIce;
  const waterVol = waterMass / rhoWater;
  const totalVol = iceVol + waterVol;

  const initialIceVol = massG / rhoIce;
  const finalWaterVol = massG / rhoWater;
  const shrinkagePercent = ((initialIceVol - finalWaterVol) / initialIceVol * 100).toFixed(1);

  return {
    massG,
    iceMass,
    waterMass,
    totalMass,
    iceVol,
    waterVol,
    totalVol,
    initialIceVol,
    finalWaterVol,
    shrinkagePercent
  };
}

// --- SISTEM INFORMASI PROSES KALOR & KALOR LATEN DINAMIS ---
let isProcessInfoOpen = false;
let lastProcessStageKey = '';

function toggleProcessInfo() {
  sound.playClick();
  isProcessInfoOpen = !isProcessInfoOpen;
  const box = document.getElementById('processInfoBox');
  const btn = document.getElementById('btnProcessInfo');
  const pulse = document.getElementById('processInfoPulse');

  if (isProcessInfoOpen) {
    box.classList.remove('hidden');
    btn.classList.add('border-amber-400', 'bg-amber-100', 'dark:bg-amber-900/60');
    if (pulse) pulse.classList.add('hidden');
    lastProcessStageKey = '';
    updateProcessInfo();
  } else {
    box.classList.add('hidden');
    btn.classList.remove('border-amber-400', 'bg-amber-100', 'dark:bg-amber-900/60');
    if (pulse) pulse.classList.remove('hidden');
  }
}

function getProcessInfoData() {
  const landmarks = getLandmarks(state.mass, state.initialTemp);
  const Q = state.heatTotal;
  const T = Math.abs(state.temp) < 0.05 ? 0.0 : state.temp;
  const zone = state.zone;
  const massG = Math.round(state.mass * 1000);

  let title = '';
  let badge = '';
  let badgeClass = '';
  let text = '';
  let icon = 'info';

  // 1. ZONA: FREEZER (-10°C)
  if (zone === 'freezer') {
    if (T <= -9.9 && Q <= 0.05) {
      title = 'Keseimbangan Termal di Freezer';
      badge = 'Suhu Stabil -10°C';
      badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
      icon = 'snowflake';
      text = `
        <div>• <strong>Fase Zat:</strong> Padat (Es Batu).</div>
        <div>• <strong>Aliran Kalor:</strong> Tidak ada aliran kalor (ΔT = 0).</div>
        <div>• <strong>Konsep:</strong> Suhu es sama dengan suhu freezer (-10°C), sistem dalam kesetimbangan termal.</div>
      `;
    } else if (T > 0) {
      title = 'Air Melepas Kalor ke Freezer';
      badge = 'Pendinginan';
      badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
      icon = 'snowflake';
      text = `
        <div>• <strong>Fase Zat:</strong> Cair &rarr; Membeku menjadi Padat.</div>
        <div>• <strong>Rumus:</strong> Kalor sensibel (<i>Q = m·c<sub>air</sub>·ΔT</i>) lalu kalor laten pembekuan (<i>Q = m·L</i>).</div>
        <div>• <strong>Konsep:</strong> Air melepas kalor ke lingkungan freezer yang lebih dingin hingga membeku sempurna pada 0°C.</div>
      `;
    } else {
      title = 'Pendinginan Es di Freezer';
      badge = 'Melepas Kalor';
      badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
      icon = 'snowflake';
      text = `
        <div>• <strong>Fase Zat:</strong> Padat (Es).</div>
        <div>• <strong>Rumus:</strong> <i>Q = m·c<sub>es</sub>·ΔT</i>.</div>
        <div>• <strong>Konsep:</strong> Es melepas kalor sensibel hingga suhunya turun mencapai kesetimbangan di -10°C.</div>
      `;
    }
  }

  // 2. ZONA: SUHU RUANG (27°C)
  else if (zone === 'suhuRuang') {
    if (Q < landmarks.q1 && T < 0) {
      title = 'Es Menyerap Kalor Udara Ruang';
      badge = 'Kalor Sensibel';
      badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      icon = 'thermometer-sun';
      text = `
        <div>• <strong>Fase Zat:</strong> Padat (Es memanas).</div>
        <div>• <strong>Rumus:</strong> <i>Q = m·c<sub>es</sub>·ΔT</i> (Kalor Sensibel).</div>
        <div>• <strong>Konsep:</strong> Es menyerap kalor dari udara 27°C sehingga suhu es naik menuju titik lebur 0°C.</div>
      `;
    } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
      const persen = Math.round(state.meltProgress * 100);
      title = 'Melebur di Suhu Ruang (0°C)';
      badge = `Proses Lebur: ${persen}%`;
      badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      icon = 'droplets';
      text = `
        <div>• <strong>Fase Zat:</strong> Transisi Padat &rarr; Cair (Titik Lebur 0°C).</div>
        <div>• <strong>Rumus:</strong> <i>Q = m·L</i> (Kalor Laten Lebur = 336 kJ/kg).</div>
        <div>• <strong>Konsep:</strong> Suhu tetap 0°C selama melebur. Massa zat tetap ${massG} g (kekal), volume menyusut ~8,3% akibat anomali air.</div>
      `;
    } else if (Q >= landmarks.q2 && T < 26.5) {
      title = 'Air Menyerap Kalor Menuju Suhu Ruang';
      badge = 'Kalor Sensibel';
      badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      icon = 'droplet';
      text = `
        <div>• <strong>Fase Zat:</strong> Cair (Air memanas perlahan).</div>
        <div>• <strong>Rumus:</strong> <i>Q = m·c<sub>air</sub>·ΔT</i>.</div>
        <div>• <strong>Konsep:</strong> Air menyerap kalor alami dari udara ruangan hingga suhunya mendekati 27°C.</div>
      `;
    } else if (T >= 26.5 && T <= 28) {
      title = 'Kesetimbangan Termal di Ruangan';
      badge = 'Suhu Stabil 27°C';
      badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      icon = 'check-circle';
      text = `
        <div>• <strong>Fase Zat:</strong> Cair (Air stabil).</div>
        <div>• <strong>Aliran Kalor:</strong> Nol (suhu air = suhu ruang 27°C).</div>
        <div>• <strong>Konsep:</strong> Tanpa sumber pemanas tambahan (kompor), air tidak akan mendidih (100°C).</div>
      `;
    } else {
      title = 'Air Panas Melepas Kalor ke Ruangan';
      badge = 'Pendinginan Alami';
      badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
      icon = 'wind';
      text = `
        <div>• <strong>Fase Zat:</strong> Cair (Air mendingin).</div>
        <div>• <strong>Rumus:</strong> <i>Q = m·c<sub>air</sub>·ΔT</i>.</div>
        <div>• <strong>Konsep:</strong> Kalor mengalir spontan dari air panas ke udara sekitar sampai suhunya kembali ke 27°C.</div>
      `;
    }
  }

  // 3. ZONA: KOMPOR (150°C)
  else if (zone === 'kompor') {
    const flameTxt = state.flameLevel === 1 ? 'Kecil' : (state.flameLevel === 2 ? 'Sedang' : 'Besar');

    if (Q < landmarks.q1 && T < 0) {
      title = 'Es Dipanaskan Kompor: Suhu Cepat Naik';
      badge = `Api ${flameTxt}`;
      badgeClass = 'bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      icon = 'flame';
      text = `
        <div>• <strong>Fase Zat:</strong> Padat (Es memanas cepat).</div>
        <div>• <strong>Rumus:</strong> <i>Q = m·c<sub>es</sub>·ΔT</i> (Kalor Sensibel).</div>
        <div>• <strong>Konsep:</strong> Kalor dari nyala kompor menaikkan energi kinetik molekul es menuju 0°C.</div>
      `;
    } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
      const persen = Math.round(state.meltProgress * 100);
      title = 'Proses Melebur di Kompor (0°C)';
      badge = `Melebur: ${persen}%`;
      badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      icon = 'layers';
      text = `
        <div>• <strong>Fase Zat:</strong> Transisi Padat &rarr; Cair (Titik Lebur 0°C).</div>
        <div>• <strong>Rumus:</strong> <i>Q = m·L</i> (Kalor Laten Lebur = 336 kJ/kg).</div>
        <div>• <strong>Konsep:</strong> Suhu tertahan di 0°C selama melebur. Massa ${massG} g tetap kekal, volume sedikit menyusut.</div>
      `;
    } else if (Q >= landmarks.q2 && Q < landmarks.q3 && T < 100) {
      title = 'Pemanasan Air Menuju Titik Didih';
      badge = `Suhu: ${T.toFixed(1)}°C`;
      badgeClass = 'bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800';
      icon = 'flame';
      text = `
        <div>• <strong>Fase Zat:</strong> Cair (Air dipanaskan).</div>
        <div>• <strong>Rumus:</strong> <i>Q = m·c<sub>air</sub>·ΔT</i> (Kalor Sensibel).</div>
        <div>• <strong>Konsep:</strong> Kalor menaikkan suhu air dari 0°C ke titik didih 100°C. Gelembung konveksi mulai terbentuk.</div>
      `;
    } else if (Q >= landmarks.q3 && Q < landmarks.q4) {
      const persen = Math.round(state.vaporProgress * 100);
      title = 'Mendidih & Menguap (100°C)';
      badge = `Menguap: ${persen}%`;
      badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
      icon = 'cloud-fog';
      text = `
        <div>• <strong>Fase Zat:</strong> Transisi Cair &rarr; Gas (Titik Didih 100°C).</div>
        <div>• <strong>Rumus:</strong> <i>Q = m·U</i> (Kalor Laten Penguapan = 2.260 kJ/kg).</div>
        <div>• <strong>Konsep:</strong> Suhu konstan 100°C. Kalor digunakan memutus ikatan antarmolekul menjadi uap air.</div>
      `;
    } else {
      title = 'Semua Air Menguap (Fase Gas)';
      badge = 'Gas Bebas';
      badgeClass = 'bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800';
      icon = 'cloud';
      text = `
        <div>• <strong>Fase Zat:</strong> Gas (Uap Air Bebas).</div>
        <div>• <strong>Rumus:</strong> <i>Q = m·c<sub>uap</sub>·ΔT</i>.</div>
        <div>• <strong>Konsep:</strong> Seluruh air telah menguap membubung ke udara. Wadah kini kering.</div>
      `;
    }
  }

  return { title, badge, badgeClass, text, icon };
}

function updateProcessInfo() {
  if (!isProcessInfoOpen) return;
  const data = getProcessInfoData();
  const stageKey = `${state.zone}_${data.title}_${data.badge}`;

  const titleEl = document.getElementById('processInfoTitle');
  const badgeEl = document.getElementById('processInfoBadge');
  const textEl = document.getElementById('processInfoText');

  if (titleEl) {
    titleEl.innerHTML = `<i data-lucide="${data.icon}" class="w-3.5 h-3.5 text-[#E5232B] shrink-0"></i> <span>${data.title}</span>`;
  }
  if (badgeEl) {
    badgeEl.textContent = data.badge;
    badgeEl.className = `text-[10px] font-bold px-2 py-0.5 rounded border ${data.badgeClass}`;
  }
  if (textEl) {
    textEl.innerHTML = data.text;
  }

  if (stageKey !== lastProcessStageKey) {
    lastProcessStageKey = stageKey;
    lucide.createIcons();
  }
}

// --- CONTROLLER ZONA LINGKUNGAN (FREEZER, SUHU RUANG, KOMPOR) ---
function setZone(newZone) {
  sound.playClick();
  state.zone = newZone;

  const btnFreezer = document.getElementById('zoneBtnFreezer');
  const btnSuhuRuang = document.getElementById('zoneBtnSuhuRuang');
  const btnKompor = document.getElementById('zoneBtnKompor');

  // Reset kelas tombol ke gaya netral (light & dark mode)
  [btnFreezer, btnSuhuRuang, btnKompor].forEach(b => {
    b.className = 'zone-btn flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-bold btn-transition bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer';
  });

  // Reset kelas background wadah ilustrasi
  stageContainer.classList.remove('bg-stage-freezer', 'bg-stage-suhuruang', 'bg-stage-kompor');

  if (newZone === 'freezer') {
    btnFreezer.className = 'zone-btn flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-bold btn-transition bg-sky-500 text-white shadow-2xs cursor-pointer';
    stageContainer.classList.add('bg-stage-freezer');
    flameControls.classList.add('hidden');
    flameControls.classList.remove('flex');
    tempIconBox.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800 shrink-0';
  } else if (newZone === 'suhuRuang') {
    btnSuhuRuang.className = 'zone-btn flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-bold btn-transition bg-emerald-500 text-white shadow-2xs cursor-pointer';
    stageContainer.classList.add('bg-stage-suhuruang');
    flameControls.classList.add('hidden');
    flameControls.classList.remove('flex');
    tempIconBox.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800 shrink-0';
  } else if (newZone === 'kompor') {
    btnKompor.className = 'zone-btn flex items-center justify-center gap-1.5 py-1 px-2 rounded-md text-xs font-bold btn-transition bg-[#E5232B] text-white shadow-2xs cursor-pointer';
    stageContainer.classList.add('bg-stage-kompor');
    flameControls.classList.remove('hidden');
    flameControls.classList.add('flex');
    tempIconBox.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-red-50 dark:bg-red-950/40 text-[#E5232B] flex items-center justify-center border border-red-200 dark:border-red-900/60 shrink-0';
  }

  if (isProcessInfoOpen) updateProcessInfo();
  lucide.createIcons();
}

function setFlame(lvl) {
  sound.playClick();
  state.flameLevel = lvl;
  for (let i = 1; i <= 3; i++) {
    const b = document.getElementById('btnFlame' + i);
    if (i === lvl) {
      b.className = 'px-2.5 py-0.5 text-xs font-bold rounded-md bg-[#E5232B] text-white shadow-2xs btn-transition cursor-pointer';
    } else {
      b.className = 'px-2.5 py-0.5 text-xs font-bold rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-orange-100 dark:hover:bg-orange-950/50 btn-transition cursor-pointer';
    }
  }
  if (isProcessInfoOpen) updateProcessInfo();
}

function setSpeed(s) {
  sound.playClick();
  state.speed = s;
  document.querySelectorAll('.speed-btn').forEach(btn => {
    if (parseInt(btn.getAttribute('data-speed'), 10) === s) {
      btn.className = 'speed-btn px-1.5 py-0.5 text-xs font-bold rounded bg-white dark:bg-slate-700 shadow-2xs text-[#E5232B] dark:text-red-400';
    } else {
      btn.className = 'speed-btn px-1.5 py-0.5 text-xs font-bold rounded text-slate-600 dark:text-slate-400 hover:text-[#E5232B]';
    }
  });
}

function onInitialTempChange(val) {
  sound.playClick();
  state.initialTemp = parseFloat(val);
  resetSimulation();
}

function onMassChange(val) {
  sound.playClick();
  state.mass = parseFloat(val);
  resetSimulation();
}

function togglePlayPause() {
  sound.playClick();
  state.isPlaying = !state.isPlaying;
  const wrapper = document.getElementById('playIconWrapper');
  const label = document.getElementById('playLabel');

  if (state.isPlaying) {
    state.lastTimestamp = performance.now();
    if (wrapper) wrapper.innerHTML = '<i data-lucide="pause" class="w-3.5 h-3.5 fill-white"></i>';
    if (label) label.textContent = 'Jeda';
    btnPlayPause.classList.remove('bg-[#E5232B]', 'hover:bg-[#BF1219]');
    btnPlayPause.classList.add('bg-amber-600', 'hover:bg-amber-700');
  } else {
    if (wrapper) wrapper.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 fill-white"></i>';
    if (label) label.textContent = 'Mulai';
    btnPlayPause.classList.remove('bg-amber-600', 'hover:bg-amber-700');
    btnPlayPause.classList.add('bg-[#E5232B]', 'hover:bg-[#BF1219]');
  }
  lucide.createIcons();
}

function resetSimulation() {
  sound.playClick();
  state.temp = state.initialTemp;
  state.heatTotal = 0;
  state.simTime = 0;
  state.meltProgress = 0;
  state.vaporProgress = 0;
  state.steamParticles = [];
  state.bubbles = [];

  state.isPlaying = false;
  const wrapper = document.getElementById('playIconWrapper');
  const label = document.getElementById('playLabel');
  if (wrapper) wrapper.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 fill-white"></i>';
  if (label) label.textContent = 'Mulai';
  btnPlayPause.classList.remove('bg-amber-600', 'hover:bg-amber-700');
  btnPlayPause.classList.add('bg-[#E5232B]', 'hover:bg-[#BF1219]');
  lucide.createIcons();

  setZone('freezer');
  render();
  if (isProcessInfoOpen) updateProcessInfo();
}

// --- LAJU PERPINDAHAN KALOR (J/DETIK) BERDASARKAN LINGKUNGAN ---
function getHeatRate(temp, zone, flame) {
  if (zone === 'freezer') {
    const target = -10.0;
    return temp > target ? -35.0 * (temp - target) : 0;
  } else if (zone === 'suhuRuang') {
    const target = 27.0;
    return temp < target
      ? 38.0 * Math.max(1, (target - temp) * 0.8)
      : (temp > target ? -38.0 * (temp - target) : 0);
  } else if (zone === 'kompor') {
    // Jika sudah mencapai batas maksimum kurva 120°C, pemanasan tidak menambah kalor lagi
    if (temp >= 120.0) return 0;
    return flame === 1 ? 300 : (flame === 2 ? 750 : 1500);
  }
  return 0;
}

// --- UPDATE FISIKA KALOR SETIAP FRAME (PERHITUNGAN TERMAL) ---
function updatePhysics(dt) {
  if (!state.isPlaying) return;

  const landmarks = getLandmarks(state.mass, state.initialTemp);
  const heatRate = getHeatRate(state.temp, state.zone, state.flameLevel);
  const effectiveDt = dt * state.speed;
  const dQ = heatRate * effectiveDt;

  state.simTime += effectiveDt;

  // Kalor total dibatasi maksimal persis pada landmarks.q5 (Uap 120°C Titik F)
  state.heatTotal = Math.max(0, Math.min(landmarks.q5, state.heatTotal + dQ));
  const Q = state.heatTotal;
  const m = state.mass;

  if (Q < landmarks.q1) {
    state.temp = state.initialTemp + (Q / (m * C_ES));
    state.meltProgress = 0;
    state.vaporProgress = 0;
  } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
    state.temp = 0.0;
    state.meltProgress = landmarks.q2 > landmarks.q1 ? (Q - landmarks.q1) / (landmarks.q2 - landmarks.q1) : 1;
    state.vaporProgress = 0;
  } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
    state.temp = (Q - landmarks.q2) / (m * C_AIR);
    state.meltProgress = 1.0;
    state.vaporProgress = 0;
  } else if (Q >= landmarks.q3 && Q < landmarks.q4) {
    state.temp = 100.0;
    state.meltProgress = 1.0;
    state.vaporProgress = (Q - landmarks.q3) / (landmarks.q4 - landmarks.q3);
    if (Math.random() < 0.25) sound.playBoilBubble();
  } else {
    state.temp = Math.min(120.0, 100.0 + (Q - landmarks.q4) / (m * C_UAP));
    state.meltProgress = 1.0;
    state.vaporProgress = 1.0;
    if (state.temp >= 120.0) {
      state.temp = 120.0;
      state.heatTotal = landmarks.q5;
    }
  }

  if (state.zone === 'freezer' && Q <= 0) {
    state.temp = state.initialTemp;
  }
}

// --- RENDER KANVAS: BEAKER GLASS, ES BATU, AIR, API & UAP ---
function renderBeaker() {
  bCtx.clearRect(0, 0, beakerCanvas.width, beakerCanvas.height);
  const w = beakerCanvas.width;
  const h = beakerCanvas.height;
  const isDark = document.documentElement.classList.contains('dark');

  // 1. Api Kompor & Penyangga Kaki Tiga (Hanya saat di zona kompor)
  if (state.zone === 'kompor') {
    const burnerX = w / 2;
    const burnerBaseY = h - 14;
    const nozzleY = 166;
    const gauzeY = 152;

    // A. Kaki Tiga Penyangga (Tripod Stand)
    bCtx.save();
    bCtx.strokeStyle = isDark ? '#475569' : '#94a3b8';
    bCtx.lineWidth = 3;
    bCtx.lineCap = 'round';
    // Kaki kiri & kanan
    bCtx.beginPath();
    bCtx.moveTo(w / 2 - 72, gauzeY + 2);
    bCtx.lineTo(w / 2 - 96, h - 3);
    bCtx.moveTo(w / 2 + 72, gauzeY + 2);
    bCtx.lineTo(w / 2 + 96, h - 3);
    bCtx.stroke();

    // B. Kawat Kasa Asbes (Wire Gauze) di bawah alas bejana
    bCtx.fillStyle = isDark ? '#475569' : '#94a3b8';
    bCtx.fillRect(w / 2 - 76, gauzeY, 152, 3);
    // Bagian tengah keramik perata panas (glowing ceramic disc)
    bCtx.fillStyle = isDark ? '#f8fafc' : '#e2e8f0';
    bCtx.fillRect(w / 2 - 34, gauzeY - 1, 68, 5);
    bCtx.restore();

    // C. Pembakar Bunsen / Kompor
    bCtx.save();
    // Alas kompor (Base)
    bCtx.fillStyle = isDark ? '#1e293b' : '#334155';
    bCtx.beginPath();
    bCtx.roundRect(burnerX - 32, burnerBaseY, 64, 9, 3);
    bCtx.fill();

    // Pipa cerobong bunsen (Tube)
    bCtx.fillStyle = isDark ? '#334155' : '#64748b';
    bCtx.fillRect(burnerX - 7, nozzleY + 2, 14, burnerBaseY - nozzleY - 2);

    // Cincin pengatur udara (Air ring)
    bCtx.fillStyle = isDark ? '#475569' : '#94a3b8';
    bCtx.fillRect(burnerX - 9, nozzleY + 10, 18, 4);

    // Ujung Nozzle api
    bCtx.fillStyle = isDark ? '#64748b' : '#475569';
    bCtx.fillRect(burnerX - 8, nozzleY, 16, 3);
    bCtx.restore();

    // D. Animasi Nyala Api Bunsen (Multi-layer Licking Flames)
    const flameHeight = state.flameLevel === 1 ? 20 : (state.flameLevel === 2 ? 30 : 42);
    const time = performance.now() * 0.007;

    bCtx.save();
    // [1] Aura Panas Berpendar (Heat Glow Aura)
    const auraRadius = 24 + state.flameLevel * 14;
    const auraGrad = bCtx.createRadialGradient(burnerX, gauzeY, 4, burnerX, gauzeY, auraRadius);
    auraGrad.addColorStop(0, `rgba(249, 115, 22, ${0.22 + state.flameLevel * 0.08})`);
    auraGrad.addColorStop(0.6, `rgba(234, 88, 12, ${0.1 + state.flameLevel * 0.05})`);
    auraGrad.addColorStop(1, 'transparent');
    bCtx.fillStyle = auraGrad;
    bCtx.beginPath();
    bCtx.arc(burnerX, gauzeY, auraRadius, 0, Math.PI * 2);
    bCtx.fill();

    // [2] Lidah-Lidah Api Bergerak (Dancing Fire Tongues)
    const tongueCount = 7;
    const spread = 4 + state.flameLevel * 3.5;
    for (let i = -3; i <= 3; i++) {
      const fx = burnerX + i * spread;
      const wave = Math.sin(time * 3.2 + i * 1.5) * (2.5 + state.flameLevel * 1.2);
      const waveH = Math.cos(time * 2.6 - i * 1.8) * (3.5 + state.flameLevel * 1.6);
      const fh = flameHeight + waveH;
      const tipY = nozzleY - fh;
      const tW = 6 + state.flameLevel * 1.2;

      const grad = bCtx.createLinearGradient(fx, nozzleY, fx + wave, tipY);
      grad.addColorStop(0, '#2563eb');     // Inti biru dasar
      grad.addColorStop(0.2, '#38bdf8');   // Cyan terang
      grad.addColorStop(0.45, '#f97316');  // Oranye menyala
      grad.addColorStop(0.8, '#facc15');   // Kuning terang
      grad.addColorStop(1, '#ffffff');     // Ujung putih panas

      bCtx.fillStyle = grad;
      bCtx.beginPath();
      bCtx.moveTo(fx - tW, nozzleY);
      bCtx.bezierCurveTo(fx - tW * 0.7 + wave * 0.5, nozzleY - fh * 0.5, fx + wave - 2, tipY + 4, fx + wave, tipY);
      bCtx.bezierCurveTo(fx + wave + 2, tipY + 4, fx + tW * 0.7 + wave * 0.5, nozzleY - fh * 0.5, fx + tW, nozzleY);
      bCtx.closePath();
      bCtx.fill();
    }

    // [3] Inti Kerucut Biru Bunsen (Inner Blue Cone)
    bCtx.beginPath();
    bCtx.moveTo(burnerX - 5, nozzleY);
    bCtx.quadraticCurveTo(burnerX + Math.sin(time * 4) * 1.2, nozzleY - (12 + state.flameLevel * 3.5), burnerX + 5, nozzleY);
    bCtx.fillStyle = 'rgba(56, 189, 248, 0.88)';
    bCtx.fill();

    // [4] Partikel Percikan Api & Panas yang Melayang (Ember Sparks)
    for (let k = 0; k < 5; k++) {
      const sProg = ((time * 0.7 + k * 0.6) % 2.2) / 2.2;
      const sy = nozzleY - sProg * (flameHeight + 14);
      const sx = burnerX + Math.sin(time * 2.8 + k * 2.1) * (10 + k * 4 * sProg);
      const sAlpha = Math.max(0, (1 - sProg) * 0.95);
      bCtx.fillStyle = `rgba(254, 240, 138, ${sAlpha})`;
      bCtx.beginPath();
      bCtx.arc(sx, sy, 1.2, 0, Math.PI * 2);
      bCtx.fill();
    }

    bCtx.restore();
  }

  // 2. Beaker Dimensions
  const bx = w / 2 - 68;
  const by = 18;
  const bw = 136;
  const bh = 134;
  const floorY = by + bh - 4; // Permukaan dasar dalam bejana kaca

  // Perhitungan Massa & Volume Zat (Sesuai Anomali Air & Kekekalan Massa)
  const mv = getMassAndVolume();
  // Skala bejana: 50 ml = 24 px -> 0.48 px per ml
  const pxPerMl = 0.48;
  const waterLevel = Math.max(0, mv.waterVol * pxPerMl);
  const waterSurfaceY = floorY - waterLevel;

  // 3. Fluida Air (Permukaan air naik sesuai volume air cair)
  if (mv.waterVol > 0.1 && state.vaporProgress < 1) {
    bCtx.save();
    bCtx.beginPath();
    bCtx.rect(bx + 4, waterSurfaceY, bw - 8, waterLevel);
    bCtx.clip();

    const waterGrad = bCtx.createLinearGradient(0, waterSurfaceY, 0, floorY);
    if (state.temp < 40) {
      waterGrad.addColorStop(0, isDark ? 'rgba(56, 189, 248, 0.85)' : 'rgba(56, 189, 248, 0.75)');
      waterGrad.addColorStop(1, isDark ? 'rgba(14, 165, 233, 0.95)' : 'rgba(14, 165, 233, 0.85)');
    } else {
      waterGrad.addColorStop(0, isDark ? 'rgba(96, 165, 250, 0.9)' : 'rgba(96, 165, 250, 0.8)');
      waterGrad.addColorStop(1, isDark ? 'rgba(59, 130, 246, 0.95)' : 'rgba(59, 130, 246, 0.9)');
    }
    bCtx.fillStyle = waterGrad;
    bCtx.fillRect(bx + 4, waterSurfaceY, bw - 8, waterLevel);

    // Garis kilau permukaan air
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    bCtx.fillRect(bx + 4, waterSurfaceY, bw - 8, 2);

    bCtx.restore();
  }

  // 4. Gelembung Air Mendidih
  if (state.temp >= 98 && state.vaporProgress < 1) {
    if (Math.random() < 0.6) {
      state.bubbles.push({
        x: bx + 14 + Math.random() * (bw - 28),
        y: by + bh - 8,
        r: 2 + Math.random() * 3,
        vy: 2 + Math.random() * 3
      });
    }
  }

  for (let i = state.bubbles.length - 1; i >= 0; i--) {
    const b = state.bubbles[i];
    b.y -= b.vy;
    bCtx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    bCtx.beginPath();
    bCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
    bCtx.fill();
    if (b.y < waterSurfaceY || state.vaporProgress >= 1) {
      state.bubbles.splice(i, 1);
    }
  }

  // 5. Balok Es Batu 3D (Menempel kokoh di dasar bejana saat padat, terapung realistis 90% tenggelam sesuai Hukum Archimedes)
  if (mv.iceMass > 0.05 && state.vaporProgress < 1.0) {
    const remFrac = Math.max(0, Math.min(1, mv.iceMass / mv.massG));
    const iceScale = Math.cbrt(remFrac);
    const massScale = Math.cbrt(state.mass / 0.1);
    const baseW = 34 * massScale;
    const baseH = 26 * massScale;

    // Melebur bertahap: balok atas mengecil terlebih dahulu, disusul balok samping
    const c3Scale = Math.max(0, (remFrac - 0.35) / 0.65) * iceScale;
    const c2Scale = Math.max(0, (remFrac - 0.12) / 0.88) * iceScale;
    const c1Scale = iceScale;

    // Hukum Archimedes: Es mengapung hanya jika kedalaman air cukup (massa jenis es 0.92 < air 1.0)
    // Sekitar 90% bagian es terendam dalam air, hanya ~10% muncul di atas permukaan air.
    const isFloating = waterLevel > baseH * iceScale * 0.7;
    const bob = (isFloating && (state.flameLevel > 0 || state.temp > 0)) ? Math.sin(Date.now() / 320) * 0.8 : 0;

    const cubes = [
      {
        scale: c1Scale,
        w: baseW * c1Scale,
        h: baseH * c1Scale,
        x: w / 2 - 20,
        rot: -0.07,
        restY: floorY - 1.5 - (baseH * c1Scale) * 0.5,
        floatY: waterSurfaceY + (baseH * c1Scale) * 0.40 + bob
      },
      {
        scale: c2Scale,
        w: baseW * c2Scale,
        h: baseH * c2Scale,
        x: w / 2 + 18,
        rot: 0.08,
        restY: floorY - 1.5 - (baseH * c2Scale) * 0.5,
        floatY: waterSurfaceY + (baseH * c2Scale) * 0.42 - bob * 0.7
      },
      {
        scale: c3Scale,
        w: baseW * c3Scale,
        h: baseH * c3Scale,
        x: w / 2 - 1,
        rot: 0.04,
        restY: floorY - 1.5 - (baseH * c3Scale) * (0.5 + 0.45 * remFrac),
        floatY: waterSurfaceY + (baseH * c3Scale) * 0.38 + bob * 0.5
      }
    ];

    cubes.forEach(c => {
      if (c.scale <= 0.04) return;
      // Posisi vertikal: jika belum cukup air untuk mengapung, es tetap menempel kokoh di dasar bejana
      const curY = Math.min(c.restY, c.floatY);

      bCtx.save();
      bCtx.translate(c.x, curY);
      bCtx.rotate(c.rot);

      bCtx.fillStyle = isDark ? 'rgba(224, 242, 254, 0.88)' : 'rgba(224, 242, 254, 0.94)';
      bCtx.strokeStyle = isDark ? 'rgba(125, 211, 252, 0.95)' : 'rgba(147, 197, 253, 0.95)';
      bCtx.lineWidth = 1.5;

      bCtx.beginPath();
      bCtx.roundRect(-c.w / 2, -c.h / 2, c.w, c.h, Math.max(2, 3.5 * c.scale));
      bCtx.fill();
      bCtx.stroke();

      // Highlight kilau kristal es (Facet reflection)
      bCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      bCtx.beginPath();
      bCtx.moveTo(-c.w / 2 + 3, -c.h / 2 + 3);
      bCtx.lineTo(c.w / 2 - 4, -c.h / 2 + 3);
      bCtx.lineTo(-c.w / 2 + 3, c.h / 2 - 4);
      bCtx.closePath();
      bCtx.fill();

      bCtx.restore();
    });
  }

  // 6. Uap Air yang Membubung (Steam)
  if (state.temp > 50 && state.vaporProgress < 1) {
    const rate = (state.temp - 50) / 50;
    if (Math.random() < rate * 0.6) {
      state.steamParticles.push({
        x: bx + 18 + Math.random() * (bw - 36),
        y: by + bh - waterLevel - 6,
        vx: (Math.random() - 0.5) * 0.9,
        vy: 1.2 + Math.random() * 1.6,
        r: 3 + Math.random() * 5,
        alpha: 0.4
      });
    }
  }

  for (let i = state.steamParticles.length - 1; i >= 0; i--) {
    const p = state.steamParticles[i];
    p.x += p.vx;
    p.y -= p.vy;
    p.r += 0.18;
    p.alpha -= 0.012;

    bCtx.fillStyle = isDark
      ? `rgba(203, 213, 225, ${Math.max(0, p.alpha * 0.9)})`
      : `rgba(148, 163, 184, ${Math.max(0, p.alpha)})`;
    bCtx.beginPath();
    bCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    bCtx.fill();

    if (p.alpha <= 0) state.steamParticles.splice(i, 1);
  }

  // 7. Beaker Kaca Transparan & Skala Mililiter
  bCtx.save();
  bCtx.lineWidth = 3.5;
  bCtx.strokeStyle = isDark ? '#94a3b8' : '#64748b';

  bCtx.beginPath();
  bCtx.moveTo(bx - 6, by);
  bCtx.lineTo(bx + 4, by);
  bCtx.lineTo(bx + 4, by + bh - 6);
  bCtx.arcTo(bx + 4, by + bh, bx + 14, by + bh, 10);
  bCtx.lineTo(bx + bw - 14, by + bh);
  bCtx.arcTo(bx + bw - 4, by + bh, bx + bw - 4, by + bh - 6, 10);
  bCtx.lineTo(bx + bw - 4, by);
  bCtx.stroke();

  bCtx.lineWidth = 1.2;
  bCtx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
  bCtx.fillStyle = isDark ? '#cbd5e1' : '#64748b';
  bCtx.font = '9px "Plus Jakarta Sans", sans-serif';
  for (let mark = 1; mark <= 4; mark++) {
    const my = by + bh - mark * 24;
    bCtx.beginPath();
    bCtx.moveTo(bx + 6, my);
    bCtx.lineTo(bx + (mark % 2 === 0 ? 15 : 10), my);
    bCtx.stroke();
    if (mark % 2 === 0) {
      bCtx.fillText(`${mark * 50}ml`, bx + 19, my + 3);
    }
  }

  bCtx.restore();
}

// --- RENDER KANVAS: MIKROSKOPIS MOLEKUL PARTIKEL H2O ---
function renderMolecules() {
  mCtx.clearRect(0, 0, moleculeCanvas.width, moleculeCanvas.height);
  const isMelting = state.meltProgress > 0 && state.meltProgress < 1;
  const isBoiling = state.vaporProgress > 0 && state.vaporProgress < 1;
  const isSolid = state.meltProgress === 0;
  const isLiquid = state.meltProgress === 1 && state.vaporProgress === 0;
  const descEl = document.getElementById('moleculeDesc');

  if (isSolid) {
    descEl.textContent = 'Padat: Molekul bergetar teratur di tempat';
  } else if (isMelting) {
    descEl.textContent = 'Melebur: Sebagian molekul mulai lepas & mengalir';
  } else if (isLiquid) {
    descEl.textContent = 'Cair: Molekul bebas mengalir berdekatan';
  } else if (isBoiling) {
    descEl.textContent = 'Mendidih: Molekul melesat lepas jadi uap';
  } else {
    descEl.textContent = 'Gas: Molekul bergerak acak & bebas';
  }

  state.particles.forEach((p, idx) => {
    if (isSolid) {
      const vib = Math.max(0.2, (state.temp + 25) * 0.04);
      p.x = p.baseX + (Math.random() - 0.5) * vib;
      p.y = p.baseY + (Math.random() - 0.5) * vib;
      mCtx.fillStyle = '#38bdf8';
    } else if (isMelting) {
      if (idx % 2 === 0) {
        p.x += p.vx * 0.9;
        p.y += p.vy * 0.9;
        if (p.x < 3 || p.x > moleculeCanvas.width - 3) p.vx *= -1;
        if (p.y < 3 || p.y > moleculeCanvas.height - 3) p.vy *= -1;
        mCtx.fillStyle = '#3b82f6';
      } else {
        p.x = p.baseX + (Math.random() - 0.5) * 0.6;
        p.y = p.baseY + (Math.random() - 0.5) * 0.6;
        mCtx.fillStyle = '#38bdf8';
      }
    } else if (isLiquid) {
      p.x += p.vx * 1.3;
      p.y += p.vy * 1.3;
      if (p.x < 3 || p.x > moleculeCanvas.width - 3) p.vx *= -1;
      if (p.y < 3 || p.y > moleculeCanvas.height - 3) p.vy *= -1;
      mCtx.fillStyle = '#3b82f6';
    } else if (isBoiling) {
      const speedFactor = idx % 2 === 0 ? 3.6 : 1.5;
      p.x += p.vx * speedFactor;
      p.y += p.vy * speedFactor;
      if (p.x < 3 || p.x > moleculeCanvas.width - 3) p.vx *= -1;
      if (p.y < 3 || p.y > moleculeCanvas.height - 3) p.vy *= -1;
      mCtx.fillStyle = idx % 2 === 0 ? '#f97316' : '#3b82f6';
    } else {
      p.x += p.vx * 3.8;
      p.y += p.vy * 3.8;
      if (p.x < 3 || p.x > moleculeCanvas.width - 3) p.vx *= -1;
      if (p.y < 3 || p.y > moleculeCanvas.height - 3) p.vy *= -1;
      mCtx.fillStyle = '#f97316';
    }

    mCtx.beginPath();
    mCtx.arc(p.x, p.y, 1.8, 0, Math.PI * 2);
    mCtx.fill();
  });
}

// --- RENDER KANVAS: GRAFIK KALOR TERHADAP SUHU (Q - T) ---
function renderGraph() {
  gCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
  const w = graphCanvas.width;
  const h = graphCanvas.height;
  const isDark = document.documentElement.classList.contains('dark');

  const landmarks = getLandmarks(state.mass, state.initialTemp);
  // Kalor dan suhu dibatasi secara ketat dalam batas kurva A-F (q5 dan 120°C)
  const curQ = Math.max(0, Math.min(landmarks.q5, state.heatTotal));
  const curT = Math.max(state.initialTemp, Math.min(120.0, state.temp));

  const pts = [
    { q: 0, t: state.initialTemp, label: 'A', desc: 'Es' },
    { q: landmarks.q1, t: 0, label: 'B', desc: '0°C Lebur' },
    { q: landmarks.q2, t: 0, label: 'C', desc: '0°C Cair' },
    { q: landmarks.q3, t: 100, label: 'D', desc: '100°C Didih' },
    { q: landmarks.q4, t: 100, label: 'E', desc: '100°C Uap' },
    { q: landmarks.q5, t: 120, label: 'F', desc: '120°C Uap' }
  ];

  const segmentColors = ['#0ea5e9', '#10b981', '#2563eb', '#f59e0b', '#ef4444'];

  // ========================================================
  // MODE 1: FOKUS TITIK DI TENGAH (DIPERBESAR KHUSUS FASE PADAT & LEBUR)
  // Layar fokus pada titik suhu & kalor saat ini di tengah kanvas (Cx, Cy),
  // sementara garis grafik, kurva, dan skala suhu bergerak melewatinya.
  // ========================================================
  if (graphViewMode === 'focused') {
    const Cx = w / 2;
    const Cy = h / 2;

    // Pemetaan horizontal diperbesar khusus:
    // Fase A-B (Es Memanas): 160px dengan kemiringan curam terlihat jelas
    // Fase B-C (Melebur pada 0°C): 220px (Garis datar lebur)
    // Fase C-D (Air Memanas): 220px (Kemiringan menanjak menuju 100°C)
    // Fase D-E (Mendidih / Menguap): 300px (Garis datar uap)
    // Fase E-F (Uap Memanas): 140px
    // Total panjang dunia kurva = 1040px
    function getQWorldX(qVal) {
      if (qVal <= 0) return 0;
      if (qVal <= landmarks.q1) {
        return (qVal / landmarks.q1) * 160;
      } else if (qVal <= landmarks.q2) {
        return 160 + ((qVal - landmarks.q1) / Math.max(1, landmarks.q2 - landmarks.q1)) * 220;
      } else if (qVal <= landmarks.q3) {
        return 380 + ((qVal - landmarks.q2) / Math.max(1, landmarks.q3 - landmarks.q2)) * 220;
      } else if (qVal <= landmarks.q4) {
        return 600 + ((qVal - landmarks.q3) / Math.max(1, landmarks.q4 - landmarks.q3)) * 300;
      } else {
        const frac = Math.min(1, (qVal - landmarks.q4) / Math.max(1, landmarks.q5 - landmarks.q4));
        return 900 + frac * 140;
      }
    }

    // Skala suhu vertikal diperbesar 4x lipat (16.8 px per °C) agar sudut kemiringan (slope) kurva sangat curam & tampak jelas
    const scaleY = 16.8;

    // Koordinat kamera mengikuti posisi titik aktif terkini
    const camX = getQWorldX(curQ);
    const camY = -curT * scaleY;

    // Fungsi transformasi koordinat dunia (Q, T) ke layar kanvas (X, Y)
    function toScreen(q, t) {
      return {
        x: Cx + (getQWorldX(q) - camX),
        y: Cy + (-t * scaleY - camY)
      };
    }

    // 1. Kisi Garis Suhu Bergerak (Horizontal) - kisi dinamis berjarak 2°C presisi tinggi
    const minVisT = Math.floor(curT - (h / 2) / scaleY) - 1;
    const maxVisT = Math.ceil(curT + (h / 2) / scaleY) + 1;
    const startTick = Math.max(-20, Math.floor(minVisT / 2) * 2);
    const endTick = Math.min(120, Math.ceil(maxVisT / 2) * 2);

    for (let tVal = startTick; tVal <= endTick; tVal += 2) {
      const sy = Cy + (-tVal * scaleY - camY);
      if (sy >= -10 && sy <= h + 10) {
        const isMajor = (tVal % 10 === 0) || tVal === 0 || tVal === 100;
        gCtx.beginPath();
        if (tVal === 0 || tVal === 100) {
          gCtx.lineWidth = 1.4;
          gCtx.strokeStyle = tVal === 0
            ? (isDark ? 'rgba(16, 185, 129, 0.45)' : 'rgba(16, 185, 129, 0.55)')
            : (isDark ? 'rgba(245, 158, 11, 0.45)' : 'rgba(245, 158, 11, 0.55)');
          gCtx.setLineDash([4, 3]);
        } else if (isMajor) {
          gCtx.lineWidth = 1;
          gCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.1)';
          gCtx.setLineDash([3, 3]);
        } else {
          gCtx.lineWidth = 0.6;
          gCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)';
          gCtx.setLineDash([2, 4]);
        }
        gCtx.moveTo(0, sy);
        gCtx.lineTo(w, sy);
        gCtx.stroke();
        gCtx.setLineDash([]);

        // Label Indikator Suhu di Sisi Kiri
        gCtx.fillStyle = tVal === 0
          ? '#10b981'
          : (tVal === 100 ? '#f59e0b' : (isMajor ? (isDark ? '#cbd5e1' : '#475569') : (isDark ? '#64748b' : '#94a3b8')));
        gCtx.font = (tVal === 0 || tVal === 100)
          ? 'bold 9px "Plus Jakarta Sans", sans-serif'
          : (isMajor ? '600 8.5px "Plus Jakarta Sans", sans-serif' : '7.5px "Plus Jakarta Sans", sans-serif');
        gCtx.textAlign = 'left';
        let txt = `${tVal}°C`;
        if (tVal === 0) txt += ' (Lebur)';
        else if (tVal === 100) txt += ' (Didih)';
        gCtx.fillText(txt, 8, sy - 3);
      }
    }

    // 2. Garis Vertikal Milestone Kalor (Q0 s/d Q5)
    pts.forEach(p => {
      const sx = Cx + (getQWorldX(p.q) - camX);
      if (sx >= -40 && sx <= w + 40) {
        gCtx.beginPath();
        gCtx.lineWidth = 1;
        gCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.09)' : 'rgba(0, 0, 0, 0.07)';
        gCtx.setLineDash([3, 3]);
        gCtx.moveTo(sx, 0);
        gCtx.lineTo(sx, h);
        gCtx.stroke();
        gCtx.setLineDash([]);

        gCtx.fillStyle = isDark ? '#94a3b8' : '#64748b';
        gCtx.font = '8px "Plus Jakarta Sans", sans-serif';
        gCtx.textAlign = 'center';
        gCtx.fillText((p.q / 1000).toFixed(1) + ' kJ', sx, h - 6);
      }
    });

    // 3. Garis Kurva Segmen Kalor (A s/d F)
    for (let i = 0; i < pts.length - 1; i++) {
      const p1 = toScreen(pts[i].q, pts[i].t);
      const p2 = toScreen(pts[i + 1].q, pts[i + 1].t);

      gCtx.lineWidth = 3.5;
      gCtx.lineCap = 'round';
      gCtx.strokeStyle = segmentColors[i];
      gCtx.beginPath();
      gCtx.moveTo(p1.x, p1.y);
      gCtx.lineTo(p2.x, p2.y);
      gCtx.stroke();
    }

    // 4. Titik Landmark A s/d F
    pts.forEach(p => {
      const sp = toScreen(p.q, p.t);
      if (sp.x >= -30 && sp.x <= w + 30 && sp.y >= -30 && sp.y <= h + 30) {
        gCtx.fillStyle = isDark ? '#1e293b' : '#ffffff';
        gCtx.strokeStyle = isDark ? '#94a3b8' : '#475569';
        gCtx.lineWidth = 2;
        gCtx.beginPath();
        gCtx.arc(sp.x, sp.y, 4, 0, Math.PI * 2);
        gCtx.fill();
        gCtx.stroke();

        gCtx.fillStyle = isDark ? '#e2e8f0' : '#1e293b';
        gCtx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
        gCtx.textAlign = 'center';
        gCtx.fillText(p.label, sp.x, sp.y - 7);
      }
    });

    // 5. RETIKEL BIDIK TENGAH (TITIK SUHU TETAP DI TENGAH)
    // Garis crosshair putus-putus berpusat di tengah layar
    gCtx.lineWidth = 1;
    gCtx.strokeStyle = isDark ? 'rgba(99, 102, 241, 0.28)' : 'rgba(99, 102, 241, 0.22)';
    gCtx.setLineDash([3, 4]);
    gCtx.beginPath();
    gCtx.moveTo(Cx, 0);
    gCtx.lineTo(Cx, h);
    gCtx.moveTo(0, Cy);
    gCtx.lineTo(w, Cy);
    gCtx.stroke();
    gCtx.setLineDash([]);

    // Animasi denyut target radar
    const pulse = Math.sin(performance.now() * 0.007) * 2;
    gCtx.fillStyle = isDark ? 'rgba(245, 158, 11, 0.22)' : 'rgba(245, 158, 11, 0.28)';
    gCtx.beginPath();
    gCtx.arc(Cx, Cy, 13 + pulse, 0, Math.PI * 2);
    gCtx.fill();

    gCtx.lineWidth = 1.5;
    gCtx.strokeStyle = '#f59e0b';
    gCtx.beginPath();
    gCtx.arc(Cx, Cy, 7 + pulse * 0.5, 0, Math.PI * 2);
    gCtx.stroke();

    gCtx.fillStyle = '#f59e0b';
    gCtx.beginPath();
    gCtx.arc(Cx, Cy, 4, 0, Math.PI * 2);
    gCtx.fill();

    // Floating HUD Tag di atas retikel tengah
    const hudText = `T = ${curT.toFixed(1)}°C | Q = ${(curQ / 1000).toFixed(1)} kJ`;
    gCtx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    const textW = gCtx.measureText(hudText).width;
    const pillW = textW + 14;
    const pillH = 17;
    const pillX = Cx - pillW / 2;
    const pillY = Cy - 24;

    gCtx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.9)' : 'rgba(255, 255, 255, 0.94)';
    gCtx.strokeStyle = '#f59e0b';
    gCtx.lineWidth = 1.2;
    gCtx.beginPath();
    gCtx.roundRect(pillX, pillY, pillW, pillH, 5);
    gCtx.fill();
    gCtx.stroke();

    gCtx.fillStyle = isDark ? '#fbbf24' : '#b45309';
    gCtx.textAlign = 'center';
    gCtx.fillText(hudText, Cx, pillY + 12);

    // 6. MINI-MAP PETA KESELURUHAN (A - F) DI POJOK KANAN BAWAH
    const mmW = 94;
    const mmH = 44;
    const mmX = w - mmW - 8;
    const mmY = h - mmH - 8;

    gCtx.save();
    gCtx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.88)' : 'rgba(255, 255, 255, 0.9)';
    gCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.12)';
    gCtx.lineWidth = 1;
    gCtx.beginPath();
    gCtx.roundRect(mmX, mmY, mmW, mmH, 6);
    gCtx.fill();
    gCtx.stroke();

    const mmPad = 6;
    const mmPlotW = mmW - mmPad * 2;
    const mmPlotH = mmH - mmPad * 2 - 8;

    function mmMapX(q) {
      return mmX + mmPad + (getQWorldX(q) / 1040) * mmPlotW;
    }
    function mmMapY(t) {
      return mmY + mmPad + mmPlotH - ((t - state.initialTemp) / (120 - state.initialTemp)) * mmPlotH;
    }

    for (let i = 0; i < pts.length - 1; i++) {
      gCtx.lineWidth = 1.8;
      gCtx.strokeStyle = segmentColors[i];
      gCtx.beginPath();
      gCtx.moveTo(mmMapX(pts[i].q), mmMapY(pts[i].t));
      gCtx.lineTo(mmMapX(pts[i + 1].q), mmMapY(pts[i + 1].t));
      gCtx.stroke();
    }

    // Posisi terkini pada mini-map
    const mmCurX = mmMapX(curQ);
    const mmCurY = mmMapY(curT);
    gCtx.fillStyle = '#ef4444';
    gCtx.strokeStyle = '#ffffff';
    gCtx.lineWidth = 1.2;
    gCtx.beginPath();
    gCtx.arc(mmCurX, mmCurY, 3, 0, Math.PI * 2);
    gCtx.fill();
    gCtx.stroke();

    gCtx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    gCtx.font = '700 7px "Plus Jakarta Sans", sans-serif';
    gCtx.textAlign = 'left';
    gCtx.fillText('PETA A-F', mmX + 5, mmY + mmH - 3);

    gCtx.restore();

  } else {
    // ========================================================
    // MODE 2: TAMPILAN PENUH STASIONER (OVERVIEW KELASIK)
    // ========================================================
    const padL = 36;
    const padR = 14;
    const padT = 14;
    const padB = 26;

    const plotW = w - padL - padR;
    const plotH = h - padT - padB;

    const maxQ = Math.max(1, landmarks.q5 * 1.05);
    const minT = -25;
    const maxT = 120;

    function mapX(q) {
      return padL + (Math.max(0, Math.min(landmarks.q5, q)) / maxQ) * plotW;
    }
    function mapY(t) {
      return padT + plotH - ((Math.max(minT, Math.min(maxT, t)) - minT) / (maxT - minT)) * plotH;
    }

    // Kisi Suhu Horizontal
    gCtx.lineWidth = 1;
    gCtx.strokeStyle = isDark ? 'rgba(255, 255, 255, 0.08)' : '#e2e8f0';
    gCtx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    gCtx.font = '9px "Plus Jakarta Sans", sans-serif';

    [-20, -10, 0, 50, 100].forEach(tVal => {
      const y = mapY(tVal);
      gCtx.beginPath();
      gCtx.moveTo(padL, y);
      gCtx.lineTo(w - padR, y);
      gCtx.stroke();
      gCtx.textAlign = 'right';
      gCtx.fillText(`${tVal}°C`, padL - 5, y + 3);
    });

    // Sumbu
    gCtx.lineWidth = 1.5;
    gCtx.strokeStyle = isDark ? '#475569' : '#cbd5e1';
    gCtx.beginPath();
    gCtx.moveTo(padL, padT);
    gCtx.lineTo(padL, h - padB);
    gCtx.lineTo(w - padR, h - padB);
    gCtx.stroke();

    gCtx.fillStyle = isDark ? '#cbd5e1' : '#475569';
    gCtx.font = '600 9px "Plus Jakarta Sans", sans-serif';
    gCtx.textAlign = 'center';
    gCtx.fillText('Kalor Diserap Q (kJ)', padL + plotW / 2, h - 8);

    // Garis kurva
    for (let i = 0; i < pts.length - 1; i++) {
      gCtx.lineWidth = 2.5;
      gCtx.strokeStyle = segmentColors[i];
      gCtx.beginPath();
      gCtx.moveTo(mapX(pts[i].q), mapY(pts[i].t));
      gCtx.lineTo(mapX(pts[i + 1].q), mapY(pts[i + 1].t));
      gCtx.stroke();
    }

    // Titik kurva
    pts.forEach(p => {
      const cx = mapX(p.q);
      const cy = mapY(p.t);
      gCtx.fillStyle = isDark ? '#e2e8f0' : '#334155';
      gCtx.beginPath();
      gCtx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      gCtx.fill();

      gCtx.fillStyle = isDark ? '#cbd5e1' : '#64748b';
      gCtx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
      gCtx.textAlign = 'center';
      gCtx.fillText(p.label, cx, cy - 5);
    });

    // Live Tracker Dot terkunci pada titik kurva (tidak pernah keluar)
    const curX = mapX(curQ);
    const curY = mapY(curT);

    const pulse = 4.5 + Math.sin(performance.now() * 0.008) * 1.8;
    gCtx.fillStyle = isDark ? 'rgba(251, 191, 36, 0.45)' : 'rgba(245, 158, 11, 0.35)';
    gCtx.beginPath();
    gCtx.arc(curX, curY, pulse + 3.5, 0, Math.PI * 2);
    gCtx.fill();

    gCtx.fillStyle = '#f59e0b';
    gCtx.strokeStyle = isDark ? '#1e293b' : '#ffffff';
    gCtx.lineWidth = 1.8;
    gCtx.beginPath();
    gCtx.arc(curX, curY, pulse, 0, Math.PI * 2);
    gCtx.fill();
    gCtx.stroke();
  }
}

// --- UPDATE TAMPILAN TELEMETRI & BADGE UI ---
function updateUI() {
  const displayT = Math.abs(state.temp) < 0.05 ? 0.0 : state.temp;
  displayTemp.textContent = displayT.toFixed(1);

  const kj = (state.heatTotal / 1000).toFixed(1);
  displayHeatKJ.textContent = kj;
  displayHeatJ.textContent = `(${Math.round(state.heatTotal).toLocaleString('id-ID')} Joule)`;

  // Update Telemetri Waktu Proses Simulasi (t)
  const displayTimeEl = document.getElementById('displayTime');
  const displayTimeSubEl = document.getElementById('displayTimeSub');
  if (displayTimeEl) {
    const totalSec = Math.floor(state.simTime);
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    displayTimeEl.textContent = `${mm}:${ss}`;
  }
  if (displayTimeSubEl) {
    displayTimeSubEl.textContent = `${state.simTime.toFixed(1)} detik`;
  }

  // Kompatibilitas Telemetri Massa & Volume jika dipanggil
  const mv = getMassAndVolume();
  if (typeof displayMass !== 'undefined' && displayMass) displayMass.textContent = mv.totalMass.toFixed(0);
  if (typeof displayVolume !== 'undefined' && displayVolume) displayVolume.textContent = `${mv.totalVol.toFixed(1)} mL`;
  if (typeof displayAnomalyStatus !== 'undefined' && displayAnomalyStatus) {
    if (state.meltProgress === 0) {
      displayAnomalyStatus.textContent = 'Padat (Es Berongga)';
    } else if (state.meltProgress > 0 && state.meltProgress < 1) {
      displayAnomalyStatus.textContent = `Menyusut ke ${mv.finalWaterVol.toFixed(0)} mL (Anomali)`;
    } else if (state.meltProgress >= 1 && state.vaporProgress === 0) {
      displayAnomalyStatus.textContent = `Massa ${mv.massG}g Kekal`;
    } else if (state.vaporProgress > 0 && state.vaporProgress < 1) {
      displayAnomalyStatus.textContent = `Menguap (Sisa ${mv.totalMass.toFixed(0)}g)`;
    } else {
      displayAnomalyStatus.textContent = 'Uap Bebas (Kering)';
    }
  }

  const landmarks = getLandmarks(state.mass, state.initialTemp);
  const Q = state.heatTotal;

  if (Q < landmarks.q1) {
    badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Padat (Es ${state.initialTemp}°C &rarr; 0°C)`;
    badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs';
  } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
    badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Melebur (0°C Tetap)';
    badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs';
  } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
    badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Cair (Air 0°C &rarr; 100°C)';
    badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs';
  } else if (Q >= landmarks.q3 && Q < landmarks.q4) {
    badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Mendidih / Menguap (100°C)';
    badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs';
  } else {
    badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Gas (Uap Air > 100°C)';
    badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 shadow-2xs';
  }

  if (isProcessInfoOpen) {
    updateProcessInfo();
  }
}

// --- LOOP UTAMA ANIMASI (REQUESTANIMATIONFRAME) ---
function loop(timestamp) {
  if (!state.lastTimestamp) state.lastTimestamp = timestamp;
  const dt = Math.min((timestamp - state.lastTimestamp) / 1000, 0.1);
  state.lastTimestamp = timestamp;

  updatePhysics(dt);
  render();

  requestAnimationFrame(loop);
}

function render() {
  renderBeaker();
  renderMolecules();
  renderGraph();
  updateUI();
}

// --- MODAL POP-UP MANAGEMENT ---
function openModal(id) {
  sound.playClick();
  const el = document.getElementById(id);
  if (el) {
    el.classList.remove('hidden');
    document.body.classList.add('overflow-hidden');
  }
}

function closeModal(id) {
  sound.playClick();
  const el = document.getElementById(id);
  if (el) {
    el.classList.add('hidden');
    document.body.classList.remove('overflow-hidden');
  }
}

// Tutup modal saat klik di luar kotak atau tekan ESC
window.addEventListener('click', e => {
  ['modalPanduan', 'modalMateri', 'modalKuis', 'modalKalorLaten'].forEach(id => {
    const el = document.getElementById(id);
    if (el && e.target === el) {
      closeModal(id);
    }
  });
});

window.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    ['modalPanduan', 'modalMateri', 'modalKuis', 'modalKalorLaten'].forEach(id => {
      closeModal(id);
    });
  }
});

// --- KUIS INTERAKTIF KALOR IPA KELAS 7 ---
const quizData = [
  {
    q: '1. Mengapa saat es melebur pada 0°C (segmen B-C) suhunya tidak naik meski terus menyerap kalor?',
    options: [
      'Karena termometer di dalam wadah tidak bekerja',
      'Karena kalor digunakan untuk merusak ikatan molekul es (kalor laten), bukan menaikkan suhu',
      'Karena kalor langsung hilang seluruhnya ke udara bebas',
      'Karena massa es berkurang secara drastis'
    ],
    answer: 1,
    expl: 'Benar! Kalor laten (Q = m × L) digunakan khusus untuk mengubah wujud zat dari padat ke cair, bukan untuk menaikkan suhu.'
  },
  {
    q: '2. Seberapa besar kalor yang dibutuhkan untuk merubah wujud zat padat menjadi cair disebut...',
    options: [
      'Kalor jenis zat',
      'Kalor laten lebur',
      'Kapasitas kalor',
      'Suhu mutlak'
    ],
    answer: 1,
    expl: 'Tepat! Kalor laten lebur (L) adalah banyaknya kalor yang diperlukan oleh 1 kg zat untuk berubah wujud dari padat menjadi cair pada titik leburnya.'
  },
  {
    q: '3. Jika es diletakkan di suhu ruang bersuhu 27°C, arah perpindahan kalor yang benar adalah...',
    options: [
      'Dari es menuju udara sekitar',
      'Dari udara sekitar menuju es yang lebih dingin',
      'Tidak ada perpindahan kalor sama sekali',
      'Bolak-balik tanpa henti'
    ],
    answer: 1,
    expl: 'Tepat! Kalor selalu mengalir secara alami dari lingkungan bersuhu lebih tinggi ke benda bersuhu lebih rendah.'
  },
  {
    q: '4. Bagaimana susunan dan pergerakan molekul ketika zat berubah wujud menjadi uap air (gas)?',
    options: [
      'Molekul tersusun rapi dan hanya bergetar di tempat',
      'Molekul berdekatan dan mengalir bebas',
      'Molekul sangat berjauhan dan bergerak sangat cepat acak',
      'Molekul diam dan membeku'
    ],
    answer: 2,
    expl: 'Benar! Pada wujud gas (uap), partikel saling berjauhan, ikatan molekul terputus, dan bergerak sangat cepat acak.'
  },
  {
    q: '5. Berdasarkan hukum kekekalan massa dan sifat anomali air, apa yang terjadi saat 100 gram es batu melebur seutuhnya menjadi air?',
    options: [
      'Massanya tetap 100 gram, tetapi volumenya sedikit menyusut (berkurang ~8,3%)',
      'Massanya berkurang karena sebagian partikel mencair, volumenya tetap',
      'Massanya bertambah karena menyerap banyak partikel kalor',
      'Massa dan volumenya berlipat ganda'
    ],
    answer: 0,
    expl: 'Luar biasa! Hukum kekekalan massa membuktikan massa materi selalu tetap (100 gram). Namun akibat anomali pemuaian air (kristal es berongga dengan massa jenis 0,92 g/cm³ lebih kecil dari air 1,0 g/cm³), volumenya sedikit menyusut sekitar 8,3%.'
  }
];

let userAnswers = {};

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;
  container.innerHTML = '';

  quizData.forEach((item, qIdx) => {
    const card = document.createElement('div');
    card.className = 'bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5';

    const qTitle = document.createElement('p');
    qTitle.className = 'font-bold text-slate-800 dark:text-slate-100 text-xs';
    qTitle.textContent = item.q;
    card.appendChild(qTitle);

    const optsDiv = document.createElement('div');
    optsDiv.className = 'space-y-1 mt-1';

    const isAnswered = userAnswers[qIdx] !== undefined;

    item.options.forEach((opt, optIdx) => {
      const optBtn = document.createElement('button');
      let optClass = 'quiz-opt-btn ';

      if (isAnswered) {
        if (optIdx === item.answer) {
          optClass += 'quiz-opt-correct';
        } else if (userAnswers[qIdx] === optIdx) {
          optClass += 'quiz-opt-wrong';
        }
      } else if (userAnswers[qIdx] === optIdx) {
        optClass += 'quiz-opt-selected';
      }

      optBtn.className = optClass;
      optBtn.innerHTML = `<span>${String.fromCharCode(65 + optIdx)}. ${opt}</span>`;
      optBtn.onclick = () => selectAnswer(qIdx, optIdx);
      optsDiv.appendChild(optBtn);
    });
    card.appendChild(optsDiv);

    if (isAnswered) {
      const isCorrect = userAnswers[qIdx] === item.answer;
      const fb = document.createElement('div');
      fb.className = `p-2 rounded-lg text-xs mt-1 ${isCorrect ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800' : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'}`;
      fb.innerHTML = `<strong>${isCorrect ? '✅ Benar!' : '❌ Kurang tepat.'}</strong> ${item.expl}`;
      card.appendChild(fb);
    }

    container.appendChild(card);
  });

  let score = 0;
  Object.keys(userAnswers).forEach(qIdx => {
    if (userAnswers[qIdx] === quizData[qIdx].answer) score += 20;
  });
  document.getElementById('quizScore').textContent = score;

  if (score === 100 && typeof confetti === 'function') {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    sound.playChime();
  }
}

function selectAnswer(qIdx, optIdx) {
  sound.playClick();
  userAnswers[qIdx] = optIdx;
  renderQuiz();
}

function resetQuiz() {
  sound.playClick();
  userAnswers = {};
  renderQuiz();
}

// --- INISIALISASI SETELAH DOM READY ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  renderQuiz();
  setZone('freezer');
  render();
  requestAnimationFrame(loop);
  lucide.createIcons();
});
