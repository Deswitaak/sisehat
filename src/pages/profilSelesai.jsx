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
    <div className="bg-[#f4f7fb] min-h-screen flex flex-col overflow-x-hidden">

      <Navbar active="asesmen" />

      <div className="px-4 sm:px-6 md:px-8 lg:px-16 py-6 md:py-10 flex-1 w-full">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">

          {/* LEFT */}
          <div className="lg:col-span-2 bg-white p-5 sm:p-6 md:p-10 rounded-xl shadow border">

            <div className="flex flex-col sm:flex-row sm:justify-between gap-6">

              <div className="min-w-0">
                <div className="flex items-center gap-2 text-blue-900 text-xs sm:text-sm font-semibold">
                  <CheckCircle size={18} className="shrink-0" />
                  <span>SISTEM SIAP</span>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-blue-900 mt-4 leading-tight">
                  Profil Lengkap.
                </h1>

                <p className="text-gray-500 mt-3 max-w-lg text-sm sm:text-base leading-relaxed">
                  Mengalihkan ke asesmen 6 faktor untuk memulai analisis kesehatan usaha Anda.
                </p>
              </div>

              <div className="text-gray-300 text-5xl sm:text-6xl leading-none self-start sm:self-center">✓</div>
            </div>

            {/* PROGRESS */}
            <div className="mt-8 sm:mt-10">
              <div className="flex justify-between gap-4 text-xs sm:text-sm text-gray-500 mb-2">
                <span>Sinkronisasi Basis Data...</span>
                <span className="shrink-0">85%</span>
              </div>

              <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-900 h-2 rounded-full w-[85%]" />
              </div>
            </div>

          </div>

          {/* RIGHT */}
          <div className="bg-blue-900 text-white p-5 sm:p-6 rounded-xl shadow min-w-0">

            <BarChart3 className="mb-4" />

            <h2 className="font-semibold text-lg">
              Analisis 6 Faktor
            </h2>

            <p className="text-sm mt-3 opacity-90 leading-relaxed">
              Sistem akan menampilkan visualisasi kesehatan bisnis Anda secara real-time.
            </p>

            <div className="mt-6 border-t border-white/30 pt-4 text-sm flex justify-between items-center gap-4">
              <span>Keamanan Data Terjamin</span>
              <span className="shrink-0">🔒</span>
            </div>
          </div>

        </div>

        {/* INFO */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-4 sm:mt-6">

          <div className="bg-white p-5 rounded-xl shadow border flex items-center gap-3 min-w-0">
            <Database className="shrink-0 text-blue-900" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">STATUS SERVER</p>
              <p className="font-semibold text-sm sm:text-base truncate">Optimal (12ms)</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border flex items-center gap-3 min-w-0">
            <Shield className="shrink-0 text-blue-900" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">ENKRIPSI</p>
              <p className="font-semibold text-sm sm:text-base truncate">AES-256 Aktif</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl shadow border flex items-center gap-3 min-w-0">
            <CheckCircle className="shrink-0 text-blue-900" />
            <div className="min-w-0">
              <p className="text-xs text-gray-400">ID USER</p>
              <p className="font-semibold text-sm sm:text-base truncate">AZ-88210-SZ</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
