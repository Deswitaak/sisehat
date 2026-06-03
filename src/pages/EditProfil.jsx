import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function EditProfil() {
  const navigate = useNavigate();

  // ===============================
  // ENDPOINT BACKEND
  // ===============================
  // Mas backend perlu buat endpoint ini:
  // http://localhost/sisehat/api-sisehat/get_profile.php?id_user=ID_USER
  const GET_PROFILE_ENDPOINT =
    "http://localhost/sisehat/api-sisehat/get_profile.php";

  // Endpoint save ini mengikuti backend yang sudah kamu pakai sebelumnya
  const SAVE_PROFILE_ENDPOINT =
    "http://localhost/sisehat/api-sisehat/save_profile.php";

  const safeParse = (value) => {
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  const savedData = safeParse(localStorage.getItem("profileData"));
  const user = safeParse(localStorage.getItem("user"));

  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 🔥 FORM
  const [formData, setFormData] = useState({
    nama: savedData?.nama || user?.name || "",
    namaUsaha: savedData?.namaUsaha || "",
    jenisUsaha: savedData?.jenisUsaha || "",
    kategori: savedData?.kategori || "",
    lamaUsaha: savedData?.lamaUsaha || "",
    usia: savedData?.usia || "",
    gender: savedData?.gender || "Perempuan",
    role: savedData?.role || "",
  });

  // ===============================
  // AMBIL DATA PROFILE DARI BACKEND
  // ===============================
  useEffect(() => {
    const fetchProfileFromBackend = async () => {
      const currentUser = safeParse(localStorage.getItem("user"));

      if (!currentUser?.id_user) {
        return;
      }

      try {
        setIsLoadingProfile(true);

        const response = await fetch(
          `${GET_PROFILE_ENDPOINT}?id_user=${currentUser.id_user}`
        );

        const result = await response.json().catch(() => null);

        if (!response.ok || !result) {
          return;
        }

        const profile =
          result.data ||
          result.profileData ||
          result.profile ||
          null;

        if (!profile) {
          return;
        }

        const mappedProfile = {
          nama:
            profile.nama ||
            profile.name ||
            currentUser.name ||
            savedData?.nama ||
            "",

          namaUsaha:
            profile.namaUsaha ||
            profile.nama_usaha ||
            savedData?.namaUsaha ||
            "",

          jenisUsaha:
            profile.jenisUsaha ||
            profile.jenis_usaha ||
            savedData?.jenisUsaha ||
            "",

          kategori:
            profile.kategori ||
            savedData?.kategori ||
            "",

          lamaUsaha:
            profile.lamaUsaha ||
            profile.lama_usaha ||
            savedData?.lamaUsaha ||
            "",

          usia:
            profile.usia ||
            profile.usia_pemilik ||
            savedData?.usia ||
            "",

          gender:
            profile.gender ||
            profile.jenis_kelamin ||
            savedData?.gender ||
            "Perempuan",

          role:
            profile.role ||
            profile.posisi ||
            savedData?.role ||
            "",
        };

        setFormData(mappedProfile);

        localStorage.setItem("profileData", JSON.stringify(mappedProfile));

        if (
          mappedProfile.namaUsaha &&
          mappedProfile.jenisUsaha &&
          mappedProfile.kategori &&
          mappedProfile.lamaUsaha &&
          mappedProfile.usia &&
          mappedProfile.role
        ) {
          localStorage.setItem("profileComplete", "true");
        }
      } catch (error) {
        console.error("Gagal mengambil profil dari backend:", error);
      } finally {
        setIsLoadingProfile(false);
      }
    };

    fetchProfileFromBackend();
  }, []);

  // 🔥 HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 🔥 HANDLE ROLE
  const handleRole = (role) => {
    setFormData({
      ...formData,
      role,
    });
  };

  const isFormComplete = () => {
    return (
      formData.namaUsaha &&
      formData.jenisUsaha &&
      formData.kategori &&
      formData.lamaUsaha &&
      formData.usia &&
      formData.role
    );
  };

  // 🔥 SIMPAN
  const handleSubmit = async () => {
    if (!formData.nama.trim()) {
      alert("Nama pengguna wajib diisi");
      return;
    }

    if (!formData.namaUsaha.trim()) {
      alert("Nama usaha wajib diisi");
      return;
    }

    if (!formData.jenisUsaha.trim()) {
      alert("Jenis usaha wajib diisi");
      return;
    }

    if (!formData.kategori) {
      alert("Kategori usaha wajib dipilih");
      return;
    }

    if (!formData.lamaUsaha) {
      alert("Lama usaha wajib diisi");
      return;
    }

    if (!formData.usia) {
      alert("Usia wajib diisi");
      return;
    }

    if (!formData.role) {
      alert("Pilih posisi terlebih dahulu");
      return;
    }

    const currentUser = safeParse(localStorage.getItem("user"));

    if (!currentUser?.id_user) {
      alert("User tidak ditemukan, silakan login ulang");
      return;
    }

    try {
      setIsSaving(true);

      const response = await fetch(SAVE_PROFILE_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          id_user: currentUser.id_user,
          nama: formData.nama,
          nama_usaha: formData.namaUsaha,
          kategori: formData.kategori,
          jenis_usaha: formData.jenisUsaha,
          lama_usaha: parseInt(formData.lamaUsaha),
          usia_pemilik: parseInt(formData.usia),
          posisi: formData.role,
          jenis_kelamin: formData.gender,
        }),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok || result?.status === "error" || result?.success === false) {
        alert(result?.message || "Gagal menyimpan profil ke backend");
        return;
      }

      localStorage.setItem("profileData", JSON.stringify(formData));

      if (isFormComplete()) {
        localStorage.setItem("profileComplete", "true");
      } else {
        localStorage.setItem("profileComplete", "false");
      }

      alert("Profil berhasil diperbarui");

      navigate("/beranda");
    } catch (error) {
      console.error(error);
      alert("Gagal terhubung ke server");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#f4f7fb]">
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 md:px-8 md:py-10 lg:px-12 xl:px-16">
        {/* HEADER */}
        <section className="max-w-3xl">
          <h1 className="break-words text-2xl font-bold text-blue-900 md:text-3xl">
            Edit Profil
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-gray-500 sm:text-base">
            Kelola informasi akun dan profil usaha Anda.
          </p>

          {isLoadingProfile && (
            <p className="mt-3 text-sm text-blue-900">
              Memuat data profil...
            </p>
          )}
        </section>

        {/* CARD */}
        <section className="mt-6 rounded-2xl border bg-white p-4 shadow-sm sm:mt-8 sm:p-6 lg:p-8">
          {/* FORM */}
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
            {/* NAMA */}
            <div className="min-w-0">
              <label className="text-sm font-medium text-gray-700">
                Nama Pengguna
              </label>

              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border bg-gray-50 p-3 outline-none transition focus:border-blue-900 focus:bg-white"
              />
            </div>

            {/* NAMA USAHA */}
            <div className="min-w-0">
              <label className="text-sm font-medium text-gray-700">
                Nama Usaha
              </label>

              <input
                type="text"
                name="namaUsaha"
                value={formData.namaUsaha}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border bg-gray-50 p-3 outline-none transition focus:border-blue-900 focus:bg-white"
              />
            </div>

            {/* JENIS */}
            <div className="min-w-0">
              <label className="text-sm font-medium text-gray-700">
                Jenis Usaha
              </label>

              <input
                type="text"
                name="jenisUsaha"
                value={formData.jenisUsaha}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border bg-gray-50 p-3 outline-none transition focus:border-blue-900 focus:bg-white"
              />
            </div>

            {/* KATEGORI */}
            <div className="min-w-0">
              <label className="text-sm font-medium text-gray-700">
                Kategori Usaha
              </label>

              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border bg-gray-50 p-3 outline-none transition focus:border-blue-900 focus:bg-white"
              >
                <option value="">Pilih Kategori</option>
                <option value="Kuliner">Kuliner</option>
                <option value="Fashion">Fashion</option>
                <option value="Retail">Retail</option>
                <option value="Jasa">Jasa</option>
                <option value="Kerajinan">Kerajinan</option>
                <option value="Teknologi">Teknologi</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>

            {/* LAMA */}
            <div className="min-w-0">
              <label className="text-sm font-medium text-gray-700">
                Lama Usaha
              </label>

              <input
                type="number"
                name="lamaUsaha"
                value={formData.lamaUsaha}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border bg-gray-50 p-3 outline-none transition focus:border-blue-900 focus:bg-white"
              />
            </div>

            {/* USIA */}
            <div className="min-w-0">
              <label className="text-sm font-medium text-gray-700">
                Usia
              </label>

              <input
                type="number"
                name="usia"
                value={formData.usia}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border bg-gray-50 p-3 outline-none transition focus:border-blue-900 focus:bg-white"
              />
            </div>

            {/* GENDER */}
            <div className="min-w-0">
              <label className="text-sm font-medium text-gray-700">
                Gender
              </label>

              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="mt-2 w-full rounded-xl border bg-gray-50 p-3 outline-none transition focus:border-blue-900 focus:bg-white"
              >
                <option value="Perempuan">Perempuan</option>
                <option value="Laki-laki">Laki-laki</option>
              </select>
            </div>

            {/* ROLE */}
            <div className="min-w-0">
              <label className="text-sm font-medium text-gray-700">
                Posisi
              </label>

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 md:flex md:flex-wrap md:gap-4">
                <button
                  type="button"
                  onClick={() => handleRole("Pemilik")}
                  className={`rounded-xl border px-5 py-3 text-sm transition sm:py-2 ${
                    formData.role === "Pemilik"
                      ? "bg-blue-900 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Pemilik
                </button>

                <button
                  type="button"
                  onClick={() => handleRole("Karyawan")}
                  className={`rounded-xl border px-5 py-3 text-sm transition sm:py-2 ${
                    formData.role === "Karyawan"
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Karyawan
                </button>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="mt-8 flex flex-col gap-5 border-t pt-6 sm:mt-10 md:flex-row md:items-center md:justify-between">
            <p className="text-xs leading-relaxed text-gray-400">
              🔒 Data profile tersimpan aman.
            </p>

            <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end sm:gap-4">
              <button
                onClick={() => navigate("/beranda")}
                className="w-full rounded-xl border px-6 py-3 text-gray-500 transition hover:bg-gray-50 sm:w-auto sm:border-0"
              >
                Batal
              </button>

              <button
                onClick={handleSubmit}
                disabled={isSaving || isLoadingProfile}
                className="w-full rounded-xl bg-blue-900 px-6 py-3 text-white transition hover:bg-blue-950 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}