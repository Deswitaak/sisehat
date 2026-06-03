import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  // WADAH BACKEND PASSWORD
  // Nanti kalau backend sudah ada, isi endpoint di sini.
  const CHANGE_PASSWORD_ENDPOINT = "";

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    emailNotification: true,
    dataSharing: false,
    highAnalytics: true,
  });

  useEffect(() => {
    const savedPreferences = localStorage.getItem("user_settings_preferences");

    if (savedPreferences) {
      try {
        setPreferences({
          emailNotification: true,
          dataSharing: false,
          highAnalytics: true,
          ...JSON.parse(savedPreferences),
        });
      } catch (error) {
        console.log("Gagal membaca pengaturan:", error);
      }
    }
  }, []);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;

    setPasswordForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePreferenceChange = (name) => {
    setPreferences((prev) => ({
      ...prev,
      [name]: !prev[name],
    }));
  };

  const goBackToPreviousPage = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/beranda");
    }
  };

  const handleSave = async () => {
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    const isPasswordFilled =
      currentPassword.trim() !== "" ||
      newPassword.trim() !== "" ||
      confirmPassword.trim() !== "";

    if (isPasswordFilled) {
      if (
        currentPassword.trim() === "" ||
        newPassword.trim() === "" ||
        confirmPassword.trim() === ""
      ) {
        alert("Kalau ingin mengubah kata sandi, semua kolom kata sandi harus diisi.");
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Konfirmasi kata sandi tidak sama.");
        return;
      }
    }

    try {
      setIsSaving(true);

      localStorage.setItem(
        "user_settings_preferences",
        JSON.stringify(preferences)
      );

      localStorage.setItem("user_settings_updated_at", new Date().toISOString());

      if (isPasswordFilled && CHANGE_PASSWORD_ENDPOINT.trim() !== "") {
        const token =
          localStorage.getItem("token") ||
          localStorage.getItem("authToken") ||
          localStorage.getItem("userToken");

        const response = await fetch(CHANGE_PASSWORD_ENDPOINT, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
            confirmPassword,
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok || result?.success === false) {
          throw new Error(
            result?.message || "Gagal mengubah kata sandi di backend."
          );
        }
      }

      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        goBackToPreviousPage();
      }, 1000);
    } catch (error) {
      alert(error.message || "Terjadi kesalahan saat menyimpan pengaturan.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#f4f7fb] min-h-screen px-4 sm:px-6 md:px-8 lg:px-16 py-6 md:py-10 overflow-x-hidden">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-900 text-center">
          Pengaturan Akun
        </h1>

        <p className="text-center text-gray-500 mt-2 text-sm sm:text-base">
          Kelola preferensi keamanan dan aplikasi Anda di sini.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8 mt-8 md:mt-10">
          {/* PASSWORD */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-blue-900 mb-4">
              🔒 Ubah Kata Sandi
            </h2>

            <input
              type="password"
              name="currentPassword"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
              placeholder="Kata sandi saat ini"
              className="w-full border p-3 rounded-lg mb-4 outline-none focus:ring-2 focus:ring-blue-900"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                placeholder="Kata sandi baru"
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 min-w-0"
              />

              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                placeholder="Konfirmasi"
                className="w-full border p-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-900 min-w-0"
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="mt-6 bg-blue-900 text-white px-6 py-2 rounded-lg w-full sm:w-auto hover:bg-blue-800 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>

          {/* PREFERENSI */}
          <div className="bg-white p-5 sm:p-6 rounded-xl border shadow-sm">
            <h2 className="font-semibold text-blue-900 mb-4">
              ⚙️ Preferensi
            </h2>

            <div className="flex justify-between items-center gap-4 mb-4 text-sm sm:text-base">
              <span>Notifikasi Email</span>
              <input
                type="checkbox"
                checked={preferences.emailNotification}
                onChange={() => handlePreferenceChange("emailNotification")}
                className="shrink-0"
              />
            </div>

            <div className="flex justify-between items-center gap-4 mb-4 text-sm sm:text-base">
              <span>Penyebaran Data</span>
              <input
                type="checkbox"
                checked={preferences.dataSharing}
                onChange={() => handlePreferenceChange("dataSharing")}
                className="shrink-0"
              />
            </div>

            <div className="flex justify-between items-center gap-4 text-sm sm:text-base">
              <span>Mode Analitik Tinggi</span>
              <input
                type="checkbox"
                checked={preferences.highAnalytics}
                onChange={() => handlePreferenceChange("highAnalytics")}
                className="shrink-0"
              />
            </div>
          </div>
        </div>
      </div>

      {/* POPUP BERHASIL */}
      {showSuccess && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-xl">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">
              ✅
            </div>

            <h2 className="text-lg font-semibold text-blue-900">
              Pengaturan Berhasil Disimpan
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Anda akan diarahkan kembali ke halaman sebelumnya.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}