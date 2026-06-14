// Base URL menggunakan domain statis Ngrok aman kamu
export const API_BASE_URL = "https://unlit-armless-jawed.ngrok-free.dev/sisehat/api-sisehat";

/**
 * Helper Fetch Kustom untuk SiSehat
 * Fungsi ini otomatis menambahkan Header bypass Ngrok agar bisa diakses dari HP/device lain
 */
export const sisehatFetch = async (endpoint, options = {}) => {
  // Gabungkan URL dasar dengan endpoint yang dituju
  const url = `${API_BASE_URL}${endpoint}`;

  // Pastikan objek headers sudah ada
  const headers = {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': '69420', // Bypass peringatan interseptor Ngrok untuk HP/device lain
    ...options.headers, // Tetap mempertahankan headers tambahan lain jika ada
  };

  // Jalankan fetch dengan konfigurasi yang sudah disatukan
  return fetch(url, {
    ...options,
    headers,
  });
};