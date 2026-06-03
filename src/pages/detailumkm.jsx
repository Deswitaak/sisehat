import {
  useLocation,
  useNavigate
} from "react-router-dom";

import NavbarDashboard from "../components/NavbarDashboard";

import {
  Radar
} from "react-chartjs-2";

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function DetailUMKM() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  console.log("STATE MASUK", data);
  console.log(data);
  console.log(data?.factors);

  // 🔥 FALLBACK
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb] px-4 py-8">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center shadow sm:p-10">
          <h1 className="text-xl font-bold text-blue-900 sm:text-2xl">
            Data UMKM Tidak Ditemukan
          </h1>

          <button
            onClick={() => navigate("/eksplorasi")}
            className="mt-6 rounded-xl bg-blue-900 px-5 py-3 text-white transition hover:bg-blue-950"
          >
            Kembali ke Eksplorasi
          </button>
        </div>
      </div>
    );
  }

  // 🔥 RADAR
  const radarData = {
    labels:
      data.factors?.map(
        (f) => f.name
      ) || [],

    datasets: [
      {
        label:
          data.nama_usaha,

        data:
          data.factors?.map(
            (f) => Number(f.score)
          ) || [],

        backgroundColor:
          "rgba(37,99,235,0.2)",

        borderColor:
          "#1d4ed8",

        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      r: {
        min: 0,
        max: 100,

        ticks: {
          stepSize: 20,
        },
      },
    },
  };

  // 🔥 STATUS
  const getStatus = (value) => {
    if (value >= 85)
      return {
        label: "Optimal",
        color:
          "bg-green-100 text-green-700",
      };

    if (value >= 70)
      return {
        label: "Stabil",
        color:
          "bg-blue-100 text-blue-700",
      };

    return {
      label: "Perlu Perhatian",
      color:
        "bg-red-100 text-red-600",
    };
  };

  // 🔥 FAKTOR
  const faktorData =
    data.factors || [];

  // 🔥 SORT
  const sorted =
    [...faktorData].sort(
      (a, b) => b.score - a.score
    );

  const highest =
    sorted[0];

  const lowest =
    sorted[
      sorted.length - 1
    ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f7fb]">
      <NavbarDashboard />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-10 lg:px-12 xl:px-16">
        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 font-medium text-blue-900 transition hover:text-blue-700"
        >
          ← Kembali
        </button>

        {/* HEADER */}
        <section className="rounded-2xl border bg-white p-4 shadow-sm sm:p-6 lg:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <h1 className="break-words text-2xl font-bold text-blue-900 md:text-3xl">
                {data.nama_usaha}
              </h1>

              <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-500 sm:text-base">
                Detail kesehatan organisasi UMKM
                berdasarkan hasil asesmen terakhir.
              </p>

              {/* INFO */}
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
                  {data.kategori}
                </span>

                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
                  {data.jenis_usaha}
                </span>

                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
                  {data.posisi}
                </span>

                <span className="rounded-full bg-gray-100 px-4 py-2 text-sm">
                  {data.lama_usaha} Tahun
                </span>
              </div>
            </div>

            {/* STATUS */}
            <div className={`w-fit shrink-0 rounded-full px-5 py-3 text-sm font-semibold ${
              data.total_score >= 85
                ? "bg-green-100 text-green-700"
                : data.total_score >= 70
                ? "bg-blue-100 text-blue-700"
                : "bg-red-100 text-red-600"
            }`}>
              {data.status}
            </div>
          </div>

          {/* SCORE */}
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
            <div className="rounded-xl bg-[#f4f7fb] p-5">
              <p className="text-sm text-gray-400">
                Total Score
              </p>

              <h2 className="mt-2 text-3xl font-bold text-blue-900">
                {data.total_score}
              </h2>
            </div>

            <div className="rounded-xl bg-[#f4f7fb] p-5">
              <p className="text-sm text-gray-400">
                Faktor Tertinggi
              </p>

              <h2 className="mt-2 break-words text-xl font-bold text-blue-900">
                {highest?.name || "-"}
              </h2>
            </div>

            <div className="rounded-xl bg-[#f4f7fb] p-5">
              <p className="text-sm text-gray-400">
                Faktor Terendah
              </p>

              <h2 className="mt-2 break-words text-xl font-bold text-red-500">
                {lowest?.name || "-"}
              </h2>
            </div>
          </div>

          <div className="mt-10">
            <h2 className="mb-6 text-xl font-semibold text-blue-900">
              Visualisasi Faktor Strategis
            </h2>

            <div className="mx-auto h-[300px] w-full max-w-[650px] sm:h-[380px] lg:h-[450px]">
              <Radar
                data={radarData}
                options={options}
              />
            </div>
          </div>
        </section>

        {/* CARD FAKTOR */}
        <section className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {faktorData.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl border bg-white p-5 shadow-sm sm:p-6"
            >
              <p className="break-words text-sm text-gray-400">
                {item.name}
              </p>

              <h2 className="mt-3 text-3xl font-bold text-blue-900">
                {item.score}
              </h2>

              <div className="mt-4">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                  getStatus(item.score).color
                }`}>
                  {getStatus(item.score).label}
                </span>
              </div>
            </div>
          ))}
        </section>

        {/* TABLE */}
        <section className="mt-10 overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="border-b px-4 py-5 sm:px-6">
            <h2 className="font-semibold text-blue-900">
              Detail Analisis Faktor
            </h2>
          </div>

          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="p-4 text-left">
                    Faktor
                  </th>

                  <th className="p-4 text-center">
                    Score
                  </th>

                  <th className="p-4 text-center">
                    Status
                  </th>

                  <th className="p-4 text-center">
                    Insight
                  </th>
                </tr>
              </thead>

              <tbody>
                {faktorData.map((item, i) => {
                  const status =
                    getStatus(item.score);

                  return (
                    <tr
                      key={i}
                      className="border-t text-center"
                    >
                      <td className="p-4 text-left font-medium">
                        {item.name}
                      </td>

                      <td className="p-4 font-semibold text-blue-900">
                        {item.score}
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${status.color}`}>
                          {status.label}
                        </span>
                      </td>

                      <td className="p-4 text-gray-500">
                        {item.score >= 85
                          ? "Performa sangat optimal"
                          : item.score >= 70
                          ? "Performa cukup baik"
                          : "Membutuhkan peningkatan"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
