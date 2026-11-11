/**
 * ========================================================
 * SIMULASI KALOR & PERUBAHAN WUJUD ZAT
 * Laboratorium Virtual Interaktif IPA Kelas 7 SMP
 * ========================================================
 */

// --- KONSTANTA & DATABASE FISIKA MULTI-ZAT (SISTEM INTERNASIONAL) ---
const C_ES = 2100;       // Kalor jenis es: 2.100 J/(kg·°C)
const C_AIR = 4200;      // Kalor jenis air: 4.200 J/(kg·°C)
const C_UAP = 2000;      // Kalor jenis uap: 2.000 J/(kg·°C)
const L_LEBUR = 336000;  // Kalor laten lebur es: 336.000 J/kg
const U_UAP = 2260000;   // Kalor laten penguapan air: 2.260.000 J/kg

const SUBSTANCES = {
  air: {
    id: 'air',
    name: 'Air (H₂O)',
    nameEn: 'Water (H₂O)',
    formula: 'H₂O',
    type: 'melt_boil',
    density: 1.0,
    tMin: -20,
    tMax: 120,
    tBase: -20,
    tMelt: 0,
    tBoil: 100,
    cSolid: 2100,
    cLiquid: 4200,
    cGas: 2000,
    lMelt: 336000,
    lVapor: 2260000,
    defaultTemp: -10,
    tempPresetsId: [
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
      ]}
    ],
    tempPresetsEn: [
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
      ]}
    ]
  },
  besi: {
    id: 'besi',
    name: 'Besi (Fe)',
    nameEn: 'Iron (Fe)',
    formula: 'Fe',
    type: 'metal_incandescence',
    density: 7.87,
    tMin: -20,
    tMax: 1600,
    tBase: -10,
    tMelt: 1538,
    tBoil: 2862,
    cSolid: 450,       // Kalor jenis besi sangat kecil: 450 J/kg·°C (cepat panas!)
    cLiquid: 820,
    cGas: 600,
    lMelt: 247000,
    lVapor: 6090000,
    defaultTemp: 27,
    tempPresetsId: [
      { group: 'Padat Dingin / Ruang', options: [
        { val: '-10', text: '-10°C (Freezer)' },
        { val: '0', text: '0°C (Dingin)' },
        { val: '27', text: '27°C (Suhu Ruang)' }
      ]},
      { group: 'Pemanasan & Pijar Termal', options: [
        { val: '150', text: '150°C (Hangat)' },
        { val: '300', text: '300°C (Panas)' },
        { val: '550', text: '550°C (Pijar Merah Kusam)' },
        { val: '800', text: '800°C (Pijar Merah Cerah)' },
        { val: '1100', text: '1100°C (Pijar Oranye)' }
      ]},
      { group: 'Peleburan Logam (Tanur)', options: [
        { val: '1400', text: '1400°C (Pijar Kuning)' },
        { val: '1538', text: '1538°C (Titik Lebur Besi)' },
        { val: '1600', text: '1600°C (Besi Cair Molten)' }
      ]}
    ],
    tempPresetsEn: [
      { group: 'Cold / Room Temp', options: [
        { val: '-10', text: '-10°C (Freezer)' },
        { val: '0', text: '0°C (Cold)' },
        { val: '27', text: '27°C (Room Temp)' }
      ]},
      { group: 'Thermal Heating', options: [
        { val: '150', text: '150°C (Warm)' },
        { val: '300', text: '300°C (Hot)' },
        { val: '550', text: '550°C (Dull Red Glow)' },
        { val: '800', text: '800°C (Cherry Red Glow)' },
        { val: '1100', text: '1100°C (Bright Orange Glow)' }
      ]},
      { group: 'Smelting Phase', options: [
        { val: '1400', text: '1400°C (Incandescent Yellow)' },
        { val: '1538', text: '1538°C (Iron Melting Point)' },
        { val: '1600', text: '1600°C (Molten Liquid Iron)' }
      ]}
    ]
  },
  mentega: {
    id: 'mentega',
    name: 'Mentega (Butter)',
    nameEn: 'Butter',
    formula: 'Lemak / Lipid',
    type: 'melt_boil',
    density: 0.91,
    tMin: -10,
    tMax: 130,
    tBase: -10,
    tMelt: 34,
    tBoil: 120,
    cSolid: 2000,
    cLiquid: 2200,
    cGas: 1800,
    lMelt: 150000,
    lVapor: 1200000,
    defaultTemp: 10,
    tempPresetsId: [
      { group: 'Padat (Kulkas / Ruang)', options: [
        { val: '-10', text: '-10°C (Freezer Keras)' },
        { val: '0', text: '0°C (Kulkas Dingin)' },
        { val: '10', text: '10°C (Mentega Dingin)' },
        { val: '20', text: '20°C (Mentega Sejuk)' },
        { val: '27', text: '27°C (Suhu Ruang/Lunak)' },
        { val: '34', text: '34°C (Titik Lebur Mentega)' }
      ]},
      { group: 'Cair (Lelehan Emas)', options: [
        { val: '40', text: '40°C (Mulai Melebur)' },
        { val: '50', text: '50°C (Mentega Cair Hangat)' },
        { val: '70', text: '70°C (Mentega Cair Panas)' },
        { val: '90', text: '90°C (Sangat Panas)' },
        { val: '110', text: '110°C (Mendidih / Berasap)' }
      ]}
    ],
    tempPresetsEn: [
      { group: 'Solid (Chilled / Room)', options: [
        { val: '-10', text: '-10°C (Freezer Solid)' },
        { val: '0', text: '0°C (Fridge Chilled)' },
        { val: '10', text: '10°C (Cold Butter)' },
        { val: '20', text: '20°C (Cool Butter)' },
        { val: '27', text: '27°C (Room Temp / Soft)' },
        { val: '34', text: '34°C (Melting Point)' }
      ]},
      { group: 'Liquid (Golden Melted)', options: [
        { val: '40', text: '40°C (Melting)' },
        { val: '50', text: '50°C (Warm Liquid Butter)' },
        { val: '70', text: '70°C (Hot Liquid Butter)' },
        { val: '90', text: '90°C (Very Hot)' },
        { val: '110', text: '110°C (Boiling / Sizzling)' }
      ]}
    ]
  }
};

// --- STATE UTAMA SIMULASI ---
const state = {
  substance: 'air',      // 'air' (H₂O), 'besi' (Fe), 'mentega' (Butter)
  mass: 0.1,             // Massa zat (kg) -> default 100 gram
  initialTemp: -10.0,    // Suhu awal zat (°C)
  temp: -10.0,           // Suhu zat saat ini (°C)
  curveQ: 0,             // Koordinat entalpi pada kurva termodinamika fase zat (Joule)
  heatTotal: 0,          // Total kalor proses yang berpindah sejak awal percobaan (Joule, selalu mulai 0)
  zone: 'freezer',       // 'freezer' (-10°C), 'suhuRuang' (27°C), 'kompor' (150°C / Tanur)
  flameLevel: 2,         // Intensitas api kompor: 1 (Kecil), 2 (Sedang), 3 (Besar)
  speed: 1,              // Laju kecepatan simulasi: 1x, 2x, 5x
  isPlaying: false,      // Status jalan / jeda
  simTime: 0,            // Waktu proses simulasi berjalan (detik)
  lastTimestamp: null,
  meltProgress: 0,       // 0 (padat) s/d 1 (lebur / sublim total)
  vaporProgress: 0,      // 0 (cair/padat) s/d 1 (gas penuh)
  particles: [],         // Partikel molekul mikroskopis
  steamParticles: [],    // Partikel uap / gas yang naik
  bubbles: [],           // Gelembung saat mendidih
  sparks: []             // Percikan api pendaran logam besi
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
    labelSubstance: 'Zat:',
    substanceAir: '💧 Air (H₂O)',
    substanceBesi: '⚙️ Besi (Fe)',
    substanceMentega: '🧈 Mentega',
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
      ]}
    ],
    labelMass: 'Massa:',
    labelSpeed: 'Laju:',
    badgeHeatAbsorbed: 'Kalor Diserap (+Q)',
    badgeHeatReleased: 'Kalor Dilepaskan (-Q)',
    badgeHeatEquilibrium: 'Setimbang Termal (Q Konstan)',
    statLabelTemp: 'Suhu Zat (<span class="italic font-serif font-bold">T</span>)',
    statLabelHeat: 'Kalor (<span class="italic font-serif font-bold">Q</span>)',
    statLabelHeatAbsorbed: 'Kalor Diserap (<span class="italic font-serif font-bold">+Q</span>)',
    statLabelHeatReleased: 'Kalor Dilepaskan (<span class="italic font-serif font-bold">-Q</span>)',
    statLabelHeatEquilibrium: 'Kalor (<span class="italic font-serif font-bold">Q Netto = 0</span>)',
    heatDirectionAbsorbed: 'Energi Masuk ke Zat',
    heatDirectionReleased: 'Energi Keluar ke Lingkungan',
    heatDirectionEquilibrium: 'Tidak Ada Kalor Mengalir',
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
    navMission: 'Misi &amp; Tugas',
    titleMission: 'Langkah-Langkah Misi &amp; Tugas Isian Singkat',
    modalMisiTitle: 'Misi Eksperimen &amp; Lembar Tugas Siswa',
    modalMisiSubtitle: 'Petunjuk Penyelidikan Laboratorium &amp; Lembar Evaluasi Isian',
    missionScoreBadgeLabel: 'Skor:',
    txtTabSteps: '1. Langkah-Langkah Misi',
    txtTabTasks: '2. Lembar Tugas Isian Singkat',
    taskCountBadge: '10 Soal',
    missionIntroText: 'Ikuti langkah-langkah misi laboratorium di bawah ini menggunakan panel simulasi di layar utama. Catat hasil pengamatanmu untuk menjawab <b>Lembar Tugas Isian Singkat</b> pada tab berikutnya!',
    missionCard1Title: 'Misi 1: Menyelidiki Titik Leleh (Lebur) Air',
    missionCard1Desc: 'Atur zat ke <b>Air (H₂O)</b> dan suhu awal ke <b>-10°C (Standar)</b>. Geser slider <b>Kalor Diberikan (Q)</b> perlahan ke kanan. Perhatikan pada suhu berapa grafik membentuk <b>garis mendatar</b> pertama (suhu tidak naik saat es melebur menjadi air cair).',
    missionCard1Goal: 'Target: Temukan suhu konstan saat peleburan es berlangsung (°C).',
    missionCard2Title: 'Misi 2: Menyelidiki Titik Didih Air',
    missionCard2Desc: 'Lanjutkan pemanasan kalor hingga air mencapai <b>garis mendatar kedua</b> pada grafik kalor di mana air cair bergejolak dan menguap menjadi gas (uap air). Amati suhu pada termometer digital.',
    missionCard2Goal: 'Target: Temukan suhu konstan saat air mendidih (°C).',
    missionCard3Title: 'Misi 3: Mengamati Perilaku Mikroskopis Partikel',
    missionCard3Desc: 'Amati panel <b>Partikel Mikroskopis</b> di samping wadah zat. Saat kalor terus diserap dari es dingin (-10°C) hingga menjadi uap (110°C), amati apakah getaran partikel semakin lambat atau cepat, dan apakah jarak antar partikel semakin rapat atau renggang/berjauhan.',
    missionCard3Goal: 'Target: Simpulkan perubahan kecepatan gerak &amp; jarak antar molekul.',
    missionCard4Title: 'Misi 4: Memahami 6 Istilah Perubahan Wujud Zat',
    missionCard4Desc: 'Klik tombol <b>Info Proses</b> atau amati diagram perubahan wujud. Pelajari 6 istilah proses: saat menyerap kalor (padat&rarr;cair, cair&rarr;gas, padat&rarr;gas) dan saat melepas kalor (cair&rarr;padat, gas&rarr;cair, gas&rarr;padat).',
    missionCard4Goal: 'Target: Kuasai 6 istilah (melebur, menguap, menyublim, membeku, mengembun, mengkristal).',
    btnGoToWorksheetText: 'Lanjut ke Lembar Tugas Isian',
    titleSec1: 'Bagian 1: Titik Leleh &amp; Titik Didih Air',
    lblQ1_1: 'Titik leleh air adalah',
    lblQ1_2: '°C, sedangkan titik didih air adalah',
    lblQ1_3: '°C.',
    titleSec2: 'Bagian 2: Perilaku Partikel Saat Kalor Diserap',
    lblQ2_1: 'Jika suatu zat menyerap kalor, maka partikel-partikel penyusun zat tersebut akan bergerak semakin',
    lblQ2_2: 'dan jarak antar partikelnya menjadi semakin',
    lblQ2_3: '.',
    titleSec3: 'Bagian 3: Istilah Proses Perubahan Wujud Zat',
    lblQ3_1: 'Perubahan dari <b>padat &rarr; cair</b>:',
    lblQ3_2: 'Perubahan dari <b>cair &rarr; gas</b>:',
    lblQ3_3: 'Perubahan dari <b>padat &rarr; gas</b>:',
    lblQ3_4: 'Perubahan dari <b>cair &rarr; padat</b>:',
    lblQ3_5: 'Perubahan dari <b>gas &rarr; cair</b>:',
    lblQ3_6: 'Perubahan dari <b>gas &rarr; padat</b>:',
    txtResetMission: 'Reset',
    txtCopyMission: 'Salin Hasil',
    txtCheckMission: 'Periksa Jawaban',
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
    labelSubstance: 'Substance:',
    substanceAir: '💧 Water (H₂O)',
    substanceBesi: '⚙️ Iron (Fe)',
    substanceMentega: '🧈 Butter',
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
      ]}
    ],
    labelMass: 'Mass:',
    labelSpeed: 'Speed:',
    badgeHeatAbsorbed: 'Heat Absorbed (+Q)',
    badgeHeatReleased: 'Heat Released (-Q)',
    badgeHeatEquilibrium: 'Thermal Equilibrium',
    statLabelTemp: 'Temperature (<span class="italic font-serif font-bold">T</span>)',
    statLabelHeat: 'Heat (<span class="italic font-serif font-bold">Q</span>)',
    statLabelHeatAbsorbed: 'Heat Absorbed (<span class="italic font-serif font-bold">+Q</span>)',
    statLabelHeatReleased: 'Heat Released (<span class="italic font-serif font-bold">-Q</span>)',
    statLabelHeatEquilibrium: 'Heat (<span class="italic font-serif font-bold">Net Q = 0</span>)',
    heatDirectionAbsorbed: 'Energy Entering Substance',
    heatDirectionReleased: 'Energy Escaping to Ambient',
    heatDirectionEquilibrium: 'No Net Heat Transfer',
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
    navMission: 'Missions &amp; Tasks',
    titleMission: 'Guided Lab Missions &amp; Fill-in Worksheet',
    modalMisiTitle: 'Lab Missions &amp; Student Worksheet',
    modalMisiSubtitle: 'Guided Inquiry Steps &amp; Fill-in-the-Blank Concept Tasks',
    missionScoreBadgeLabel: 'Score:',
    txtTabSteps: '1. Guided Lab Missions',
    txtTabTasks: '2. Fill-in-the-Blank Tasks',
    taskCountBadge: '10 Tasks',
    missionIntroText: 'Follow the guided laboratory steps below using the simulation controls on the main screen. Note your observations to complete the <b>Fill-in Worksheet</b> on the next tab!',
    missionCard1Title: 'Mission 1: Investigating the Melting Point of Water',
    missionCard1Desc: 'Set substance to <b>Water (H₂O)</b> and initial temperature to <b>-10°C (Standard)</b>. Slowly drag the <b>Heat Added (Q)</b> slider to the right. Observe the temperature at which the graph forms its first <b>horizontal plateau</b> (temperature does not rise while ice melts into water).',
    missionCard1Goal: 'Goal: Find the constant melting plateau temperature (°C).',
    missionCard2Title: 'Mission 2: Investigating the Boiling Point of Water',
    missionCard2Desc: 'Continue heating until the graph reaches the <b>second horizontal plateau</b> where boiling liquid vigorously changes into steam (gas). Note the digital thermometer reading.',
    missionCard2Goal: 'Goal: Find the constant boiling plateau temperature (°C).',
    missionCard3Title: 'Mission 3: Observing Microscopic Particle Dynamics',
    missionCard3Desc: 'Watch the <b>Microscopic Particles</b> container next to the vessel. As heat is absorbed from cold ice (-10°C) to hot steam (110°C), observe whether particle agitation becomes slower or faster, and whether particle distance becomes denser or looser/farther apart.',
    missionCard3Goal: 'Goal: Conclude particle movement velocity &amp; intermolecular distance.',
    missionCard4Title: 'Mission 4: Mastering 6 Phase Change Terms',
    missionCard4Desc: 'Click the <b>Process Info</b> button or study the phase diagram. Learn the 6 core scientific terms: heat absorption (solid&rarr;liquid, liquid&rarr;gas, solid&rarr;gas) and heat release cooling (liquid&rarr;solid, gas&rarr;liquid, gas&rarr;solid).',
    missionCard4Goal: 'Goal: Master the 6 terms (melting, vaporization, sublimation, freezing, condensation, deposition).',
    btnGoToWorksheetText: 'Go to Fill-in Worksheet',
    titleSec1: 'Part 1: Melting &amp; Boiling Points of Water',
    lblQ1_1: 'The melting point of water is',
    lblQ1_2: '°C, while the boiling point of water is',
    lblQ1_3: '°C.',
    titleSec2: 'Part 2: Particle Behavior When Heat is Absorbed',
    lblQ2_1: 'When a substance absorbs heat, its constituent particles will move increasingly',
    lblQ2_2: 'and the distance between particles becomes increasingly',
    lblQ2_3: '.',
    titleSec3: 'Part 3: Scientific Names for 6 Phase Changes',
    lblQ3_1: 'Phase change from <b>solid &rarr; liquid</b> is called:',
    lblQ3_2: 'Phase change from <b>liquid &rarr; gas</b> is called:',
    lblQ3_3: 'Phase change from <b>solid &rarr; gas</b> is called:',
    lblQ3_4: 'Phase change from <b>liquid &rarr; solid</b> is called:',
    lblQ3_5: 'Phase change from <b>gas &rarr; liquid</b> is called:',
    lblQ3_6: 'Phase change from <b>gas &rarr; solid</b> is called:',
    txtResetMission: 'Reset',
    txtCopyMission: 'Copy Summary',
    txtCheckMission: 'Check Answers',
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
  if (zoneTextKompor) {
    if (state.substance === 'besi') {
      zoneTextKompor.textContent = lang === 'en' ? 'Furnace' : 'Tanur';
    } else {
      zoneTextKompor.textContent = t.zoneKompor;
    }
  }
  const zoneSubKompor = document.querySelector('#zoneBtnKompor span.text-\\[9px\\]');
  if (zoneSubKompor) {
    zoneSubKompor.textContent = state.substance === 'besi' ? '(1600\u00B0C)' : '(150\u00B0C)';
  }

  const labelFlame = document.getElementById('labelFlame');
  if (labelFlame) labelFlame.textContent = t.labelFlame;

  const btnFlame1 = document.getElementById('btnFlame1');
  if (btnFlame1) btnFlame1.textContent = t.flameLow;

  const btnFlame2 = document.getElementById('btnFlame2');
  if (btnFlame2) btnFlame2.textContent = t.flameMed;

  const btnFlame3 = document.getElementById('btnFlame3');
  if (btnFlame3) btnFlame3.textContent = t.flameHigh;

  const labelParticles = document.getElementById('labelParticles');
  if (labelParticles) {
    if (state.substance === 'besi') {
      labelParticles.innerHTML = lang === 'en' ? 'Iron (Fe) Atoms:' : 'Atom Besi (Fe):';
    } else if (state.substance === 'mentega') {
      labelParticles.innerHTML = lang === 'en' ? 'Lipid / Fat Molecules:' : 'Molekul Lemak (Lipid):';
    } else {
      labelParticles.innerHTML = t.labelParticles;
    }
  }

  // Controls Toolbar
  const playLabel = document.getElementById('playLabel');
  if (playLabel) {
    playLabel.textContent = state.isPlaying
      ? t.btnPause
      : (state.heatTotal > 0 ? t.btnResume : t.btnStart);
  }

  const labelSubstance = document.getElementById('labelSubstance');
  if (labelSubstance) labelSubstance.textContent = t.labelSubstance;

  const substanceSelect = document.getElementById('substanceSelect');
  if (substanceSelect) {
    const curSub = state.substance;
    substanceSelect.innerHTML = `
      <option value="air"${curSub === 'air' ? ' selected' : ''}>${t.substanceAir}</option>
      <option value="besi"${curSub === 'besi' ? ' selected' : ''}>${t.substanceBesi}</option>
      <option value="mentega"${curSub === 'mentega' ? ' selected' : ''}>${t.substanceMentega}</option>
    `;
  }

  const labelInitialTemp = document.getElementById('labelInitialTemp');
  if (labelInitialTemp) labelInitialTemp.textContent = t.labelInitialTemp;

  updateTempPresetsUI();

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

  // Mission & Tasks Navigation & Modal Texts
  const navMission = document.getElementById('navMission');
  if (navMission) navMission.innerHTML = t.navMission;
  const btnMission = document.getElementById('btnMission');
  if (btnMission) btnMission.title = t.titleMission;

  const modalMisiTitle = document.getElementById('modalMisiTitle');
  if (modalMisiTitle) modalMisiTitle.innerHTML = t.modalMisiTitle;
  const modalMisiSubtitle = document.getElementById('modalMisiSubtitle');
  if (modalMisiSubtitle) modalMisiSubtitle.innerHTML = t.modalMisiSubtitle;
  const missionScoreLabel = document.getElementById('missionScoreLabel');
  if (missionScoreLabel) missionScoreLabel.textContent = t.missionScoreBadgeLabel;
  const txtTabSteps = document.getElementById('txtTabSteps');
  if (txtTabSteps) txtTabSteps.innerHTML = t.txtTabSteps;
  const txtTabTasks = document.getElementById('txtTabTasks');
  if (txtTabTasks) txtTabTasks.innerHTML = t.txtTabTasks;
  const taskCountBadge = document.getElementById('taskCountBadge');
  if (taskCountBadge) taskCountBadge.textContent = t.taskCountBadge;
  const missionIntroText = document.getElementById('missionIntroText');
  if (missionIntroText) missionIntroText.innerHTML = t.missionIntroText;

  const missionCard1Title = document.getElementById('missionCard1Title');
  if (missionCard1Title) missionCard1Title.innerHTML = t.missionCard1Title;
  const missionCard1Desc = document.getElementById('missionCard1Desc');
  if (missionCard1Desc) missionCard1Desc.innerHTML = t.missionCard1Desc;
  const missionCard1Goal = document.getElementById('missionCard1Goal');
  if (missionCard1Goal) missionCard1Goal.innerHTML = t.missionCard1Goal;

  const missionCard2Title = document.getElementById('missionCard2Title');
  if (missionCard2Title) missionCard2Title.innerHTML = t.missionCard2Title;
  const missionCard2Desc = document.getElementById('missionCard2Desc');
  if (missionCard2Desc) missionCard2Desc.innerHTML = t.missionCard2Desc;
  const missionCard2Goal = document.getElementById('missionCard2Goal');
  if (missionCard2Goal) missionCard2Goal.innerHTML = t.missionCard2Goal;

  const missionCard3Title = document.getElementById('missionCard3Title');
  if (missionCard3Title) missionCard3Title.innerHTML = t.missionCard3Title;
  const missionCard3Desc = document.getElementById('missionCard3Desc');
  if (missionCard3Desc) missionCard3Desc.innerHTML = t.missionCard3Desc;
  const missionCard3Goal = document.getElementById('missionCard3Goal');
  if (missionCard3Goal) missionCard3Goal.innerHTML = t.missionCard3Goal;

  const missionCard4Title = document.getElementById('missionCard4Title');
  if (missionCard4Title) missionCard4Title.innerHTML = t.missionCard4Title;
  const missionCard4Desc = document.getElementById('missionCard4Desc');
  if (missionCard4Desc) missionCard4Desc.innerHTML = t.missionCard4Desc;
  const missionCard4Goal = document.getElementById('missionCard4Goal');
  if (missionCard4Goal) missionCard4Goal.innerHTML = t.missionCard4Goal;

  const btnGoToWorksheetText = document.getElementById('btnGoToWorksheetText');
  if (btnGoToWorksheetText) btnGoToWorksheetText.textContent = t.btnGoToWorksheetText;

  const titleSec1 = document.getElementById('titleSec1');
  if (titleSec1) titleSec1.innerHTML = t.titleSec1;
  const lblQ1_1 = document.getElementById('lblQ1_1');
  if (lblQ1_1) lblQ1_1.innerHTML = t.lblQ1_1;
  const lblQ1_2 = document.getElementById('lblQ1_2');
  if (lblQ1_2) lblQ1_2.innerHTML = t.lblQ1_2;
  const lblQ1_3 = document.getElementById('lblQ1_3');
  if (lblQ1_3) lblQ1_3.innerHTML = t.lblQ1_3;

  const titleSec2 = document.getElementById('titleSec2');
  if (titleSec2) titleSec2.innerHTML = t.titleSec2;
  const lblQ2_1 = document.getElementById('lblQ2_1');
  if (lblQ2_1) lblQ2_1.innerHTML = t.lblQ2_1;
  const lblQ2_2 = document.getElementById('lblQ2_2');
  if (lblQ2_2) lblQ2_2.innerHTML = t.lblQ2_2;
  const lblQ2_3 = document.getElementById('lblQ2_3');
  if (lblQ2_3) lblQ2_3.innerHTML = t.lblQ2_3;

  const titleSec3 = document.getElementById('titleSec3');
  if (titleSec3) titleSec3.innerHTML = t.titleSec3;
  const lblQ3_1 = document.getElementById('lblQ3_1');
  if (lblQ3_1) lblQ3_1.innerHTML = t.lblQ3_1;
  const lblQ3_2 = document.getElementById('lblQ3_2');
  if (lblQ3_2) lblQ3_2.innerHTML = t.lblQ3_2;
  const lblQ3_3 = document.getElementById('lblQ3_3');
  if (lblQ3_3) lblQ3_3.innerHTML = t.lblQ3_3;
  const lblQ3_4 = document.getElementById('lblQ3_4');
  if (lblQ3_4) lblQ3_4.innerHTML = t.lblQ3_4;
  const lblQ3_5 = document.getElementById('lblQ3_5');
  if (lblQ3_5) lblQ3_5.innerHTML = t.lblQ3_5;
  const lblQ3_6 = document.getElementById('lblQ3_6');
  if (lblQ3_6) lblQ3_6.innerHTML = t.lblQ3_6;

  const txtResetMission = document.getElementById('txtResetMission');
  if (txtResetMission) txtResetMission.textContent = t.txtResetMission;
  const txtCopyMission = document.getElementById('txtCopyMission');
  if (txtCopyMission) txtCopyMission.textContent = t.txtCopyMission;
  const txtCheckMission = document.getElementById('txtCheckMission');
  if (txtCheckMission) txtCheckMission.textContent = t.txtCheckMission;

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
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;
  const tBase = Math.min(sub.tBase, typeof initT === 'number' ? initT : sub.tBase);

  if (sub.type === 'melt_boil') {
    // 1. AIR (H₂O)
    const deltaT_es = Math.max(0, sub.tMelt - tBase);
    const q1 = mass * sub.cSolid * deltaT_es;
    const q2 = q1 + mass * sub.lMelt;
    const q3 = q2 + mass * sub.cLiquid * (sub.tBoil - sub.tMelt);
    const q4 = q3 + mass * sub.lVapor;
    const q5 = q4 + mass * sub.cGas * (sub.tMax - sub.tBoil);
    return { q1, q2, q3, q4, q5, tBase, sub };
  } else if (sub.type === 'metal_incandescence') {
    // 2. BESI (Fe)
    const deltaT_solid = Math.max(0, sub.tMelt - tBase);
    const q1 = mass * sub.cSolid * deltaT_solid;
    const q2 = q1 + mass * sub.lMelt;
    const q3 = q2 + mass * sub.cLiquid * (sub.tMax - sub.tMelt);
    const q4 = q3;
    const q5 = q3;
    return { q1, q2, q3, q4, q5, tBase, sub };
  } else {
    // 3. LAINNYA / GENERAL SUBLIMATION FALLBACK
    const deltaT_solid = Math.max(0, (sub.tSublim || sub.tMelt) - tBase);
    const q1 = mass * sub.cSolid * deltaT_solid;
    const q2 = q1 + mass * (sub.lSublim || sub.lMelt);
    const q3 = q2 + mass * sub.cGas * (sub.tMax - (sub.tSublim || sub.tMelt));
    const q4 = q3;
    const q5 = q3;
    return { q1, q2, q3, q4, q5, tBase, sub };
  }
}

// --- PERHITUNGAN STATUS TERMAL AWAL BERDASARKAN SUHU AWAL ---
function getInitialThermalState(initT, mass) {
  const landmarks = getLandmarks(mass, initT);
  const sub = landmarks.sub;
  const m = mass;
  const tBase = landmarks.tBase;

  if (sub.type === 'melt_boil') {
    // Air (H₂O) & Mentega (Butter)
    if (initT < sub.tMelt) {
      const q = m * sub.cSolid * (initT - tBase);
      return { temp: initT, curveQ: q, heatTotal: 0, meltProgress: 0, vaporProgress: 0 };
    } else if (initT === sub.tMelt) {
      return { temp: sub.tMelt, curveQ: landmarks.q1, heatTotal: 0, meltProgress: 0, vaporProgress: 0 };
    } else if (initT > sub.tMelt && initT < sub.tBoil) {
      const q = landmarks.q2 + m * sub.cLiquid * (initT - sub.tMelt);
      return { temp: initT, curveQ: q, heatTotal: 0, meltProgress: 1.0, vaporProgress: 0.0 };
    } else if (initT === sub.tBoil) {
      return { temp: sub.tBoil, curveQ: landmarks.q3, heatTotal: 0, meltProgress: 1.0, vaporProgress: 0.0 };
    } else {
      const q = landmarks.q4 + m * sub.cGas * (initT - sub.tBoil);
      return { temp: Math.min(sub.tMax, initT), curveQ: Math.min(landmarks.q5, q), heatTotal: 0, meltProgress: 1.0, vaporProgress: 1.0 };
    }
  } else if (sub.type === 'metal_incandescence') {
    // Besi (Fe)
    if (initT < sub.tMelt) {
      const q = m * sub.cSolid * (initT - tBase);
      return { temp: initT, curveQ: q, heatTotal: 0, meltProgress: 0, vaporProgress: 0 };
    } else if (initT === sub.tMelt) {
      return { temp: sub.tMelt, curveQ: landmarks.q1, heatTotal: 0, meltProgress: 0, vaporProgress: 0 };
    } else {
      const q = landmarks.q2 + m * sub.cLiquid * (initT - sub.tMelt);
      return { temp: Math.min(sub.tMax, initT), curveQ: Math.min(landmarks.q5, q), heatTotal: 0, meltProgress: 1.0, vaporProgress: 0 };
    }
  } else {
    // Fallback Sublimasi
    const tSub = sub.tSublim || 80;
    if (initT < tSub) {
      const q = m * sub.cSolid * (initT - tBase);
      return { temp: initT, curveQ: q, heatTotal: 0, meltProgress: 0, vaporProgress: 0 };
    } else if (initT === tSub) {
      return { temp: tSub, curveQ: landmarks.q1, heatTotal: 0, meltProgress: 0, vaporProgress: 0 };
    } else {
      const q = landmarks.q2 + m * sub.cGas * (initT - tSub);
      return { temp: Math.min(sub.tMax, initT), curveQ: Math.min(landmarks.q5, q), heatTotal: 0, meltProgress: 1.0, vaporProgress: 1.0 };
    }
  }
}

// --- INISIALISASI MOLEKUL MIKROSKOPIS ---
function initParticles() {
  state.particles = [];
  // Grid 8×5 = 40 partikel, disesuaikan untuk canvas 120×68
  for (let i = 0; i < 40; i++) {
    const col = i % 8;
    const row = Math.floor(i / 8);
    const baseX = 10 + col * 13.5 + (row % 2) * 6.5;
    const baseY = 8 + row * 11.5;
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

// --- HELPER FISIKA: PERHITUNGAN MASSA & VOLUME (MULTI-ZAT) ---
function getMassAndVolume() {
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;
  const massG = Math.round(state.mass * 1000); // 50, 100, 200 gram
  const rho = sub.density;

  const meltFrac = Math.min(1, Math.max(0, state.meltProgress));
  const vaporFrac = Math.min(1, Math.max(0, state.vaporProgress));

  if (sub.id === 'air') {
    const rhoIce = 0.917;
    const rhoWater = 1.000;
    const iceMass = massG * (1 - meltFrac) * (1 - vaporFrac);
    const waterMass = massG * meltFrac * (1 - vaporFrac);
    const totalMass = iceMass + waterMass;
    const iceVol = iceMass / rhoIce;
    const waterVol = waterMass / rhoWater;
    const totalVol = iceVol + waterVol;
    const initialIceVol = massG / rhoIce;
    const finalWaterVol = massG / rhoWater;
    const shrinkagePercent = ((initialIceVol - finalWaterVol) / initialIceVol * 100).toFixed(1);
    return { massG, iceMass, waterMass, totalMass, iceVol, waterVol, totalVol, initialIceVol, finalWaterVol, shrinkagePercent };
  } else if (sub.id === 'besi') {
    const solidMass = massG * (1 - meltFrac);
    const moltenMass = massG * meltFrac;
    const totalMass = massG;
    const solidVol = solidMass / rho;
    const moltenVol = moltenMass / (rho * 0.96);
    const totalVol = solidVol + moltenVol;
    return { massG, iceMass: 0, waterMass: 0, solidMass, moltenMass, totalMass, totalVol, waterVol: 0 };
  } else {
    // Mentega (Butter)
    const solidMass = massG * (1 - meltFrac) * (1 - vaporFrac);
    const liquidMass = massG * meltFrac * (1 - vaporFrac);
    const totalMass = solidMass + liquidMass;
    const solidVol = solidMass / 0.92;
    const liquidVol = liquidMass / 0.90;
    const totalVol = solidVol + liquidVol;
    return { massG, iceMass: 0, waterMass: 0, solidMass, liquidMass, totalMass, totalVol, waterVol: 0 };
  }
}

// --- SISTEM INFORMASI PROSES KALOR & KALOR LATEN DINAMIS ---
let isProcessInfoOpen = false;
let lastProcessStageKey = '';
let lastHeatFlowMode = '';

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
  if (state.zone === 'freezer' && state.temp > -9.95) return true;
  if (state.zone === 'suhuRuang' && state.temp > 27.2) return true;
  return false;
}

function getProcessInfoData() {
  const landmarks = getLandmarks(state.mass, state.initialTemp);
  const sub = landmarks.sub;
  const Q = state.curveQ;
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

  // ========================================================
  // SUBSTANCE: BESI (Fe)
  // ========================================================
  if (sub.id === 'besi') {
    if (lang === 'en') {
      if (zone === 'freezer') {
        if (T <= -9.9 && Q <= 0.05) {
          title = 'Thermal Equilibrium in Freezer';
          badge = 'Stable Temp -10°C';
          badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
          icon = 'snowflake';
          text = `
            <div>• <strong>Phase:</strong> Solid Iron (Fe).</div>
            <div>• <strong>Heat Flow:</strong> None (ΔT = 0).</div>
            <div>• <strong>Concept:</strong> Iron ingot temperature is in equilibrium with freezer at -10°C.</div>
          `;
        } else if (Q >= landmarks.q1) {
          const pctFreeze = Math.round((1 - state.meltProgress) * 100);
          title = 'Molten Iron Freezing in Freezer (1,538°C)';
          badge = `Freezing: ${pctFreeze}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Phase:</strong> Transition Liquid &rarr; Solid (Freezing Point 1,538°C).</div>
            <div>• <strong>Heat Flow:</strong> Releases Latent Heat of Fusion (<i>Q = m·L</i> = 247 kJ/kg).</div>
            <div>• <strong>Concept:</strong> Temperature stays locked at 1,538°C as molten iron releases latent heat until fully solidified into crystalline iron.</div>
          `;
        } else {
          title = 'Iron Ingot Cooling in Freezer';
          badge = `Cooling: ${T.toFixed(0)}°C`;
          badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
          icon = 'snowflake';
          text = `
            <div>• <strong>Phase:</strong> Solid (Cooling rapidly toward -10°C).</div>
            <div>• <strong>Heat Flow:</strong> Releases Sensible Heat (<i>Q = m·c<sub>Fe</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Solid iron cools down rapidly due to low specific heat (450 J/kg·°C). Thermal incandescence glow completely fades.</div>
          `;
        }
      } else if (zone === 'suhuRuang') {
        if (Q >= landmarks.q1) {
          const pctFreeze = Math.round((1 - state.meltProgress) * 100);
          title = 'Molten Iron Solidifying at Room Temp (1,538°C)';
          badge = `Solidifying: ${pctFreeze}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Phase:</strong> Transition Liquid &rarr; Solid (1,538°C).</div>
            <div>• <strong>Heat Flow:</strong> Releases Latent Heat of Fusion (<i>Q = m·L</i> = 247 kJ/kg).</div>
            <div>• <strong>Concept:</strong> Liquid iron solidifies into solid iron ingot while radiating immense heat into 27°C room air.</div>
          `;
        } else if (T > 28) {
          title = 'Hot Iron Cooling to Room Temp';
          badge = `Cooling: ${T.toFixed(0)}°C`;
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'wind';
          text = `
            <div>• <strong>Phase:</strong> Solid (Natural convective & radiative cooling).</div>
            <div>• <strong>Heat Flow:</strong> Releases Sensible Heat (<i>Q = m·c<sub>Fe</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Heat flows spontaneously from hot iron into 27°C ambient air until thermal equilibrium is restored.</div>
          `;
        } else if (T >= 26 && T <= 28) {
          title = 'Thermal Equilibrium at Room Temp';
          badge = 'Stable Temp 27°C';
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'check-circle';
          text = `
            <div>• <strong>Phase:</strong> Solid Iron (Stable at 27°C).</div>
            <div>• <strong>Heat Flow:</strong> Zero net transfer (iron temp = 27°C).</div>
            <div>• <strong>Concept:</strong> Iron ingot is in thermal equilibrium with surrounding room air.</div>
          `;
        } else {
          title = 'Cold Iron Warming to Room Temp';
          badge = `Warming: ${T.toFixed(0)}°C`;
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'thermometer-sun';
          text = `
            <div>• <strong>Phase:</strong> Solid Iron (Absorbing room heat).</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>Fe</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Cold iron ingot absorbs ambient heat until reaching 27°C room temperature.</div>
          `;
        }
      } else if (zone === 'kompor') {
        const flameTxt = state.flameLevel === 1 ? 'Low' : (state.flameLevel === 2 ? 'Med' : 'High');
        if (T < 500) {
          title = 'Solid Iron Heating: Fast Temp Rise';
          badge = `Torch ${flameTxt} (${T.toFixed(0)}°C)`;
          badgeClass = 'bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800';
          icon = 'flame';
          text = `
            <div>• <strong>Phase:</strong> Solid (Rapid sensible heating).</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>Fe</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Specific heat of iron (450 J/kg·°C) is ~9.3× smaller than water, causing temperature to surge rapidly.</div>
          `;
        } else if (T >= 500 && T < 900) {
          title = 'Thermal Incandescence: Red Glow (Blackbody Radiation)';
          badge = `Red Glow: ${T.toFixed(0)}°C`;
          badgeClass = 'bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800';
          icon = 'flame';
          text = `
            <div>• <strong>Phase:</strong> Solid (Incandescent dark to cherry red glow).</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>Fe</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> As temperature exceeds 500°C, thermal blackbody radiation shifts into visible red light. Atomic vibrations intensify.</div>
          `;
        } else if (T >= 900 && T < 1538) {
          title = 'Thermal Incandescence: Bright Orange & Yellow';
          badge = `Orange/Yellow: ${T.toFixed(0)}°C`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'sun';
          text = `
            <div>• <strong>Phase:</strong> Solid (Bright incandescent yellow-hot glow).</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>Fe</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Per Wien's Displacement Law, peak emission shifts to higher frequencies, glowing intense orange to incandescent yellow.</div>
          `;
        } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
          const pctMelt = Math.round(state.meltProgress * 100);
          title = 'Iron Smelting at Melting Point (1,538°C)';
          badge = `Smelting: ${pctMelt}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Phase:</strong> Transition Solid &rarr; Liquid (Melting Point 1,538°C).</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Latent Heat of Fusion (<i>Q = m·L</i> = 247 kJ/kg).</div>
            <div>• <strong>Concept:</strong> Temperature is locked at 1,538°C while metallic crystal bonds break apart into liquid molten pool.</div>
          `;
        } else {
          title = 'Fully Molten Liquid Iron (> 1,538°C)';
          badge = `Molten Pool (${T.toFixed(0)}°C)`;
          badgeClass = 'bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800';
          icon = 'droplet';
          text = `
            <div>• <strong>Phase:</strong> Molten Liquid Metal.</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>liquid</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> The iron ingot has completely melted into a brilliant yellow-white liquid pool in the refractory crucible.</div>
          `;
        }
      }
    } else {
      // Indonesian for Besi
      if (zone === 'freezer') {
        if (T <= -9.9 && Q <= 0.05) {
          title = 'Keseimbangan Termal di Freezer';
          badge = 'Suhu Stabil -10°C';
          badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
          icon = 'snowflake';
          text = `
            <div>• <strong>Fase Zat:</strong> Logam Besi Padat (Fe).</div>
            <div>• <strong>Aliran Kalor:</strong> Tidak ada perpindahan kalor (ΔT = 0).</div>
            <div>• <strong>Konsep:</strong> Suhu balok besi setimbang dengan freezer pada -10°C.</div>
          `;
        } else if (Q >= landmarks.q1) {
          const persenBeku = Math.round((1 - state.meltProgress) * 100);
          title = 'Besi Cair Membeku di Freezer (1.538°C)';
          badge = `Membeku: ${persenBeku}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Fase Zat:</strong> Transisi Cair &rarr; Padat (Titik Beku 1.538°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Laten Pembekuan (<i>Q = m·L</i> = 247 kJ/kg).</div>
            <div>• <strong>Konsep:</strong> Suhu tertahan di 1.538°C saat cairan besi melepaskan kalor laten hingga membeku sempurna menjadi kristal logam padat.</div>
          `;
        } else {
          title = 'Pendinginan Besi di Freezer';
          badge = `Besi Mendingin: ${T.toFixed(0)}°C`;
          badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
          icon = 'snowflake';
          text = `
            <div>• <strong>Fase Zat:</strong> Padat (Besi mendingin pesat menuju -10°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Sensibel (<i>Q = m·c<sub>besi</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Besi mendingin sangat cepat karena kalor jenisnya kecil (450 J/kg·°C). Pijar termal meredup sempurna.</div>
          `;
        }
      } else if (zone === 'suhuRuang') {
        if (Q >= landmarks.q1) {
          const persenBeku = Math.round((1 - state.meltProgress) * 100);
          title = 'Besi Cair Membeku di Suhu Ruang (1.538°C)';
          badge = `Membeku: ${persenBeku}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Fase Zat:</strong> Transisi Cair &rarr; Padat (Titik Lebur 1.538°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Laten Pembekuan (<i>Q = m·L</i> = 247 kJ/kg).</div>
            <div>• <strong>Konsep:</strong> Besi cair melepaskan kalor laten ke udara ruangan hingga memadat kembali menjadi batangan besi padat.</div>
          `;
        } else if (T > 28) {
          title = 'Besi Panas Melepas Kalor ke Udara Ruangan';
          badge = `Besi Mendingin: ${T.toFixed(0)}°C`;
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'wind';
          text = `
            <div>• <strong>Fase Zat:</strong> Padat (Pendinginan alami konveksi & radiasi).</div>
            <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Sensibel (<i>Q = m·c<sub>besi</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Kalor mengalir spontan ke udara sekitar 27°C. Karena kalor jenisnya rendah, suhu besi turun lebih cepat dari air.</div>
          `;
        } else if (T >= 26 && T <= 28) {
          title = 'Kesetimbangan Termal di Ruangan';
          badge = 'Suhu Stabil 27°C';
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'check-circle';
          text = `
            <div>• <strong>Fase Zat:</strong> Logam Besi Padat (Stabil 27°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Nol (suhu besi = suhu ruang 27°C).</div>
            <div>• <strong>Konsep:</strong> Batang besi setimbang dengan temperatur ruangan, tidak terjadi aliran kalor netto.</div>
          `;
        } else {
          title = 'Besi Dingin Menyerap Kalor Udara Ruang';
          badge = `Besi Memanas: ${T.toFixed(0)}°C`;
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'thermometer-sun';
          text = `
            <div>• <strong>Fase Zat:</strong> Padat (Menyerap panas udara ruangan).</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>besi</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Besi dingin menyerap panas sekitar sampai suhunya naik menyamai 27°C.</div>
          `;
        }
      } else if (zone === 'kompor') {
        const flameTxt = state.flameLevel === 1 ? 'Kecil' : (state.flameLevel === 2 ? 'Sedang' : 'Besar');
        if (T < 500) {
          title = 'Besi Dipanaskan: Suhu Naik Sangat Pesat';
          badge = `Api ${flameTxt} (${T.toFixed(0)}°C)`;
          badgeClass = 'bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800';
          icon = 'flame';
          text = `
            <div>• <strong>Fase Zat:</strong> Padat (Pemanasan sensibel cepat).</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>besi</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Kalor jenis besi (450 J/kg·°C) hanya ~10% dari air, menyebabkan suhu besi melesat ~9,3× lebih cepat!</div>
          `;
        } else if (T >= 500 && T < 900) {
          title = 'Pijar Termal: Merah Kusam & Cerah (Radiasi Benda Hitam)';
          badge = `Pijar Merah: ${T.toFixed(0)}°C`;
          badgeClass = 'bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800';
          icon = 'flame';
          text = `
            <div>• <strong>Fase Zat:</strong> Padat (Berpijar merah gelap hingga cerah).</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>besi</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Saat suhu melampaui 500°C, radiasi termal benda hitam mulai memancarkan cahaya tampak kemerahan (pijar termal).</div>
          `;
        } else if (T >= 900 && T < 1538) {
          title = 'Pijar Termal: Oranye Menyala & Kuning Terang';
          badge = `Pijar Oranye: ${T.toFixed(0)}°C`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'sun';
          text = `
            <div>• <strong>Fase Zat:</strong> Padat (Pijar kuning keemasan bersinar terang).</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>besi</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Berdasarkan Hukum Pergeseran Wien, spektrum radiasi bergeser ke frekuensi cahaya tampak yang lebih tinggi (oranye & kuning terang).</div>
          `;
        } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
          const persenLebur = Math.round(state.meltProgress * 100);
          title = 'Peleburan Besi di Titik Lebur (1.538°C)';
          badge = `Melebur: ${persenLebur}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Fase Zat:</strong> Transisi Padat &rarr; Cair (Titik Lebur 1.538°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Laten Lebur (<i>Q = m·L</i> = 247 kJ/kg).</div>
            <div>• <strong>Konsep:</strong> Suhu terkunci konstan di 1.538°C saat ikatan kisi kristal logam runtuh menjadi lelehan besi cair pijar (molten iron).</div>
          `;
        } else {
          title = 'Besi Cair Molten Penuh (> 1.538°C)';
          badge = `Besi Cair (${T.toFixed(0)}°C)`;
          badgeClass = 'bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800';
          icon = 'droplet';
          text = `
            <div>• <strong>Fase Zat:</strong> Cairan Besi Molten.</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>cair</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Batangan besi telah melebur sempurna menjadi genangan cairan kuning-putih panas membara di cawan krus tahan api.</div>
          `;
        }
      }
    }
  }

  // ========================================================
  // SUBSTANCE: MENTEGA (Melebur pada 34°C & Membeku)
  // ========================================================
  else if (sub.id === 'mentega') {
    if (lang === 'en') {
      if (zone === 'freezer') {
        if (T <= -9.9 && Q <= 0.05) {
          title = 'Thermal Equilibrium in Freezer';
          badge = 'Stable Temp -10°C';
          badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
          icon = 'snowflake';
          text = `
            <div>• <strong>Phase:</strong> Hard Frozen Solid Butter.</div>
            <div>• <strong>Heat Flow:</strong> None (ΔT = 0).</div>
            <div>• <strong>Concept:</strong> Solid butter block is in thermal equilibrium with freezer air at -10°C.</div>
          `;
        } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
          const pctFreeze = Math.round((1 - state.meltProgress) * 100);
          title = 'Butter Solidifying / Freezing (34°C)';
          badge = `Solidifying: ${pctFreeze}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Phase:</strong> Transition Liquid &rarr; Solid (Freezing at 34°C).</div>
            <div>• <strong>Heat Flow:</strong> Releases Latent Heat of Fusion (<i>Q = m·L<sub>melt</sub></i> = 150 kJ/kg).</div>
            <div>• <strong>Concept:</strong> Golden liquid butter cools, turns opaque creamy yellow, and solidifies back into solid butter.</div>
          `;
        } else if (T > 34) {
          title = 'Liquid Butter Cooling in Freezer';
          badge = `Cooling: ${T.toFixed(1)}°C`;
          badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
          icon = 'wind';
          text = `
            <div>• <strong>Phase:</strong> Liquid (Cooling toward 34°C).</div>
            <div>• <strong>Heat Flow:</strong> Releases Sensible Heat (<i>Q = m·c<sub>liquid</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Hot liquid butter rapidly dumps heat into cold freezer air until reaching melting/freezing point 34°C.</div>
          `;
        } else {
          title = 'Solid Butter Cooling in Freezer';
          badge = `Cooling: ${T.toFixed(1)}°C`;
          badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
          icon = 'snowflake';
          text = `
            <div>• <strong>Phase:</strong> Solid (Cooling from 34°C toward -10°C).</div>
            <div>• <strong>Heat Flow:</strong> Releases Sensible Heat (<i>Q = m·c<sub>solid</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Solid butter cools and hardens as temperature drops to -10°C.</div>
          `;
        }
      } else if (zone === 'suhuRuang') {
        if (Q >= landmarks.q1 && Q < landmarks.q2) {
          const pctFreeze = Math.round((1 - state.meltProgress) * 100);
          title = 'Butter Solidifying at Room Temp (34°C)';
          badge = `Solidifying: ${pctFreeze}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Phase:</strong> Transition Liquid &rarr; Solid (Freezing at 34°C).</div>
            <div>• <strong>Heat Flow:</strong> Releases Latent Heat of Fusion (<i>Q = m·L<sub>melt</sub></i> = 150 kJ/kg).</div>
            <div>• <strong>Concept:</strong> Liquid butter hardens into soft solid butter at 34°C before cooling to 27°C.</div>
          `;
        } else if (T > 28) {
          title = 'Butter Cooling to Room Temp';
          badge = `Cooling: ${T.toFixed(1)}°C`;
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'wind';
          text = `
            <div>• <strong>Phase:</strong> Cooling toward 27°C.</div>
            <div>• <strong>Heat Flow:</strong> Releases Sensible Heat (<i>Q = m·c·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Heat dissipates into 27°C ambient room air until thermal equilibrium.</div>
          `;
        } else if (T >= 26 && T <= 28) {
          title = 'Thermal Equilibrium at Room Temp';
          badge = 'Stable Temp 27°C';
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'check-circle';
          text = `
            <div>• <strong>Phase:</strong> Soft Solid Butter (Stable at 27°C).</div>
            <div>• <strong>Heat Flow:</strong> Zero net transfer (butter temp = room temp 27°C).</div>
            <div>• <strong>Concept:</strong> Room temperature (27°C) is below butter's melting point (34°C), so butter remains a softened solid.</div>
          `;
        } else {
          title = 'Cold Butter Warming to Room Temp';
          badge = `Warming: ${T.toFixed(1)}°C`;
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'thermometer-sun';
          text = `
            <div>• <strong>Phase:</strong> Solid Butter (Warming from cold).</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>solid</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Cold solid butter absorbs ambient heat until reaching 27°C room temperature.</div>
          `;
        }
      } else if (zone === 'kompor') {
        const flameTxt = state.flameLevel === 1 ? 'Low' : (state.flameLevel === 2 ? 'Med' : 'High');
        if (Q < landmarks.q1 && T < 34) {
          title = 'Heating Solid Butter Toward Melting Point';
          badge = `Flame ${flameTxt} (${T.toFixed(1)}°C)`;
          badgeClass = 'bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800';
          icon = 'flame';
          text = `
            <div>• <strong>Phase:</strong> Solid Butter (Warming toward 34°C).</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>solid</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Heat energy softens the fat matrix toward butter's melting point (34°C).</div>
          `;
        } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
          const pctMelt = Math.round(state.meltProgress * 100);
          title = 'Butter Melting at Melting Point (34°C)';
          badge = `Melting: ${pctMelt}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Phase:</strong> Transition Solid &rarr; Liquid (Melting Point 34°C).</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Latent Heat of Fusion (<i>Q = m·L<sub>melt</sub></i> = 150 kJ/kg).</div>
            <div>• <strong>Concept:</strong> Temperature stays constant at 34°C while solid butter block softens and collapses into a golden pool of liquid melted butter.</div>
          `;
        } else if (T < 110) {
          title = 'Liquid Melted Butter Heating';
          badge = `Liquid: ${T.toFixed(1)}°C`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'flame';
          text = `
            <div>• <strong>Phase:</strong> Liquid (Golden Clarified Butter).</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Sensible Heat (<i>Q = m·c<sub>liquid</sub>·ΔT</i>).</div>
            <div>• <strong>Concept:</strong> Completely melted butter heats up smoothly as lipid molecules glide freely.</div>
          `;
        } else {
          title = 'Butter Sizzling & Boiling (> 110°C)';
          badge = `Sizzling (${T.toFixed(1)}°C)`;
          badgeClass = 'bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800';
          icon = 'cloud';
          text = `
            <div>• <strong>Phase:</strong> Liquid &amp; Vapor (Sizzling bubbles).</div>
            <div>• <strong>Heat Flow:</strong> Absorbs Latent Heat of Vaporization (<i>Q = m·U</i>).</div>
            <div>• <strong>Concept:</strong> Moisture inside butter boils off rapidly with sizzling micro-bubbles and fragrant warm butter aroma wisps.</div>
          `;
        }
      }
    } else {
      // Indonesian for Mentega
      if (zone === 'freezer') {
        if (T <= -9.9 && Q <= 0.05) {
          title = 'Keseimbangan Termal di Freezer';
          badge = 'Suhu Stabil -10°C';
          badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
          icon = 'snowflake';
          text = `
            <div>• <strong>Fase Zat:</strong> Mentega Padat Keras (Beku).</div>
            <div>• <strong>Aliran Kalor:</strong> Tidak ada perpindahan kalor (ΔT = 0).</div>
            <div>• <strong>Konsep:</strong> Balok mentega setimbang sempurna dengan suhu freezer -10°C.</div>
          `;
        } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
          const persenBeku = Math.round((1 - state.meltProgress) * 100);
          title = 'Mentega Membeku / Memadat (34°C)';
          badge = `Membeku: ${persenBeku}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Fase Zat:</strong> Transisi Cair &rarr; Padat (Membeku 34°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Laten Lebur/Beku (<i>Q = m·L<sub>lebur</sub></i> = 150 kJ/kg).</div>
            <div>• <strong>Konsep:</strong> Lelehan mentega cair mendingin, warnanya menjadi kuning pastel buram, dan mengeras kembali menjadi mentega padat.</div>
          `;
        } else if (T > 34) {
          title = 'Mentega Cair Mendingin di Freezer';
          badge = `Mendingin: ${T.toFixed(1)}°C`;
          badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
          icon = 'wind';
          text = `
            <div>• <strong>Fase Zat:</strong> Cair (Mendingin menuju 34°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Sensibel (<i>Q = m·c<sub>cair</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Mentega cair panas melepas kalor ke udara freezer hingga mencapai titik beku 34°C.</div>
          `;
        } else {
          title = 'Mentega Padat Mendingin di Freezer';
          badge = `Mendingin: ${T.toFixed(1)}°C`;
          badgeClass = 'bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300 border-sky-300 dark:border-sky-800';
          icon = 'snowflake';
          text = `
            <div>• <strong>Fase Zat:</strong> Padat (Mendingin dari 34°C menuju -10°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Sensibel (<i>Q = m·c<sub>padat</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Mentega padat semakin mengeras seiring penurunan suhu menuju kesetimbangan -10°C.</div>
          `;
        }
      } else if (zone === 'suhuRuang') {
        if (Q >= landmarks.q1 && Q < landmarks.q2) {
          const persenBeku = Math.round((1 - state.meltProgress) * 100);
          title = 'Mentega Membeku di Suhu Ruang (34°C)';
          badge = `Membeku: ${persenBeku}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Fase Zat:</strong> Transisi Cair &rarr; Padat (34°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Laten Lebur (<i>Q = m·L<sub>lebur</sub></i> = 150 kJ/kg).</div>
            <div>• <strong>Konsep:</strong> Mentega cair mengental dan memadat kembali menjadi mentega lunak di ruangan.</div>
          `;
        } else if (T > 28) {
          title = 'Mentega Mendingin ke Suhu Ruang';
          badge = `Mendingin: ${T.toFixed(1)}°C`;
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'wind';
          text = `
            <div>• <strong>Fase Zat:</strong> Pendinginan alami menuju 27°C.</div>
            <div>• <strong>Aliran Kalor:</strong> Melepas Kalor Sensibel (<i>Q = m·c·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Kalor berpindah spontan ke udara ruang 27°C hingga mencapai kesetimbangan termal.</div>
          `;
        } else if (T >= 26 && T <= 28) {
          title = 'Kesetimbangan Termal di Ruangan';
          badge = 'Suhu Stabil 27°C';
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'check-circle';
          text = `
            <div>• <strong>Fase Zat:</strong> Mentega Padat Lunak (Stabil 27°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Nol (suhu zat = suhu ruang 27°C).</div>
            <div>• <strong>Konsep:</strong> Suhu ruang (27°C) masih di bawah titik lebur mentega (34°C), sehingga mentega tetap berwujud padat lunak.</div>
          `;
        } else {
          title = 'Mentega Dingin Menyerap Kalor Udara Ruang';
          badge = `Memanas: ${T.toFixed(1)}°C`;
          badgeClass = 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800';
          icon = 'thermometer-sun';
          text = `
            <div>• <strong>Fase Zat:</strong> Padat (Menyerap kalor ruang).</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>padat</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Mentega dingin dari kulkas melunak menyerap panas ruangan hingga mencapai 27°C.</div>
          `;
        }
      } else if (zone === 'kompor') {
        const flameTxt = state.flameLevel === 1 ? 'Kecil' : (state.flameLevel === 2 ? 'Sedang' : 'Besar');
        if (Q < landmarks.q1 && T < 34) {
          title = 'Pemanasan Mentega Padat Menuju Titik Lebur';
          badge = `Api ${flameTxt} (${T.toFixed(1)}°C)`;
          badgeClass = 'bg-orange-100 dark:bg-orange-950/50 text-orange-900 dark:text-orange-300 border-orange-300 dark:border-orange-800';
          icon = 'flame';
          text = `
            <div>• <strong>Fase Zat:</strong> Padat (Mentega memanas & melunak).</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>padat</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Energi kalor melonggarkan ikatan antarmolekul lemak menuju titik lebur 34°C.</div>
          `;
        } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
          const persenLebur = Math.round(state.meltProgress * 100);
          title = 'Mentega Melebur Aktif pada Titik Lebur (34°C)';
          badge = `Melebur: ${persenLebur}%`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'layers';
          text = `
            <div>• <strong>Fase Zat:</strong> Transisi Padat &rarr; Cair (Titik Lebur 34°C).</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Laten Lebur (<i>Q = m·L<sub>lebur</sub></i> = 150 kJ/kg).</div>
            <div>• <strong>Konsep:</strong> Suhu konstan pada 34°C. Balok mentega kuning melunak dan melebur menjadi genangan cairan kuning keemasan.</div>
          `;
        } else if (T < 110) {
          title = 'Mentega Cair Memanas';
          badge = `Mentega Cair (${T.toFixed(1)}°C)`;
          badgeClass = 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-800';
          icon = 'flame';
          text = `
            <div>• <strong>Fase Zat:</strong> Cair (Lelehan Mentega Keemasan).</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Sensibel (<i>Q = m·c<sub>cair</sub>·ΔT</i>).</div>
            <div>• <strong>Konsep:</strong> Mentega telah melebur sepenuhnya menjadi fluida emas cair jernih dan suhunya terus naik.</div>
          `;
        } else {
          title = 'Mentega Mendidih & Mendesis (> 110°C)';
          badge = `Mendidih (${T.toFixed(1)}°C)`;
          badgeClass = 'bg-red-100 dark:bg-red-950/50 text-red-900 dark:text-red-300 border-red-300 dark:border-red-800';
          icon = 'cloud';
          text = `
            <div>• <strong>Fase Zat:</strong> Cair &amp; Uap (Mendidih / Berasap).</div>
            <div>• <strong>Aliran Kalor:</strong> Menyerap Kalor Laten Penguapan (<i>Q = m·U</i>).</div>
            <div>• <strong>Konsep:</strong> Kandungan air dalam mentega mendidih meletup-letup halus (sizzling) dan uap aroma mentega membubung ke atas.</div>
          `;
        }
      }
    }
  }

  // ========================================================
  // SUBSTANCE: AIR (H2O - DEFAULT)
  // ========================================================
  else {
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
      // Indonesian for Air
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
  }

  return { title, badge, badgeClass, text, icon };
}

function updateProcessInfo() {
  if (!isProcessInfoOpen) return;
  const data = getProcessInfoData();
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;
  const hr = getHeatRate(state.temp, state.zone, state.flameLevel);
  const isAbsorbing = hr > 0.05 || (state.zone === 'kompor' && state.temp < sub.tMax);
  const isReleasing = hr < -0.05 || (state.zone === 'freezer' && state.temp > -9.95);

  const isMelting = !isReleasing && state.meltProgress > 0 && state.meltProgress < 1;
  const isBoiling = !isReleasing && ((state.vaporProgress > 0 && state.vaporProgress < 1) || (sub.id === 'mentega' && state.temp >= 110));
  const isFreezing = isReleasing && state.meltProgress > 0 && state.meltProgress < 1;
  const isCondensing = isReleasing && state.vaporProgress > 0 && state.vaporProgress < 1;

  const stageKey = `${state.zone}_${data.title}_${data.badge}_${isAbsorbing ? 'abs' : (isReleasing ? 'rel' : 'eq')}_${isMelting}_${isBoiling}_${isFreezing}_${isCondensing}`;

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
    const classificationHtml = `
      ${data.text}
      <div class="mt-2 pt-2 border-t border-slate-200 dark:border-slate-700">
        <div class="text-[9px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">
          ${currentLang === 'en' ? '6 Phase Changes Classification:' : 'Klasifikasi 6 Perubahan Wujud Zat:'}
        </div>
        <div class="grid grid-cols-2 gap-1.5 text-[10px]">
          <!-- Kolom 1: Menyerap Kalor (+Q) -->
          <div class="p-1.5 rounded-md ${isAbsorbing ? 'bg-red-50/90 dark:bg-red-950/40 border border-red-300 dark:border-red-800 ring-1 ring-red-400' : 'bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-70'}">
            <div class="flex items-center gap-1 font-bold text-red-600 dark:text-red-400 mb-1">
              <i data-lucide="flame" class="w-3 h-3 text-[#E5232B]"></i>
              <span>${currentLang === 'en' ? 'ABSORBING (+Q)' : 'MENYERAP KALOR (+Q)'}</span>
            </div>
            <ul class="space-y-0.5 text-[9px] text-slate-700 dark:text-slate-300">
              <li class="${isMelting ? 'font-bold text-[#E5232B] dark:text-red-400' : ''}">
                ${isMelting ? '▶ ' : '• '}<strong>${currentLang === 'en' ? 'Melting' : 'Melebur'}</strong> (Padat &rarr; Cair)
              </li>
              <li class="${isBoiling ? 'font-bold text-[#E5232B] dark:text-red-400' : ''}">
                ${isBoiling ? '▶ ' : '• '}<strong>${currentLang === 'en' ? 'Vaporizing' : 'Menguap'}</strong> (Cair &rarr; Gas)
              </li>
              <li>• <strong>${currentLang === 'en' ? 'Sublimating' : 'Menyublim'}</strong> (Padat &rarr; Gas)</li>
            </ul>
          </div>

          <!-- Kolom 2: Melepas Kalor (-Q) -->
          <div class="p-1.5 rounded-md ${isReleasing ? 'bg-sky-50/90 dark:bg-sky-950/40 border border-sky-300 dark:border-sky-800 ring-1 ring-sky-400' : 'bg-slate-100/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 opacity-70'}">
            <div class="flex items-center gap-1 font-bold text-sky-600 dark:text-sky-400 mb-1">
              <i data-lucide="snowflake" class="w-3 h-3 text-sky-500"></i>
              <span>${currentLang === 'en' ? 'RELEASING (-Q)' : 'MELEPAS KALOR (-Q)'}</span>
            </div>
            <ul class="space-y-0.5 text-[9px] text-slate-700 dark:text-slate-300">
              <li class="${isFreezing ? 'font-bold text-sky-600 dark:text-sky-400' : ''}">
                ${isFreezing ? '▶ ' : '• '}<strong>${currentLang === 'en' ? 'Freezing' : 'Membeku'}</strong> (Cair &rarr; Padat)
              </li>
              <li class="${isCondensing ? 'font-bold text-sky-600 dark:text-sky-400' : ''}">
                ${isCondensing ? '▶ ' : '• '}<strong>${currentLang === 'en' ? 'Condensing' : 'Mengembun'}</strong> (Gas &rarr; Cair)
              </li>
              <li>• <strong>${currentLang === 'en' ? 'Deposition' : 'Mengkristal'}</strong> (Gas &rarr; Padat)</li>
            </ul>
          </div>
        </div>
      </div>
    `;
    textEl.innerHTML = classificationHtml;
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


function updateTempPresetsUI() {
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;
  const initialTempSelect = document.getElementById('initialTempSelect');
  if (!initialTempSelect) return;
  const presets = currentLang === 'en' ? sub.tempPresetsEn : sub.tempPresetsId;
  const currentVal = String(state.initialTemp);
  initialTempSelect.innerHTML = '';

  presets.forEach(item => {
    if (item.group) {
      const og = document.createElement('optgroup');
      og.label = item.group;
      item.options.forEach(opt => {
        const el = document.createElement('option');
        el.value = opt.val;
        el.textContent = opt.text;
        if (opt.val === currentVal || parseFloat(opt.val) === state.initialTemp) {
          el.selected = true;
        }
        og.appendChild(el);
      });
      initialTempSelect.appendChild(og);
    } else {
      const el = document.createElement('option');
      el.value = item.val;
      el.textContent = item.text;
      if (item.val === currentVal || parseFloat(item.val) === state.initialTemp) {
        el.selected = true;
      }
      initialTempSelect.appendChild(el);
    }
  });
}

function onSubstanceChange(subId) {
  sound.playClick();
  const sub = SUBSTANCES[subId] || SUBSTANCES.air;
  state.substance = sub.id;
  state.initialTemp = sub.defaultTemp;

  // Update pilihan preset suhu sesuai zat
  updateTempPresetsUI();

  // Update label partikel molekul
  const labelParticles = document.getElementById('labelParticles');
  if (labelParticles) {
    if (sub.id === 'air') labelParticles.innerHTML = currentLang === 'en' ? 'H<sub>2</sub>O Particles:' : 'Partikel H<sub>2</sub>O:';
    else if (sub.id === 'besi') labelParticles.innerHTML = currentLang === 'en' ? 'Iron (Fe) Atoms:' : 'Atom Besi (Fe):';
    else labelParticles.innerHTML = currentLang === 'en' ? 'Lipid / Fat Molecules:' : 'Molekul Lemak (Lipid):';
  }

  // Update rumus & konstanta di modal
  updateFormulaModal();

  resetSimulation();
}

function updateFormulaModal() {
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;
  const body = document.getElementById('modalKalorLatenBody');
  if (!body) return;

  if (currentLang === 'en') {
    if (sub.id === 'air') {
      body.innerHTML = `
        <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr><th class="p-2">Heat Type</th><th class="p-2">Formula</th><th class="p-2">Physical Effect</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr><td class="p-2 font-semibold">Sensible Heat</td><td class="p-2 font-mono font-bold text-[#E5232B]">Q = m · c · ΔT</td><td class="p-2">Temperature changes, state remains unchanged.</td></tr>
              <tr><td class="p-2 font-semibold">Latent Heat of Fusion</td><td class="p-2 font-mono font-bold text-emerald-600">Q = m · L</td><td class="p-2">Solid ↔ Liquid (0°C). Melting / Freezing.</td></tr>
              <tr><td class="p-2 font-semibold">Latent Heat of Vaporization</td><td class="p-2 font-mono font-bold text-amber-600">Q = m · U</td><td class="p-2">Liquid ↔ Gas (100°C). Vaporizing / Condensing.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
          <span class="font-display font-bold font-sans text-xs text-slate-900 dark:text-white block mb-1">Water Physical Constants (1 atm):</span>
          <div class="flex justify-between"><span>Specific heat of ice (c<sub>solid</sub>):</span><span class="font-bold">2,100 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Specific heat of water (c<sub>liquid</sub>):</span><span class="font-bold">4,200 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Specific heat of steam (c<sub>gas</sub>):</span><span class="font-bold">2,000 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Latent heat of fusion (L):</span><span class="font-bold">336,000 J/kg</span></div>
          <div class="flex justify-between"><span>Latent heat of vaporization (U):</span><span class="font-bold">2,260,000 J/kg</span></div>
        </div>
      `;
    } else if (sub.id === 'besi') {
      body.innerHTML = `
        <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr><th class="p-2">Thermal Process</th><th class="p-2">Formula</th><th class="p-2">Physical Effect</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr><td class="p-2 font-semibold">Iron Heating &amp; Incandescence</td><td class="p-2 font-mono font-bold text-[#E5232B]">Q = m · c · ΔT</td><td class="p-2">Low specific heat (450 J/kg·°C) causes fast temperature rise and color glow.</td></tr>
              <tr><td class="p-2 font-semibold">Iron Smelting (1,538°C)</td><td class="p-2 font-mono font-bold text-amber-600">Q = m · L<sub>lebur</sub></td><td class="p-2">Solid metallic crystal melts into molten liquid iron.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
          <span class="font-display font-bold font-sans text-xs text-slate-900 dark:text-white block mb-1">Iron (Fe) Physical Constants:</span>
          <div class="flex justify-between"><span>Specific heat of solid iron (c<sub>Fe</sub>):</span><span class="font-bold">450 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Melting point (T<sub>melt</sub>):</span><span class="font-bold">1,538°C</span></div>
          <div class="flex justify-between"><span>Latent heat of fusion (L<sub>melt</sub>):</span><span class="font-bold">247,000 J/kg</span></div>
          <div class="flex justify-between"><span>Density (ρ):</span><span class="font-bold">7.87 g/cm³</span></div>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr><th class="p-2">Process</th><th class="p-2">Formula</th><th class="p-2">Physical Effect</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr><td class="p-2 font-semibold">Butter Heating</td><td class="p-2 font-mono font-bold text-[#E5232B]">Q = m · c · ΔT</td><td class="p-2">Solid butter softens and warms towards 34°C.</td></tr>
              <tr><td class="p-2 font-semibold">Melting &amp; Solidifying</td><td class="p-2 font-mono font-bold text-amber-600">Q = m · L<sub>melt</sub></td><td class="p-2">Solid butter melts into golden liquid pool at 34°C, or solidifies upon cooling.</td></tr>
              <tr><td class="p-2 font-semibold">Liquid Butter Heating</td><td class="p-2 font-mono font-bold text-amber-700">Q = m · c · ΔT</td><td class="p-2">Molten butter heats up, then sizzles &amp; boils off moisture above 110°C.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
          <span class="font-display font-bold font-sans text-xs text-slate-900 dark:text-white block mb-1">Butter Physical Constants:</span>
          <div class="flex justify-between"><span>Specific heat of solid (c<sub>solid</sub>):</span><span class="font-bold">2,000 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Melting point (T<sub>melt</sub>):</span><span class="font-bold">34°C</span></div>
          <div class="flex justify-between"><span>Latent heat of fusion (L<sub>melt</sub>):</span><span class="font-bold">150,000 J/kg</span></div>
          <div class="flex justify-between"><span>Specific heat of liquid (c<sub>liquid</sub>):</span><span class="font-bold">2,200 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Density (ρ):</span><span class="font-bold">0.91 g/cm³</span></div>
        </div>
      `;
    }
  } else {
    // Indonesian
    if (sub.id === 'air') {
      body.innerHTML = `
        <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr><th class="p-2">Jenis Kalor</th><th class="p-2">Persamaan</th><th class="p-2">Efek pada Zat</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr><td class="p-2 font-semibold">Kalor Sensibel</td><td class="p-2 font-mono font-bold text-[#E5232B]">Q = m · c · ΔT</td><td class="p-2">Suhu zat naik / turun, wujud zat tetap.</td></tr>
              <tr><td class="p-2 font-semibold">Kalor Laten Lebur / Beku</td><td class="p-2 font-mono font-bold text-emerald-600">Q = m · L</td><td class="p-2">Padat ↔ Cair (0°C). Melebur atau Membeku.</td></tr>
              <tr><td class="p-2 font-semibold">Kalor Laten Uap / Embun</td><td class="p-2 font-mono font-bold text-amber-600">Q = m · U</td><td class="p-2">Cair ↔ Gas (100°C). Menguap atau Mengembun.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
          <span class="font-display font-bold font-sans text-xs text-slate-900 dark:text-white block mb-1">Konstanta Fisika Air (1 atm):</span>
          <div class="flex justify-between"><span>Kalor jenis es (c<sub>es</sub>):</span><span class="font-bold">2.100 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Kalor jenis air (c<sub>air</sub>):</span><span class="font-bold">4.200 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Kalor jenis uap (c<sub>uap</sub>):</span><span class="font-bold">2.000 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Kalor lebur es (L):</span><span class="font-bold">336.000 J/kg</span></div>
          <div class="flex justify-between"><span>Kalor uap air (U):</span><span class="font-bold">2.260.000 J/kg</span></div>
        </div>
      `;
    } else if (sub.id === 'besi') {
      body.innerHTML = `
        <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr><th class="p-2">Proses Termal</th><th class="p-2">Persamaan</th><th class="p-2">Efek pada Zat</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr><td class="p-2 font-semibold">Pemanasan &amp; Pijar Termal</td><td class="p-2 font-mono font-bold text-[#E5232B]">Q = m · c · ΔT</td><td class="p-2">Kalor jenis rendah (450 J/kg·°C) membuat suhu cepat melonjak dan memicu radiasi benda hitam berpendar.</td></tr>
              <tr><td class="p-2 font-semibold">Peleburan Besi (1.538°C)</td><td class="p-2 font-mono font-bold text-amber-600">Q = m · L<sub>lebur</sub></td><td class="p-2">Kristal logam padat melebur sempurna menjadi lelehan besi cair (molten).</td></tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
          <span class="font-display font-bold font-sans text-xs text-slate-900 dark:text-white block mb-1">Konstanta Fisika Besi (Fe):</span>
          <div class="flex justify-between"><span>Kalor jenis besi padat (c<sub>besi</sub>):</span><span class="font-bold">450 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Titik lebur besi (T<sub>lebur</sub>):</span><span class="font-bold">1.538°C</span></div>
          <div class="flex justify-between"><span>Kalor lebur besi (L<sub>lebur</sub>):</span><span class="font-bold">247.000 J/kg</span></div>
          <div class="flex justify-between"><span>Massa jenis (ρ):</span><span class="font-bold">7,87 g/cm³</span></div>
        </div>
      `;
    } else {
      body.innerHTML = `
        <div class="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
          <table class="w-full text-left text-xs">
            <thead class="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold border-b border-slate-200 dark:border-slate-700">
              <tr><th class="p-2">Proses Fisika</th><th class="p-2">Persamaan</th><th class="p-2">Efek pada Zat</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-200 dark:divide-slate-700">
              <tr><td class="p-2 font-semibold">Pemanasan Mentega Padat</td><td class="p-2 font-mono font-bold text-[#E5232B]">Q = m · c · ΔT</td><td class="p-2">Mentega padat menyerap kalor dan melunak menuju titik lebur 34°C.</td></tr>
              <tr><td class="p-2 font-semibold">Peleburan &amp; Pembekuan</td><td class="p-2 font-mono font-bold text-amber-600">Q = m · L<sub>lebur</sub></td><td class="p-2">Melebur menjadi cairan emas (34°C), atau membeku kembali menjadi padat saat didinginkan.</td></tr>
              <tr><td class="p-2 font-semibold">Mentega Cair Memanas</td><td class="p-2 font-mono font-bold text-amber-700">Q = m · c · ΔT</td><td class="p-2">Cairan mentega memanas, lalu mendidih &amp; berasap mendesis di atas 110°C.</td></tr>
            </tbody>
          </table>
        </div>
        <div class="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 font-mono text-[11px] space-y-1">
          <span class="font-display font-bold font-sans text-xs text-slate-900 dark:text-white block mb-1">Konstanta Fisika Mentega:</span>
          <div class="flex justify-between"><span>Kalor jenis padat (c<sub>padat</sub>):</span><span class="font-bold">2.000 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Titik lebur mentega (T<sub>lebur</sub>):</span><span class="font-bold">34°C</span></div>
          <div class="flex justify-between"><span>Kalor lebur mentega (L<sub>lebur</sub>):</span><span class="font-bold">150.000 J/kg</span></div>
          <div class="flex justify-between"><span>Kalor jenis cair (c<sub>cair</sub>):</span><span class="font-bold">2.200 J/(kg·°C)</span></div>
          <div class="flex justify-between"><span>Massa jenis (ρ):</span><span class="font-bold">0,91 g/cm³</span></div>
        </div>
      `;
    }
  }
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
}

function onInitialTempChange(val) {
  sound.playClick();
  const num = parseFloat(val);
  if (!isNaN(num)) {
    state.initialTemp = num;
    resetSimulation(true);
  }
}

function onCustomTempInput(val) {}

function onMassChange(val) {
  sound.playClick();
  state.mass = parseFloat(val);
  resetSimulation(true);
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

function resetSimulation(keepZone = false) {
  sound.playClick();
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;
  if (!keepZone) {
    state.initialTemp = sub.defaultTemp;
  }
  const init = getInitialThermalState(state.initialTemp, state.mass);
  state.temp = init.temp;
  state.curveQ = init.curveQ;
  state.heatTotal = 0;
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

  // Atur zona lingkungan awal hanya jika tidak diminta mempertahankan zona terpilih
  if (!keepZone) {
    if (state.initialTemp <= 0) {
      setZone('freezer');
    } else if (state.initialTemp <= 40) {
      setZone('suhuRuang');
    } else {
      setZone('kompor');
    }
  }

  // Sinkronisasi dropdown pilihan suhu
  syncTempDropdown(state.initialTemp);

  render();
  if (isProcessInfoOpen) updateProcessInfo();
}

// --- LAJU PERPINDAHAN KALOR (J/DETIK) BERDASARKAN LINGKUNGAN ---
function getHeatRate(temp, zone, flame) {
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;
  if (zone === 'freezer') {
    const target = -10.0;
    const factor = sub.id === 'besi' ? 24.0 : 35.0;
    return temp > target ? -factor * (temp - target) : 0;
  } else if (zone === 'suhuRuang') {
    const target = 27.0;
    const factor = sub.id === 'besi' ? 26.0 : 38.0;
    return temp < target
      ? factor * Math.max(1, (target - temp) * 0.8)
      : (temp > target ? -factor * (temp - target) : 0);
  } else if (zone === 'kompor') {
    if (temp >= sub.tMax) return 0;
    if (sub.id === 'besi') {
      // Pembakar tanur induksi / torch untuk peleburan besi (1.538°C)
      return flame === 1 ? 1200 : (flame === 2 ? 2500 : 5000);
    }
    return flame === 1 ? 300 : (flame === 2 ? 750 : 1500);
  }
  return 0;
}

// --- UPDATE FISIKA KALOR SETIAP FRAME (PERHITUNGAN TERMAL) ---
function updatePhysics(dt) {
  if (!state.isPlaying) return;

  const landmarks = getLandmarks(state.mass, state.initialTemp);
  const sub = landmarks.sub;
  const heatRate = getHeatRate(state.temp, state.zone, state.flameLevel);
  const effectiveDt = dt * state.speed;
  const dQ = heatRate * effectiveDt;

  state.simTime += effectiveDt;

  // Bersihkan bubble & uap saat proses pendinginan agar tidak tampil saat suhu turun dari >100°C
  if (heatRate < -0.01) {
    state.bubbles = [];
    state.steamParticles = [];
  }

  // Akumulasi kalor proses (energi yang berpindah sejak awal percobaan, selalu mulai dari 0)
  if (heatRate > 0.01) {
    state.heatTotal += dQ;
  } else if (heatRate < -0.01) {
    state.heatTotal += Math.abs(dQ);
  }

  // Posisi pada kurva termodinamika fase zat
  state.curveQ = Math.max(0, Math.min(landmarks.q5, state.curveQ + dQ));
  const Q = state.curveQ;
  const m = state.mass;

  if (sub.type === 'melt_boil') {
    // 1. AIR & MENTEGA: Padat memanas -> Lebur (tMelt) -> Cair memanas -> Didih (tBoil) -> Uap
    if (Q < landmarks.q1) {
      state.temp = landmarks.tBase + (Q / (m * sub.cSolid));
      state.meltProgress = 0;
      state.vaporProgress = 0;
    } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
      state.temp = sub.tMelt;
      state.meltProgress = landmarks.q2 > landmarks.q1 ? (Q - landmarks.q1) / (landmarks.q2 - landmarks.q1) : 1;
      state.vaporProgress = 0;
    } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
      state.temp = sub.tMelt + (Q - landmarks.q2) / (m * sub.cLiquid);
      state.meltProgress = 1.0;
      state.vaporProgress = 0;
    } else if (Q >= landmarks.q3 && Q < landmarks.q4) {
      state.temp = sub.tBoil;
      state.meltProgress = 1.0;
      state.vaporProgress = (Q - landmarks.q3) / (landmarks.q4 - landmarks.q3);
      if (!isCoolingProcess() && Math.random() < 0.25) sound.playBoilBubble();
    } else {
      state.temp = Math.min(sub.tMax, sub.tBoil + (Q - landmarks.q4) / (m * sub.cGas));
      state.meltProgress = 1.0;
      state.vaporProgress = 1.0;
      if (state.temp >= sub.tMax) {
        state.temp = sub.tMax;
        state.curveQ = landmarks.q5;
      }
    }
  } else if (sub.type === 'metal_incandescence') {
    // 2. BESI (Fe): Padat memanas & berpijar -> Peleburan di 1.538°C -> Besi cair molten
    if (Q < landmarks.q1) {
      state.temp = landmarks.tBase + (Q / (m * sub.cSolid));
      state.meltProgress = 0;
      state.vaporProgress = 0;
    } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
      state.temp = sub.tMelt; // 1538°C
      state.meltProgress = landmarks.q2 > landmarks.q1 ? (Q - landmarks.q1) / (landmarks.q2 - landmarks.q1) : 1;
      state.vaporProgress = 0;
    } else {
      state.temp = Math.min(sub.tMax, sub.tMelt + (Q - landmarks.q2) / (m * sub.cLiquid));
      state.meltProgress = 1.0;
      state.vaporProgress = 0;
      if (state.temp >= sub.tMax) {
        state.temp = sub.tMax;
        state.curveQ = landmarks.q5;
      }
    }
  } else {
    // 3. KAPUR BARUS: Padat memanas -> Menyublim langsung di 80°C -> Gas kamper
    if (Q < landmarks.q1) {
      state.temp = landmarks.tBase + (Q / (m * sub.cSolid));
      state.meltProgress = 0;
      state.vaporProgress = 0;
    } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
      state.temp = sub.tSublim; // 80°C
      state.meltProgress = 1.0;
      state.vaporProgress = landmarks.q2 > landmarks.q1 ? (Q - landmarks.q1) / (landmarks.q2 - landmarks.q1) : 1;
    } else {
      state.temp = Math.min(sub.tMax, sub.tSublim + (Q - landmarks.q2) / (m * sub.cGas));
      state.meltProgress = 1.0;
      state.vaporProgress = 1.0;
      if (state.temp >= sub.tMax) {
        state.temp = sub.tMax;
        state.curveQ = landmarks.q5;
      }
    }
  }

  // Batas pendinginan freezer (-10°C)
  if (state.zone === 'freezer' && state.temp <= -10.0 && heatRate <= 0) {
    const qFreezerLimit = landmarks.tBase === -10 ? 0 : (m * sub.cSolid * (-10 - landmarks.tBase));
    if (state.curveQ <= qFreezerLimit) {
      state.curveQ = qFreezerLimit;
      state.temp = -10.0;
    }
  } else if (state.zone === 'suhuRuang') {
    // Stabilisasi pada suhu ruang 27°C
    if (Math.abs(state.temp - 27.0) < 0.2 && Math.abs(heatRate) < 15) {
      state.temp = 27.0;
      if (sub.type === 'melt_boil') {
        if (27.0 < sub.tMelt) {
          state.curveQ = m * sub.cSolid * (27.0 - landmarks.tBase);
        } else {
          state.curveQ = landmarks.q2 + m * sub.cLiquid * (27.0 - sub.tMelt);
        }
      } else {
        state.curveQ = m * sub.cSolid * (27.0 - landmarks.tBase);
      }
    }
  }
}

// --- HELPER WARNA PIJAR TERMAL BESI (BLACKBODY RADIATION) ---
function getIronThermalColors(temp) {
  if (temp < 450) {
    return { fill: '#475569', stroke: '#334155', glow: null, alpha: 0 };
  } else if (temp < 650) {
    const f = (temp - 450) / 200;
    return { fill: '#7f1d1d', stroke: '#991b1b', glow: 'rgba(239, 68, 68, 0.35)', alpha: f * 0.45 };
  } else if (temp < 900) {
    const f = (temp - 650) / 250;
    return { fill: '#b91c1c', stroke: '#dc2626', glow: 'rgba(239, 68, 68, 0.55)', alpha: 0.45 + f * 0.3 };
  } else if (temp < 1200) {
    const f = (temp - 900) / 300;
    return { fill: '#ea580c', stroke: '#fb923c', glow: 'rgba(249, 115, 22, 0.75)', alpha: 0.75 + f * 0.2 };
  } else if (temp < 1538) {
    return { fill: '#facc15', stroke: '#fef08a', glow: 'rgba(250, 204, 21, 0.9)', alpha: 0.95 };
  } else {
    return { fill: '#fef08a', stroke: '#ffffff', glow: 'rgba(254, 240, 138, 0.98)', alpha: 1.0 };
  }
}

// --- RENDER KANVAS: BEAKER GLASS, CAWAN KRUS BESI, ES, AIR, MENTEGA, API & UAP ---
function renderBeaker() {
  bCtx.clearRect(0, 0, beakerCanvas.width, beakerCanvas.height);
  const w = beakerCanvas.width;
  const h = beakerCanvas.height;
  const isDark = document.documentElement.classList.contains('dark');
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;

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
    bCtx.fillStyle = sub.id === 'besi' && state.temp > 500
      ? (isDark ? '#fed7aa' : '#ffedd5')
      : (isDark ? '#f8fafc' : '#e2e8f0');
    bCtx.fillRect(w / 2 - 34, gauzeY - 1, 68, 5);
    bCtx.restore();

    // C. Pembakar Bunsen / Torch Tanur
    bCtx.save();
    bCtx.fillStyle = isDark ? '#1e293b' : '#334155';
    bCtx.beginPath();
    bCtx.roundRect(burnerX - 32, burnerBaseY, 64, 9, 3);
    bCtx.fill();

    bCtx.fillStyle = isDark ? '#334155' : '#64748b';
    bCtx.fillRect(burnerX - 7, nozzleY + 2, 14, burnerBaseY - nozzleY - 2);

    bCtx.fillStyle = isDark ? '#475569' : '#94a3b8';
    bCtx.fillRect(burnerX - 9, nozzleY + 10, 18, 4);

    bCtx.fillStyle = isDark ? '#64748b' : '#475569';
    bCtx.fillRect(burnerX - 8, nozzleY, 16, 3);
    bCtx.restore();

    // D. Animasi Nyala Api Bunsen (Multi-layer Licking Flames)
    const flameHeight = state.flameLevel === 1 ? 20 : (state.flameLevel === 2 ? 30 : 42);
    const time = performance.now() * 0.007;

    bCtx.save();
    // [1] Aura Panas Berpendar
    const auraRadius = 24 + state.flameLevel * 14;
    const auraGrad = bCtx.createRadialGradient(burnerX, gauzeY, 4, burnerX, gauzeY, auraRadius);
    auraGrad.addColorStop(0, `rgba(249, 115, 22, ${0.22 + state.flameLevel * 0.08})`);
    auraGrad.addColorStop(0.6, `rgba(234, 88, 12, ${0.1 + state.flameLevel * 0.05})`);
    auraGrad.addColorStop(1, 'transparent');
    bCtx.fillStyle = auraGrad;
    bCtx.beginPath();
    bCtx.arc(burnerX, gauzeY, auraRadius, 0, Math.PI * 2);
    bCtx.fill();

    // [2] Lidah-Lidah Api Bergerak
    const spread = 4 + state.flameLevel * 3.5;
    for (let i = -3; i <= 3; i++) {
      const fx = burnerX + i * spread;
      const wave = Math.sin(time * 3.2 + i * 1.5) * (2.5 + state.flameLevel * 1.2);
      const waveH = Math.cos(time * 2.6 - i * 1.8) * (3.5 + state.flameLevel * 1.6);
      const fh = flameHeight + waveH;
      const tipY = nozzleY - fh;
      const tW = 6 + state.flameLevel * 1.2;

      const grad = bCtx.createLinearGradient(fx, nozzleY, fx + wave, tipY);
      grad.addColorStop(0, '#2563eb');
      grad.addColorStop(0.2, '#38bdf8');
      grad.addColorStop(0.45, '#f97316');
      grad.addColorStop(0.8, '#facc15');
      grad.addColorStop(1, '#ffffff');

      bCtx.fillStyle = grad;
      bCtx.beginPath();
      bCtx.moveTo(fx - tW, nozzleY);
      bCtx.bezierCurveTo(fx - tW * 0.7 + wave * 0.5, nozzleY - fh * 0.5, fx + wave - 2, tipY + 4, fx + wave, tipY);
      bCtx.bezierCurveTo(fx + wave + 2, tipY + 4, fx + tW * 0.7 + wave * 0.5, nozzleY - fh * 0.5, fx + tW, nozzleY);
      bCtx.closePath();
      bCtx.fill();
    }

    // [3] Inti Kerucut Biru Bunsen
    bCtx.beginPath();
    bCtx.moveTo(burnerX - 5, nozzleY);
    bCtx.quadraticCurveTo(burnerX + Math.sin(time * 4) * 1.2, nozzleY - (12 + state.flameLevel * 3.5), burnerX + 5, nozzleY);
    bCtx.fillStyle = 'rgba(56, 189, 248, 0.88)';
    bCtx.fill();

    // [4] Partikel Percikan Api Kompor
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
    // Tatakan meja lab / rak pendingin saat di Freezer atau Suhu Ruang
    const benchY = 152;
    bCtx.save();
    bCtx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    bCtx.strokeStyle = isDark ? '#334155' : '#cbd5e1';
    bCtx.lineWidth = 1.5;
    bCtx.beginPath();
    bCtx.roundRect(w / 2 - 80, benchY, 160, 8, 3);
    bCtx.fill();
    bCtx.stroke();

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

  // ========================================================
  // WADAH & ZAT 1: BESI (Fe) - CAWAN KRUS PORSELEN & PIJAR TERMAL
  // ========================================================
  if (sub.id === 'besi') {
    const cx = w / 2;
    const cy = 152;
    const mScale = Math.cbrt(state.mass / 0.1);
    const ironCol = getIronThermalColors(state.temp);

    // Aura Radiasi Termal Pijar Logam (Blackbody Glow)
    if (ironCol.glow) {
      bCtx.save();
      const glowR = 35 + state.temp * 0.025;
      const glowGrad = bCtx.createRadialGradient(cx, cy - 30, 8, cx, cy - 30, glowR);
      glowGrad.addColorStop(0, ironCol.glow);
      glowGrad.addColorStop(0.7, ironCol.glow.replace(/[\d\.]+\)$/, '0.15)'));
      glowGrad.addColorStop(1, 'transparent');
      bCtx.fillStyle = glowGrad;
      bCtx.beginPath();
      bCtx.arc(cx, cy - 30, glowR, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.restore();
    }

    // Cawan Krus Porselen Tahan Api (Refractory Crucible)
    bCtx.save();
    // Bayangan cawan
    bCtx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.15)';
    bCtx.beginPath();
    bCtx.ellipse(cx, cy + 1, 56, 5, 0, 0, Math.PI * 2);
    bCtx.fill();

    // Dinding Luar Cawan Krus Porselen
    bCtx.fillStyle = isDark ? '#334155' : '#f8fafc';
    bCtx.strokeStyle = isDark ? '#64748b' : '#94a3b8';
    bCtx.lineWidth = 2.5;
    bCtx.beginPath();
    bCtx.moveTo(cx - 52, cy - 64);
    bCtx.bezierCurveTo(cx - 50, cy - 18, cx - 36, cy, cx, cy);
    bCtx.bezierCurveTo(cx + 36, cy, cx + 50, cy - 18, cx + 52, cy - 64);
    bCtx.closePath();
    bCtx.fill();
    bCtx.stroke();

    // Bibir Atas Cawan (Rim Ellipse)
    bCtx.fillStyle = isDark ? '#1e293b' : '#e2e8f0';
    bCtx.beginPath();
    bCtx.ellipse(cx, cy - 64, 52, 9, 0, 0, Math.PI * 2);
    bCtx.fill();
    bCtx.stroke();

    // Label Cawan Krus
    bCtx.fillStyle = isDark ? '#94a3b8' : '#64748b';
    bCtx.font = '700 8.5px "Plus Jakarta Sans", sans-serif';
    bCtx.textAlign = 'center';
    bCtx.fillText(currentLang === 'en' ? 'CRUCIBLE (1600°C)' : 'CAWAN KRUS (1600°C)', cx, cy - 10);
    bCtx.restore();

    // Genangan Besi Cair Molten (Molten Iron Liquid Pool)
    const meltFrac = state.meltProgress;
    const poolH = Math.min(22, 18 * meltFrac * mScale);
    if (meltFrac > 0) {
      bCtx.save();
      const liquidGrad = bCtx.createRadialGradient(cx, cy - 8 - poolH * 0.5, 4, cx, cy - 8 - poolH * 0.5, 34);
      liquidGrad.addColorStop(0, '#ffffff');
      liquidGrad.addColorStop(0.3, '#fef08a');
      liquidGrad.addColorStop(0.7, '#facc15');
      liquidGrad.addColorStop(1, '#ea580c');

      bCtx.fillStyle = liquidGrad;
      bCtx.strokeStyle = '#fef08a';
      bCtx.lineWidth = 1.5;
      bCtx.beginPath();
      bCtx.ellipse(cx, cy - 6 - poolH * 0.5, 32 * Math.min(1, 0.4 + meltFrac * 0.6), Math.max(4, poolH * 0.6), 0, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.stroke();

      // Kilau riak permukaan cairan
      bCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
      bCtx.beginPath();
      bCtx.ellipse(cx, cy - 6 - poolH * 0.65, 18, 2, 0, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.restore();
    }

    // Bongkahan Batang Besi Padat 3D (Solid Iron Ingot)
    if (meltFrac < 1.0) {
      const solidRem = 1 - meltFrac;
      const bW = 42 * mScale * Math.sqrt(solidRem);
      const bH = 28 * mScale * solidRem;
      const ingotY = cy - 6 - poolH - bH * 0.5;

      bCtx.save();
      bCtx.fillStyle = ironCol.fill;
      bCtx.strokeStyle = ironCol.stroke;
      bCtx.lineWidth = 2;

      // Tubuh utama batangan besi
      bCtx.beginPath();
      bCtx.roundRect(cx - bW / 2, ingotY - bH / 2, bW, bH, Math.max(2, 4 * solidRem));
      bCtx.fill();
      bCtx.stroke();

      // Bevel & highlight permukaan atas logam
      bCtx.fillStyle = ironCol.glow ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.25)';
      bCtx.beginPath();
      bCtx.roundRect(cx - bW / 2 + 3, ingotY - bH / 2 + 2, bW - 6, Math.max(3, bH * 0.35), 2);
      bCtx.fill();

      // Teks Simbol Fe pada bongkahan
      if (solidRem > 0.35) {
        bCtx.fillStyle = state.temp >= 500 ? '#ffffff' : (isDark ? '#cbd5e1' : '#1e293b');
        bCtx.font = 'bold 10px "Plus Jakarta Sans", sans-serif';
        bCtx.textAlign = 'center';
        bCtx.fillText('Fe', cx, ingotY + 4);
      }
      bCtx.restore();
    }

    // Percikan Api Pendaran Logam Panas (Metallurgical Sparks)
    if (state.temp >= 700 && state.zone === 'kompor') {
      if (Math.random() < 0.4) {
        state.sparks.push({
          x: cx + (Math.random() - 0.5) * 32,
          y: cy - 25,
          vx: (Math.random() - 0.5) * 3.8,
          vy: -(2.5 + Math.random() * 4.5),
          r: 1 + Math.random() * 1.6,
          life: 1.0
        });
      }
    }

    for (let i = state.sparks.length - 1; i >= 0; i--) {
      const sp = state.sparks[i];
      sp.x += sp.vx;
      sp.y += sp.vy;
      sp.vy += 0.12; // Gravitasi kecil
      sp.life -= 0.028;

      bCtx.fillStyle = `rgba(254, 240, 138, ${Math.max(0, sp.life)})`;
      bCtx.beginPath();
      bCtx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
      bCtx.fill();

      if (sp.life <= 0) state.sparks.splice(i, 1);
    }
  }

  // ========================================================
  // WADAH & ZAT 2: MENTEGA (Melebur pada 34°C & Membeku)
  // ========================================================
  else if (sub.id === 'mentega') {
    const bx = w / 2 - 68;
    const by = 26;
    const bw = 136;
    const bh = 126;
    const floorY = by + bh - 4;
    const mScale = Math.cbrt(state.mass / 0.1);
    const meltFrac = Math.min(1, Math.max(0, state.meltProgress));
    const solidFrac = Math.max(0, 1 - meltFrac);

    // A. Genangan Mentega Cair Keemasan (Golden Liquid Melted Butter)
    if (meltFrac > 0.01) {
      const poolH = Math.min(bh - 14, meltFrac * 36 * mScale);
      const poolY = floorY - poolH;

      bCtx.save();
      // Clip inside beaker bounds
      bCtx.beginPath();
      bCtx.moveTo(bx + 4, poolY);
      bCtx.lineTo(bx + bw - 4, poolY);
      bCtx.lineTo(bx + bw - 4, floorY - 8);
      bCtx.quadraticCurveTo(bx + bw - 4, floorY, bx + bw - 14, floorY);
      bCtx.lineTo(bx + 14, floorY);
      bCtx.quadraticCurveTo(bx + 4, floorY, bx + 4, floorY - 8);
      bCtx.closePath();
      bCtx.clip();

      const butterGrad = bCtx.createLinearGradient(0, poolY, 0, floorY);
      if (state.temp < 34) {
        // Saat mengental / mendingin (membeku kembali): warna lebih krem pastel
        butterGrad.addColorStop(0, '#fef08a');
        butterGrad.addColorStop(1, '#fde047');
      } else {
        // Cair keemasan jernih berkilau
        butterGrad.addColorStop(0, 'rgba(251, 191, 36, 0.90)'); // Amber gold
        butterGrad.addColorStop(0.6, 'rgba(245, 158, 11, 0.94)');
        butterGrad.addColorStop(1, 'rgba(217, 119, 6, 0.98)');
      }
      bCtx.fillStyle = butterGrad;
      bCtx.fillRect(bx + 2, poolY, bw - 4, poolH + 10);

      // Garis kilau permukaan minyak mentega
      bCtx.strokeStyle = 'rgba(254, 240, 138, 0.85)';
      bCtx.lineWidth = 1.6;
      bCtx.beginPath();
      bCtx.moveTo(bx + 5, poolY + 1);
      bCtx.lineTo(bx + bw - 5, poolY + 1);
      bCtx.stroke();
      bCtx.restore();

      // Label Lelehan Mentega Cair jika dominan cair
      if (meltFrac > 0.6) {
        bCtx.save();
        bCtx.fillStyle = isDark ? '#fde047' : '#b45309';
        bCtx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
        bCtx.textAlign = 'center';
        bCtx.fillText(
          currentLang === 'en' ? 'Melted Butter (Liquid)' : 'Lelehan Mentega (Cair)',
          w / 2,
          poolY - 6
        );
        bCtx.restore();
      }
    }

    // B. Balok Mentega Padat (Solid Yellow Butter Block)
    if (solidFrac > 0.02) {
      const bwBlock = 62 * mScale * Math.sqrt(solidFrac);
      const bhBlock = 34 * mScale * solidFrac;
      const blkX = w / 2 - bwBlock / 2;
      const blkY = floorY - (meltFrac * 12 * mScale) - bhBlock;
      const cornerR = Math.min(10, 3 + meltFrac * 14); // Sudut membulat melunak saat melebur!

      bCtx.save();
      // Bayangan dasar balok mentega
      bCtx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      bCtx.beginPath();
      bCtx.ellipse(w / 2, floorY - 2, bwBlock * 0.55, 5, 0, 0, Math.PI * 2);
      bCtx.fill();

      // Badan 3D Balok Mentega
      const blkGrad = bCtx.createLinearGradient(blkX, blkY, blkX, blkY + bhBlock);
      blkGrad.addColorStop(0, '#fef08a'); // Highlight creamy atas
      blkGrad.addColorStop(0.4, '#facc15'); // Kuning mentega khas
      blkGrad.addColorStop(1, '#eab308'); // Bayangan bawah
      bCtx.fillStyle = blkGrad;
      bCtx.strokeStyle = '#ca8a04';
      bCtx.lineWidth = 1.2;

      bCtx.beginPath();
      bCtx.roundRect(blkX, blkY, bwBlock, bhBlock, cornerR);
      bCtx.fill();
      bCtx.stroke();

      // Kilau cahaya atas balok
      bCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      bCtx.beginPath();
      bCtx.roundRect(blkX + 4, blkY + 2, bwBlock - 8, bhBlock * 0.35, cornerR * 0.6);
      bCtx.fill();

      // Label Balok Mentega jika masih padat
      if (solidFrac > 0.4) {
        bCtx.fillStyle = '#854d0e';
        bCtx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
        bCtx.textAlign = 'center';
        bCtx.fillText(
          currentLang === 'en' ? 'Solid Butter' : 'Mentega Padat',
          w / 2,
          blkY + bhBlock * 0.6
        );
      }
      bCtx.restore();
    }

    // C. Gelembung Letupan Mendidih / Sizzling Butter Bubbles & Desisan Uap
    if (state.temp >= 90 && state.zone === 'kompor' && !isCoolingProcess()) {
      if (Math.random() < 0.4) {
        state.bubbles.push({
          x: bx + 16 + Math.random() * (bw - 32),
          y: floorY - 6,
          r: 1.2 + Math.random() * 2.4,
          speed: 1.2 + Math.random() * 1.8
        });
      }
      if (Math.random() < 0.3) {
        state.steamParticles.push({
          x: bx + 16 + Math.random() * (bw - 32),
          y: floorY - 30,
          vx: (Math.random() - 0.5) * 0.9,
          vy: 1.0 + Math.random() * 1.5,
          r: 3 + Math.random() * 4,
          alpha: 0.45
        });
      }
    }

    // Render bubbles
    bCtx.save();
    for (let i = state.bubbles.length - 1; i >= 0; i--) {
      const b = state.bubbles[i];
      b.y -= b.speed;
      bCtx.fillStyle = 'rgba(254, 240, 138, 0.75)';
      bCtx.strokeStyle = 'rgba(202, 138, 4, 0.8)';
      bCtx.lineWidth = 0.8;
      bCtx.beginPath();
      bCtx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      bCtx.fill();
      bCtx.stroke();
      if (b.y < floorY - 34) state.bubbles.splice(i, 1);
    }
    bCtx.restore();

    // Render steam
    bCtx.save();
    for (let i = state.steamParticles.length - 1; i >= 0; i--) {
      const p = state.steamParticles[i];
      p.x += p.vx;
      p.y -= p.vy;
      p.r += 0.15;
      p.alpha -= 0.015;
      bCtx.fillStyle = `rgba(254, 249, 195, ${Math.max(0, p.alpha)})`;
      bCtx.beginPath();
      bCtx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      bCtx.fill();
      if (p.alpha <= 0 || p.y < by - 30) state.steamParticles.splice(i, 1);
    }
    bCtx.restore();

    // D. Dinding Bejana Kaca Transparan & Skala ml
    bCtx.save();
    bCtx.lineWidth = 3.2;
    bCtx.strokeStyle = isDark ? '#94a3b8' : '#64748b';
    bCtx.beginPath();
    bCtx.moveTo(bx - 4, by);
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
      const my = by + bh - mark * 22;
      bCtx.beginPath();
      bCtx.moveTo(bx + 6, my);
      bCtx.lineTo(bx + (mark % 2 === 0 ? 15 : 10), my);
      bCtx.stroke();
      if (mark % 2 === 0) bCtx.fillText(`${mark * 50}ml`, bx + 19, my + 3);
    }
    bCtx.restore();
  }

  // ========================================================
  // WADAH & ZAT 3: AIR (H2O - DEFAULT)
  // ========================================================
  else {
    const bx = w / 2 - 68;
    const by = 18;
    const bw = 136;
    const bh = 134;
    const floorY = by + bh - 4;

    const mv = getMassAndVolume();
    const pxPerMl = 0.48;
    const waterLevel = Math.max(0, mv.waterVol * pxPerMl);
    const waterSurfaceY = floorY - waterLevel;

    // Fluida Air
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

      bCtx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      bCtx.fillRect(bx + 4, waterSurfaceY, bw - 8, 2);
      bCtx.restore();
    }

    // Gelembung Mendidih
    if (state.temp >= 98 && state.vaporProgress < 1 && state.zone === 'kompor' && !isCoolingProcess()) {
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

    // Balok Es Batu 3D (Archimedes 90% terendam saat mengapung)
    if (mv.iceMass > 0.05 && state.vaporProgress < 1.0) {
      const remFrac = Math.max(0, Math.min(1, mv.iceMass / mv.massG));
      const iceScale = Math.cbrt(remFrac);
      const massScale = Math.cbrt(state.mass / 0.1);
      const baseW = 48 * massScale;
      const baseH = 36 * massScale;

      const c3Scale = Math.max(0, (remFrac - 0.35) / 0.65) * iceScale;
      const c2Scale = Math.max(0, (remFrac - 0.12) / 0.88) * iceScale;
      const c1Scale = iceScale;

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

    // Uap Air Membubung (Steam)
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

    // Beaker Kaca Transparan & Skala Mililiter
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

  // ========================================================
  // ANIMASI TERMAL: ARAH ALIRAN KALOR (MENYERAP VS MELEPAS)
  // ========================================================
  const hr = getHeatRate(state.temp, state.zone, state.flameLevel);
  const isAbsorbing = hr > 0.05 || (state.zone === 'kompor' && state.temp < sub.tMax);
  const isReleasing = hr < -0.05 || (state.zone === 'freezer' && state.temp > -9.95);
  const animT = performance.now() * 0.003;

  if (isAbsorbing) {
    // 1. Panah Kalor Masuk (+Q): Gelombang energi hangat masuk dari bawah bejana ke zat
    bCtx.save();
    const rayCount = 4;
    const startBaseX = sub.id === 'besi' ? w / 2 - 36 : w / 2 - 45;
    const raySpacing = sub.id === 'besi' ? 24 : 30;

    for (let r = 0; r < rayCount; r++) {
      const rx = startBaseX + r * raySpacing;
      const progress = ((animT * 1.6 + r * 0.28) % 1.0);
      const curY = 166 - progress * 30;
      const alpha = Math.sin(progress * Math.PI) * 0.85;

      bCtx.strokeStyle = `rgba(239, 68, 68, ${alpha})`;
      bCtx.fillStyle = `rgba(245, 158, 11, ${alpha})`;
      bCtx.lineWidth = 2.2;
      bCtx.lineCap = 'round';
      bCtx.beginPath();
      bCtx.moveTo(rx, curY + 12);
      bCtx.lineTo(rx, curY);
      bCtx.stroke();

      // Kepala Panah Mengarah ke Atas (Masuk ke wadah)
      bCtx.beginPath();
      bCtx.moveTo(rx - 3.5, curY + 4);
      bCtx.lineTo(rx, curY - 2);
      bCtx.lineTo(rx + 3.5, curY + 4);
      bCtx.closePath();
      bCtx.fill();
    }

    // Label Mini Canvas Pill: +Q Kalor Diserap
    const pillText = currentLang === 'en' ? '▲ +Q Heat Absorbed' : '▲ +Q Kalor Diserap';
    bCtx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    const pW = bCtx.measureText(pillText).width + 12;
    const pX = w - pW - 6;
    const pY = 6;
    bCtx.fillStyle = isDark ? 'rgba(69, 10, 10, 0.85)' : 'rgba(254, 242, 242, 0.9)';
    bCtx.strokeStyle = 'rgba(239, 68, 68, 0.7)';
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.roundRect(pX, pY, pW, 16, 4);
    bCtx.fill();
    bCtx.stroke();
    bCtx.fillStyle = '#ef4444';
    bCtx.textAlign = 'left';
    bCtx.fillText(pillText, pX + 6, pY + 11.5);
    bCtx.restore();

  } else if (isReleasing) {
    // 2. Panah Kalor Dilepas (-Q): Gelombang radiasi termal dingin keluar menyebar ke udara
    bCtx.save();
    const rayCount = 4;
    const startBaseX = sub.id === 'besi' ? w / 2 - 36 : w / 2 - 45;
    const raySpacing = sub.id === 'besi' ? 24 : 30;

    for (let r = 0; r < rayCount; r++) {
      const rx = startBaseX + r * raySpacing;
      const progress = ((animT * 1.3 + r * 0.25) % 1.0);
      const topOriginY = sub.id === 'besi' ? 85 : 40;
      const curY = topOriginY - progress * 26;
      const spreadX = (r - 1.5) * 6 * progress;
      const alpha = Math.sin(progress * Math.PI) * 0.85;

      bCtx.strokeStyle = `rgba(56, 189, 248, ${alpha})`;
      bCtx.fillStyle = `rgba(14, 165, 233, ${alpha})`;
      bCtx.lineWidth = 2.0;
      bCtx.lineCap = 'round';
      bCtx.beginPath();
      bCtx.moveTo(rx, curY + 12);
      bCtx.lineTo(rx + spreadX, curY);
      bCtx.stroke();

      // Kepala Panah Keluar
      const tipX = rx + spreadX;
      bCtx.beginPath();
      bCtx.moveTo(tipX - 3.5, curY + 4);
      bCtx.lineTo(tipX, curY - 2);
      bCtx.lineTo(tipX + 3.5, curY + 4);
      bCtx.closePath();
      bCtx.fill();
    }

    // Pendaran Butiran Es Dingin
    for (let f = 0; f < 3; f++) {
      const fx = (w / 2 - 45) + ((animT * 40 + f * 35) % 90);
      const fy = 50 + Math.sin(animT * 2 + f) * 16;
      bCtx.fillStyle = isDark ? 'rgba(186, 230, 253, 0.7)' : 'rgba(56, 189, 248, 0.75)';
      bCtx.beginPath();
      bCtx.arc(fx, fy, 1.2, 0, Math.PI * 2);
      bCtx.fill();
    }

    // Label Mini Canvas Pill: -Q Kalor Dilepas
    const pillText = currentLang === 'en' ? '▼ -Q Heat Released' : '▼ -Q Kalor Dilepaskan';
    bCtx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
    const pW = bCtx.measureText(pillText).width + 12;
    const pX = w - pW - 6;
    const pY = 6;
    bCtx.fillStyle = isDark ? 'rgba(8, 47, 73, 0.85)' : 'rgba(240, 249, 255, 0.9)';
    bCtx.strokeStyle = 'rgba(14, 165, 233, 0.7)';
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.roundRect(pX, pY, pW, 16, 4);
    bCtx.fill();
    bCtx.stroke();
    bCtx.fillStyle = '#0284c7';
    bCtx.textAlign = 'left';
    bCtx.fillText(pillText, pX + 6, pY + 11.5);
    bCtx.restore();

  } else {
    // 3. Setimbang Termal: Net Q = 0
    bCtx.save();
    const pillText = currentLang === 'en' ? '⚖️ Net Q = 0 (Equilibrium)' : '⚖️ Q Netto = 0 (Setimbang)';
    bCtx.font = 'bold 8.5px "Plus Jakarta Sans", sans-serif';
    const pW = bCtx.measureText(pillText).width + 10;
    const pX = w - pW - 6;
    const pY = 6;
    bCtx.fillStyle = isDark ? 'rgba(15, 23, 42, 0.85)' : 'rgba(248, 250, 252, 0.9)';
    bCtx.strokeStyle = 'rgba(148, 163, 184, 0.5)';
    bCtx.lineWidth = 1;
    bCtx.beginPath();
    bCtx.roundRect(pX, pY, pW, 15, 4);
    bCtx.fill();
    bCtx.stroke();
    bCtx.fillStyle = isDark ? '#cbd5e1' : '#64748b';
    bCtx.textAlign = 'left';
    bCtx.fillText(pillText, pX + 5, pY + 11);
    bCtx.restore();
  }
}

// --- RENDER KANVAS: MIKROSKOPIS MOLEKUL PARTIKEL (MULTI-ZAT) ---
function renderMolecules() {
  mCtx.clearRect(0, 0, moleculeCanvas.width, moleculeCanvas.height);
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;
  const isCooling = isCoolingProcess();
  const descEl = document.getElementById('moleculeDesc');

  // ========================================================
  // SUBSTANCE: BESI (Fe) - ATOMIK KISI BESI & PIJAR TERMAL
  // ========================================================
  if (sub.id === 'besi') {
    const isSmelting = state.meltProgress > 0 && state.meltProgress < 1;
    const isMolten = state.meltProgress >= 1;
    const ironCol = getIronThermalColors(state.temp);

    if (currentLang === 'en') {
      if (isMolten) descEl.textContent = 'Molten Iron: Metal atoms flow freely at 1,538°C+';
      else if (isSmelting) descEl.textContent = isCooling ? 'Solidifying: Atoms lock into metallic crystal lattice' : 'Smelting: Metallic lattice collapses into molten liquid';
      else if (state.temp >= 500) descEl.textContent = 'Thermal Incandescence: Atoms radiate visible color glow';
      else descEl.textContent = 'Solid: Iron (Fe) atoms vibrate in body-centered lattice';
    } else {
      if (isMolten) descEl.textContent = 'Besi Cair: Atom logam mengalir bebas pada 1.538°C+';
      else if (isSmelting) descEl.textContent = isCooling ? 'Membeku: Atom merapat membentuk kisi kristal logam' : 'Melebur: Kisi logam runtuh jadi cairan besi pijar';
      else if (state.temp >= 500) descEl.textContent = 'Pijar Termal: Getaran atom memancarkan radiasi cahaya';
      else descEl.textContent = 'Padat: Atom besi (Fe) bergetar teratur dalam kisi kristal';
    }

    state.particles.forEach((p, idx) => {
      if (isMolten) {
        p.x += p.vx * 2.2;
        p.y += p.vy * 2.2;
        if (p.x < 5 || p.x > moleculeCanvas.width - 5) p.vx *= -1;
        if (p.y < 5 || p.y > moleculeCanvas.height - 5) p.vy *= -1;
        mCtx.fillStyle = '#fef08a';
      } else if (isSmelting) {
        if (idx % 2 === 0) {
          p.x += p.vx * 1.2;
          p.y += p.vy * 1.2;
          if (p.x < 5 || p.x > moleculeCanvas.width - 5) p.vx *= -1;
          if (p.y < 5 || p.y > moleculeCanvas.height - 5) p.vy *= -1;
          mCtx.fillStyle = '#facc15';
        } else {
          p.x = p.baseX + (Math.random() - 0.5) * 1.2;
          p.y = p.baseY + (Math.random() - 0.5) * 1.2;
          mCtx.fillStyle = ironCol.fill;
        }
      } else {
        const vib = Math.max(0.2, (state.temp + 20) * 0.0035);
        p.x = p.baseX + (Math.random() - 0.5) * vib;
        p.y = p.baseY + (Math.random() - 0.5) * vib;
        mCtx.fillStyle = ironCol.fill;
      }

      mCtx.beginPath();
      mCtx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      mCtx.fill();
    });
  }

  // ========================================================
  // SUBSTANCE: MENTEGA - MELEBUR JADI CAIRAN EMAS & MEMBEKU
  // ========================================================
  else if (sub.id === 'mentega') {
    const isMelting = state.meltProgress > 0 && state.meltProgress < 1;
    const isLiquid = state.meltProgress >= 1 && state.temp < 110;
    const isBoiling = state.temp >= 110;

    if (currentLang === 'en') {
      if (isBoiling) descEl.textContent = 'Boiling / Sizzling: Molecules moving rapidly & vaporizing';
      else if (isLiquid) descEl.textContent = 'Liquid: Lipid molecules glide freely in molten butter';
      else if (isMelting) descEl.textContent = isCooling ? 'Freezing: Lipid chains crystallizing into solid fat' : 'Melting: Fat molecular bonds soften & loosen';
      else descEl.textContent = 'Solid: Lipid chains packed orderly in solid butter';
    } else {
      if (isBoiling) descEl.textContent = 'Mendidih/Berasap: Molekul bergerak cepat & meletup';
      else if (isLiquid) descEl.textContent = 'Cair: Molekul lemak menggelincir bebas & lincah';
      else if (isMelting) descEl.textContent = isCooling ? 'Membeku: Rantai lipid mengkristal jadi padat' : 'Melebur: Ikatan molekul lemak melunak & merenggang';
      else descEl.textContent = 'Padat: Rantai lipid tersusun rapat & bergetar teratur';
    }

    state.particles.forEach((p, idx) => {
      if (isBoiling) {
        p.x += p.vx * 3.2;
        p.y += p.vy * 3.2;
        if (p.x < 5 || p.x > moleculeCanvas.width - 5) p.vx *= -1;
        if (p.y < 5 || p.y > moleculeCanvas.height - 5) p.vy *= -1;
        mCtx.fillStyle = '#f59e0b';
      } else if (isLiquid) {
        p.x += p.vx * 1.6;
        p.y += p.vy * 1.6;
        if (p.x < 5 || p.x > moleculeCanvas.width - 5) p.vx *= -1;
        if (p.y < 5 || p.y > moleculeCanvas.height - 5) p.vy *= -1;
        mCtx.fillStyle = '#fbbf24';
      } else if (isMelting) {
        if (idx % 2 === 0) {
          p.x += p.vx * 1.1;
          p.y += p.vy * 1.1;
          if (p.x < 5 || p.x > moleculeCanvas.width - 5) p.vx *= -1;
          if (p.y < 5 || p.y > moleculeCanvas.height - 5) p.vy *= -1;
          mCtx.fillStyle = '#fbbf24';
        } else {
          p.x = p.baseX + (Math.random() - 0.5) * 0.9;
          p.y = p.baseY + (Math.random() - 0.5) * 0.9;
          mCtx.fillStyle = '#eab308';
        }
      } else {
        const vib = Math.max(0.2, (state.temp + 20) * 0.025);
        p.x = p.baseX + (Math.random() - 0.5) * vib;
        p.y = p.baseY + (Math.random() - 0.5) * vib;
        mCtx.fillStyle = '#eab308';
      }

      mCtx.beginPath();
      mCtx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      mCtx.fill();
    });
  }

  // ========================================================
  // SUBSTANCE: AIR (H2O - DEFAULT)
  // ========================================================
  else {
    const isMelting = state.meltProgress > 0 && state.meltProgress < 1;
    const isBoiling = state.vaporProgress > 0 && state.vaporProgress < 1;
    const isSolid = state.meltProgress === 0;
    const isLiquid = state.meltProgress === 1 && state.vaporProgress === 0;

    if (currentLang === 'en') {
      if (isSolid) {
        descEl.textContent = 'Solid: Molecules vibrate orderly in crystal lattice';
      } else if (isMelting) {
        descEl.textContent = isCooling
          ? 'Freezing (Heat Released): Molecules slow down & lock into ice crystal'
          : 'Melting (Heat Absorbed): Molecules gain kinetic energy & loosen';
      } else if (isLiquid) {
        descEl.textContent = isCooling
          ? 'Liquid (Heat Released): Molecular kinetic energy drops & slows'
          : 'Liquid (Heat Absorbed): Molecules move faster & glide freely';
      } else if (isBoiling) {
        descEl.textContent = isCooling
          ? 'Condensing (Heat Released): Steam molecules release heat & condense into droplets'
          : 'Boiling (Heat Absorbed): High-energy molecules break bonds & escape as steam';
      } else {
        descEl.textContent = isCooling
          ? 'Gas (Heat Released): Steam cools down and contracts'
          : 'Gas (Heat Absorbed): Molecules move rapidly and far apart';
      }
    } else {
      if (isSolid) {
        descEl.textContent = 'Padat: Molekul bergetar teratur di tempat kisi kristal';
      } else if (isMelting) {
        descEl.textContent = isCooling
          ? 'Membeku (Lepas Kalor): Molekul melambat & merapat terkunci jadi es'
          : 'Melebur (Serap Kalor): Molekul bergerak makin lincah & merenggang';
      } else if (isLiquid) {
        descEl.textContent = isCooling
          ? 'Cair (Lepas Kalor): Gerakan molekul melambat saat melepas kalor'
          : 'Cair (Serap Kalor): Molekul menyerap energi dan bergerak semakin cepat';
      } else if (isBoiling) {
        descEl.textContent = isCooling
          ? 'Mengembun (Lepas Kalor): Uap melepas kalor & merapat jadi tetesan air'
          : 'Menguap (Serap Kalor): Molekul sangat lincah memutus ikatan jadi uap';
      } else {
        descEl.textContent = isCooling
          ? 'Gas (Lepas Kalor): Uap mendingin dan merapat'
          : 'Gas (Serap Kalor): Molekul bergerak bebas, cepat & berjarak renggang';
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
          if (p.x < 5 || p.x > moleculeCanvas.width - 5) p.vx *= -1;
          if (p.y < 5 || p.y > moleculeCanvas.height - 5) p.vy *= -1;
          mCtx.fillStyle = '#3b82f6';
        } else {
          p.x = p.baseX + (Math.random() - 0.5) * 0.6;
          p.y = p.baseY + (Math.random() - 0.5) * 0.6;
          mCtx.fillStyle = '#38bdf8';
        }
      } else if (isLiquid) {
        p.x += p.vx * 1.3;
        p.y += p.vy * 1.3;
        if (p.x < 5 || p.x > moleculeCanvas.width - 5) p.vx *= -1;
        if (p.y < 5 || p.y > moleculeCanvas.height - 5) p.vy *= -1;
        mCtx.fillStyle = '#3b82f6';
      } else if (isBoiling) {
        const speedFactor = idx % 2 === 0 ? 3.6 : 1.5;
        p.x += p.vx * speedFactor;
        p.y += p.vy * speedFactor;
        if (p.x < 5 || p.x > moleculeCanvas.width - 5) p.vx *= -1;
        if (p.y < 5 || p.y > moleculeCanvas.height - 5) p.vy *= -1;
        mCtx.fillStyle = idx % 2 === 0 ? '#f97316' : '#3b82f6';
      } else {
        p.x += p.vx * 3.8;
        p.y += p.vy * 3.8;
        if (p.x < 5 || p.x > moleculeCanvas.width - 5) p.vx *= -1;
        if (p.y < 5 || p.y > moleculeCanvas.height - 5) p.vy *= -1;
        mCtx.fillStyle = '#f97316';
      }

      mCtx.beginPath();
      mCtx.arc(p.x, p.y, 4.5, 0, Math.PI * 2);
      mCtx.fill();
    });
  }
}

// --- RENDER KANVAS: GRAFIK KALOR TERHADAP SUHU (Q - T) ---
function renderGraph() {
  gCtx.clearRect(0, 0, graphCanvas.width, graphCanvas.height);
  const w = graphCanvas.width;
  const h = graphCanvas.height;
  const isDark = document.documentElement.classList.contains('dark');
  const isCooling = isCoolingProcess();
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;

  const landmarks = getLandmarks(state.mass, state.initialTemp);
  const curQ = Math.max(0, Math.min(landmarks.q5, state.curveQ));
  const curT = Math.max(landmarks.tBase, Math.min(sub.tMax, state.temp));

  // Pemetaan Landmark Berdasarkan Jenis Zat
  let pts = [];
  let segmentColors = [];

  if (sub.id === 'air') {
    // 1. AIR (A-F)
    pts = [
      { q: 0, t: landmarks.tBase, label: 'A', desc: currentLang === 'en' ? 'Ice' : 'Es' },
      { q: landmarks.q1, t: 0, label: 'B', desc: currentLang === 'en' ? '0°C Melt' : '0°C Lebur' },
      { q: landmarks.q2, t: 0, label: 'C', desc: currentLang === 'en' ? '0°C Liquid' : '0°C Cair' },
      { q: landmarks.q3, t: 100, label: 'D', desc: currentLang === 'en' ? '100°C Boil' : '100°C Didih' },
      { q: landmarks.q4, t: 100, label: 'E', desc: currentLang === 'en' ? '100°C Vapor' : '100°C Uap' },
      { q: landmarks.q5, t: 120, label: 'F', desc: currentLang === 'en' ? '120°C Vapor' : '120°C Uap' }
    ];
    segmentColors = ['#0ea5e9', '#10b981', '#2563eb', '#f59e0b', '#ef4444'];
  } else if (sub.id === 'besi') {
    // 2. BESI (A-D)
    pts = [
      { q: 0, t: landmarks.tBase, label: 'A', desc: currentLang === 'en' ? 'Solid Iron' : 'Besi Padat' },
      { q: landmarks.q1, t: sub.tMelt, label: 'B', desc: currentLang === 'en' ? '1,538°C Melt' : '1.538°C Lebur' },
      { q: landmarks.q2, t: sub.tMelt, label: 'C', desc: currentLang === 'en' ? '1,538°C Molten' : '1.538°C Cair' },
      { q: landmarks.q3, t: sub.tMax, label: 'D', desc: currentLang === 'en' ? '1,600°C Molten' : '1.600°C Cair' }
    ];
    segmentColors = ['#ea580c', '#f59e0b', '#dc2626'];
  } else {
    // 3. MENTEGA (A-F)
    pts = [
      { q: 0, t: landmarks.tBase, label: 'A', desc: currentLang === 'en' ? 'Solid Butter' : 'Mentega Padat' },
      { q: landmarks.q1, t: sub.tMelt, label: 'B', desc: currentLang === 'en' ? '34°C Melt' : '34°C Lebur' },
      { q: landmarks.q2, t: sub.tMelt, label: 'C', desc: currentLang === 'en' ? '34°C Liquid' : '34°C Cair' },
      { q: landmarks.q3, t: sub.tBoil, label: 'D', desc: currentLang === 'en' ? '120°C Boil' : '120°C Didih' },
      { q: landmarks.q4, t: sub.tBoil, label: 'E', desc: currentLang === 'en' ? '120°C Sizzle' : '120°C Berasap' },
      { q: landmarks.q5, t: sub.tMax, label: 'F', desc: currentLang === 'en' ? '130°C Hot' : '130°C Panas' }
    ];
    segmentColors = ['#f59e0b', '#10b981', '#d97706', '#b45309', '#ef4444'];
  }

  // ========================================================
  // MODE 1: FOKUS TITIK DI TENGAH (LIVE CAMERA POINT TRACKING)
  // ========================================================
  if (graphViewMode === 'focused') {
    const Cx = w / 2;
    const Cy = h / 2;

    const totalWorldW = sub.type === 'melt_boil' ? 1040 : (sub.type === 'metal_incandescence' ? 960 : 900);

    function getQWorldX(qVal) {
      if (qVal <= 0) return 0;
      if (sub.type === 'melt_boil') {
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
      } else if (sub.type === 'metal_incandescence') {
        if (qVal <= landmarks.q1) {
          return (qVal / landmarks.q1) * 400;
        } else if (qVal <= landmarks.q2) {
          return 400 + ((qVal - landmarks.q1) / Math.max(1, landmarks.q2 - landmarks.q1)) * 360;
        } else {
          const frac = Math.min(1, (qVal - landmarks.q2) / Math.max(1, landmarks.q3 - landmarks.q2));
          return 760 + frac * 200;
        }
      } else {
        if (qVal <= landmarks.q1) {
          return (qVal / landmarks.q1) * 260;
        } else if (qVal <= landmarks.q2) {
          return 260 + ((qVal - landmarks.q1) / Math.max(1, landmarks.q2 - landmarks.q1)) * 420;
        } else {
          const frac = Math.min(1, (qVal - landmarks.q2) / Math.max(1, landmarks.q3 - landmarks.q2));
          return 680 + frac * 220;
        }
      }
    }

    // Skala vertikal: untuk Besi (hingga 1.600°C) gunakan 1.35 px per °C; Air/Kamper gunakan 16.8 px per °C
    const scaleY = sub.type === 'metal_incandescence' ? 1.35 : 16.8;

    const camX = getQWorldX(curQ);
    const camY = -curT * scaleY;

    function toScreen(q, t) {
      return {
        x: Cx + (getQWorldX(q) - camX),
        y: Cy + (-t * scaleY - camY)
      };
    }

    // 1. Kisi Garis Suhu Bergerak (Horizontal)
    const tickStep = sub.type === 'metal_incandescence' ? 100 : 2;
    const minVisT = Math.floor(curT - (h / 2) / scaleY) - tickStep;
    const maxVisT = Math.ceil(curT + (h / 2) / scaleY) + tickStep;
    const startTick = Math.max(landmarks.tBase, Math.floor(minVisT / tickStep) * tickStep);
    const endTick = Math.min(sub.tMax, Math.ceil(maxVisT / tickStep) * tickStep);

    for (let tVal = startTick; tVal <= endTick; tVal += tickStep) {
      const sy = Cy + (-tVal * scaleY - camY);
      if (sy >= -10 && sy <= h + 10) {
        const isMeltPt = (sub.id === 'air' && tVal === 0) || (sub.id === 'mentega' && tVal === 34) || (sub.id === 'besi' && tVal === 1538);
        const isBoilPt = (sub.id === 'air' && tVal === 100) || (sub.id === 'mentega' && tVal === 120);
        const isMajor = sub.type === 'metal_incandescence' ? (tVal % 200 === 0) : (tVal % 10 === 0);

        gCtx.beginPath();
        if (isMeltPt || isBoilPt) {
          gCtx.lineWidth = 1.4;
          gCtx.strokeStyle = isMeltPt
            ? (isDark ? 'rgba(16, 185, 129, 0.55)' : 'rgba(16, 185, 129, 0.65)')
            : (isDark ? 'rgba(245, 158, 11, 0.55)' : 'rgba(245, 158, 11, 0.65)');
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

        // Label Indikator Suhu
        gCtx.fillStyle = isMeltPt
          ? '#10b981'
          : (isBoilPt ? '#f59e0b' : (isMajor ? (isDark ? '#cbd5e1' : '#475569') : (isDark ? '#64748b' : '#94a3b8')));
        gCtx.font = (isMeltPt || isBoilPt)
          ? 'bold 9px "Plus Jakarta Sans", sans-serif'
          : (isMajor ? '600 8.5px "Plus Jakarta Sans", sans-serif' : '7.5px "Plus Jakarta Sans", sans-serif');
        gCtx.textAlign = 'left';

        let txt = `${tVal}°C`;
        if (sub.type === 'melt_boil') {
          if (tVal === 0) txt += isCooling ? (currentLang === 'en' ? ' (Freeze)' : ' (Beku)') : (currentLang === 'en' ? ' (Melt)' : ' (Lebur)');
          else if (tVal === 100) txt += isCooling ? (currentLang === 'en' ? ' (Condense)' : ' (Embun)') : (currentLang === 'en' ? ' (Boil)' : ' (Didih)');
        } else if (sub.type === 'metal_incandescence') {
          if (tVal === 1500) txt += ' (~1538°C Lebur)';
        } else {
          if (tVal === 80) txt += isCooling ? (currentLang === 'en' ? ' (Deposit)' : ' (Deposisi)') : (currentLang === 'en' ? ' (Sublim)' : ' (Sublim)');
        }
        gCtx.fillText(txt, 8, sy - 3);
      }
    }

    // Garis Khusus Titik Lebur Besi 1.538°C
    if (sub.type === 'metal_incandescence') {
      const sy1538 = Cy + (-1538 * scaleY - camY);
      if (sy1538 >= -10 && sy1538 <= h + 10) {
        gCtx.beginPath();
        gCtx.lineWidth = 1.4;
        gCtx.strokeStyle = isDark ? 'rgba(251, 191, 36, 0.75)' : 'rgba(217, 119, 6, 0.85)';
        gCtx.setLineDash([4, 3]);
        gCtx.moveTo(0, sy1538);
        gCtx.lineTo(w, sy1538);
        gCtx.stroke();
        gCtx.setLineDash([]);

        gCtx.fillStyle = '#f59e0b';
        gCtx.font = 'bold 9px "Plus Jakarta Sans", sans-serif';
        gCtx.textAlign = 'left';
        gCtx.fillText(currentLang === 'en' ? '1,538°C (Iron Melting Point)' : '1.538°C (Titik Lebur Besi)', 8, sy1538 - 3);
      }
    }

    // 2. Garis Vertikal Milestone Kalor
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

        if (sx < w - 108) {
          gCtx.fillStyle = isDark ? '#94a3b8' : '#64748b';
          gCtx.font = '8px "Plus Jakarta Sans", sans-serif';
          gCtx.textAlign = 'center';
          gCtx.fillText((p.q / 1000).toFixed(1) + ' kJ', sx, h - 6);
        }
      }
    });

    // 3. Garis Kurva Segmen Kalor
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

    // 4. Titik Landmark
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

    // 5. RETIKEL BIDIK TENGAH
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
    const hudText = `T = ${curT.toFixed(sub.type === 'metal_incandescence' ? 0 : 1)}°C | Q = ${(state.heatTotal / 1000).toFixed(1)} kJ`;
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

    // 6. MINI-MAP PETA KESELURUHAN DI POJOK KANAN BAWAH
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
      return mmX + mmPad + (getQWorldX(q) / totalWorldW) * mmPlotW;
    }
    function mmMapY(t) {
      return mmY + mmPad + mmPlotH - ((t - landmarks.tBase) / (sub.tMax - landmarks.tBase)) * mmPlotH;
    }

    for (let i = 0; i < pts.length - 1; i++) {
      gCtx.lineWidth = 1.8;
      gCtx.strokeStyle = segmentColors[i];
      gCtx.beginPath();
      gCtx.moveTo(mmMapX(pts[i].q), mmMapY(pts[i].t));
      gCtx.lineTo(mmMapX(pts[i + 1].q), mmMapY(pts[i + 1].t));
      gCtx.stroke();
    }

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
    const mapLabel = sub.type === 'melt_boil'
      ? (currentLang === 'en' ? 'MAP A-F' : 'PETA A-F')
      : (currentLang === 'en' ? 'MAP A-D' : 'PETA A-D');
    gCtx.fillText(mapLabel, mmX + 5, mmY + mmH - 3);
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
    const minT = sub.type === 'metal_incandescence' ? -50 : -25;
    const maxT = sub.type === 'metal_incandescence' ? 1650 : 125;

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

    const overviewTicks = sub.type === 'metal_incandescence'
      ? [0, 500, 1000, 1538]
      : (sub.type === 'sublimation' ? [-10, 0, 27, 80, 120] : [-20, -10, 0, 50, 100]);

    overviewTicks.forEach(tVal => {
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

    // Live Tracker Dot
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
  const sub = SUBSTANCES[state.substance] || SUBSTANCES.air;
  const isCooling = isCoolingProcess();
  const landmarks = getLandmarks(state.mass, state.initialTemp);
  const Q = state.curveQ;

  const displayT = Math.abs(state.temp) < 0.05 ? 0.0 : state.temp;
  displayTemp.textContent = sub.type === 'metal_incandescence' ? displayT.toFixed(0) : displayT.toFixed(1);

  const kj = (state.heatTotal / 1000).toFixed(1);
  displayHeatKJ.textContent = kj;
  const unitJoule = currentLang === 'en' ? 'Joules' : 'Joule';
  const locale = currentLang === 'en' ? 'en-US' : 'id-ID';
  displayHeatJ.textContent = `(${Math.round(state.heatTotal).toLocaleString(locale)} ${unitJoule})`;

  // 1. Deteksi Arah Aliran Kalor (Menyerap Kalor vs Melepas Kalor vs Setimbang)
  const hr = getHeatRate(state.temp, state.zone, state.flameLevel);
  const isAbsorbing = hr > 0.05 || (state.zone === 'kompor' && state.temp < sub.tMax);
  const isReleasing = hr < -0.05 || (state.zone === 'freezer' && state.temp > -9.95);
  const curHeatMode = isAbsorbing ? 'abs' : (isReleasing ? 'rel' : 'eq');

  // 2. Update Badge & Ikon hanya saat mode aliran kalor berubah
  const statCardHeat = document.getElementById('statCardHeat');
  const statLabelHeat = document.getElementById('statLabelHeat');
  const displayHeatDirection = document.getElementById('displayHeatDirection');
  const heatIconBox = document.getElementById('heatIconBox');
  const badgeHeatFlow = document.getElementById('badgeHeatFlow');

  if (curHeatMode !== lastHeatFlowMode) {
    lastHeatFlowMode = curHeatMode;

    if (badgeHeatFlow) {
      if (isAbsorbing) {
        badgeHeatFlow.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-[#E5232B] dark:text-red-400 border border-red-300 dark:border-red-900/60 shadow-2xs';
        badgeHeatFlow.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-[#E5232B] animate-pulse"></span><i data-lucide="flame" class="w-3 h-3 text-[#E5232B]"></i><span id="badgeHeatFlowText">${currentLang === 'en' ? 'Heat Absorbed (+Q)' : 'Kalor Diserap (+Q)'}</span>`;
      } else if (isReleasing) {
        badgeHeatFlow.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-800 shadow-2xs';
        badgeHeatFlow.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span><i data-lucide="snowflake" class="w-3 h-3 text-sky-500"></i><span id="badgeHeatFlowText">${currentLang === 'en' ? 'Heat Released (-Q)' : 'Kalor Dilepaskan (-Q)'}</span>`;
      } else {
        badgeHeatFlow.className = 'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-700 shadow-2xs';
        badgeHeatFlow.innerHTML = `<i data-lucide="scale" class="w-3 h-3 text-slate-500"></i><span id="badgeHeatFlowText">${currentLang === 'en' ? 'Thermal Equilibrium' : 'Setimbang Termal'}</span>`;
      }
    }

    if (heatIconBox) {
      if (isAbsorbing) {
        heatIconBox.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-red-50 dark:bg-red-950/40 text-[#E5232B] flex items-center justify-center border border-red-200 dark:border-red-900/60 shrink-0';
        heatIconBox.innerHTML = '<i data-lucide="flame" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>';
      } else if (isReleasing) {
        heatIconBox.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 flex items-center justify-center border border-sky-200 dark:border-sky-800 shrink-0';
        heatIconBox.innerHTML = '<i data-lucide="snowflake" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>';
      } else {
        heatIconBox.className = 'w-7 h-7 sm:w-8 sm:h-8 rounded-md bg-slate-50 dark:bg-slate-800 text-slate-500 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0';
        heatIconBox.innerHTML = '<i data-lucide="scale" class="w-3.5 h-3.5 sm:w-4 sm:h-4"></i>';
      }
    }

    lucide.createIcons();
  }

  // 3. Update Teks & Warna Stat Card Telemetri Kalor
  if (statCardHeat && statLabelHeat && displayHeatDirection) {
    if (isAbsorbing) {
      statCardHeat.className = 'sidafi-stat-card border-l-4 border-l-[#E5232B]';
      statLabelHeat.innerHTML = currentLang === 'en' ? 'Heat Absorbed (<span class="italic font-serif font-bold">+Q</span>)' : 'Kalor Diserap (<span class="italic font-serif font-bold">+Q</span>)';
      displayHeatDirection.className = 'text-[9px] font-bold text-[#E5232B] dark:text-red-400 block truncate';
      displayHeatDirection.textContent = currentLang === 'en' ? '▲ Energy enters substance' : '▲ Energi masuk ke zat';
    } else if (isReleasing) {
      statCardHeat.className = 'sidafi-stat-card border-l-4 border-l-sky-500';
      statLabelHeat.innerHTML = currentLang === 'en' ? 'Heat Released (<span class="italic font-serif font-bold">-Q</span>)' : 'Kalor Dilepaskan (<span class="italic font-serif font-bold">-Q</span>)';
      displayHeatDirection.className = 'text-[9px] font-bold text-sky-600 dark:text-sky-400 block truncate';
      displayHeatDirection.textContent = currentLang === 'en' ? '▼ Energy escapes to ambient' : '▼ Energi keluar ke lingkungan';
    } else {
      statCardHeat.className = 'sidafi-stat-card border-l-4 border-l-slate-400';
      statLabelHeat.innerHTML = currentLang === 'en' ? 'Heat (<span class="italic font-serif font-bold">Net Q = 0</span>)' : 'Kalor (<span class="italic font-serif font-bold">Q Netto = 0</span>)';
      displayHeatDirection.className = 'text-[9px] font-bold text-slate-500 dark:text-slate-400 block truncate';
      displayHeatDirection.textContent = currentLang === 'en' ? '• Equal to ambient (ΔT = 0)' : '• Setimbang dengan sekitar (ΔT = 0)';
    }
  }

  // Update Telemetri Waktu Proses Simulasi (t)
  const displayTimeEl = document.getElementById('displayTime');
  const displayTimeSubEl = document.getElementById('displayTimeSub');
  if (displayTimeEl) {
    const totalSec = Math.max(0, Math.floor(state.simTime));
    const mm = String(Math.floor(totalSec / 60)).padStart(2, '0');
    const ss = String(totalSec % 60).padStart(2, '0');
    displayTimeEl.textContent = `${mm}:${ss}`;
  }
  if (displayTimeSubEl) {
    const unitSec = currentLang === 'en' ? 'sec' : 'detik';
    displayTimeSubEl.textContent = `${Math.max(0, state.simTime).toFixed(1)} ${unitSec}`;
  }

  // Update Status Legenda Segmen Grafik Berdasarkan Zat
  const legAB = document.getElementById('legendAB');
  const legBC = document.getElementById('legendBC');
  const legCD = document.getElementById('legendCD');
  const legDE = document.getElementById('legendDE');

  if (sub.id === 'besi') {
    if (currentLang === 'en') {
      if (legAB) legAB.textContent = isCooling ? 'A-B: Iron Cooling' : 'A-B: Solid Iron Heating';
      if (legBC) legBC.textContent = isCooling ? 'B-C: Iron Freezing' : 'B-C: Iron Smelting (1,538°C)';
      if (legCD) legCD.textContent = isCooling ? 'C-D: Molten Cooling' : 'C-D: Molten Liquid Heating';
      if (legDE) legDE.textContent = 'D: Max Temp (1,600°C)';
    } else {
      if (legAB) legAB.textContent = isCooling ? 'A-B: Besi Mendingin' : 'A-B: Besi Memanas';
      if (legBC) legBC.textContent = isCooling ? 'B-C: Besi Membeku' : 'B-C: Peleburan Besi (1.538°C)';
      if (legCD) legCD.textContent = isCooling ? 'C-D: Lelehan Mendingin' : 'C-D: Besi Cair Molten';
      if (legDE) legDE.textContent = 'D: Batas Tanur (1.600°C)';
    }
  } else if (sub.id === 'mentega') {
    if (currentLang === 'en') {
      if (legAB) legAB.textContent = isCooling ? 'A-B: Solid Butter Cooling' : 'A-B: Solid Butter Heating';
      if (legBC) legBC.textContent = isCooling ? 'B-C: Freezing (34°C)' : 'B-C: Melting (34°C)';
      if (legCD) legCD.textContent = isCooling ? 'C-D: Liquid Butter Cooling' : 'C-D: Liquid Butter Heating';
      if (legDE) legDE.textContent = isCooling ? 'D-E: Condensing' : 'D-E: Boiling & Sizzling (110°C)';
    } else {
      if (legAB) legAB.textContent = isCooling ? 'A-B: Mentega Mendingin' : 'A-B: Mentega Padat Memanas';
      if (legBC) legBC.textContent = isCooling ? 'B-C: Membeku (34°C)' : 'B-C: Melebur (34°C)';
      if (legCD) legCD.textContent = isCooling ? 'C-D: Mentega Cair Mendingin' : 'C-D: Mentega Cair Memanas';
      if (legDE) legDE.textContent = isCooling ? 'D-E: Mengembun' : 'D-E: Mendidih & Berasap (110°C)';
    }
  } else {
    // Air (H2O)
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
  }

  // Update Status Badge Fase Zat
  if (sub.id === 'besi') {
    if (currentLang === 'en') {
      if (Q < landmarks.q1) {
        const glowText = state.temp >= 500 ? ` (Incandescent ${state.temp.toFixed(0)}°C)` : ` (${state.temp.toFixed(0)}°C)`;
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${state.temp >= 500 ? 'bg-orange-500' : 'bg-slate-500'} animate-pulse"></span> Solid Iron${glowText}`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 shadow-2xs';
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Solidifying (1,538°C Constant)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Smelting (1,538°C Constant)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> Molten Liquid (${state.temp.toFixed(0)}°C)`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 shadow-2xs';
      }
    } else {
      if (Q < landmarks.q1) {
        const glowText = state.temp >= 500 ? ` (Pijar ${state.temp.toFixed(0)}°C)` : ` (${state.temp.toFixed(0)}°C)`;
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${state.temp >= 500 ? 'bg-orange-500' : 'bg-slate-500'} animate-pulse"></span> Besi Padat${glowText}`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800 shadow-2xs';
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Membeku (1.538°C Tetap)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Melebur (1.538°C Tetap)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span> Besi Cair Molten (${state.temp.toFixed(0)}°C)`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 shadow-2xs';
      }
    }
  } else if (sub.id === 'mentega') {
    if (currentLang === 'en') {
      if (Q < landmarks.q1) {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Solid Butter (${state.temp.toFixed(1)}°C)`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs';
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span> Freezing into Solid (34°C Constant)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span> Melting into Liquid (34°C Constant)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-2xs';
      } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> Liquid Melted Butter (${state.temp.toFixed(1)}°C)`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Sizzling &amp; Boiling (${state.temp.toFixed(1)}°C)`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs';
      }
    } else {
      if (Q < landmarks.q1) {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Mentega Padat (${state.temp.toFixed(1)}°C)`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs';
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span> Membeku / Memadat (34°C Tetap)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></span> Melebur Jadi Cairan (34°C Tetap)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-900 dark:text-amber-300 border border-amber-300 dark:border-amber-800 shadow-2xs';
      } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span> Mentega Cair Keemasan (${state.temp.toFixed(1)}°C)`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span> Mendidih &amp; Berasap (${state.temp.toFixed(1)}°C)`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800 shadow-2xs';
      }
    }
  } else {
    // Air (H2O)
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
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Freezing (0°C Constant)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Melting (0°C Constant)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs';
      } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Liquid (Water Cooling 100°C &rarr; 0°C)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Liquid (Water Heating 0°C &rarr; 100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs';
      } else if (Q >= landmarks.q3 && Q < landmarks.q4) {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Condensing (100°C Constant)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Boiling / Vaporizing (100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span> Gas (Steam Cooling > 100°C)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Gas (Steam > 100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800 shadow-2xs';
      }
    } else {
      if (Q < landmarks.q1) {
        badgeFaseZat.innerHTML = isCooling
          ? `<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Padat (Es Mendingin 0°C &rarr; ${minEsTemp}°C)`
          : `<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Padat (Es ${minEsTemp}°C &rarr; 0°C)`;
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 shadow-2xs';
      } else if (Q >= landmarks.q1 && Q < landmarks.q2) {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse"></span> Membeku (0°C Tetap)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Melebur (0°C Tetap)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 shadow-2xs';
      } else if (Q >= landmarks.q2 && Q < landmarks.q3) {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Cair (Air Mendingin 100°C &rarr; 0°C)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span> Cair (Air Memanas 0°C &rarr; 100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-blue-800 dark:text-blue-300 border border-blue-200 dark:border-blue-800 shadow-2xs';
      } else if (Q >= landmarks.q3 && Q < landmarks.q4) {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span> Mengembun (100°C Tetap)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Mendidih / Menguap (100°C)';
        badgeFaseZat.className = 'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-white/95 dark:bg-slate-900/95 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs';
      } else {
        badgeFaseZat.innerHTML = isCooling
          ? '<span class="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse"></span> Gas (Uap Mendingin > 100°C)'
          : '<span class="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span> Gas (Uap Air > 100°C)';
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

// --- MISI LABORATORIUM & LEMBAR TUGAS ISIAN SINGKAT ---
function switchMissionTab(tab) {
  sound.playClick();
  const tabSteps = document.getElementById('missionTabContentSteps');
  const tabWorksheet = document.getElementById('missionTabContentWorksheet');
  const btnSteps = document.getElementById('tabBtnMisiSteps');
  const btnWorksheet = document.getElementById('tabBtnMisiWorksheet');

  if (tab === 'steps') {
    if (tabSteps) tabSteps.classList.remove('hidden');
    if (tabWorksheet) tabWorksheet.classList.add('hidden');
    if (btnSteps) {
      btnSteps.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-red-500 text-white shadow-xs';
    }
    if (btnWorksheet) {
      btnWorksheet.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
    }
  } else {
    if (tabSteps) tabSteps.classList.add('hidden');
    if (tabWorksheet) tabWorksheet.classList.remove('hidden');
    if (btnWorksheet) {
      btnWorksheet.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 bg-red-500 text-white shadow-xs';
    }
    if (btnSteps) {
      btnSteps.className = 'px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800';
    }
  }
  lucide.createIcons();
}

const missionAcceptedAnswers = [
  // Q1: Titik leleh air
  ['0', '0°c', '0 c', '0 celsius', 'nol', 'zero', '0°'],
  // Q2: Titik didih air
  ['100', '100°c', '100 c', '100 celsius', 'seratus', 'hundred', 'one hundred', '100°'],
  // Q3: Gerak partikel saat menyerap kalor
  ['cepat', 'lebih cepat', 'semakin cepat', 'lincah', 'sangat cepat', 'bertambah cepat', 'fast', 'faster', 'rapid', 'rapidly', 'more rapidly', 'faster vibration', 'speed up'],
  // Q4: Jarak partikel saat menyerap kalor
  ['renggang', 'lebih renggang', 'semakin renggang', 'jauh', 'lebih jauh', 'semakin jauh', 'berjauhan', 'longgar', 'loose', 'apart', 'far', 'farther', 'further', 'more apart', 'wider'],
  // Q5: Padat -> Cair
  ['melebur', 'mencair', 'peleburan', 'pencairan', 'lebur', 'cair', 'melting', 'liquefaction', 'fusion', 'melt'],
  // Q6: Cair -> Gas
  ['menguap', 'mendidih', 'penguapan', 'pendidihan', 'didih', 'uap', 'evaporation', 'vaporization', 'boiling', 'vaporize', 'evaporate'],
  // Q7: Padat -> Gas
  ['menyublim', 'sublimasi', 'penyubliman', 'sublim', 'sublimation', 'sublime'],
  // Q8: Cair -> Padat
  ['membeku', 'pembekuan', 'beku', 'freezing', 'solidification', 'freeze'],
  // Q9: Gas -> Cair
  ['mengembun', 'kondensasi', 'pengembunan', 'embun', 'condensation', 'condensing', 'condense'],
  // Q10: Gas -> Padat
  ['mengkristal', 'deposisi', 'kristalisasi', 'desublimasi', 'pengkristalan', 'deposition', 'crystallization', 'desublimation', 'crystallize']
];

function normalizeAnswerText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()°]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function checkMissionAnswers() {
  sound.playClick();
  let correctCount = 0;
  const total = 10;
  const lang = currentLang;
  const isQCorrect = [];

  for (let i = 1; i <= total; i++) {
    const input = document.getElementById(`taskInput${i}`);
    if (!input) continue;
    const rawVal = input.value;
    const normVal = normalizeAnswerText(rawVal);
    const accepted = missionAcceptedAnswers[i - 1];

    const isCorrect = accepted.some(ans => {
      const normAns = normalizeAnswerText(ans);
      return normVal === normAns || (normVal.length >= 3 && normVal.includes(normAns));
    });

    isQCorrect[i] = isCorrect;

    input.classList.remove(
      'border-slate-300', 'dark:border-slate-700', 'dark:border-slate-600',
      'border-emerald-500', 'border-rose-400',
      'bg-emerald-50', 'dark:bg-emerald-950/40',
      'bg-rose-50', 'dark:bg-rose-950/40',
      'text-emerald-700', 'dark:text-emerald-300',
      'text-rose-700', 'dark:text-rose-300'
    );

    if (isCorrect) {
      correctCount++;
      input.classList.add('border-emerald-500', 'bg-emerald-50', 'dark:bg-emerald-950/40', 'text-emerald-700', 'dark:text-emerald-300');
    } else {
      input.classList.add('border-rose-400', 'bg-rose-50', 'dark:bg-rose-950/40', 'text-rose-700', 'dark:text-rose-300');
    }
  }

  // Update status badge per pertanyaan: hanya menunjukkan Benar atau Salah
  const setBadge = (id, isCorrect, prefix) => {
    const badge = document.getElementById(id);
    if (!badge) return;
    badge.classList.remove('hidden');
    if (isCorrect) {
      badge.className = 'text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1';
      badge.innerHTML = `<i data-lucide="check" class="w-2.5 h-2.5"></i> ${prefix ? prefix + ': ' : ''}${lang === 'en' ? 'Correct' : 'Benar'}`;
    } else {
      badge.className = 'text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-800 flex items-center gap-1';
      badge.innerHTML = `<i data-lucide="x" class="w-2.5 h-2.5"></i> ${prefix ? prefix + ': ' : ''}${lang === 'en' ? 'Incorrect' : 'Salah'}`;
    }
  };

  setBadge('statusBadgeQ1', isQCorrect[1], lang === 'en' ? 'Melt' : 'Leleh');
  setBadge('statusBadgeQ2', isQCorrect[2], lang === 'en' ? 'Boil' : 'Didih');
  setBadge('statusBadgeQ3', isQCorrect[3], lang === 'en' ? 'Motion' : 'Gerak');
  setBadge('statusBadgeQ4', isQCorrect[4], lang === 'en' ? 'Spacing' : 'Jarak');
  for (let i = 5; i <= 10; i++) {
    setBadge(`statusBadgeQ${i}`, isQCorrect[i], '');
  }

  const score = correctCount * 10;
  const scoreEl = document.getElementById('missionScoreVal');
  if (scoreEl) scoreEl.textContent = score;

  const banner = document.getElementById('missionFeedbackBanner');
  if (banner) {
    banner.classList.remove('hidden');
    let bannerColor = '';
    let bannerIcon = '';
    let bannerMsg = '';

    if (score === 100) {
      bannerColor = 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200';
      bannerIcon = 'check-circle-2';
      bannerMsg = lang === 'en' 
        ? `🎉 <strong>Outstanding!</strong> All 10 answers are correct (100%)! You have thoroughly mastered melting point, boiling point, particle dynamics, and all 6 phase change terms.`
        : `🎉 <strong>Luar Biasa!</strong> Semua 10 jawaban benar (100%)! Kamu telah menguasai konsep titik lebur, titik didih, pergerakan partikel, dan 6 proses perubahan wujud dengan tepat.`;
      if (typeof confetti === 'function') confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      sound.playChime();
    } else if (score >= 70) {
      bannerColor = 'bg-amber-50 dark:bg-amber-950/50 border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200';
      bannerIcon = 'award';
      bannerMsg = lang === 'en'
        ? `👏 <strong>Great effort!</strong> ${correctCount} of 10 answers are correct (${score}%). Check the items marked in red (Incorrect) and try to adjust your answers!`
        : `👏 <strong>Bagus!</strong> ${correctCount} dari 10 jawaban benar (${score}%). Periksa kembali jawaban yang bertanda merah (Salah) dan coba perbaiki ya!`;
    } else {
      bannerColor = 'bg-rose-50 dark:bg-rose-950/50 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200';
      bannerIcon = 'alert-triangle';
      bannerMsg = lang === 'en'
        ? `💪 <strong>Keep going!</strong> ${correctCount} of 10 answers are correct (${score}%). Review the lab missions in Tab 1 and test the simulation again to find the right answers!`
        : `💪 <strong>Tetap Semangat!</strong> ${correctCount} dari 10 jawaban benar (${score}%). Amati kembali langkah-langkah misi di Tab 1 dan coba lagi di simulasi ya!`;
    }

    banner.className = `p-3 rounded-lg border text-xs flex items-center gap-2.5 ${bannerColor}`;
    banner.innerHTML = `<i data-lucide="${bannerIcon}" class="w-4 h-4 flex-shrink-0"></i><div>${bannerMsg}</div>`;
    lucide.createIcons();
  }
}

function resetMissionAnswers() {
  sound.playClick();
  for (let i = 1; i <= 10; i++) {
    const input = document.getElementById(`taskInput${i}`);
    if (input) {
      input.value = '';
      input.classList.remove(
        'border-emerald-500', 'border-rose-400',
        'bg-emerald-50', 'dark:bg-emerald-950/40',
        'bg-rose-50', 'dark:bg-rose-950/40',
        'text-emerald-700', 'dark:text-emerald-300',
        'text-rose-700', 'dark:text-rose-300'
      );
      input.classList.add('border-slate-300', 'dark:border-slate-700');
    }
    const badge = document.getElementById(`statusBadgeQ${i}`);
    if (badge) {
      badge.innerHTML = '';
      badge.className = 'hidden';
    }
  }
  const scoreEl = document.getElementById('missionScoreVal');
  if (scoreEl) scoreEl.textContent = '0';
  const banner = document.getElementById('missionFeedbackBanner');
  if (banner) banner.classList.add('hidden');
}

function copyMissionSummary() {
  sound.playClick();
  const score = document.getElementById('missionScoreVal')?.textContent || '0';
  const q1 = document.getElementById('taskInput1')?.value || '-';
  const q2 = document.getElementById('taskInput2')?.value || '-';
  const q3 = document.getElementById('taskInput3')?.value || '-';
  const q4 = document.getElementById('taskInput4')?.value || '-';
  const q5 = document.getElementById('taskInput5')?.value || '-';
  const q6 = document.getElementById('taskInput6')?.value || '-';
  const q7 = document.getElementById('taskInput7')?.value || '-';
  const q8 = document.getElementById('taskInput8')?.value || '-';
  const q9 = document.getElementById('taskInput9')?.value || '-';
  const q10 = document.getElementById('taskInput10')?.value || '-';

  const summaryText = currentLang === 'en'
    ? `📝 [Heat & Phase Change Worksheet Results]\nScore: ${score} / 100\n1. Melting Point of Water: ${q1} °C\n2. Boiling Point of Water: ${q2} °C\n3. Particle Movement: increasingly ${q3}\n4. Particle Distance: increasingly ${q4}\n5. Solid -> Liquid: ${q5}\n6. Liquid -> Gas: ${q6}\n7. Solid -> Gas: ${q7}\n8. Liquid -> Solid: ${q8}\n9. Gas -> Liquid: ${q9}\n10. Gas -> Solid: ${q10}`
    : `📝 [Lembar Tugas Simulasi Kalor & Wujud Zat]\nSkor: ${score} / 100\n1. Titik Leleh Air: ${q1} °C\n2. Titik Didih Air: ${q2} °C\n3. Gerak Partikel: semakin ${q3}\n4. Jarak Antar Partikel: semakin ${q4}\n5. Padat -> Cair: ${q5}\n6. Cair -> Gas: ${q6}\n7. Padat -> Gas: ${q7}\n8. Cair -> Padat: ${q8}\n9. Gas -> Cair: ${q9}\n10. Gas -> Padat: ${q10}`;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(summaryText).then(() => {
      alert(currentLang === 'en' ? 'Worksheet summary copied to clipboard!' : 'Ringkasan tugas berhasil disalin ke clipboard!');
    }).catch(() => {
      prompt(currentLang === 'en' ? 'Copy your summary:' : 'Salin ringkasan tugas:', summaryText);
    });
  } else {
    prompt(currentLang === 'en' ? 'Copy your summary:' : 'Salin ringkasan tugas:', summaryText);
  }
}

// --- INISIALISASI SETELAH DOM READY ---
document.addEventListener('DOMContentLoaded', () => {
  try {
    initTheme();
    applyLanguage();

    // Dukungan Parameter URL untuk Pengujian & Deeplinking
    const urlParams = new URLSearchParams(window.location.search);
    const paramSub = urlParams.get('substance');
    const paramTemp = urlParams.get('temp');
    const paramZone = urlParams.get('zone');
    const paramLang = urlParams.get('lang');
    const paramInfo = urlParams.get('info');
    const paramMisi = urlParams.get('misi') || urlParams.get('task');
    if (paramInfo === 'open') {
      isProcessInfoOpen = true;
      const box = document.getElementById('processInfoBox');
      const btn = document.getElementById('btnProcessInfo');
      const pulse = document.getElementById('processInfoPulse');
      if (box) box.classList.remove('hidden');
      if (btn) btn.classList.add('border-amber-400', 'bg-amber-100', 'dark:bg-amber-900/60');
      if (pulse) pulse.classList.add('hidden');
      updateProcessInfo();
    }
    if (paramMisi === 'open' || paramMisi === 'steps') {
      openModal('modalMisi');
      switchMissionTab('steps');
    } else if (paramMisi === 'worksheet' || paramMisi === 'task') {
      openModal('modalMisi');
      switchMissionTab('worksheet');
    }

    if (urlParams.get('test') === 'correct') {
      openModal('modalMisi');
      switchMissionTab('worksheet');
      const in1 = document.getElementById('taskInput1'); if (in1) in1.value = '0';
      const in2 = document.getElementById('taskInput2'); if (in2) in2.value = '100';
      const in3 = document.getElementById('taskInput3'); if (in3) in3.value = 'cepat';
      const in4 = document.getElementById('taskInput4'); if (in4) in4.value = 'renggang';
      const in5 = document.getElementById('taskInput5'); if (in5) in5.value = 'melebur';
      const in6 = document.getElementById('taskInput6'); if (in6) in6.value = 'menguap';
      const in7 = document.getElementById('taskInput7'); if (in7) in7.value = 'menyublim';
      const in8 = document.getElementById('taskInput8'); if (in8) in8.value = 'membeku';
      const in9 = document.getElementById('taskInput9'); if (in9) in9.value = 'mengembun';
      const in10 = document.getElementById('taskInput10'); if (in10) in10.value = 'mengkristal';
      checkMissionAnswers();
    } else if (urlParams.get('test') === 'partial') {
      openModal('modalMisi');
      switchMissionTab('worksheet');
      const in1 = document.getElementById('taskInput1'); if (in1) in1.value = '0';
      const in2 = document.getElementById('taskInput2'); if (in2) in2.value = '80'; // sengaja salah
      const in3 = document.getElementById('taskInput3'); if (in3) in3.value = 'cepat';
      const in4 = document.getElementById('taskInput4'); if (in4) in4.value = 'rapat'; // sengaja salah
      const in5 = document.getElementById('taskInput5'); if (in5) in5.value = 'melebur';
      const in6 = document.getElementById('taskInput6'); if (in6) in6.value = 'menguap';
      const in7 = document.getElementById('taskInput7'); if (in7) in7.value = 'membeku'; // sengaja salah
      const in8 = document.getElementById('taskInput8'); if (in8) in8.value = 'membeku';
      const in9 = document.getElementById('taskInput9'); if (in9) in9.value = 'mengembun';
      const in10 = document.getElementById('taskInput10'); if (in10) in10.value = 'menyublim'; // sengaja salah
      checkMissionAnswers();
    }

    // Listener tombol Enter pada isian tugas misi
    for (let i = 1; i <= 10; i++) {
      const inp = document.getElementById(`taskInput${i}`);
      if (inp) {
        inp.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            checkMissionAnswers();
          }
        });
      }
    }
    if (paramLang === 'en' || paramLang === 'id') {
      currentLang = paramLang;
      applyLanguage();
    }

    if (paramSub && SUBSTANCES[paramSub]) {
      state.substance = paramSub;
      const sub = SUBSTANCES[paramSub];
      state.initialTemp = sub.defaultTemp;
      const subSelect = document.getElementById('substanceSelect');
      if (subSelect) subSelect.value = paramSub;
      updateTempPresetsUI();
      updateFormulaModal();
      applyLanguage();
    }

    if (paramTemp !== null && !isNaN(parseFloat(paramTemp))) {
      state.initialTemp = parseFloat(paramTemp);
    }

    const initState = getInitialThermalState(state.initialTemp, state.mass);
    state.temp = initState.temp;
    state.curveQ = initState.curveQ;
    state.heatTotal = 0;
    state.meltProgress = initState.meltProgress;
    state.vaporProgress = initState.vaporProgress;
    syncTempDropdown(state.initialTemp);

    if (paramZone) {
      setZone(paramZone);
    } else {
      if (state.initialTemp <= 0) setZone('freezer');
      else if (state.initialTemp <= 40) setZone('suhuRuang');
      else setZone('kompor');
    }

    render();
    if (urlParams.get('play') === '1' || urlParams.get('play') === 'true') {
      togglePlayPause();
    }
    requestAnimationFrame(loop);
    lucide.createIcons();
  } catch(e) {
    var b = document.createElement('div');
    b.id = 'errBox';
    b.style = 'position:fixed;top:0;left:0;right:0;background:red;color:white;z-index:99999;font-size:12px;padding:8px;font-family:monospace;white-space:pre-wrap;';
    b.textContent = 'CATCH: ' + e.message + '\n' + e.stack;
    document.body.appendChild(b);
  }
});
