import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import NavbarDashboard from "../components/NavbarDashboard";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export default function Perbandingan() {

  const location = useLocation();
  const navigate = useNavigate();

  // 🔥 ambil data (state + localStorage)
  const saved = JSON.parse(
    localStorage.getItem("hasilAnalisis")
  );

  const factors =
    location.state?.factors ||
    saved?.factors ||
    [];

  const total =
    location.state?.total_score ||
    saved?.total ||
    0;

  const umkm = location.state;

  // 🔥 redirect kalau kosong
  useEffect(() => {
    if (!factors.length) {
      navigate("/asesmen");
    }
  }, [factors, navigate]);

  useEffect(() => {

  const user =
    JSON.parse(localStorage.getItem("user"));

  if (!user?.id_user) return;

  fetch(
    `http://localhost/sisehat/api-sisehat/history_assessment.php?id_user=${user.id_user}`
  )
    .then((res) => res.json())
    .then((data) => {

      setAssessmentHistory(data);

      if (data.length > 0) {
        setSelectedAssessment(0);

        setCurrentFactors(
          data[0].factors
        );

        setCurrentTotal(
          data[0].total_score
        );

      }

    });

}, []);


 const [assessmentHistory, setAssessmentHistory] =
  useState([]);

const [selectedAssessment, setSelectedAssessment] =
  useState(0);

const [currentFactors, setCurrentFactors] =
  useState(factors);

const [currentTotal, setCurrentTotal] =
  useState(total);

  // 🔥 PILIHAN INDUSTRI
  const [selectedIndustry, setSelectedIndustry] =
    useState("umkm");

const [industryData, setIndustryData] =
  useState([]);

  useEffect(() => {

  const kategoriMap = {
    umkm: "Kuliner",
    kuliner: "Kuliner",
    fashion: "Fashion",
    retail: "Retail",
    jasa: "Jasa"
  };

  fetch(
    `http://localhost/sisehat/api-sisehat/compare.php?kategori=${kategoriMap[selectedIndustry]}`
  )
    .then((res) => res.json())
    .then((data) => {

      setIndustryData(
        data.factors || []
      );

    });

}, [selectedIndustry]);

  // 🔥 INDUSTRI
  const industryOptions = [

    {
      id: "umkm",
      label: "UMKM Nasional",
    },

    {
      id: "kuliner",
      label: "UMKM Kuliner",
    },

    {
      id: "fashion",
      label: "UMKM Fashion",
    },

    {
      id: "retail",
      label: "UMKM Retail",
    },

    {
      id: "jasa",
      label: "UMKM Jasa",
    },

  ];

 const filteredIndustry =
  industryData.filter(
    (item) =>
      currentFactors.some(
        (f) =>
          f.name === item.name
      )
  );
  console.log("CURRENT", currentFactors);
console.log("INDUSTRY", industryData);
console.log("FILTERED", filteredIndustry);

  // 🔥 chart
  const chartData = {

   labels:
  currentFactors.map((f) => f.name),

    datasets: [

      {
        label: "Hasil Anda",

        data:
  currentFactors.map(
    (f) => f.score
  ),

        backgroundColor:
          "rgba(59,130,246,0.2)",

        borderColor:
          "#163456",
      },

      {
        label:
          industryOptions.find(
            (i) =>
              i.id === selectedIndustry
          )?.label,

       data:
  filteredIndustry.map(
    (f) => f.score
  ),
        borderColor:
          "#9ca3af",

        borderDash: [5, 5],
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

  return (
    <div className="bg-[#f4f7fb] min-h-screen">

      <NavbarDashboard />

      <div className="px-4 md:px-8 lg:px-16 py-6 md:py-10">

        {/* HEADER */}
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">

          Perbandingan Asesmen Bisnis

        </h1>

        <p className="text-gray-500 mt-2">

          Analisis performa bisnis Anda dibandingkan dengan standar industri

        </p>

        {/* TOP FILTER */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

          {/* ASESMEN */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">

            <p className="text-xs text-gray-400 mb-2">

              Pilih Asesmen

            </p>

      <select
  value={selectedAssessment}
  onChange={(e) => {

    const index =
      Number(e.target.value);

    setSelectedAssessment(index);

    setCurrentFactors(
      assessmentHistory[index]
        ?.factors || []
    );

    setCurrentTotal(
      assessmentHistory[index]
        ?.total_score || 0
    );

  }}
  className="w-full border p-2 rounded-lg"
>

              {assessmentHistory.map(
  (item, index) => (

  <option
  key={index}
  value={index}
>
  {new Date(item.tanggal_asesmen)
    .toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    })}
</option>

  )
)}

            </select>

          </div>

          {/* INDUSTRI */}
          <div className="bg-white p-4 rounded-xl shadow">

            <p className="text-xs text-gray-400 mb-2">

              Bandingkan Industri

            </p>

            <select
              value={selectedIndustry}
              onChange={(e) =>
                setSelectedIndustry(
                  e.target.value
                )
              }
            className="w-full border p-2 rounded-lg"
            >

              {industryOptions.map(
                (item) => (

                  <option
                    key={item.id}
                    value={item.id}
                  >

                    {item.label}

                  </option>

                )
              )}

            </select>

          </div>

        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">

          {/* CHART */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">

            <h3 className="font-semibold text-blue-900 mb-4">

              Visualisasi 6 Faktor Strategis

            </h3>

            <Radar
              data={chartData}
              options={options}
            />
            <p className="text-sm text-gray-500 mt-4">

  Membandingkan dengan{" "}

  <span className="font-semibold text-blue-900">

    {
      industryOptions.find(
        (i) =>
          i.id === selectedIndustry
      )?.label
    }

  </span>

</p>

          </div>

          {/* RIGHT */}
          <div className="flex flex-col gap-6">

            {/* INSIGHT */}
            <div className="bg-blue-900 text-white p-6 rounded-xl">

              <h3 className="font-semibold mb-2">

                Wawasan Perbandingan

              </h3>

              <p className="text-sm leading-relaxed">

                Hasil asesmen Anda dibandingkan
                dengan rata-rata{" "}

                <b>
                  {
                    industryOptions.find(
                      (i) =>
                        i.id ===
                        selectedIndustry
                    )?.label
                  }
                </b>.

              </p>

            </div>

            {/* SCORE */}
            <div className="bg-white p-6 rounded-xl shadow">

              <p className="text-sm text-gray-400">

                Skor Anda

              </p>

              <h2 className="text-3xl font-bold text-blue-900 mt-2">

                {currentTotal}/100

              </h2>

            </div>

          </div>

        </div>

        {/* SUMMARY */}
<div className="bg-white p-6 rounded-xl shadow">

  <h3 className="font-semibold text-blue-900 mb-3">

    Ringkasan Analisis

  </h3>

  <p className="text-sm text-gray-600 leading-relaxed">

    Bisnis Anda memiliki performa{" "}

    <span className="font-semibold text-blue-900">

      {
        currentTotal >= 85
          ? "sangat baik"
          : currentTotal >= 70
          ? "cukup stabil"
          : "yang masih perlu ditingkatkan"
      }

    </span>

    {" "}dibandingkan rata-rata{" "}

    <span className="font-semibold text-blue-900">

      {
        industryOptions.find(
          (i) =>
            i.id === selectedIndustry
        )?.label
      }

    </span>.

  </p>

</div>

        {/* TABLE */}
        <div className="bg-white mt-8 rounded-xl shadow overflow-hidden">

          <div className="px-6 py-4 border-b flex justify-between">

            <h3 className="font-semibold text-blue-900">

              Rincian Perbandingan Per Faktor

            </h3>

          </div>

          <table className="w-full text-sm">

            <thead className="bg-gray-50 text-gray-400 text-xs">

              <tr>

                <th className="p-4 text-left">

                  Faktor

                </th>

                <th>

                  Hasil Anda

                </th>

                <th>

                  Industri

                </th>

                <th>

                  Delta

                </th>

              </tr>

            </thead>

            <tbody>

              {currentFactors.map(
                (item, i) => {

                 const avg =
  filteredIndustry.find(
    (f) =>
      f.name === item.name
  )?.score || 0;
                  const delta =
                    item.score - avg;

                  return (

                    <tr
                      key={i}
                      className="border-t text-center"
                    >

                      <td className="text-left p-4">

                        {item.name}

                      </td>

                      <td>

                        {item.score}

                      </td>

                      <td>

                        {avg}

                      </td>

                      <td
                        className={
                          delta >= 0
                            ? "text-green-600 font-semibold"
                            : "text-red-500 font-semibold"
                        }
                      >

                        {delta >= 0
                          ? "+"
                          : ""}

                        {delta}

                      </td>

                    </tr>
                  );
                }
              )}

            </tbody>

          </table>

        </div>

        {/* BUTTON */}
        <div className="flex justify-center mt-10">

          <button
            onClick={() =>
              navigate(
                "/rekomendasi",
                {
                  state: {
  factors: currentFactors,
  total: currentTotal,
},
                }
              )
            }
            className="bg-blue-900 text-white px-6 py-3 rounded-lg shadow"
          >

            Lihat Rekomendasi Perbaikan

          </button>

        </div>

      </div>

    </div>
  );
}