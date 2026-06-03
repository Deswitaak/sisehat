import { useState } from "react";

export default function Kontak() {
  // WADAH BACKEND
  // Nanti kalau backend kontak sudah ada, isi endpoint di sini.
  // Contoh:
  // const CONTACT_ENDPOINT = "http://localhost/sisehat/api-sisehat/contact.php";
  const CONTACT_ENDPOINT = "";

  const [isSending, setIsSending] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    pesan: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.nama.trim() === "" ||
      formData.email.trim() === "" ||
      formData.pesan.trim() === ""
    ) {
      alert("Semua kolom wajib diisi.");
      return;
    }

    try {
      setIsSending(true);

      // Simpan sementara di frontend agar form tetap berfungsi
      const oldMessages =
        JSON.parse(localStorage.getItem("contact_messages")) || [];

      localStorage.setItem(
        "contact_messages",
        JSON.stringify([
          ...oldMessages,
          {
            ...formData,
            createdAt: new Date().toISOString(),
          },
        ])
      );

      // WADAH BACKEND KONTAK
      // Kalau endpoint masih kosong, fetch tidak dijalankan.
      if (CONTACT_ENDPOINT.trim() !== "") {
        const response = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || result?.success === false) {
          throw new Error(result?.message || "Gagal mengirim pesan.");
        }
      }

      setShowSuccess(true);

      setFormData({
        nama: "",
        email: "",
        pesan: "",
      });

      setTimeout(() => {
        setShowSuccess(false);
      }, 1800);
    } catch (error) {
      alert(error.message || "Terjadi kesalahan saat mengirim pesan.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 sm:px-6 md:px-10 lg:px-16 py-10">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* INFO */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-blue-900">
            Kontak Kami
          </h1>

          <p className="mt-4 text-gray-500 text-sm sm:text-base leading-relaxed">
            Hubungi tim SiSehat jika Anda memiliki pertanyaan, kendala
            penggunaan aplikasi, atau membutuhkan informasi lebih lanjut.
          </p>

          <div className="mt-8 space-y-4 text-sm sm:text-base text-gray-600">
            <div className="bg-[#f4f7fb] rounded-xl p-4">
              <p className="font-semibold text-blue-900">Email</p>
              <p className="mt-1">support@sisehat.id</p>
            </div>

            <div className="bg-[#f4f7fb] rounded-xl p-4">
              <p className="font-semibold text-blue-900">Jam Layanan</p>
              <p className="mt-1">Senin - Jumat, 09.00 - 17.00 WIB</p>
            </div>

            <div className="bg-[#f4f7fb] rounded-xl p-4">
              <p className="font-semibold text-blue-900">Layanan</p>
              <p className="mt-1">
                Bantuan akun, profil UMKM, asesmen, rekomendasi, dan
                penggunaan dashboard.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-sm border p-6 sm:p-8">
          <h2 className="text-xl font-bold text-blue-900">
            Kirim Pesan
          </h2>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                Nama
              </label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Masukkan nama Anda"
                className="mt-2 w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan email Anda"
                className="mt-2 w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-900"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">
                Pesan
              </label>
              <textarea
                name="pesan"
                value={formData.pesan}
                onChange={handleChange}
                placeholder="Tulis pesan Anda"
                rows="5"
                className="mt-2 w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-900 resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSending}
              className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSending ? "Mengirim..." : "Kirim Pesan"}
            </button>
          </form>
        </div>
      </div>

      {/* POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✅
            </div>

            <h2 className="text-lg font-semibold text-blue-900">
              Pesan Berhasil Dikirim
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Terima kasih, pesan Anda sudah kami terima.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}