export default function SyaratKetentuan() {
  return (
    <div className="min-h-screen bg-[#f4f7fb] px-4 sm:px-6 md:px-10 lg:px-16 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border p-6 sm:p-8 md:p-10">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 text-center">
          Syarat & Ketentuan
        </h1>

        <p className="mt-4 text-gray-500 text-center text-sm sm:text-base leading-relaxed">
          Dengan menggunakan SiSehat, pengguna setuju untuk mengikuti syarat dan
          ketentuan penggunaan platform ini.
        </p>

        <div className="mt-8 space-y-6 text-gray-600 text-sm sm:text-base leading-relaxed">
          <section>
            <h2 className="font-semibold text-blue-900 mb-2">
              1. Penggunaan Platform
            </h2>
            <p>
              SiSehat digunakan sebagai alat bantu analisis dan rekomendasi
              bisnis. Hasil yang ditampilkan bersifat sebagai panduan dan tidak
              menjadi satu-satunya dasar pengambilan keputusan bisnis.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-blue-900 mb-2">
              2. Akun Pengguna
            </h2>
            <p>
              Pengguna bertanggung jawab atas kebenaran data yang dimasukkan,
              termasuk data akun, profil usaha, dan jawaban asesmen.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-blue-900 mb-2">
              3. Hasil Asesmen
            </h2>
            <p>
              Hasil asesmen dan rekomendasi yang diberikan oleh SiSehat dibuat
              berdasarkan data yang diinput oleh pengguna. Semakin lengkap dan
              benar data yang dimasukkan, semakin relevan hasil yang ditampilkan.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-blue-900 mb-2">
              4. Batasan Tanggung Jawab
            </h2>
            <p>
              SiSehat tidak bertanggung jawab atas kerugian langsung maupun
              tidak langsung yang timbul dari keputusan bisnis yang dibuat
              pengguna berdasarkan hasil analisis platform.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-blue-900 mb-2">
              5. Perubahan Ketentuan
            </h2>
            <p>
              Syarat dan ketentuan dapat diperbarui sewaktu-waktu sesuai
              kebutuhan pengembangan aplikasi dan kebijakan layanan.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}