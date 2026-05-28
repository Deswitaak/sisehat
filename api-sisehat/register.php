<?php
// 1. PENGATURAN CORS (Wajib agar tidak diblokir oleh React frontend)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// Mengatasi preflight request OPTIONS dari Axios/Fetch React
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/** @var \mysqli $conn */
include 'config.php';

// 2. Menerima input JSON dari React Frontend
$input_data = file_get_contents("php://input");
$data = json_decode($input_data, true);

// Validasi jika input kosong
if (empty($data)) {
    echo json_encode([
        "status" => "error",
        "message" => "Data pendaftaran tidak boleh kosong."
    ]);
    exit();
}

// 3. Menangkap variabel sesuai inputan form registrasi React kalian
$fullName = isset($data['fullName']) ? mysqli_real_escape_string($conn, trim($data['fullName'])) : '';
$email    = isset($data['email']) ? mysqli_real_escape_string($conn, trim($data['email'])) : '';
$whatsapp = isset($data['whatsapp']) ? mysqli_real_escape_string($conn, trim($data['whatsapp'])) : '';
$password = isset($data['password']) ? trim($data['password']) : '';

// Validasi kelengkapan data inputan
if (empty($fullName) || empty($email) || empty($whatsapp) || empty("password")) {
    echo json_encode([
        "status" => "error",
        "message" => "Mohon lengkapi semua kolom pendaftaran."
    ]);
    exit();
}

// 4. Cek apakah email atau username sudah pernah terdaftar sebelumnya
$check_user = mysqli_query($conn, "SELECT id_user FROM users WHERE email = '$email' OR username = '$fullName'");
if (mysqli_num_rows($check_user) > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Nama Lengkap atau Email sudah terdaftar."
    ]);
    exit();
}

// 5. Enkripsi password demi keamanan akun
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

// 6. Jalankan Query Insert Data Akun Baru
$query = "INSERT INTO users (username, email, whatsapp, password) VALUES (?, ?, ?, ?)";
$stmt = mysqli_prepare($conn, $query);

if ($stmt) {
    mysqli_stmt_bind_param($stmt, "ssss", $fullName, $email, $whatsapp, $hashed_password);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode([
            "status" => "success",
            "message" => "Registrasi Berhasil! Silakan menuju halaman login."
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menyimpan akun: " . mysqli_stmt_error($stmt)
        ]);
    }
    mysqli_stmt_close($stmt);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Kesalahan struktur query database: " . mysqli_error($conn)
    ]);
}
