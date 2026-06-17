<?php
ob_start();

// 1. CORS HEADERS LENGKAP
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id_user'])) {

    $id_user       = intval($data['id_user']);
    $nama_usaha    = mysqli_real_escape_string($conn, $data['nama_usaha'] ?? $data['namaUsaha'] ?? '');
    $kategori      = mysqli_real_escape_string($conn, $data['kategori'] ?? '');
    $jenis_usaha   = mysqli_real_escape_string($conn, $data['jenis_usaha'] ?? $data['jenisUsaha'] ?? '');
    $lama_usaha    = intval($data['lama_usaha'] ?? $data['lamaUsaha'] ?? 0);
    $usia_pemilik  = intval($data['usia_pemilik'] ?? $data['usia'] ?? 0);
    $posisi        = mysqli_real_escape_string($conn, $data['posisi'] ?? $data['role'] ?? '');
    $jenis_kelamin = mysqli_real_escape_string($conn, $data['jenis_kelamin'] ?? $data['gender'] ?? '');

    // Cek apakah data usaha untuk id_user ini sudah ada
    $check = mysqli_query($conn, "SELECT id_usaha FROM usaha WHERE id_user = $id_user");
    
    $is_update = false;
    if ($check && mysqli_num_rows($check) > 0) {
        $is_update = true;
    }

    if ($is_update) {
        $query = "UPDATE usaha SET 
                    nama_usaha='$nama_usaha', 
                    kategori='$kategori', 
                    jenis_usaha='$jenis_usaha', 
                    lama_usaha=$lama_usaha, 
                    usia_pemilik=$usia_pemilik, 
                    posisi='$posisi', 
                    jenis_kelamin='$jenis_kelamin' 
                  WHERE id_user=$id_user";
    } else {
        $query = "INSERT INTO usaha (id_user, nama_usaha, kategori, jenis_usaha, lama_usaha, usia_pemilik, posisi, jenis_kelamin) 
                  VALUES ($id_user, '$nama_usaha', '$kategori', '$jenis_usaha', $lama_usaha, $usia_pemilik, '$posisi', '$jenis_kelamin')";
    }

    $execute_query = mysqli_query($conn, $query);
    $db_error = mysqli_error($conn);

    ob_end_clean(); 

    if ($execute_query) {
        echo json_encode([
            "status" => "success",
            "message" => "Profil usaha berhasil disimpan ke database"
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Gagal SQL: " . $db_error
        ]);
    }
} else {
    ob_end_clean();
    echo json_encode([
        "status" => "error",
        "message" => "ID User tidak terbaca oleh sistem"
    ]);
}

mysqli_close($conn);
?>