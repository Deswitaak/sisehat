import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import LoginMobile from "./LoginMobile";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // State untuk menampung input form
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  // HANDLE LOGIN (Koneksi ke Back End PHP)
  const handleLogin = async () => {
    // Validasi input kosong
    if (!form.email || !form.password) {
      alert("Harap masukkan email dan password");
      return;
    }

    try {
      // Mengirim data login ke API login.php
      const response = await fetch('http://localhost/sisehat/api-sisehat/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password
        }),
      });

      // Mengambil respon JSON dari PHP
      const result = await response.json();
if (result.status === "success") {

  localStorage.setItem("isLogin", "true");

  localStorage.setItem(
    "user",
    JSON.stringify(result.user)
  );

  localStorage.setItem(
    "profileComplete",
    result.profileComplete ? "true" : "false"
  );

  localStorage.setItem(
    "profileData",
    JSON.stringify({
      nama: result.user.username
    })
  );

  alert("Login Berhasil!");

  navigate("/beranda");

}
      
      else {
        // Tampilkan pesan error dari PHP (Email/Password salah)
        alert("Gagal Login: " + result.message);
      }
    } catch (error) {
      console.error("Error koneksi login:", error);
      alert("Tidak dapat terhubung ke server. Pastikan Apache & MySQL di XAMPP sudah menyala.");
    }
  };

  if (window.innerWidth < 768) {
  return (
    <LoginMobile
      form={form}
      setForm={setForm}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      handleLogin={handleLogin}
    />
  );
}

  return (
    <div className="min-h-screen flex">
      {/* LEFT SIDE - Branding */}
      <div className="w-1/2 bg-gradient-to-br from-blue-950 to-blue-700 text-white p-12 flex flex-col justify-between">
        <div>
          <h1 className="font-bold text-lg">SiSehat</h1>
          <p className="text-sm mt-1 opacity-80">
            Enterprise Analytics & Growth Ecosystem
          </p>
        </div>

        <div>
          <h2 className="text-4xl font-bold leading-tight">
            Welcome Back to Your Control Center.
          </h2>
          <p className="mt-4 text-gray-200">
            Monitor, analyze, and elevate your business performance with precision.
          </p>
        </div>

        <p className="text-sm opacity-70">
          © 2026 SiSehat Enterprise Suite • Secure Access
        </p>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-1/2 bg-gray-50 p-12 flex items-center">
        <div className="max-w-md w-full mx-auto">
          {/* TAB NAVIGATION */}
          <div className="flex gap-6 border-b mb-6 text-sm font-medium">
            <span className="text-blue-900 border-b-2 border-blue-900 pb-2">
              Login
            </span>
            <Link
              to="/registrasi"
              className="text-gray-400 hover:text-blue-900 pb-2"
            >
              Registration
            </Link>
          </div>

          <h2 className="text-2xl font-bold">Welcome Back</h2>
          <p className="text-gray-500 mt-1">
            Login to continue your journey.
          </p>

          {/* FORM INPUT */}
          <div className="mt-6 space-y-4">
            {/* EMAIL */}
            <div>
              <label className="text-xs text-gray-500 font-semibold">EMAIL ADDRESS</label>
              <div className="flex items-center border rounded-lg px-3 mt-1 bg-white focus-within:ring-2 focus-within:ring-blue-900">
                <Mail size={18} className="text-gray-400" />
                <input
                  type="email"
                  className="w-full p-2 ml-2 outline-none"
                  placeholder="name@company.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm({ ...form, email: e.target.value })
                  }
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-xs text-gray-500 font-semibold">PASSWORD</label>
              <div className="flex items-center border rounded-lg px-3 mt-1 bg-white focus-within:ring-2 focus-within:ring-blue-900">
                <Lock size={18} className="text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full p-2 ml-2 outline-none"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-blue-900"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              onClick={handleLogin}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-lg active:transform active:scale-95"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}