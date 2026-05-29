<?php

/** @var mysqli $conn */ // Baris ini memberi tahu VS Code bahwa $conn adalah koneksi database
include 'config.php';

// ... sisa kodingan kamu
include 'config.php';

// Ambil data JSON dari React
$data = json_decode(file_get_contents("php://input"), true);

if ($data) {
    $user_id = $data['user_id'];
    $answers = $data['answers']; // Ini adalah objek answers dari React

    if (!empty($answers)) {
        $total_skor = 0;
        $jumlah_pertanyaan = count($answers);

        // Hitung total dari semua jawaban
        foreach ($answers as $nilai) {
            $total_skor += $nilai;
        }

        // Rumus Average (Rata-rata)
        $rerata = $total_skor / $jumlah_pertanyaan;

        // Simpan ke database (sesuaikan nama kolom dengan tabel assessment kamu)
        // Di sini saya simpan ke kolom skor_total sebagai contoh
        // Baris 25 di predict.php ubah menjadi:
        $query = "INSERT INTO assessment (user_id, skor_values, tanggal) 
          VALUES ('$user_id', '$rerata', NOW())";

        if (mysqli_query($conn, $query)) {
            echo json_encode([
                "status" => "success",
                "message" => "Skor rata-rata berhasil disimpan",
                "average_score" => round($rerata, 2)
            ]);
        } else {
            echo json_encode(["status" => "error", "message" => mysqli_error($conn)]);
        }
    } else {
        echo json_encode(["status" => "error", "message" => "Data jawaban kosong"]);
    }
}
