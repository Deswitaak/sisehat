import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import { jsPDF } from "jspdf";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";

import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

export default function Hasil() {
  const location = useLocation();
  const navigate = useNavigate();

  const [showConfirm, setShowConfirm] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const data = location.state?.factors || [];
  const total = location.state?.total || 0;

  useEffect(() => {
    if (data.length) {
      const payload = {
        factors: data,
        total: total,
      };

      localStorage.setItem("hasilAnalisis", JSON.stringify(payload));
    }
  }, [data, total]);

  // 🔥 ranking
  const sorted = [...data].sort((a, b) => b.score - a.score);
  const highest = sorted[0];
  const second = sorted[1];
  const third = sorted[2];
  const lowest = sorted[sorted.length - 1];

  // 🔥 chart config
  const chartData = {
    labels: data.map((d) => d.name),
    datasets: [
      {
        data: data.map((d) => d.score / 20),
        backgroundColor: "rgba(59,130,246,0.2)",
        borderColor: "#163456",
        pointBackgroundColor: "#163456",
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      r: {
        min: 0,
        max: 5,
        ticks: { stepSize: 1 },
      },
    },
  };

  const getStatus = (score) => {
    if (score >= 85) return "OPTIMAL";
    if (score >= 70) return "STABIL";
    return "PERLU PERHATIAN";
  };

  // 🔥 DOWNLOAD PDF
  const handleDownloadPDF = () => {
    if (!data.length) {
      alert("Data hasil asesmen belum tersedia.");
      return;
    }

    try {
      setIsDownloading(true);

      const doc = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();

      const marginX = 16;
      let y = 18;

      const today = new Date().toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });

      const addPageIfNeeded = (neededHeight = 20) => {
        if (y + neededHeight > pageHeight - 18) {
          doc.addPage();
          y = 18;
        }
      };

      const addFooter = () => {
        const totalPages = doc.internal.getNumberOfPages();

        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);
          doc.setFontSize(9);
          doc.setTextColor(120, 120, 120);
          doc.text(
            `SiSehat - Halaman ${i} dari ${totalPages}`,
            pageWidth / 2,
            pageHeight - 10,
            { align: "center" }
          );
        }
      };

      // HEADER
      doc.setFillColor(22, 52, 86);
      doc.rect(0, 0, pageWidth, 34, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("Laporan Hasil Kesehatan Bisnis", marginX, 15);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.text(`Tanggal laporan: ${today}`, marginX, 24);

      y = 48;

      // SCORE BOX
      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(244, 247, 251);
      doc.roundedRect(marginX, y, pageWidth - marginX * 2, 32, 4, 4, "FD");

      doc.setTextColor(22, 52, 86);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.text("Skor Keseluruhan", marginX + 6, y + 10);

      doc.setFontSize(24);
      doc.text(`${total}/100`, marginX + 6, y + 24);

      doc.setFont("helvetica", "normal");
      doc.setTextColor(90, 90, 90);
      doc.setFontSize(10);
      doc.text(
        "Laporan ini dibuat berdasarkan 6 metrik utama asesmen SiSehat.",
        marginX + 55,
        y + 18
      );

      y += 45;

      // SUMMARY
      addPageIfNeeded(36);

      doc.setTextColor(22, 52, 86);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Summary Insight", marginX, y);

      y += 8;

      doc.setTextColor(70, 70, 70);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);

      const summaryText = `Analisis menunjukkan kekuatan signifikan pada pilar ${
        highest?.name || "-"
      }. Faktor yang perlu mendapat perhatian lebih adalah ${
        lowest?.name || "-"
      }. Rekomendasi perbaikan dapat difokuskan pada faktor dengan skor terendah.`;

      const summaryLines = doc.splitTextToSize(
        summaryText,
        pageWidth - marginX * 2
      );

      doc.text(summaryLines, marginX, y);
      y += summaryLines.length * 6 + 8;

      // METRIK TERATAS
      addPageIfNeeded(40);

      doc.setTextColor(22, 52, 86);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Metrik Teratas", marginX, y);

      y += 9;

      [highest, second, third].forEach((item, index) => {
        if (!item) return;

        addPageIfNeeded(15);

        doc.setFillColor(244, 247, 251);
        doc.roundedRect(marginX, y - 5, pageWidth - marginX * 2, 12, 3, 3, "F");

        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.setFont("helvetica", "normal");
        doc.text(`${index + 1}. ${item.name}`, marginX + 4, y + 2);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(22, 52, 86);
        doc.text(`${item.score}/100`, pageWidth - marginX - 4, y + 2, {
          align: "right",
        });

        y += 15;
      });

      y += 5;

      // RINCIAN SKOR
      addPageIfNeeded(30);

      doc.setTextColor(22, 52, 86);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Rincian Skor Faktor Organisasi", marginX, y);

      y += 10;

      // TABLE HEADER
      doc.setFillColor(22, 52, 86);
      doc.rect(marginX, y, pageWidth - marginX * 2, 10, "F");

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(9);
      doc.setFont("helvetica", "bold");
      doc.text("Faktor", marginX + 4, y + 6);
      doc.text("Status", marginX + 105, y + 6);
      doc.text("Skor", pageWidth - marginX - 4, y + 6, { align: "right" });

      y += 10;

      data.forEach((item, index) => {
        addPageIfNeeded(18);

        const rowHeight = 12;
        const isEven = index % 2 === 0;

        doc.setFillColor(isEven ? 248 : 255, isEven ? 250 : 255, isEven ? 252 : 255);
        doc.rect(marginX, y, pageWidth - marginX * 2, rowHeight, "F");

        doc.setTextColor(60, 60, 60);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9);

        const factorName = doc.splitTextToSize(item.name, 85);
        doc.text(factorName[0], marginX + 4, y + 7);

        doc.text(getStatus(item.score), marginX + 105, y + 7);

        doc.setFont("helvetica", "bold");
        doc.setTextColor(22, 52, 86);
        doc.text(`${item.score}/100`, pageWidth - marginX - 4, y + 7, {
          align: "right",
        });

        y += rowHeight;
      });

      y += 12;

      // CATATAN
      addPageIfNeeded(34);

      doc.setDrawColor(220, 220, 220);
      doc.setFillColor(255, 255, 255);
      doc.roundedRect(marginX, y, pageWidth - marginX * 2, 28, 3, 3, "FD");

      doc.setTextColor(22, 52, 86);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text("Catatan", marginX + 5, y + 8);

      doc.setTextColor(90, 90, 90);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);

      const noteText =
        "Hasil laporan ini merupakan ringkasan dari data asesmen yang diisi pengguna. Gunakan laporan ini sebagai bahan evaluasi dan perbaikan usaha.";

      const noteLines = doc.splitTextToSize(noteText, pageWidth - marginX * 2 - 10);
      doc.text(noteLines, marginX + 5, y + 16);

      addFooter();

      const fileName = `laporan-sisehat-${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      doc.save(fileName);

      localStorage.setItem("lastPdfReportSavedAt", new Date().toISOString());
    } catch (error) {
      console.error(error);
      alert("Gagal membuat PDF. Coba ulangi lagi.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="bg-[#f4f7fb] min-h-screen overflow-x-hidden">
      <NavbarDashboard />

      <div className="px-4 sm:px-6 md:px-8 lg:px-16 py-6 md:py-10">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 sm:gap-6">
          <div className="min-w-0">
            <p className="text-sm text-gray-400">Asesmen › Hasil Analisis</p>
            <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mt-2 leading-tight">
              Hasil Kesehatan Bisnis Anda
            </h1>
            <p className="text-gray-500 mt-2 text-sm sm:text-base">
              Laporan berdasarkan 6 metrik utama
            </p>
          </div>

          {/* SCORE */}
          <div className="bg-white p-5 sm:p-6 rounded-xl shadow w-full lg:w-[220px] shrink-0">
            <p className="text-xs text-gray-400">CURRENT SCORE</p>

            <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row sm:justify-between sm:items-center lg:items-start xl:items-center gap-3 mt-2">
              <h2 className="text-4xl font-bold text-blue-900">
                {total}
                <span className="text-sm text-gray-400">/100</span>
              </h2>

              <div className="text-xs text-gray-500">
                <p className="font-semibold text-blue-900">
                  Stable Performance
                </p>
                <p>Meningkat 4.2%</p>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          {/* CHART */}
          <div className="xl:col-span-2 bg-white p-5 sm:p-6 rounded-xl shadow min-w-0">
            <h3 className="font-semibold text-blue-900 mb-4">
              Organizational Spider Chart
            </h3>

            <div className="relative h-[300px] sm:h-[380px] lg:h-[430px] w-full">
              <Radar data={chartData} options={options} />
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-4 sm:gap-6 min-w-0">
            {/* SUMMARY */}
            <div className="bg-[#2f436e] text-white p-5 sm:p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-4">Summary Insight</h3>

              <p className="text-sm opacity-90 leading-relaxed">
                Analisis menunjukkan kekuatan signifikan pada pilar{" "}
                <b>{highest?.name}</b> dan Stability. Disarankan untuk
                meningkatkan faktor <b>{lowest?.name}</b>.
              </p>

              <button
                type="button"
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="mt-6 w-full border border-white/30 py-3 rounded-lg text-sm hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isDownloading ? "MENYIAPKAN PDF..." : "UNDUH LAPORAN PDF"}
              </button>
            </div>

            {/* METRIK */}
            <div className="bg-white p-5 sm:p-6 rounded-xl shadow">
              <h3 className="font-semibold mb-4 text-blue-900">
                Metrik Teratas
              </h3>

              {[highest, second, third].map((item, i) => (
                <div key={i} className="mb-4">
                  <div className="flex justify-between gap-4 text-sm mb-1">
                    <span className="truncate">{item?.name}</span>
                    <span className="shrink-0">{item?.score}/100</span>
                  </div>

                  <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-900 h-2 rounded-full"
                      style={{ width: `${item?.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white mt-6 sm:mt-8 rounded-xl shadow overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 px-5 sm:px-6 py-4 border-b">
            <h3 className="font-semibold text-blue-900">
              Rincian Skor Faktor Organisasi
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead className="bg-gray-50 text-gray-400 text-xs">
                <tr>
                  <th className="text-left p-4">Faktor</th>
                  <th>Status</th>
                  <th>Skor</th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, i) => (
                  <tr key={i} className="border-t text-center">
                    <td className="text-left p-4 font-medium">{item.name}</td>
                    <td>{getStatus(item.score)}</td>
                    <td className="font-semibold text-blue-900">
                      {item.score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* BUTTON */}
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 sm:gap-4 mt-6 sm:mt-8">
          {/* 🔥 BATAL (POPUP) */}
          <button
            onClick={() => setShowConfirm(true)}
            className="px-6 py-3 border rounded-lg text-red-500 w-full sm:w-auto"
          >
            Batal
          </button>

          <button
            onClick={() => {
              const payload = {
                factors: data,
                total: total,
              };

              // 🔥 simpan ke localStorage
              localStorage.setItem("hasilAnalisis", JSON.stringify(payload));

              navigate("/perbandingan", {
                state: payload,
              });
            }}
            className="px-6 py-3 bg-blue-900 text-white rounded-lg w-full sm:w-auto"
          >
            Simpan Data
          </button>
        </div>
      </div>

      {/* ================= POPUP ================= */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-[420px] rounded-xl p-6 sm:p-8 text-center shadow-xl">
            {/* ICON */}
            <div className="w-16 h-16 bg-yellow-100 mx-auto rounded-xl flex items-center justify-center relative">
              <span className="text-2xl">⚠️</span>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                !
              </span>
            </div>

            <h2 className="text-xl font-semibold text-blue-900 mt-6">
              Konfirmasi Pembatalan
            </h2>

            <p className="text-gray-500 mt-3 text-sm leading-relaxed">
              Apakah Anda yakin ingin membatalkan? Data yang sudah diisi akan
              hilang permanen.
            </p>

            <div className="mt-6 space-y-3">
              {/* YA */}
              <button
                onClick={() => {
                  setShowConfirm(false);
                  navigate("/asesmen");
                }}
                className="w-full bg-red-600 text-white py-3 rounded-lg"
              >
                Ya, batal
              </button>

              {/* TIDAK */}
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full border py-3 rounded-lg text-gray-600"
              >
                Tidak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}