<?php
require 'koneksi.php';

$data = [];
$query = mysqli_query($con, "SELECT * FROM pahlawan WHERE nama IS NOT NULL AND kisah IS NOT NULL AND nama != '' AND kisah != '' ORDER BY id DESC");

while ($row = mysqli_fetch_object($query)) {
    $data[] = $row;
}

echo json_encode($data);
?>