<?php
require_once './config.php';

$tpc_dbs = 'tpc_dbs';
$cwp_dbs = 'tpc_cwp_dbs';
$tpc_prod_dbs = 'tpc_prod_dbs';
$conn = mysqli_connect($development['server'], $development['username'], $development['password'], $tpc_dbs);
$conn2 = mysqli_connect($development['server'], $development['username'], $development['password'], $tpc_prod_dbs);

$success = false;
if (!$conn || !$conn2) {
    $_SESSION['error'] = mysqli_connect_error();
} else {
    $success = true;
    return $success;
}
