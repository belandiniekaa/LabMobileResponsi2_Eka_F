<?php
require 'koneksi.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$nama = trim($data['nama']);
$kisah = trim($data['kisah']);

if (empty($nama) || empty($kisah)) {
    $response = ['status' => 'error', 'message' => 'Nama dan kisah tidak boleh kosong'];
    echo json_encode($response);
    exit;
}

$query = mysqli_query($con, "INSERT INTO pahlawan(nama,kisah) VALUES('$nama','$kisah')");

if ($query) {
    $response = ['status' => 'success', 'message' => 'Data berhasil ditambahkan'];
} else {
    $response = ['status' => 'error', 'message' => mysqli_error($con)];
}

echo json_encode($response);
?>