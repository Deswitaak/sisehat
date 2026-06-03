import imageCustom from "../assets/images.png";

export default function Features() {
  return (
    <section className="px-12 py-20 bg-[#f5f7fb]">

      {/* TITLE */}
      <h2 className="text-2xl md:text-3xl font-bold text-center">
        Solusi Data Terintegrasi
      </h2>

      <p className="text-center text-gray-500 mt-2">
        Kami menyediakan instrumen untuk memantau setiap denyut nadi bisnis Anda secara real-time.
      </p>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">

        {/* ===== CARD 1 (KIRI ATAS) ===== */}
        <div className="h-[180px] p-6 border rounded-xl bg-white flex justify-between items-start relative hover:shadow-lg transition">

          <div>
            <h3 className="font-semibold text-lg">Analitik Bisnis</h3>
            <p className="text-gray-500 text-sm mt-2">
              Visualisasikan tren pasar dan perilaku konsumen dengan dashboard yang sangat interaktif dan mendalam.
            </p>
          </div>

          {/* ICON KANAN */}
          <img
            src="https://img.icons8.com/ios-filled/100/cccccc/combo-chart.png"
            className="w-16 opacity-30 absolute right-4 bottom-4"
          />

        </div>

        {/* ===== CARD 2 (KANAN ATAS) ===== */}
        <div className="relative h-[180px] p-6 bg-blue-900 text-white rounded-xl hover:shadow-lg transition">

          <div>
            <h3 className="font-semibold text-lg">Optimasi Operasional</h3>
            <p className="text-sm mt-2">
              Kurangi inefisiensi melalui otomatisasi pelaporan berbasis AI.
            </p>
          </div>

          {/* ICON FIX */}
          <img
            src="https://img.icons8.com/ios-filled/100/ffffff/settings.png"
            className="w-12 opacity-20 absolute right-4 top-4"
          />

        </div>

        {/* ===== CARD 3 (KIRI BAWAH) ===== */}
        <div className="h-[140px] p-6 border rounded-xl bg-white hover:shadow-lg transition">

          <h3 className="font-semibold text-lg">Pertumbuhan UMKM</h3>
          <p className="text-gray-500 text-sm mt-2">
            Dukungan khusus bagi pelaku bisnis mikro untuk berkembang ke skala nasional.
          </p>

        </div>

        {/* ===== CARD 4 (KANAN BAWAH - IMAGE) ===== */}
        <div className="h-[140px] relative rounded-xl overflow-hidden group hover:shadow-lg transition">

          {/* IMAGE */}
          <img
            src={imageCustom}
            className="w-full h-full object-cover"
          />

          {/* GRADIENT OVERLAY */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent"></div>

          {/* TEXT */}
          <div className="absolute bottom-5 left-5 text-white">
            <h3 className="font-semibold text-lg">
              Keamanan Data Enterprise
            </h3>

            <p className="text-sm mt-1 max-w-xs text-gray-200">
              Enkripsi tingkat militer untuk memastikan seluruh aset informasi bisnis Anda tetap terlindungi.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}