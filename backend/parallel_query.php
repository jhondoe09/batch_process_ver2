<?php
require './config.php';
$tpc_dbs = 'tpc_dbs';
$tpc_prod_dbs = 'tpc_prod_dbs';
$GLOBALS['tpc_dbs'] = mysqli_connect($development['server'], $development['username'], $development['password'], $tpc_dbs);
$GLOBALS['tpc_prod_dbs'] = mysqli_connect($development['server'], $development['username'], $development['password'], $tpc_prod_dbs);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

function handleGetBatchNumber($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $assignment_id = $postData['assignment_id'];
    $SubPid = $postData['SubPid'];
    $parts_number = $postData['parts_number'];
    $revision_number = $postData['revision_number'];
    $lot_number = $postData['lot_number'];
    $sql = "SELECT * FROM `batch_process_async_tbl` WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id'";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to get batch number from [batch_process_async_tbl] error=>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($res) > 0) {
            $data = array();
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
                $response = array(
                    'success' => true,
                    'data' => $data
                );
            }
            return $response;
            $conn->close();
        } else {
            $query = "INSERT INTO `batch_process_main_tbl`(`SubPid`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`) VALUES ('$SubPid', '$assignment_id', '$parts_number', '$revision_number', '$lot_number')";
            $result = mysqli_query($conn, $query);
            if (!$result) {
                $response = array(
                    'success' => false,
                    'message' => 'Unable to save data into [batch_process_main_tbl] error =>' . mysqli_error($conn)
                );
                return $response;
                $conn->close();
            } else {
                $execute = "SELECT * FROM `batch_process_main_tbl` WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id'";
                $exec = mysqli_query($conn, $execute);
                if (!$exec) {
                    $response = array(
                        'success' => false,
                        'message' => 'Unable to fetch data from batch_process_main_tbl error=>' . mysqli_error($conn)
                    );
                    return $response;
                    $conn->close();
                } else {
                    if (mysqli_num_rows($exec) > 0) {
                        $data = array();
                        while ($rows = mysqli_fetch_assoc($exec)) {
                            $data[] = $rows;
                            $response = array(
                                'success' => true,
                                'data' => $data
                            );
                        }
                        return $response;
                        $conn->close();
                    }
                }
            }
        }
    }
}

// function handleGetBatchNumber($postData)
// {
//     $conn = $GLOBALS['tpc_dbs'];
//     $assignment_id = $postData['assignment_id'];
//     $SubPid = $postData['SubPid'];
//     $parts_number = $postData['parts_number'];
//     $revision_number = $postData['revision_number'];
//     $lot_number = $postData['lot_number'];
//     $sql = "SELECT * FROM `batch_process_main_tbl` WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id'";
//     $res = mysqli_query($conn, $sql);
//     if (!$res) {
//         $response = array(
//             'succes' => false,
//             'message' => 'Unable to get batch_number from [batch_process_main_tbl] error =>' . mysqli_error($conn)
//         );
//         return $response;
//         $conn->close();
//     } else {
//         if (mysqli_num_rows($res) > 0) {
//             $data = array();
//             while ($row = mysqli_fetch_assoc($res)) {
//                 $response = array(
//                     'success' => true,
//                     'data' => $data
//                 );
//             }
//             return $response;
//             $conn->close();
//         } else {
//             $sql = "SELECT * FROM `batch_process_async_tbl` WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id'";
//             $res = mysqli_query($conn, $sql);
//             if (!$res) {
//                 $response = array(
//                     'success' => false,
//                     'message' => 'Unable to get batch number from [batch_process_async_tbl] error=>' . mysqli_error($conn)
//                 );
//                 return $response;
//                 $conn->close();
//             } else {
//                 if (mysqli_num_rows($res) > 0) {
//                     $data = array();
//                     while ($row = mysqli_fetch_assoc($res)) {
//                         $data[] = $row;
//                         $response = array(
//                             'success' => true,
//                             'data' => $data
//                         );
//                     }
//                     return $response;
//                     $conn->close();
//                 } else {
//                     $query = "INSERT INTO `batch_process_main_tbl`(`SubPid`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`) VALUES ('$SubPid', '$assignment_id', '$parts_number', '$revision_number', '$lot_number')";
//                     $result = mysqli_query($conn, $query);
//                     if (!$result) {
//                         $response = array(
//                             'success' => false,
//                             'message' => 'Unable to save data into [batch_process_main_tbl] error =>' . mysqli_error($conn)
//                         );
//                         return $response;
//                         $conn->close();
//                     } else {
//                         $execute = "SELECT * FROM `batch_process_main_tbl` WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id'";
//                         $exec = mysqli_query($conn, $execute);
//                         if (!$exec) {
//                             $response = array(
//                                 'success' => false,
//                                 'message' => 'Unable to fetch data from batch_process_main_tbl error=>' . mysqli_error($conn)
//                             );
//                             return $response;
//                             $conn->close();
//                         } else {
//                             if (mysqli_num_rows($exec) > 0) {
//                                 $data = array();
//                                 while ($rows = mysqli_fetch_assoc($exec)) {
//                                     $data[] = $rows;
//                                     $response = array(
//                                         'success' => true,
//                                         'data' => $data
//                                     );
//                                 }
//                                 return $response;
//                                 $conn->close();
//                             }
//                         }
//                     }
//                 }
//             }
//         }
//     }
// }

function handleGetMain($postData)
{
    $conn = $GLOBALS['tpc_prod_dbs'];
    $SubPid = $postData['sub_pid'];
    $assignment_id = $postData['assign_id'];
    $sql = "SELECT t1.*, t2.SubPname FROM `tpc_main_tbl` t1 LEFT JOIN tpc_dbs.`setup_sub_process_tbl` t2 ON t2.SubPid = t1.SubPid AND t2.section_id = t1.section_id WHERE t1.assignment_id = '$assignment_id' AND t1.SubPid = '$SubPid'";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to get main data error =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($res) > 0) {
            $data = array();
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
                $response = array(
                    'success' => true,
                    'data' => $data
                );
            }
            return $response;
            $conn->close();
        }
    }
}

function handleGetData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $SubPid = $postData['sub_pid'];
    $assignment_id = $postData['assign_id'];
    $batch_number = $postData['batch_number'];
    $sql = "SELECT * FROM `batch_process_async_tbl` WHERE `batch_number` = '$batch_number' AND `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id' ORDER BY `line_number` ASC LIMIT 1";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to get data from batch_process_async_tbl error=>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($res) > 0) {
            while ($row = mysqli_fetch_assoc($res)) {
                $batch_number = $row['batch_number'];
                $SubPid = $row['SubPid'];
                $assignment_id = $row['assignment_id'];
                $line_number = $row['line_number'];
                if ($line_number > 1) {
                    $query = "SELECT * FROM `batch_process_async_tbl` WHERE `batch_number` = '$batch_number' AND `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id' ORDER BY `line_number` ASC";
                    $exec = mysqli_query($conn, $query);
                    if (!$exec) {
                        $response = array(
                            'success' => false,
                            'message' => 'Unable to get data from batch_process_async_tbl error=>' . mysqli_error($conn)
                        );
                        return $response;
                        $conn->close();
                    } else {
                        if (mysqli_num_rows($exec) > 0) {
                            $data = array();
                            while ($rows = mysqli_fetch_assoc($exec)) {
                                $data[] = $rows;
                                $response = array(
                                    'success' => true,
                                    'data' => $data
                                );
                            }
                            return $response;
                            $conn->close();
                        }
                    }
                } else {
                    $query2 = "SELECT * FROM `batch_process_async_tbl` WHERE `batch_number` = '$batch_number' AND `SubPid` = '$SubPid' ORDER BY `line_number` ASC";
                    $exec2 = mysqli_query($conn, $query2);
                    if (!$exec2) {
                        $response = array(
                            'success' => false,
                            'message' => 'Unable to get data from batch_process_async_tbl error=>' . mysqli_error($conn)
                        );
                        return $response;
                        $conn->close();
                    } else {
                        if (mysqli_num_rows($exec2) > 0) {
                            $data2 = array();
                            while ($rows = mysqli_fetch_assoc($exec2)) {
                                $data2[] = $rows;
                                $response = array(
                                    'success' => true,
                                    'data' => $data2
                                );
                            }
                            return $response;
                            $conn->close();
                        }
                    }
                }
            }
        } else {
            $sql = "SELECT * FROM `form_assignment_tbl` WHERE `assignment_id` = '$assignment_id'";
            $res = mysqli_query($conn, $sql);
            if (!$res) {
                $response = array(
                    'success' => false,
                    'message' => 'Unable to get data error=>' . mysqli_error($conn)
                );
                return $response;
                $conn->close();
            } else {
                if (mysqli_num_rows($res) > 0) {
                    $data = array();
                    while ($row = mysqli_fetch_assoc($res)) {
                        $data[] = $row;
                        $response = array(
                            'success' => true,
                            'data' => $data
                        );
                    }
                    return $response;
                    $conn->close();
                }
            }
        }
    }
}

function handleSaveBatchData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (isset($postData)) {
        foreach ($postData as $key => $value) {
            $index = substr($key, strlen('line_number_'));
            $line_number = isset($_POST["line_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["line_number_" . $index]) : NULL;
            $parts_number = isset($_POST["parts_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["parts_number_" . $index]) : NULL;
            $revision_number = isset($_POST["revision_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["revision_number_" . $index]) : NULL;
            $lot_number = isset($_POST["lot_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["lot_number_" . $index]) : NULL;
            $wafer_no_from = isset($_POST["wafer_no_from_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_from_" . $index]) : NULL;
            $wafer_no_to = isset($_POST["wafer_no_to_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_to_" . $index]) : NULL;
            // $wafer_number = isset($_POST["wafer_number_" .$index]) ? mysqli_real_escape_string($conn, $_POST["wafer_number_" .$index]) : NULL;
            $total_qty = isset($_POST["total_qty_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_qty_" . $index]) : NULL;
            // $allocated_qty = isset($_POST["allocated_qty_" .$index]) ? mysqli_real_escape_string($conn, $_POST["allocated_qty_" .$index]) : NULL;
            // $unallocated_qty = isset($_POST["unallocated_qty_" .$index]) ? mysqli_real_escape_string($conn, $_POST["unallocated_qty_" .$index]) : NULL;
            // $total_sampling_in = isset($_POST["total_sampling_in_" .$index]) ? mysqli_real_escape_string($conn, $_POST["total_sampling_in_" .$index]) : NULL;
            // $total_sampling_out = isset($_POST["total_sampling_out_" .$index]) ? mysqli_real_escape_string($conn, $_POST["total_sampling_out_" .$index]) : NULL;
            // $operator_id_no = isset($_POST["operator_id_no_" .$index]) ? mysqli_real_escape_string($conn, $_POST["operator_id_no_" .$index]) : NULL;
            $sub_pid = isset($_POST["sub_pid"]) ? mysqli_real_escape_string($conn, $_POST["sub_pid"]) : NULL;
            $assignment_id = isset($_POST["assignment_id"]) ? mysqli_real_escape_string($conn, $_POST["assignment_id"]) : NULL;
            $batch_number = isset($_POST["batch_number"]) ? mysqli_real_escape_string($conn, $_POST["batch_number"]) : NULL;
            // $batch_number = isset($_POST["batch_number_"]) ? mysqli_real_escape_string($conn, $_POST["time_end"]) : NULL;
            // $total_time = isset($_POST["total_time"]) ? mysqli_real_escape_string($conn, $_POST["total_time"]) : NULL;
            $sql = "SELECT * FROM `batch_process_async_tbl` WHERE `batch_number` = '$batch_number' AND `SubPid` = '$sub_pid' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `line_number` = '$line_number' ";
            $res = mysqli_query($conn, $sql);
            if (!$res) {
                $response = array(
                    'success' => false,
                    'message' => 'Unable to get data from [batch_process_async_tbl] error=>' . mysqli_error($conn)
                );
                return $response;
                $conn->close();
            } else {
                if (mysqli_num_rows($res) > 0) {
                    while (mysqli_fetch_assoc($res)) {
                        $response = array(
                            'success' => true,
                            'message' => 'Data already existed in [batch_process_async_tbl]'
                        );
                    }
                    return $response;
                    $conn->close();
                } else {
                    $exec = "INSERT INTO `batch_process_line_tbl`(`SubPid`, `batch_number`, `line_number`, `parts_number`, `revision_number`, `lot_number`, `wafer_number_from`, `wafer_number_to`, `quantity_in`) VALUES ('$sub_pid', '$batch_number', '$line_number', '$parts_number', '$revision_number', '$lot_number', '$wafer_no_from', '$wafer_no_to', '$total_qty')";
                    $result = mysqli_query($conn, $exec);
                    if (!$result) {
                        $response = array(
                            'success' => false,
                            'message' => 'Unable to save [batch_process_line_tbl] data error=>' . mysqli_error($conn)
                        );
                        return $response;
                        $conn->close();
                    } else {
                        // $response = array(
                        //     'success' => true,
                        //     'message' => 'Batch data has been successfully saved INTO [batch_process_line_tbl]'
                        // );
                        // return $response;
                        // $conn->close();
                        $sql = "INSERT INTO `batch_process_async_tbl`(`batch_number`, `SubPid`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`, `wafer_number_from`, `wafer_number_to`, `total_quantity`, `batch_status`, `line_number`) VALUES ('$batch_number', '$sub_pid', '$assignment_id', '$parts_number', '$revision_number', '$lot_number', '$wafer_no_from', '$wafer_no_to', '$total_qty', 'Started',  '$line_number')";
                        $res = mysqli_query($conn, $sql);
                        if (!$res) {
                            $response = array(
                                'success' => false,
                                'message' => 'Unable to save [batch_process_async_tbl] data error=>' . mysqli_error($conn)
                            );
                            return $response;
                            $conn->close();
                        } else {
                            $response = array(
                                'success' => true,
                                'message' => 'Batch data has been successfully saved INTO [batch_process_async_tbl]'
                            );
                            return $response;
                            $conn->close();
                        }
                    }
                }
            }
        }
    }
}

function handleGetBatchData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $batch_number = $postData['batch_number'];
    $SubPid = $postData['SubPid'];
    // $assignment_id = $postData['assignment_id'];
    $operator_number = $postData['operator_number'];
    $sql = "SELECT * FROM `batch_process_async_tbl` WHERE `batch_number` = '$batch_number' AND `SubPid` = '$SubPid' ORDER BY `lot_number`, `line_number`";
    $result = mysqli_query($conn, $sql);
    if (!$result) {
        $response = array(
            'success' => false,
            'message' => 'Unable to get batch data from [batch_process_async_tbl]'
        );
        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($result) > 0) {
            $data = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $line_number = $row['line_number'];
                $lot_number = $row['lot_number'];
                $parts_number = $row['parts_number'];
                $revision_number = $row['revision_number'];
                $total_qty = $row['total_quantity'];
                $wafer_no_from = $row['wafer_number_from'];
                $wafer_no_to = $row['wafer_number_to'];
                $assignment_id = $row['assignment_id'];
                $query = "INSERT INTO `batch_process_operator_tbl`(`SubPid`, `batch_number`, `operator_number`, `line_number`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`, `wafer_number_from`, `wafer_number_to`, `quantity_in`) VALUES ('$SubPid', '$batch_number', '$operator_number', '$line_number', '$assignment_id', '$parts_number', '$revision_number', '$lot_number', '$wafer_no_from', '$wafer_no_to', '$total_qty')";
                $res = mysqli_query($conn, $query);
                if (!$res) {
                    $response = array(
                        'success' => false,
                        'message' => 'Data insertion is unsuccessful! error =>' . mysqli_error($conn)
                    );
                } else {
                    $response = array(
                        'success' => true,
                        'message' => 'Data has been successfully saved!'
                    );
                }
                $data[] = $row;
                $response = array(
                    'success' => true,
                    'data' => $data
                );
            }
            return $response;
            $conn->close();
        } else {
            $response = array(
                'success' => false,
                'message' => 'No data found!'
            );
            return $response;
            $conn->close();
        }
    }
}

function handleGetTableData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    // $assignment_id = $postData['assignment_id'];
    $batch_number = $postData['batch_number'];
    $sub_pid = $postData['SubPid'];
    $query = "SELECT DISTINCT * FROM `batch_process_operator_tbl` WHERE `batch_operator_id` IN 
    (SELECT `batch_operator_id` 
      FROM `batch_process_operator_tbl`
      WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number'
      GROUP BY `operator_number`
      HAVING COUNT(*) > 0) ORDER BY `operator_number` ASC";
    $res = mysqli_query($conn, $query);
    if (!$res) {
        $response = array(
            'success' => false,
            'message'  => mysqli_error($conn)
        );

        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($res) > 0) {
            $data = array();
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
                $response = array(
                    'success' => true,
                    'data' => $data
                );
            }
            return $response;
            $conn->close();
        } else {
            $response = array(
                'success' => false,
                'message' => 'No data found in [batch_process_operator_tbl]'
            );
            return $response;
            $conn->close();
        }
    }
}

function handleGetSecondTableData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $SubPid = $postData['SubPid'];
    $batch_number = $postData['batch_number'];
    $assignment_id = $postData['assignment_id'];
    $operator_number = $postData['operator_number'];
    $sql = "SELECT * FROM `batch_process_operator_tbl` WHERE `SubPid` = '$SubPid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' AND `assignment_id` = '$assignment_id' ORDER BY `line_number` ASC";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to get second table data from [batch_process_operator_tbl]'
        );
        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($res) > 0) {
            while ($row = mysqli_fetch_assoc($res)) {
                $assignment_id = $row['assignment_id'];
                $line_number = $row['line_number'];
                $batch_number = $row['batch_number'];
                $SubPid = $row['SubPid'];
                if ($line_number > 1) {
                    $query = "SELECT * FROM `batch_process_operator_tbl` WHERE `SubPid` = '$SubPid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' AND `assignment_id` = '$assignment_id' ORDER BY `line_number` ASC";
                    $result = mysqli_query($conn, $query);
                    if (!$result) {
                        $response = array(
                            'success' => false,
                            'message' => 'Unable to get batch_process_operator_tbl data error =>' . mysqli_error($conn)
                        );
                        return $response;
                        $conn->close();
                    } else {
                        if (mysqli_num_rows($result) > 0) {
                            $data = array();
                            while ($rows = mysqli_fetch_assoc($result)) {
                                $data[] = $rows;
                                $response = array(
                                    'success' => true,
                                    'data' => $data
                                );
                            }
                            return $response;
                            $conn->close();
                        }
                    }
                } else {
                    $query = "SELECT * FROM `batch_process_operator_tbl` WHERE `SubPid` = '$SubPid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' ORDER BY `line_number` ASC";
                    $result = mysqli_query($conn, $query);
                    if (!$result) {
                        $response = array(
                            'success' => false,
                            'message' => 'Unable to get batch_process_operator_tbl data error =>' . mysqli_error($conn)
                        );
                        return $response;
                        $conn->close();
                    } else {
                        if (mysqli_num_rows($result) > 0) {
                            $data = array();
                            while ($rows = mysqli_fetch_assoc($result)) {
                                $data[] = $rows;
                                $response = array(
                                    'success' => true,
                                    'data' => $data
                                );
                            }
                            return $response;
                            $conn->close();
                        }
                    }
                }
            }
        }
    }
}


function handleSaveBatchOperatorData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];

    if (isset($postData)) {
        foreach ($postData as $key => $value) {
            $index = substr($key, strlen('line_number_'));
            $line_number = isset($_POST["line_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["line_number_" . $index]) : NULL;
            $parts_number = isset($_POST["parts_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["parts_number_" . $index]) : NULL;
            $revision_number = isset($_POST["revision_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["revision_number_" . $index]) : NULL;
            $lot_number = isset($_POST["lot_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["lot_number_" . $index]) : NULL;
            // $wafer_number = isset($_POST["wafer_number_" .$index]) ? mysqli_real_escape_string($conn, $_POST["wafer_number_" .$index]) : NULL;
            $wafer_no_from = isset($_POST["wafer_no_from_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_from_" . $index]) : NULL;
            $wafer_no_to = isset($_POST["wafer_no_to_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_to_" . $index]) : NULL;
            $qty_in = isset($_POST["qty_in_" . $index]) ? mysqli_real_escape_string($conn, $_POST["qty_in_" . $index]) : NULL;
            // $ng_count = isset($_POST["ng_count_" .$index]) ? mysqli_real_escape_string($conn, $_POST["ng_count_" .$index]) : NULL;
            // $qty_out = isset($_POST["qty_out_" .$index]) ? mysqli_real_escape_string($conn, $_POST["qty_out_" .$index]) : NULL;
            $sampling_in = isset($_POST["sampling_in_" . $index]) ? mysqli_real_escape_string($conn, $_POST["sampling_in_" . $index]) : NULL;
            // $sampling_out = isset($_POST["sampling_out_" .$index]) ? mysqli_real_escape_string($conn, $_POST["sampling_out_" .$index]) : NULL;
            // $unfinished_qty = isset($_POST["unfinished_qty_" .$index]) ? mysqli_real_escape_string($conn, $_POST["unfinished_qty_" .$index]) : NULL;
            $operator_number = isset($_POST["operator_number"]) ? mysqli_real_escape_string($conn, $_POST["operator_number"]) : NULL;
            $batch_number = isset($_POST["batch_number"]) ? mysqli_real_escape_string($conn, $_POST["batch_number"]) : NULL;
            $sub_pid = isset($_POST["sub_pid"]) ? mysqli_real_escape_string($conn, $_POST["sub_pid"]) : NULL;
            $id_number = isset($_POST["id_number"]) ? mysqli_real_escape_string($conn, $_POST["id_number"]) : NULL;
            $time_start = isset($_POST["time_start"]) ? mysqli_real_escape_string($conn, $_POST["time_start"]) : NULL;
            $total_batch_processed = isset($_POST["total_batch_processed"]) ? mysqli_real_escape_string($conn, $_POST["total_batch_processed"]) : NULL;
            $assignment_id = isset($_POST["assignment_id"]) ? mysqli_real_escape_string($conn, $_POST["assignment_id"]) : NULL;
            $operator_status = isset($_POST["operator_status"]) ? mysqli_real_escape_string($conn, $_POST["operator_status"]) : NULL;
            $sql = "SELECT * FROM `batch_process_operator_tbl` WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `line_number` = '$line_number' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
            $res = mysqli_query($conn, $sql);
            if (!$res) {
                $response = array(
                    'success' => false,
                    'message' => 'No data found in `batch_process_operator_tbl` error => ' . mysqli_error($conn)
                );
                return $response;
                $conn->close();
            } else {
                if (mysqli_num_rows($res) > 0) {
                    while ($row = mysqli_fetch_assoc($res)) {
                        $update = "UPDATE `batch_process_operator_tbl` SET `id_number` = '$id_number', `operator_name` = '$id_number', `operator_number` = '$operator_number', `time_start` = '$time_start', `total_batch_processed` = '$total_batch_processed', `wafer_number_from` = '$wafer_no_from', `wafer_number_to` = '$wafer_no_to', `quantity_in` = '$qty_in', `sampling_in` = '$sampling_in', `operator_status` = '$operator_status' WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `line_number` = '$line_number' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `operator_number` = '$operator_number'";
                        $execute = mysqli_query($conn, $update);
                        if (!$execute) {
                            $response = array(
                                'success' => false,
                                'message' => 'Unable to execute UPDATE [batch_operator_tbl] error=> ' . mysqli_error($conn)
                            );
                            return $response;
                            $conn->close();
                        } else {
                            $response = array(
                                'success' => true,
                                'message' => 'Updating data from [batch_process_operator_tbl] is successful!'
                            );
                            return $response;
                            $conn->close();
                        }
                    }
                } else {
                    $query = "INSERT INTO `batch_process_operator_tbl`(`SubPid`,`batch_number`,`operator_number`,`id_number`, `operator_name`, `time_start`, `total_batch_processed`, `line_number`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`, `wafer_number_from`, `wafer_number_to`, `quantity_in`, `sampling_in`, `operator_status`) 
                    VALUES 
                    ('$sub_pid','$batch_number', '$operator_number', '$id_number', '$id_number', '$time_start', '$total_batch_processed', '$line_number', '$assignment_id', '$parts_number', '$revision_number', '$lot_number', '$wafer_no_from', '$wafer_no_to', '$qty_in', '$sampling_in', '$operator_status')";
                    $exec = mysqli_query($conn, $query);
                    if (!$exec) {
                        $response = array(
                            'success' => false,
                            'message' => 'Inserting data into [batch_operator_tbl] has failed error=> ' . mysqli_error($conn)
                        );
                        return $response;
                        $conn->close();
                    } else {
                        $response = array(
                            'success' => true,
                            'message' => 'Inserting data into [batch_operator_tbl] is SUCCESSFUL!'
                        );
                        return $response;
                        $conn->close();
                    }
                }
            }
        }
    }
}


function handleSaveProcess($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (isset($postData)) {
        foreach ($postData as $key => $value) {
            $index = substr($key, strlen('line_number_'));
            $line_number = isset($_POST["line_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["line_number_" . $index]) : NULL;
            $parts_number = isset($_POST["parts_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["parts_number_" . $index]) : NULL;
            $revision_number = isset($_POST["revision_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["revision_number_" . $index]) : NULL;
            $lot_number = isset($_POST["lot_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["lot_number_" . $index]) : NULL;
            $wafer_number = isset($_POST["wafer_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_number_" . $index]) : NULL;
            // $wafer_no_to = isset($_POST["wafer_no_to_" .$index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_to_" .$index]) : NULL;
            // $qty_in = isset($_POST["qty_in_" .$index]) ? mysqli_real_escape_string($conn, $_POST["qty_in_" .$index]) : NULL;
            // $ng_count = isset($_POST["ng_count_" .$index]) ? mysqli_real_escape_string($conn, $_POST["ng_count_" .$index]) : NULL;
            // $qty_out = isset($_POST["qty_out_" .$index]) ? mysqli_real_escape_string($conn, $_POST["qty_out_" .$index]) : NULL;
            // $sampling_in = isset($_POST["sampling_in_" .$index]) ? mysqli_real_escape_string($conn, $_POST["sampling_in_" .$index]) : NULL;
            // $sampling_out = isset($_POST["sampling_out_" .$index]) ? mysqli_real_escape_string($conn, $_POST["sampling_out_" .$index]) : NULL;
            // $unfinished_qty = isset($_POST["unfinished_qty_" .$index]) ? mysqli_real_escape_string($conn, $_POST["unfinished_qty_" .$index]) : NULL;
            $operator_number = isset($_POST["operator_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["operator_number_" . $index]) : NULL;
            $batch_number = isset($_POST["batch_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["batch_number_" . $index]) : NULL;
            $sub_pid = isset($_POST["sub_pid_" . $index]) ? mysqli_real_escape_string($conn, $_POST["sub_pid_" . $index]) : NULL;
            $id_number = isset($_POST["id_number"]) ? mysqli_real_escape_string($conn, $_POST["id_number"]) : NULL;
            $accordion_count = isset($_POST["accordion_count"]) ? mysqli_real_escape_string($conn, $_POST["accordion_count"]) : NULL;
            $sql = "INSERT INTO `batch_process_wafer_tbl`(`SubPid`, `batch_number`, `line_number`, `parts_number`, `revision_number`, `lot_number`, `wafer_number`,`operator_number`) 
            VALUES 
            ('$sub_pid','$batch_number','$line_number', '$parts_number', '$revision_number', '$lot_number', '$wafer_number', '$operator_number')";
            $res = mysqli_query($conn, $sql);
            if (!$res) {
                $response = array(
                    'success' => false,
                    'message' => mysqli_error($conn)
                );
            } else {
                $response = array(
                    'success' => true,
                    'message' => 'Inserting Data FROM [batch_process_wafer_tbl] is successful!'
                );
            }
            return $response;
            $conn->close();
            // if($accordion_count > 1)
            // {
            //     $sql = "SELECT * FROM `batch_process_wafer_tbl` WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' ORDER BY `line_number`, `wafer_number`";
            //     $result = mysqli_query($conn, $sql);
            //     if(!$result)
            //     {
            //         $response = array(
            //             'success' => false,
            //             'message' => 'Unable to get [batch_process_wafer_tbl] data error: =>' .mysqli_error($conn)
            //         );
            //         return $response;
            //         $conn->close();
            //     }
            //     else
            //     {
            //         if(mysqli_num_rows($result) > 0)
            //         {
            //             $data = array();
            //             while($row = mysqli_fetch_assoc($result))
            //             {                            
            //                 $data[] = $row;
            //                 $response = array(
            //                     'success' => true,
            //                     'message' => mysqli_error($conn),
            //                     'data' => $data
            //                 );
            //             }
            //         }
            //     }
            // }
            // else
            // {
            // }    
        }
    }
}


// function handleGetThirdTableData($postData)
// {
//     $conn = $GLOBALS['tpc_dbs'];
//     $sub_pid = $postData['SubPid'];
//     $batch_number = $postData['batch_number'];
//     // $operator_number = $postData['operator_number'];
//     // $line_number = $postData['line_number'];
//     $parts_number = $postData['parts_number'];
//     $revision_number = $postData['revision_number'];
//     $lot_number = $postData['lot_number'];
//     // $sql = "SELECT * FROM `batch_process_wafer_tbl` WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' ORDER BY `line_number`, `wafer_number`";
//     $sql = "SELECT * FROM `batch_process_wafer_tbl` WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' ORDER BY `line_number`, `wafer_number`";
//     $res = mysqli_query($conn, $sql);
//     if (!$res) {
//         $response = array(
//             'success' => false,
//             'message' => mysqli_error($conn)
//         );
//         return $response;
//         $conn->close();
//     } else {
//         if (mysqli_num_rows($res) > 0) {
//             $data = array();
//             while ($row = mysqli_fetch_assoc($res)) {
//                 $SubPid = $row['SubPid'];
//                 $batch_number = $row['batch_number'];
//                 $parts_number = $row['parts_number'];
//                 $revision_number = $row['revision_number'];
//                 $lot_number = $row['lot_number'];
//                 $line_number = $row['line_number'];
//                 $operator_number = $row['operator_number'];
//                 if ($line_number > 1) {
//                     $query = "SELECT * FROM `batch_process_wafer_tbl` WHERE `SubPid` = '$SubPid' AND `batch_number` = '$batch_number' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' ORDER BY `line_number`, `wafer_number`";
//                     $result = mysqli_query($conn, $query);
//                     if (!$result) {
//                         $response = array(
//                             'success' => false,
//                             'message' => 'Unable to get batch_process_wafer_tbl data error =>'
//                         );
//                         return $response;
//                         $conn->close();
//                     } else {
//                         if (mysqli_num_rows($result) > 0) {
//                             $data = array();
//                             while ($rows = mysqli_fetch_assoc($result)) {
//                                 $data[] = $rows;
//                                 $response = array(
//                                     'success' => true,
//                                     'data' => $data,
//                                     'single data' => $line_number
//                                 );
//                             }
//                             return $response;
//                             $conn->close();
//                         }
//                     }
//                 } else {
//                     $query = "SELECT * FROM `batch_process_wafer_tbl` WHERE `SubPid` = '$SubPid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' ORDER BY `line_number`, `wafer_number`";
//                     $result = mysqli_query($conn, $query);
//                     if (!$result) {
//                         $response = array(
//                             'success' => false,
//                             'message' => 'Unable to get batch_process_wafer_tbl data error =>'
//                         );
//                         return $response;
//                         $conn->close();
//                     } else {
//                         if (mysqli_num_rows($result) > 0) {
//                             $data = array();
//                             while ($rows = mysqli_fetch_assoc($result)) {
//                                 $data[] = $rows;
//                                 $response = array(
//                                     'success' => true,
//                                     'data' => $data,
//                                     'multiple data' => $line_number
//                                 );
//                             }
//                             return $response;
//                             $conn->close();
//                         }
//                     }
//                 }
//             }
//         } else {
//             $response = array(
//                 'success' => false,
//                 'message' => 'No data found!'
//             );
//             return $response;
//             $conn->close();
//         }
//     }
// }

function handleGetThirdTableData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $sub_pid = $postData['SubPid'];
    $batch_number = $postData['batch_number'];
    $operator_number = $postData['operator_number'];
    $line_number = $postData['line_number'];
    $parts_number = $postData['parts_number'];
    $revision_number = $postData['revision_number'];
    $lot_number = $postData['lot_number'];
    // $sql = "SELECT * FROM `batch_process_wafer_tbl` WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' ORDER BY `line_number`, `wafer_number`";
    $sql = "SELECT * FROM `batch_process_wafer_tbl` WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `line_number` = '$line_number' AND `operator_number` = '$operator_number' ORDER BY `line_number`, `wafer_number` ASC";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($res) > 0) {
            $data = array();
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
                $response = array(
                    'success' => true,
                    'data' => $data
                );
            }
            return $response;
            $conn->close();
        } else {
            $response = array(
                'success' => false,
                'message' => 'No data found!'
            );
            return $response;
            $conn->close();
        }
    }
}

function handleGetNGdata($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $SubPid = $postData['SubPid'];
    $sql = "SELECT * FROM `ng_reason_tbl` WHERE `SubPid` = '$SubPid'";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to get NG Reason =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($res) > 0) {
            $data = array();
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
            }
            return $data;
            $conn->close();
        } else {
            $data[] = 0;
            return $data;
            $conn->close();
        }
    }
}

function handleSaveSecondTableData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (isset($postData)) {
        foreach ($postData as $key => $value) {
            $index = substr($key, strlen('line_number_'));
            $line_number = isset($_POST["line_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["line_number_" . $index]) : NULL;
            $parts_number = isset($_POST["parts_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["parts_number_" . $index]) : NULL;
            $revision_number = isset($_POST["revision_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["revision_number_" . $index]) : NULL;
            $lot_number = isset($_POST["lot_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["lot_number_" . $index]) : NULL;
            // $wafer_no_from = isset($_POST["wafer_no_from_" .$index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_from_" .$index]) : NULL;
            // $wafer_no_to = isset($_POST["wafer_no_to_" .$index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_to_" .$index]) : NULL;
            $qty_in = isset($_POST["qty_in_" . $index]) ? mysqli_real_escape_string($conn, $_POST["qty_in_" . $index]) : NULL;
            $ng_count = isset($_POST["ng_count_" . $index]) ? mysqli_real_escape_string($conn, $_POST["ng_count_" . $index]) : NULL;
            $qty_out = isset($_POST["qty_out_" . $index]) ? mysqli_real_escape_string($conn, $_POST["qty_out_" . $index]) : NULL;
            $sampling_in = isset($_POST["sampling_in_" . $index]) ? mysqli_real_escape_string($conn, $_POST["sampling_in_" . $index]) : NULL;
            $sampling_out = isset($_POST["sampling_out_" . $index]) ? mysqli_real_escape_string($conn, $_POST["sampling_out_" . $index]) : NULL;
            $unfinished_qty = isset($_POST["unfinished_qty_" . $index]) ? mysqli_real_escape_string($conn, $_POST["unfinished_qty_" . $index]) : NULL;
            $sub_pid = isset($_POST["sub_pid"]) ? mysqli_real_escape_string($conn, $_POST["sub_pid"]) : NULL;
            $operator_number = isset($_POST["operator_number"]) ? mysqli_real_escape_string($conn, $_POST["operator_number"]) : NULL;
            $batch_number = isset($_POST["batch_number"]) ? mysqli_real_escape_string($conn, $_POST["batch_number"]) : NULL;
            // $time_end = isset($_POST["time_end"]) ? mysqli_real_escape_string($conn, $_POST["time_end"]) : NULL;
            // $total_time = isset($_POST["total_time"]) ? mysqli_real_escape_string($conn, $_POST["total_time"]) : NULL;
            $assignment_id = isset($_POST["assignment_id"]) ? mysqli_real_escape_string($conn, $_POST["assignment_id"]) : NULL;
            $operator_status = isset($_POST["operator_status"]) ? mysqli_real_escape_string($conn, $_POST["operator_status"]) : NULL;

            // $sql = "UPDATE `batch_process_operator_tbl` SET `time_end` = '$time_end', `total_time` = '$total_time', `quantity_ng` = '$ng_count', `quantity_out` = '$qty_out', `sampling_out` = '$sampling_out', `quantity_unfinished` = '$unfinished_qty', `allocated_minutes` = '$total_time', `operator_status` = '$operator_status' WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
            $sql = "UPDATE `batch_process_operator_tbl` SET `quantity_in` = '$qty_in', `quantity_ng` = '$ng_count', `quantity_out` = '$qty_out', `sampling_in` = '$sampling_in', `sampling_out` = '$sampling_out', `quantity_unfinished` = '$unfinished_qty', `operator_status` = '$operator_status' WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `line_number` = '$line_number'";
            $res = mysqli_query($conn, $sql);
            if (!$res) {
                $response = array(
                    'success' => false,
                    'message' => 'Unable to Save Data INTO [batch_process_operator_tbl] =>' . mysqli_error($conn)
                );
                return $response;
                $conn->close();
            } else {
                $response = array(
                    'success' => true,
                    'message' => 'Saving Data INTO [batch_process_operator_tbl] is successful!'
                );
                return $response;
                $conn->close();
            }
        }
    }
}

function handleSaveThirdTableData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (isset($postData)) {
        foreach ($postData as $key => $value) {
            $index = substr($key, strlen('line_number_'));
            $line_number = isset($_POST["line_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["line_number_" . $index]) : NULL;
            $parts_number = isset($_POST["parts_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["parts_number_" . $index]) : NULL;
            $revision_number = isset($_POST["revision_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["revision_number_" . $index]) : NULL;
            $lot_number = isset($_POST["lot_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["lot_number_" . $index]) : NULL;
            // $wafer_no_from = isset($_POST["wafer_no_from_" .$index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_from_" .$index]) : NULL;
            // $wafer_no_to = isset($_POST["wafer_no_to_" .$index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_to_" .$index]) : NULL;
            $wafer_number = isset($_POST["wafer_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_number_" . $index]) : NULL;
            $qty_in = isset($_POST["qty_in_" . $index]) ? mysqli_real_escape_string($conn, $_POST["qty_in_" . $index]) : NULL;
            $qty_ng = isset($_POST["qty_ng_" . $index]) ? mysqli_real_escape_string($conn, $_POST["qty_ng_" . $index]) : NULL;
            $good_qty = isset($_POST["good_qty_" . $index]) ? mysqli_real_escape_string($conn, $_POST["good_qty_" . $index]) : NULL;
            $ng_reason = isset($_POST["ng_reason_" . $index]) ? mysqli_real_escape_string($conn, $_POST["ng_reason_" . $index]) : NULL;
            $remarks = isset($_POST["remarks_" . $index]) ? mysqli_real_escape_string($conn, $_POST["remarks_" . $index]) : NULL;
            $operator_id_no = isset($_POST["operator_id_no_" . $index]) ? mysqli_real_escape_string($conn, $_POST["operator_id_no_" . $index]) : NULL;
            $sub_pid = isset($_POST["sub_pid"]) ? mysqli_real_escape_string($conn, $_POST["sub_pid"]) : NULL;
            $operator_number = isset($_POST["operator_number"]) ? mysqli_real_escape_string($conn, $_POST["operator_number"]) : NULL;
            $batch_number = isset($_POST["batch_number"]) ? mysqli_real_escape_string($conn, $_POST["batch_number"]) : NULL;
            // $time_end = isset($_POST["time_end"]) ? mysqli_real_escape_string($conn, $_POST["time_end"]) : NULL;
            // $total_time = isset($_POST["total_time"]) ? mysqli_real_escape_string($conn, $_POST["total_time"]) : NULL;
            // $assignment_id = isset($_POST["assignment_id"]) ? mysqli_real_escape_string($conn, $_POST["assignment_id"]) : NULL;
            if ($operator_id_no == 0 || $operator_id_no == '0') {
                $qty_ng = null;
            }
            $sql = "UPDATE `batch_process_wafer_tbl` SET `quantity_in` = '$qty_in', `quantity_ng` = '$qty_ng', `quantity_good` = '$good_qty', `ng_reason` = '$ng_reason', `batch_item_remarks`= '$remarks', `id_number` = '$operator_id_no', `operator_number` = '$operator_number' WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `wafer_number` = '$wafer_number' AND `operator_number` = '$operator_number' AND `line_number` = '$line_number'";
            $res = mysqli_query($conn, $sql);
            if (!$res) {
                $response = array(
                    'success' => false,
                    'message' => 'Unable to save Third Table Data =>' . mysqli_error($conn)
                );
                return $response;
                $conn->close();
            } else {
                $response = array(
                    'success' => true,
                    'message' => 'Third Table Data has been saved successfully!'
                );
                return $response;
                $conn->close();
            }
        }
    }
}

function handleRemoveData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $batch_operator_id = $postData['batch_operator_id'];
    $sql = "DELETE FROM `batch_process_operator_tbl` WHERE `batch_operator_id` = '$batch_operator_id'";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to remove data from [batch_process_operator_tbl] error=>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        $response = array(
            'success' => true,
            'message' => 'Batch data has been successfully removed!'
        );
        return $response;
        $conn->close();
    }
}

function handleGetAllocatedQty($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $SubPid = $postData['SubPid'];
    $batch_number = $postData['batch_number'];
    $parts_number = $postData['parts_number'];
    $revision_number = $postData['revision_number'];
    $lot_number = $postData['lot_number'];
    $line_number = $postData['line_number'];
    $sql = "SELECT * FROM `batch_process_async_tbl` WHERE `SubPid` = '$SubPid' AND `batch_number` = '$batch_number' AND `line_number` = '$line_number' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to get quantity_in from [batch_process_line_tbl]'
        );
        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($res) > 0) {
            $data = array();
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
                $response = array(
                    'success' => true,
                    'data' => $data
                );
            }
            return $response;
            $conn->close();
        } else {
            $response = array(
                'success' => false,
                'message' => 'No data found!'
            );
            return $response;
            $conn->close();
        }
    }
}

function handlgeSaveMainData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (isset($postData)) {
        foreach ($postData as $key => $value) {
            $index = substr($key, strlen('line_number_'));
            $line_number = isset($_POST["line_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["line_number_" . $index]) : NULL;
            $parts_number = isset($_POST["parts_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["parts_number_" . $index]) : NULL;
            $revision_number = isset($_POST["revision_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["revision_number_" . $index]) : NULL;
            $lot_number = isset($_POST["lot_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["lot_number_" . $index]) : NULL;
            $wafer_no_from = isset($_POST["wafer_no_from_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_from_" . $index]) : NULL;
            $wafer_no_to = isset($_POST["wafer_no_to_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_to_" . $index]) : NULL;
            $total_qty = isset($_POST["total_qty_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_qty_" . $index]) : NULL;
            $allocated_qty = isset($_POST["allocated_qty_" . $index]) ? mysqli_real_escape_string($conn, $_POST["allocated_qty_" . $index]) : NULL;
            $unallocated_qty = isset($_POST["unallocated_qty_" . $index]) ? mysqli_real_escape_string($conn, $_POST["unallocated_qty_" . $index]) : NULL;
            $sampling_in = isset($_POST["sampling_in_" . $index]) ? mysqli_real_escape_string($conn, $_POST["sampling_in_" . $index]) : NULL;
            $sampling_out = isset($_POST["sampling_out_" . $index]) ? mysqli_real_escape_string($conn, $_POST["sampling_out_" . $index]) : NULL;
            $remarks = isset($_POST["remarks_" . $index]) ? mysqli_real_escape_string($conn, $_POST["remarks_" . $index]) : NULL;
            $operator_id_no = isset($_POST["operator_id_no_" . $index]) ? mysqli_real_escape_string($conn, $_POST["operator_id_no_" . $index]) : NULL;
            $sub_pid = isset($_POST["sub_pid"]) ? mysqli_real_escape_string($conn, $_POST["sub_pid"]) : NULL;
            $operator_number = isset($_POST["operator_number"]) ? mysqli_real_escape_string($conn, $_POST["operator_number"]) : NULL;
            $batch_number = isset($_POST["batch_number"]) ? mysqli_real_escape_string($conn, $_POST["batch_number"]) : NULL;
            $assignment_id = isset($_POST["assignment_id"]) ? mysqli_real_escape_string($conn, $_POST["assignment_id"]) : NULL;
            // $time_end = isset($_POST["time_end"]) ? mysqli_real_escape_string($conn, $_POST["time_end"]) : NULL;
            // $total_time = isset($_POST["total_time"]) ? mysqli_real_escape_string($conn, $_POST["total_time"]) : NULL;
            $sql = "SELECT * FROM `batch_process_async_tbl` WHERE `batch_number` = '$batch_number' AND `SubPid` = '$sub_pid' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `line_number` = '$line_number'";
            $res = mysqli_query($conn, $sql);
            if (!$res) {
                $response = array(
                    'success' => false,
                    'message' => 'Unable to get data from [batch_process_async_tbl] error =>' . mysqli_error($conn)
                );
                return $response;
                $conn->close();
            } else {
                if (mysqli_num_rows($res) > 0) {
                    while ($row = mysqli_fetch_assoc($res)) {
                        // $main_allocated_qty = $row['allocated_qty'];
                        // $main_unallocated_qty = $row['unallocated_qty'];
                        // $main_total_sampling_in = $row['total_sampling_in'];
                        // $main_total_sampling_out = $row['total_sampling_out'];

                        // $total_allocated_qty = $main_allocated_qty + $allocated_qty;
                        // $total_unallocated_qty = $main_unallocated_qty + $unallocated_qty;
                        // $total_sampling_in = $main_total_sampling_in + $sampling_in;
                        // $total_sampling_out = $main_total_sampling_out + $sampling_out;

                        // $query = "UPDATE `batch_process_async_tbl` SET `allocated_qty` = '$total_allocated_qty', `unallocated_qty` = '$total_unallocated_qty', `total_sampling_in` = '$total_sampling_in', `total_sampling_out` = '$total_sampling_out'";
                        $query = "UPDATE `batch_process_async_tbl` SET `allocated_qty` = '$allocated_qty', `unallocated_qty` = '$unallocated_qty', `total_sampling_in` = '$sampling_in', `total_sampling_out` = '$sampling_out'";
                        $exec = mysqli_query($conn, $query);
                        if (!$exec) {
                            $response = array(
                                'success' => false,
                                'message' => 'Unable to UPDATE data from [batch_process_async_tbl] errror =>' . mysqli_error($conn)
                            );
                            return $response;
                            $conn->close();
                        } else {
                            $response = array(
                                'success' => true,
                                'message' => 'Updating data from [batch_process_async_tbl] is successfull!!!'
                            );
                            return $response;
                            $conn->close();
                        }
                    }
                } else {
                    $response = array(
                        'success' => false,
                        'message' => 'No data found!'
                    );
                    return $response;
                    $conn->close();
                }
            }
        }
    }
}

function handleUpdateBatchProcess($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $SubPid = $postData['sub_pid'];
    $operator_number = $postData['operator_number'];
    $batch_number = $postData['batch_number'];
    $time_end = $postData['time_end'];
    $assignment_id = $postData['assignment_id'];
    $total_time = $postData['total_time'];
    $sql = "UPDATE `batch_process_operator_tbl` SET `time_end` = '$time_end', `total_time` = '$total_time', `allocated_minutes` = '$total_time' WHERE `SubPid` = '$SubPid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' AND `assignment_id` = '$assignment_id'";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to execute query for UPDATE [batch_process_operator_tbl] error=>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        $response = array(
            'success' => true,
            'message' => '[batch_process_operator_tbl] tbl has been updated successfully!'
        );
        return $response;
        $conn->close();
    }
}

function handleGetWaferNG($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $batch_number = $postData['batch_number'];
    $parts_number = $postData['parts_number'];
    $revision_number = $postData['revision_number'];
    $lot_number = $postData['lot_number'];
    $SubPid = $postData['SubPid'];
    $limit = $postData['limit'];
    $sql = "SELECT * FROM `batch_process_wafer_tbl` WHERE `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `batch_number` < '$batch_number' ORDER BY `batch_wafer_id` DESC LIMIT $limit";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to get NG Wafers from [batch_process_wafer_tbl] error =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($res) > 0) {
            $data = array();
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
                $response = array(
                    'success' => true,
                    'data' => $data
                );
            }
            return $response;
            $conn->close();
        }
    }
}
function handleGetQty($postData)
{
    $conn = $GLOBALS['tpc_prod_dbs'];
    $conn2 = $GLOBALS['tpc_dbs'];
    $batch_number = $postData['batch_number'];
    $assignment_id = $postData['assignment_id'];
    $parts_number = $postData['parts_number'];
    $revision_number = $postData['revision_number'];
    $lot_number = $postData['lot_number'];
    // $sub_pid = $postData['sub_pid'];
    $sequence_number = $postData['sequence_number'];
    $sql = "SELECT * FROM `tpc_main_tbl` WHERE `assignment_id` = '$assignment_id' AND `item_parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `sequence_number` < '$sequence_number' AND `tpc_sub_status` = 'Done' ORDER BY `main_prd_id` DESC LIMIT 1";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to get quantity error =>' . mysqli_error($conn)
        );
        return $response;
    } else {
        if (mysqli_num_rows($res) > 0) {
            while ($row = mysqli_fetch_assoc($res)) {
                $ass_id = $row['assignment_id'];
                $SubPid = $row['SubPid'];
                $sql_query = "SELECT operator_number FROM `batch_process_operator_tbl` WHERE `assignment_id` = '$ass_id' AND `SubPid` = '$SubPid' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' ORDER BY `batch_operator_id` DESC LIMIT 1";
                $exec_query = mysqli_query($conn2, $sql_query);
                if (!$exec_query) {
                    $response = array(
                        'success' => false,
                        'message' => 'Unable to execute exec_query error =>' . mysqli_error($conn2)
                    );
                    return $response;
                } else {
                    if (mysqli_num_rows($exec_query) > 0) {
                        while ($row2 = mysqli_fetch_assoc($exec_query)) {
                            $count = $row2['operator_number'];
                            $query = "SELECT * FROM `batch_process_operator_tbl` WHERE `assignment_id` = '$ass_id' AND `SubPid` = '$SubPid' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' ORDER BY `batch_operator_id` LIMIT $count";
                            $exec = mysqli_query($conn2, $query);
                            if (!$exec) {
                                $response = array(
                                    'success' => false,
                                    'message' => 'Unable to execute query error => ' . mysqli_error($conn2)
                                );
                                return $response;
                            } else {
                                if (mysqli_num_rows($exec) > 0) {
                                    $data = array();
                                    while ($row3 = mysqli_fetch_assoc($exec)) {
                                        $data[] = $row3;
                                        $response = array(
                                            'success' => true,
                                            'message' => 'Total quantity has been fetched!',
                                            'data' => $data,
                                            'count' => $count
                                        );
                                    }
                                    return $response;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// function handleGetQty($postData)
// {
//     $conn = $GLOBALS['tpc_dbs'];
//     $batch_number = $postData['batch_number'];
//     $assignment_id = $postData['assignment_id'];
//     $parts_number = $postData['parts_number'];
//     $revision_number = $postData['revision_number'];
//     $lot_number = $postData['lot_number'];
//     $sql = "SELECT operator_number FROM `batch_process_operator_tbl` WHERE `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `batch_number` < '$batch_number' ORDER BY `batch_operator_id` DESC LIMIT 1";
//     $res = mysqli_query($conn, $sql);
//     if (!$res) {
//         $response = array(
//             'success' => false,
//             'message' => 'Unable to get quantity error =>' . mysqli_error($conn)
//         );
//         return $response;
//         $conn->close();
//     } else {
//         if (mysqli_num_rows($res) > 0) {
//             while ($row = mysqli_fetch_assoc($res)) {
//                 $count = $row['operator_number'];
//                 $query = "SELECT * FROM `batch_process_operator_tbl` WHERE `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `batch_number` < '$batch_number' ORDER BY `batch_operator_id` LIMIT $count";
//                 $exec = mysqli_query($conn, $query);
//                 if (!$exec) {
//                     $response = array(
//                         'success' => false,
//                         'message' => 'Unable to execute query error => ' . mysqli_error($conn)
//                     );
//                     return $response;
//                 } else {
//                     if (mysqli_num_rows($exec) > 0) {
//                         $data = array();
//                         while ($row2 = mysqli_fetch_assoc($exec)) {
//                             $data[] = $row2;
//                             $response = array(
//                                 'success' => true,
//                                 'message' => 'Total quantity has been fetched!',
//                                 'data' => $data,
//                                 'count' => $count
//                             );
//                         }
//                     }
//                 }
//             }
//             return $response;
//             $conn->close();
//         }
//     }
// }

function handleAddBatch($postData)
{
    $conn = $GLOBALS['tpc_prod_dbs'];
    $assignment_id = $postData['assignment_id'];
    $SubPid = $postData['SubPid'];
    $parts_number = $postData['parts_number'];
    $item_code = $postData['item_code'];
    $revision_number = $postData['revision_number'];
    $lot_number = $postData['lot_number'];
    $sql = "SELECT * FROM `tpc_main_tbl` WHERE `assignment_id` = '$assignment_id' AND `SubPid` = '$SubPid' AND `item_parts_number` = '$parts_number' AND `item_code` = '$item_code' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to fetch data from `tpc_main_tbl` error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        if (mysqli_num_rows($res) > 0) {
            $data = array();
            while ($row = mysqli_fetch_assoc($res)) {
                $data[] = $row;
                $response = array(
                    'success' => true,
                    'data' => $data
                );
            }
            return $response;
            $conn->close();
        }
    }
}

function handleEndProcess($postData)
{
    $conn = $GLOBALS['tpc_prod_dbs'];
    $SubPid = $postData['SubPid'];
    $assignment_id = $postData['assignment_id'];
    $sql = "UPDATE `tpc_main_tbl` SET `tpc_sub_status` = 'TBD' WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id'";
    $res = mysqli_query($conn, $sql);
    if (!$res) {
        $response = array(
            'success' => false,
            'message' => 'Unable to execute query [tpc_main_tbl] end process. Error =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        $response = array(
            'success' => true,
            'message' => 'Data successfully updated from [tpc_main_tbl] process ended!'
        );
        return $response;
        $conn->close();
    }
}

function handleScanQRRequest($postData)
{
    $tpc_dbs_connection =  $GLOBALS['tpc_dbs'];
    $item_code = $postData['item_code'];
    $parts_number = $postData['parts_number'];
    $lot_number = $postData['lot_number'];
    $date_issued = $postData['date_issued'];
    $revision_number = $postData['revision_number'];
    $assignment_id = $postData['assignment_id'];
    $sql = "SELECT t1.assignment_id,
      t1.assignment_status,
      t1.po_number,
      t1.order_pn,
      t1.wafer_number_from,
      t1.wafer_number_to,
      t1.date_issued as date2,
      t1.delivery_date,
      t2.main_prd_id,
      t2.assignment_id,
      t2.section_id,
      t2.SubPid,
      t2.item_parts_number,
      t2.item_code,
      t2.revision_number,
      t2.lot_number,
      t2.tpc_sub_status,
      t2.tpc_sub_sampling, 
      t2.tpc_sub_uncontrolled, 
      t2.quantity,
      t2.sequence_number,
      t2.tpc_sub_batching_type,
      t2.tpc_sub_result_type,
      t2.date_issued,
      t2.status,
      t3.Pid,
      t3.SubPname,
      t4.section_code,
      t4.section_description,
      t5.Pid,
      t5.Pname,
      t5.key_code
      FROM form_assignment_tbl t1 LEFT JOIN tpc_prod_dbs.tpc_main_tbl t2 ON t1.assignment_id = t2.assignment_id LEFT JOIN setup_sub_process_tbl t3 ON t2.SubPid = t3.SubPid LEFT JOIN setup_section_tbl t4 ON t1.section_id = t4.section_id LEFT JOIN `setup_key_process_tbl` t5 ON t3.Pid = t5.Pid WHERE t1.item_code = '$item_code' AND t1.item_parts_number = '$parts_number' AND t1.lot_number = '$lot_number' AND t1.date_issued = '$date_issued' AND t1.revision_number = '$revision_number' AND t1.assignment_id = '$assignment_id' ORDER BY t2.sequence_number ASC";
    $result = mysqli_query($tpc_dbs_connection, $sql);
    if (!$result) {
        die('Failed to execute query: ' . mysqli_error($tpc_dbs_connection));
    }
    if (mysqli_num_rows($result) > 0) {
        $data = array();
        while ($row = mysqli_fetch_assoc($result)) {
            $data[] = $row;
        }
        return $data;
        $tpc_dbs_connection->close();
    } else {

        $data[] = 0;
        return $data;
        $tpc_dbs_connection->close();
        exit;
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['getBatchNumber'])) {
        $postData = $_POST;
        $result = handleGetBatchNumber($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_main_data'])) {
        $postData = $_POST;
        $result = handleGetMain($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_data'])) {
        $postData = $_POST;
        $result = handleGetData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['save_batch_data'])) {
        $postData = $_POST;
        $result = handleSaveBatchData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_batch_data'])) {
        $postData = $_POST;
        $result = handleGetBatchData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_table_data'])) {
        $postData = $_POST;
        $result = handleGetTableData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_second_tbl_data'])) {
        $postData = $_POST;
        $result = handleGetSecondTableData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['save_batch_operator_data'])) {
        $postData = $_POST;
        $result = handleSaveBatchOperatorData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['save_batch_process'])) {
        $postData = $_POST;
        $result = handleSaveProcess($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['fetch_data'])) {
        $postData = $_POST;
        $result = handleGetThirdTableData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['getNG'])) {
        $postData = $_POST;
        $result = handleGetNGdata($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['save_second_table_data'])) {
        $postData = $_POST;
        $result = handleSaveSecondTableData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['save_third_table_data'])) {
        $postData = $_POST;
        $result = handleSaveThirdTableData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['remove_data'])) {
        $postData = $_POST;
        $result = handleRemoveData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_allocated_qty'])) {
        $postData = $_POST;
        $result = handleGetAllocatedQty($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['save_main_tbl_data'])) {
        $postData = $_POST;
        $result = handlgeSaveMainData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['update_batch_process_data'])) {
        $postData = $_POST;
        $result = handleUpdateBatchProcess($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_qty'])) {
        $postData = $_POST;
        $result = handleGetQty($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['getWaferNG'])) {
        $postData = $_POST;
        $result = handleGetWaferNG($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['add_batch'])) {
        $postData = $_POST;
        $result = handleAddBatch($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['end_process'])) {
        $postData = $_POST;
        $result = handleEndProcess($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['QrSubmitBtn'])) {
        $postData = $_POST;
        $responseData = handleScanQRRequest($postData);
        header('Content-Type: application/json');
        echo json_encode($responseData);
    }
}
