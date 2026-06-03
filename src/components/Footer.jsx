import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-100 px-4 sm:px-8 lg:px-12 py-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-8">
        {/* LEFT */}
        <div>
          <h1 className="font-bold text-blue-900 text-lg">SiSehat</h1>

          <p className="text-gray-500 mt-3 max-w-sm text-sm leading-relaxed">
            Platform analisis bisnis terdepan untuk transformasi digital
            berkelanjutan.
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex flex-col md:items-end text-sm text-gray-500 gap-3 w-full md:w-auto">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-6">
            <Link to="/privasi" className="hover:text-blue-900 transition">
              Privasi
            </Link>

            <Link
              to="/syarat-ketentuan"
              className="hover:text-blue-900 transition"
            >
              Syarat & Ketentuan
            </Link>

            <Link to="/kontak" className="hover:text-blue-900 transition">
              Kontak
            </Link>
          </div>

          <p className="text-xs text-gray-400">
            © 2026 SiSehat Analytics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}