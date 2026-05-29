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
console.log(data.factors);

  // 🔥 FALLBACK
  if (!data) {
    return (
      <div className="bg-[#f4f7fb] min-h-screen flex items-center justify-center">

        <div className="bg-white p-10 rounded-2xl shadow text-center">

          <h1 className="text-2xl font-bold text-blue-900">
            Data UMKM Tidak Ditemukan
          </h1>

          <button
            onClick={() => navigate("/eksplorasi")}
            className="mt-6 bg-blue-900 text-white px-5 py-2 rounded-xl"
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
    <div className="bg-[#f4f7fb] min-h-screen">

      <NavbarDashboard />

      <div className="px-4 md:px-8 lg:px-16 py-6 md:py-10">

        {/* BACK */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-blue-900 font-medium"
        >
          ← Kembali
        </button>

        {/* HEADER */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border">

          <div className="flex justify-between items-start flex-wrap gap-6">

            <div>

              <h1 className="text-2xl md:text-3xl font-bold text-blue-900">

                {data.nama_usaha}

              </h1>

              <p className="text-gray-500 mt-2">
                Detail kesehatan organisasi UMKM
                berdasarkan hasil asesmen terakhir.
              </p>

              {/* INFO */}
              <div className="flex flex-wrap gap-3 mt-5">

                <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">

                  {data.kategori}

                </span>

                <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">

                  {data.jenis_usaha}

                </span>

                <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">
  {data.posisi}
</span>

                <span className="bg-gray-100 px-4 py-2 rounded-full text-sm">

                  {data.lama_usaha} Tahun

                </span>

              </div>

            </div>

            {/* STATUS */}
            <div className={`px-5 py-3 rounded-full text-sm font-semibold ${
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

            <div className="bg-[#f4f7fb] p-5 rounded-xl">

              <p className="text-sm text-gray-400">
                Total Score
              </p>

              <h2 className="text-3xl font-bold text-blue-900 mt-2">

                {data.total_score}

              </h2>

            </div>

            <div className="bg-[#f4f7fb] p-5 rounded-xl">

              <p className="text-sm text-gray-400">
                Faktor Tertinggi
              </p>

              <h2 className="text-xl font-bold text-blue-900 mt-2">

                {highest?.name}

              </h2>

            </div>

            <div className="bg-[#f4f7fb] p-5 rounded-xl">

              <p className="text-sm text-gray-400">
                Faktor Terendah
              </p>

              <h2 className="text-xl font-bold text-red-500 mt-2">

                {lowest?.name}

              </h2>

            </div>

          </div>

       <div className="mt-10">

  <h2 className="text-xl font-semibold text-blue-900 mb-6">
    Visualisasi Faktor Strategis
  </h2>

  <div className="max-w-[650px] h-[450px] mx-auto">

    <Radar
      data={radarData}
      options={options}
    />

  </div>

</div>
        </div>

        {/* CARD FAKTOR */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

          {faktorData.map((item, i) => (

            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border p-6"
            >

              <p className="text-sm text-gray-400">

                {item.name}

              </p>

              <h2 className="text-3xl font-bold text-blue-900 mt-3">

                {item.score}

              </h2>

              <div className="mt-4">

                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  getStatus(item.score).color
                }`}>

                  {getStatus(item.score).label}

                </span>

              </div>

            </div>

          ))}

        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mt-10">

          <div className="px-6 py-5 border-b">

            <h2 className="font-semibold text-blue-900">

              Detail Analisis Faktor

            </h2>

          </div>

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-500">

              <tr>

                <th className="p-4 text-left">
                  Faktor
                </th>

                <th>
                  Score
                </th>

                <th>
                  Status
                </th>

                <th>
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

                    <td className="font-semibold text-blue-900">

                      {item.score}

                    </td>

                    <td>

                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${status.color}`}>

                        {status.label}

                      </span>

                    </td>

                    <td className="text-gray-500">

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

      </div>

    </div>
  );
}