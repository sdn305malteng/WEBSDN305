import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Lazy initializer for Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return geminiClient;
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    school: "SDN 305 Maluku Tengah",
    aiEnabled: Boolean(process.env.GEMINI_API_KEY),
  });
});

// AI Accreditation Advice Endpoint
app.post("/api/ai/accreditation-advice", async (req, res) => {
  try {
    const { componentName, items, schoolContext } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Fallback expert analysis if API key is not yet set up
      return res.json({
        analysis: `### Telaah Kesiapan Standar: ${componentName || "Akreditasi IASP SD"}
Berdasarkan data butir bukti fisik SDN 305 Maluku Tengah:
1. **Kelengkapan Dokumen**: Dari berkas yang dicatat, pastikan seluruh dokumen memuat tanda tangan Kepala Sekolah, stempel basah/digital, dan SK Tim Pelaksana.
2. **Kesesuaian IASP 2020**: Asesor BAN-S/M akan mengutamakan triangulasi data (Dokumen Portofolio, Observasi Lingkungan/Kelas, dan Wawancara Guru/Komite).
3. **Fokus Perbaikan Cepat**: Siapkan berkas portofolio dalam map warna berbeda sesuai 4 komponen (Mutu Lulusan, Proses Pembelajaran, Mutu Guru, Manajemen Sekolah) agar mudah ditunjukkan saat visitasi.
4. **Catatan Khusus Wilayah Maluku Tengah**: Pastikan kearifan lokal (P5 bertema kearifan lokal Maluku, lingkungan maritim/pesisir) tercantum pada dokumen Kurikulum Operasional Satuan Pendidikan (KOSP).`,
        recommendations: [
          "Lengkapi SK Penetapan dan Notula Rapat penyusunan KOSP bersama Komite Sekolah.",
          "Siapkan jurnal refleksi guru dan bukti tindak lanjut supervisi akademik.",
          "Dokumentasikan kegiatan pembiasaan karakter (doa bersama, senam, literasi 15 menit) dengan foto bertanggal.",
        ],
        scoreEstimate: "88 - 92 (Kategori A / Unggul dengan kelengkapan bukti fisik)",
      });
    }

    const prompt = `Anda adalah seorang Asesor Senior Akreditasi Sekolah Dasar BAN-S/M (Badan Akreditasi Nasional Sekolah/Madrasah) yang berpengalaman mendampingi sekolah jenjang SD di Indonesia, khususnya di Kabupaten Maluku Tengah, Provinsi Maluku.

Konteks Sekolah:
Nama: SDN 305 Maluku Tengah
Kurikulum: Kurikulum Merdeka & K13
Komponen yang dinilai: ${componentName || "Umum IASP SD"}
Data Dokumen & Status:
${JSON.stringify(items || [], null, 2)}
Konteks Tambahan: ${schoolContext || "Persiapan visitasi akreditasi sekolah"}

Tugas Anda:
1. Berikan telaah mendalam terhadap kesiapan dokumen bukti fisik yang sudah ada maupun yang masih kurang.
2. Tunjukkan apa saja aspek penting yang akan diverifikasi Asesor BAN-S/M saat visitasi (dokumen, observasi kelas, dan wawancara).
3. Berikan rekomendasi langkah konkret prioritas tinggi (Quick Wins) yang harus diselesaikan sekolah dalam 1-2 minggu ke depan.
4. Berikan estimasi kategori kesiapan (A - Unggul, B - Baik, atau C - Cukup) beserta argumentasi teknis BAN-S/M.

Format jawaban dengan bahasa Indonesia formal, profesional, edukatif, dan menyemangati tim akreditasi SDN 305 Maluku Tengah. Gunakan markdown dengan heading dan poin-poin yang jelas.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({
      analysis: response.text,
      success: true,
    });
  } catch (error: any) {
    console.error("Gemini advice error:", error);
    res.status(500).json({
      error: error?.message || "Gagal mendapatkan telaah AI",
    });
  }
});

// AI Document & Instrument Draft Generator
app.post("/api/ai/generate-instrument-draft", async (req, res) => {
  try {
    const { docType, title, component, details } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        draft: `PEMERINTAH KABUPATEN MALUKU TENGAH
DINAS PENDIDIKAN DAN KEBUDAYAAN
SD NEGERI 305 MALUKU TENGAH
Alamat: Jl. Pendidikan No. 1, Kab. Maluku Tengah, Maluku

SURAT KEPUTUSAN KEPALA SD NEGERI 305 MALUKU TENGAH
Nomor: 421.2/045/SDN.305/2026

TENTANG:
${title || "PEMBENTUKAN TIM PENJAMINAN MUTU DAN PERSIAPAN AKREDITASI SEKOLAH"}

Menimbang:
a. Bahwa dalam rangka meningkatkan mutu pendidikan dan akuntabilitas kinerja sekolah;
b. Bahwa untuk menghadapi visitasi akreditasi oleh BAN-S/M, dipandang perlu membentuk Tim Khusus Akreditasi;

Mengingat:
1. Undang-Undang Nomor 20 Tahun 2003 tentang Sistem Pendidikan Nasional;
2. Permendikbudristek terkait Standar Nasional Pendidikan dan Pedoman Akreditasi IASP;

MEMUTUSKAN:
Menetapkan:
Pertama: Membentuk Tim Persiapan Akreditasi SDN 305 Maluku Tengah tahun ajaran 2025/2026.
Kedua: Tim bertugas menghimpun, memverifikasi, dan menyusun bukti fisik sesuai 4 Komponen IASP (Mutu Lulusan, Proses Pembelajaran, Mutu Guru, dan Manajemen Sekolah).
Ketiga: Keputusan ini berlaku sejak tanggal ditetapkan.

Ditetapkan di: Maluku Tengah
Pada tanggal: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
Kepala SDN 305 Maluku Tengah

(...........................................)
NIP. ......................................`,
      });
    }

    const prompt = `Anda adalah konsultan administrasi sekolah dasar dan akreditasi BAN-S/M di Indonesia.
Buatkan draf resmi dokumen sekolah untuk:
Jenis Dokumen: ${docType} (misal: Surat Keputusan / SK, SOP, Notula Rapat, Rencana Kerja / Program, Instrumen Supervisi, atau Panduan)
Judul: ${title}
Terkait Komponen IASP: ${component}
Detail Kebutuhan: ${details || "Dokumen resmi pendukung bukti fisik akreditasi BAN-S/M"}
Identitas Sekolah: SD NEGERI 305 MALUKU TENGAH, Dinas Pendidikan dan Kebudayaan Kabupaten Maluku Tengah, Provinsi Maluku.

Ketentuan penulisan:
- Format standar naskah dinas pendidikan Indonesia (Kop, Konsideran Menimbang/Mengingat jika SK, Diktum Memutuskan, Susunan Lampiran jika perlu, tanggal dan tanda tangan Kepala Sekolah).
- Kalimat lugas, baku, komprehensif, dan langsung dapat disalin/dicetak oleh admin sekolah.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
    });

    res.json({
      draft: response.text,
      success: true,
    });
  } catch (error: any) {
    console.error("Gemini draft error:", error);
    res.status(500).json({
      error: error?.message || "Gagal membuat draf dokumen",
    });
  }
});

// AI Asesor Interview Simulator
app.post("/api/ai/simulate-interview", async (req, res) => {
  try {
    const { targetRole, component, focusArea } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        qaList: [
          {
            question: "Bagaimana Kepala Sekolah dan Guru menyusun serta mengevaluasi Kurikulum Operasional Sekolah (KOSP) yang melibatkan komite dan orang tua?",
            idealAnswer: "Kami menyusun KOSP setiap awal tahun ajaran melalui workshop tim pengembang kurikulum yang melibatkan Kepala Sekolah, seluruh dewan guru, pengawas pembina, komite sekolah, dan perwakilan orang tua. Kami menunjukkan bukti fisik berupa SK Tim, daftar hadir, notula berita acara rapat, serta dokumen KOSP yang telah disahkan Dinas Pendidikan Maluku Tengah.",
            evidenceTip: "Tunjukkan Map Dokumen Standar Manajemen: SK TPK, Notula, Berita Acara, Foto Dokumentasi Rapat.",
          },
          {
            question: "Bagaimana guru menerapkan pembelajaran berdiferensiasi dan pemanfaatan media digital di ruang kelas SDN 305?",
            idealAnswer: "Guru mengidentifikasi kesiapan dan gaya belajar peserta didik di awal bab, kemudian merancang modul ajar dengan variasi konten dan produk. Guru juga memanfaatkan perangkat Chromebook/laptop serta proyektor sekolah untuk memutar video pembelajaran interaktif.",
            evidenceTip: "Tunjukkan Modul Ajar berdiferensiasi, lembar kerja siswa (LKPD), dan foto kegiatan siswa berdiskusi aktif.",
          },
          {
            question: "Bagaimana sekolah membudayakan kedisiplinan dan nilai religius/karakter siswa setiap hari?",
            idealAnswer: "Setiap pagi kami menerapkan 5S (Senyum, Sapa, Salam, Sopan, Santun), doa bersama sebelum dan sesudah belajar, pembiasaan menyanyikan lagu Indonesia Raya, serta program jumat bersih dan literasi 15 menit sebelum jam pertama.",
            evidenceTip: "Tunjukkan SOP Pembiasaan, Tata Tertib Sekolah, Buku Catatan Pelanggaran/Prestasi Siswa, dan Jadwal Kegiatan Ekstrakurikuler.",
          },
        ],
      });
    }

    const prompt = `Anda adalah Asesor BAN-S/M yang sedang melakukan wawancara visitasi akreditasi di SD NEGERI 305 MALUKU TENGAH.
Peran yang diwawancarai: ${targetRole || "Kepala Sekolah & Guru"}
Komponen Akreditasi: ${component || "Seluruh Komponen IASP"}
Fokus Pembahasan: ${focusArea || "Kesiapan implementasi kurikulum, mutu pembelajaran, disiplin, dan manajemen sekolah"}

Berikan 4 (empat) pertanyaan krusial yang paling sering ditanyakan asesor beserta:
1. Pertanyaan Asesor (kritis, menggali bukti otentik)
2. Jawaban Ideal dan Elegan yang sebaiknya dijawab oleh pihak sekolah
3. Bukti Fisik Pendukung (dokumen/foto/portofolio) yang harus langsung ditunjukkan ke meja asesor saat menjawab

Format output WAJIB JSON murni dengan struktur:
{
  "qaList": [
    {
      "question": "string pertanyaan",
      "idealAnswer": "string jawaban",
      "evidenceTip": "string bukti fisik yang harus ditunjukkan"
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text || "{}");
    res.json(parsed);
  } catch (error: any) {
    console.error("Gemini interview simulation error:", error);
    res.status(500).json({
      error: error?.message || "Gagal menghasilkan simulasi wawancara",
    });
  }
});

// Helper for GitHub Headers
function getGitHubHeaders(token?: string) {
  const resolvedToken = token || process.env.GITHUB_TOKEN || "";
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "SDN305-MalukuTengah-Portal",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  if (resolvedToken.trim()) {
    headers["Authorization"] = `Bearer ${resolvedToken.trim()}`;
  }
  return { headers, hasToken: Boolean(resolvedToken.trim()) };
}

// Check server GitHub status
app.get("/api/github/status", (_req, res) => {
  res.json({
    hasServerToken: Boolean(process.env.GITHUB_TOKEN),
    defaultOwner: "sdn305malteng",
    defaultRepo: "sdn305malukutengah",
    repoUrl: "https://github.com/sdn305malteng/sdn305malukutengah",
  });
});

// Test GitHub Connection & check file existence
app.post("/api/github/test-connection", async (req, res) => {
  try {
    const { token, owner, repo, branch = "main", filePath = "data/teachers.json" } = req.body;
    const { headers, hasToken } = getGitHubHeaders(token);

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        error: "Owner dan nama repositori wajib diisi.",
      });
    }

    // 1. Check Repo
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
    });

    if (!repoRes.ok) {
      if (repoRes.status === 401) {
        return res.status(401).json({
          success: false,
          error: "Personal Access Token (PAT) GitHub tidak valid atau tidak memiliki izin akses.",
        });
      }
      if (repoRes.status === 404) {
        return res.status(404).json({
          success: false,
          error: `Repositori "${owner}/${repo}" tidak ditemukan atau berstatus privat tanpa token berizin 'repo'.`,
        });
      }
      const errText = await repoRes.text();
      return res.status(repoRes.status).json({
        success: false,
        error: `GitHub API error (${repoRes.status}): ${errText}`,
      });
    }

    const repoData = await repoRes.json();

    // 2. Check File existence
    const cleanPath = filePath.replace(/^\/+/, "");
    const fileRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`,
      { headers }
    );

    let fileExists = false;
    let fileSha: string | null = null;
    let teacherCount: number | null = null;

    if (fileRes.ok) {
      fileExists = true;
      const fileData = await fileRes.json();
      fileSha = fileData.sha;
      if (fileData.content) {
        try {
          const raw = Buffer.from(fileData.content, "base64").toString("utf-8");
          const parsed = JSON.parse(raw);
          const teachersArr = Array.isArray(parsed) ? parsed : parsed.teachers || [];
          teacherCount = teachersArr.length;
        } catch {
          teacherCount = null;
        }
      }
    }

    return res.json({
      success: true,
      repo: {
        name: repoData.name,
        fullName: repoData.full_name,
        private: repoData.private,
        defaultBranch: repoData.default_branch,
        url: repoData.html_url,
        permissions: repoData.permissions,
      },
      file: {
        path: cleanPath,
        branch,
        exists: fileExists,
        sha: fileSha,
        teacherCount,
      },
      hasToken,
    });
  } catch (error: any) {
    console.error("GitHub test connection error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Gagal menguji koneksi ke GitHub.",
    });
  }
});

// Pull Teachers data from GitHub
app.post("/api/github/pull-teachers", async (req, res) => {
  try {
    const { token, owner, repo, branch = "main", filePath = "data/teachers.json" } = req.body;
    const { headers } = getGitHubHeaders(token);

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        error: "Owner dan nama repositori wajib diisi.",
      });
    }

    const cleanPath = filePath.replace(/^\/+/, "");
    const fileRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`,
      { headers }
    );

    if (!fileRes.ok) {
      if (fileRes.status === 404) {
        return res.status(404).json({
          success: false,
          error: `Berkas "${cleanPath}" belum ada di branch "${branch}". Anda dapat melakukan Inisialisasi/Komit berkas pertama kali.`,
        });
      }
      const errText = await fileRes.text();
      return res.status(fileRes.status).json({
        success: false,
        error: `Gagal membaca berkas dari GitHub (${fileRes.status}): ${errText}`,
      });
    }

    const fileData = await fileRes.json();
    if (!fileData.content) {
      return res.status(400).json({
        success: false,
        error: "Konten berkas kosong atau bukan berkas teks.",
      });
    }

    const decoded = Buffer.from(fileData.content, "base64").toString("utf-8");
    let teachers = [];
    try {
      const parsed = JSON.parse(decoded);
      teachers = Array.isArray(parsed) ? parsed : parsed.teachers || [];
    } catch {
      return res.status(400).json({
        success: false,
        error: "Format berkas di GitHub bukan JSON yang valid.",
      });
    }

    res.json({
      success: true,
      teachers,
      sha: fileData.sha,
      fileUrl: fileData.html_url,
      total: teachers.length,
      message: `Berhasil mengambil ${teachers.length} data guru dari GitHub.`,
    });
  } catch (error: any) {
    console.error("GitHub pull teachers error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Gagal menarik data dari GitHub.",
    });
  }
});

// Push / Commit Teachers data to GitHub
app.post("/api/github/commit-teachers", async (req, res) => {
  try {
    const {
      token,
      owner,
      repo,
      branch = "main",
      filePath = "data/teachers.json",
      teachers,
      commitMessage,
      authorName = "Admin SDN 305 Maluku Tengah",
      authorEmail = "ruslilussy789@gmail.com",
    } = req.body;

    const { headers, hasToken } = getGitHubHeaders(token);

    if (!hasToken) {
      return res.status(400).json({
        success: false,
        error: "Personal Access Token (PAT) GitHub wajib disertakan untuk melakukan komit.",
      });
    }

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        error: "Owner dan nama repositori wajib diisi.",
      });
    }

    if (!Array.isArray(teachers)) {
      return res.status(400).json({
        success: false,
        error: "Data guru harus berupa array.",
      });
    }

    const cleanPath = filePath.replace(/^\/+/, "");

    // 1. Get current SHA if file already exists
    let existingSha: string | undefined = undefined;
    try {
      const checkRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`,
        { headers }
      );
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        existingSha = checkData.sha;
      }
    } catch (e) {
      console.warn("Could not check existing file sha:", e);
    }

    // 2. Prepare content
    const jsonStr = JSON.stringify(teachers, null, 2);
    const contentBase64 = Buffer.from(jsonStr, "utf-8").toString("base64");

    const message =
      commitMessage ||
      `Perbarui data dewan guru SDN 305 Maluku Tengah (${teachers.length} guru)`;

    // 3. Put content to GitHub
    const putRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`,
      {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          content: contentBase64,
          branch,
          sha: existingSha,
          committer: {
            name: authorName,
            email: authorEmail,
          },
        }),
      }
    );

    if (!putRes.ok) {
      const errText = await putRes.text();
      let parsedErr: any = null;
      try {
        parsedErr = JSON.parse(errText);
      } catch {}

      const msg = parsedErr?.message || errText;
      return res.status(putRes.status).json({
        success: false,
        error: `Gagal komit ke GitHub (${putRes.status}): ${msg}`,
      });
    }

    const putData = await putRes.json();

    res.json({
      success: true,
      message: `Perubahan data guru berhasil dikomit ke branch ${branch} di GitHub!`,
      commitSha: putData.commit?.sha,
      commitUrl: putData.commit?.html_url,
      fileUrl: putData.content?.html_url,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("GitHub commit teachers error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Gagal melakukan komit data guru ke GitHub.",
    });
  }
});

// Pull Full Database from GitHub
app.post("/api/github/pull-database", async (req, res) => {
  try {
    const { token, owner = "sdn305malteng", repo = "sdn305malukutengah", branch = "main", filePath = "data/sdn305_database.json" } = req.body;
    const { headers } = getGitHubHeaders(token);

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        error: "Owner dan nama repositori wajib diisi.",
      });
    }

    const cleanPath = filePath.replace(/^\/+/, "");
    const fileRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`,
      { headers }
    );

    if (!fileRes.ok) {
      if (fileRes.status === 404) {
        // Fallback: check if data/teachers.json exists
        const teachersRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/data/teachers.json?ref=${branch}`,
          { headers }
        );
        if (teachersRes.ok) {
          const tData = await teachersRes.json();
          if (tData.content) {
            const raw = Buffer.from(tData.content, "base64").toString("utf-8");
            const parsed = JSON.parse(raw);
            const teachers = Array.isArray(parsed) ? parsed : parsed.teachers || [];
            return res.json({
              success: true,
              partial: true,
              database: { teachers },
              message: `Ditemukan berkas guru di GitHub (${teachers.length} guru). Berkas database lengkap belum dibuat.`,
            });
          }
        }

        return res.status(404).json({
          success: false,
          error: `Berkas database "${cleanPath}" belum ada di repositori GitHub ${owner}/${repo}. Silakan klik "Amankan & Simpan Seluruh Data ke GitHub" terlebih dahulu untuk menginisialisasi penyimpanan awan Anda.`,
        });
      }
      const errText = await fileRes.text();
      return res.status(fileRes.status).json({
        success: false,
        error: `Gagal membaca database dari GitHub (${fileRes.status}): ${errText}`,
      });
    }

    const fileData = await fileRes.json();
    if (!fileData.content) {
      return res.status(400).json({
        success: false,
        error: "Konten berkas database di GitHub kosong.",
      });
    }

    const decoded = Buffer.from(fileData.content, "base64").toString("utf-8");
    let database: any = null;
    try {
      database = JSON.parse(decoded);
    } catch {
      return res.status(400).json({
        success: false,
        error: "Format berkas database di GitHub bukan format JSON yang valid.",
      });
    }

    res.json({
      success: true,
      database,
      sha: fileData.sha,
      fileUrl: fileData.html_url,
      message: `Seluruh data sekolah berhasil dipulihkan dari repositori GitHub ${owner}/${repo}!`,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("GitHub pull database error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Gagal menarik database dari GitHub.",
    });
  }
});

// Commit Full Database to GitHub
app.post("/api/github/commit-database", async (req, res) => {
  try {
    const {
      token,
      owner = "sdn305malteng",
      repo = "sdn305malukutengah",
      branch = "main",
      filePath = "data/sdn305_database.json",
      database,
      commitMessage,
      authorName = "Admin SDN 305 Maluku Tengah",
      authorEmail = "ruslilussy789@gmail.com",
    } = req.body;

    const { headers, hasToken } = getGitHubHeaders(token);

    if (!hasToken) {
      return res.status(400).json({
        success: false,
        error: "Personal Access Token (PAT) GitHub wajib disertakan untuk menyimpan perubahan ke repositori.",
      });
    }

    if (!owner || !repo) {
      return res.status(400).json({
        success: false,
        error: "Owner dan nama repositori wajib diisi.",
      });
    }

    if (!database || typeof database !== "object") {
      return res.status(400).json({
        success: false,
        error: "Data database sekolah tidak valid.",
      });
    }

    const cleanPath = filePath.replace(/^\/+/, "");

    // 1. Get existing sha of sdn305_database.json if exists
    let existingSha: string | undefined = undefined;
    try {
      const checkRes = await fetch(
        `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}?ref=${branch}`,
        { headers }
      );
      if (checkRes.ok) {
        const checkData = await checkRes.json();
        existingSha = checkData.sha;
      }
    } catch (e) {
      console.warn("Could not check existing database sha:", e);
    }

    // 2. Prepare payload
    const payloadWithMeta = {
      ...database,
      version: "1.0.0",
      syncedAt: new Date().toISOString(),
      repository: `https://github.com/${owner}/${repo}`,
      schoolName: "SD NEGERI 305 MALUKU TENGAH",
    };

    const jsonStr = JSON.stringify(payloadWithMeta, null, 2);
    const contentBase64 = Buffer.from(jsonStr, "utf-8").toString("base64");
    const message =
      commitMessage ||
      `Backup & sinkronisasi data lengkap SDN 305 Maluku Tengah (${new Date().toLocaleString("id-ID")})`;

    // 3. Put database file
    const putRes = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${cleanPath}`,
      {
        method: "PUT",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
          content: contentBase64,
          branch,
          sha: existingSha,
          committer: {
            name: authorName,
            email: authorEmail,
          },
        }),
      }
    );

    if (!putRes.ok) {
      const errText = await putRes.text();
      let parsedErr: any = null;
      try {
        parsedErr = JSON.parse(errText);
      } catch {}
      const msg = parsedErr?.message || errText;
      return res.status(putRes.status).json({
        success: false,
        error: `Gagal menyimpan database ke GitHub (${putRes.status}): ${msg}`,
      });
    }

    const putData = await putRes.json();

    // 4. Also optionally sync data/teachers.json so both stay identical
    if (Array.isArray(database.teachers)) {
      try {
        let teacherSha: string | undefined = undefined;
        const checkTRes = await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/data/teachers.json?ref=${branch}`,
          { headers }
        );
        if (checkTRes.ok) {
          const tCheck = await checkTRes.json();
          teacherSha = tCheck.sha;
        }

        const tStr = JSON.stringify(database.teachers, null, 2);
        const tBase64 = Buffer.from(tStr, "utf-8").toString("base64");
        await fetch(
          `https://api.github.com/repos/${owner}/${repo}/contents/data/teachers.json`,
          {
            method: "PUT",
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              message: `Sinkronisasi berkas data guru (${database.teachers.length} guru)`,
              content: tBase64,
              branch,
              sha: teacherSha,
              committer: {
                name: authorName,
                email: authorEmail,
              },
            }),
          }
        );
      } catch (tErr) {
        console.warn("Minor: teachers.json sync background warning:", tErr);
      }
    }

    res.json({
      success: true,
      message: `Seluruh data sekolah berhasil diamankan dan disimpan ke repositori ${owner}/${repo} di GitHub!`,
      commitSha: putData.commit?.sha,
      commitUrl: putData.commit?.html_url,
      fileUrl: putData.content?.html_url,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("GitHub commit database error:", error);
    res.status(500).json({
      success: false,
      error: error?.message || "Gagal mengamankan data ke GitHub.",
    });
  }
});

// Setup Vite middleware in dev or static files in prod
async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SDN 305 Maluku Tengah server running on port ${PORT}`);
  });
}

setupVite().catch((err) => {
  console.error("Failed to start server:", err);
});
