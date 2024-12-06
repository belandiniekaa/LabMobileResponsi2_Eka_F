<?php
require 'koneksi.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);

$id = trim($data['id']);
$nama = trim($data['nama']);
$kisah = trim($data['kisah']);

$query = mysqli_query($con, "UPDATE pahlawan SET nama='$nama', kisah='$kisah' WHERE id='$id'");

if ($query) {
    $response = ['status' => 'success', 'message' => 'Data berhasil diubah'];
} else {
    $response = ['status' => 'error', 'message' => mysqli_error($con)];
}

echo json_encode($response);
?>