import {
  AccreditationComponent,
  AccreditationItem,
  SchoolProfile,
  Teacher,
  Facility,
  NewsItem,
  StudentCohort
} from '../types';

export const INITIAL_SCHOOL_PROFILE: SchoolProfile = {
  name: 'SD Negeri 305 Maluku Tengah',
  npsn: '60100305',
  nss: '101250100305',
  status: 'Negeri',
  accreditationGrade: 'A',
  accreditationScore: 92,
  accreditationYear: 2021,
  nextAccreditationYear: 2026,
  curriculum: 'Kurikulum Merdeka Mandiri Berbagi',
  address: 'Jl. Trans Seram - Pendidikan No. 12',
  village: 'Negeri Sepa / Masohi',
  district: 'Amahai',
  regency: 'Kabupaten Maluku Tengah',
  province: 'Maluku',
  postalCode: '97516',
  email: 'sdn305malteng@kemdikbud.go.id',
  phone: '(0914) 21305',
  headmasterName: 'Drs. Rusli Latuconsina, M.Pd.',
  headmasterNip: '19740512 199803 1 004',
  headmasterSpeech: 'Selamat datang di Portal Resmi SD Negeri 305 Maluku Tengah. Sebagai satuan pendidikan di bumi Pamahanunusa, kami bertekad menghadirkan ekosistem pembelajaran yang inklusif, berakar pada kearifan budaya Maluku, dan adaptif terhadap kecakapan abad ke-21. Menyongsong visitasi akreditasi sekolah BAN-S/M, portal ini didedikasikan untuk transparansi mutu pendidikan, akuntabilitas bukti fisik, dan sinergi pendidik serta orang tua.',
  vision: 'Terwujudnya Peserta Didik yang Beriman, Bertakwa, Berakhlak Mulia, Cerdas, Terampil, dan Berwawasan Lingkungan serta Berpijak pada Budaya Maluku.',
  missions: [
    'Menumbuhkembangkan penghayatan dan pengamalan nilai-nilai keagamaan dan budi pekerti luhur dalam keseharian siswa.',
    'Menyelenggarakan proses pembelajaran aktif, kreatif, efektif, dan berdiferensiasi dengan mengoptimalkan sarana teknologi modern.',
    'Meningkatkan kompetensi profesional guru dan tenaga kependidikan secara berkelanjutan melalui komunitas belajar KKG.',
    'Membina bakat, minat, literasi, numerasi, serta prestasi peserta didik di bidang sains, seni budaya tradisional, dan olahraga.',
    'Mewujudkan tata kelola manajemen sekolah yang transparan, akuntabel, dan partisipatif berstandar BAN-S/M.',
    'Menciptakan lingkungan sekolah yang bersih, sehat, ramah anak, dan bebas dari segala bentuk kekerasan atau perundungan.'
  ],
  goals: [
    'Mencapai predikat Akreditasi A (Unggul) pada visitasi BAN-S/M mendatang.',
    'Meningkatkan rata-rata capaian literasi dan numerasi Asesmen Nasional (ANBK) di atas standar nasional.',
    'Seluruh guru menguasai pemanfaatan Platform Merdeka Mengajar (PMM) dan media ajar interaktif.',
    'Memperkuat keterlibatan komite sekolah dan masyarakat dalam pemeliharaan lingkungan belajar aman.'
  ],
  motto: 'Maju Bersama, Berkarakter Unggul, Menjaga Warisan Maluku'
};

export const ACCREDITATION_COMPONENTS: AccreditationComponent[] = [
  {
    id: 'mutu-lulusan',
    code: 'KOMP-01',
    title: 'Mutu Lulusan',
    shortDesc: 'Karakter, kedisiplinan, prestasi siswa, literasi-numerasi, kepuasan pemangku kepentingan.',
    weight: 35,
    targetScore: 94,
    iconName: 'GraduationCap',
    subStandards: [
      'Kedisiplinan & Budaya Sekolah',
      'Perilaku Religius & Toleransi',
      'Pencegahan Perundungan (Bullying)',
      'Keterampilan Abad 21 (4C)',
      'Literasi Membaca & Numerasi',
      'Prestasi Akademik & Non-Akademik'
    ]
  },
  {
    id: 'proses-pembelajaran',
    code: 'KOMP-02',
    title: 'Proses Pembelajaran',
    shortDesc: 'Kualitas KBM aktif, asesmen otentik, iklim belajar kondusif, dan pendampingan siswa.',
    weight: 29,
    targetScore: 92,
    iconName: 'BookOpenCheck',
    subStandards: [
      'Modul Ajar / RPP Berdiferensiasi',
      'Pemanfaatan Media & TIK Pembelajaran',
      'Asesmen Formatif & Sumatif',
      'Program Remedial & Pengayaan',
      'Suasana Belajar Aman & Ramah Anak'
    ]
  },
  {
    id: 'mutu-guru',
    code: 'KOMP-03',
    title: 'Mutu Guru',
    shortDesc: 'Kompetensi pedagogik, refleksi diri, sertifikasi, dan pengembangan keprofesian berkelanjutan.',
    weight: 18,
    targetScore: 90,
    iconName: 'Award',
    subStandards: [
      'Perencanaan Pembelajaran Terpadu',
      'Refleksi & Evaluasi Kinerja Guru',
      'Karya Inovasi & Media Pembelajaran',
      'Kegiatan KKG & Sertifikasi Pendidik'
    ]
  },
  {
    id: 'manajemen-sekolah',
    code: 'KOMP-04',
    title: 'Manajemen Sekolah',
    shortDesc: 'Kepemimpinan kepala sekolah, RKAS/RKS, sarpras, transparansi anggaran BOS, dan kemitraan.',
    weight: 18,
    targetScore: 93,
    iconName: 'Building2',
    subStandards: [
      'Visi-Misi & RKS / RKAS 4 Tahunan',
      'Supervisi Akademik Kepala Sekolah',
      'Pemeliharaan Sarpras & Lingkungan',
      'Transparansi Dana BOS & Kemitraan'
    ]
  }
];

export const INITIAL_ACCREDITATION_ITEMS: AccreditationItem[] = [
  // Mutu Lulusan (Butir 1 - 10)
  {
    id: 'item-1',
    componentId: 'mutu-lulusan',
    itemNumber: 1,
    title: 'Kedisiplinan Peserta Didik dalam Waktu dan Tata Tertib Sekolah',
    indicator: 'Siswa menunjukkan perilaku disiplin dalam berbagai situasi di sekolah madrasah.',
    requiredDocuments: [
      'Buku Tata Tertib Siswa SDN 305',
      'Buku Catatan Piket Harian & Rekap Ketidakhadiran',
      'Jurnal Pembiasaan 5S Pagi Hari',
      'Foto Dokumentasi Apel Pagi dan Upacara Bendera'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MUT-01/2026',
    documentTitle: 'Portofolio Kedisiplinan Siswa SDN 305 Maluku Tengah',
    documentLink: 'https://drive.google.com/drive/folders/sdn305-disiplin-sample',
    personInCharge: 'Ibu Fatimah Patty, S.Pd. (Koord. Kesiswaan)',
    notes: 'Sudah diverifikasi pengawas pembina. Lengkap dengan rekap absensi fingerprint/manual 2 semester terakhir.',
    lastUpdated: '2026-03-10'
  },
  {
    id: 'item-2',
    componentId: 'mutu-lulusan',
    itemNumber: 2,
    title: 'Perilaku Religius dan Toleransi Beragama di Lingkungan Sekolah',
    indicator: 'Siswa menunjukkan perilaku religius yang diamalkan dalam kehidupan sehari-hari dan toleransi.',
    requiredDocuments: [
      'Program Kegiatan Keagamaan (Doa bersama, Sholat dhuha/Jumat, Ibadah pagi)',
      'Peringatan Hari Besar Keagamaan (PHBI/PHBK)',
      'Catatan Perilaku Sikap Spiritual pada Rapor Pendidikan',
      'Dokumentasi Kerukunan Antar-Umat Beragama di Maluku Tengah'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MUT-02/2026',
    documentTitle: 'Dokumen Pembiasaan Religius & Moderasi Beragama',
    documentLink: 'https://drive.google.com/drive/folders/sdn305-religius',
    personInCharge: 'Bpk. Ahmad Lestaluhu, S.Pd.I (Guru PAI)',
    notes: 'Kearifan lokal "Pela Gandong" di Maluku diintegrasikan dalam budaya toleransi siswa.',
    lastUpdated: '2026-03-12'
  },
  {
    id: 'item-3',
    componentId: 'mutu-lulusan',
    itemNumber: 3,
    title: 'Tanggung Jawab dan Kerja Keras dalam Tugas dan Belajar',
    indicator: 'Siswa menunjukkan perilaku tangguh dan bertanggung jawab dalam belajar dan aktivitas.',
    requiredDocuments: [
      'Portofolio Tugas Siswa Terstruktur',
      'Laporan Kegiatan Proyek P5 Berkelompok',
      'Jurnal Ekstrakurikuler Pramuka & PMR Mula'
    ],
    status: 'Lengkap',
    scoreLevel: 3,
    documentNumber: 'DOC-MUT-03/2026',
    documentTitle: 'Dokumen Portofolio Karya dan Jurnal Tanggung Jawab Siswa',
    personInCharge: 'Ibu Maryam Tuasalamony, S.Pd. (Guru Kelas IV)',
    notes: 'Perlu penambahan beberapa foto hasil karya proyek P5 bertema kearifan lokal.',
    lastUpdated: '2026-03-11'
  },
  {
    id: 'item-4',
    componentId: 'mutu-lulusan',
    itemNumber: 4,
    title: 'Sekolah Bebas dari Perundungan (Anti-Bullying) & Kekerasan',
    indicator: 'Terciptanya iklim sekolah yang aman, nyaman, dan bebas dari perundungan.',
    requiredDocuments: [
      'SK Pembentukan TPPK (Tim Pencegahan dan Penanganan Kekerasan) SDN 305',
      'SOP Penanganan Kasus Perundungan dan Pelecehan',
      'Spanduk / Poster Deklarasi Sekolah Ramah Anak',
      'Buku Catatan Pengaduan dan Tindak Lanjut Konseling'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'SK-TPPK/421.2/012/2025',
    documentTitle: 'SK TPPK dan Panduan Sekolah Ramah Anak SDN 305',
    documentLink: 'https://kemdikbud.go.id/tppk/sdn305-malteng',
    personInCharge: 'Ibu Wa Ode Salma, S.Pd. (Koord. Konseling/Wali Kelas)',
    notes: 'Sudah terdaftar resmi di portal TPPK Kemendikbudristek.',
    lastUpdated: '2026-03-08'
  },
  {
    id: 'item-5',
    componentId: 'mutu-lulusan',
    itemNumber: 5,
    title: 'Keterampilan Komunikasi Efektif dan Berpikir Kritis',
    indicator: 'Siswa memiliki kemampuan mengemukakan pendapat, berdiskusi, dan memecahkan masalah sederhana.',
    requiredDocuments: [
      'Dokumentasi Presentasi Hasil Karya di Depan Kelas',
      'Kumpulan Majalah Dinding (Mading) Karya Puisi/Cerpen Siswa',
      'Laporan Karya Percobaan Sains Sederhana Siswa Kelas 5 & 6'
    ],
    status: 'Perlu Perbaikan',
    scoreLevel: 3,
    documentNumber: 'DOC-MUT-05/2026',
    documentTitle: 'Kumpulan Bukti Presentasi dan Unjuk Kerja Siswa',
    personInCharge: 'Bpk. Ridwan Sahupala, S.Pd. (Guru Kelas V)',
    notes: 'Masih perlu mengumpulkan video rekaman saat siswa presentasi modul IPAS.',
    lastUpdated: '2026-03-14'
  },
  {
    id: 'item-6',
    componentId: 'mutu-lulusan',
    itemNumber: 6,
    title: 'Kemampuan Kolaborasi dan Kerjasama dalam Tim',
    indicator: 'Siswa mampu bekerjasama dalam kelompok belajar, olahraga, dan seni.',
    requiredDocuments: [
      'Laporan Tugas Kelompok Kurikulum Merdeka',
      'Dokumentasi Tim Tari Tradisional Maluku Siswa',
      'Dokumentasi Tim Sepak Bola / Atletik O2SN Sekolah'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MUT-06/2026',
    documentTitle: 'Dokumentasi Kolaborasi dan Prestasi Regu Siswa',
    personInCharge: 'Bpk. Johanis Huliselan, S.Pd. (Guru PJOK)',
    notes: 'Tim tari Lenso SDN 305 meraih juara 2 tingkat kecamatan.',
    lastUpdated: '2026-03-05'
  },
  {
    id: 'item-7',
    componentId: 'mutu-lulusan',
    itemNumber: 7,
    title: 'Keterampilan Berpikir Kritis & Pemecahan Masalah',
    indicator: 'Siswa mampu menalar, menyelesaikan soal pemecahan masalah numerasi-literasi.',
    requiredDocuments: [
      'Hasil Analisis Rapor Pendidikan Asesmen Nasional (ANBK)',
      'Lembar Kerja Peserta Didik (LKPD) Berbasis HOTS',
      'Portofolio Pemecahan Masalah Matematika Kontekstual'
    ],
    status: 'Lengkap',
    scoreLevel: 3,
    documentNumber: 'DOC-MUT-07/2026',
    documentTitle: 'Berkas Portofolio HOTS & Capaian ANBK',
    personInCharge: 'Ibu Halima Tuharea, S.Pd. (Guru Kelas VI)',
    notes: 'Skor ANBK SDN 305 tahun terakhir mengalami peningkatan 14% pada numerasi.',
    lastUpdated: '2026-03-09'
  },
  {
    id: 'item-8',
    componentId: 'mutu-lulusan',
    itemNumber: 8,
    title: 'Kemampuan Literasi Membaca dan Numerasi Siswa',
    indicator: 'Siswa aktif memanfaatkan pojok baca dan perpustakaan sekolah.',
    requiredDocuments: [
      'Buku Catatan Peminjaman Buku Perpustakaan',
      'Program 15 Menit Membaca Sebelum KBM',
      'Pohon Literasi / Jurnal Resensi Buku Siswa',
      'Dokumentasi Sudut Baca di Setiap Ruang Kelas I - VI'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MUT-08/2026',
    documentTitle: 'Gerakan Literasi Sekolah (GLS) SDN 305 Maluku Tengah',
    personInCharge: 'Ibu Nurbaya Ohorella, A.Ma. (Kepala Perpustakaan)',
    notes: 'Pojok baca di semua 6 rombel telah aktif dan diperbarui tiap bulan.',
    lastUpdated: '2026-03-12'
  },
  {
    id: 'item-9',
    componentId: 'mutu-lulusan',
    itemNumber: 9,
    title: 'Prestasi Akademik dan Non-Akademik Peserta Didik',
    indicator: 'Siswa meraih prestasi di tingkat gugus, kecamatan, kabupaten, atau provinsi.',
    requiredDocuments: [
      'Buku Catatan Prestasi Siswa 3 Tahun Terakhir',
      'Fotokopi Sertifikat/Piagam Kejuaraan O2SN, FLS2N, KSN',
      'Dokumentasi Foto Piala dan Penyerahan Penghargaan'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MUT-09/2026',
    documentTitle: 'Buku Induk Rekap Prestasi dan Sertifikat Siswa',
    personInCharge: 'Drs. Rusli Latuconsina, M.Pd. & Koord. Kesiswaan',
    notes: 'Memiliki 8 piagam tingkat kabupaten dan 12 piagam tingkat kecamatan.',
    lastUpdated: '2026-03-01'
  },
  {
    id: 'item-10',
    componentId: 'mutu-lulusan',
    itemNumber: 10,
    title: 'Kepuasan Pemangku Kepentingan (Stakeholders)',
    indicator: 'Tingkat kepuasan orang tua, alumni, dan komite terhadap mutu lulusan.',
    requiredDocuments: [
      'Instrumen Kuesioner Kepuasan Orang Tua & Komite',
      'Rekap Hasil Angket Kepuasan Lulusan',
      'Laporan Tracer Study Siswa yang Melanjutkan ke SMP/MTs'
    ],
    status: 'Perlu Perbaikan',
    scoreLevel: 3,
    documentNumber: 'DOC-MUT-10/2026',
    documentTitle: 'Laporan Survei Kepuasan Pemangku Kepentingan SDN 305',
    personInCharge: 'Bpk. Salim Wakano, S.Pd. (Ketua Tim Akreditasi)',
    notes: 'Angket tahun ajaran berjalan baru terkumpul 78 responden, ditargetkan minimal 100 orang tua.',
    lastUpdated: '2026-03-14'
  },

  // Komponen Proses Pembelajaran (Butir 11 - 18)
  {
    id: 'item-11',
    componentId: 'proses-pembelajaran',
    itemNumber: 11,
    title: 'Penyusunan RPP / Modul Ajar Kurikulum Merdeka yang Lengkap',
    indicator: 'Guru menyusun perencanaan pembelajaran aktif, kreatif, dan berdiferensiasi.',
    requiredDocuments: [
      'Kumpulan Modul Ajar Kelas I s.d. VI Lengkap',
      'Program Semester (Promes) dan Program Tahunan (Prota)',
      'Alur Tujuan Pembelajaran (ATP) dan Capaian Pembelajaran (CP)',
      'Instrumen Validasi Modul Ajar oleh Pengawas Pembina'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-PROS-01/2026',
    documentTitle: 'Bundel Modul Ajar & Perangkat Pembelajaran Semester Ganjil/Genap',
    personInCharge: 'Ibu Maryam Tuasalamony, S.Pd.',
    notes: 'Seluruh guru kelas sudah mengunggah modul ajar ke drive bersama sekolah.',
    lastUpdated: '2026-03-10'
  },
  {
    id: 'item-12',
    componentId: 'proses-pembelajaran',
    itemNumber: 12,
    title: 'Pemanfaatan Sarana, Lingkungan, dan Media Pembelajaran Digital',
    indicator: 'Guru memanfaatkan Chromebook, proyektor, internet, dan lingkungan alam Maluku.',
    requiredDocuments: [
      'Jadwal Penggunaan Perangkat Chromebook / Laptop Bantuan Kemdikbud',
      'Dokumentasi Pembelajaran Berbasis TIK di Kelas',
      'Daftar Media Pembelajaran Konkret dan Lingkungan Pesisir/Kebun Sekolah'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-PROS-02/2026',
    documentTitle: 'Logbook Penggunaan TIK & Media Interaktif KBM',
    personInCharge: 'Bpk. Faisal Marasabessy, S.Kom. (Operator & Teknisi TIK)',
    notes: 'Sekolah memiliki 15 unit Chromebook aktif yang dimanfaatkan bergantian.',
    lastUpdated: '2026-03-11'
  },
  {
    id: 'item-13',
    componentId: 'proses-pembelajaran',
    itemNumber: 13,
    title: 'Pelaksanaan Asesmen Otentik (Formatif dan Sumatif)',
    indicator: 'Guru menerapkan penilaian proses, sikap, keterampilan, dan kognitif secara teratur.',
    requiredDocuments: [
      'Kisi-kisi dan Naskah Soal Asesmen Sumatif Tengah/Akhir Semester',
      'Rubrik Penilaian Unjuk Kerja, Proyek, dan Portofolio',
      'Buku Daftar Nilai Guru dan Analisis Hasil Ulangan',
      'Buku Rapor Hasil Belajar Siswa'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-PROS-03/2026',
    documentTitle: 'Dokumen Asesmen Pembelajaran & Kisi-kisi Evaluasi Siswa',
    personInCharge: 'Ibu Fatimah Patty, S.Pd.',
    notes: 'Rubrik penilaian proyek P5 telah dilengkapi asesmen diri siswa.',
    lastUpdated: '2026-03-07'
  },
  {
    id: 'item-14',
    componentId: 'proses-pembelajaran',
    itemNumber: 14,
    title: 'Program Remedial dan Pengayaan bagi Siswa',
    indicator: 'Guru memfasilitasi bimbingan khusus bagi siswa yang belum tuntas dan pengayaan bagi yang unggul.',
    requiredDocuments: [
      'Program Kerja Remedial dan Pengayaan Guru',
      'Daftar Hadir dan Jadwal Bimbingan Khusus Sore/Pagi',
      'Dokumentasi Soal Remedial dan Bukti Peningkatan Nilai'
    ],
    status: 'Perlu Perbaikan',
    scoreLevel: 3,
    documentNumber: 'DOC-PROS-04/2026',
    documentTitle: 'Berkas Remedial & Pengayaan Semester Ganjil',
    personInCharge: 'Bpk. Ridwan Sahupala, S.Pd.',
    notes: 'Catatan bimbingan untuk kelas 2 dan 3 perlu dirapikan dalam format tabel resmi.',
    lastUpdated: '2026-03-13'
  },
  {
    id: 'item-15',
    componentId: 'proses-pembelajaran',
    itemNumber: 15,
    title: 'Iklim Kelas yang Kondusif, Nyaman, dan Bersih',
    indicator: 'Penataan kelas mendorong keaktifan siswa dan kebersihan lingkungan belajar.',
    requiredDocuments: [
      'SOP Kesepakatan / Keyakinan Kelas di Setiap Ruang Belajar',
      'Jadwal Regu Kerja Piket Kebersihan Siswa',
      'Foto Denah Tata Ruang Kelas yang Fleksibel (Kelompok/U-Shape)'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-PROS-05/2026',
    documentTitle: 'Panduan Keyakinan Kelas & Manajemen Lingkungan Belajar',
    personInCharge: 'Ibu Halima Tuharea, S.Pd.',
    notes: 'Keyakinan kelas telah terpasang di dinding kelas I s.d. VI.',
    lastUpdated: '2026-03-09'
  },

  // Komponen Mutu Guru (Butir 19 - 22)
  {
    id: 'item-19',
    componentId: 'mutu-guru',
    itemNumber: 19,
    title: 'Evaluasi Diri, Refleksi Pembelajaran, dan Supervisi Akademik Guru',
    indicator: 'Guru rutin mengevaluasi metode pembelajaran dan menindaklanjuti hasil supervisi kepala sekolah.',
    requiredDocuments: [
      'Jurnal Refleksi Mengajar Mingguan Guru',
      'Instrumen Hasil Supervisi Akademik oleh Kepala Sekolah',
      'Rencana Tindak Lanjut (RTL) Pasca Supervisi',
      'Notula Rapat Dewan Guru Evaluasi KBM'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-GUR-01/2026',
    documentTitle: 'Laporan Supervisi Akademik & Jurnal Refleksi Pendidik',
    personInCharge: 'Drs. Rusli Latuconsina, M.Pd. (Kepala Sekolah)',
    notes: 'Supervisi klinis semester lalu terlaksana 100% untuk 11 guru.',
    lastUpdated: '2026-03-12'
  },
  {
    id: 'item-20',
    componentId: 'mutu-guru',
    itemNumber: 20,
    title: 'Pengembangan Keprofesian Berkelanjutan (PKB) dan PMM',
    indicator: 'Guru aktif mengikuti pelatihan, webinar, komunitas belajar KKG, dan Platform Merdeka Mengajar.',
    requiredDocuments: [
      'Rekap Sertifikat Pelatihan/Workshop Guru (Minimal 32 JP)',
      'Bukti Aksi Nyata dan Sertifikat PMM (Platform Merdeka Mengajar)',
      'SK dan Notula Kegiatan Komunitas Belajar (Kombel) Guru SDN 305',
      'Dokumentasi Kehadiran di KKG Gugus Masohi / Maluku Tengah'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-GUR-02/2026',
    documentTitle: 'Portofolio Pengembangan Diri & Sertifikat Pelatihan Guru',
    personInCharge: 'Ibu Fatimah Patty, S.Pd. (Ketua Kombel)',
    notes: '80% guru telah memperoleh sertifikat topik kurikulum merdeka di PMM.',
    lastUpdated: '2026-03-10'
  },
  {
    id: 'item-21',
    componentId: 'mutu-guru',
    itemNumber: 21,
    title: 'Pengembangan Inovasi dan Karya Media Pembelajaran',
    indicator: 'Guru membuat media ajar inovatif, modul mandiri, atau video pembelajaran interaktif.',
    requiredDocuments: [
      'Dokumentasi Alat Peraga / Media Buatan Guru',
      'Modul Ajar Kontekstual Berbasis Kearifan Lokal Maluku',
      'Kanal Video Pembelajaran YouTube / Drive Sekolah'
    ],
    status: 'Perlu Perbaikan',
    scoreLevel: 3,
    documentNumber: 'DOC-GUR-03/2026',
    documentTitle: 'Dokumentasi Karya Inovasi Media Ajar Pendidik',
    personInCharge: 'Bpk. Johanis Huliselan, S.Pd.',
    notes: 'Perlu menyusun deskripsi tertulis narasi inovasi untuk 3 alat peraga matematika dan IPA.',
    lastUpdated: '2026-03-14'
  },
  {
    id: 'item-22',
    componentId: 'mutu-guru',
    itemNumber: 22,
    title: 'Penyebarluasan Praktik Baik (Best Practice) Guru',
    indicator: 'Guru berbagi pengalaman mengajar di KKG atau forum ilmiah satuan pendidikan.',
    requiredDocuments: [
      'Naskah Laporan Praktik Baik (Best Practice) Pembelajaran',
      'Surat Tugas / Sertifikat sebagai Narasumber di KKG / Webinar',
      'Foto Dokumentasi Berbagi Praktik Baik'
    ],
    status: 'Belum Lengkap',
    scoreLevel: 2,
    documentNumber: 'DOC-GUR-04/2026',
    documentTitle: 'Kumpulan Naskah Best Practice Pembelajaran',
    personInCharge: 'Ibu Maryam Tuasalamony, S.Pd.',
    notes: 'Sedang disusun oleh tim guru kelas 1 dan kelas 4. Target selesai akhir bulan ini.',
    lastUpdated: '2026-03-15'
  },

  // Komponen Manajemen Sekolah (Butir 23 - 32)
  {
    id: 'item-23',
    componentId: 'manajemen-sekolah',
    itemNumber: 23,
    title: 'Visi, Misi, Tujuan, dan Rencana Kerja Sekolah (RKS / RKAS)',
    indicator: 'Sekolah memiliki RKS 4 tahunan dan RKAS tahunan yang disusun bersama komite.',
    requiredDocuments: [
      'Dokumen Rencana Kerja Jangka Menengah (RKS 4 Tahun) 2024-2028',
      'Dokumen Rencana Kerja dan Anggaran Sekolah (RKAS) Tahun 2025/2026',
      'SK Tim Pengembang Kurikulum dan Perencanaan Sekolah',
      'Berita Acara, Daftar Hadir, dan Notula Rapat Sosialisasi Visi Misi'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MAN-01/2026',
    documentTitle: 'Dokumen RKS & RKAS Resmi SDN 305 Maluku Tengah',
    personInCharge: 'Drs. Rusli Latuconsina, M.Pd. & Bpk. Salim Wakano, S.Pd.',
    notes: 'Telah disetujui Dinas Pendidikan dan Kebudayaan Kabupaten Maluku Tengah.',
    lastUpdated: '2026-03-02'
  },
  {
    id: 'item-24',
    componentId: 'manajemen-sekolah',
    itemNumber: 24,
    title: 'Kepemimpinan dan Pengawasan Sekolah yang Partisipatif',
    indicator: 'Kepala sekolah melibatkan dewan guru, komite, dan tenaga kependidikan dalam pengambilan keputusan.',
    requiredDocuments: [
      'Buku Notula Rapat Dinas Bulanan Sekolah',
      'SK Pembagian Tugas Guru dan Tenaga Kependidikan',
      'Struktur Organisasi Sekolah dan Uraian Tugas (Job Description)',
      'Dokumentasi Forum Konsultasi Bersama Komite'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MAN-02/2026',
    documentTitle: 'Buku Pedoman Tata Kelola & Struktur Organisasi Sekolah',
    personInCharge: 'Drs. Rusli Latuconsina, M.Pd.',
    notes: 'Bagan struktur terpampang di ruang kepala sekolah dan kantor guru.',
    lastUpdated: '2026-03-06'
  },
  {
    id: 'item-25',
    componentId: 'manajemen-sekolah',
    itemNumber: 25,
    title: 'Kurikulum Operasional Satuan Pendidikan (KOSP) yang Sah',
    indicator: 'KOSP dikembangkan sesuai panduan Kurikulum Merdeka dan memuat kearifan lokal Maluku Tengah.',
    requiredDocuments: [
      'Buku Dokumen 1 KOSP Tahun Ajaran 2025/2026 Disahkan Dinas',
      'SK Pemberlakuan KOSP oleh Kepala Sekolah',
      'Lembar Rekomendasi Pengawas Sekolah Maluku Tengah',
      'Lampiran Silabus / ATP Muatan Lokal Seni Budaya Maluku'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MAN-03/2026',
    documentTitle: 'KOSP SDN 305 Maluku Tengah TA 2025/2026',
    personInCharge: 'Ibu Fatimah Patty, S.Pd. (Koord. Kurikulum)',
    notes: 'Sudah disahkan dan ditandatangani Kepala Dinas Pendidikan Maluku Tengah.',
    lastUpdated: '2026-03-01'
  },
  {
    id: 'item-26',
    componentId: 'manajemen-sekolah',
    itemNumber: 26,
    title: 'Pengelolaan Sarana dan Prasarana Berkelanjutan',
    indicator: 'Sarana terpelihara dengan baik, aman, dan inventaris barang tercatat rapi.',
    requiredDocuments: [
      'Buku Inventaris Barang (KIB A, B, C, D, E) Sekolah',
      'Buku Catatan Pemeliharaan dan Perbaikan Gedung/Fasilitas',
      'SOP Penggunaan Laboratorium Komputer dan Perpustakaan',
      'Denah Keselamatan, Evakuasi Kebencanaan, dan Titik Kumpul'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MAN-04/2026',
    documentTitle: 'Buku Inventaris Sarpras & Program Pemeliharaan Gedung',
    personInCharge: 'Bpk. Faisal Marasabessy, S.Kom. (Pengelola Sarpras)',
    notes: 'Seluruh aset sekolah berlabel barcode inventaris dinas.',
    lastUpdated: '2026-03-08'
  },
  {
    id: 'item-27',
    componentId: 'manajemen-sekolah',
    itemNumber: 27,
    title: 'Transparansi Pembiayaan dan Pengelolaan Dana BOS',
    indicator: 'Sekolah mengumumkan RKAS dan Laporan Pertanggungjawaban (LPJ) secara transparan.',
    requiredDocuments: [
      'Laporan Realisasi Penggunaan Dana BOS K7 / BKU Online',
      'Foto Papan Pengumuman Penggunaan Dana BOS di Dinding Sekolah',
      'Kwitansi dan Bukti Transaksi Pengadaan Barang/Jasa (SiPLah)',
      'Laporan Hasil Audit Inspektorat / Dinas Pendidikan'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MAN-05/2026',
    documentTitle: 'Laporan Pertanggungjawaban Dana BOS Reguler 2025',
    personInCharge: 'Ibu Nurbaya Ohorella (Bendahara BOS)',
    notes: 'Laporan BKU BOS telah diverifikasi dan bebas temuan.',
    lastUpdated: '2026-03-11'
  },
  {
    id: 'item-28',
    componentId: 'manajemen-sekolah',
    itemNumber: 28,
    title: 'Kemitraan dan Kerjasama dengan Masyarakat / Lembaga Terkait',
    indicator: 'Sekolah menjalin kemitraan dengan Puskesmas, Polsek/Babinsa, sanggar seni, dan alumni.',
    requiredDocuments: [
      'Naskah Perjanjian Kerjasama (MoU) dengan Puskesmas Setempat (BIAS/UKS)',
      'MoU Pembinaan Karakter dengan Kepolisian / Koramil',
      'Dokumentasi Kegiatan Penyuluhan Kesehatan Gigi dan Gizi Anak',
      'Laporan Partisipasi Orang Tua dalam Peringatan Hari Pendidikan'
    ],
    status: 'Lengkap',
    scoreLevel: 4,
    documentNumber: 'DOC-MAN-06/2026',
    documentTitle: 'Bundel MoU Kemitraan Strategis SDN 305',
    personInCharge: 'Bpk. Salim Wakano, S.Pd.',
    notes: 'MoU terbaru dengan Puskesmas Amahai/Masohi dan Sanggar Seni Maluku aktif berjalan.',
    lastUpdated: '2026-03-04'
  }
];

export const INITIAL_TEACHERS: Teacher[] = [
  {
    id: 't-1',
    name: 'Drs. Rusli Latuconsina, M.Pd.',
    nip: '19740512 199803 1 004',
    nuptk: '3442752654200022',
    role: 'Kepala Sekolah',
    education: 'S2 Magister Manajemen Pendidikan',
    certificationStatus: 'Tersertifikasi',
    gender: 'Laki-laki',
    assignedClass: 'Manajemen Satuan Pendidikan',
    phone: '0812-4758-XXXX',
    achievements: ['Kepala Sekolah Berprestasi Tingkat Kab. Maluku Tengah', 'Asesor Guru Penggerak'],
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't-2',
    name: 'Fatimah Patty, S.Pd.',
    nip: '19810815 200604 2 018',
    nuptk: '4532759660300013',
    role: 'Guru Kelas I (Koordinator Kurikulum)',
    education: 'S1 PGSD Universitas Pattimura',
    certificationStatus: 'Tersertifikasi',
    gender: 'Perempuan',
    assignedClass: 'Kelas 1 (Fase A)',
    achievements: ['Guru Penggerak Angkatan 7', 'Finalis Inovasi Pembelajaran SD'],
    photoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't-3',
    name: 'Maryam Tuasalamony, S.Pd.',
    nip: '19840320 200902 2 009',
    nuptk: '6741762664300021',
    role: 'Guru Kelas IV (Koordinator P5)',
    education: 'S1 PGSD FKIP',
    certificationStatus: 'Tersertifikasi',
    gender: 'Perempuan',
    assignedClass: 'Kelas 4 (Fase B)',
    photoUrl: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't-4',
    name: 'Ahmad Lestaluhu, S.Pd.I',
    nip: '19861105 201101 1 007',
    nuptk: '8953764665200003',
    role: 'Guru Pendidikan Agama Islam (PAI)',
    education: 'S1 Pendidikan Agama Islam IAIN Ambon',
    certificationStatus: 'Tersertifikasi',
    gender: 'Laki-laki',
    assignedClass: 'Semua Kelas (I - VI)',
    achievements: ['Pembina Juara 1 MTQ Pelajar Tingkat Kecamatan'],
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't-5',
    name: 'Johanis Huliselan, S.Pd.',
    nip: '19890414 201503 1 002',
    nuptk: '1246767668200012',
    role: 'Guru PJOK & Pembina Olahraga',
    education: 'S1 Pendidikan Jasmani & Kesehatan',
    certificationStatus: 'Tersertifikasi',
    gender: 'Laki-laki',
    assignedClass: 'Semua Kelas (I - VI)',
    achievements: ['Pelatih Atletik Juara O2SN Kab. Maluku Tengah'],
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't-6',
    name: 'Halima Tuharea, S.Pd.',
    nip: '19870618 201402 2 004',
    nuptk: '5639765666300022',
    role: 'Guru Kelas VI (Koord. Persiapan ANBK)',
    education: 'S1 Pendidikan Guru Sekolah Dasar',
    certificationStatus: 'Tersertifikasi',
    gender: 'Perempuan',
    assignedClass: 'Kelas 6 (Fase C)',
    photoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't-7',
    name: 'Ridwan Sahupala, S.Pd.',
    nip: '19920210 201903 1 011',
    nuptk: '3448770671130083',
    role: 'Guru Kelas V',
    education: 'S1 PGSD Universitas Negeri',
    certificationStatus: 'Dalam Proses',
    gender: 'Laki-laki',
    assignedClass: 'Kelas 5 (Fase C)',
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't-8',
    name: 'Wa Ode Salma, S.Pd.',
    nip: '19940925 202012 2 015',
    nuptk: '7851772673230042',
    role: 'Guru Kelas II & Pembina UKS',
    education: 'S1 PGSD',
    certificationStatus: 'Dalam Proses',
    gender: 'Perempuan',
    assignedClass: 'Kelas 2 (Fase A)',
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't-9',
    name: 'Salim Wakano, S.Pd.',
    nip: '19830704 200801 1 012',
    nuptk: '9045761663200033',
    role: 'Guru Kelas III & Ketua Tim Akreditasi',
    education: 'S1 PGSD',
    certificationStatus: 'Tersertifikasi',
    gender: 'Laki-laki',
    assignedClass: 'Kelas 3 (Fase B)',
    photoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't-10',
    name: 'Faisal Marasabessy, S.Kom.',
    nip: '19951201 202203 1 005',
    nuptk: '2153773674130092',
    role: 'Operator Dapodik & Pengelola TIK / Sarpras',
    education: 'S1 Sistem Informasi',
    certificationStatus: 'Belum',
    gender: 'Laki-laki',
    assignedClass: 'Administrasi & Lab Komputer',
    photoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400'
  },
  {
    id: 't-11',
    name: 'Nurbaya Ohorella, A.Ma.',
    nip: '19850110 201001 2 021',
    nuptk: '4351763665300012',
    role: 'Kepala Perpustakaan & Bendahara BOS',
    education: 'D3 Perpustakaan & Ilmu Informasi',
    certificationStatus: 'Tersertifikasi',
    gender: 'Perempuan',
    assignedClass: 'Perpustakaan Sekolah',
    photoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=400'
  }
];

export const INITIAL_FACILITIES: Facility[] = [
  {
    id: 'fac-1',
    name: 'Ruang Kelas I - VI (6 Rombongan Belajar)',
    category: 'Ruang Pembelajaran',
    quantity: 6,
    condition: 'Baik',
    areaSqm: 384,
    meetsPermendikbud: true,
    notes: 'Dilengkapi pencahayaan alami, sirkulasi udara optimal, papan tulis ganda, dan pojok baca di setiap ruang.',
    photoUrl: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fac-2',
    name: 'Perpustakaan Sekolah "Cahaya Ilmu"',
    category: 'Ruang Penunjang',
    quantity: 1,
    condition: 'Baik',
    areaSqm: 72,
    meetsPermendikbud: true,
    notes: 'Koleksi 2.450 judul buku, area baca lesehan berkarpet, katalog digital sederhana, dan majalah anak.',
    photoUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fac-3',
    name: 'Laboratorium Digital / Ruang Komputer & ANBK',
    category: 'Teknologi & Digital',
    quantity: 1,
    condition: 'Baik',
    areaSqm: 64,
    meetsPermendikbud: true,
    notes: '15 unit Chromebook bantuan Kemdikbudristek, 1 server lokal, proyektor LCD, dan jaringan internet Wi-Fi 50 Mbps.',
    photoUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fac-4',
    name: 'Ruang Kepala Sekolah & Kantor Dewan Guru',
    category: 'Ruang Penunjang',
    quantity: 2,
    condition: 'Baik',
    areaSqm: 80,
    meetsPermendikbud: true,
    notes: 'Dilengkapi lemari arsip dokumen bukti fisik akreditasi, meja rapat dewan guru, dan papan statistik sekolah.',
    photoUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fac-5',
    name: 'Lapangan Upacara & Olahraga Serbaguna',
    category: 'Sanitasi & Olahraga',
    quantity: 1,
    condition: 'Baik',
    areaSqm: 600,
    meetsPermendikbud: true,
    notes: 'Lantai semen halus untuk upacara bendera, senam bersama, lapangan voli, bulu tangkis, dan lompat jauh.',
    photoUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fac-6',
    name: 'Ruang UKS (Usaha Kesehatan Sekolah)',
    category: 'Ruang Penunjang',
    quantity: 1,
    condition: 'Baik',
    areaSqm: 24,
    meetsPermendikbud: true,
    notes: '2 tempat tidur periksa, timbangan badan, pengukur tinggi badan, kotak P3K lengkap, dan wastafel cuci tangan.',
    photoUrl: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fac-7',
    name: 'Toilet Terpisah Siswa & Guru (Ramah Anak)',
    category: 'Sanitasi & Olahraga',
    quantity: 6,
    condition: 'Baik',
    areaSqm: 36,
    meetsPermendikbud: true,
    notes: 'Rasio jamban sesuai Permendikbud: 3 bilik toilet laki-laki dan 3 bilik toilet perempuan dengan air bersih mengalir lancar.',
    photoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=600'
  },
  {
    id: 'fac-8',
    name: 'Taman Sekolah & Rumah Budaya P5 (Kearifan Maluku)',
    category: 'Ruang Pembelajaran',
    quantity: 1,
    condition: 'Baik',
    areaSqm: 120,
    meetsPermendikbud: true,
    notes: 'Area budidaya tanaman obat keluarga (TOGA), sayuran hidroponik, dan gazebo belajar luar kelas (outdoor learning).',
    photoUrl: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&q=80&w=600'
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Rapat Koordinasi Persiapan Visitasi Akreditasi BAN-S/M Tahun 2026 Bersama Pengawas Pembina',
    slug: 'rapat-persiapan-akreditasi-ban-sm-2026',
    category: 'Akreditasi',
    date: '10 Maret 2026',
    author: 'Admin Akreditasi',
    summary: 'SDN 305 Maluku Tengah menggelar rapat koordinasi pembagian tim penyusunan dokumen bukti fisik 4 komponen IASP.',
    content: `Dalam rangka menyongsong agenda visitasi akreditasi satuan pendidikan oleh Badan Akreditasi Nasional Sekolah/Madrasah (BAN-S/M), SDN 305 Maluku Tengah menyelenggarakan Rapat Kerja Khusus Akreditasi yang dipimpin langsung oleh Kepala Sekolah Drs. Rusli Latuconsina, M.Pd. dan didampingi Pengawas Pembina Dinas Pendidikan dan Kebudayaan Kabupaten Maluku Tengah.

Rapat ini memetakan kelengkapan 35 butir instrumen IASP yang mencakup:
1. Mutu Lulusan (Ketua: Ibu Fatimah Patty, S.Pd.)
2. Proses Pembelajaran (Ketua: Ibu Maryam Tuasalamony, S.Pd.)
3. Mutu Guru (Ketua: Bpk. Johanis Huliselan, S.Pd.)
4. Manajemen Sekolah (Ketua: Bpk. Salim Wakano, S.Pd.)

Kepala Sekolah menegaskan komitmen seluruh dewan guru untuk menyajikan data otentik dan portofolio terbaik demi mempertahankan serta meningkatkan akreditasi sekolah menuju predikat A (Unggul).`,
    imageUrl: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&q=80&w=800',
    isImportant: true
  },
  {
    id: 'news-2',
    title: 'Simulasi Asesmen Nasional (ANBK) Berjalan Tertib di Laboratorium Komputer SDN 305',
    slug: 'simulasi-anbk-berjalan-tertib',
    category: 'Kegiatan',
    date: '05 Maret 2026',
    author: 'Tim TIK Sekolah',
    summary: 'Siswa kelas V mengikuti simulasi ANBK berbasis komputer menggunakan 15 unit Chromebook dengan lancar.',
    content: `Sebanyak 30 siswa kelas V terpilih sebagai sampel Asesmen Nasional Berbasis Komputer (ANBK) tahun 2026 telah tuntas melaksanakan simulasi literasi dan numerasi di ruang laboratorium komputer SDN 305 Maluku Tengah.

Kegiatan berjalan lancar berkat dukungan jaringan internet berkecepatan tinggi serta pendampingan proktor dan teknisi sekolah. Asesmen ini menjadi instrumen penting dalam memotret Rapor Pendidikan SDN 305 pada sub-indikator Mutu Lulusan dan Iklim Belajar.`,
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&q=80&w=800',
    isImportant: false
  },
  {
    id: 'news-3',
    title: 'Gelar Karya Proyek P5: Eksplorasi Seni Budaya Tradisional & Kearifan Maritim Maluku',
    slug: 'gelar-karya-p5-kearifan-maluku',
    category: 'Prestasi',
    date: '24 Februari 2026',
    author: 'Koordinator P5',
    summary: 'Pameran kreativitas siswa bertema kearifan lokal menghadirkan tarian Lenso, kerajinan kulit kerang, dan kuliner sagu tradisional.',
    content: `Halaman upacara SDN 305 Maluku Tengah semarak dengan perhelatan Gelar Karya Projek Penguatan Profil Pelajar Pancasila (P5). Para siswa dari kelas I hingga VI memamerkan aneka hasil olahan karya orisinil mereka.

Acara dibuka secara resmi oleh perwakilan Komite Sekolah dan dihadiri oleh para orang tua murid. Melalui proyek ini, peserta didik tidak hanya diasah keterampilan kreativitas dan kolaborasinya, namun juga ditanamkan rasa bangga terhadap warisan luhur tanah Maluku.`,
    imageUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=800',
    isImportant: false
  },
  {
    id: 'news-4',
    title: 'Pencanangan Gerakan 15 Menit Membaca dan Penataan Sudut Baca Kelas Ramah Anak',
    slug: 'gerakan-15-menit-membaca-sudut-baca',
    category: 'Kurikulum',
    date: '15 Februari 2026',
    author: 'Pengelola Perpustakaan',
    summary: 'Komitmen meningkatkan indeks literasi siswa melalui pembiasaan membaca aktif sebelum bel masuk jam pelajaran pertama.',
    content: `Perpustakaan SDN 305 bersama dewan guru resmi mencanangkan Gerakan Literasi Sekolah (GLS) semester genap. Setiap pagi pukul 07.15 WIT, seluruh peserta didik meluangkan waktu 15 menit untuk membaca buku cerita, sains bergambar, atau ensiklopedia anak yang tersedia di sudut baca kelas.

Inisiatif ini dirancang guna mendukung pencapaian indikator literasi membaca pada Standar Mutu Lulusan IASP BAN-S/M.`,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=800',
    isImportant: false
  }
];

export const INITIAL_STUDENT_COHORTS: StudentCohort[] = [
  { grade: 'Kelas I', classes: 1, male: 14, female: 16, total: 30 },
  { grade: 'Kelas II', classes: 1, male: 15, female: 13, total: 28 },
  { grade: 'Kelas III', classes: 1, male: 16, female: 17, total: 33 },
  { grade: 'Kelas IV', classes: 1, male: 15, female: 15, total: 30 },
  { grade: 'Kelas V', classes: 1, male: 18, female: 14, total: 32 },
  { grade: 'Kelas VI', classes: 1, male: 16, female: 15, total: 31 }
];
