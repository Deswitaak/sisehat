import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/NavbarDashboard";
import { CheckCircle, Shield, Database, BarChart3 } from "lucide-react";

export default function ProfilSelesai() {
  const navigate = useNavigate();

  // 🔥 AUTO PINDAH KE ASESMEN
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/asesmen");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-[#f4f7fb] min-h-screen flex flex-col">

      <Navbar active="asesmen" />

      <div className="px-4 md:px-8 lg:px-16 py-6 md:py-10 flex-1">

        <div className="grid grid-cols-3 gap-6">

          {/* LEFT */}
          <div className="col-span-2 bg-white p-10 rounded-xl shadow border">

            <div className="flex justify-between">

              <div>
                <div className="flex items-center gap-2 text-blue-900 text-sm font-semibold">
                  <CheckCircle size={18} />
                  SISTEM SIAP
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mt-4">
                  Profil Lengkap.
                </h1>

                <p className="text-gray-500 mt-3 max-w-lg">
                  Mengalihkan ke asesmen 6 faktor untuk memulai analisis kesehatan usaha Anda.
                </p>
              </div>

              <div className="text-gray-300 text-5xl">✓</div>
            </div>

            {/* PROGRESS */}
            <div className="mt-10">
              <div className="flex justify-between text-sm text-gray-500 mb-2">
                <span>Sinkronisasi Basis Data...</span>
                <span>85%</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-blue-900 h-2 rounded-full w-[85%]" />
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-blue-900 text-white p-6 rounded-xl shadow">

            <BarChart3 className="mb-4" />

            <h2 className="font-semibold text-lg">
              Analisis 6 Faktor
            </h2>

            <p className="text-sm mt-3 opacity-90">
              Sistem akan menampilkan visualisasi kesehatan bisnis Anda secara real-time.
            </p>

            <div className="mt-6 border-t pt-4 text-sm flex justify-between">
              <span>Keamanan Data Terjamin</span>
              🔒
            </div>
          </div>

        </div>

        {/* INFO */}
        <div className="grid grid-cols-3 gap-6 mt-6">

          <div className="bg-white p-5 rounded-xl shadow border flex items-center gap-3">
            <Database />
            <div>
              <p className="text-xs text-gray-400">STATUS SERVER</p>
              <p className="font-semibold">Optimal (12ms)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border flex items-center gap-3">
            <Shield />
            <div>
              <p className="text-xs text-gray-400">ENKRIPSI</p>
              <p className="font-semibold">AES-256 Aktif</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border flex items-center gap-3">
            <CheckCircle />
            <div>
              <p className="text-xs text-gray-400">ID USER</p>
              <p className="font-semibold">AZ-88210-SZ</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}