import { useState, useEffect } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import { useNavigate } from "react-router-dom";

import rawData from "../data/raw_data.json";

import { Radar, Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  CategoryScale,
  LinearScale,
  BarElement
);

export default function Beranda() {
  const profileData = JSON.parse(localStorage.getItem("profileData"));

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  // =========================================================
  // 🔥 SINKRONISASI LUAR STATUS AKUN (URL RELATIF ANTI-CORS)
  // =========================================================
  useEffect(() => {
    const syncProfileStatus = async () => {
      const currentUser = JSON.parse(localStorage.getItem("user"));
      if (!currentUser?.id_user) return;

      try {
        // Menggunakan URL Relatif agar mengikuti domain hosting secara otomatis
        const response = await fetch(`/api-sisehat/get_profile.php?id_user=${currentUser.id_user}`);
        if (!response.ok) return;

        const result = await response.json().catch(() => null);

        // Jika data profil memang belum ada (Akun Baru), set status false secara silent tanpa pop-up eror
        if (result && result.status === "error") {
          localStorage.setItem("profileComplete", "false");
          return;
        }

        // Jika data ada di database, sinkronkan ke local storage
        if (result && result.status === "success") {
          localStorage.setItem("profileComplete", "true");
        }
      } catch (error) {
        console.warn("Sinkronisasi latar beranda aktif dalam mode lokal offline.");
      }
    };

    syncProfileStatus();
  }, []);

  // 🔥 TOTAL RESPONDEN
  const totalUMKM = rawData.length;

  // 🔥 HITUNG RATA-RATA
  const average = (keys) => {
    let total = 0;

    rawData.forEach((item) => {
      keys.forEach((key) => {
        total += Number(item[key]);
      });
    });

    return (total / (rawData.length * keys.length)).toFixed(2);
  };

  // 🔥 DATA DASHBOARD DARI JSON ASLI
  const data = {
    factors: [
      {
        code: "OV",
        value: Number(
          average(["OH1", "OH2", "OH3", "OH4", "OH5", "OH6", "OH7", "OH8", "OH9"])
        ),
      },
      {
        code: "LI",
        value: Number(average(["OH10", "OH11", "OH12", "OH13", "OH14", "OH15"])),
      },
      {
        code: "IR",
        value: Number(average(["OH16", "OH17", "OH18", "OH19", "OH20", "OH21"])),
      },
      {
        code: "OS",
        value: Number(average(["OH22", "OH23", "OH24", "OH25", "OH26"])),
      },
      {
        code: "QW",
        value: Number(average(["OH27", "OH28", "OH29", "OH30", "OH31"])),
      },
      {
        code: "EP",
        value: Number(average(["OH32", "OH33", "OH34", "OH35"])),
      },
    ],

    // 🔥 DISTRIBUSI SEMENTARA
    distribution: [25, 49, 29, 44],

    // 🔥 TOP 3
    rankingTop: [...rawData].sort((a, b) => b.TOTAL - a.TOTAL).slice(0, 3),

    // 🔥 BOTTOM 3
    rankingBottom: [...rawData].sort((a, b) => a.TOTAL - b.TOTAL).slice(0, 3),
  };

  // 🔥 VALUES
  const values = data.factors.map((f) => f.value);

  const total = values.reduce((a, b) => a + b, 0);
  const avg = total / values.length;
  const score = ((total * 100) / 30).toFixed(1);

  const min = Math.min(...values);
  const max = Math.max(...values);

  const variance =
    values.reduce((sum, v) => sum + Math.pow(v - avg, 2), 0) / values.length;
  const std = Math.sqrt(variance).toFixed(2);

  const highest = data.factors.find((f) => f.value === max);
  const lowest = data.factors.find((f) => f.value === min);

  // 🔥 STATUS
  const getStatus = (v) => {
    if (v >= 3.25) return ["Optimal", "bg-green-100 text-green-700"];
    if (v >= 2.25) return ["Stabil", "bg-blue-100 text-blue-700"];
    return ["Perlu Perhatian", "bg-red-100 text-red-600"];
  };

  // 🔥 RADAR
  const radarData = {
    labels: data.factors.map((f) => f.code),
    datasets: [
      {
        data: values,
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "#163456",
        pointBackgroundColor: "#163456",
        borderWidth: 2,
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        beginAtZero: true,
        suggestedMax: 5,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // 🔥 BAR
  const barData = {
    labels: ["1-2", "2-3", "3-4", "4-5"],
    datasets: [
      {
        data: data.distribution,
        backgroundColor: "#163456",
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // 🔥 BUTTON
  const handleStart = () => {
    const isComplete = localStorage.getItem("profileComplete");

    console.log("PROFILE COMPLETE:", isComplete);

    if (isComplete === "true") {
      navigate("/asesmen");
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] overflow-x-hidden">
      <NavbarDashboard />

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-xl bg-white p-6 text-center shadow-xl sm:p-8">
            <h2 className="text-lg font-semibold text-blue-900">
              Profil UMKM Belum Lengkap
            </h2>

            <p className="mt-3 text-sm text-gray-500">
              Harap lengkapi profil sebelum memulai asesmen.
            </p>

            <button
              onClick={() => navigate("/profile")}
              className="mt-6 w-full rounded-lg bg-blue-900 py-3 text-white transition hover:bg-blue-950"
            >
              Lengkapi Profil →
            </button>

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-400"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      )}

      {/* ================= CONTENT ================= */}
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-10 lg:px-12 xl:px-16">
        {/* HEADER */}
        <section>
          <h1 className="break-words text-2xl font-bold text-gray-900 md:text-3xl">
            Halo, {profileData?.nama || "Pengguna"}
          </h1>

          <p className="mt-1 text-sm text-gray-400">
            Dataset {totalUMKM} Responden UMKM di Jakarta dan Jawa Barat
          </p>
        </section>

        {/* GRID */}
        <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-6">
          {/* RADAR */}
          <div className="rounded-xl bg-white p-4 shadow sm:p-6 lg:col-span-2">
            <h3 className="mb-4 font-semibold text-gray-900">
              Radar Chart 6 Faktor Strategis
            </h3>

            <div className="h-[280px] w-full sm:h-[360px] lg:h-[430px]">
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>

          {/* SIDE */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:flex lg:flex-col">
            {/* SCORE */}
            <div className="rounded-xl bg-[#163456] p-5 text-white sm:p-6">
              <p>Skor Keseluruhan</p>

              <h2 className="mt-1 text-3xl font-bold sm:text-4xl">
                {score}/100
              </h2>

              <p className="mt-2 text-sm text-green-300">
                +4.2% dari sebelumnya
              </p>
            </div>

            {/* INSIGHT */}
            <div className="rounded-xl bg-white p-5 text-sm leading-relaxed shadow">
              Faktor tertinggi <b>{highest.code}</b> ({max.toFixed(2)}),
              terendah <b>{lowest.code}</b> ({min.toFixed(2)})
            </div>

            {/* STAT */}
            <div className="rounded-xl bg-white p-5 text-sm shadow sm:col-span-2 lg:col-span-1">
              <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
                <p>Mean: {avg.toFixed(2)}</p>
                <p>Min: {min.toFixed(2)}</p>
                <p>Max: {max.toFixed(2)}</p>
                <p>Std Dev: {std}</p>
              </div>
            </div>
          </div>
        </section>

        {/* SMALL BOX */}
        <section className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-4 text-center shadow">
            <p className="text-sm text-gray-400">Total Responden</p>
            <p className="text-xl font-bold">{totalUMKM}</p>
          </div>

          <div className="rounded-xl bg-white p-4 text-center shadow">
            <p className="text-sm text-gray-400">Rata-rata</p>
            <p className="text-xl font-bold">{avg.toFixed(2)}</p>
          </div>

          <div className="rounded-xl bg-white p-4 text-center shadow">
            <p className="text-sm text-gray-400">Tertinggi</p>
            <p className="text-xl font-bold">{highest.code}</p>
          </div>

          <div className="rounded-xl bg-white p-4 text-center shadow">
            <p className="text-sm text-gray-400">Terendah</p>
            <p className="text-xl font-bold">{lowest.code}</p>
          </div>
        </section>

        {/* RINCIAN FAKTOR */}
        <section className="mt-6 rounded-xl bg-white p-4 shadow sm:p-6">
          <h3 className="mb-4 font-semibold text-gray-900">
            Rincian Faktor
          </h3>

          {/* MOBILE CARD - TIDAK PERLU SWIPE */}
          <div className="grid grid-cols-1 gap-3 md:hidden">
            {data.factors.map((f, i) => {
              const s = getStatus(f.value);
              const skor = (f.value * 20).toFixed(1);

              return (
                <div
                  key={i}
                  className="rounded-xl border bg-[#f8fafc] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Faktor</p>
                      <p className="mt-1 text-lg font-bold text-blue-900">
                        {f.code}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${s[1]}`}
                    >
                      {s[0]}
                    </span>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">Skor</span>
                      <span className="font-semibold text-gray-800">
                        {skor}/100
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-gray-200">
                      <div
                        className="h-2 rounded-full bg-blue-900"
                        style={{ width: `${skor}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden md:block">
            <table className="w-full text-sm">
              <thead className="border-b text-gray-400">
                <tr>
                  <th className="py-2 text-left font-medium">Faktor</th>
                  <th className="py-2 text-center font-medium">Status</th>
                  <th className="py-2 text-center font-medium">Skor</th>
                </tr>
              </thead>

              <tbody>
                {data.factors.map((f, i) => {
                  const s = getStatus(f.value);

                  return (
                    <tr
                      key={i}
                      className="border-b text-center last:border-b-0"
                    >
                      <td className="py-3 text-left font-medium text-gray-800">
                        {f.code}
                      </td>

                      <td className="py-3">
                        <span
                          className={`inline-flex whitespace-nowrap rounded px-2 py-1 ${s[1]}`}
                        >
                          {s[0]}
                        </span>
                      </td>

                      <td className="py-3">{(f.value * 20).toFixed(1)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* BOTTOM */}
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6">
          {/* BAR */}
          <div className="rounded-xl bg-white p-4 shadow sm:p-6">
            <h3 className="mb-4 font-semibold text-gray-900">
              Distribusi Nilai
            </h3>

            <div className="h-[260px] w-full sm:h-[320px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          {/* RANK */}
          <div className="rounded-xl bg-white p-4 shadow sm:p-6">
            <h3 className="mb-2 font-semibold text-gray-900">Top 3</h3>

            {rawData.length > 0 && data.rankingTop.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 border-b py-2 text-sm sm:text-base"
              >
                <span className="truncate">🥇 UMKM {r.ID}</span>
                <b className="shrink-0">{r.TOTAL}</b>
              </div>
            ))}

            <h3 className="mb-2 mt-4 font-semibold text-gray-900">
              Bottom 3
            </h3>

            {rawData.length > 0 && data.rankingBottom.map((r, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-4 border-b py-2 text-sm sm:text-base"
              >
                <span className="truncate">⚠️ UMKM {r.ID}</span>
                <b className="shrink-0">{r.TOTAL}</b>
              </div>
            ))}
          </div>
        </section>

        {/* BUTTON */}
        <div className="mt-10 text-center">
          <button
            onClick={handleStart}
            className="w-full rounded-lg bg-blue-900 px-6 py-3 text-white transition hover:bg-blue-950 sm:w-auto"
          >
            Mulai Asesmen Baru
          </button>
        </div>
      </main>
    </div>
  );
}