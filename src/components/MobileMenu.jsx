import { Link } from "react-router-dom";

export default function MobileMenu({
  open,
  setOpen,
}) {
  const menu = [
    { name: "Beranda", path: "/beranda" },
    { name: "Asesmen", path: "/asesmen" },
    { name: "Perbandingan", path: "/perbandingan" },
    { name: "Rekomendasi", path: "/rekomendasi" },
    { name: "Eksplorasi", path: "/eksplorasi" },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-50">

      <div className="absolute right-0 top-0 w-72 h-full bg-white shadow-xl p-6">

        <button
          onClick={() => setOpen(false)}
          className="text-2xl font-bold"
        >
          ✕
        </button>

        <div className="mt-8 flex flex-col gap-5">

          {menu.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setOpen(false)}
              className="text-lg text-gray-700 hover:text-blue-900"
            >
              {item.name}
            </Link>
          ))}

        </div>

      </div>

    </div>
  );
}