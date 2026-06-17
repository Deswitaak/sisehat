<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'config.php';

$id_user = isset($_GET['id_user']) ? intval($_GET['id_user']) : 0;

if ($id_user > 0) {
    $query = "SELECT * FROM usaha WHERE id_user = $id_user";
    $result = mysqli_query($conn, $query);

    if ($result && mysqli_num_rows($result) > 0) {
        $profile = mysqli_fetch_assoc($result);
        echo json_encode([
            "status" => "success",
            "data" => [
                "namaUsaha" => $profile['nama_usaha'],
                "jenisUsaha" => $profile['jenis_usaha'],
                "kategori" => $profile['kategori'],
                "lamaUsaha" => $profile['lama_usaha'],
                "usia" => $profile['usia_pemilik'],
                "gender" => $profile['jenis_kelamin'],
                "role" => $profile['posisi']
            ]
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "Data profil belum diisi."
        ]);
    }
} else {
    echo json_encode([
        "status" => "error",
        "message" => "ID User tidak valid."
    ]);
}

mysqli_close($conn);
?>