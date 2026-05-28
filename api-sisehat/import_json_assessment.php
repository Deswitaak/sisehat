<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

// Meningkatkan batas waktu eksekusi skrip agar tidak timeout saat memproses ratusan data massal
set_time_limit(300);

/** @var \mysqli $conn */
include 'config.php';

// Tentukan path mengarah langsung ke lokasi file raw_data.json di proyek kamu
$json_path = '../src/data/raw_data.json';

if (!file_exists($json_path)) {
    echo json_encode([
        "status" => "error",
        "message" => "File raw_data.json tidak ditemukan di folder src/data/. Pastikan lokasi file sudah benar."
    ]);
    exit;
}

// Membaca isi file JSON menjadi string dan mengubahnya ke array asosiatif PHP
$json_string = file_get_contents($json_path);
$data_array = json_decode($json_string, true);

if (empty($data_array) || !is_array($data_array)) {
    echo json_encode(["status" => "error", "message" => "Format isi file JSON kosong atau tidak valid."]);
    exit;
}

$success_count = 0;
$skipped_count = 0;

// Menyiapkan template Query SQL Prepared Statements demi keamanan dan kecepatan proses ratusan data
$query_insert = "INSERT INTO asesmen (id_user, total_score, status, ov_score, li_score, ir_score, ep_score, os_score, qw_score, tanggal_asesmen) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";
$stmt_insert = mysqli_prepare($conn, $query_insert);

foreach ($data_array as $item) {
    // PROTEKSI DATA: Lewati objek jika field ID tidak bernilai angka (seperti baris judul/skema string di awal file JSON)
    if (!isset($item['ID']) || !is_numeric($item['ID'])) {
        $skipped_count++;
        continue;
    }

    $id_user = intval($item['ID']);

    // Inisialisasi awal penampung nilai untuk 6 variabel faktor instrumen SISEHAT
    $score_ov = 0;
    $score_li = 0;
    $score_ir = 0;
    $score_ep = 0;
    $score_os = 0;
    $score_qw = 0;

    // Looping kalkulasi menjumlahkan bobot jawaban dari indikator pertanyaan OH1 hingga OH35
    for ($i = 1; $i <= 35; $i++) {
        $key = "OH" . $i;
        $val = isset($item[$key]) ? intval($item[$key]) : 0;

        // Pembagian kluster sebaran indikator pertanyaan kuesioner ke dalam masing-masing faktor dasar
        if ($i >= 1 && $i <= 6)   $score_ov += $val;
        if ($i >= 7 && $i <= 12)  $score_li += $val;
        if ($i >= 13 && $i <= 18) $score_ir += $val;
        if ($i >= 19 && $i <= 24) $score_ep += $val;
        if ($i >= 25 && $i <= 30) $score_os += $val;
        if ($i >= 31 && $i <= 35) $score_qw += $val;
    }

    // Standardisasi konversi nilai total jawaban per kluster ke format skala maksimal 100
    $ov = round(($score_ov / 30) * 100, 2);
    $li = round(($score_li / 30) * 100, 2);
    $ir = round(($score_ir / 30) * 100, 2);
    $ep = round(($score_ep / 30) * 100, 2);
    $os = round(($score_os / 30) * 100, 2);
    $qw = round(($score_qw / 25) * 100, 2);

    // Menghitung bobot akumulasi skor final (Rata-rata dari ke-6 komponen nilai standar)
    $total_score = round(($ov + $li + $ir + $ep + $os + $qw) / 6, 2);

    // Klasifikasi otomatis kesimpulan status kepatuhan berdasarkan kesepakatan batas threshold
    if ($total_score >= 85) {
        $status = "Optimal";
    } elseif ($total_score >= 70) {
        $status = "Stabil";
    } else {
        $status = "Perlu Perhatian";
    }

    // VALIDASI USER (Anti-Duplicate): Gunakan INSERT IGNORE agar tidak memicu fatal error jika ID sudah ada
    $dummy_username = "user_umkm_" . $id_user;
    $dummy_password = password_hash("rahasia123", PASSWORD_BCRYPT);
    mysqli_query($conn, "INSERT IGNORE INTO users (id_user, username, password) VALUES ($id_user, '$dummy_username', '$dummy_password')");

    // VALIDASI PROFIL USAHA (Anti-Duplicate): Cek apakah data usaha untuk id_user ini sudah dibuat
    $check_usaha = mysqli_query($conn, "SELECT id_user FROM usaha WHERE id_user = $id_user");
    if (mysqli_num_rows($check_usaha) == 0) {
        $dummy_nama_usaha = "UMKM Mitra SISEHAT " . $id_user;
        mysqli_query($conn, "INSERT INTO usaha (id_user, nama_usaha, kategori, jenis_usaha, lama_usaha, usia_pemilik, posisi, jenis_kelamin) 
                            VALUES ($id_user, '$dummy_nama_usaha', 'Kuliner', 'Usaha Mikro', 3, 25, 'Pemilik', 'Laki-laki')");
    }

    // Mengikat parameter data bertipe data dinamis (integer, double, string) ke dalam query SQL
    mysqli_stmt_bind_param($stmt_insert, "idsssssss", $id_user, $total_score, $status, $ov, $li, $ir, $ep, $os, $qw);
    if (mysqli_stmt_execute($stmt_insert)) {
        $success_count++;
    }
}

// Tutup koneksi pembungkus statement query setelah perulangan massal selesai
mysqli_stmt_close($stmt_insert);

echo json_encode([
    "status" => "success",
    "message" => "Migrasi Selesai! Berhasil mengonversi dan menambahkan $success_count data asesmen baru ke MySQL. (Dilewati: $skipped_count)"
]);
