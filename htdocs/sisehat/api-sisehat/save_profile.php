<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

include 'config.php';

$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['id_user'])) {

    $id_user       = intval($data['id_user']);
    $nama_usaha    = mysqli_real_escape_string($conn, $data['nama_usaha']);
    $kategori      = mysqli_real_escape_string($conn, $data['kategori']);
    $jenis_usaha   = mysqli_real_escape_string($conn, $data['jenis_usaha']);
    $lama_usaha    = intval($data['lama_usaha']);
    $usia_pemilik  = intval($data['usia_pemilik']);
    $posisi        = mysqli_real_escape_string($conn, $data['posisi']);
    $jenis_kelamin = mysqli_real_escape_string($conn, $data['jenis_kelamin']);

    $check = mysqli_query(
        $conn,
        "SELECT id_usaha FROM usaha WHERE id_user = $id_user"
    );

    if (mysqli_num_rows($check) > 0) {

        $query = "
        UPDATE usaha SET
            nama_usaha='$nama_usaha',
            kategori='$kategori',
            jenis_usaha='$jenis_usaha',
            lama_usaha=$lama_usaha,
            usia_pemilik=$usia_pemilik,
            posisi='$posisi',
            jenis_kelamin='$jenis_kelamin'
        WHERE id_user=$id_user
        ";

    } else {

        $query = "
        INSERT INTO usaha
        (
            id_user,
            nama_usaha,
            kategori,
            jenis_usaha,
            lama_usaha,
            usia_pemilik,
            posisi,
            jenis_kelamin
        )
        VALUES
        (
            $id_user,
            '$nama_usaha',
            '$kategori',
            '$jenis_usaha',
            $lama_usaha,
            $usia_pemilik,
            '$posisi',
            '$jenis_kelamin'
        )
        ";
    }

    if (mysqli_query($conn, $query)) {

        echo json_encode([
            "status" => "success",
            "message" => "Profil usaha berhasil disimpan"
        ]);

    } else {

        echo json_encode([
            "status" => "error",
            "message" => mysqli_error($conn)
        ]);

    }

} else {

    echo json_encode([
        "status" => "error",
        "message" => "ID User wajib dikirim"
    ]);

}
?>