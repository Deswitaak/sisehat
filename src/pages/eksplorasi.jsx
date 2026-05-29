import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarDashboard from "../components/NavbarDashboard";
import { useEffect } from "react";

export default function Eksplorasi() {

  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const [data, setData] = useState([]);

  // 🔥 SIMULASI DATA API
useEffect(() => {

  fetch(
    "http://localhost/sisehat/api-sisehat/get_umkm.php"
  )
    .then((res) => res.json())
    .then((data) => {

      console.log("API UMKM", data);

      setData(data);

    })
    .catch((err) => {

      console.error(err);

    });

}, []);

  // 🔥 FILTER
  const filtered = data.filter((item) =>
    item.nama_usaha
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="bg-[#f4f7fb] min-h-screen">

      <NavbarDashboard />

      <div className="px-4 md:px-8 lg:px-16 py-6 md:py-10">

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
          Eksplorasi Data UMKM
        </h1>

        <p className="text-gray-500 mt-2">
          Analisis kesehatan organisasi
          berdasarkan data responden UMKM.
        </p>

        {/* SEARCH */}
        <div className="mt-8">

          <input
            type="text"
            placeholder="Cari UMKM..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full p-4 rounded-xl border outline-none"
          />

        </div>

        {/* GRID */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-8">

          {/* HEADER */}
          <div className="grid grid-cols-6 bg-blue-900 text-white text-sm font-semibold px-6 py-4">

            <div>ID</div>
            <div>Nama UMKM</div>
            <div>Status</div>
            <div>Score</div>
            <div>Faktor Tertinggi</div>
            <div className="text-center">Aksi</div>

          </div>

          {/* DATA */}
          {filtered.map((item, index) => {

            const highest =
              item.factors?.sort(
                (a, b) => b.score - a.score
              )[0];

            return (

              <div
                key={item.id}
                className="grid grid-cols-6 px-6 py-5 border-b items-center text-sm hover:bg-gray-50 transition"
              >

                <div className="font-semibold">
                  #{item.id}
                </div>

                <div>

                  <p className="font-semibold text-blue-900">
                    {item.nama_usaha}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">

                    {item.kategori} • {item.role}

                  </p>

                </div>

                <div>

                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.total_score >= 85
                      ? "bg-green-100 text-green-700"
                      : item.total_score >= 70
                      ? "bg-blue-100 text-blue-700"
                      : "bg-red-100 text-red-600"
                  }`}>

                    {item.status}

                  </span>

                </div>

                <div className="font-bold text-blue-900">
                  {item.total_score}
                </div>

                <div>

                  {highest?.name}

                </div>

                <div className="flex gap-3 justify-center">

                  <button
                    onClick={() =>
                      navigate("/detailumkm", {
                        state: item,
                      })
                    }
                    className="bg-blue-900 text-white px-4 py-2 rounded-lg text-xs"
                  >
                    Detail
                  </button>

                  <button
                    onClick={() =>
                      navigate("/perbandingan", {
                        state: item,
                      })
                    }
                    className="border border-blue-900 text-blue-900 px-4 py-2 rounded-lg text-xs"
                  >
                    Bandingkan
                  </button>

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
}