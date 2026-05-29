import { Link } from "react-router-dom";

export default function MobileLanding() {
  return (
    <div className="min-h-screen flex flex-col justify-center px-8 bg-gradient-to-br from-white via-slate-100 to-blue-300">

      <h1 className="text-5xl font-bold text-center text-blue-950">
        SISEHAT
      </h1>

      <div className="mt-24">

        <h2 className="text-3xl font-bold text-blue-950">
          Evaluasi Kesehatan Usaha
        </h2>

        <h2 className="text-3xl font-bold text-blue-500">
          Lebih Cerdas
        </h2>

        <p className="mt-4 text-gray-600">
          Transformasi data UMKM menjadi wawasan strategis
          yang membantu pertumbuhan bisnis berkelanjutan.
        </p>

      </div>

      <div className="mt-10 space-y-4">

        <Link
          to="/registrasi"
          className="block text-center bg-blue-950 text-white py-4 rounded-xl"
        >
          Daftar
        </Link>

        <Link
          to="/login"
          className="block text-center bg-white border py-4 rounded-xl"
        >
          Masuk
        </Link>

      </div>

    </div>
  );
}