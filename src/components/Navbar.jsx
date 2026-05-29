import { Link, useLocation } from "react-router-dom";


export default function Navbar({ active }) {
  const location = useLocation();

  // 🔥 CEK HALAMAN AUTH ATAU DASHBOARD
  const isAuthPage =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/registrasi";

  return (
    <nav className="flex justify-between items-center px-12 py-5 bg-white shadow-sm">

      <h1 className="font-bold text-lg text-blue-900">SiSehat</h1>

      {/* MENU */}
      <div className="flex gap-4 md:gap-8 text-sm text-gray-500">
        <span className="text-blue-900 font-semibold">Beranda</span>
        <span>Asesmen</span>
        <span>Perbandingan</span>
        <span>Rekomendasi</span>
        <span>Eksplorasi</span>
      </div>

      {/* 🔥 CONDITIONAL */}
      {isAuthPage ? (
        <div className="flex gap-4 items-center">
          <Link to="/login" className="text-gray-600">
            Masuk
          </Link>
          <Link
            to="/registrasi"
            className="bg-blue-900 text-white px-4 py-2 rounded-lg"
          >
            Daftar
          </Link>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          ⚙️
          <div className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-full">
            <span className="text-sm">
  {JSON.parse(localStorage.getItem("user"))?.name || "User"}
</span>
            <div className="w-8 h-8 rounded-full bg-blue-900 text-white flex items-center justify-center text-sm font-bold">
  {(JSON.parse(localStorage.getItem("user"))?.name || "U")
    .charAt(0)
    .toUpperCase()}
</div>
          </div>
        </div>
      )}
    </nav>
  );
}