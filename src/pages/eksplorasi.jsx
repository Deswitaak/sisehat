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
    (item.nama_usaha || "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f7fb]">
      <NavbarDashboard />

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-10 lg:px-12 xl:px-16">
        {/* TITLE */}
        <section>
          <h1 className="break-words text-2xl font-bold text-blue-900 md:text-3xl">
            Eksplorasi Data UMKM
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
            Analisis kesehatan organisasi
            berdasarkan data responden UMKM.
          </p>
        </section>

        {/* SEARCH */}
        <section className="mt-6 sm:mt-8">
          <input
            type="text"
            placeholder="Cari UMKM..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-xl border bg-white p-4 outline-none transition focus:border-blue-900"
          />
        </section>

        {/* DATA */}
        <section className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm sm:mt-8">
          {/* HEADER DESKTOP */}
          <div className="hidden grid-cols-6 bg-blue-900 px-6 py-4 text-sm font-semibold text-white lg:grid">
            <div>ID</div>
            <div>Nama UMKM</div>
            <div>Status</div>
            <div>Score</div>
            <div>Faktor Tertinggi</div>
            <div className="text-center">Aksi</div>
          </div>

          {/* EMPTY */}
          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-gray-400">
              Data UMKM tidak ditemukan.
            </div>
          )}

          {/* DATA */}
          {filtered.map((item) => {
            const highest =
              item.factors?.length
                ? [...item.factors].sort(
                    (a, b) => b.score - a.score
                  )[0]
                : null;

            return (
              <div
                key={item.id}
                className="border-b last:border-b-0"
              >
                {/* MOBILE CARD */}
                <div className="block p-4 hover:bg-gray-50 sm:p-5 lg:hidden">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-gray-400">
                        #{item.id}
                      </p>

                      <h2 className="mt-1 break-words font-semibold text-blue-900">
                        {item.nama_usaha}
                      </h2>

                      <p className="mt-1 text-xs text-gray-400">
                        {item.kategori} • {item.role}
                      </p>
                    </div>

                    <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
                      item.total_score >= 85
                        ? "bg-green-100 text-green-700"
                        : item.total_score >= 70
                        ? "bg-blue-100 text-blue-700"
                        : "bg-red-100 text-red-600"
                    }`}>
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-gray-50 p-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Score</p>
                      <p className="mt-1 font-bold text-blue-900">
                        {item.total_score}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-400">Faktor Tertinggi</p>
                      <p className="mt-1 break-words font-medium text-gray-700">
                        {highest?.name || "-"}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <button
                      onClick={() =>
                        navigate("/detailumkm", {
                          state: item,
                        })
                      }
                      className="rounded-lg bg-blue-900 px-4 py-3 text-xs text-white transition hover:bg-blue-950"
                    >
                      Detail
                    </button>

                    <button
                      onClick={() =>
                        navigate("/perbandingan", {
                          state: item,
                        })
                      }
                      className="rounded-lg border border-blue-900 px-4 py-3 text-xs text-blue-900 transition hover:bg-blue-50"
                    >
                      Bandingkan
                    </button>
                  </div>
                </div>

                {/* DESKTOP ROW */}
                <div className="hidden grid-cols-6 items-center gap-4 px-6 py-5 text-sm transition hover:bg-gray-50 lg:grid">
                  <div className="font-semibold">
                    #{item.id}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate font-semibold text-blue-900">
                      {item.nama_usaha}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-400">
                      {item.kategori} • {item.role}
                    </p>
                  </div>

                  <div>
                    <span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-semibold ${
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

                  <div className="min-w-0 truncate">
                    {highest?.name || "-"}
                  </div>

                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() =>
                        navigate("/detailumkm", {
                          state: item,
                        })
                      }
                      className="rounded-lg bg-blue-900 px-4 py-2 text-xs text-white transition hover:bg-blue-950"
                    >
                      Detail
                    </button>

                    <button
                      onClick={() =>
                        navigate("/perbandingan", {
                          state: item,
                        })
                      }
                      className="rounded-lg border border-blue-900 px-4 py-2 text-xs text-blue-900 transition hover:bg-blue-50"
                    >
                      Bandingkan
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}
