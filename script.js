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

// --- SISTEM DUA BAHASA (BILINGUAL I18N: ID & EN) ---
let currentLang = localStorage.getItem('simulasi_kalor_lang') || 'id';

const i18n = {
  id: {
    appTitle: 'Kalor<span class="text-[#E5232B]">&amp;</span>Wujud Zat',
    levelBadge: 'IPA SMP',
    appSubtitle: 'Laboratorium Fisika Interaktif Titik Lebur, Mendidih &amp; Anomali Air',
    navEnvInfo: 'Informasi Lingkungan',
    titleEnvInfo: 'Informasi Lingkungan',
    navTheory: 'Materi',
    titleTheory: 'Rangkuman Materi Fisika',
    navQuiz: 'Kuis',
    titleQuiz: 'Kuis Konsep',
    langToggleTitle: 'Switch to English / Ganti Bahasa ke Inggris',
    langBtnLabel: 'EN',
    themeDark: 'Gelap',
    themeLight: 'Terang',
    navReset: 'Reset',
    titleReset: 'Reset Semua Parameter',
    labelEnvironment: 'Lingkungan:',
    zoneFreezer: 'Freezer',
    zoneSuhuRuang: 'Suhu Ruang',
    zoneKompor: 'Kompor',
    labelFlame: 'Intensitas Api:',
    flameLow: 'Kecil',
    flameMed: 'Sedang',
    flameHigh: 'Besar',
    labelParticles: 'Partikel H<sub>2</sub>O:',
    btnStart: 'Mulai',
    btnResume: 'Lanjut',
    btnPause: 'Jeda',
    labelInitialTemp: 'Suhu Awal:',
    initialTempOptions: [
      { group: 'Padat (Es)', options: [
        { val: '-20', text: '-20°C' },
        { val: '-15', text: '-15°C' },
        { val: '-10', text: '-10°C (Standar)' },
        { val: '-5', text: '-5°C' },
        { val: '0', text: '0°C (Titik Lebur)' }
      ]},
      { group: 'Cair (Air)', options: [
        { val: '10', text: '10°C (Air Dingin)' },
        { val: '20', text: '20°C (Air Sejuk)' },
        { val: '27', text: '27°C (Suhu Ruang)' },
        { val: '50', text: '50°C (Air Hangat)' },
        { val: '75', text: '75°C (Air Panas)' },
        { val: '100', text: '100°C (Titik Didih)' }
      ]},
      { group: 'Gas (Uap)', options: [
        { val: '105', text: '105°C (Uap Awal)' },
        { val: '110', text: '110°C (Uap Panas)' },
        { val: '120', text: '120°C (Uap Maksimal)' }
      ]},
      { val: 'custom', text: 'Kustom (°C)...' }
    ],
    labelMass: 'Massa:',
    labelSpeed: 'Laju:',
    statLabelTemp: 'Suhu Zat (<span class="italic font-serif font-bold">T</span>)',
    statLabelHeat: 'Kalor (<span class="italic font-serif font-bold">Q</span>)',
    statLabelTime: 'Waktu Proses (<span class="italic font-serif font-bold">t</span>)',
    graphTitle: 'Grafik Kalor &ndash; Suhu (<span class="italic font-serif font-bold">Q &ndash; T</span>)',
    viewFocused: 'Fokus Titik',
    viewOverview: 'Peta Penuh',
    viewToggleTitle: 'Beralih mode fokus titik live atau tampilan kurva penuh',
    processInfoBtn: 'Info Proses',
    processInfoBtnTitle: 'Buka / tutup status proses kalor',
    btnFormulaText: 'Rumus',
    btnFormulaTitle: 'Tabel Rumus &amp; Konstanta Fisika',
    processInfoTitle: 'Status Proses Kalor',
    legendCurrentPoint: 'Titik Saat Ini',
    scoreLabel: 'Skor:',
    btnResetQuiz: 'Ulangi Kuis',
    btnFinishQuiz: 'Selesai',
    btnClose: 'Tutup',
    modalKalorLatenTitle: 'Rumus Kalor &amp; Kalor Laten',
    modalPanduanTitle: 'Informasi Lingkungan',
    modalMateriTitle: 'Materi Kalor &amp; Hukum Fisika',
    modalKuisTitle: 'Kuis Pemahaman Kalor',
    modalKuisSubtitle: '5 Pertanyaan Konsep IPA SMP',
    modalKalorLaten: `
      <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="p-2">Jenis Kalor</th>
              <th class="p-2">Persamaan</th>
              <th class="p-2">Efek pada Zat</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr>
              <td class="p-2 font-semibold text-slate-800 dark:text-slate-200">Kalor Sensibel</td>
              <td class="p-2 font-mono font-bold text-[#E5232B]">Q = m · c · ΔT</td>
              <td class="p-2">Suhu zat naik / turun, wujud zat tetap.</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold text-slate-800 dark:text-slate-200">Kalor Laten Lebur / Beku</td>
              <td class="p-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">Q = m · L</td>
              <td class="p-2">Padat &harr; Cair (0°C). Melebur (serap kalor) atau Membeku (lepas kalor).</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold text-slate-800 dark:text-slate-200">Kalor Laten Uap / Embun</td>
              <td class="p-2 font-mono font-bold text-amber-600 dark:text-amber-400">Q = m · U</td>
              <td class="p-2">Cair &harr; Gas (100°C). Menguap (serap kalor) atau Mengembun (lepas kalor).</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
        <span class="font-display font-bold font-sans text-xs text-slate-900 dark:text-white block mb-1">Konstanta Fisika (Tekanan 1 atm):</span>
        <div class="flex justify-between"><span>Kalor jenis es (c<sub>es</sub>):</span><span class="font-bold">2.100 J/(kg·°C)</span></div>
        <div class="flex justify-between"><span>Kalor jenis air (c<sub>air</sub>):</span><span class="font-bold">4.200 J/(kg·°C)</span></div>
        <div class="flex justify-between"><span>Kalor jenis uap (c<sub>uap</sub>):</span><span class="font-bold">2.000 J/(kg·°C)</span></div>
        <div class="flex justify-between"><span>Kalor lebur es (L):</span><span class="font-bold">336.000 J/kg</span></div>
        <div class="flex justify-between"><span>Kalor uap air (U):</span><span class="font-bold">2.260.000 J/kg</span></div>
      </div>
    `,
    modalPanduan: `
      <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-2.5">
        <span class="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
        <div>
          <strong class="text-slate-900 dark:text-white block text-xs mb-0.5">Freezer</strong>
          Kondisi Lingkungan dengan Suhu -10°C. Pada suhu ini, Air (H<sub>2</sub>O) berada pada wujud padat atau sering disebut "Es".
        </div>
      </div>
      <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-2.5">
        <span class="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
        <div>
          <strong class="text-slate-900 dark:text-white block text-xs mb-0.5">Suhu Ruang</strong>
          Kondisi Lingkungan dengan Suhu 27°C. Pada suhu ini, Air (H<sub>2</sub>O) berada pada wujud cair. Kalor dari udara ruangan diserap secara alami oleh es sehingga es melebur menjadi air pada titik lebur 0°C.
        </div>
      </div>
      <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-2.5">
        <span class="w-5 h-5 rounded-full bg-[#E5232B] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
        <div>
          <strong class="text-slate-900 dark:text-white block text-xs mb-0.5">Kompor</strong>
          Kondisi Lingkungan dengan Suhu 150°C. Pada kondisi ini, nyala api memberikan energi kalor tinggi sehingga air dipanaskan mencapai titik didih 100°C dan berubah wujud menjadi gas atau sering disebut "Uap Air".
        </div>
      </div>
    `,
    modalMateri: `
      <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
        <h4 class="font-bold text-xs text-slate-900 dark:text-white">1. Hubungan Kalor dan Suhu Zat</h4>
        <p class="leading-relaxed">
          • <strong>Perubahan Suhu (Sensibel)</strong>: Kalor yang diserap menaikkan suhu zat, sedangkan kalor yang dilepas menurunkan suhu zat (<span class="font-mono font-bold text-[#E5232B]">Q = m·c·ΔT</span>).<br>
          • <strong>Perubahan Wujud (Laten)</strong>: Pada titik lebur/beku (0°C) atau titik didih/embun (100°C), suhu zat <strong>tidak berubah (konstan)</strong>. Kalor diserap saat <i>melebur</i> &amp; <i>menguap</i>, serta kalor dilepas saat <i>mengembun</i> &amp; <i>membeku</i> (<span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">Q = m·L</span> atau <span class="font-mono font-bold text-amber-600 dark:text-amber-400">Q = m·U</span>).
        </p>
      </div>
      <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
        <h4 class="font-bold text-xs text-slate-900 dark:text-white">2. Hukum Kekekalan Massa &amp; Anomali Air</h4>
        <p class="leading-relaxed">
          • <strong>Hukum Kekekalan Massa</strong>: Ketika es melebur menjadi air atau air membeku kembali menjadi es, <strong>massa zat selalu tetap kekal</strong> (<span class="font-mono font-bold">m<sub>es</sub> = m<sub>air</sub></span>).<br>
          • <strong>Anomali Pemuaian Air</strong>: Es memiliki struktur heksagonal berongga dengan massa jenis lebih kecil (&rho;<sub>es</sub> &asymp; 0,92 g/cm³). Saat melebur menjadi air (&rho;<sub>air</sub> &asymp; 1,0 g/cm³), volumenya menyusut &asymp; 8,3%. Sebaliknya saat air membeku menjadi es, volumenya <strong>memuai &asymp; 9%</strong>. Sifat anomali ini membuat es selalu terapung di atas air.
        </p>
      </div>
      <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
        <h4 class="font-bold text-xs text-slate-900 dark:text-white">3. Arah Aliran Kalor (Hukum Termodinamika)</h4>
        <p class="leading-relaxed">
          Kalor mengalir secara spontan dari benda/lingkungan bersuhu lebih tinggi menuju benda bersuhu lebih rendah hingga tercapai kesetimbangan termal.
        </p>
      </div>
    `
  },
  en: {
    appTitle: 'Heat<span class="text-[#E5232B]">&amp;</span>Phase Change',
    levelBadge: 'Junior Physics',
    appSubtitle: 'Interactive Physics Lab for Melting, Boiling &amp; Water Anomaly',
    navEnvInfo: 'Environment Info',
    titleEnvInfo: 'Environment Information',
    navTheory: 'Theory',
    titleTheory: 'Physics Summary &amp; Theory',
    navQuiz: 'Quiz',
    titleQuiz: 'Concept Quiz',
    langToggleTitle: 'Ganti ke Bahasa Indonesia / Switch to Indonesian',
    langBtnLabel: 'ID',
    themeDark: 'Dark',
    themeLight: 'Light',
    navReset: 'Reset',
    titleReset: 'Reset All Parameters',
    labelEnvironment: 'Environment:',
    zoneFreezer: 'Freezer',
    zoneSuhuRuang: 'Room Temp',
    zoneKompor: 'Stove Burner',
    labelFlame: 'Flame Intensity:',
    flameLow: 'Low',
    flameMed: 'Med',
    flameHigh: 'High',
    labelParticles: 'H<sub>2</sub>O Particles:',
    btnStart: 'Start',
    btnResume: 'Resume',
    btnPause: 'Pause',
    labelInitialTemp: 'Initial Temp:',
    initialTempOptions: [
      { group: 'Solid (Ice)', options: [
        { val: '-20', text: '-20°C' },
        { val: '-15', text: '-15°C' },
        { val: '-10', text: '-10°C (Standard)' },
        { val: '-5', text: '-5°C' },
        { val: '0', text: '0°C (Melting Point)' }
      ]},
      { group: 'Liquid (Water)', options: [
        { val: '10', text: '10°C (Cold Water)' },
        { val: '20', text: '20°C (Cool Water)' },
        { val: '27', text: '27°C (Room Temp)' },
        { val: '50', text: '50°C (Warm Water)' },
        { val: '75', text: '75°C (Hot Water)' },
        { val: '100', text: '100°C (Boiling Point)' }
      ]},
      { group: 'Gas (Steam)', options: [
        { val: '105', text: '105°C (Early Steam)' },
        { val: '110', text: '110°C (Hot Steam)' },
        { val: '120', text: '120°C (Max Steam)' }
      ]},
      { val: 'custom', text: 'Custom (°C)...' }
    ],
    labelMass: 'Mass:',
    labelSpeed: 'Speed:',
    statLabelTemp: 'Temperature (<span class="italic font-serif font-bold">T</span>)',
    statLabelHeat: 'Heat (<span class="italic font-serif font-bold">Q</span>)',
    statLabelTime: 'Elapsed Time (<span class="italic font-serif font-bold">t</span>)',
    graphTitle: 'Heat &ndash; Temperature Graph (<span class="italic font-serif font-bold">Q &ndash; T</span>)',
    viewFocused: 'Point Focus',
    viewOverview: 'Full Overview',
    viewToggleTitle: 'Toggle live point focus or full curve overview',
    processInfoBtn: 'Process Info',
    processInfoBtnTitle: 'Toggle heat process details',
    btnFormulaText: 'Formulas',
    btnFormulaTitle: 'Formula Table &amp; Physical Constants',
    processInfoTitle: 'Heat Process Status',
    legendCurrentPoint: 'Current Point',
    scoreLabel: 'Score:',
    btnResetQuiz: 'Restart Quiz',
    btnFinishQuiz: 'Finish',
    btnClose: 'Close',
    modalKalorLatenTitle: 'Heat Formulas &amp; Latent Heat',
    modalPanduanTitle: 'Environment Information',
    modalMateriTitle: 'Heat Concepts &amp; Physical Laws',
    modalKuisTitle: 'Heat Concept Quiz',
    modalKuisSubtitle: '5 Junior Physics Questions',
    modalKalorLaten: `
      <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
        <table class="w-full text-left text-xs">
          <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th class="p-2">Heat Type</th>
              <th class="p-2">Equation</th>
              <th class="p-2">Effect on Substance</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
            <tr>
              <td class="p-2 font-semibold text-slate-800 dark:text-slate-200">Sensible Heat</td>
              <td class="p-2 font-mono font-bold text-[#E5232B]">Q = m · c · ΔT</td>
              <td class="p-2">Temperature increases / decreases, state of matter unchanged.</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold text-slate-800 dark:text-slate-200">Latent Heat of Fusion / Freezing</td>
              <td class="p-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">Q = m · L</td>
              <td class="p-2">Solid &harr; Liquid (0°C). Melting (absorbs heat) or Freezing (releases heat).</td>
            </tr>
            <tr>
              <td class="p-2 font-semibold text-slate-800 dark:text-slate-200">Latent Heat of Vaporization / Condensation</td>
              <td class="p-2 font-mono font-bold text-amber-600 dark:text-amber-400">Q = m · U</td>
              <td class="p-2">Liquid &harr; Gas (100°C). Vaporizing (absorbs heat) or Condensing (releases heat).</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
        <span class="font-display font-bold font-sans text-xs text-slate-900 dark:text-white block mb-1">Physical Constants (1 atm Pressure):</span>
        <div class="flex justify-between"><span>Specific heat of ice (c<sub>ice</sub>):</span><span class="font-bold">2,100 J/(kg·°C)</span></div>
        <div class="flex justify-between"><span>Specific heat of water (c<sub>water</sub>):</span><span class="font-bold">4,200 J/(kg·°C)</span></div>
        <div class="flex justify-between"><span>Specific heat of steam (c<sub>steam</sub>):</span><span class="font-bold">2,000 J/(kg·°C)</span></div>
        <div class="flex justify-between"><span>Latent heat of fusion (L):</span><span class="font-bold">336,000 J/kg</span></div>
        <div class="flex justify-between"><span>Latent heat of vaporization (U):</span><span class="font-bold">2,260,000 J/kg</span></div>
      </div>
    `,
    modalPanduan: `
      <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-2.5">
        <span class="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">1</span>
        <div>
          <strong class="text-slate-900 dark:text-white block text-xs mb-0.5">Freezer</strong>
          Environmental condition at -10°C. At this temperature, water (H<sub>2</sub>O) exists in a solid state commonly known as "Ice".
        </div>
      </div>
      <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-2.5">
        <span class="w-5 h-5 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center shrink-0 text-[10px]">2</span>
        <div>
          <strong class="text-slate-900 dark:text-white block text-xs mb-0.5">Room Temperature</strong>
          Environmental condition at 27°C. At this temperature, water (H<sub>2</sub>O) exists in a liquid state. Heat from room air is naturally absorbed by ice, causing it to melt into water at the 0°C melting point.
        </div>
      </div>
      <div class="p-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex gap-2.5">
        <span class="w-5 h-5 rounded-full bg-[#E5232B] text-white font-bold flex items-center justify-center shrink-0 text-[10px]">3</span>
        <div>
          <strong class="text-slate-900 dark:text-white block text-xs mb-0.5">Stove Burner</strong>
          Environmental condition at 150°C. Under this condition, the burner supplies high thermal energy, heating water to its 100°C boiling point and transitioning it into a gas known as "Water Vapor / Steam".
        </div>
      </div>
    `,
    modalMateri: `
      <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
        <h4 class="font-bold text-xs text-slate-900 dark:text-white">1. Heat and Temperature Relationship</h4>
        <p class="leading-relaxed">
          • <strong>Temperature Change (Sensible Heat)</strong>: Absorbing heat raises temperature, while releasing heat lowers temperature (<span class="font-mono font-bold text-[#E5232B]">Q = m·c·ΔT</span>).<br>
          • <strong>Phase Change (Latent Heat)</strong>: At melting/freezing (0°C) or boiling/condensation (100°C), substance temperature remains <strong>constant</strong>. Heat is absorbed during <i>melting</i> &amp; <i>vaporization</i>, and released during <i>condensation</i> &amp; <i>freezing</i> (<span class="font-mono font-bold text-emerald-600 dark:text-emerald-400">Q = m·L</span> or <span class="font-mono font-bold text-amber-600 dark:text-amber-400">Q = m·U</span>).
        </p>
      </div>
      <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
        <h4 class="font-bold text-xs text-slate-900 dark:text-white">2. Conservation of Mass &amp; Water Anomaly</h4>
        <p class="leading-relaxed">
          • <strong>Law of Conservation of Mass</strong>: When ice melts into water or water refreezes into ice, <strong>total substance mass is strictly conserved</strong> (<span class="font-mono font-bold">m<sub>ice</sub> = m<sub>water</sub></span>).<br>
          • <strong>Anomalous Expansion of Water</strong>: Ice has a hollow hexagonal crystal structure with lower density (&rho;<sub>ice</sub> &asymp; 0.92 g/cm³). When melting into liquid (&rho;<sub>water</sub> &asymp; 1.0 g/cm³), its volume contracts by &asymp; 8.3%. Conversely, when water freezes into ice, its volume <strong>expands by &asymp; 9%</strong>. This anomaly causes ice to float on liquid water.
        </p>
      </div>
      <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
        <h4 class="font-bold text-xs text-slate-900 dark:text-white">3. Heat Flow Direction (Thermodynamics)</h4>
        <p class="leading-relaxed">
          Heat flows spontaneously from regions of higher temperature to regions of lower temperature until thermal equilibrium is established.
        </p>
      </div>
    `
  }
};

function renderModals() {
  const lang = currentLang;
  const t = i18n[lang] || i18n.id;

  const bodyKalor = document.getElementById('modalKalorLatenBody');
  if (bodyKalor) bodyKalor.innerHTML = t.modalKalorLaten;

  const bodyPanduan = document.getElementById('modalPanduanBody');
  if (bodyPanduan) bodyPanduan.innerHTML = t.modalPanduan;

  const bodyMateri = document.getElementById('modalMateriBody');
  if (bodyMateri) bodyMateri.innerHTML = t.modalMateri;
}

function applyLanguage() {
  const lang = currentLang;
  const t = i18n[lang] || i18n.id;
  document.documentElement.lang = lang;

  // Header
  const appTitle = document.getElementById('appTitle');
  if (appTitle) appTitle.innerHTML = t.appTitle;

  const levelBadge = document.getElementById('levelBadge');
  if (levelBadge) levelBadge.innerHTML = t.levelBadge;

  const appSubtitle = document.getElementById('appSubtitle');
  if (appSubtitle) appSubtitle.innerHTML = t.appSubtitle;

  const navEnvInfo = document.getElementById('navEnvInfo');
  if (navEnvInfo) navEnvInfo.textContent = t.navEnvInfo;
  const btnEnvInfo = document.getElementById('btnEnvInfo');
  if (btnEnvInfo) btnEnvInfo.title = t.titleEnvInfo;

  const navTheory = document.getElementById('navTheory');
  if (navTheory) navTheory.textContent = t.navTheory;
  const btnTheory = document.getElementById('btnTheory');
  if (btnTheory) btnTheory.title = t.titleTheory;

  const navQuiz = document.getElementById('navQuiz');
  if (navQuiz) navQuiz.textContent = t.navQuiz;
  const btnQuiz = document.getElementById('btnQuiz');
  if (btnQuiz) btnQuiz.title = t.titleQuiz;

  const langLabel = document.getElementById('langLabel');
  if (langLabel) langLabel.textContent = t.langBtnLabel;
  const btnLangToggle = document.getElementById('btnLangToggle');
  if (btnLangToggle) btnLangToggle.title = t.langToggleTitle;

  const themeLabel = document.getElementById('themeLabel');
  if (themeLabel) {
    const isDark = document.documentElement.classList.contains('dark');
    themeLabel.textContent = isDark ? t.themeLight : t.themeDark;
  }

  const navReset = document.getElementById('navReset');
  if (navReset) navReset.textContent = t.navReset;
  const btnReset = document.getElementById('btnReset');
  if (btnReset) btnReset.title = t.titleReset;

  // Left Column
  const labelEnvironment = document.getElementById('labelEnvironment');
  if (labelEnvironment) labelEnvironment.textContent = t.labelEnvironment;

  const zoneTextFreezer = document.getElementById('zoneTextFreezer');
  if (zoneTextFreezer) zoneTextFreezer.textContent = t.zoneFreezer;

  const zoneTextSuhuRuang = document.getElementById('zoneTextSuhuRuang');
  if (zoneTextSuhuRuang) zoneTextSuhuRuang.textContent = t.zoneSuhuRuang;

  const zoneTextKompor = document.getElementById('zoneTextKompor');
  if (zoneTextKompor) zoneTextKompor.textContent = t.zoneKompor;

  const labelFlame = document.getElementById('labelFlame');
  if (labelFlame) labelFlame.textContent = t.labelFlame;

  const btnFlame1 = document.getElementById('btnFlame1');
  if (btnFlame1) btnFlame1.textContent = t.flameLow;

  const btnFlame2 = document.getElementById('btnFlame2');
  if (btnFlame2) btnFlame2.textContent = t.flameMed;

  const btnFlame3 = document.getElementById('btnFlame3');
  if (btnFlame3) btnFlame3.textContent = t.flameHigh;

  const labelParticles = document.getElementById('labelParticles');
  if (labelParticles) labelParticles.innerHTML = t.labelParticles;

  // Controls Toolbar
  const playLabel = document.getElementById('playLabel');
  if (playLabel) {
    playLabel.textContent = state.isPlaying
      ? t.btnPause
      : (state.heatTotal > 0 ? t.btnResume : t.btnStart);
  }

  const labelInitialTemp = document.getElementById('labelInitialTemp');
  if (labelInitialTemp) labelInitialTemp.textContent = t.labelInitialTemp;

  const initialTempSelect = document.getElementById('initialTempSelect');
  if (initialTempSelect) {
    const currentVal = initialTempSelect.value;
    initialTempSelect.innerHTML = '';
    let foundMatch = false;
    t.initialTempOptions.forEach(item => {
      if (item.group) {
        const og = document.createElement('optgroup');
        og.label = item.group;
        item.options.forEach(opt => {
          const el = document.createElement('option');
          el.value = opt.val;
          el.textContent = opt.text;
          if (opt.val === currentVal || parseFloat(opt.val) === state.initialTemp) {
            el.selected = true;
            foundMatch = true;
          }
          og.appendChild(el);
        });
        initialTempSelect.appendChild(og);
      } else {
        const el = document.createElement('option');
        el.value = item.val;
        el.textContent = item.text;
        if (item.val === currentVal || item.val === 'custom') {
          if (!foundMatch && item.val === 'custom') el.selected = true;
          else if (item.val === currentVal) {
            el.selected = true;
            foundMatch = true;
          }
        }
        initialTempSelect.appendChild(el);
      }
    });
  }

  const customTempInput = document.getElementById('customTempInput');
  if (customTempInput) customTempInput.value = state.initialTemp;

  const labelMass = document.getElementById('labelMass');
  if (labelMass) labelMass.textContent = t.labelMass;

  const labelSpeed = document.getElementById('labelSpeed');
  if (labelSpeed) labelSpeed.textContent = t.labelSpeed;

  // Right Column Telemetry & Graph
  const statLabelTemp = document.getElementById('statLabelTemp');
  if (statLabelTemp) statLabelTemp.innerHTML = t.statLabelTemp;

  const statLabelHeat = document.getElementById('statLabelHeat');
  if (statLabelHeat) statLabelHeat.innerHTML = t.statLabelHeat;

  const statLabelTime = document.getElementById('statLabelTime');
  if (statLabelTime) statLabelTime.innerHTML = t.statLabelTime;

  const graphTitle = document.getElementById('graphTitle');
  if (graphTitle) graphTitle.innerHTML = t.graphTitle;

  const graphViewModeLabel = document.getElementById('graphViewModeLabel');
  if (graphViewModeLabel) {
    graphViewModeLabel.textContent = graphViewMode === 'focused' ? t.viewFocused : t.viewOverview;
  }
  const btnGraphViewToggle = document.getElementById('btnGraphViewToggle');
  if (btnGraphViewToggle) btnGraphViewToggle.title = t.viewToggleTitle;

  const processInfoBtnText = document.getElementById('processInfoBtnText');
  if (processInfoBtnText) processInfoBtnText.textContent = t.processInfoBtn;
  const btnProcessInfo = document.getElementById('btnProcessInfo');
  if (btnProcessInfo) btnProcessInfo.title = t.processInfoBtnTitle;

  const btnFormulaText = document.getElementById('btnFormulaText');
  if (btnFormulaText) btnFormulaText.textContent = t.btnFormulaText;

  const processInfoTitleText = document.getElementById('processInfoTitleText');
  if (processInfoTitleText) processInfoTitleText.textContent = t.processInfoTitle;

  const legendDotText = document.getElementById('legendDotText');
  if (legendDotText) legendDotText.textContent = t.legendCurrentPoint;

  // Modals Header & Buttons
  const modalKalorLatenTitle = document.getElementById('modalKalorLatenTitle');
  if (modalKalorLatenTitle) modalKalorLatenTitle.innerHTML = t.modalKalorLatenTitle;

  const modalPanduanTitle = document.getElementById('modalPanduanTitle');
  if (modalPanduanTitle) modalPanduanTitle.innerHTML = t.modalPanduanTitle;

  const modalMateriTitle = document.getElementById('modalMateriTitle');
  if (modalMateriTitle) modalMateriTitle.innerHTML = t.modalMateriTitle;

  const modalKuisTitle = document.getElementById('modalKuisTitle');
  if (modalKuisTitle) modalKuisTitle.innerHTML = t.modalKuisTitle;

  const modalKuisSubtitle = document.getElementById('modalKuisSubtitle');
  if (modalKuisSubtitle) modalKuisSubtitle.innerHTML = t.modalKuisSubtitle;

  const scoreLabelPrefix = document.getElementById('scoreLabelPrefix');
  if (scoreLabelPrefix) scoreLabelPrefix.textContent = t.scoreLabel;

  const btnResetQuiz = document.getElementById('btnResetQuiz');
  if (btnResetQuiz) btnResetQuiz.textContent = t.btnResetQuiz;

  const btnFinishQuiz = document.getElementById('btnFinishQuiz');
  if (btnFinishQuiz) btnFinishQuiz.textContent = t.btnFinishQuiz;

  document.querySelectorAll('.modal-close-text').forEach(el => {
    el.textContent = t.btnClose;
  });

  // Inject localized modal contents
  renderModals();

  // Re-render dynamic elements
  renderQuiz();
  updateUI();
  renderMolecules();
  renderGraph();

  lucide.createIcons();
}

function setLanguage(lang) {
  if (lang !== 'id' && lang !== 'en') return;
  currentLang = lang;
  localStorage.setItem('simulasi_kalor_lang', currentLang);
  applyLanguage();
}

function toggleLanguage() {
  sound.playClick();
  currentLang = currentLang === 'id' ? 'en' : 'id';
  localStorage.setItem('simulasi_kalor_lang', currentLang);
  applyLanguage();
}


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
    if (themeLabel) themeLabel.textContent = currentLang === 'en' ? 'Light' : 'Terang';
    localStorage.setItem('simulasi_kalor_theme', 'dark');
  } else {
    html.classList.remove('dark');
    if (themeWrapper) {
      themeWrapper.innerHTML = '<i data-lucide="moon" class="w-3.5 h-3.5 text-slate-700"></i>';
    }
    if (themeLabel) themeLabel.textContent = currentLang === 'en' ? 'Dark' : 'Gelap';
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
  const tBase = Math.min(-10.0, typeof initT === 'number' ? initT : -10.0);
  const deltaT_es = Math.max(0, 0 - tBase);
  const q1 = mass * C_ES * deltaT_es;
  const q2 = q1 + mass * L_LEBUR;
  const q3 = q2 + mass * C_AIR * 100;
  const q4 = q3 + mass * U_UAP;
  const q5 = q4 + mass * C_UAP * 20;
  return { q1, q2, q3, q4, q5, tBase };
}

// --- PERHITUNGAN STATUS TERMAL AWAL BERDASARKAN SUHU AWAL ---
function getInitialThermalState(initT, mass) {
  const landmarks = getLandmarks(mass, initT);
  const m = mass;
  const tBase = landmarks.tBase;

  if (initT < 0) {
    // Fase Padat (Es di bawah 0°C)
    const q = m * C_ES * (initT - tBase);
    return {
      temp: initT,
      heatTotal: q,
      meltProgress: 0,
      vaporProgress: 0
    };
  } else if (initT === 0) {
    // Titik Lebur (Es pada 0°C siap melebur)
    return {
      temp: 0.0,
      heatTotal: landmarks.q1,
      meltProgress: 0,
      vaporProgress: 0
    };
  } else if (initT > 0 && initT < 100) {
    // Fase Cair (Air di antara 0°C s/d 100°C)
    const q = landmarks.q2 + m * C_AIR * initT;
    return {
      temp: initT,
      heatTotal: q,
      meltProgress: 1.0,
      vaporProgress: 0.0
    };
  } else if (initT === 100) {
    // Titik Didih (Air mendidih 100°C siap menguap)
    return {
      temp: 100.0,
      heatTotal: landmarks.q3,
      meltProgress: 1.0,
      vaporProgress: 0.0
    };
  } else {
    // Fase Gas (Uap Panas di atas 100°C)
    const q = landmarks.q4 + m * C_UAP * (initT - 100);
    return {
      temp: Math.min(120.0, initT),
      heatTotal: Math.min(landmarks.q5, q),
      meltProgress: 1.0,
      vaporProgress: 1.0
    };
  }
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
    label.textContent = graphViewMode === 'focused'
      ? (currentLang === 'en' ? 'Point Focus' : 'Fokus Titik')
      : (currentLang === 'en' ? 'Full Overview' : 'Peta Penuh');
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

// --- PENGECEKAN STATUS ALIRAN KALOR (PEMANASAN ATAU PENDINGINAN) ---
function isCoolingProcess() {
  const hr = getHeatRate(state.temp, state.zone, state.flameLevel);
  if (hr < -0.01) return true;
  if (hr > 0.01) return false;
  // Jika dalam kesetimbangan atau jeda saat suhu lebih tinggi dari lingkungan
  if (state.zone === 'freezer' && (state.temp > -9.95 || state.heatTotal > 0.05)) return true;
  if (state.zone === 'suhuRuang' && state.temp > 27.2) return true;
  return false;
}

function getProcessInfoData() {
  const landmarks = getLandmarks(state.mass, state.initialTemp);
  const Q = state.heatTotal;
  const T = Math.abs(state.temp) < 0.05 ? 0.0 : state.temp;
  const zone = state.zone;
  const massG = Math.round(state.mass * 1000);
  const isCooling = isCoolingProcess();
  const lang = currentLang;

  let title = '';
  let badge = '';
  let badgeClass = '';
  let text = '';
  let icon = 'info';

  if (lang === 'en') {
    // 1. ZONE: FREEZER (-10°C)
    if (zone === 'freezer') {
      if (T <= -9.9 && Q <= 0.05) {
        title = 'Thermal Equilibrium in Freezer';
        badge = 'Stable Temp -10°C';
        badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
        icon = 'snowflake';
        text = `
          <div>• <strong>Phase:</strong> Solid (Ice).</div>
          <div>• <strong>Heat Flow:</strong> None (ΔT = 0).</div>
          <div>• <strong>Concept:</strong> Ice temperature equals freezer temperature (-10°C); system is in thermal equilibrium.</div>
        `;
      } else if (Q >= landmarks.q3) {
        const pctCondense = Math.round((1 - state.vaporProgress) * 100);
        title = 'Steam Condensing in Freezer (100°C)';
        badge = `Condensing: ${pctCondense}%`;
        badgeClass = 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
        icon = 'droplets';
        text = `
          <div>• <strong>Phase:</strong> Transition Gas &rarr; Liquid (Condensation at 100°C).</div>
          <div>• <strong>Heat Flow:</strong> Releases Latent Heat of Condensation (<i>Q = m·U</i> = 2,260 kJ/kg).</div>
          <div>• <strong>Concept:</strong> Steam releases a large quantity of latent heat into the freezer until it condenses back into liquid water at 100°C.</div>
        `;
      } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
        title = 'Water Releasing Heat into Freezer';
        badge = `Water Cooling: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
        icon = 'snowflake';
        text = `
          <div>• <strong>Phase:</strong> Liquid (Cooling down toward 0°C freezing point).</div>
          <div>• <strong>Heat Flow:</strong> Releases Sensible Heat (<i>Q = m·c<sub>water</sub>·ΔT</i>).</div>
          <div>• <strong>Concept:</strong> Water loses heat to the -10°C freezer environment; molecular kinetic energy decreases and temperature drops toward 0°C.</div>
        `;
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        const pctFreeze = Math.round((1 - state.meltProgress) * 100);
        title = 'Freezing Process in Freezer (0°C)';
        badge = `Freezing: ${pctFreeze}%`;
        badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
        icon = 'snowflake';
        text = `
          <div>• <strong>Phase:</strong> Transition Liquid &rarr; Solid (Freezing Point 0°C).</div>
          <div>• <strong>Heat Flow:</strong> Releases Latent Heat of Freezing (<i>Q = m·L</i> = 336 kJ/kg).</div>
          <div>• <strong>Concept:</strong> Temperature stays constant at 0°C during freezing. Water loses latent heat until all liquid crystallizes into ice. Volume expands by ~9% due to water anomaly.</div>
        `;
      } else {
        title = 'Ice Subcooling in Freezer';
        badge = `Ice Cooling: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
        icon = 'snowflake';
        text = `
          <div>• <strong>Phase:</strong> Solid (Ice cooling down).</div>
          <div>• <strong>Heat Flow:</strong> Releases Sensible Heat (<i>Q = m·c<sub>ice</sub>·ΔT</i>).</div>
          <div>• <strong>Concept:</strong> Fully frozen ice continues to release sensible heat until reaching thermal equilibrium at -10°C.</div>
        `;
      }
    }

    // 2. ZONE: ROOM TEMP (27°C)
    else if (zone === 'suhuRuang') {
      if (Q >= landmarks.q3) {
        const pctCondense = Math.round((1 - state.vaporProgress) * 100);
        title = 'Steam Condensing at Room Temp (100°C)';
        badge = `Condensing: ${pctCondense}%`;
        badgeClass = 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
        icon = 'droplets';
        text = `
          <div>• <strong>Phase:</strong> Transition Gas &rarr; Liquid (Condensation at 100°C).</div>
          <div>• <strong>Heat Flow:</strong> Releases Latent Heat of Condensation (<i>Q = m·U</i> = 2,260 kJ/kg).</div>
          <div>• <strong>Concept:</strong> Steam transfers latent heat into room air, condensing back into liquid water droplets at a constant 100°C.</div>
        `;
      } else if (T > 27.5) {
        title = 'Hot Water Cooling to Room Temp';
        badge = `Water Cooling: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        icon = 'wind';
        text = `
          <div>• <strong>Phase:</strong> Liquid (Natural cooling).</div>
          <div>• <strong>Heat Flow:</strong> Releases Sensible Heat (<i>Q = m·c<sub>water</sub>·ΔT</i>).</div>
          <div>• <strong>Concept:</strong> Heat flows spontaneously from hot water into surrounding 27°C air until equilibrium is reached.</div>
        `;
      } else if (T >= 26.5 && T <= 27.5) {
        title = 'Thermal Equilibrium at Room Temp';
        badge = 'Stable Temp 27°C';
        badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        icon = 'check-circle';
        text = `
          <div>• <strong>Phase:</strong> Liquid (Water stable at 27°C).</div>
          <div>• <strong>Heat Flow:</strong> Zero (water temp = room temp 27°C).</div>
          <div>• <strong>Concept:</strong> Water temperature is in equilibrium with the room; no net heat transfer occurs.</div>
        `;
      } else if (Q >= landmarks.q2 && T < 26.5) {
        title = 'Water Warming Toward Room Temp';
        badge = `Water Warming: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        icon = 'droplet';
        text = `
          <div>• <strong>Phase:</strong> Liquid (Warming gradually).</div>
          <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>water</sub>·ΔT</i>).</div>
          <div>• <strong>Concept:</strong> Water absorbs ambient heat from room air until approaching 27°C.</div>
        `;
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        const pctMelt = Math.round(state.meltProgress * 100);
        title = 'Melting at Room Temp (0°C)';
        badge = `Melting: ${pctMelt}%`;
        badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        icon = 'droplets';
        text = `
          <div>• <strong>Phase:</strong> Transition Solid &rarr; Liquid (Melting Point 0°C).</div>
          <div>• <strong>Heat Flow:</strong> Absorbs Latent Heat of Fusion (<i>Q = m·L</i> = 336 kJ/kg).</div>
          <div>• <strong>Concept:</strong> Temperature stays at 0°C during melting. Mass (${massG} g) is strictly conserved; volume contracts ~8.3% due to water anomaly.</div>
        `;
      } else {
        title = 'Ice Absorbing Room Heat';
        badge = `Ice Warming: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        icon = 'thermometer-sun';
        text = `
          <div>• <strong>Phase:</strong> Solid (Ice warming up).</div>
          <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>ice</sub>·ΔT</i>).</div>
          <div>• <strong>Concept:</strong> Ice absorbs heat from 27°C ambient air, raising its temperature toward the 0°C melting point.</div>
        `;
      }
    }

    // 3. ZONE: STOVE BURNER (150°C)
    else if (zone === 'kompor') {
      const flameTxt = state.flameLevel === 1 ? 'Low' : (state.flameLevel === 2 ? 'Med' : 'High');

      if (Q < landmarks.q1 && T < 0) {
        title = 'Ice Heated on Stove: Rapid Temperature Rise';
        badge = `${flameTxt} Flame`;
        badgeClass = 'bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800';
        icon = 'flame';
        text = `
          <div>• <strong>Phase:</strong> Solid (Ice warming rapidly).</div>
          <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>ice</sub>·ΔT</i>).</div>
          <div>• <strong>Concept:</strong> Flame energy rapidly increases molecular kinetic energy of ice toward 0°C.</div>
        `;
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        const pctMelt = Math.round(state.meltProgress * 100);
        title = 'Melting Process on Stove (0°C)';
        badge = `Melting: ${pctMelt}%`;
        badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
        icon = 'layers';
        text = `
          <div>• <strong>Phase:</strong> Transition Solid &rarr; Liquid (Melting Point 0°C).</div>
          <div>• <strong>Heat Flow:</strong> Absorbs Latent Heat of Fusion (<i>Q = m·L</i> = 336 kJ/kg).</div>
          <div>• <strong>Concept:</strong> Temperature remains locked at 0°C while melting. Mass (${massG} g) is conserved, volume slightly contracts.</div>
        `;
      } else if (Q >= landmarks.q2 && Q < landmarks.q3 && T < 100) {
        title = 'Water Heating Toward Boiling Point';
        badge = `Temp: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800';
        icon = 'flame';
        text = `
          <div>• <strong>Phase:</strong> Liquid (Water heated).</div>
          <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>water</sub>·ΔT</i>).</div>
          <div>• <strong>Concept:</strong> Heat increases water temperature from 0°C to 100°C. Convection bubbles start forming.</div>
        `;
      } else if (Q >= landmarks.q3 && Q < landmarks.q4) {
        const pctVapor = Math.round(state.vaporProgress * 100);
        title = 'Boiling & Vaporizing (100°C)';
        badge = `Boiling: ${pctVapor}%`;
        badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
        icon = 'cloud-fog';
        text = `
          <div>• <strong>Phase:</strong> Transition Liquid &rarr; Gas (Boiling Point 100°C).</div>
          <div>• <strong>Heat Flow:</strong> Absorbs Latent Heat of Vaporization (<i>Q = m·U</i> = 2,260 kJ/kg).</div>
          <div>• <strong>Concept:</strong> Temperature stays at 100°C. Heat breaks intermolecular bonds, producing water vapor.</div>
        `;
      } else {
        title = 'All Water Vaporized (Gas Phase)';
        badge = 'Free Gas';
        badgeClass = 'bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800';
        icon = 'cloud';
        text = `
          <div>• <strong>Phase:</strong> Gas (Free Water Vapor).</div>
          <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>steam</sub>·ΔT</i>).</div>
          <div>• <strong>Concept:</strong> All water has turned into steam escaping into the air. The beaker is now dry.</div>
        `;
      }
    }
  } else {
    // 1. ZONA: FREEZER (-10°C)
    if (zone === 'freezer') {
      if (T <= -9.9 && Q <= 0.05) {
        title = 'Keseimbangan Termal di Freezer';
        badge = 'Suhu Stabil -10°C';
        badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
        icon = 'snowflake';
        text = `
          <div>• <strong>Fase Zat:</strong> Padat (Es Batu).</div>
          <div>• <strong>Aliran Kalor:</strong> Tidak ada perpindahan kalor (ΔT = 0).</div>
          <div>• <strong>Konsep:</strong> Suhu es sama dengan suhu freezer (-10°C), sistem dalam kesetimbangan termal.</div>
        `;
      } else if (Q >= landmarks.q3) {
        const persenEmbun = Math.round((1 - state.vaporProgress) * 100);
        title = 'Uap Mengembun di Freezer (100°C)';
        badge = `Mengembun: ${persenEmbun}%`;
        badgeClass = 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
        icon = 'droplets';
        text = `
          <div>• <strong>Fase Zat:</strong> Transisi Gas &rarr; Cair (Kondensasi 100°C).</div>
          <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Laten Pengembunan (<i>Q = m·U</i> = 2.260 kJ/kg).</div>
          <div>• <strong>Konsep:</strong> Uap air melepas kalor laten dalam jumlah besar ke freezer hingga mengembun kembali menjadi air cair pada suhu 100°C.</div>
        `;
      } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
        title = 'Air Melepas Kalor ke Freezer';
        badge = `Air Mendingin: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
        icon = 'snowflake';
        text = `
          <div>• <strong>Fase Zat:</strong> Cair (Air mendingin menuju titik beku 0°C).</div>
          <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Sensibel (<i>Q = m·c<sub>air</sub>·ΔT</i>).</div>
          <div>• <strong>Konsep:</strong> Air melepas kalor ke lingkungan freezer (-10°C) sehingga energi kinetik molekul menurun dan suhunya turun menuju 0°C.</div>
        `;
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        const persenBeku = Math.round((1 - state.meltProgress) * 100);
        title = 'Proses Membeku di Freezer (0°C)';
        badge = `Membeku: ${persenBeku}%`;
        badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
        icon = 'snowflake';
        text = `
          <div>• <strong>Fase Zat:</strong> Transisi Cair &rarr; Padat (Titik Beku 0°C).</div>
          <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Laten Pembekuan (<i>Q = m·L</i> = 336 kJ/kg).</div>
          <div>• <strong>Konsep:</strong> Suhu tertahan di 0°C selama pembekuan. Air melepas kalor laten hingga seluruh cairan mengkristal menjadi es. Volume memuai ~9% akibat anomali air.</div>
        `;
      } else {
        title = 'Pendinginan Es di Freezer';
        badge = `Es Mendingin: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
        icon = 'snowflake';
        text = `
          <div>• <strong>Fase Zat:</strong> Padat (Es mendingin).</div>
          <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Sensibel (<i>Q = m·c<sub>es</sub>·ΔT</i>).</div>
          <div>• <strong>Konsep:</strong> Es yang telah beku sempurna terus melepas kalor sensibel hingga suhunya turun mencapai kesetimbangan di -10°C.</div>
        `;
      }
    }

    // 2. ZONA: SUHU RUANG (27°C)
    else if (zone === 'suhuRuang') {
      if (Q >= landmarks.q3) {
        const persenEmbun = Math.round((1 - state.vaporProgress) * 100);
        title = 'Uap Mengembun di Suhu Ruang (100°C)';
        badge = `Mengembun: ${persenEmbun}%`;
        badgeClass = 'bg-blue-100 dark:bg-blue-950/50 text-blue-800 dark:text-blue-300 border-blue-300 dark:border-blue-800';
        icon = 'droplets';
        text = `
          <div>• <strong>Fase Zat:</strong> Transisi Gas &rarr; Cair (Kondensasi 100°C).</div>
          <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Laten Pengembunan (<i>Q = m·U</i> = 2.260 kJ/kg).</div>
          <div>• <strong>Konsep:</strong> Uap air melepas kalor laten ke udara ruangan sehingga terkondensasi kembali menjadi tetesan air cair pada suhu tetap 100°C.</div>
        `;
      } else if (T > 27.5) {
        title = 'Air Panas Melepas Kalor ke Ruangan';
        badge = `Air Mendingin: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        icon = 'wind';
        text = `
          <div>• <strong>Fase Zat:</strong> Cair (Air mendingin secara alami).</div>
          <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Sensibel (<i>Q = m·c<sub>air</sub>·ΔT</i>).</div>
          <div>• <strong>Konsep:</strong> Kalor mengalir spontan dari air panas ke udara ruangan sekitar sampai suhunya kembali stabil di 27°C.</div>
        `;
      } else if (T >= 26.5 && T <= 27.5) {
        title = 'Kesetimbangan Termal di Ruangan';
        badge = 'Suhu Stabil 27°C';
        badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        icon = 'check-circle';
        text = `
          <div>• <strong>Fase Zat:</strong> Cair (Air stabil 27°C).</div>
          <div>• <strong>Aliran Kalor:</strong> Nol (suhu air = suhu ruang 27°C).</div>
          <div>• <strong>Konsep:</strong> Suhu air setimbang dengan suhu ruangan, tidak terjadi perpindahan kalor.</div>
        `;
      } else if (Q >= landmarks.q2 && T < 26.5) {
        title = 'Air Menyerap Kalor Menuju Suhu Ruang';
        badge = `Air Memanas: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        icon = 'droplet';
        text = `
          <div>• <strong>Fase Zat:</strong> Cair (Air memanas perlahan).</div>
          <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>air</sub>·ΔT</i>).</div>
          <div>• <strong>Konsep:</strong> Air menyerap kalor alami dari udara ruangan hingga suhunya mendekati 27°C.</div>
        `;
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        const persenLebur = Math.round(state.meltProgress * 100);
        title = 'Melebur di Suhu Ruang (0°C)';
        badge = `Melebur: ${persenLebur}%`;
        badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        icon = 'droplets';
        text = `
          <div>• <strong>Fase Zat:</strong> Transisi Padat &rarr; Cair (Titik Lebur 0°C).</div>
          <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Laten Lebur (<i>Q = m·L</i> = 336 kJ/kg).</div>
          <div>• <strong>Konsep:</strong> Suhu tetap 0°C selama melebur. Massa zat tetap ${massG} g (kekal), volume menyusut ~8,3% akibat anomali air.</div>
        `;
      } else {
        title = 'Es Menyerap Kalor Udara Ruang';
        badge = `Es Memanas: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
        icon = 'thermometer-sun';
        text = `
          <div>• <strong>Fase Zat:</strong> Padat (Es memanas).</div>
          <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>es</sub>·ΔT</i>).</div>
          <div>• <strong>Konsep:</strong> Es menyerap kalor dari udara 27°C sehingga suhu es naik menuju titik lebur 0°C.</div>
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
          <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>es</sub>·ΔT</i>).</div>
          <div>• <strong>Konsep:</strong> Kalor dari nyala kompor menaikkan energi kinetik molekul es menuju 0°C.</div>
        `;
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        const persenLebur = Math.round(state.meltProgress * 100);
        title = 'Proses Melebur di Kompor (0°C)';
        badge = `Melebur: ${persenLebur}%`;
        badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
        icon = 'layers';
        text = `
          <div>• <strong>Fase Zat:</strong> Transisi Padat &rarr; Cair (Titik Lebur 0°C).</div>
          <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Laten Lebur (<i>Q = m·L</i> = 336 kJ/kg).</div>
          <div>• <strong>Konsep:</strong> Suhu tertahan di 0°C selama melebur. Massa ${massG} g tetap kekal, volume sedikit menyusut.</div>
        `;
      } else if (Q >= landmarks.q2 && Q < landmarks.q3 && T < 100) {
        title = 'Pemanasan Air Menuju Titik Didih';
        badge = `Suhu: ${T.toFixed(1)}°C`;
        badgeClass = 'bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800';
        icon = 'flame';
        text = `
          <div>• <strong>Fase Zat:</strong> Cair (Air dipanaskan).</div>
          <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>air</sub>·ΔT</i>).</div>
          <div>• <strong>Konsep:</strong> Kalor menaikkan suhu air dari 0°C ke titik didih 100°C. Gelembung konveksi mulai terbentuk.</div>
        `;
      } else if (Q >= landmarks.q3 && Q < landmarks.q4) {
        const persenUap = Math.round(state.vaporProgress * 100);
        title = 'Mendidih & Menguap (100°C)';
        badge = `Menguap: ${persenUap}%`;
        badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
        icon = 'cloud-fog';
        text = `
          <div>• <strong>Fase Zat:</strong> Transisi Cair &rarr; Gas (Titik Didih 100°C).</div>
          <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Laten Penguapan (<i>Q = m·U</i> = 2.260 kJ/kg).</div>
          <div>• <strong>Konsep:</strong> Suhu konstan 100°C. Kalor digunakan memutus ikatan antarmolekul menjadi uap air.</div>
        `;
      } else {
        title = 'Semua Air Menguap (Fase Gas)';
        badge = 'Gas Bebas';
        badgeClass = 'bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800';
        icon = 'cloud';
        text = `
          <div>• <strong>Fase Zat:</strong> Gas (Uap Air Bebas).</div>
          <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>uap</sub>·ΔT</i>).</div>
          <div>• <strong>Konsep:</strong> Seluruh air telah menguap membubung ke udara. Wadah kini kering.</div>
        `;
      }
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

function syncTempDropdown(num) {
  const sel = document.getElementById('initialTempSelect');
  if (!sel) return;
  const numStr = String(num);
  let matched = false;
  for (let i = 0; i < sel.options.length; i++) {
    if (sel.options[i].value === numStr) {
      sel.selectedIndex = i;
      matched = true;
      break;
    }
  }
  if (!matched) {
    sel.value = 'custom';
  }
}

function onInitialTempChange(val) {
  sound.playClick();
  const inputEl = document.getElementById('customTempInput');
  if (val === 'custom') {
    if (inputEl) {
      inputEl.focus();
      inputEl.select();
    }
    return;
  }
  const num = parseFloat(val);
  state.initialTemp = num;
  if (inputEl) inputEl.value = num;
  resetSimulation();
}

function onCustomTempInput(val) {
  let num = parseFloat(val);
  if (isNaN(num)) return;
  num = Math.max(-20, Math.min(120, num));
  state.initialTemp = num;
  syncTempDropdown(num);
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
    if (label) label.textContent = currentLang === 'en' ? 'Pause' : 'Jeda';
    btnPlayPause.classList.remove('bg-[#E5232B]', 'hover:bg-[#BF1219]');
    btnPlayPause.classList.add('bg-amber-600', 'hover:bg-amber-700');
  } else {
    if (wrapper) wrapper.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 fill-white"></i>';
    if (label) {
      label.textContent = state.heatTotal > 0
        ? (currentLang === 'en' ? 'Resume' : 'Lanjut')
        : (currentLang === 'en' ? 'Start' : 'Mulai');
    }
    btnPlayPause.classList.remove('bg-amber-600', 'hover:bg-amber-700');
    btnPlayPause.classList.add('bg-[#E5232B]', 'hover:bg-[#BF1219]');
  }
  lucide.createIcons();
}

function resetSimulation() {
  sound.playClick();
  const init = getInitialThermalState(state.initialTemp, state.mass);
  state.temp = init.temp;
  state.heatTotal = init.heatTotal;
  state.simTime = 0;
  state.meltProgress = init.meltProgress;
  state.vaporProgress = init.vaporProgress;
  state.steamParticles = [];
  state.bubbles = [];

  state.isPlaying = false;
  const wrapper = document.getElementById('playIconWrapper');
  const label = document.getElementById('playLabel');
  if (wrapper) wrapper.innerHTML = '<i data-lucide="play" class="w-3.5 h-3.5 fill-white"></i>';
  if (label) label.textContent = currentLang === 'en' ? 'Start' : 'Mulai';
  btnPlayPause.classList.remove('bg-amber-600', 'hover:bg-amber-700');
  btnPlayPause.classList.add('bg-[#E5232B]', 'hover:bg-[#BF1219]');
  lucide.createIcons();

  // Atur zona lingkungan awal yang sesuai dengan suhu awal
  if (state.initialTemp <= 0) {
    setZone('freezer');
  } else if (state.initialTemp <= 40) {
    setZone('suhuRuang');
  } else {
    setZone('kompor');
  }

  // Sinkronisasi dropdown pilihan dan input angka suhu
  syncTempDropdown(state.initialTemp);
  const inputEl = document.getElementById('customTempInput');
  if (inputEl && parseFloat(inputEl.value) !== state.initialTemp) {
    inputEl.value = state.initialTemp;
  }

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
    state.temp = landmarks.tBase + (Q / (m * C_ES));
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

  // Batas pendinginan freezer (-10°C)
  if (state.zone === 'freezer' && state.temp <= -10.0 && heatRate <= 0) {
    const qFreezerLimit = landmarks.tBase === -10 ? 0 : (m * C_ES * (-10 - landmarks.tBase));
    if (state.heatTotal <= qFreezerLimit) {
      state.heatTotal = qFreezerLimit;
      state.temp = -10.0;
    }
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
  } else {
    // Tatakan meja lab / rak pendingin saat di Freezer atau Suhu Ruang (Grounding Beaker)
    const benchY = 152;
    bCtx.save();
    // Tatakan cawan isolator keramik
    bCtx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    bCtx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
    bCtx.lineWidth = 1.5;
    bCtx.beginPath();
    bCtx.roundRect(w / 2 - 80, benchY, 160, 8, 3);
    bCtx.fill();
    bCtx.stroke();

    // Permukaan meja laboratorium
    bCtx.fillStyle = isDark ? '#0f172a' : '#f8fafc';
    bCtx.fillRect(w / 2 - 110, benchY + 8, 220, h - (benchY + 8));
    bCtx.strokeStyle = isDark ? '#334155' : '#e2e8f0';
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.moveTo(w / 2 - 110, benchY + 8);
    bCtx.lineTo(w / 2 + 110, benchY + 8);
    bCtx.stroke();
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

  // 4. Gelembung Air Mendidih (Hanya diproduksi jika aktif dipanaskan di kompor)
  if (state.temp >= 98 && state.vaporProgress < 1 && state.zone === 'kompor') {
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
  const isCooling = isCoolingProcess();
  const descEl = document.getElementById('moleculeDesc');

  if (currentLang === 'en') {
    if (isSolid) {
      descEl.textContent = 'Solid: Molecules vibrate orderly in place';
    } else if (isMelting) {
      descEl.textContent = isCooling
        ? 'Freezing: Molecules lock together into ice crystal lattice'
        : 'Melting: Molecules begin breaking loose and flowing';
    } else if (isLiquid) {
      descEl.textContent = isCooling
        ? 'Liquid: Molecular kinetic energy decreases while cooling'
        : 'Liquid: Molecules flow freely close together';
    } else if (isBoiling) {
      descEl.textContent = isCooling
        ? 'Condensing: Steam molecules recondense into liquid droplets'
        : 'Boiling: High-energy molecules escape rapidly as steam';
    } else {
      descEl.textContent = isCooling
        ? 'Gas: Steam loses heat and contracts'
        : 'Gas: Molecules move freely and rapidly at random';
    }
  } else {
    if (isSolid) {
      descEl.textContent = 'Padat: Molekul bergetar teratur di tempat';
    } else if (isMelting) {
      descEl.textContent = isCooling
        ? 'Membeku: Molekul merapat & terkunci membentuk kristal es'
        : 'Melebur: Sebagian molekul mulai lepas & mengalir';
    } else if (isLiquid) {
      descEl.textContent = isCooling
        ? 'Cair: Energi kinetik molekul menurun saat mendingin'
        : 'Cair: Molekul bebas mengalir berdekatan';
    } else if (isBoiling) {
      descEl.textContent = isCooling
        ? 'Mengembun: Molekul uap merapat kembali jadi tetesan cairan'
        : 'Mendidih: Molekul melesat lepas jadi uap';
    } else {
      descEl.textContent = isCooling
        ? 'Gas: Uap melepaskan kalor & merapat'
        : 'Gas: Molekul bergerak acak & bebas';
    }
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
  const isCooling = isCoolingProcess();

  const landmarks = getLandmarks(state.mass, state.initialTemp);
  // Kalor dan suhu dibatasi secara ketat dalam batas kurva A-F (q5 dan 120°C)
  const curQ = Math.max(0, Math.min(landmarks.q5, state.heatTotal));
  const curT = Math.max(landmarks.tBase, Math.min(120.0, state.temp));

  const pts = [
    { q: 0, t: landmarks.tBase, label: 'A', desc: currentLang === 'en' ? 'Ice' : 'Es' },
    { q: landmarks.q1, t: 0, label: 'B', desc: currentLang === 'en' ? '0°C Melt' : '0°C Lebur' },
    { q: landmarks.q2, t: 0, label: 'C', desc: currentLang === 'en' ? '0°C Liquid' : '0°C Cair' },
    { q: landmarks.q3, t: 100, label: 'D', desc: currentLang === 'en' ? '100°C Boil' : '100°C Didih' },
    { q: landmarks.q4, t: 100, label: 'E', desc: currentLang === 'en' ? '100°C Vapor' : '100°C Uap' },
    { q: landmarks.q5, t: 120, label: 'F', desc: currentLang === 'en' ? '120°C Vapor' : '120°C Uap' }
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
        if (tVal === 0) txt += isCooling ? (currentLang === 'en' ? ' (Freeze)' : ' (Beku)') : (currentLang === 'en' ? ' (Melt)' : ' (Lebur)');
        else if (tVal === 100) txt += isCooling ? (currentLang === 'en' ? ' (Condense)' : ' (Embun)') : (currentLang === 'en' ? ' (Boil)' : ' (Didih)');
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

        // Jangan timpa teks pada area mini-map di pojok kanan bawah
        if (sx < w - 108) {
          gCtx.fillStyle = isDark ? '#94a3b8' : '#64748b';
          gCtx.font = '8px "Plus Jakarta Sans", sans-serif';
          gCtx.textAlign = 'center';
          gCtx.fillText((p.q / 1000).toFixed(1) + ' kJ', sx, h - 6);
        }
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
      return mmY + mmPad + mmPlotH - ((t - landmarks.tBase) / (120 - landmarks.tBase)) * mmPlotH;
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
    gCtx.fillText(currentLang === 'en' ? 'MAP A-F' : 'PETA A-F', mmX + 5, mmY + mmH - 3);

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
    const axisTitle = currentLang === 'en'
      ? (isCooling ? 'Heat Flow Q (kJ) - Released' : 'Heat Absorbed Q (kJ)')
      : (isCooling ? 'Aliran Kalor Q (kJ) - Pelepasan' : 'Kalor Diserap Q (kJ)');
    gCtx.fillText(axisTitle, padL + plotW / 2, h - 8);

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
  const unitJoule = currentLang === 'en' ? 'Joules' : 'Joule';
  const locale = currentLang === 'en' ? 'en-US' : 'id-ID';
  displayHeatJ.textContent = `(${Math.round(state.heatTotal).toLocaleString(locale)} ${unitJoule})`;

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
    const unitSec = currentLang === 'en' ? 'sec' : 'detik';
    displayTimeSubEl.textContent = `${state.simTime.toFixed(1)} ${unitSec}`;
  }

  // Kompatibilitas Telemetri Massa & Volume jika dipanggil
  const mv = getMassAndVolume();
  if (typeof displayMass !== 'undefined' && displayMass) displayMass.textContent = mv.totalMass.toFixed(0);
  if (typeof displayVolume !== 'undefined' && displayVolume) displayVolume.textContent = `${mv.totalVol.toFixed(1)} mL`;
  const isCooling = isCoolingProcess();

  if (typeof displayAnomalyStatus !== 'undefined' && displayAnomalyStatus) {
    if (state.meltProgress === 0) {
      displayAnomalyStatus.textContent = currentLang === 'en' ? 'Solid (Hollow Ice)' : 'Padat (Es Berongga)';
    } else if (state.meltProgress > 0 && state.meltProgress < 1) {
      displayAnomalyStatus.textContent = isCooling
        ? (currentLang === 'en' ? `Expands to ${(mv.finalWaterVol * 1.09).toFixed(0)} mL (Freezing)` : `Memuai ke ${(mv.finalWaterVol * 1.09).toFixed(0)} mL (Membeku)`)
        : (currentLang === 'en' ? `Shrinks to ${mv.finalWaterVol.toFixed(0)} mL (Melting)` : `Menyusut ke ${mv.finalWaterVol.toFixed(0)} mL (Melebur)`);
    } else if (state.meltProgress >= 1 && state.vaporProgress === 0) {
      displayAnomalyStatus.textContent = currentLang === 'en' ? `Mass ${mv.massG}g Conserved` : `Massa ${mv.massG}g Kekal`;
    } else if (state.vaporProgress > 0 && state.vaporProgress < 1) {
      displayAnomalyStatus.textContent = isCooling
        ? (currentLang === 'en' ? `Condensing (Liquid ${mv.waterVol.toFixed(0)} mL)` : `Mengembun (Cair ${mv.waterVol.toFixed(0)} mL)`)
        : (currentLang === 'en' ? `Vaporizing (Remaining ${mv.totalMass.toFixed(0)}g)` : `Menguap (Sisa ${mv.totalMass.toFixed(0)}g)`);
    } else {
      displayAnomalyStatus.textContent = currentLang === 'en' ? 'Free Vapor (Dry)' : 'Uap Bebas (Kering)';
    }
  }

  // Update Teks Legenda Grafik (Adaptif terhadap Pemanasan / Pendinginan)
  const legAB = document.getElementById('legendAB');
  const legBC = document.getElementById('legendBC');
  const legCD = document.getElementById('legendCD');
  const legDE = document.getElementById('legendDE');
  if (currentLang === 'en') {
    if (legAB) legAB.textContent = isCooling ? 'A-B: Ice Cooling' : 'A-B: Ice Heating';
    if (legBC) legBC.textContent = isCooling ? 'B-C: Freezing' : 'B-C: Melting';
    if (legCD) legCD.textContent = isCooling ? 'C-D: Water Cooling' : 'C-D: Water Heating';
    if (legDE) legDE.textContent = isCooling ? 'D-E: Condensing' : 'D-E: Boiling';
  } else {
    if (legAB) legAB.textContent = isCooling ? 'A-B: Es Mendingin' : 'A-B: Es Memanas';
    if (legBC) legBC.textContent = isCooling ? 'B-C: Membeku' : 'B-C: Melebur';
    if (legCD) legCD.textContent = isCooling ? 'C-D: Air Mendingin' : 'C-D: Air Memanas';
    if (legDE) legDE.textContent = isCooling ? 'D-E: Mengembun' : 'D-E: Menguap';
  }

  const landmarks = getLandmarks(state.mass, state.initialTemp);
  const Q = state.heatTotal;
  const minEsTemp = state.initialTemp < 0 ? state.initialTemp : landmarks.tBase;

  if (currentLang === 'en') {
    if (Q < landmarks.q1) {
      if (isCooling) {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Solid (Ice Cooling 0°C &rarr; ${minEsTemp}°C)`;
      } else {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Solid (Ice ${minEsTemp}°C &rarr; 0°C)`;
      }
      badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs';
    } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
      if (isCooling) {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Freezing (0°C Constant)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Melting (0°C Constant)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs';
      }
    } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
      if (isCooling) {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Liquid (Water Cooling 100°C &rarr; 0°C)';
      } else {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Liquid (Water Heating 0°C &rarr; 100°C)';
      }
      badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs';
    } else if (Q >= landmarks.q3 && Q < landmarks.q4) {
      if (isCooling) {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Condensing (100°C Constant)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Boiling / Vaporizing (100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs';
      }
    } else {
      if (isCooling) {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span> Gas (Steam Cooling > 100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Gas (Steam > 100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 shadow-2xs';
      }
    }
  } else {
    if (Q < landmarks.q1) {
      if (isCooling) {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Padat (Es Mendingin 0°C &rarr; ${minEsTemp}°C)`;
      } else {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Padat (Es ${minEsTemp}°C &rarr; 0°C)`;
      }
      badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs';
    } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
      if (isCooling) {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Membeku (0°C Tetap)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Melebur (0°C Tetap)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs';
      }
    } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
      if (isCooling) {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Cair (Air Mendingin 100°C &rarr; 0°C)';
      } else {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Cair (Air Memanas 0°C &rarr; 100°C)';
      }
      badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs';
    } else if (Q >= landmarks.q3 && Q < landmarks.q4) {
      if (isCooling) {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Mengembun (100°C Tetap)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Mendidih / Menguap (100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs';
      }
    } else {
      if (isCooling) {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span> Gas (Uap Mendingin > 100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Gas (Uap Air > 100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 shadow-2xs';
      }
    }
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

// --- KUIS INTERAKTIF KALOR IPA KELAS 7 (BILINGUAL ID & EN) ---
const quizData = [
  {
    id: {
      q: '1. Mengapa saat es melebur pada 0°C (segmen B-C) suhunya tidak naik meski terus menyerap kalor?',
      options: [
        'Karena termometer di dalam wadah tidak bekerja',
        'Karena kalor digunakan untuk merusak ikatan molekul es (kalor laten), bukan menaikkan suhu',
        'Karena kalor langsung hilang seluruhnya ke udara bebas',
        'Karena massa es berkurang secara drastis'
      ],
      expl: 'Benar! Kalor laten (Q = m × L) digunakan khusus untuk mengubah wujud zat dari padat ke cair, bukan untuk menaikkan suhu.'
    },
    en: {
      q: '1. Why does the temperature of ice remain at 0°C (segment B-C) during melting even as it absorbs heat?',
      options: [
        'Because the thermometer inside the container is malfunctioning',
        'Because heat is consumed to break intermolecular bonds (latent heat), rather than raise temperature',
        'Because heat escapes completely into the ambient air',
        'Because the mass of the ice drastically decreases'
      ],
      expl: 'Correct! Latent heat (Q = m × L) is exclusively used to change the state from solid to liquid, not to increase temperature.'
    },
    answer: 1
  },
  {
    id: {
      q: '2. Seberapa besar kalor yang dibutuhkan untuk merubah wujud zat padat menjadi cair disebut...',
      options: [
        'Kalor jenis zat',
        'Kalor laten lebur',
        'Kapasitas kalor',
        'Suhu mutlak'
      ],
      expl: 'Tepat! Kalor laten lebur (L) adalah banyaknya kalor yang diperlukan oleh 1 kg zat untuk berubah wujud dari padat menjadi cair pada titik leburnya.'
    },
    en: {
      q: '2. The amount of heat required to change the state of a solid substance into a liquid is called...',
      options: [
        'Specific heat capacity',
        'Latent heat of fusion',
        'Heat capacity',
        'Absolute temperature'
      ],
      expl: 'Spot on! Latent heat of fusion (L) is the amount of heat required by 1 kg of a substance to change from solid to liquid at its melting point.'
    },
    answer: 1
  },
  {
    id: {
      q: '3. Jika es diletakkan di suhu ruang bersuhu 27°C, arah perpindahan kalor yang benar adalah...',
      options: [
        'Dari es menuju udara sekitar',
        'Dari udara sekitar menuju es yang lebih dingin',
        'Tidak ada perpindahan kalor sama sekali',
        'Bolak-balik tanpa henti'
      ],
      expl: 'Tepat! Kalor selalu mengalir secara alami dari lingkungan bersuhu lebih tinggi ke benda bersuhu lebih rendah.'
    },
    en: {
      q: '3. If ice is placed at room temperature (27°C), the correct direction of heat transfer is...',
      options: [
        'From the ice toward ambient air',
        'From the ambient air toward the colder ice',
        'No heat transfer occurs at all',
        'Alternating back and forth continuously'
      ],
      expl: 'Correct! Heat always flows spontaneously from a higher temperature environment to a lower temperature object.'
    },
    answer: 1
  },
  {
    id: {
      q: '4. Bagaimana susunan dan pergerakan molekul ketika zat berubah wujud menjadi uap air (gas)?',
      options: [
        'Molekul tersusun rapi dan hanya bergetar di tempat',
        'Molekul berdekatan dan mengalir bebas',
        'Molekul sangat berjauhan dan bergerak sangat cepat acak',
        'Molekul diam dan membeku'
      ],
      expl: 'Benar! Pada wujud gas (uap), partikel saling berjauhan, ikatan molekul terputus, dan bergerak sangat cepat acak.'
    },
    en: {
      q: '4. How are molecules arranged and behaving when water transitions into water vapor (gas)?',
      options: [
        'Molecules are tightly arranged in regular rows vibrating in place',
        'Molecules remain close together flowing past one another',
        'Molecules are far apart and move rapidly in random directions',
        'Molecules become completely motionless and frozen'
      ],
      expl: 'Correct! In the gas phase (steam), molecules are far apart with broken intermolecular bonds and rapid, random movement.'
    },
    answer: 2
  },
  {
    id: {
      q: '5. Berdasarkan hukum kekekalan massa dan sifat anomali air, apa yang terjadi saat 100 gram es batu melebur seutuhnya menjadi air?',
      options: [
        'Massanya tetap 100 gram, tetapi volumenya sedikit menyusut (berkurang ~8,3%)',
        'Massanya berkurang karena sebagian partikel mencair, volumenya tetap',
        'Massanya bertambah karena menyerap banyak partikel kalor',
        'Massa dan volumenya berlipat ganda'
      ],
      expl: 'Luar biasa! Hukum kekekalan massa membuktikan massa materi selalu tetap (100 gram). Namun akibat anomali pemuaian air (kristal es berongga dengan massa jenis 0,92 g/cm³ lebih kecil dari air 1,0 g/cm³), volumenya sedikit menyusut sekitar 8,3%.'
    },
    en: {
      q: '5. According to the conservation of mass and the anomalous expansion of water, what happens when 100 grams of ice melts completely into liquid water?',
      options: [
        'Mass remains 100 grams, but volume shrinks slightly (~8.3% decrease)',
        'Mass decreases because some particles liquify while volume stays constant',
        'Mass increases because it absorbs many heat particles',
        'Both mass and volume double'
      ],
      expl: 'Excellent! The law of conservation of mass states that matter\'s mass remains conserved (100 grams). However, due to the anomaly of water (open hexagonal ice crystal lattice with lower density 0.92 g/cm³ vs liquid 1.0 g/cm³), its volume contracts by approximately 8.3%.'
    },
    answer: 0
  }
];

let userAnswers = {};

function renderQuiz() {
  const container = document.getElementById('quizContainer');
  if (!container) return;
  container.innerHTML = '';
  const lang = currentLang;

  quizData.forEach((item, qIdx) => {
    const localized = item[lang] || item.id;
    const card = document.createElement('div');
    card.className = 'bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700 space-y-1.5';

    const qTitle = document.createElement('p');
    qTitle.className = 'font-bold text-slate-800 dark:text-slate-100 text-xs';
    qTitle.textContent = localized.q;
    card.appendChild(qTitle);

    const optsDiv = document.createElement('div');
    optsDiv.className = 'space-y-1 mt-1';

    const isAnswered = userAnswers[qIdx] !== undefined;

    localized.options.forEach((opt, optIdx) => {
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
      const correctPrefix = lang === 'en' ? '✅ Correct!' : '✅ Benar!';
      const incorrectPrefix = lang === 'en' ? '❌ Incorrect.' : '❌ Kurang tepat.';
      fb.innerHTML = `<strong>${isCorrect ? correctPrefix : incorrectPrefix}</strong> ${localized.expl}`;
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
  applyLanguage();
  setZone('freezer');
  render();
  requestAnimationFrame(loop);
  lucide.createIcons();
});
