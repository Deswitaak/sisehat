<?php
ob_start();

// 1. CORS HEADERS PENEMBUS GERBANG SECURITY
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'config.php';

// Ambil data gabungan antara tabel asesmen, profil usaha, dan role user registrasi
$query = "SELECT 
            a.id_asesmen AS id,
            us.nama_usaha,
            us.kategori,
            us.posisi AS role,
            a.status,
            a.total_score,
            a.ov_score,
            a.ir_score,
            a.os_score,
            a.ep_score,
            a.li_score,
            a.qw_score
          FROM asesmen a
          JOIN usaha us ON a.id_user = us.id_user
          ORDER BY a.id_asesmen DESC";

$result = mysqli_query($conn, $query);
$response_data = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        // Bentuk array sub-faktor agar logik pencarian factor tertinggi di React kamu berjalan otomatis
        $factors = [];
        $factors[] = ["name" => "Organizational Values", "score" => floatval($row['ov_score'])];
        $factors[] = ["name" => "Institutional Resources", "score" => floatval($row['ir_score'])];
        $factors[] = ["name" => "Operational Stability", "score" => floatval($row['os_score'])];
        $factors[] = ["name" => "Economic Performance", "score" => floatval($row['ep_score'])];
        $factors[] = ["name" => "Leader Involvement", "score" => floatval($row['li_score'])];
        $factors[] = ["name" => "Quality of Workplace", "score" => floatval($row['qw_score'])];

        $response_data[] = [
            "id" => intval($row['id']),
            "nama_usaha" => $row['nama_usaha'] ? $row['nama_usaha'] : "UMKM Tanpa Nama",
            "kategori" => $row['kategori'] ? $row['kategori'] : "Lainnya",
            "role" => $row['role'] ? $row['role'] : "Pemilik",
            "status" => $row['status'] ? $row['status'] : "Stabil",
            "total_score" => floatval($row['total_score']),
            "factors" => $factors
        ];
    }
    
    ob_end_clean();
    echo json_encode($response_data);
} else {
    ob_end_clean();
    echo json_encode([]);
}

mysqli_close($conn);
?>