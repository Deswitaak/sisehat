import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import RegistrasiMobile from "./RegistrasiMobile";

export default function Registrasi() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // State untuk menampung input user
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // Handle perubahan input
  const handleChange = (key, value) => {
    setForm({
      ...form,
      [key]: value,
    });
  };

  // HANDLE REGISTER (Koneksi ke Back End PHP via Ngrok)
  const handleRegister = async () => {
    // Validasi sederhana di sisi client
    if (!form.name || !form.email || !form.phone || !form.password) {
      alert("Harap isi semua kolom data!");
      return;
    }

    try {
      // 1. Mengirim data ke API register.php melalui tunnel HTTPS Ngrok yang terhubung ke XAMPP lokal kamu
      const response = await fetch('https://unlit-armless-jawed.ngrok-free.dev/sisehat/api-sisehat/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: form.name,       // Mencocokkan dengan $_DATA['fullName'] di register.php
          email: form.email,
          whatsapp: form.phone,      // Mencocokkan dengan $_DATA['whatsapp'] di register.php
          password: form.password
        }),
      });

      // 2. Mengambil respon JSON dari server
      const result = await response.json();

      // 3. Logika pengecekan status dari backend PHP
      if (result.status === 'success') {
        alert(result.message || 'Registrasi Berhasil! Silakan login.');
        navigate("/login");
      } else {
        // Menampilkan pesan error asli dari PHP (Misal: "Nama atau Email sudah terdaftar")
        alert(result.message || 'Gagal melakukan pendaftaran.');
      }

    } catch (error) {
      console.error("Error registrasi:", error);
      alert('Tidak dapat terhubung ke server. Pastikan XAMPP (Apache & MySQL) sudah aktif.');
    }
  };
  
if (window.innerWidth < 768) {
  return (
    <RegistrasiMobile
      form={form}
      setForm={setForm}
      showPassword={showPassword}
      setShowPassword={setShowPassword}
      handleRegister={handleRegister}
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
            Master your business vitality with precision.
          </h2>
          <p className="mt-4 text-gray-200">
            Join thousands of organizations using SiSehat to monitor performance,
            analyze risk, and optimize enterprise health through data-driven insights.
          </p>
        </div>

        <p className="text-sm opacity-70">
          © 2026 SiSehat Enterprise Suite • GDPR Compliant
        </p>
      </div>

      {/* RIGHT SIDE - Form */}
      <div className="w-1/2 bg-gray-50 p-12 flex items-center">
        <div className="max-w-md w-full mx-auto">
          {/* Tab Navigation */}
          <div className="flex gap-6 border-b mb-6 text-sm font-medium">
            <Link to="/login" className="text-gray-400 hover:text-blue-900 pb-2">
              Login
            </Link>
            <span className="text-blue-900 border-b-2 border-blue-900 pb-2">
              Registration
            </span>
          </div>

          <h2 className="text-2xl font-bold">Join SiSehat Today</h2>
          <p className="text-gray-500 mt-1">
            Start your business health journey.
          </p>

          <div className="mt-6 space-y-4">
            {/* FULL NAME */}
            <div>
              <label className="text-xs text-gray-500 font-semibold">FULL NAME</label>
              <div className="flex items-center border rounded-lg px-3 mt-1 bg-white focus-within:ring-2 focus-within:ring-blue-900">
                <User size={18} className="text-gray-400" />
                <input
                  className="w-full p-2 ml-2 outline-none"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
            </div>

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
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </div>
            </div>

            {/* PHONE */}
            <div>
              <label className="text-xs text-gray-500 font-semibold">WHATSAPP NUMBER</label>
              <div className="flex items-center border rounded-lg px-3 mt-1 bg-white focus-within:ring-2 focus-within:ring-blue-900">
                <Phone size={18} className="text-gray-400" />
                <input
                  className="w-full p-2 ml-2 outline-none"
                  placeholder="+62 812 3456 7890"
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
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
                  onChange={(e) => handleChange("password", e.target.value)}
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

            {/* Terms & Conditions */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <input type="checkbox" className="rounded border-gray-300" required />
              <span>I agree to Terms & Privacy Policy</span>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleRegister}
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-bold hover:bg-blue-800 transition-colors shadow-lg active:transform active:scale-95"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}