<?php
require_once './conn.php';
if (!$success) {
    $response = array(
        'success' => false,
        'message' => mysqli_connect_error()
    );
    return $response;
}
$tpc_dbs = 'tpc_dbs';
$tpc_prod_dbs = 'tpc_prod_dbs';

$GLOBALS['tpc_dbs'] = mysqli_connect($development['server'], $development['username'], $development['password'], $tpc_dbs);
$GLOBALS['tpc_prod_dbs'] = mysqli_connect($development['server'], $development['username'], $development['password'], $tpc_prod_dbs);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

function handleGetHeaderData($postData)
{
    $conn = $GLOBALS['tpc_prod_dbs'];
    $assignment_id = $postData['assignment_id'];
    $SubPid = $postData['SubPid'];
    $sql = "SELECT t1.*, t2.SubPname FROM `tpc_main_tbl` t1 LEFT JOIN tpc_dbs.`setup_sub_process_tbl` t2 ON t1.`SubPid` = t2.`SubPid` WHERE t1.`assignment_id` = '$assignment_id' AND t1.`SubPid` = '$SubPid'";
    $res = mysqli_query($conn, $sql);
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occure while connecting to server [handleGetHeaderData], please contact IT/SD error message =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        if (!$res) {
            $response = array(
                'success' => false,
                'message' => 'Unable to get data from `tpc_main_tbl` [handleGetHeaderData] function, error => ' . mysqli_error($conn)
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

function handleGetMainData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $conn2 = $GLOBALS['tpc_prod_dbs'];
    $assignment_id = $postData['assignment_id'];
    $SubPid = $postData['SubPid'];
    $parts_number = $postData['parts_number'];
    $revision_number = $postData['revision_number'];
    $lot_number = $postData['lot_number'];
    $batch_number = $postData['batch_number'];
    start:
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to server [handleGetMainData], please contact IT/SD for more information error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        $sql = "SELECT * FROM `batch_process_async_tbl` WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
        $res = mysqli_query($conn, $sql);
        if (!$res) {
            $response = array(
                'success' => false,
                'message' => 'Unable to fetch data [handleGetMainData] error =>' . mysqli_error($conn)
            );
            return $response;
            $conn->close();
        } else {
            if (mysqli_num_rows($res) > 0) {
                while ($row = mysqli_fetch_assoc($res)) {
                    if ($row['line_number'] > 1) {
                        $query = "SELECT * FROM `batch_process_async_tbl` WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
                        $result = mysqli_query($conn, $query);
                        if (!$result) {
                            $response = array(
                                'success' => false,
                                'message' => 'Unable to perform query [handleGetMainData] do to an error => ' . mysqli_error($conn)
                            );
                            return $response;
                            $conn->close();
                        } else {
                            if (mysqli_num_rows($result) > 0) {
                                $data = array();
                                while ($rows = mysqli_fetch_assoc($result)) {
                                    $update = "UPDATE `tpc_main_tbl` SET `batch_id` = '{$rows['batch_number']}' WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id' AND `item_parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
                                    $update_res = mysqli_query($conn2, $update);
                                    if (!$update_res) {
                                        $response = array(
                                            'success' => false,
                                            'message' => 'Unable to update data due to an error => ' . mysqli_error($conn2)
                                        );
                                        return $response;
                                        $conn2->close();
                                    }
                                    $data[] = $rows;
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
                                    'message' => 'Theres no data found [handleGetMainData] with the current parameters being fetch.'
                                );
                                return $response;
                                $conn->close();
                            }
                        }
                    } else {
                        $fetch = "SELECT * FROM `batch_process_async_tbl` WHERE `batch_number` = '$batch_number' AND `SubPid` = '$SubPid'";
                        $execute = mysqli_query($conn, $fetch);
                        if (!$execute) {
                            $response = array(
                                'success' => false,
                                'message' => 'Unable to execute query [handleGetMainData], error => ' . mysqli_error($conn)
                            );
                            return $response;
                            $conn->close();
                        } else {
                            if (mysqli_num_rows($execute) > 0) {
                                $data2 = array();
                                while ($row2 = mysqli_fetch_assoc($execute)) {
                                    $update = "UPDATE `tpc_main_tbl` SET `batch_id` = '{$row2['batch_number']}' WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id' AND `item_parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
                                    $update_res = mysqli_query($conn2, $update);
                                    if (!$update_res) {
                                        $response = array(
                                            'success' => false,
                                            'message' => 'Unable to update data due to an error => ' . mysqli_error($conn2)
                                        );
                                        return $response;
                                        $conn2->close();
                                    }
                                    $data2[] = $row2;
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
                $insert = "INSERT INTO `batch_process_main_tbl`(`SubPid`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`) VALUES ('$SubPid', '$assignment_id', '$parts_number', '$revision_number', '$lot_number')";
                $exec = mysqli_query($conn, $insert);
                if (!$exec) {
                    $response = array(
                        'success' => false,
                        'message' => 'An error occured while inserting data [handleGetMainData] error=> ' . mysqli_error($conn)
                    );
                    return $response;
                    $conn->close();
                } else {
                    $sel = "SELECT * FROM `batch_process_main_tbl` WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id'";
                    $sel_res = mysqli_query($conn, $sel);
                    if (!$sel_res) {
                        $response = array(
                            'success' => false,
                            'message' => 'Unable to fetch data from `batch_process_main_tbl` [handleGetMainData] error =>' . mysqli_error($conn)
                        );
                        return $response;
                        $conn->close();
                    } else {
                        if (mysqli_num_rows($sel_res) > 0) {
                            while ($res_row = mysqli_fetch_assoc($sel_res)) {
                                $update = "UPDATE `tpc_main_tbl` SET `batch_id` = '{$res_row['batch_number']}' WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id' AND `item_parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
                                $update_res = mysqli_query($conn2, $update);
                                if (!$update_res) {
                                    $response = array(
                                        'success' => false,
                                        'message' => 'Unable to update data due to an error => ' . mysqli_error($conn2)
                                    );
                                    return $response;
                                    $conn2->close();
                                } else {
                                    $insert_query = "INSERT INTO `batch_process_async_tbl`(`batch_number`, `SubPid`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`) VALUES ('{$res_row['batch_number']}', '$SubPid', '$assignment_id', '$parts_number', '$revision_number', '$lot_number')";
                                    $insert_res = mysqli_query($conn, $insert_query);
                                    if (!$insert_res) {
                                        $response = array(
                                            'success' => false,
                                            'message' => 'Unable to insert data into `batch_process_async_tbl` [handleGetMainData] error=> ' . mysqli_error($conn)
                                        );
                                        return $response;
                                        $conn->close();
                                    } else {
                                        goto start;
                                    }
                                }
                            }
                        }
                        $response = array(
                            'success' => false,
                            'message' => 'No data has been found using the parameters being fetch!'
                        );
                        return $response;
                        $conn->close();
                    }
                }
            }
        }
    }
}

function handleSaveMainData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to server[handleSaveMainData], please contact IT/SD for more info. error=> ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        mysqli_begin_transaction($conn);
        try {
            if (isset($postData)) {
                foreach ($postData as $key => $value) {
                    $index = substr($key, strlen('line_number_'));
                    $line_number = isset($_POST["line_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["line_number_" . $index]) : NULL;
                    $parts_number = isset($_POST["parts_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["parts_number_" . $index]) : NULL;
                    $revision_number = isset($_POST["revision_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["revision_number_" . $index]) : NULL;
                    $lot_number = isset($_POST["lot_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["lot_number_" . $index]) : NULL;
                    $wafer_from = isset($_POST["wafer_from_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_from_" . $index]) : NULL;
                    $wafer_to = isset($_POST["wafer_to_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_to_" . $index]) : NULL;
                    $total_quantity = isset($_POST["total_quantity_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_quantity_" . $index]) : NULL;
                    $allocated_quantity = isset($_POST["allocated_quantity_" . $index]) ? mysqli_real_escape_string($conn, $_POST["allocated_quantity_" . $index]) : NULL;
                    $unallocated_quantity = isset($_POST["unallocated_quantity_" . $index]) ? mysqli_real_escape_string($conn, $_POST["unallocated_quantity_" . $index]) : NULL;
                    $total_sampling_in = isset($_POST["total_sampling_in_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_sampling_in_" . $index]) : NULL;
                    $total_sampling_out = isset($_POST["total_sampling_out_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_sampling_out_" . $index]) : NULL;
                    $assignment_id = isset($_POST["assignment_id_" . $index]) ? mysqli_real_escape_string($conn, $_POST["assignment_id_" . $index]) : NULL;
                    $batch_number = isset($_POST["batch_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["batch_number_" . $index]) : NULL;
                    $SubPid = isset($_POST["SubPid_" . $index]) ? mysqli_real_escape_string($conn, $_POST["SubPid_" . $index]) : NULL;
                    $status = 'Started';
                    $sql = "SELECT * FROM `batch_process_async_tbl` WHERE `batch_number` = '$batch_number' AND `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id'";
                    $res = mysqli_query($conn, $sql);
                    if (!$res) {
                        $response = array(
                            'success' => false,
                            'message' => 'Unable to execute fetch query [handleSaveMainData], error => ' . mysqli_error($conn)
                        );
                        return $response;
                        $conn->close();
                    } else {
                        if (mysqli_num_rows($res) > 0) {
                            while ($row = mysqli_fetch_assoc($res)) {
                                $update = "UPDATE `batch_process_async_tbl` SET `wafer_number_from` = '$wafer_from', `wafer_number_to` = '$wafer_to', `total_quantity` = '$total_quantity', `batch_status` = '$status', `line_number` = '$line_number' WHERE `batch_number` = '{$row['batch_number']}' AND `SubPid` = '{$row['SubPid']}' AND `assignment_id` = '{$row['assignment_id']}'";
                                $exec = mysqli_query($conn, $update);
                                if (!$exec) {
                                    $response = array(
                                        'success' => false,
                                        'message' => 'Unable to update data from `batch_process_async_tbl` [handleSaveMainData] error => ' . mysqli_error($conn)
                                    );
                                    return $response;
                                    $conn->close();
                                }
                            }
                        } else {
                            if ($batch_number != 0) {
                                $insert = "INSERT INTO `batch_process_async_tbl`(`batch_number`, `SubPid`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`, `wafer_number_from`, `wafer_number_to`, `total_quantity`, `batch_status`, `line_number`) VALUES ('$batch_number', '$SubPid', '$assignment_id', '$parts_number', '$revision_number', '$lot_number', '$wafer_from', '$wafer_to', '$total_quantity', '$status', '$line_number')";
                                $ins = mysqli_query($conn, $insert);
                                if (!$ins) {
                                    $response = array(
                                        'success' => false,
                                        'message' => 'Unable to insert data into `batch_process_async_tbl` [handleSaveMainData] error => ' . mysqli_error($conn)
                                    );
                                    return $response;
                                    $conn->close();
                                }
                            }
                        }
                    }
                }
            }
            mysqli_commit($conn);
            $response = array(
                'success' => true,
                'message' => 'Main data has been successfully saved!'
            );
            return $response;
            $conn->close();
        } catch (Exception $e) {
            mysqli_rollback($conn);
            $response = array(
                'success' => false,
                'message' => 'An error occured while saving data [handleSaveMainData], please contact IT/SD for more information error => ' . $e->getMessage()
            );
            return $response;
            $conn->close();
        }
    }
}

function handleAddBatch($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $conn2 = $GLOBALS['tpc_prod_dbs'];
    $assignment_id = $postData['assignment_id'];
    $SubPid = $postData['SubPid'];
    $parts_number = $postData['parts_number'];
    $revision_number = $postData['revision_number'];
    $lot_number = $postData['lot_number'];
    $batch_number = $postData['batch_number'];
    start:
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server [handleAddBatch], please contact IT/SD for more information error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        $sql = "SELECT * FROM `batch_process_async_tbl` WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id'";
        $res = mysqli_query($conn, $sql);
        if (!$res) {
            $response = array(
                'success' => false,
                'message' => 'Unable to execute query [handleAddBatch], error => ' . mysqli_error($conn)
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
                $insert = "INSERT INTO `batch_process_main_tbl`(`SubPid`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`) VALUES ('$SubPid', '$assignment_id', '$parts_number', '$revision_number', '$lot_number')";
                $exec = mysqli_query($conn, $insert);
                if (!$exec) {
                    $response = array(
                        'success' => false,
                        'message' => 'Unable to insert data [handleAddBatch], error =>' . mysqli_error($conn)
                    );
                    return $response;
                    $conn->close();
                } else {
                    $insert2 = "INSERT INTO `batch_process_async_tbl`(`batch_number`, `SubPid`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`) VALUES ('$batch_number', '$SubPid', '$assignment_id', '$parts_number', '$revision_number', '$lot_number')";
                    $result2 = mysqli_query($conn, $insert2);
                    if (!$result2) {
                        $response = array(
                            'success' => false,
                            'message' => 'Unable to insert data into `batch_process_async_tbl` [handleAddBatch], error => ' . mysqli_error($conn)
                        );
                        return $response;
                        $conn->close();
                    } else {
                        goto start;
                    }
                }
            }
        }
    }
}

function handleAddOperator($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $batch_number = $postData['batch_number'];
    $SubPid = $postData['SubPid'];
    $assignment_id = $postData['assignment_id'];
    $operator_number = $postData['operator_number'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server [handleAddOperator], please contact IT/SD for more information error =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
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
                        $insert = "INSERT INTO `batch_process_line_tbl`(`SubPid`, `batch_number`, `line_number`, `parts_number`, `revision_number`, `lot_number`, `wafer_number_from`, `wafer_number_to`, `quantity_in`, `operator_number`) VALUES ('$SubPid', '$batch_number', '$line_number', '$parts_number', '$revision_number', '$lot_number', '$wafer_no_from', '$wafer_no_to', '$total_qty', '$operator_number')";
                        $insert_res = mysqli_query($conn, $insert);
                        if (!$insert_res) {
                            $response = array(
                                'success' => false,
                                'message' => 'Unable to insert data into [batch_process_line_tbl], error => ' . mysqli_error($conn)
                            );
                            return $response;
                            $conn->close();
                        } else {
                            $response = array(
                                'success' => true,
                                'message' => 'Insert Data into [batch_operator_tbl] AND inserting data into [batch_process_line_tbl]is successful!'
                            );
                        }
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
}

function handleGetAccordion($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $assignment_id = $postData['assignment_id'];
    $batch_number = $postData['batch_number'];
    $sub_pid = $postData['SubPid'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server [handleGetAccordion], please contact IT/SD for more information. Error =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
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
}

function handleGetSecondTableData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $SubPid = $postData['SubPid'];
    $batch_number = $postData['batch_number'];
    $assignment_id = $postData['assignment_id'];
    $operator_number = $postData['operator_number'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server, please contact IT/SD for more information error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
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
                            } else {
                                $response = array(
                                    'success' => false,
                                    'message' => 'No data line number greater than 1 found!'
                                );
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
                            } else {
                                $response = array(
                                    'success' => false,
                                    'message' => 'No data line number less than 1 found!'
                                );
                                return $response;
                                $conn->close();
                            }
                        }
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
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server [handleGetThirdTableData], please contact IT/SD for more information. Error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        $sql = "SELECT * FROM `batch_process_wafer_tbl` WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `line_number` = '$line_number' AND `operator_number` = '$operator_number' ORDER BY `batch_process_wafer_tbl`.`line_number`, wafer_number ASC";
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
                $datas = array();
                while ($row = mysqli_fetch_assoc($res)) {
                    $datas[] = $row;
                    $response = array(
                        'success' => true,
                        'data' => $datas
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
}

function handleSaveBatchOperatorData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server [handleSaveBatchOperatorData], please contact IT/SD for more information error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        mysqli_begin_transaction($conn);
        try {
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
                                } else {
                                    $update2 = "UPDATE `batch_process_line_tbl` SET `quantity_in`= '$qty_in',`sampling_in`='$sampling_in' WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `line_number` = '$line_number' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
                                    $update2_res = mysqli_query($conn, $update2);
                                    if (!$update2_res) {
                                        $response = array(
                                            'success' => false,
                                            'message' => 'An error occured while update datas [handleSaveBatchOperatorData], error => ' . mysqli_error($conn)
                                        );
                                    } else {
                                        $response = array(
                                            'success' => true,
                                            'message' => 'Updating datas from [batch_process_line_tbl] and from [batch_process_operator_tbl]  is successfull!'
                                        );
                                    }
                                }
                            }
                        } else {
                            if ($line_number != 0) {
                                $query = "INSERT INTO `batch_process_operator_tbl`(`SubPid`,`batch_number`,`operator_number`,`id_number`, `operator_name`, `time_start`, `total_batch_processed`, `line_number`, `assignment_id`, `parts_number`, `revision_number`, `lot_number`, `wafer_number_from`, `wafer_number_to`, `quantity_in`, `sampling_in`, `operator_status`) VALUES ('$sub_pid','$batch_number', '$operator_number', '$id_number', '$id_number', '$time_start', '$total_batch_processed', '$line_number', '$assignment_id', '$parts_number', '$revision_number', '$lot_number', '$wafer_no_from', '$wafer_no_to', '$qty_in', '$sampling_in', '$operator_status')";
                                $exec = mysqli_query($conn, $query);
                                if (!$exec) {
                                    $response = array(
                                        'success' => false,
                                        'message' => 'Inserting data into [batch_operator_tbl] has failed error=> ' . mysqli_error($conn)
                                    );
                                } else {
                                    $insert = "INSERT INTO `batch_process_line_tbl`(`SubPid`, `batch_number`, `line_number`, `parts_number`, `revision_number`, `lot_number`, `wafer_number_from`, `wafer_number_to`, `quantity_in`,`sampling_in`, `operator_number`) VALUES ('$sub_pid', '$batch_number', '$line_number', '$parts_number', '$revision_number', '$lot_number', '$wafer_no_from', '$wafer_no_to', '$qty_in', '$sampling_in', '$operator_number')";
                                    $insert_res = mysqli_query($conn, $insert);
                                    if (!$insert_res) {
                                        $response = array(
                                            'success' => false,
                                            'message' => 'Unable to insert data into [batch_process_line_tbl], error => ' . mysqli_error($conn)
                                        );
                                    } else {
                                        $response = array(
                                            'success' => true,
                                            'message' => 'Inserting Data FROM [batch_operator_tbl] AND [batch_process_line_tbl]is successful!'
                                        );
                                    }
                                }
                            }
                        }
                    }
                }
            }
            mysqli_commit($conn);
            return $response;
            $conn->close();
        } catch (Exception $e) {
            mysqli_rollback($conn);
            $response = array(
                'success' => false,
                'message' => 'An error occured while saving data [handleSaveBatchOperatorData], please contact IT/SD for more information error => ' . $e->getMessage()
            );
            return $response;
            $conn->close();
        }
    }
}

function handleSaveProcess($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server [handleSaveProcess], please contact IT/SD for more information error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        mysqli_begin_transaction($conn);
        try {
            if (isset($postData)) {
                foreach ($postData as $key => $value) {
                    $index = substr($key, strlen('line_number_'));
                    $line_number = isset($_POST["line_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["line_number_" . $index]) : NULL;
                    $parts_number = isset($_POST["parts_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["parts_number_" . $index]) : NULL;
                    $revision_number = isset($_POST["revision_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["revision_number_" . $index]) : NULL;
                    $lot_number = isset($_POST["lot_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["lot_number_" . $index]) : NULL;
                    $wafer_number = isset($_POST["wafer_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_number_" . $index]) : NULL;
                    // $wafer_no_to = isset($_POST["wafer_no_to_" .$index]) ? mysqli_real_escape_string($conn, $_POST["wafer_no_to_" .$index]) : NULL;
                    $qty_in = isset($_POST["qty_in_" . $index]) ? mysqli_real_escape_string($conn, $_POST["qty_in_" . $index]) : NULL;
                    $ng_count = isset($_POST["ng_count_" . $index]) ? mysqli_real_escape_string($conn, $_POST["ng_count_" . $index]) : NULL;
                    // $qty_out = isset($_POST["qty_out_" .$index]) ? mysqli_real_escape_string($conn, $_POST["qty_out_" .$index]) : NULL;
                    // $sampling_in = isset($_POST["sampling_in_" . $index]) ? mysqli_real_escape_string($conn, $_POST["sampling_in_" . $index]) : NULL;
                    // $sampling_out = isset($_POST["sampling_out_" .$index]) ? mysqli_real_escape_string($conn, $_POST["sampling_out_" .$index]) : NULL;
                    // $unfinished_qty = isset($_POST["unfinished_qty_" .$index]) ? mysqli_real_escape_string($conn, $_POST["unfinished_qty_" .$index]) : NULL;
                    $operator_number = isset($_POST["operator_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["operator_number_" . $index]) : NULL;
                    $batch_number = isset($_POST["batch_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["batch_number_" . $index]) : NULL;
                    $sub_pid = isset($_POST["sub_pid_" . $index]) ? mysqli_real_escape_string($conn, $_POST["sub_pid_" . $index]) : NULL;
                    $id_number = isset($_POST["id_number"]) ? mysqli_real_escape_string($conn, $_POST["id_number"]) : NULL;
                    $result_type = isset($_POST["result_type"]) ? mysqli_real_escape_string($conn, $_POST["result_type"]) : NULL;
                    $accordion_count = isset($_POST["accordion_count"]) ? mysqli_real_escape_string($conn, $_POST["accordion_count"]) : NULL;
                    if ($sub_pid != 0) {
                        $query = "SELECT * FROM `batch_process_wafer_tbl` WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `line_number` = '$line_number' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `wafer_number` = '$wafer_number' AND `id_number` = '$id_number' AND `operator_number` = '$operator_number'";
                        $exec = mysqli_query($conn, $query);
                        if (!$exec) {
                            $response = array(
                                'success' => false,
                                'message' => 'Unable to fetch data  [handleSaveProcess] due to an error => ' . mysqli_error($conn)
                            );
                            return $response;
                            $conn->close();
                        } else {
                            if (mysqli_num_rows($exec) > 0) {
                                while ($row = mysqli_fetch_assoc($exec)) {
                                    $update = "UPDATE `batch_process_wafer_tbl` SET `quantity_in` = '$qty_in', `quantity_ng` = '$ng_count' WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `line_number` = '$line_number' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `wafer_number` = '$wafer_number' AND `id_number` = '$id_number' AND `operator_number` = '$operator_number'";
                                    $update_res = mysqli_query($conn, $update);
                                    if (!$update_res) {
                                        $response = array(
                                            'success' => false,
                                            'message' => 'Unable to update data from `batch_process_wafer_tbl` [handleSaveProcess], error => ' . mysqli_error($conn)
                                        );
                                        return $response;
                                        $conn->close();
                                    } else {
                                        $response = array(
                                            'success' => true,
                                            'message' => 'Updating Data FROM [batch_process_wafer_tbl] is successful!'
                                        );
                                    }
                                }
                            } else {
                                $sql = "INSERT INTO `batch_process_wafer_tbl`(`SubPid`, `batch_number`, `line_number`, `parts_number`, `revision_number`, `lot_number`, `wafer_number`, `operator_number`) VALUES ('$sub_pid','$batch_number','$line_number', '$parts_number', '$revision_number', '$lot_number', '$wafer_number', '$operator_number')";
                                $res = mysqli_query($conn, $sql);
                                if (!$res) {
                                    $response = array(
                                        'success' => false,
                                        'message' => mysqli_error($conn)
                                    );
                                } else {
                                    $response = array(
                                        'success' => true,
                                        'message' => 'Inserting Data FROM [batch_process_wafer_tbl] is successful!',
                                        'data' => $postData,
                                        'query' => $res
                                    );
                                    mysqli_commit($conn);
                                    $conn->close();
                                    return $response;
                                }
                            }
                        }
                    }
                }
            }
        } catch (Exception $e) {
            mysqli_rollback($conn);
            $response = array(
                'success' => false,
                'message' => 'An error occured while saving data [handleSaveProcess], please contact IT/SD for more information error => ' . $e->getMessage()
            );
            return $response;
            $conn->close();
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
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server [handleUpdateBatchProcess], please contact IT/SD for more information. Error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        mysqli_begin_transaction($conn);
        try {
            $sql = "UPDATE `batch_process_operator_tbl` SET `time_end` = '$time_end', `total_time` = '$total_time', `allocated_minutes` = '$total_time' WHERE `SubPid` = '$SubPid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' AND `assignment_id` = '$assignment_id'";
            $res = mysqli_query($conn, $sql);
            if (!$res) {
                $response = array(
                    'success' => false,
                    'message' => 'Unable to execute query for UPDATE [batch_process_operator_tbl] error=>' . mysqli_error($conn)
                );
            } else {
                $response = array(
                    'success' => true,
                    'message' => '[batch_process_operator_tbl] tbl has been updated successfully!'
                );
            }
            mysqli_commit($conn);
            return $response;
            $conn->close();
        } catch (Exception $e) {
            mysqli_rollback($conn);
            $response = array(
                'success' => false,
                'message' => 'An error occured while saving data [handleUpdateBatchProcess], please contact IT/SD for more information error => ' . $e->getMessage()
            );
            return $response;
            $conn->close();
        }
    }
}

function handleSaveSecondTableData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server [handleSaveSecondTableData], please contact IT/SD for more information. Error =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        mysqli_begin_transaction($conn);
        try {
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
                    $total_time = isset($_POST["total_time"]) ? mysqli_real_escape_string($conn, $_POST["total_time"]) : NULL;
                    $assignment_id = isset($_POST["assignment_id"]) ? mysqli_real_escape_string($conn, $_POST["assignment_id"]) : NULL;
                    $operator_status = isset($_POST["operator_status"]) ? mysqli_real_escape_string($conn, $_POST["operator_status"]) : NULL;

                    // $sql = "UPDATE `batch_process_operator_tbl` SET `time_end` = '$time_end', `total_time` = '$total_time', `quantity_ng` = '$ng_count', `quantity_out` = '$qty_out', `sampling_out` = '$sampling_out', `quantity_unfinished` = '$unfinished_qty', `allocated_minutes` = '$total_time', `operator_status` = '$operator_status' WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
                    $sql = "UPDATE `batch_process_operator_tbl` SET `quantity_in` = '$qty_in', `quantity_ng` = '$ng_count', `quantity_out` = '$qty_out', `sampling_in` = '$sampling_in', `sampling_out` = '$sampling_out', `quantity_unfinished` = '$unfinished_qty', `operator_status` = '$operator_status' WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `line_number` = '$line_number'";
                    $res = mysqli_query($conn, $sql);
                    if (!$res) {
                        $response = array(
                            'success' => false,
                            'message' => 'Unable to Update data from[batch_process_operator_tbl] =>' . mysqli_error($conn)
                        );
                    } else {
                        $update = "UPDATE `batch_process_line_tbl` SET `quantity_in` = '$qty_in', `quantity_out` = '$qty_out', `sampling_in` = '$sampling_in', `sampling_out` = '$sampling_out', `allocated_minutes` = '$total_time' WHERE `SubPid` = '$sub_pid' AND `batch_number` = '$batch_number' AND `operator_number` = '$operator_number' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `line_number` = '$line_number'";
                        $exec = mysqli_query($conn, $update);
                        if (!$exec) {
                            $response = array(
                                'success' => false,
                                'message' => 'Unable to update data from [batch_process_line_tbl], error=> ' . mysqli_error($conn)
                            );
                        } else {

                            $response = array(
                                'success' => true,
                                'message' => 'Updating data from [batch_process_operator_tbl] and [batch_process_line_tbl] is successful!'
                            );
                        }
                    }
                }
            }
            mysqli_commit($conn);
            return $response;
            $conn->close();
        } catch (Exception $e) {
            mysqli_rollback($conn);
            $response = array(
                'success' => false,
                'message' => 'An error occured while saving data [handleSaveSecondTableData], please contact IT/SD for more information. Error => ' . $e->getMessage()
            );
            return $response;
            $conn->close();
        }
    }
}


function handleSaveThirdTableData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server, please contact IT/SD for more information. Error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
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
                // $assignment_id = isset($_POST["assignment_id"]) ? mysqli_real_escape_string($conn, $_POST["assignment_id"]) : NULL
                // $result_type = isset($_POST["result_type"]) ? mysqli_real_escape_string($conn, $_POST["result_type"]) : NULL;
                $batch_wafer_id = isset($_POST["batch_wafer_id"]) ? mysqli_real_escape_string($conn, $_POST["batch_wafer_id"]) : NULL;
                if ($operator_id_no == 0 || $operator_id_no == '0') {
                    $qty_ng = null;
                }
                $sql = "UPDATE `batch_process_wafer_tbl` SET `quantity_in` = '$qty_in', `quantity_ng` = '$qty_ng', `quantity_good` = '$good_qty', `ng_reason` = '$ng_reason', `batch_item_remarks`= '$remarks', `id_number` = '$operator_id_no', `operator_number` = '$operator_number' WHERE `batch_wafer_id` = '$batch_wafer_id'";
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
}

function handleGetNGdata($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $SubPid = $postData['SubPid'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server [handleGetNGData], please contact IT/SD for more information. Error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
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
                    'data' => 'No data found using the current parameters being fetched!'
                );
                return $response;
                $conn->close();
            }
        }
    }
}

function handleRemoveBatch($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $batch_async_id = $postData['batch_async_id'];
    $batch_number = $postData['batch_number'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server, please contact iT/SD for more information. Error => ' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        $sql = "DELETE FROM `batch_process_async_tbl` WHERE `batch_async_id` = '$batch_async_id'";
        $res = mysqli_query($conn, $sql);
        if (!$res) {
            $response = array(
                'success' => false,
                'message' => 'Unable to delete data from `batch_process_async_tbl` [handleRemoveBatch], error => ' . mysqli_error($conn)
            );
            return $response;
            $conn->close();
        } else {
            $delete = "DELETE FROM `batch_process_main_tbl` WHERE `batch_number` = '$batch_number'";
            $execute = mysqli_query($conn, $delete);
            if (!$execute) {
                $response = array(
                    'success' => false,
                    'message' => 'Unable to delete data from `batch_process_main_tbl` [handleRemoveBatch], error => ' . mysqli_error($conn)
                );
                return $response;
                $conn->close();
            } else {
                $response = array(
                    'success' => true,
                    'message' => 'Datas from `batch_process_async_tbl` and `batch_process_main_tbl` has been successfully deleted!'
                );
                return $response;
                $conn->close();
            }
        }
    }
}

function handleDeleteOperatorData($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    $batch_number = $postData['batch_number'];
    $SubPid = $postData['SubPid'];
    $assignment_id = $postData['assignment_id'];
    $operator_number = $postData['operator_number'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server, please contact IT/SD for more information. Error =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        $sql = "DELETE t1, t2
        FROM `batch_process_operator_tbl` t1
        INNER JOIN `batch_process_line_tbl` t2
        ON t1.batch_number = t2.batch_number AND t1.operator_number = t2.operator_number
        WHERE t1.`SubPid` = '$SubPid' AND t1.`batch_number` = '$batch_number' AND t1.`operator_number` = '$operator_number'";
        $res = mysqli_query($conn, $sql);
        if (!$res) {
            $response = array(
                'success' => false,
                'message' => 'Unable to delete datas from `batch_process_operator_tbl` and `batch_process_line_tbl` [handleDeleteOperatorData], error => ' . mysqli_error($conn)
            );
            return $response;
            $conn->close();
        } else {
            $response = array(
                'success' => true,
                'message' => 'Delete datas from `batch_process_operator_tbl` and `batch_process_line_tbl` [handleDeleteOperatorData] has been successfully executed!'
            );
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
    if ($conn && $conn2) {
        $sql = "SELECT * FROM `tpc_main_tbl` WHERE `assignment_id` = '$assignment_id' AND `item_parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number' AND `sequence_number` < '$sequence_number' AND `tpc_sub_status` = 'Done' ORDER BY `main_prd_id` DESC LIMIT 1";
        $res = mysqli_query($conn, $sql);
        if (!$res) {
            $response = array(
                'success' => false,
                'message' => 'Unable to get quantity error =>' . mysqli_error($conn)
            );
            return $response;
            $conn->close();
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
                        $conn2->close();
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
                                    $conn2->close();
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
                                        $conn2->close();
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                $response = array(
                    'success' => false,
                    'message' => 'No data found using the current parameters being fetched!'
                );
                return $response;
                $conn->close();
            }
        }
    } else if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server, please contact IT/SD for more information. Error =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else if (!$conn2) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server, please contact IT/SD for more information. Error =>' . mysqli_error($conn2)
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
        } else {
            $response = array(
                'success' => false,
                'message' => 'No data found using the current parameters being fetched!',
                'parameteres' => 'batch_number =>' . $batch_number . '(parts_number =>' . $parts_number . '(revision_number =>' . $revision_number . '(lot_number =>' . $lot_number . '(SubPid =>' . $SubPid . '(limit =>' . $limit
            );
            return $response;
            $conn->close();
        }
    }
}

function handleDoneBatchProcess($postData)
{
    $conn = $GLOBALS['tpc_dbs'];
    if (!$conn) {
        $response = array(
            'success' => false,
            'message' => 'An error occured while connecting to the server, please contact IT/SD for more information. Error =>' . mysqli_error($conn)
        );
        return $response;
        $conn->close();
    } else {
        if (isset($postData)) {
            foreach ($postData as $key => $value) {
                $index = substr($key, strlen('line_number_'));
                $line_number = isset($_POST["line_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["line_number_" . $index]) : NULL;
                $parts_number = isset($_POST["parts_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["parts_number_" . $index]) : NULL;
                $revision_number = isset($_POST["revision_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["revision_number_" . $index]) : NULL;
                $lot_number = isset($_POST["lot_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["lot_number_" . $index]) : NULL;
                $wafer_from = isset($_POST["wafer_from_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_from_" . $index]) : NULL;
                $wafer_to = isset($_POST["wafer_to_" . $index]) ? mysqli_real_escape_string($conn, $_POST["wafer_to_" . $index]) : NULL;
                $total_qty = isset($_POST["total_qty_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_qty_" . $index]) : NULL;
                $allocated_qty = isset($_POST["allocated_qty_" . $index]) ? mysqli_real_escape_string($conn, $_POST["allocated_qty_" . $index]) : NULL;
                $unallocated_qty = isset($_POST["unallocated_qty_" . $index]) ? mysqli_real_escape_string($conn, $_POST["unallocated_qty_" . $index]) : NULL;
                $total_sampling_in = isset($_POST["total_sampling_in_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_sampling_in_" . $index]) : NULL;
                $total_sampling_out = isset($_POST["total_sampling_out_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_sampling_out_" . $index]) : NULL;
                $assignment_id = isset($_POST["assignment_id_" . $index]) ? mysqli_real_escape_string($conn, $_POST["assignment_id_" . $index]) : NULL;
                $total_time = isset($_POST["total_time_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_time_" . $index]) : NULL;
                $total_operator = isset($_POST["total_operator_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_operator_" . $index]) : NULL;
                $total_batch = isset($_POST["total_batch_" . $index]) ? mysqli_real_escape_string($conn, $_POST["total_batch_" . $index]) : NULL;
                $batch_number = isset($_POST["batch_number_" . $index]) ? mysqli_real_escape_string($conn, $_POST["batch_number_" . $index]) : NULL;
                $SubPid = isset($_POST["SubPid_" . $index]) ? mysqli_real_escape_string($conn, $_POST["SubPid_" . $index]) : NULL;
                $sql = "UPDATE `batch_process_async_tbl` SET `total_quantity` = '$total_qty', `allocated_qty` = '$allocated_qty', `unallocated_qty` = '$unallocated_qty', `total_sampling_in` = '$total_sampling_in', `total_sampling_out` = '$total_sampling_out' WHERE `batch_number` = '$batch_number' AND`SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND`lot_number` = '$lot_number' AND `line_number` = '$line_number' ";
                $res = mysqli_query($conn, $sql);
                if (!$res) {
                    $response = array(
                        'success' => false,
                        'message' => 'Unable to update `batch_process_async_tbl` [handleDoneBatchProcess], error => ' . mysqli_error($conn)
                    );

                    return $response;
                    $conn->close();
                } else {
                    $update = "UPDATE `batch_process_main_tbl` SET `total_operator`= '$total_operator', `total_batch` = '$total_batch',`total_time` = '$total_time' WHERE `SubPid` = '$SubPid' AND `assignment_id` = '$assignment_id' AND `parts_number` = '$parts_number' AND `revision_number` = '$revision_number' AND `lot_number` = '$lot_number'";
                    $exec = mysqli_query($conn, $update);
                    if (!$exec) {
                        $response = array(
                            'success' => false,
                            'message' => 'Unable to update `batch_process_main_tbl` [handleDoneBatchProcess], error => ' . mysqli_error($conn)
                        );
                        return $response;
                        $conn->close();
                    } else {
                        $response = array(
                            'success' => true,
                            'message' => 'The process has been successfully completed.'
                        );
                        return $response;
                        $conn->close();
                    }
                }
            }
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
    $conn =  $GLOBALS['tpc_dbs'];
    $item_code = $postData['item_code'];
    $parts_number = $postData['parts_number'];
    $lot_number = $postData['lot_number'];
    $date_issued = $postData['date_issued'];
    $revision_number = $postData['revision_number'];
    $assignment_id = $postData['assignment_id'];
    if (!$conn) {
        die('An error occured while connecting to the server, please contact IT/SD for more information' . mysqli_error($conn));
    } else {
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
        $result = mysqli_query($conn, $sql);
        if (!$result) {
            die('Failed to execute query: ' . mysqli_error($conn));
        }
        if (mysqli_num_rows($result) > 0) {
            $data = array();
            while ($row = mysqli_fetch_assoc($result)) {
                $data[] = $row;
            }
            return $data;
            $conn->close();
        } else {
            $data[] = 0;
            return $data;
            $conn->close();
            exit;
        }
    }
}


if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['get_header_data'])) {
        $postData = $_POST;
        $result = handleGetHeaderData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_main_data'])) {
        $postData = $_POST;
        $result = handleGetMainData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['save_main_data'])) {
        $postData = $_POST;
        $result = handleSaveMainData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['add_batch'])) {
        $postData = $_POST;
        $result = handleAddBatch($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['add_operator'])) {
        $postData = $_POST;
        $result = handleAddOperator($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_accordion'])) {
        $postData = $_POST;
        $result = handleGetAccordion($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_second_tbl_data'])) {
        $postData = $_POST;
        $result = handleGetSecondTableData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['fetch_data'])) {
        $postData = $_POST;
        $result = handleGetThirdTableData($postData);
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
    } else if (isset($_POST['update_batch_process_data'])) {
        $postData = $_POST;
        $result = handleUpdateBatchProcess($postData);
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
    } else if (isset($_POST['get_ng'])) {
        $postData = $_POST;
        $result = handleGetNGdata($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['remove_batch'])) {
        $postData = $_POST;
        $result = handleRemoveBatch($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['delete_operator_data'])) {
        $postData = $_POST;
        $result = handleDeleteOperatorData($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_qty'])) {
        $postData = $_POST;
        $result = handleGetQty($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['get_wafer_ng'])) {
        $postData = $_POST;
        $result = handleGetWaferNG($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['done_batch_process'])) {
        $postData = $_POST;
        $result = handleDoneBatchProcess($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['end_process'])) {
        $postData = $_POST;
        $result = handleEndProcess($postData);
        header('Content-Type: application/json');
        echo json_encode($result);
    } else if (isset($_POST['qr_submit_btn'])) {
        $postData = $_POST;
        $responseData = handleScanQRRequest($postData);
        header('Content-Type: application/json');
        echo json_encode($responseData);
    }
}
