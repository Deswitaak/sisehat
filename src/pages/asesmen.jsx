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
    <div className="bg-[#f4f7fb] min-h-screen flex flex-col">
      <NavbarDashboard />

      <div className="px-4 md:px-8 lg:px-16 py-6 md:py-10 flex-1">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-bold text-blue-900">Asesmen Profil Organisasi</h1>
          <p className="text-gray-500 mt-2">Lengkapi asesmen berdasarkan role Anda.</p>
        </div>

        {/* ROLE INFO */}
        <div className={`mt-6 p-4 rounded-xl text-sm ${role === "Pemilik" ? "bg-blue-50 text-blue-800" : "bg-green-50 text-green-800"}`}>
          {role === "Pemilik" ? (
            <>Anda mengisi sebagai <b>Pemilik Usaha</b> (Operasional, Legal, Finansial).</>
          ) : (
            <>Anda mengisi sebagai <b>Karyawan</b> (Lingkungan kerja, Kepemimpinan).</>
          )}
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-white p-6 rounded-xl mt-6 shadow-sm">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Progress</span>
            <span>{answered}/{totalQuestions}</span>
          </div>
          <div className="w-full bg-gray-200 h-2 rounded-full">
            <div className="bg-blue-900 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* QUESTIONS CARD */}
        <div className="bg-white rounded-xl mt-8 shadow-sm overflow-hidden">
          <div className="bg-blue-900 text-white px-6 py-4 font-semibold">
            {step + 1}. {current.title}
          </div>

          <div className="p-6 space-y-8">
            {current.questions.map((q, i) => (
              <div key={i}>
                <p className="text-sm text-blue-900 mb-3 font-medium">{q}</p>
                <div className="flex justify-between items-center text-xs text-gray-400">
                  <span>{current.scale.length === 3 ? "TIDAK" : "SANGAT TIDAK SETUJU"}</span>
                  <div className="flex gap-3">
                    {current.scale.map((num) => (
                      <button
                        key={num}
                        onClick={() => handleSelect(i, num)}
                        className={`w-10 h-10 border rounded-md transition font-bold ${
                          answers[`${step}-${i}`] === num
                            ? "bg-blue-900 text-white border-blue-900"
                            : "hover:bg-gray-100 bg-white"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <span>{current.scale.length === 3 ? "YA" : "SANGAT SETUJU"}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* NAVIGATION BUTTONS */}
        <div className="flex justify-center gap-6 mt-10">
          <button
            disabled={step === 0}
            onClick={() => setStep(step - 1)}
            className="px-6 py-3 border rounded-lg text-gray-600 disabled:opacity-30 bg-white"
          >
            Sebelumnya
          </button>
          <button
            onClick={handleNext}
            disabled={current.questions.some((_, i) => !answers[`${step}-${i}`])}
            className={`px-8 py-3 rounded-lg font-bold text-white transition-all ${
              current.questions.some((_, i) => !answers[`${step}-${i}`]) 
              ? "bg-gray-400 cursor-not-allowed" 
              : "bg-blue-900 hover:bg-blue-800 shadow-md"
            }`}
          >
            {step === sections.length - 1 ? "Simpan & Lihat Hasil" : "Selanjutnya"}
          </button>
        </div>
      </div>
    </div>
  );
}