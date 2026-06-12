<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/** @var \mysqli $conn */
include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id_user'])) {
    $id_user      = intval($data['id_user']);
    $nama_usaha   = mysqli_real_escape_string($conn, $data['namaUsaha']);
    $kategori     = mysqli_real_escape_string($conn, $data['kategori']);
    $jenis_usaha  = mysqli_real_escape_string($conn, $data['jenisUsaha']);
    $lama_usaha   = intval($data['lamaUsaha']);
    $usia_pemilik = intval($data['usia']);
    $posisi       = mysqli_real_escape_string($conn, $data['role']); // frontend melempar 'role', database menyimpan di 'posisi'

    // Update data profil usaha milik user terkait
    $query = "UPDATE usaha SET 
                nama_usaha = '$nama_usaha', 
                kategori = '$kategori', 
                jenis_usaha = '$jenis_usaha', 
                lama_usaha = $lama_usaha, 
                usia_pemilik = $usia_pemilik, 
                posisi = '$posisi' 
              WHERE id_user = $id_user";

    if (mysqli_query($conn, $query)) {
        echo json_encode(["status" => "success", "message" => "Profil usaha berhasil diperbarui."]);
    } else {
        echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "ID User tidak ditemukan."]);
}
