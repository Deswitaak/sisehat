import { useState } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import { useNavigate } from "react-router-dom";

export default function Asesmen() {
  const navigate = useNavigate();

  // Ambil data profil dan user dari localStorage
  const profileData = JSON.parse(localStorage.getItem("profileData"));
  const userData = JSON.parse(localStorage.getItem("user"));

  const role = profileData?.role || "Pemilik";
  const userId = userData?.id_user;// Fallback ke ID 1 jika localStorage kosong agar backend tidak mendeteksi data null

  // =========================================================
  // PERTANYAAN OWNER & KARYAWAN
  // =========================================================
  const ownerSections = [
    {
      title: "Organizational Values",
      scale: [1, 2, 3, 4, 5],
      questions: [
        "Saya tidak ragu untuk menyampaikan kesulitan kerja kepada tim.",
        "Terdapat suasana kekeluargaan dalam lingkungan usaha.",
        "Semangat kerja dalam usaha tinggi.",
        "Kerja sama tim berjalan baik.",
        "Terdapat rasa saling percaya dalam usaha.",
        "Saya memandang usaha sebagai bentuk ibadah.",
      ]
    },
    {
      title: "Institutional Resources",
      scale: [1, 2, 3],
      questions: [
        "Usaha memiliki Nomor Induk Berusaha (NIB).",
        "Usaha mendapatkan bantuan pendanaan dari pemerintah.",
        "Usaha berpartisipasi dalam kegiatan pemerintah.",
        "Usaha menjalin kerja sama dengan pelaku usaha lain.",
        "Usaha memanfaatkan pemasaran digital.",
        "Usaha memiliki sumber keuangan yang jelas.",
      ]
    },
    {
      title: "Operational Stability",
      scale: [1, 2, 3, 4, 5],
      questions: [
        "Gaji karyawan dibayarkan tepat waktu.",
        "Peralatan usaha memadai.",
        "Ketersediaan bahan baku stabil.",
        "Permintaan produk stabil.",
        "Usaha memiliki hubungan jangka panjang dengan pelanggan.",
      ]
    },
    {
      title: "Economic Performance",
      scale: [1, 2, 3, 4, 5],
      questions: [
        "Jangkauan pasar usaha berkembang.",
        "Penjualan usaha meningkat.",
        "Utang usaha terkendali.",
        "Arus kas usaha berjalan baik.",
      ]
    },
  ];

  const employeeSections = [
    {
      title: "Organizational Values",
      scale: [1, 2, 3, 4, 5],
      questions: [
        "Saya merasa nyaman bekerja di lingkungan ini.",
        "Karyawan saling membantu satu sama lain.",
        "Hubungan antar rekan kerja berjalan baik.",
        "Saya merasa dihargai di tempat kerja.",
      ]
    },
    {
      title: "Quality of Workplace",
      scale: [1, 2, 3, 4, 5],
      questions: [
        "Lingkungan kerja nyaman.",
        "Jam kerja sesuai.",
        "Risiko kecelakaan kerja rendah.",
        "Beban kerja sesuai kemampuan.",
      ]
    },
    {
      title: "Leader Involvement",
      scale: [1, 2, 3, 4, 5],
      questions: [
        "Pemimpin bersikap adil.",
        "Pemimpin mendengarkan masukan karyawan.",
        "Pemimpin dekat dengan karyawan.",
      ]
    },
  ];

  const sections = role === "Karyawan" ? employeeSections : ownerSections;

  // =========================================================
  // STATE
  // =========================================================
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const current = sections[step];

  const handleSelect = (qIndex, value) => {
    setAnswers({
      ...answers,
      [`${step}-${qIndex}`]: value,
    });
  };

  // =========================================================
  // PROGRESS CALCULATION
  // =========================================================
  const totalQuestions = sections.reduce((acc, s) => acc + s.questions.length, 0);
  const answered = Object.keys(answers).length;
  const progress = Math.round((answered / totalQuestions) * 100);

  // =========================================================
  // SUBMIT & INTEGRASI API
  // =========================================================
  const handleNext = async () => {
    if (step < sections.length - 1) {
      setStep(step + 1);
    } else {
      // 1. Hitung Skor Lokal untuk Navigasi UI
      const resultFactors = sections.map((section, sIndex) => {
        let total = 0;
        section.questions.forEach((_, qIndex) => {
          const val = answers[`${sIndex}-${qIndex}`] || 0;
          total += val;
        });

        const maxScale = section.scale.length === 3 ? 3 : 5;
        const score = (total / (section.questions.length * maxScale)) * 100;

        return {
          name: section.title,
          score: Math.round(score),
        };
      });

      const avg = resultFactors.reduce((acc, r) => acc + r.score, 0) / resultFactors.length;

      // 2. KIRIM KE BACK END
      try {
        const response = await fetch('http://localhost/sisehat/api-sisehat/save_assessment.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id_user: userId, // Diubah dari user_id menjadi id_user agar sesuai format PHP/MySQL
            role: role,
            answers: answers // Mengirim semua mentah jawaban untuk diolah PHP
          }),
        });

        const apiResult = await response.json();

        if (apiResult.status === "success") {
          console.log("Data berhasil disimpan ke database");
          // Navigasi ke halaman hasil dengan membawa data skor
          navigate("/hasil", {
            state: {
              factors: resultFactors,
              total: Math.round(avg),
              role,
            },
          });
        } else {
          alert("Gagal menyimpan hasil: " + apiResult.message);
        }
      } catch (error) {
        console.error("Error submitting assessment:", error);
        alert("Terjadi kesalahan koneksi ke server.");
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-[#f4f7fb]">
      <NavbarDashboard />

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 md:px-8 md:py-10 lg:px-12 xl:px-16">
        {/* HEADER */}
        <section>
          <h1 className="break-words text-2xl font-bold text-blue-900 md:text-3xl">
            Asesmen Profil Organisasi
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
            Lengkapi asesmen berdasarkan role Anda.
          </p>
        </section>

        {/* ROLE INFO */}
        <section className={`mt-6 rounded-xl p-4 text-sm leading-relaxed ${role === "Pemilik" ? "bg-blue-50 text-blue-800" : "bg-green-50 text-green-800"}`}>
          {role === "Pemilik" ? (
            <>Anda mengisi sebagai <b>Pemilik Usaha</b> (Operasional, Legal, Finansial).</>
          ) : (
            <>Anda mengisi sebagai <b>Karyawan</b> (Lingkungan kerja, Kepemimpinan).</>
          )}
        </section>

        {/* PROGRESS BAR */}
        <section className="mt-6 rounded-xl bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-2 flex justify-between gap-4 text-sm text-gray-500">
            <span>Progress</span>
            <span>{answered}/{totalQuestions}</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-200">
            <div className="h-2 rounded-full bg-blue-900 transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </section>

        {/* QUESTIONS CARD */}
        <section className="mt-8 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="bg-blue-900 px-4 py-4 font-semibold text-white sm:px-6">
            {step + 1}. {current.title}
          </div>

          <div className="space-y-6 p-4 sm:space-y-8 sm:p-6">
            {current.questions.map((q, i) => (
              <div key={i} className="rounded-xl border border-gray-100 p-4 sm:border-0 sm:p-0">
                <p className="mb-4 text-sm font-medium leading-relaxed text-blue-900 sm:mb-3">{q}</p>

                <div className="flex flex-col gap-3 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
                  <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide sm:w-28">
                    {current.scale.length === 3 ? "TIDAK" : "SANGAT TIDAK SETUJU"}
                  </span>

                  <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-3">
                    {current.scale.map((num) => (
                      <button
                        key={num}
                        onClick={() => handleSelect(i, num)}
                        className={`h-11 w-full rounded-md border font-bold transition sm:h-10 sm:w-10 ${
                          answers[`${step}-${i}`] === num
                            ? "border-blue-900 bg-blue-900 text-white"
                            : "bg-white hover:bg-gray-100"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <span className="shrink-0 text-[11px] font-medium uppercase tracking-wide sm:w-28 sm:text-right">
                    {current.scale.length === 3 ? "YA" : "SANGAT SETUJU"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NAVIGATION BUTTONS */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:mt-10 sm:flex-row sm:justify-center sm:gap-6">
          <button
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="w-full rounded-lg border bg-white px-6 py-3 text-gray-600 transition hover:bg-gray-50 disabled:opacity-30 sm:w-auto"
          >
            Sebelumnya
          </button>
          <button
            onClick={handleNext}
            disabled={current.questions.some((_, i) => !answers[`${step}-${i}`])}
            className={`w-full rounded-lg px-8 py-3 font-bold text-white transition-all sm:w-auto ${
              current.questions.some((_, i) => !answers[`${step}-${i}`])
              ? "cursor-not-allowed bg-gray-400"
              : "bg-blue-900 shadow-md hover:bg-blue-800"
            }`}
          >
            {step === sections.length - 1 ? "Simpan & Lihat Hasil" : "Selanjutnya"}
          </button>
        </div>
      </main>
    </div>
  );
}
