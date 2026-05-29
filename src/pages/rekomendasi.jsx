import { useLocation, useNavigate } from "react-router-dom";
import NavbarDashboard from "../components/NavbarDashboard";

export default function Rekomendasi() {
  const location = useLocation();
  const navigate = useNavigate();

  const saved = JSON.parse(localStorage.getItem("hasilAnalisis"));

  const factors = location.state?.factors || saved?.factors || [];
  const total = location.state?.total || saved?.total || 0;

  if (!factors.length) {
    return (
      <div className="p-10">
        <p>Data tidak ditemukan. Silakan lakukan asesmen terlebih dahulu.</p>

        <button
          onClick={() => navigate("/asesmen")}
          className="mt-4 bg-blue-900 text-white px-4 py-2 rounded"
        >
          Ke Asesmen
        </button>
      </div>
    );
  }

  const normalize = (text) => text.toLowerCase().trim();

  const rekomendasiMap = {
    "organizational values": [
      "Tingkatkan komunikasi dan kolaborasi antar anggota tim.",
      "Bangun budaya saling percaya dan saling menghargai.",
      "Lakukan kegiatan internal untuk memperkuat nilai organisasi.",
    ],

    "leader involvement": [
      "Tingkatkan keterlibatan pemimpin dalam kegiatan operasional.",
      "Adakan pertemuan rutin dengan karyawan.",
      "Berikan ruang bagi karyawan untuk menyampaikan masukan.",
    ],

    "institutional resources": [
      "Lengkapi legalitas usaha dan dokumen pendukung.",
      "Manfaatkan program pelatihan atau bantuan pemerintah.",
      "Perluas kerja sama dengan mitra bisnis dan komunitas usaha.",
    ],

    "operational stability": [
      "Perbaiki pengelolaan bahan baku dan persediaan.",
      "Tingkatkan standar operasional dan pengendalian kualitas.",
      "Bangun hubungan jangka panjang dengan pelanggan.",
    ],

    "quality of workplace": [
      "Tingkatkan kenyamanan dan keamanan lingkungan kerja.",
      "Evaluasi beban kerja serta jam kerja karyawan.",
      "Perbaiki fasilitas kerja yang mendukung produktivitas.",
    ],

    "economic performance": [
      "Optimalkan strategi pemasaran dan penjualan.",
      "Perbaiki pengelolaan arus kas dan biaya operasional.",
      "Perluas jangkauan pasar dan pelanggan potensial.",
    ],
  };

  const getStatus = (score) => {
    if (score >= 80) return "SANGAT BAIK";
    if (score >= 65) return "BAIK";
    if (score >= 50) return "CUKUP";
    return "PERLU PERHATIAN";
  };

  const getStatusColor = (score) => {
    if (score >= 80)
      return "bg-green-100 text-green-700";

    if (score >= 65)
      return "bg-blue-100 text-blue-700";

    if (score >= 50)
      return "bg-yellow-100 text-yellow-700";

    return "bg-red-100 text-red-700";
  };

  return (
    <div className="bg-[#f4f7fb] min-h-screen">
      <NavbarDashboard />

      <div className="px-4 md:px-8 lg:px-16 py-6 md:py-10">

        {/* HEADER */}
        <div className="bg-white p-6 rounded-xl shadow flex justify-between">
          <div>
            <h1 className="text-2xl font-bold text-blue-900">
              Ringkasan Wawasan Bisnis
            </h1>

            <p className="text-gray-500 mt-2">
              Berikut rekomendasi berdasarkan performa Anda
            </p>
          </div>

          <div className="bg-blue-100 px-4 py-2 rounded-lg text-blue-900 font-semibold">
            Skor: {total}/100
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-6 mt-8">

          {factors.map((item, i) => {
            const key = normalize(item.name);
            const recs = rekomendasiMap[key] || [];

            return (
              <div
                key={i}
                className="bg-white p-6 rounded-xl shadow border"
              >
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-blue-900">
                    {item.name}
                  </h3>

                  <span
                    className={`text-xs px-2 py-1 rounded ${getStatusColor(
                      item.score
                    )}`}
                  >
                    {getStatus(item.score)}
                  </span>
                </div>

                <p className="text-sm text-gray-500 mb-3">
                  Skor: {item.score}/100
                </p>

                {item.score < 50 && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700">
                    Faktor ini menjadi prioritas utama untuk diperbaiki.
                  </div>
                )}

                {item.score >= 50 && item.score < 65 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-700">
                    Faktor ini masih perlu ditingkatkan agar lebih optimal.
                  </div>
                )}

                {item.score >= 65 && item.score < 80 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700">
                    Faktor ini sudah cukup baik namun masih dapat ditingkatkan.
                  </div>
                )}

                {item.score >= 80 && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-xs text-green-700">
                    Faktor ini sudah sangat baik dan perlu dipertahankan.
                  </div>
                )}

                <ul className="text-sm space-y-2 text-gray-600">
                  {recs.map((r, idx) => (
                    <li key={idx}>✔ {r}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}