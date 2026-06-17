<?php
// 🔥 GUNAKAN OUTPUT BUFFERING UNTUK MENANGKAP DAN MEMBUANG TEKS EROR HTML HOSTING
ob_start();

// Set zona waktu ke WIB (Jakarta) agar jam penyimpanan akurat
date_default_timezone_set('Asia/Jakarta');

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

/** @var \mysqli $conn */
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id_user']) && isset($data['answers'])) {
    $id_user = intval($data['id_user']);
    $answers = $data['answers'];
    $role    = isset($data['role']) ? $data['role'] : 'Pemilik';

    $ov = 0; $li = 0; $ir = 0; $ep = 0; $os = 0; $qw = 0;

    function hitungSkorSection($answers, $stepIndex, $jumlahPertanyaan, $maxScale)
    {
        $total = 0;
        for ($i = 0; $i < $jumlahPertanyaan; $i++) {
            $key = "{$stepIndex}-{$i}";
            $total += isset($answers[$key]) ? intval($answers[$key]) : 0;
        }
        if ($total == 0) return 0;
        return ($total / ($jumlahPertanyaan * $maxScale)) * 100;
    }

    if ($role === "Karyawan") {
        $ov = hitungSkorSection($answers, 0, 4, 5); 
        $qw = hitungSkorSection($answers, 1, 4, 5); 
        $li = hitungSkorSection($answers, 2, 3, 5); 

        $total_score = ($ov + $qw + $li) / 3;
    } else {
        $ov = hitungSkorSection($answers, 0, 6, 5); 
        $ir = hitungSkorSection($answers, 1, 6, 3); 
        $os = hitungSkorSection($answers, 2, 5, 5); 
        $ep = hitungSkorSection($answers, 3, 4, 5); 

        $total_score = ($ov + $ir + $os + $ep) / 4;
    }

    if ($total_score >= 85) {
        $status = "Optimal";
    } elseif ($total_score >= 70) {
        $status = "Stabil";
    } else {
        $status = "Perlu Perhatian";
    }

    $total_score = round($total_score, 2);
    $ov = round($ov, 2);
    $li = round($li, 2);
    $ir = round($ir, 2);
    $ep = round($ep, 2);
    $os = round($os, 2);
    $qw = round($qw, 2);

    $query = "INSERT INTO asesmen (id_user, total_score, status, ov_score, li_score, ir_score, ep_score, os_score, qw_score) 
              VALUES ($id_user, $total_score, '$status', $ov, $li, $ir, $ep, $os, $qw)";

    // Ambil string waktu lokal untuk dikirim balik ke React frontend
    $tanggal_sekarang = date('d F Y, H:i');

    ob_end_clean();

    if (mysqli_query($conn, $query)) {
        echo json_encode([
            "status" => "success",
            "message" => "Hasil asesmen berhasil disimpan",
            "calculated_total" => $total_score,
            "tanggal_simpan" => $tanggal_sekarang // 🔥 Kirim data tanggal simpan ter-update
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Gagal menyimpan ke database: " . mysqli_error($conn)]);
    }
} else {
    ob_end_clean();
    echo json_encode(["status" => "error", "message" => "Data hasil asesmen tidak lengkap atau format salah"]);
}

mysqli_close($conn);
?>