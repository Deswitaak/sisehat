<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/** @var \mysqli $conn */
include 'config.php';

$input_data = file_get_contents("php://input");
$data = json_decode($input_data, true);

if (empty($data)) {
    echo json_encode(["status" => "error", "message" => "Data pendaftaran kosong."]);
    exit();
}

$fullName = isset($data['fullName']) ? mysqli_real_escape_string($conn, trim($data['fullName'])) : '';
$email    = isset($data['email']) ? mysqli_real_escape_string($conn, trim($data['email'])) : '';
$whatsapp = isset($data['whatsapp']) ? mysqli_real_escape_string($conn, trim($data['whatsapp'])) : '';
$password = isset($data['password']) ? trim($data['password']) : '';

if (empty($fullName) || empty($email) || empty($whatsapp) || empty($password)) {
    echo json_encode(["status" => "error", "message" => "Mohon lengkapi seluruh kolom."]);
    exit();
}

$check_user = mysqli_query($conn, "SELECT id_user FROM users WHERE email = '$email' OR username = '$fullName'");
if (mysqli_num_rows($check_user) > 0) {
    echo json_encode(["status" => "error", "message" => "Nama atau Email sudah terdaftar."]);
    exit();
}

$hashed_password = password_hash($password, PASSWORD_BCRYPT);

$query_user = "INSERT INTO users (username, email, whatsapp, password) VALUES (?, ?, ?, ?)";
$stmt_user = mysqli_prepare($conn, $query_user);

if ($stmt_user) {
    mysqli_stmt_bind_param($stmt_user, "ssss", $fullName, $email, $whatsapp, $hashed_password);
    if (mysqli_stmt_execute($stmt_user)) {
        $new_id_user = mysqli_insert_id($conn);

        // Menggunakan kolom posisi, usia_pemilik, jenis_kelamin yang valid
        $dummy_nama_usaha = "Usaha Baru " . $fullName;
        $query_usaha = "INSERT INTO usaha (id_user, nama_usaha, kategori, jenis_usaha, lama_usaha, usia_pemilik, posisi, jenis_kelamin) 
                        VALUES ($new_id_user, '$dummy_nama_usaha', 'Kuliner', 'Usaha Mikro', 1, 25, 'Pemilik', 'Laki-laki')";

        if (mysqli_query($conn, $query_usaha)) {
            echo json_encode(["status" => "success", "message" => "Registrasi Berhasil!"]);
        } else {
            echo json_encode(["status" => "error", "message" => "Gagal membuat profil usaha: " . mysqli_error($conn)]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan akun: " . mysqli_stmt_error($stmt_user)]);
    }
    mysqli_stmt_close($stmt_user);
} else {
    echo json_encode(["status" => "error", "message" => "Error database: " . mysqli_error($conn)]);
}
