import { Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginMobile({
  form,
  setForm,
  showPassword,
  setShowPassword,
  handleLogin,
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5EEDF] via-[#EEF5F4] to-[#63A9EB] flex flex-col items-center px-8 pt-24">

      <h1 className="text-5xl font-black text-[#0A2A5E]">
        SISEHAT
      </h1>

      <p className="mt-3 text-center text-lg">
        Panel Kesehatan Digital Pelaku UMKM
      </p>

      <div className="w-full bg-white rounded-[24px] shadow-lg p-6 mt-12">

        <div className="bg-[#EEF1F5] rounded-xl flex items-center px-4 py-4">
          <Mail size={18} className="text-gray-400" />

          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
            className="bg-transparent outline-none ml-3 w-full"
          />
        </div>

        <div className="bg-[#EEF1F5] rounded-xl flex items-center px-4 py-4 mt-6">
          <Lock size={18} className="text-gray-400" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Kata sandi"
            value={form.password}
            onChange={(e) =>
              setForm({
                ...form,
                password: e.target.value,
              })
            }
            className="bg-transparent outline-none ml-3 w-full"
          />

          <button
            onClick={() =>
              setShowPassword(!showPassword)
            }
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#293B63] text-white py-4 rounded-xl font-bold mt-10"
        >
          Masuk
        </button>

        <p className="text-center text-blue-600 text-sm mt-4">
          Lupa password?
        </p>

        <p className="text-center mt-12">
          Belum punya akun?{" "}
          <Link
            to="/registrasi"
            className="text-blue-600 font-semibold"
          >
            Daftar di sini
          </Link>
        </p>

      </div>

    </div>
  );
}