<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

/** @var mysqli $conn */
include 'config.php';

// Ambil data JSON dari React
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $nama_usaha   = $data['nama_usaha'];
    $jenis_usaha  = $data['jenis_usaha'];
    $lama_usaha   = $data['lama_usaha'];
    $usia_pemilik = $data['usia_pemilik'];
    $posisi       = $data['posisi'];
    $jenis_kelamin = isset($data['jenis_kelamin']) ? $data['jenis_kelamin'] : '';

    // Query untuk menyimpan data ke tabel usaha
    $query = "INSERT INTO usaha (nama_usaha, jenis_usaha, lama_usaha, usia_pemilik, posisi, jenis_kelamin) 
              VALUES ('$nama_usaha', '$jenis_usaha', '$lama_usaha', '$usia_pemilik', '$posisi', '$jenis_kelamin')";

    if (mysqli_query($conn, $query)) {
        echo json_encode(["status" => "success", "message" => "Data usaha berhasil ditambahkan"]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Data input kosong"]);
}
