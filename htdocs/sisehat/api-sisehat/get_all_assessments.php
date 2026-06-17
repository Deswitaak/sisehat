<?php
// 1. PENGATURAN CORS LENGKAP PENEMBUS INFINITYFREE
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

// Query untuk mengambil data asesmen digabung dengan data user/profil
// Silakan sesuaikan nama kolom tabel 'users' jika berbeda (misal: nama_lengkap atau nama_usaha)
$query = "SELECT 
            a.id_asesmen, 
            a.id_user, 
            a.total_score, 
            a.status, 
            a.ov_score, 
            a.li_score, 
            a.ir_score, 
            a.ep_score, 
            a.os_score, 
            a.qw_score,
            u.nama AS nama_user
          FROM asesmen a
          JOIN user u ON a.id_user = u.id_user
          ORDER BY a.id_asesmen DESC";

$result = mysqli_query($conn, $query);

$data_asesmen = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        // Konversi tipe data angka agar tidak dikirim sebagai string ke React
        $row['id_asesmen'] = intval($row['id_asesmen']);
        $row['id_user'] = intval($row['id_user']);
        $row['total_score'] = floatval($row['total_score']);
        $row['ov_score'] = floatval($row['ov_score']);
        $row['li_score'] = floatval($row['li_score']);
        $row['ir_score'] = floatval($row['ir_score']);
        $row['ep_score'] = floatval($row['ep_score']);
        $row['os_score'] = floatval($row['os_score']);
        $row['qw_score'] = floatval($row['qw_score']);
        
        $data_asesmen[] = $row;
    }
    
    echo json_encode([
        "status" => "success",
        "data" => $data_asesmen
    ]);
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Gagal mengambil data: " . mysqli_error($conn)
    ]);
}

mysqli_close($conn);
?>