import React, { useState, useEffect } from "react";
import {
  Wand2,
  BookOpen,
  Search,
  Copy,
  Download,
  Trash2,
  Languages,
  FileText,
  CheckCircle,
  AlertCircle,
  Menu,
  X,
  Send,
  Sparkles,
  Quote,
  History,
  FileSearch,
  PenTool,
  Lightbulb,
  MessageSquare,
  Type,
  AlignLeft,
  Layers,
  ShieldCheck,
  RefreshCw,
  Upload,
} from "lucide-react";

// MASUKKAN API KEY KAMU DI SINI
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

const PlusIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const MinusIcon = ({ size }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);

const App = () => {
  const [inputText, setInputText] = useState("");
  const [activeTool, setActiveTool] = useState("paraphrase");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [history, setHistory] = useState([]);
  const [savedSessions, setSavedSessions] = useState([]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [writingScore, setWritingScore] = useState(0);

  const [libsLoaded, setLibsLoaded] = useState({
    mammoth: false,
    pdfjs: false,
  });

  const tools = [
    {
      id: "paraphrase",
      name: "Paraphrase",
      icon: <Wand2 size={18} />,
      prompt:
        "Parafrasekan teks akademik berikut menggunakan gaya bahasa ilmiah yang lebih profesional, natural, elegan, dan human-like tanpa mengubah makna utama, konteks penelitian, maupun data penting. Hindari pengulangan kata, gunakan variasi struktur kalimat yang matang seperti penulisan jurnal internasional bereputasi, serta pastikan hasil tidak terasa kaku maupun terlalu AI-generated.",
    },

    {
      id: "grammar",
      name: "Grammar Check",
      icon: <CheckCircle size={18} />,
      prompt:
        "Periksa seluruh tata bahasa, ejaan, tanda baca, pemilihan diksi, dan struktur akademik pada teks berikut. Berikan versi revisi yang lebih profesional dan natural, lalu tampilkan daftar kesalahan utama beserta penjelasan singkat dan perbaikannya.",
    },

    {
      id: "formal",
      name: "Ubah ke Formal",
      icon: <FileText size={18} />,
      prompt:
        "Ubah teks berikut menjadi gaya penulisan akademik yang sangat formal, objektif, profesional, dan menyerupai standar jurnal internasional Scopus/Q1 tanpa menghilangkan makna aslinya. Hindari bahasa kasual, subjektif, atau terlalu emosional.",
    },

    {
      id: "title_gen",
      name: "Generator Judul",
      icon: <Sparkles size={18} />,
      prompt:
        "Buatkan 5 judul penelitian yang profesional, menarik, akademik, relevan dengan isi pembahasan, serta memiliki potensi kuat untuk digunakan pada skripsi, tesis, maupun jurnal ilmiah. Gunakan gaya judul modern dan spesifik.",
    },

    {
      id: "abstract",
      name: "Abstract Gen",
      icon: <FileSearch size={18} />,
      prompt:
        "Buat abstrak penelitian yang lengkap, profesional, ringkas, dan akademik berdasarkan teks berikut menggunakan format IMRAD (Introduction, Method, Result, and Discussion). Gunakan gaya bahasa jurnal internasional yang formal dan padat.",
    },

    {
      id: "summary",
      name: "Ringkasan Jurnal",
      icon: <BookOpen size={18} />,
      prompt:
        "Ringkas teks berikut menjadi poin-poin inti yang jelas, profesional, dan akademik untuk kebutuhan literature review atau presentasi penelitian. Fokus pada tujuan penelitian, metode, hasil utama, dan kesimpulan penting.",
    },

    {
      id: "citation",
      name: "Citation Maker",
      icon: <Quote size={18} />,
      prompt:
        "Buat format sitasi dan referensi yang benar sesuai standar APA 7th Edition berdasarkan data sumber berikut. Pastikan format penulisan akademik konsisten dan profesional.",
    },

    {
      id: "background",
      name: "Latar Belakang",
      icon: <PenTool size={18} />,
      prompt:
        "Kembangkan latar belakang penelitian berikut menjadi lebih mendalam, sistematis, akademik, dan meyakinkan dengan memperkuat fenomena penelitian, urgensi masalah, research gap, data pendukung, serta alasan pentingnya penelitian dilakukan.",
    },

    {
      id: "plagiarism",
      name: "Analisis Plagiasi",
      icon: <ShieldCheck size={18} />,
      prompt:
        "Analisis teks berikut dan identifikasi bagian yang berpotensi dianggap plagiasi atau terlalu mirip dengan sumber umum. Berikan saran perbaikan berupa alternatif penulisan yang lebih orisinal, natural, aman secara akademik, dan tetap mempertahankan makna utama.",
    },

    {
      id: "qna",
      name: "Diskusi Teori",
      icon: <MessageSquare size={18} />,
      prompt:
        "Jelaskan teori, konsep, pendekatan, atau landasan akademik yang relevan dengan topik berikut secara mendalam, sistematis, dan mudah dipahami seperti penjelasan dosen pembimbing atau reviewer jurnal.",
    },

    {
      id: "tone",
      name: "Tone Switcher",
      icon: <Languages size={18} />,
      prompt:
        "Ubah nada teks berikut menjadi lebih objektif, profesional, akademik, dan netral sesuai standar penulisan ilmiah tanpa menghilangkan pesan utama.",
    },

    {
      id: "rewrite",
      name: "Rewrite Kalimat",
      icon: <Type size={18} />,
      prompt:
        "Tulis ulang teks berikut menjadi lebih efektif, jelas, profesional, concise, dan enak dibaca tanpa menghilangkan informasi penting maupun konteks utama pembahasan.",
    },

    {
      id: "spellcheck",
      name: "Cek Tipografi",
      icon: <CheckCircle size={18} />,
      prompt:
        "Temukan dan perbaiki seluruh typo, kesalahan penulisan, inkonsistensi istilah, serta kesalahan tanda baca dalam teks berikut agar lebih profesional dan rapi secara akademik.",
    },

    {
      id: "biblio",
      name: "Daftar Pustaka",
      icon: <AlignLeft size={18} />,
      prompt:
        "Rapikan, urutkan, dan format ulang daftar referensi berikut menjadi daftar pustaka akademik yang konsisten dan sesuai urutan alfabet sesuai standar penulisan ilmiah.",
    },

    {
      id: "topic_idea",
      name: "Ide Riset Baru",
      icon: <Lightbulb size={18} />,
      prompt:
        "Analisis topik berikut dan berikan minimal 5 research gap atau ide penelitian baru yang relevan, realistis, inovatif, memiliki nilai akademik, dan berpotensi memberikan kontribusi penelitian yang kuat.",
    },

    {
      id: "essay_gen",
      name: "Essay Drafter",
      icon: <Layers size={18} />,
      prompt:
        "Buat kerangka essay akademik yang sistematis, logis, profesional, dan argumentatif berdasarkan poin berikut. Sertakan pembukaan, pengembangan ide, argumentasi utama, serta kesimpulan yang kuat.",
    },

    {
      id: "email_formal",
      name: "Email Pembimbing",
      icon: <Send size={18} />,
      prompt:
        "Tulis email formal yang sangat sopan, profesional, respectful, dan natural kepada dosen pembimbing terkait keperluan akademik berikut. Gunakan etika komunikasi mahasiswa yang baik.",
    },

    {
      id: "autocomplete",
      name: "Auto-Complete",
      icon: <PenTool size={18} />,
      prompt:
        "Lanjutkan paragraf berikut menggunakan argumen yang logis, akademik, mendalam, dan profesional dengan alur pembahasan yang natural serta konsisten dengan konteks sebelumnya.",
    },

    {
      id: "expand",
      name: "Expand Argumen",
      icon: <PlusIcon size={18} />,
      prompt:
        "Perdalam pembahasan dan argumen dalam teks berikut dengan menambahkan penjelasan akademik, analisis logis, data pendukung, dan elaborasi yang relevan tanpa keluar dari topik utama.",
    },

    {
      id: "shorten",
      name: "Shorten/Fit",
      icon: <MinusIcon size={18} />,
      prompt:
        "Ringkas teks berikut agar lebih padat, efektif, dan sesuai limit kata tanpa menghilangkan informasi inti, konteks penting, maupun kualitas akademiknya.",
    },

    {
      id: "score",
      name: "Evaluasi Dosen",
      icon: <History size={18} />,
      prompt:
        "Bertindaklah sebagai dosen penguji skripsi yang kritis dan objektif. Berikan penilaian akademik terhadap teks berikut dalam skala 1–100 disertai kritik, kelemahan utama, kelebihan, dan saran perbaikan yang detail serta konstruktif.",
    },

    {
      id: "highlight",
      name: "Logika Cek",
      icon: <AlertCircle size={18} />,
      prompt:
        "Analisis teks berikut dan identifikasi kelemahan logika, inkonsistensi argumen, struktur berpikir yang kurang kuat, atau bagian yang ambigu. Berikan saran perbaikan akademik yang jelas dan profesional.",
    },

    {
      id: "multilang",
      name: "Translate Jurnal",
      icon: <Languages size={18} />,
      prompt:
        "Terjemahkan teks berikut ke Bahasa Inggris akademik tingkat lanjut dengan gaya natural, formal, profesional, dan menyerupai standar jurnal internasional atau IELTS/TOEFL Writing Band 8+.",
    },

    {
      id: "history_context",
      name: "Konteks Literatur",
      icon: <History size={18} />,
      prompt:
        "Sebutkan tokoh, teori, peneliti, maupun penelitian terdahulu yang relevan dengan topik berikut beserta kontribusi dan kaitannya terhadap pembahasan penelitian.",
    },
  ];

  // Memuat pustaka pihak ketiga secara dinamis dari CDN setelah komponen dipasang
  useEffect(() => {
    const loadScripts = async () => {
      try {
        // Muat Mammoth untuk ekstrak berkas .docx
        if (!window.mammoth) {
          const mammothScript = document.createElement("script");
          mammothScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js";
          mammothScript.async = true;
          mammothScript.onload = () =>
            setLibsLoaded((prev) => ({ ...prev, mammoth: true }));
          document.head.appendChild(mammothScript);
        } else {
          setLibsLoaded((prev) => ({ ...prev, mammoth: true }));
        }

        // Muat PDF.js untuk membaca berkas .pdf
        if (!window.pdfjsLib) {
          const pdfjsScript = document.createElement("script");
          pdfjsScript.src =
            "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.min.js";
          pdfjsScript.async = true;
          pdfjsScript.onload = () => {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc =
              "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";
            setLibsLoaded((prev) => ({ ...prev, pdfjs: true }));
          };
          document.head.appendChild(pdfjsScript);
        } else {
          setLibsLoaded((prev) => ({ ...prev, pdfjs: true }));
        }
      } catch (err) {
        console.error("Gagal memuat pustaka parser eksternal:", err);
      }
    };

    loadScripts();
  }, []);

  useEffect(() => {
    const words = inputText
      .trim()
      .split(/\s+/)
      .filter((w) => w.length > 0).length;
    setWritingScore(
      inputText.length > 0 ? Math.min(100, Math.floor(words / 1.5) + 30) : 0,
    );
  }, [inputText]);

  // Handler pengunggahan dokumen yang mendukung .txt, .md, .docx, dan .pdf
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setErrorMessage("");
    setIsLoading(true);
    const fileType = file.name.split(".").pop().toLowerCase();

    try {
      if (
        fileType === "txt" ||
        fileType === "md" ||
        fileType === "csv" ||
        fileType === "json"
      ) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setInputText(event.target.result);
          setIsLoading(false);
        };
        reader.readAsText(file);
      } else if (fileType === "docx") {
        if (!window.mammoth) {
          throw new Error(
            "Pustaka pembaca dokumen Word (.docx) sedang dimuat. Silakan coba sesaat lagi.",
          );
        }
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const arrayBuffer = event.target.result;
            const result = await window.mammoth.extractRawText({ arrayBuffer });
            setInputText(result.value);
          } catch (err) {
            setErrorMessage("Gagal memproses berkas Word (.docx).");
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (fileType === "pdf") {
        if (!window.pdfjsLib) {
          throw new Error(
            "Pustaka pembaca dokumen PDF (.pdf) sedang dimuat. Silakan coba sesaat lagi.",
          );
        }
        const reader = new FileReader();
        reader.onload = async (event) => {
          try {
            const arrayBuffer = event.target.result;
            const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer })
              .promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
              const page = await pdf.getPage(i);
              const textContent = await page.getTextContent();
              const pageText = textContent.items
                .map((item) => item.str)
                .join(" ");
              fullText += pageText + "\n";
            }

            setInputText(fullText);
          } catch (err) {
            setErrorMessage("Gagal mengekstrak teks dari berkas PDF.");
          } finally {
            setIsLoading(false);
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        setIsLoading(false);
        setErrorMessage(
          "Format berkas tidak didukung! Aplikasi ini menerima format .txt, .md, .docx, dan .pdf",
        );
      }
    } catch (err) {
      setErrorMessage(err.message);
      setIsLoading(false);
    }
  };

  const callGemini = async (prompt, text, retryCount = 0) => {
    setErrorMessage("");
    if (!API_KEY || API_KEY.trim() === "") {
      setErrorMessage(
        "API Key tidak ditemukan. Silakan masukkan API Key Anda di baris ke-12 file App.jsx.",
      );
      return;
    }

    setIsLoading(true);
    const url = "https://openrouter.ai/api/v1/chat/completions";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": window.location.origin,
          "X-Title": "WriteWise AI",
        },
        body: JSON.stringify({
          model: "google/gemini-2.0-flash-001",
          messages: [
            {
              role: "user",
              content: `${prompt}\n\n"${text}"`,
            },
          ],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (
          retryCount < 3 &&
          (response.status === 429 || response.status >= 500)
        ) {
          const wait = Math.pow(2, retryCount) * 1000;
          setTimeout(() => callGemini(prompt, text, retryCount + 1), wait);
          return;
        }
        throw new Error(
          data.error?.message ||
            `Error ${response.status}: Gagal memproses permintaan.`,
        );
      }

      const result = data.choices?.[0]?.message?.content;
      if (result) {
        setSavedSessions((prev) => [
          {
            id: Date.now(),
            tool: tools.find((t) => t.id === activeTool)?.name,
            timestamp: new Date().toLocaleTimeString(),
            fullText: result,
            preview: result.substring(0, 40) + "...",
          },
          ...prev,
        ]);

        setHistory((prev) => [
          {
            tool: tools.find((t) => t.id === activeTool)?.name,
            timestamp: new Date().toLocaleTimeString(),
            text: result.substring(0, 40) + "...",
          },
          ...prev,
        ]);

        setInputText("");
      } else {
        throw new Error(
          "AI tidak memberikan respon. Coba ubah teks input Anda.",
        );
      }
    } catch (err) {
      console.error("Gemini API Error:", err);
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${isSidebarOpen ? "w-72" : "w-0"} transition-all duration-300 bg-white border-r border-slate-200 flex flex-col h-full shadow-sm z-20`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="bg-indigo-600 p-2 rounded-lg text-white shrink-0">
              <Sparkles size={20} />
            </div>
            <h1 className="font-bold text-xl text-indigo-900 whitespace-nowrap">
              WriteWise AI
            </h1>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">
            Academic Toolkits
          </p>
          {tools.map((tool) => (
            <button
              key={tool.id}
              onClick={() => setActiveTool(tool.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTool === tool.id
                  ? "bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-sm"
                  : "text-slate-600 hover:bg-slate-50 border border-transparent"
              }`}
            >
              <span
                className={
                  activeTool === tool.id ? "text-indigo-600" : "text-slate-400"
                }
              >
                {tool.icon}
              </span>
              <span className="text-sm font-semibold whitespace-nowrap">
                {tool.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white relative">
        <header className="h-16 border-b border-slate-100 flex items-center justify-between px-6 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="p-2 hover:bg-slate-100 rounded-lg"
              >
                <Menu size={20} />
              </button>
            )}
            <h2 className="font-semibold text-slate-700 capitalize">
              Workspace /{" "}
              <span className="text-indigo-600">
                {activeTool.replace("_", " ")}
              </span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {/* Tombol Upload Dokumen Multi-Format */}
            <label
              className="p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 text-sm font-medium"
              title="Upload Dokumen (.txt, .docx, .pdf)"
            >
              <Upload size={18} />
              <span className="hidden sm:inline text-xs font-semibold">
                Upload Dokumen
              </span>
              <input
                type="file"
                accept=".txt,.md,.docx,.pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <button
              onClick={() => navigator.clipboard.writeText(inputText)}
              className="p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors"
              title="Copy"
            >
              <Copy size={18} />
            </button>
            <button
              onClick={() => setInputText("")}
              className="p-2 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
              title="Clear"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6 flex flex-col overflow-hidden">
          <div className="flex-1 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col relative overflow-hidden shadow-inner">
            {errorMessage && (
              <div className="m-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300 z-40">
                <AlertCircle className="text-red-500 shrink-0" size={20} />
                <div className="flex-1">
                  <p className="text-sm font-bold text-red-800">
                    Perhatian / Masalah
                  </p>
                  <p className="text-xs text-red-600 leading-tight">
                    {errorMessage}
                  </p>
                </div>
                <button
                  onClick={() => setErrorMessage("")}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            )}

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Tuliskan draf artikel Anda di sini, atau unggah dokumen akademik Anda (.txt, .docx, .pdf) menggunakan tombol di atas..."
              className="flex-1 p-8 bg-transparent focus:outline-none resize-none text-lg text-slate-800 leading-relaxed placeholder:text-slate-300"
            />

            {isLoading && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-[2px] flex flex-col items-center justify-center z-30 transition-all">
                <div className="w-14 h-14 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin mb-4 shadow-sm"></div>
                <p className="text-indigo-900 font-bold">
                  WriteWise AI sedang memproses...
                </p>
                <p className="text-slate-400 text-xs mt-1">
                  Mengekstrak teks atau mengirim data ke model AI
                </p>
              </div>
            )}

            <div className="p-4 border-t border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex gap-4">
                <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {inputText.length} Karakter
                </div>
                <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  {inputText.trim() ? inputText.trim().split(/\s+/).length : 0}{" "}
                  Kata
                </div>
              </div>

              <button
                onClick={() =>
                  callGemini(
                    tools.find((t) => t.id === activeTool).prompt,
                    inputText,
                  )
                }
                disabled={isLoading || !inputText.trim()}
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white px-10 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
              >
                {isLoading ? (
                  <RefreshCw size={18} className="animate-spin" />
                ) : (
                  <Wand2 size={18} />
                )}
                <span>{isLoading ? "MEMPROSES..." : "PROSES SEKARANG"}</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* History Panel */}
      <div className="hidden xl:flex w-64 border-l border-slate-200 bg-white flex-col">
        <div className="p-6 border-b border-slate-100 font-bold text-slate-800 flex items-center gap-2 uppercase text-[11px] tracking-widest">
          <History size={16} className="text-indigo-600" /> Riwayat Sesi
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-300 text-center p-4">
              <History size={32} className="mb-2 opacity-20" />
              <p className="text-[10px] font-medium">Belum ada aktivitas</p>
            </div>
          ) : (
            savedSessions.map((h, i) => (
              <div
                key={i}
                onClick={() => setInputText(h.fullText)}
                className="p-3 bg-slate-50 rounded-xl text-[11px] border border-slate-100 hover:border-indigo-200 transition-colors group cursor-pointer"
              >
                <div className="flex justify-between font-bold text-indigo-600 mb-1">
                  <span className="truncate">{h.tool}</span>
                  <span className="text-[9px] text-slate-400 font-normal">
                    {h.timestamp}
                  </span>
                </div>
                <p className="text-slate-500 italic line-clamp-2">"{h.text}"</p>
              </div>
            ))
          )}
        </div>
        <div className="p-4 bg-indigo-900 m-4 rounded-2xl text-white shadow-lg">
          <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest mb-3">
            Academic Score
          </p>
          <div className="flex items-end gap-1 mb-2">
            <span className="text-3xl font-black leading-none">
              {writingScore}
            </span>
            <span className="text-xs font-bold text-indigo-400">/100</span>
          </div>
          <div className="w-full bg-indigo-800 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-400 h-full transition-all duration-700"
              style={{ width: `${writingScore}%` }}
            ></div>
          </div>
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 0.8s linear infinite; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `,
        }}
      />
    </div>
  );
};

export default App;
