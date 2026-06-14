import { useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import LogoutModal from "./LogoutModal";

export default function NavbarDashboard() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [open, setOpen] = useState(false);
  const [showLogout, setShowLogout] = useState(false);

  const [gateModal, setGateModal] = useState({
    open: false,
    title: "",
    message: "",
    primaryText: "",
    primaryPath: "",
  });

  const dropdownRef = useRef();

  const safeParse = (value) => {
    try {
      return value ? JSON.parse(value) : null;
    } catch {
      return null;
    }
  };

  const profileData = safeParse(localStorage.getItem("profileData"));
  const userData = safeParse(localStorage.getItem("user"));

  // =========================================================
  // 🔥 AUTOMATIC BACKEND SYNC (MENCEGAH ERROR REFUSED DI NAVBAR)
  // =========================================================
  useEffect(() => {
    const syncUserSession = async () => {
      if (!userData?.id_user) return;

      try {
        // Menggunakan URL Relatif agar adaptif dengan domain hosting
        const response = await fetch(`/api-sisehat/get_profile.php?id_user=${userData.id_user}`);
        if (!response.ok) return;

        const result = await response.json().catch(() => null);

        if (result && result.status === "success" && result.data) {
          localStorage.setItem("profileData", JSON.stringify(result.data));
          localStorage.setItem("profileComplete", "true");
        } else if (result && result.status === "error") {
          localStorage.setItem("profileComplete", "false");
        }
      } catch (error) {
        console.warn("Koneksi Navbar berjalan dalam mode offline lokal.");
      }
    };

    syncUserSession();
  }, [location.pathname]); // Melakukan pemeriksaan aman setiap kali halaman berpindah

  const menu = [
    { name: "Beranda", path: "/beranda" },
    { name: "Asesmen", path: "/asesmen" },
    { name: "Perbandingan", path: "/perbandingan" },
    { name: "Rekomendasi", path: "/rekomendasi" },
    { name: "Eksplorasi", path: "/eksplorasi" },
  ];

  const displayName = profileData?.nama || userData?.name || "Pengguna";
  const displayEmail = userData?.email || "user@email.com";
  const avatarLetter = (displayName || "U").charAt(0).toUpperCase();

  const isProfileComplete = () => {
    const profileComplete = localStorage.getItem("profileComplete");
    const currentProfileData = safeParse(localStorage.getItem("profileData"));

    if (profileComplete === "true") {
      return true;
    }

    const hasCompleteProfile =
      (currentProfileData?.namaUsaha || currentProfileData?.nama_usaha) &&
      (currentProfileData?.jenisUsaha || currentProfileData?.jenis_usaha) &&
      currentProfileData?.kategori &&
      (currentProfileData?.lamaUsaha || currentProfileData?.lama_usaha) &&
      (currentProfileData?.usia || currentProfileData?.usia_pemilik) &&
      (currentProfileData?.role || currentProfileData?.posisi);

    return Boolean(hasCompleteProfile);
  };

  const isAssessmentComplete = () => {
    const assessmentComplete = localStorage.getItem("assessmentComplete");
    const hasilAnalisis = safeParse(localStorage.getItem("hasilAnalisis"));

    if (assessmentComplete === "true") {
      return true;
    }

    if (hasilAnalisis?.factors?.length > 0) {
      return true;
    }

    return false;
  };

  const showGatePopup = ({
    title,
    message,
    primaryText,
    primaryPath,
  }) => {
    setGateModal({
      open: true,
      title,
      message,
      primaryText,
      primaryPath,
    });
  };

  const closeGatePopup = () => {
    setGateModal({
      open: false,
      title: "",
      message: "",
      primaryText: "",
      primaryPath: "",
    });
  };

  const handleMenuClick = (item) => {
    const profileReady = isProfileComplete();
    const assessmentReady = isAssessmentComplete();

    if (item.path === "/asesmen") {
      if (!profileReady) {
        showGatePopup({
          title: "Profil UMKM Belum Lengkap",
          message:
            "Anda belum mengisi profil. Jika ingin melakukan asesmen, silakan lengkapi profil usaha terlebih dahulu.",
          primaryText: "Lengkapi Profil",
          primaryPath: "/profil",
        });
        return;
      }

      navigate("/asesmen");
      return;
    }

    if (item.path === "/perbandingan") {
      if (!profileReady && !assessmentReady) {
        showGatePopup({
          title: "Profil dan Asesmen Belum Lengkap",
          message:
            "Anda belum mengisi profil dan belum melakukan asesmen. Lengkapi profil terlebih dahulu, lalu isi asesmen agar bisa membuka perbandingan.",
          primaryText: "Lengkapi Profil",
          primaryPath: "/profil",
        });
        return;
      }

      if (!profileReady) {
        showGatePopup({
          title: "Profil UMKM Belum Lengkap",
          message:
            "Anda belum mengisi profil. Jika ingin membuka perbandingan, silakan lengkapi profil usaha terlebih dahulu.",
          primaryText: "Lengkapi Profil",
          primaryPath: "/profil",
        });
        return;
      }

      if (!assessmentReady) {
        showGatePopup({
          title: "Asesmen Belum Diisi",
          message:
            "Anda belum mengisi asesmen. Silakan isi asesmen terlebih dahulu agar data perbandingan bisa ditampilkan.",
          primaryText: "Ke Asesmen",
          primaryPath: "/asesmen",
        });
        return;
      }

      navigate("/perbandingan");
      return;
    }

    if (item.path === "/rekomendasi") {
      if (!profileReady) {
        showGatePopup({
          title: "Profil UMKM Belum Lengkap",
          message:
            "Anda belum mengisi profil. Jika ingin melihat rekomendasi, silakan lengkapi profil usaha terlebih dahulu.",
          primaryText: "Lengkapi Profil",
          primaryPath: "/profil",
        });
        return;
      }

      if (!assessmentReady) {
        showGatePopup({
          title: "Asesmen Belum Diisi",
          message:
            "Rekomendasi belum bisa ditampilkan karena Anda belum mengisi asesmen. Silakan isi asesmen terlebih dahulu.",
          primaryText: "Ke Asesmen",
          primaryPath: "/asesmen",
        });
        return;
      }

      navigate("/rekomendasi");
      return;
    }

    navigate(item.path);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (mobileMenu) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenu]);

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b bg-[#f4f7fb]/95 px-4 py-4 backdrop-blur sm:px-6 lg:px-12 lg:py-5">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4">
          {/* LOGO */}
          <h1
            onClick={() => navigate("/beranda")}
            className="shrink-0 cursor-pointer text-xl font-bold text-blue-900"
          >
            SiSehat
          </h1>

          {/* MENU DESKTOP */}
          <div className="hidden items-center gap-6 text-sm lg:flex xl:gap-8">
            {menu.map((item) => {
              const isActive = location.pathname.startsWith(item.path);

              return (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => handleMenuClick(item)}
                  className={`whitespace-nowrap transition ${
                    isActive
                      ? "font-semibold text-blue-900"
                      : "text-gray-500 hover:text-blue-900"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* RIGHT DESKTOP */}
          <div
            className="relative hidden items-center gap-4 lg:flex"
            ref={dropdownRef}
          >
            <button
              onClick={() => setOpen(!open)}
              className="text-xl transition hover:scale-110"
              type="button"
            >
              ⚙️
            </button>

            <div
              onClick={() => navigate("/profil")}
              className="flex max-w-[220px] cursor-pointer items-center gap-2 rounded-full bg-gray-100 px-3 py-1 transition hover:bg-gray-200"
            >
              <span className="truncate text-sm font-medium">
                {displayName}
              </span>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-900 text-xs font-semibold text-white">
                {avatarLetter}
              </div>
            </div>

            {open && (
              <div className="absolute right-0 top-14 z-50 w-64 rounded-2xl border bg-white p-4 shadow-xl">
                <div className="mb-3">
                  <p className="text-xs text-gray-400">AKUN SAYA</p>

                  <p className="mt-1 truncate text-sm font-semibold text-blue-900">
                    {displayName}
                  </p>

                  <p className="mt-1 truncate text-sm text-gray-500">
                    {displayEmail}
                  </p>
                </div>

                <div className="mb-2 border-t"></div>

                <div className="flex flex-col">
                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/profil");
                    }}
                    className="rounded-lg px-3 py-2 text-left hover:bg-gray-100"
                    type="button"
                  >
                    👤 Edit Profil
                  </button>

                  <button
                    onClick={() => {
                      setOpen(false);
                      navigate("/settings");
                    }}
                    className="rounded-lg px-3 py-2 text-left hover:bg-gray-100"
                    type="button"
                  >
                    ⚙️ Settings
                  </button>

                  <button
                    onClick={() => {
                      setShowLogout(true);
                      setOpen(false);
                    }}
                    className="rounded-lg px-3 py-2 text-left text-red-500 hover:bg-red-50"
                    type="button"
                  >
                    🚪 Keluar
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* BUTTON MOBILE */}
          <button
            onClick={() => setMobileMenu(true)}
            className="block rounded-lg px-2 py-1 text-3xl font-bold text-blue-900 lg:hidden"
            type="button"
            aria-label="Buka menu"
          >
            ☰
          </button>
        </div>
      </nav>

      {/* MENU MOBILE */}
      {mobileMenu && (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden">
          <button
            className="absolute inset-0 h-full w-full cursor-default"
            onClick={() => setMobileMenu(false)}
            type="button"
            aria-label="Tutup menu"
          ></button>

          <div className="absolute right-0 top-0 flex h-full w-[82%] max-w-[320px] flex-col bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-blue-900">SiSehat</h2>

              <button
                onClick={() => setMobileMenu(false)}
                className="text-2xl"
                type="button"
                aria-label="Tutup menu"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 rounded-2xl bg-gray-100 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-900 text-sm font-semibold text-white">
                  {avatarLetter}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-blue-900">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-gray-500">
                    {displayEmail}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-2">
              {menu.map((item) => {
                const isActive = location.pathname.startsWith(item.path);

                return (
                  <button
                    key={item.path}
                    type="button"
                    onClick={() => {
                      setMobileMenu(false);
                      handleMenuClick(item);
                    }}
                    className={`rounded-xl px-4 py-3 text-left text-sm transition ${
                      isActive
                        ? "bg-blue-50 font-semibold text-blue-900"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </button>
                );
              })}
            </div>

            <div className="mt-auto border-t pt-4">
              <button
                onClick={() => {
                  setMobileMenu(false);
                  navigate("/profil");
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-gray-100"
                type="button"
              >
                👤 Edit Profil
              </button>

              <button
                onClick={() => {
                  setMobileMenu(false);
                  navigate("/settings");
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-sm hover:bg-gray-100"
                type="button"
              >
                ⚙️ Settings
              </button>

              <button
                onClick={() => {
                  setMobileMenu(false);
                  setShowLogout(true);
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-sm text-red-500 hover:bg-red-50"
                type="button"
              >
                🚪 Keluar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP BLOKIR NAVIGASI */}
      {gateModal.open && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-[420px] rounded-xl bg-white p-6 text-center shadow-xl sm:p-8">
            <h2 className="text-lg font-semibold text-blue-900">
              {gateModal.title}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-gray-500">
              {gateModal.message}
            </p>

            <button
              onClick={() => {
                const targetPath = gateModal.primaryPath;
                closeGatePopup();
                navigate(targetPath);
              }}
              className="mt-6 w-full rounded-lg bg-blue-900 py-3 text-white transition hover:bg-blue-950"
              type="button"
            >
              {gateModal.primaryText}
            </button>

            <button
              onClick={closeGatePopup}
              className="mt-4 text-sm text-gray-400"
              type="button"
            >
              Nanti Saja
            </button>
          </div>
        </div>
      )}

      <LogoutModal
        open={showLogout}
        onClose={() => setShowLogout(false)}
        onConfirm={() => {
          localStorage.clear();
          navigate("/");
        }}
      />
    </>
  );
}