<?php
require 'koneksi.php';

$input = file_get_contents('php://input');
$data = json_decode($input, true);
$pesan = [];

if (isset($data['username']) && isset($data['password'])) {
    $username = mysqli_real_escape_string($con, trim($data['username']));
    $password = md5(trim($data['password']));
    
    $query = mysqli_query($con, "SELECT * FROM user WHERE username='$username' AND password='$password'");
    
    if ($query) {
        $jumlah = mysqli_num_rows($query);
        if ($jumlah != 0) {
            $value = mysqli_fetch_object($query);
            $pesan['username'] = $value->username;
            $pesan['token'] = time() . '_' . $value->password;
            $pesan['status_login'] = 'berhasil';
        } else {
            $pesan['status_login'] = 'gagal';
        }
    } else {
        $pesan['status_login'] = 'gagal';
        $pesan['error'] = mysqli_error($con);
    }
} else {
    $pesan['status_login'] = 'gagal';
    $pesan['error'] = 'Data tidak lengkap';
}

echo json_encode($pesan);
?>