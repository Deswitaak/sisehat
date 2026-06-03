export default function Privasi() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 sm:px-6 md:px-10 lg:px-16 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 text-center">
          Kebijakan Privasi
        </h1>

        <p className="mt-4 text-gray-500 text-center text-sm sm:text-base leading-relaxed">
          Kebijakan ini menjelaskan bagaimana SiSehat mengelola dan melindungi
          data pengguna dalam penggunaan platform.
        </p>

        <div className="mt-8 space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="font-semibold text-blue-900 mb-2">
              1. Data yang Dikumpulkan
            </h2>
            <p>
              SiSehat dapat mengumpulkan data seperti informasi akun, profil
              UMKM, hasil asesmen, dan data lain yang pengguna masukkan ke dalam
              sistem untuk mendukung proses analisis bisnis.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-blue-900 mb-2">
              2. Penggunaan Data
            </h2>
            <p>
              Data digunakan untuk menampilkan hasil asesmen, rekomendasi,
              perbandingan performa, serta membantu pengguna memahami kondisi
              bisnisnya secara lebih terarah.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-blue-900 mb-2">
              3. Penyimpanan Data
            </h2>
            <p>
              Sebagian data dapat disimpan pada perangkat pengguna melalui
              browser, seperti localStorage, dan sebagian lainnya dapat disimpan
              pada server apabila fitur backend telah diaktifkan.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-blue-900 mb-2">
              4. Keamanan Data
            </h2>
            <p>
              SiSehat berupaya menjaga keamanan data pengguna dengan membatasi
              penggunaan data hanya untuk kebutuhan aplikasi dan pengembangan
              layanan.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-blue-900 mb-2">
              5. Persetujuan Pengguna
            </h2>
            <p>
              Dengan menggunakan SiSehat, pengguna dianggap memahami dan
              menyetujui penggunaan data sesuai kebijakan privasi ini.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}