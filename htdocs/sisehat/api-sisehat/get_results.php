<?php

/** @var mysqli $conn */ // Baris ini memberi tahu VS Code bahwa $conn adalah koneksi database
include 'config.php';

// ... sisa kodingan kamu
include 'config.php';

// Ambil user_id dari parameter URL (GET)
$user_id = $_GET['user_id'];

if ($user_id) {
    // Ambil skor terbaru berdasarkan user_id
    $query = "SELECT * FROM assessment WHERE user_id = '$user_id' ORDER BY tanggal DESC LIMIT 1";
    $result = mysqli_query($conn, $query);

    if ($row = mysqli_fetch_assoc($result)) {
        echo json_encode([
            "status" => "success",
            "data" => $row
        ]);
    } else {
        echo json_encode(["status" => "error", "message" => "Belum ada data asesmen"]);
    }
}
