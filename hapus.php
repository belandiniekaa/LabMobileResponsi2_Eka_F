<?php
require 'koneksi.php';

$id = $_GET['id'];
$query = mysqli_query($con, "DELETE FROM pahlawan WHERE id='$id'");

if ($query) {
    $response = ['status' => 'success', 'message' => 'Data berhasil dihapus'];
} else {
    $response = ['status' => 'error', 'message' => mysqli_error($con)];
}

echo json_encode($response);
?>