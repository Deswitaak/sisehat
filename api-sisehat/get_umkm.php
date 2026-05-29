<?php
// Pengaturan CORS agar bisa diakses oleh React Frontend (Port 5173)
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

// SQL Query mengambil profil usaha dan JOIN dengan data asesmen paling terakhir (latest)
// PERBAIKAN: Mengubah u.role menjadi u.posisi agar sesuai dengan struktur tabel terbaru
$query = "SELECT u.id_user AS id, u.nama_usaha, u.kategori, u.jenis_usaha, u.lama_usaha, u.posisi,
                 a.total_score, a.status, a.ov_score, a.li_score, a.ir_score, a.ep_score, a.os_score, a.qw_score
          FROM usaha u
          INNER JOIN asesmen a ON u.id_user = a.id_user
          WHERE a.id_asesmen = (SELECT MAX(id_asesmen) FROM asesmen WHERE id_user = u.id_user)";

$result = mysqli_query($conn, $query);
$response = [];

if ($result) {
    while ($row = mysqli_fetch_assoc($result)) {
        $response[] = [
            "id" => intval($row['id']),
            "nama_usaha" => $row['nama_usaha'],
            "kategori" => $row['kategori'],
            "jenis_usaha" => $row['jenis_usaha'],
            "lama_usaha" => intval($row['lama_usaha']),
            "posisi" => $row['posisi'], // PERBAIKAN: Menggunakan key posisi
            "total_score" => floatval($row['total_score']),
            "status" => $row['status'],
            "factors" => [
                ["name" => "OV", "score" => floatval($row['ov_score'])],
                ["name" => "LI", "score" => floatval($row['li_score'])],
                ["name" => "IR", "score" => floatval($row['ir_score'])],
                ["name" => "EP", "score" => floatval($row['ep_score'])],
                ["name" => "OS", "score" => floatval($row['os_score'])],
                ["name" => "QW", "score" => floatval($row['qw_score'])]
            ]
        ];
    }
    echo json_encode($response);
} else {
    echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
}
