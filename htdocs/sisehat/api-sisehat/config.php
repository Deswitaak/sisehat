<?php
// Mengatur header CORS agar React lokal (Port 5173) bisa mengakses API XAMPP tanpa terblokir
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Konfigurasi Database Local XAMPP
$host = "sql101.infinityfree.com";
$user = "if0_41965157";
$pass = "P1nkMestatis";
$db   = "if0_41965157_sisehat";

$conn = mysqli_connect($host, $user, $pass, $db);

if (!$conn) {
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    echo json_encode([
        "status" => "error",
        "message" => "Gagal terhubung ke MySQL XAMPP. Pastikan Apache & MySQL sudah menyala: " . mysqli_connect_error()
    ]);
    exit;
}

mysqli_set_charset($conn, "utf8");
