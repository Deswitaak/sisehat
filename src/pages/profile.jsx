import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavbarDashboard from "../components/NavbarDashboard";
import {
  User,
  Briefcase,
  Calendar,
  Users,
} from "lucide-react";

export default function Profil() {

  const navigate = useNavigate();

  // 🔥 ROLE
  const [role, setRole] = useState("");

  // 🔥 FORM
  const [formData, setFormData] = useState({
    namaUsaha: "",
    jenisUsaha: "",
    kategori: "",
    lamaUsaha: "",
    usia: "",
    gender: "Perempuan",
  });

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 SUBMIT
  const handleSubmit = async () => {

    if (
      !formData.namaUsaha ||
      !formData.jenisUsaha ||
      !formData.kategori ||
      !formData.lamaUsaha ||
      !formData.usia
    ) {
      alert("Semua field wajib diisi");
      return;
    }

    if (!role) {
      alert("Pilih posisi terlebih dahulu");
      return;
    }

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      if (!user) {
        alert("User tidak ditemukan, silakan login ulang");
        return;
      }

      // 🔥 PERBAIKAN UTAMA: Menggunakan URL relatif agar langsung menembak database cloud InfinityFree
      const response = await fetch(
        "/api-sisehat/save_profile.php?v=final_siap_demo",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_user: user.id_user,
            nama_usaha: formData.namaUsaha,
            kategori: formData.kategori,
            jenis_usaha: formData.jenisUsaha,
            lama_usaha: parseInt(formData.lamaUsaha),
            usia_pemilik: parseInt(formData.usia),
            posisi: role,
            jenis_kelamin: formData.gender,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("HTTP status tidak oke.");
      }

      const responseText = await response.text();
      let result = null;

      try {
        result = JSON.parse(responseText);
      } catch (jsonError) {
        throw new Error("Respons server bukan format JSON valid.");
      }

      // Pengecekan ketat status error dari database cloud
      if (!result || result.status === "error") {
        alert("Gagal Database: " + (result?.message || "Gagal menyimpan data"));
        return;
      }

      // Jika sukses riil masuk database
      localStorage.setItem("profileComplete", "true");

      const oldData = JSON.parse(localStorage.getItem("profileData")) || {};

      localStorage.setItem(
        "profileData",
        JSON.stringify({
          ...oldData,
          ...formData,
          role,
        })
      );

      alert("Profil berhasil disimpan");
      navigate("/profil-selesai");

    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke database cloud: " + error.message);
    }
  };

  return (
    <div className="bg-[#f4f7fb] min-h-screen flex flex-col overflow-x-hidden">

      <NavbarDashboard />

      <div className="px-4 sm:px-6 md:px-8 lg:px-16 py-6 md:py-10 flex-1 w-full">

        {/* TITLE */}
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 leading-tight">
          Lengkapi Profil Usaha
        </h1>

        <p className="text-gray-500 mt-2 text-sm sm:text-base leading-relaxed max-w-3xl">
          Informasi ini akan membantu kami
          menyesuaikan analisis kesehatan usaha Anda.
        </p>

        {/* CARD */}
        <div className="bg-white rounded-xl border mt-6 sm:mt-8 shadow-sm overflow-hidden">

          {/* HEADER */}
          <div className="flex items-start sm:items-center gap-4 p-5 sm:p-6 border-b">

            <div className="bg-blue-100 p-3 rounded-lg shrink-0">

              <Briefcase
                className="text-blue-900"
                size={20}
                />

            </div>

            <div className="min-w-0">

              <h2 className="font-semibold text-blue-900">
                Detail Identitas Usaha
              </h2>

              <p className="text-sm text-gray-500 leading-relaxed">
                Pastikan data yang dimasukkan
                adalah data terbaru.
              </p>

            </div>

          </div>

          {/* FORM */}
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">

            {/* NAMA USAHA */}
            <div className="min-w-0">

              <label className="text-sm font-medium">
                Nama Usaha
              </label>

              <div className="flex items-center border rounded-lg px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-900">

                <User
                  size={16}
                  className="text-gray-400 shrink-0"
                />

                <input
                  type="text"
                  name="namaUsaha"
                  value={formData.namaUsaha}
                  onChange={handleChange}
                  className="w-full p-2 ml-2 outline-none bg-transparent min-w-0"
                  placeholder="Toko Anda"
                />

              </div>

            </div>

            {/* JENIS USAHA */}
            <div className="min-w-0">

              <label className="text-sm font-medium">
                Jenis Usaha
              </label>

              <input
                type="text"
                name="jenisUsaha"
                value={formData.jenisUsaha}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-900"
                placeholder="Contoh: Coffee Shop"
              />

            </div>

            {/* KATEGORI UMKM */}
            <div className="min-w-0">

              <label className="text-sm font-medium">
                Kategori UMKM
              </label>

              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="w-full p-2 mt-1 border rounded-lg bg-gray-50 outline-none focus:ring-2 focus:ring-blue-900"
              >

                <option value="">
                  Pilih kategori
                </option>

                <option value="Kuliner">
                  Kuliner
                </option>

                <option value="Fashion">
                  Fashion
                </option>

                <option value="Retail">
                  Retail
                </option>

                <option value="Jasa">
                  Jasa
                </option>

                <option value="Kerajinan">
                  Kerajinan
                </option>

                <option value="Teknologi">
                  Teknologi
                </option>

                <option value="Lainnya">
                  Lainnya
                </option>

              </select>

            </div>

            {/* LAMA USAHA */}
            <div className="min-w-0">

              <label className="text-sm font-medium">
                Lama Usaha (Tahun)
              </label>

              <div className="flex items-center border rounded-lg px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-900">

                <Calendar
                  size={16}
                  className="text-gray-400 shrink-0"
                />

                <input
                  type="number"
                  name="lamaUsaha"
                  value={formData.lamaUsaha}
                  onChange={handleChange}
                  className="w-full p-2 ml-2 outline-none bg-transparent min-w-0"
                  placeholder="5"
                />

              </div>

            </div>

            {/* USIA */}
            <div className="min-w-0">

              <label className="text-sm font-medium">
                Usia
              </label>

              <div className="flex items-center border rounded-lg px-3 mt-1 bg-gray-50 focus-within:ring-2 focus-within:ring-blue-900">

                <Users
                  size={16}
                  className="text-gray-400 shrink-0"
                />

                <input
                  type="number"
                  name="usia"
                  value={formData.usia}
                  onChange={handleChange}
                  className="w-full p-2 ml-2 outline-none bg-transparent min-w-0"
                  placeholder="30"
                />

              </div>

            </div>

            {/* ROLE */}
            <div className="min-w-0">

              <label className="text-sm font-medium">
                Posisi
              </label>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-3">

                <button
                  type="button"
                  onClick={() =>
                    setRole("Pemilik")
                  }
                  className={`px-5 py-2 rounded-lg border transition w-full sm:w-auto ${
                    role === "Pemilik"
                      ? "bg-blue-900 text-white border-blue-900"
                      : "bg-white"
                  }`}
                >
                  Pemilik
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setRole("Karyawan")
                  }
                  className={`px-5 py-2 rounded-lg border transition w-full sm:w-auto ${
                    role === "Karyawan"
                      ? "bg-green-600 text-white border-green-600"
                      : "bg-white"
                  }`}
                >
                  Karyawan
                </button>

              </div>

              {/* INFO */}
              <div className="mt-3">

                {role === "Pemilik" && (

                  <div className="bg-blue-50 text-blue-800 text-xs p-3 rounded-lg leading-relaxed">

                    Anda akan mengisi asesmen terkait:
                    <b>
                      {" "}
                      operasional usaha,
                      finansial,
                      legalitas,
                      dan performa bisnis.
                    </b>

                  </div>

                )}

                {role === "Karyawan" && (

                  <div className="bg-green-50 text-green-800 text-xs p-3 rounded-lg leading-relaxed">

                    Anda akan mengisi asesmen terkait:
                    <b>
                      {" "}
                      lingkungan kerja,
                      kepemimpinan,
                      dan kenyamanan kerja.
                    </b>

                  </div>

                )}

              </div>

            </div>

            {/* GENDER */}
            <div className="min-w-0">

              <label className="text-sm font-medium">
                Jenis Kelamin
              </label>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-2">

                <label className="flex items-center gap-2">

                  <input
                    type="radio"
                    name="gender"
                    value="Perempuan"
                    checked={
                      formData.gender === "Perempuan"
                    }
                    onChange={handleChange}
                  />

                  Perempuan

                </label>

                <label className="flex items-center gap-2">

                  <input
                    type="radio"
                    name="gender"
                    value="Laki-laki"
                    checked={
                      formData.gender === "Laki-laki"
                    }
                    onChange={handleChange}
                  />

                  Laki-laki

                </label>

              </div>

            </div>

          </div>

          {/* FOOTER */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 border-t p-5 sm:p-6">

            <p className="text-xs text-gray-400 leading-relaxed">
              🔒 Data Anda tersimpan dengan aman.
            </p>

            <div className="flex flex-col-reverse sm:flex-row sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">

              <button
                onClick={() =>
                  navigate("/beranda")
                }
                className="text-gray-500 hover:text-gray-700 w-full sm:w-auto py-2"
              >
                Batal
              </button>

              <button
                onClick={handleSubmit}
                className="bg-blue-900 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition w-full sm:w-auto"
              >
                Simpan & Lanjut
              </button>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}