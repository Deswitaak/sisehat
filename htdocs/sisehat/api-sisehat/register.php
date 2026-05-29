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

$input_data = file_get_contents("php://input");
$data = json_decode($input_data, true);

if (empty($data)) {
    echo json_encode([
        "status" => "error",
        "message" => "Data pendaftaran kosong."
    ]);
    exit();
}

$fullName = isset($data['fullName'])
    ? mysqli_real_escape_string($conn, trim($data['fullName']))
    : '';

$email = isset($data['email'])
    ? mysqli_real_escape_string($conn, trim($data['email']))
    : '';

$whatsapp = isset($data['whatsapp'])
    ? mysqli_real_escape_string($conn, trim($data['whatsapp']))
    : '';

$password = isset($data['password'])
    ? trim($data['password'])
    : '';

if (
    empty($fullName) ||
    empty($email) ||
    empty($whatsapp) ||
    empty($password)
) {
    echo json_encode([
        "status" => "error",
        "message" => "Mohon lengkapi seluruh kolom."
    ]);
    exit();
}

$check_user = mysqli_query(
    $conn,
    "SELECT id_user FROM users
     WHERE email = '$email'
     OR username = '$fullName'"
);

if (mysqli_num_rows($check_user) > 0) {
    echo json_encode([
        "status" => "error",
        "message" => "Nama atau Email sudah terdaftar."
    ]);
    exit();
}

$hashed_password = password_hash(
    $password,
    PASSWORD_BCRYPT
);

$query_user = "
INSERT INTO users
(
    username,
    email,
    whatsapp,
    password
)
VALUES
(
    ?,
    ?,
    ?,
    ?
)
";

$stmt_user = mysqli_prepare(
    $conn,
    $query_user
);

if (!$stmt_user) {

    echo json_encode([
        "status" => "error",
        "message" => mysqli_error($conn)
    ]);

    exit();
}

mysqli_stmt_bind_param(
    $stmt_user,
    "ssss",
    $fullName,
    $email,
    $whatsapp,
    $hashed_password
);

if (mysqli_stmt_execute($stmt_user)) {

    echo json_encode([
        "status" => "success",
        "message" => "Registrasi Berhasil!"
    ]);

} else {

    echo json_encode([
        "status" => "error",
        "message" => "Gagal menyimpan akun: "
            . mysqli_stmt_error($stmt_user)
    ]);

}

mysqli_stmt_close($stmt_user);
mysqli_close($conn);
?>
