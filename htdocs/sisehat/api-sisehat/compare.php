<?php
// Pengaturan CORS wajib agar backend XAMPP bisa diakses oleh React Frontend (Port 5173)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/** @var \mysqli $conn */
include 'config.php';

// Menangkap parameter kategori usaha dari frontend (default ke 'Kuliner' jika kosong)
$kategori = isset($_GET['kategori']) ? mysqli_real_escape_string($conn, $_GET['kategori']) : 'Kuliner';

// Query agregasi SQL untuk menghitung rata-rata (AVG) skor industri
// PERBAIKAN: Menghapus tanda petik dua (") ganda yang merusak sintaks query string PHP
$query = "SELECT 
            AVG(a.total_score) AS avg_total,
            AVG(a.ov_score) AS avg_ov,
            AVG(a.li_score) AS avg_li,
            AVG(a.ir_score) AS avg_ir,
            AVG(a.ep_score) AS avg_ep,
            AVG(a.os_score) AS avg_os,
            AVG(a.qw_score) AS avg_qw
          FROM asesmen a
          INNER JOIN usaha u ON a.id_user = u.id_user
          WHERE u.kategori = '$kategori'";

$result = mysqli_query($conn, $query);

if ($result) {
    $row = mysqli_fetch_assoc($result);

    // Jika data kategori tersebut belum ada di DB, set default ke nilai 0 agar tidak null
    $response = [
        "kategori" => $kategori,
        "avg_total_score" => round(floatval($row['avg_total'] ?? 0), 2),
        "factors" => [
            ["name" => "OV", "score" => round(floatval($row['avg_ov'] ?? 0), 2)],
            ["name" => "LI", "score" => round(floatval($row['avg_li'] ?? 0), 2)],
            ["name" => "IR", "score" => round(floatval($row['avg_ir'] ?? 0), 2)],
            ["name" => "EP", "score" => round(floatval($row['avg_ep'] ?? 0), 2)],
            ["name" => "OS", "score" => round(floatval($row['avg_os'] ?? 0), 2)],
            ["name" => "QW", "score" => round(floatval($row['avg_qw'] ?? 0), 2)]
        ]
    ];

    echo json_encode($response);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
}
