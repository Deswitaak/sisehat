import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarDashboard from "../components/NavbarDashboard";

export default function Rekomendasi() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showProfileModal, setShowProfileModal] = useState(false);

  const saved = JSON.parse(localStorage.getItem("hasilAnalisis"));

  const factors = location.state?.factors || saved?.factors || [];
  const total = location.state?.total || saved?.total || 0;

  const isProfileComplete = () => {
    const profileComplete = localStorage.getItem("profileComplete");
    const profileData = JSON.parse(localStorage.getItem("profileData"));

    if (profileComplete === "true") {
      return true;
    }

    if (
      profileData?.nama &&
      profileData?.namaUsaha &&
      profileData?.jenisUsaha &&
      profileData?.kategori &&
      profileData?.lamaUsaha
    ) {
      return true;
    }

    return false;
  };

  const handleGoAsesmen = () => {
    if (isProfileComplete()) {
      navigate("/asesmen");
    } else {
      setShowProfileModal(true);
    }
  };

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
    if (score >= 80) return "bg-green-100 text-green-700";

    if (score >= 65) return "bg-blue-100 text-blue-700";

    if (score >= 50) return "bg-yellow-100 text-yellow-700";

    return "bg-red-100 text-red-700";
  };

  if (!factors.length) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen">
        <NavbarDashboard />

        <div className="px-4 sm:px-6 md:px-8 lg:px-16 py-8 md:py-10">
          <div className="bg-white p-5 sm:p-8 rounded-xl shadow border max-w-xl mx-auto text-center">
            <p className="text-gray-600">
              Data tidak ditemukan. Silakan lakukan asesmen terlebih dahulu.
            </p>

            <button
              onClick={handleGoAsesmen}
              className="mt-4 bg-blue-900 text-white px-4 py-2 rounded w-full sm:w-auto"
            >
              Ke Asesmen
            </button>
          </div>
        </div>

        {showProfileModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
            <div className="w-full max-w-[420px] rounded-xl bg-white p-6 text-center shadow-xl sm:p-8">
              <h2 className="text-lg font-semibold text-blue-900">
                Profil UMKM Belum Lengkap
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-gray-500">
                Anda belum mengisi profil. Jika ingin melakukan asesmen,
                silakan lengkapi profil terlebih dahulu.
              </p>

              <button
                onClick={() => navigate("/profil")}
                className="mt-6 w-full rounded-lg bg-blue-900 py-3 text-white transition hover:bg-blue-950"
              >
                Lengkapi Profil →
              </button>

              <button
                onClick={() => setShowProfileModal(false)}
                className="mt-4 text-sm text-gray-400"
              >
                Nanti Saja
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-[#f4f7fb] min-h-screen overflow-x-hidden">
      <NavbarDashboard />

      <div className="px-4 sm:px-6 md:px-8 lg:px-16 py-6 md:py-10">
        {/* HEADER */}
        <div className="bg-white p-5 sm:p-6 rounded-xl shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
              Ringkasan Wawasan Bisnis
            </h1>

            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Berikut rekomendasi berdasarkan performa Anda
            </p>
          </div>

          <div className="bg-blue-100 px-4 py-2 rounded-lg text-blue-900 font-semibold w-full sm:w-auto text-center shrink-0">
            Skor: {total}/100
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {factors.map((item, i) => {
            const key = normalize(item.name);
            const recs = rekomendasiMap[key] || [];

            return (
              <div
                key={i}
                className="bg-white p-5 sm:p-6 rounded-xl shadow border min-w-0"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                  <h3 className="font-semibold text-blue-900 leading-snug break-words">
                    {item.name}
                  </h3>

                  <span
                    className={`text-xs px-2 py-1 rounded w-fit shrink-0 ${getStatusColor(
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
                  <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg text-xs text-red-700 leading-relaxed">
                    Faktor ini menjadi prioritas utama untuk diperbaiki.
                  </div>
                )}

                {item.score >= 50 && item.score < 65 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-100 rounded-lg text-xs text-yellow-700 leading-relaxed">
                    Faktor ini masih perlu ditingkatkan agar lebih optimal.
                  </div>
                )}

                {item.score >= 65 && item.score < 80 && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-100 rounded-lg text-xs text-blue-700 leading-relaxed">
                    Faktor ini sudah cukup baik namun masih dapat ditingkatkan.
                  </div>
                )}

                {item.score >= 80 && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-100 rounded-lg text-xs text-green-700 leading-relaxed">
                    Faktor ini sudah sangat baik dan perlu dipertahankan.
                  </div>
                )}

                <ul className="text-sm space-y-2 text-gray-600 leading-relaxed">
                  {recs.map((r, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="shrink-0">✔</span>
                      <span>{r}</span>
                    </li>
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