<?php
// 1. PENGATURAN CORS LENGKAP PENEMBUS INFINITYFREE
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

// 2. PENANGANAN REQUEST PREFLIGHT (OPTIONS) RESMI
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode([
        "status" => "error",
        "message" => "Data JSON tidak diterima"
    ]);
    exit();
}

$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (empty($email) || empty($password)) {
    echo json_encode([
        "status" => "error",
        "message" => "Input data tidak lengkap"
    ]);
    exit();
}

$email = mysqli_real_escape_string($conn, $email);

$query = "SELECT * FROM users WHERE email = '$email'";
$result = mysqli_query($conn, $query);

if (!$result) {
    echo json_encode([
        "status" => "error",
        "message" => mysqli_error($conn)
    ]);
    exit();
}

if (mysqli_num_rows($result) === 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Email tidak ditemukan"
    ]);
    exit();
}

$row = mysqli_fetch_assoc($result);

if (!password_verify($password, $row['password'])) {
    echo json_encode([
        "status" => "error",
        "message" => "Password salah"
    ]);
    exit();
}

$cekUsaha = mysqli_query(
    $conn,
    "SELECT * FROM usaha WHERE id_user = " . intval($row['id_user'])
);

$profileComplete = false;

if ($cekUsaha && mysqli_num_rows($cekUsaha) > 0) {
    $usaha = mysqli_fetch_assoc($cekUsaha);
    if (
        !empty($usaha['nama_usaha']) &&
        !empty($usaha['jenis_usaha']) &&
        !empty($usaha['posisi'])
    ) {
        $profileComplete = true;
    }
}

echo json_encode([
    "status" => "success",
    "message" => "Login berhasil",
    "profileComplete" => $profileComplete,
    "user" => [
        "id_user" => intval($row['id_user']),
        "username" => $row['username'],
        "email" => $row['email'],
        "whatsapp" => $row['whatsapp']
    ]
]);

mysqli_close($conn);
?>