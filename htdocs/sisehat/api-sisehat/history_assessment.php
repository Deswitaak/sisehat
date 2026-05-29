<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");

/** @var \mysqli $conn */
include 'config.php';

if (!isset($_GET['id_user'])) {
    http_response_code(400);

    echo json_encode([
        "status" => "error",
        "message" => "Parameter id_user tidak ditemukan"
    ]);

    exit;
}

$id_user = intval($_GET['id_user']);

$query = "
SELECT
    total_score,
    status,
    ov_score,
    li_score,
    ir_score,
    ep_score,
    os_score,
    qw_score,
    tanggal_asesmen
FROM asesmen
WHERE id_user = $id_user
ORDER BY tanggal_asesmen DESC
";

$result = mysqli_query($conn, $query);

if (!$result) {

    echo json_encode([
        "status" => "error",
        "message" => mysqli_error($conn)
    ]);

    exit;
}

$history = [];

while ($row = mysqli_fetch_assoc($result)) {

    $factors = [];

    if (floatval($row['ov_score']) > 0) {
        $factors[] = [
            "name" => "OV",
            "score" => floatval($row['ov_score'])
        ];
    }

    if (floatval($row['li_score']) > 0) {
        $factors[] = [
            "name" => "LI",
            "score" => floatval($row['li_score'])
        ];
    }

    if (floatval($row['ir_score']) > 0) {
        $factors[] = [
            "name" => "IR",
            "score" => floatval($row['ir_score'])
        ];
    }

    if (floatval($row['ep_score']) > 0) {
        $factors[] = [
            "name" => "EP",
            "score" => floatval($row['ep_score'])
        ];
    }

    if (floatval($row['os_score']) > 0) {
        $factors[] = [
            "name" => "OS",
            "score" => floatval($row['os_score'])
        ];
    }

    if (floatval($row['qw_score']) > 0) {
        $factors[] = [
            "name" => "QW",
            "score" => floatval($row['qw_score'])
        ];
    }

    $history[] = [
        "total_score" => floatval($row['total_score']),
        "status" => $row['status'],
        "tanggal_asesmen" => $row['tanggal_asesmen'],
        "factors" => $factors
    ];
}

echo json_encode($history);

mysqli_close($conn);
?>