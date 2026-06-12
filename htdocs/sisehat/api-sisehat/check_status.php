<?php
// Pengaturan CORS agar bisa diakses oleh React Frontend port 5173 maupun domain deploy
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

// Menangkap parameter id_user dari query URL (Contoh: check_status.php?id_user=1)
$id_user = isset($_GET['id_user']) ? intval($_GET['id_user']) : 0;

if ($id_user <= 0) {
    echo json_encode([
        "success" => false,
        "message" => "Parameter id_user tidak valid atau tidak disertakan."
    ]);
    exit();
}

// 1. CEK STATUS PROFIL (Tabel usaha)
// Mengambil data profil yang sesuai dengan database sisehat terbaru
$query_profile = "SELECT nama_usaha, kategori, jenis_usaha, lama_usaha, usia_pemilik, posisi FROM usaha WHERE id_user = $id_user LIMIT 1";
$result_profile = mysqli_query($conn, $query_profile);

$profileComplete = false;
$profileData = null;

if ($result_profile && mysqli_num_rows($result_profile) > 0) {
    $row_profile = mysqli_fetch_assoc($result_profile);

    // Validasi kelengkapan data: Jika nama usaha atau kategori masih bawaan dummy / kosong, dianggap belum lengkap
    if (!empty($row_profile['nama_usaha']) && !str_contains($row_profile['nama_usaha'], 'Usaha Baru') && !empty($row_profile['kategori'])) {
        $profileComplete = true;

        // Mengambil data user untuk mendapatkan nama asli pendaftar dari tabel users
        $query_user = "SELECT username FROM users WHERE id_user = $id_user LIMIT 1";
        $result_user = mysqli_query($conn, $query_user);
        $row_user = mysqli_fetch_assoc($result_user);

        // Format object profileData disesuaikan persis dengan keinginan Tim Frontend
        $profileData = [
            "nama" => $row_user['username'] ?? "User SISEHAT",
            "namaUsaha" => $row_profile['nama_usaha'],
            "jenisUsaha" => $row_profile['jenis_usaha'],
            "kategori" => $row_profile['kategori'],
            "lamaUsaha" => $row_profile['lama_usaha'] . " tahun",
            "usia" => strval($row_profile['usia_pemilik']),
            "role" => $row_profile['posisi'] ?? "Pemilik" // Sinkronisasi database: posisi dipetakan sebagai role di frontend
        ];
    }
}

// 2. CEK STATUS ASESMEN (Tabel asesmen)
$query_assessment = "SELECT id_asesmen FROM asesmen WHERE id_user = $id_user LIMIT 1";
$result_assessment = mysqli_query($conn, $query_assessment);

$assessmentComplete = false;
if ($result_assessment && mysqli_num_rows($result_assessment) > 0) {
    $assessmentComplete = true;
}

// 3. RETURN RESPONSE KE FRONTEND
echo json_encode([
    "success" => true,
    "profileComplete" => $profileComplete,
    "assessmentComplete" => $assessmentComplete,
    "profileData" => $profileData
]);
