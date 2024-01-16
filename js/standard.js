const urlParams = new URLSearchParams(window.location.search);
const assign_id = urlParams.get('AssignmentId');
const sub_pid = urlParams.get('SubPid');

const fetchSubURL = 'http://172.16.2.60/tpc/GetSubProcess.php';
// FOR DEBUGGING
// const myFetchURL = 'https://172.16.2.61/batch_process_ver2/backend/query.php';
// FOR DEPLOYMENT
const myFetchURL = 'https://172.16.2.13/batch_process_ver2/backend/query.php';

getMainData();
getData();
function getMainData() {
    const fetchData = new FormData();
    fetchData.append('SubPid', sub_pid);
    fetchData.append('assignment_id', assign_id);
    fetchData.append('getMainData', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: fetchData
    })
        .then(response => response.json())
        .then(datas => {
            console.log(datas);
            for (let data of datas) {
                // console.log(data);
                localStorage.setItem('sequence_number', data.sequence_number);
                console.log(localStorage.getItem(`sequence_number`));

                const fetchBatchNumber = new FormData();
                fetchBatchNumber.append('SubPid', sub_pid);
                fetchBatchNumber.append('assignment_id', assign_id);
                fetchBatchNumber.append('parts_number', data.item_parts_number);
                fetchBatchNumber.append('revision_number', data.revision_number);
                fetchBatchNumber.append('lot_number', data.lot_number);
                fetchBatchNumber.append('getBatchNumber', 'true');
                fetch(myFetchURL, {
                    method: 'POST',
                    body: fetchBatchNumber
                })
                    .then(response => response.json())
                    .then(batch_number_data => {
                        console.log(batch_number_data);
                        let thisBatchNumber = 0;
                        if (batch_number_data.success) {

                            for (let batch_number_datas of batch_number_data.data) {
                                thisBatchNumber = batch_number_datas.batch_number;
                                if (thisBatchNumber <= 0) {
                                    thisBatchNumber = 1
                                }
                                document.getElementById('subPname').textContent = data.SubPname;
                                document.getElementById('batch_number').textContent = `Batch Number: ${thisBatchNumber}`;
                                document.getElementById('form_assignment').textContent = `Form Assignment: ${data.assignment_id}`;
                                document.getElementById('total_operator').textContent = `Total Operator: ${data.total_operator ? data.total_operator : ''}`;
                                document.getElementById(`sampling`).textContent = `Sampling Quantity: ${data.tpc_sub_sampling} `;
                                if (data.tpc_sub_uncontrolled == 'True') {
                                    document.getElementById(`uncontrolled`).textContent = `Uncontrolled Quantity`;
                                }
                                else {
                                    document.getElementById(`uncontrolled`).textContent = `Controlled Quantity`;
                                }
                                document.getElementById(`batch_type`).textContent = `Batch Type: ${data.tpc_sub_batching_type}`;
                                document.getElementById(`result_type`).textContent = `Result Type: ${data.tpc_sub_result_type}`;

                                localStorage.setItem('batch_number', thisBatchNumber);
                                localStorage.setItem('item_parts_number', data.item_parts_number);
                                localStorage.setItem('revision_number', data.revision_number);
                                localStorage.setItem('lot_number', data.lot_number);
                                localStorage.setItem('total_operator', data.total_operator);
                                localStorage.setItem('tpc_sub_result_type', data.tpc_sub_result_type);
                                localStorage.setItem('tpc_sub_sampling', data.tpc_sub_sampling);
                                localStorage.setItem('tpc_sub_uncontrolled', data.tpc_sub_uncontrolled);
                            }
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    })
            }
        })
        .catch(error => {
            console.log(error)
        })
}

function getData() {

    const fetchParams = new FormData();
    fetchParams.append('SubPid', sub_pid);
    fetchParams.append('assignment_id', assign_id);
    fetchParams.append('getData', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: fetchParams
    })
        .then(response => response.json())
        .then(datas => {
            console.log(datas);
            const mainContent = document.getElementById('main_content');
            main_content.innerHTML = '';
            if (datas[0] == 0) {
                main_content.innerHTML = '';
            }
            else {
                for (let data of datas) {
                    // localStorage.setItem('batch_number', data.batch_number);
                    localStorage.setItem('line_number', data.line_number);
                    localStorage.setItem('operator_number', data.operator_number);
                    localStorage.setItem('operator_status', data.operator_status);
                    localStorage.setItem('total_batch_processed', data.total_batch_processed);
                    console.log(data.quantity_unfinished);
                    if ((data.operator_status == 'null' || data.operator_status == null || data.operator_status == 'Started') && data.quantity_unfinished > 0 || data.quantity_unfinished == null) {
                        document.getElementById(`addOperatorBtn`).disabled = true;
                    }
                    else if (data.operator_status == 'Finished' && data.quantity_unfinished == 0) {
                        document.getElementById(`addOperatorBtn`).disabled = true;
                    }
                    else {
                        document.getElementById(`addOperatorBtn`).disabled = false;
                    }
                    const accordion = `
                    <div class="accordion col-xl-12 col-lg-12 col-md-12 py-2 mx-auto" id="accordionExample${data.batch_operator_id}">
                    <div class="accordion-item">
                        <h2 class="accordion-header">
                        <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" onclick="get_table_data(${data.operator_number}, ${data.total_batch_processed})" data-bs-target="#collapseOne${data.operator_number}" aria-expanded="false" aria-controls="collapseOne${data.operator_number}">
                            <div class="col-md-12 row">
                                <div class="col-lg-1 text-center">
                                <small>x</small>
                                </div>
                                <div class="col-lg-1">
                                    <small>Operator ${data.operator_number ? data.operator_number : ''}</small>
                                </div>
                                <div class="col-lg-1">
                                    <small>ID No: ${data.id_number ? data.id_number : ''}</small>
                                </div>
                                <div class="col-lg-2">
                                    <small>Name: ${data.operator_name ? data.operator_name : ''}</small>
                                </div>
                                <div class="col-lg-2">
                                    <small>Total Batch Process: ${data.total_batch_processed ? data.total_batch_processed : ''}</small>
                                </div>
                                <div class="col-md-2">
                                    <small>Time Start: ${data.time_start ? data.time_start : ''}</small>
                                </div>
                                <div class="col-md-2">
                                    <small>Time End: ${data.time_end ? data.time_end : ''}</small>
                                </div>
                                <div class="col-md-1">
                                    <small>Status: ${data.operator_status ? data.operator_status : ''}</small>
                                </div>
                            </div>
                        </button>
                        </h2>
                        <div id="collapseOne${data.operator_number}" class="accordion-collapse collapse" data-bs-parent="#accordionExample${data.operator_number}">
                        <div class="accordion-body col-xl-12 col-lg-12 col-md-12 mx-auto" id="accordion_body_${data.operator_number}">
                            <div class="col-md-12 row">
                                <div class="col-xl-4 col-lg-12 row">
                                    <div class="col-xl-6 col-lg-6">
                                        <label for="">ID No:</label>
                                        <input type="text" class="form-control shadow" id="operator_id_${data.operator_number}" value="${data.id_number ? data.id_number : ''}">
                                    </div>
                                    <div class="col-xl-6 col-lg-6">
                                        <label for="">Operator Name:</label>
                                        <input type="text" class="form-control shadow bg-light" value="${data.operator_name ? data.operator_name : ''}" readonly>
                                    </div>
                                    <div class="col-xl-6 col-lg-6">
                                        <label for="">Time Start:</label>
                                        <input type="datetime-local" class="form-control shadow bg-light" id="time_start_${data.operator_number}" value="${data.time_start ? data.time_start : ''}" readonly>
                                    </div>
                                    <div class="col-xl-6 col-lg-6">
                                        <label for="">Time End:</label>
                                        <input type="datetime-local" class="form-control shadow bg-light" id="time_end_${data.operator_number}" value="${data.time_end ? data.time_end : ''}" readonly>
                                    </div>
                                    <div class="col-xl-12 col-lg-12">
                                        <label for="">Total Time (in minutes) </label>
                                        <input type="text" class="form-control shadow bg-light" value="${data.total_time ? data.total_time : ''}" readonly>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 p-2">
                                        <button class="form-control btn btn-sm btn-success p-3  shadow" onclick="start_process(${data.operator_number})" id="start_button_${data.operator_number}">
                                        <span class="material-symbols-outlined align-bottom">play_circle</span>START
                                        </button>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 p-2">
                                        <button class="form-control btn btn-sm btn-danger p-3 shadow" onclick="save_time_end(${data.operator_number})" id="end_button_${data.operator_number}">
                                        <span class="material-symbols-outlined align-bottom">stop_circle</span>END
                                        </button>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 p-2">
                                        <button class="form-control btn btn-sm  btn-info p-3 shadow" onclick="save_process_data(${data.operator_number})" id="save_button_${data.operator_number}">
                                        <span class="material-symbols-outlined align-bottom">save</span>SAVE
                                        </button>
                                    </div>
                                    <div class="col-xl-6 col-lg-6 p-2">
                                        <button class="form-control btn btn-sm btn-secondary p-3 shadow" id="add_batch_${data.operator_number}" id="add_batch_button_${data.operator_number}">
                                        <span class="material-symbols-outlined align-bottom">layers</span>ADD BATCH
                                        </button>
                                    </div>
                                </div>
                                <div class="col-xl-8 col-lg-12 mx-auto">
                                    <div class="table-responsive overflow-auto text-center" style="margin-top: 5px; max-height: 350px;">
                                        <table class="table border rounded shadow">
                                            <thead class="sticky-top">
                                                <tr>
                                                    <th width="50px">Line No.</th>
                                                    <th width="auto">Parts No.</th>
                                                    <th width="auto">Revision No.</th>
                                                    <th width="auto">Lot No.</th>
                                                    <th width="auto">Wafer No. From</th>
                                                    <th width="auto">Wafer No. To</th>
                                                    <th width="auto">Quantity In</th>
                                                    <th width="auto">NG Count</th>
                                                    <th width="auto">Quantity Out</th>
                                                    <th width="auto">Sampling In</th>
                                                    <th width="auto">Sampling Out</th>
                                                    <th width="auto">Unfinished Qty</th>
                                                </tr>
                                            </thead>
                                            <tbody id="second_table_${data.operator_number}">
                                                 
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div class="col-xl-12 col-lg-12 col-md-12 mx-auto">
                                    <div class="table-responsive overflow-auto text-center" style="margin-top: 5px; max-height: 500px;">
                                        <table class="table border rounded shadow" id="third_table_${data.operator_number}_${data.line_number}">
                                            <thead class="sticky-top">
                                                <tr>
                                                    <th>Line No.</th>
                                                    <th>Parts No.</th>
                                                    <th>Revision No.</th>
                                                    <th>Lot No.</th>
                                                    <th>Wafer Number</th>
                                                    <th>Quantity In</th>
                                                    <th>Quantity NG</th>
                                                    <th>
                                                        <label class="form-check-label" for="checkbox_${data.operator_number}" id="checkbox_label_${data.operator_number}">
                                                            Uncheck All
                                                        </label>
                                                        <input class="form-check-input" type="checkbox" value="" id="checkbox_${data.operator_number}" onclick="onchange_checkbox(${data.operator_number})" onchange="onchange_checkbox(${data.operator_number})" checked>
                                                    </th>
                                                    <th>Good Quantity</th>
                                                    <th>NG Reason</th>
                                                    <th>Remarks</th>
                                                    <th>Operator ID No</th>
                                                </tr>
                                            </thead>
                                            <tbody id="third_table_tbody_${data.operator_number}">
                                               
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                        </div>
                    </div>

                </div>
                `;
                    mainContent.innerHTML += accordion;

                    const addBatchBtn = document.querySelector(`#add_batch_${data.operator_number}`);
                    addBatchBtn.addEventListener('click', () => {
                        event.preventDefault();
                        const second_table = document.querySelector(`#second_table_${data.operator_number}`);
                        // let newLineNumber = parseInt() ++;
                        // newLineNumber ++;
                        data.line_number++;
                        // console.log(newLineNumber)
                        const trBatch = `
                        <tr id="second_table_tr_${data.operator_number}_${data.line_number}">
                            <td>${data.line_number}</td>
                            <td><input id="parts_number_${data.operator_number}_${data.line_number}" type="text" class="form-control" value="" onkeypress="oninput_addBatch(${data.operator_number}, ${data.line_number})" ></td>
                            <td><input id="revision_number_${data.operator_number}_${data.line_number}" type="text" class="form-control" value=""></td>
                            <td><input id="lot_number_${data.operator_number}_${data.line_number}" type="text" class="form-control" value=""></td>
                            <td><input id="wafer_no_from_${data.operator_number}_${data.line_number}" type="text" class="form-control" value=""></td>
                            <td><input id="wafer_no_to_${data.operator_number}_${data.line_number}" onkeydown="onkeydown_wafer_no_to(${data.operator_number}, ${data.line_number})" type="text" class="form-control" value=""></td>
                            <td><input id="qty_in_${data.operator_number}_${data.line_number}" type="number" oninput="oninput_qty_in(${data.operator_number},${data.line_number})" class="form-control" value=""></td>
                            <td>0</td>
                            <td><input id="qty_out_${data.operator_number}_${data.line_number}" type="number" oninput="oninput_qty_out(${data.operator_number},${data.line_number})" class="form-control" value=""></td>
                            <td><input id="sampling_in_${data.operator_number}_${data.line_number}" type="number" oninput="oninput_sampling_in(${data.operator_number}, ${data.line_number})" class="form-control"  value=""></td>
                            <td><input id="sampling_out_${data.operator_number}_${data.line_number}" type="number" oninput="oninput_sampling_out(${data.operator_number}, ${data.line_number})" class="form-control" value=""></td>
                            <td class="text-center" id="unfinished_qty_${data.operator_number}_${data.line_number}" value=""></td>
                            <td class="d-none" id="assignment_id_${data.operator_number}_${data.line_number}" value=""></td>
                        </tr>
                    `;
                        second_table.innerHTML += trBatch;
                        if (localStorage.getItem(`tpc_sub_sampling`) == 'False') {
                            document.getElementById(`sampling_in_${data.operator_number}_${data.line_number}`).value = 0;
                            document.getElementById(`sampling_in_${data.operator_number}_${data.line_number}`).readOnly = true;
                            document.getElementById(`sampling_out_${data.operator_number}_${data.line_number}`).value = 0;
                            document.getElementById(`sampling_out_${data.operator_number}_${data.line_number}`).readOnly = true;
                        }
                        // console.log(second_table);
                    });
                    // console.log(addBatchBtn);
                    // const accordions = document.querySelector(`#accordionExample${data.batch_operator_id}`);
                    // console.log(accordions);
                    //     accordions.addEventListener('shown.bs.collapse', function (e) {
                    //         get_table_data(data.operator_number, data.total_batch_processed);
                    //     });
                }
                const main_content = document.getElementById(`main_content`);
                const accordion_count = main_content.querySelectorAll(`.accordion`).length;
                document.getElementById('total_operator').textContent = `Total Operator: ${accordion_count}`;
            }
        })
        .catch(error => {
            console.log(error.message)
        })
}

function oninput_addBatch(operator_number, line_number) {
    const parts_number_input = document.getElementById(`parts_number_${operator_number}_${line_number}`);
    const revision_number_input = document.getElementById(`revision_number_${operator_number}_${line_number}`);
    const lot_number_input = document.getElementById(`lot_number_${operator_number}_${line_number}`);
    const wafer_from_input = document.getElementById(`wafer_no_from_${operator_number}_${line_number}`);
    const wafer_to_input = document.getElementById(`wafer_no_to_${operator_number}_${line_number}`);
    const assignment_id_input = document.getElementById(`assignment_id_${operator_number}_${line_number}`);
    parts_number_input.addEventListener('keypress', function (e) {
        setTimeout(function () {
            if (e.keyCode == 13 || e.keyCode == 'Enter') {
                // parts_number_input.value = parts_number;
                // revision_number_input.value = revision_number;
                // lot_number_input.value = lot_number;
                const qr_code = parts_number_input.value;
                const code = qr_code.split('|');
                let item_code = code[0];
                let parts_number = code[1];
                let revision_number = code[4];
                let lot_number = code[2];
                let assignment_id = code[5];
                const add_batch_data = new FormData();
                add_batch_data.append('assignment_id', assignment_id);
                add_batch_data.append('SubPid', sub_pid);
                add_batch_data.append('parts_number', parts_number);
                add_batch_data.append('item_code', item_code);
                add_batch_data.append('revision_number', revision_number);
                add_batch_data.append('lot_number', lot_number);
                add_batch_data.append('add_batch', 'true');
                fetch(myFetchURL, {
                    method: 'POST',
                    body: add_batch_data
                })
                    .then(response => response.json())
                    .then(add_batch_data => {
                        console.log(add_batch_data);
                        if (add_batch_data.success) {
                            console.log(add_batch_data.data);
                            for (let data of add_batch_data.data) {
                                parts_number_input.value = data.item_parts_number;
                                revision_number_input.value = data.revision_number;
                                lot_number_input.value = data.lot_number;
                                wafer_from_input.value = data.wafer_number_from;
                                wafer_to_input.value = data.wafer_number_to;
                                assignment_id_input.textContent = data.assignment_id;
                            }
                        }
                        else {
                            swalALert('Error', add_batch_data.message, 'error');
                        }
                    })
                    .catch(error => {
                        console.error(error);
                    });
                // console.log(`parts_number${parts_number}, revision_number${revision_number}, lot_number${lot_number}`);
            }
        }, 700);
    });

}

function addBatch() {
    const addBatchData = new FormData();
    const batch_number = localStorage.getItem('batch_number');
    const item_parts_number = localStorage.getItem('item_parts_number');
    const revision_number = localStorage.getItem('revision_number');
    const lot_number = localStorage.getItem('lot_number');
    let total_batch_processed = localStorage.getItem('total_batch_processed');
    let line_number = 0;
    let operator_number = localStorage.getItem('operator_number');
    const main_content = document.getElementById(`main_content`);
    const accordion_count = main_content.querySelectorAll(`.accordion`).length;
    const total_operator = accordion_count;
    if (total_operator == '0' || total_operator == null || total_operator == 'null' || total_operator == 'undefined') {
        localStorage.removeItem('operator_number');
        operator_number = 1;
    }
    else {
        operator_number++;
    }
    if (line_number == '0' || line_number == null || line_number == 'null' || line_number == 'undefined') {
        localStorage.removeItem('line_number');
        line_number = 1;
    }
    else {
        line_number++;
    }
    if (total_batch_processed == '0' || total_batch_processed == null || total_batch_processed == 'undefined' || total_batch_processed == 'null') {
        localStorage.removeItem('total_batch_processed');
        total_batch_processed = 1;
        // localStorage.setItem('total_batch_processed', total_batch_processed);
        console.log(total_batch_processed);
    }

    addBatchData.append('SubPid', sub_pid);
    addBatchData.append('assignment_id', assign_id);
    addBatchData.append('batch_number', batch_number);
    addBatchData.append('item_parts_number', item_parts_number);
    addBatchData.append('revision_number', revision_number);
    addBatchData.append('lot_number', lot_number);
    addBatchData.append('operator_number', operator_number);
    addBatchData.append('line_number', line_number);
    addBatchData.append('total_batch_processed', total_batch_processed);
    addBatchData.append('addBatch', 'true');

    fetch(myFetchURL, {
        method: 'POST',
        body: addBatchData
    })
        .then(response => response.json())
        .then(datas => {
            console.log(datas);
            if (datas.success) {
                getMainData();
                getData();
            }
            else {
                getMainData();
                getData();
            }
        })
        .catch(error => {
            console.log(error)
        })
}


function save_process_data(operator_number) {
    const second_table_tbody = document.getElementById(`second_table_${operator_number}`);
    const second_tbl_tr = second_table_tbody.querySelectorAll('tr');
    const status = 'Finished';
    const time_end_input = document.getElementById(`time_end_${operator_number}`);
    const time_start_input = document.getElementById(`time_start_${operator_number}`);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const minute_debug = 1;
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    time_end_input.value = formattedDateTime;

    const date1 = new Date(time_start_input.value);
    const date2 = new Date(time_end_input.value);

    // Get the difference in milliseconds
    const diffInMs = date2 - date1;

    // Convert the difference to minutes and round the result
    const diffInMinutes = Math.round(diffInMs / 60000) + minute_debug;
    // console.log(second_tbl_tr);
    // console.log(third_tbl_tr);
    for (let i = 0; i < second_tbl_tr.length; i++) {
        const second_tbl_td_element = second_tbl_tr[i].querySelectorAll('td');
        // console.log(second_tbl_td_element);
        const second_tbl_line_number = second_tbl_td_element[0].textContent;
        const second_tbl_parts_number = second_tbl_td_element[1].querySelector('input').value;
        const second_tbl_revision_number = second_tbl_td_element[2].querySelector('input').value;
        const second_tbl_lot_number = second_tbl_td_element[3].querySelector('input').value;
        const second_tbl_wafer_no_from = second_tbl_td_element[4].querySelector('input').value;
        const second_tbl_wafer_no_to = second_tbl_td_element[5].querySelector('input').value;
        const second_tbl_qty_in = second_tbl_td_element[6].querySelector('input').value;
        const second_tbl_ng_count = second_tbl_td_element[7].textContent;
        const second_tbl_qty_out = second_tbl_td_element[8].querySelector('input').value;
        const second_tbl_sampling_in = second_tbl_td_element[9].querySelector('input').value;
        const second_tbl_sampling_out = second_tbl_td_element[10].querySelector('input').value;
        const second_tbl_unfinished_qty = second_tbl_td_element[11].textContent;
        const second_tbl_assignment_id = second_tbl_td_element[12].textContent;
        const batch_number = localStorage.getItem('batch_number');
        const save_second_tbl_data = new FormData();
        console.log(second_tbl_assignment_id);
        save_second_tbl_data.append(`line_number_${i}`, second_tbl_line_number);
        save_second_tbl_data.append(`parts_number_${i}`, second_tbl_parts_number);
        save_second_tbl_data.append(`revision_number_${i}`, second_tbl_revision_number);
        save_second_tbl_data.append(`lot_number_${i}`, second_tbl_lot_number);
        save_second_tbl_data.append(`wafer_no_from_${i}`, second_tbl_wafer_no_from);
        save_second_tbl_data.append(`wafer_no_to_${i}`, second_tbl_wafer_no_to);
        save_second_tbl_data.append(`qty_in_${i}`, second_tbl_qty_in);
        save_second_tbl_data.append(`ng_count_${i}`, second_tbl_ng_count);
        save_second_tbl_data.append(`qty_out_${i}`, second_tbl_qty_out);
        save_second_tbl_data.append(`sampling_in_${i}`, second_tbl_sampling_in);
        save_second_tbl_data.append(`sampling_out_${i}`, second_tbl_sampling_out);
        save_second_tbl_data.append(`unfinished_qty_${i}`, second_tbl_unfinished_qty);
        save_second_tbl_data.append(`sub_pid`, sub_pid);
        save_second_tbl_data.append(`operator_number`, operator_number);
        save_second_tbl_data.append(`batch_number`, batch_number);
        save_second_tbl_data.append(`time_end`, formattedDateTime);
        save_second_tbl_data.append(`assignment_id`, second_tbl_assignment_id);
        save_second_tbl_data.append(`total_time`, diffInMinutes);
        save_second_tbl_data.append(`operator_status`, status);
        save_second_tbl_data.append('save_second_table_data', 'true');

        fetch(myFetchURL, {
            method: 'POST',
            body: save_second_tbl_data
        })
            .then(response => response.json())
            .then(save_second_tbl_datas => {
                console.log(save_second_tbl_datas);
                if (save_second_tbl_datas.success) {
                    save_third_tbl_data(operator_number);
                }
            })
            .catch(error => {
                console.log(error)
            })
    }
}

function save_third_tbl_data(operator_number) {
    const third_table_tbody = document.getElementById(`third_table_tbody_${operator_number}`);
    const third_tbl_tr = third_table_tbody.querySelectorAll('tr');
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const minute_debug = 1;
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;
    // alert(operator_number);
    for (let j = 0; j < third_tbl_tr.length; j++) {
        const third_tbl_td_element = third_tbl_tr[j].querySelectorAll('td');
        const third_tbl_line_number = third_tbl_td_element[0].textContent;
        const third_tbl_parts_number = third_tbl_td_element[1].textContent;
        const third_tbl_revision_number = third_tbl_td_element[2].textContent;
        const third_tbl_lot_number = third_tbl_td_element[3].textContent;
        const third_tbl_wafer_number = third_tbl_td_element[4].textContent;
        const third_tbl_qty_in = third_tbl_td_element[5].textContent;
        const third_tbl_qty_ng = third_tbl_td_element[6].querySelector('input').value;
        const third_tbl_good_qty = third_tbl_td_element[8].textContent;
        const third_tbl_ng_reason = third_tbl_td_element[9].querySelector('select').value = 'Open this select menu' ? '' : third_tbl_td_element[8].querySelector('select').value;
        const third_tbl_remarks = third_tbl_td_element[10].querySelector('input').value;
        const third_tbl_operator_id_no = third_tbl_td_element[11].textContent;
        const batch_number = localStorage.getItem('batch_number');
        const save_third_tbl_data = new FormData();
        save_third_tbl_data.append(`line_number_${j}`, third_tbl_line_number);
        save_third_tbl_data.append(`parts_number_${j}`, third_tbl_parts_number);
        save_third_tbl_data.append(`revision_number_${j}`, third_tbl_revision_number);
        save_third_tbl_data.append(`lot_number_${j}`, third_tbl_lot_number);
        save_third_tbl_data.append(`wafer_number_${j}`, third_tbl_wafer_number);
        save_third_tbl_data.append(`qty_in_${j}`, third_tbl_qty_in);
        save_third_tbl_data.append(`qty_ng_${j}`, third_tbl_qty_ng);
        save_third_tbl_data.append(`good_qty_${j}`, third_tbl_good_qty);
        save_third_tbl_data.append(`ng_reason_${j}`, third_tbl_ng_reason);
        save_third_tbl_data.append(`remarks_${j}`, third_tbl_remarks);
        save_third_tbl_data.append(`operator_id_no_${j}`, third_tbl_operator_id_no);
        save_third_tbl_data.append(`sub_pid`, sub_pid);
        save_third_tbl_data.append(`operator_number`, operator_number);
        save_third_tbl_data.append(`batch_number`, batch_number);
        save_third_tbl_data.append(`time_end`, formattedDateTime);
        save_third_tbl_data.append(`assignment_id`, assign_id);
        save_third_tbl_data.append(`save_third_table_data`, 'true');
        fetch(myFetchURL, {
            method: 'POST',
            body: save_third_tbl_data
        })
            .then(response => response.json())
            .then(third_table_datas => {
                console.log(third_table_datas);
                if (third_table_datas.success) {
                    getData();
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
}

function start_process(operator_number) {
    // alert(operator_number)
    const second_table_tbody = document.getElementById(`second_table_${operator_number}`);
    const third_table_tbody = document.getElementById(`third_table_tbody_${operator_number}`);
    const main_content = document.getElementById(`main_content`);
    const accordion_count = main_content.querySelectorAll(`.accordion`).length;
    const status = 'Started';
    const time_start_input = document.getElementById(`time_start_${operator_number}`);

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    // const formattedDate = `${month}/${day}/${year}`;
    // const formattedTime = now.toLocaleString("en-US", {
    //     hour: "numeric",
    //     minute: "numeric",
    //     hour12: true,
    // });
    time_start_input.value = formattedDateTime;
    // alert(formattedDateTime + formattedDate + formattedTime);
    const tr = second_table_tbody.querySelectorAll('tr');
    const batch_number = localStorage.getItem('batch_number');
    const id_number = document.getElementById(`operator_id_${operator_number}`).value;
    let new_line_number = 1;
    // console.log(tr.length);
    for (let i = 0; i < tr.length; i++) {
        const td_element = tr[i].querySelectorAll('td');
        // const h5 = `<h5>${lot_number}</h5>`; 
        // third_table_tbody.innerHTML += h5;
        const line_number = td_element[0].textContent;
        const parts_number = td_element[1].querySelector('input').value;
        const revision_number = td_element[2].querySelector('input').value;
        const lot_number = td_element[3].querySelector('input').value;
        const wafer_no_from = td_element[4].querySelector('input').value;
        const wafer_no_to = td_element[5].querySelector('input').value;
        const wafer_number = new_line_number;
        const qty_in = td_element[6].querySelector('input').value;
        const ng_count = td_element[7].textContent ? td_element[7].textContent : '';
        const qty_out = td_element[8].querySelector('input').value;
        const sampling_in = td_element[9].querySelector('input').value;
        const sampling_out = td_element[10].querySelector('input').value;
        const unfinished_qty = td_element[11].textContent ? td_element[11].textContent : '';
        const time_start = time_start_input.value;
        const assign_id = td_element[12].textContent;
        const tr_length = (parseInt(wafer_no_to) - parseInt(wafer_no_from)) + 1;
        if (wafer_no_to < 0 || qty_in < 0) {
            swalALert('Error found!', 'Please dont leave any input fields empty.', 'error');
        }
        else {
            const batch_operator_data = new FormData();
            batch_operator_data.append(`line_number_${i}`, line_number);
            batch_operator_data.append(`parts_number_${i}`, parts_number);
            batch_operator_data.append(`revision_number_${i}`, revision_number);
            batch_operator_data.append(`lot_number_${i}`, lot_number);
            batch_operator_data.append(`wafer_no_from_${i}`, wafer_no_from);
            batch_operator_data.append(`wafer_no_to_${i}`, wafer_no_to);
            batch_operator_data.append(`wafer_number_${i}`, wafer_number);
            batch_operator_data.append(`qty_in_${i}`, qty_in);
            batch_operator_data.append(`ng_count_${i}`, ng_count);
            batch_operator_data.append(`qty_out_${i}`, qty_out);
            batch_operator_data.append(`sampling_in_${i}`, sampling_in);
            batch_operator_data.append(`sampling_out_${i}`, sampling_out);
            batch_operator_data.append(`unfinished_qty_${i}`, unfinished_qty);
            batch_operator_data.append(`time_start`, time_start);
            batch_operator_data.append(`total_batch_processed`, tr.length);
            batch_operator_data.append(`assignment_id`, assign_id);
            batch_operator_data.append(`id_number`, id_number);
            batch_operator_data.append(`sub_pid`, sub_pid);
            batch_operator_data.append(`operator_number`, operator_number);
            batch_operator_data.append(`batch_number`, batch_number);
            batch_operator_data.append(`operator_status`, status);
            batch_operator_data.append(`save_batch_operator_data`, 'true');

            fetch(myFetchURL, {
                method: 'POST',
                body: batch_operator_data
            })
                .then(response => response.json())
                .then(datas => {
                    console.log(datas);
                    if (accordion_count <= 1) {
                        let wafer_line_number = wafer_no_from;
                        for (let j = 0; j < tr_length; j++) {
                            const line_number = td_element[0].textContent;
                            const parts_number = td_element[1].querySelector('input').value;
                            const revision_number = td_element[2].querySelector('input').value;
                            const lot_number = td_element[3].querySelector('input').value;
                            const wafer_no_from = td_element[4].querySelector('input').value;
                            const wafer_no_to = td_element[5].querySelector('input').value;
                            const wafer_number = wafer_line_number;
                            const qty_in = td_element[6].querySelector('input').value;
                            const ng_count = td_element[7].textContent ? td_element[7].textContent : '';
                            const qty_out = td_element[8].querySelector('input').value;
                            const sampling_in = td_element[9].querySelector('input').value;
                            const sampling_out = td_element[10].querySelector('input').value;
                            const unfinished_qty = td_element[11].textContent ? td_element[11].textContent : '';
                            const batch_process_data = new FormData();
                            batch_process_data.append(`line_number_${j}`, line_number);
                            batch_process_data.append(`parts_number_${j}`, parts_number);
                            batch_process_data.append(`revision_number_${j}`, revision_number);
                            batch_process_data.append(`lot_number_${j}`, lot_number);
                            batch_process_data.append(`wafer_number_${j}`, wafer_number);
                            // batch_process_data.append(`wafer_no_to_${j}`, wafer_no_to);
                            batch_process_data.append(`qty_in_${j}`, qty_in);
                            batch_process_data.append(`ng_count_${j}`, ng_count);
                            batch_process_data.append(`qty_out_${j}`, qty_out);
                            batch_process_data.append(`sampling_in_${j}`, sampling_in);
                            batch_process_data.append(`sampling_out_${j}`, sampling_out);
                            batch_process_data.append(`unfinished_qty_${j}`, unfinished_qty);
                            batch_process_data.append(`operator_number_${j}`, operator_number);
                            batch_process_data.append(`batch_number_${j}`, batch_number);
                            batch_process_data.append(`sub_pid_${j}`, sub_pid);
                            batch_process_data.append(`id_number`, id_number);
                            batch_process_data.append(`accordion_count`, accordion_count);
                            batch_process_data.append('save_batch_process', 'true');
                            new_line_number++;
                            wafer_line_number++;
                            fetch(myFetchURL, {
                                method: 'POST',
                                body: batch_process_data
                            })
                                .then(response => response.json())
                                .then(datas => {
                                    console.log(datas);
                                    if (datas.success) {
                                        getData();
                                        // console.log(datas.data);
                                    }
                                })
                                .catch(error => {
                                    console.log(error)
                                })
                        }
                    }
                    else {
                        getData();
                    }
                })
                .catch(error => {
                    console.log(error)
                })
        }

        // console.log(wafer_no_to);
        // for(let waferFrom = wafer_no_from; waferFrom <= wafer_no_to; waferFrom ++)
        // {

        // const tr = 
        // `
        //     <tr>
        //         <td>${new_line_number}</td>
        //         <td>${parts_number}</td>
        //         <td>${revision_number}</td>
        //         <td>${lot_number}</td>
        //         <td>${wafer_no_from}</td>
        //         <td>1</td>
        //         <td><input type="number" class="form-control"></td>
        //         <td><input class="form-check-input mx-auto" type="checkbox" value="" id="flexCheckDefault" checked></td>
        //         <td></td>
        //         <td>
        //             <select class="form-select" aria-label="Default select example">
        //                 <option selected>Open this select menu</option>
        //                 <option value="1">One</option>
        //                 <option value="2">Two</option>
        //                 <option value="3">Three</option>
        //             </select>
        //         </td>
        //         <td><input type="text" class="form-control"></td>
        //         <td>31444</td>
        //     </tr>
        //     `;
        //     new_line_number ++;
        //     third_table_tbody.innerHTML += tr;
        // }
    }
    console.log();
}

function get_table_data(operator_number, total_batch_processed) {
    const accordion = document.getElementById(`collapseOne${operator_number}`);
    const second_table_tbody = document.getElementById(`second_table_${operator_number}`);
    const third_table_tbody = document.getElementById(`third_table_tbody_${operator_number}`);
    accordion.addEventListener('shown.bs.collapse', function (e) {
        // second_table_tbody.innerHTML = '';
        const batch_number = localStorage.getItem('batch_number');
        console.log(batch_number);
        const main_content = document.getElementById(`main_content`);
        const accordion_count = main_content.querySelectorAll(`.accordion`).length;
        const get_secondtable_data = new FormData();
        get_secondtable_data.append('sub_pid', sub_pid);
        get_secondtable_data.append('batch_number', batch_number);
        get_secondtable_data.append('operator_number', operator_number);
        get_secondtable_data.append('total_batch_processed', total_batch_processed ? total_batch_processed : 1);
        get_secondtable_data.append('assignment_id', assign_id);
        get_secondtable_data.append('get_secondtable_data', 'true');
        fetch(myFetchURL, {
            method: 'POST',
            body: get_secondtable_data
        })
            .then(response => response.json())
            .then(second_table_datas => {
                console.log(second_table_datas);
                if (second_table_datas[0] != 0) {
                    if (localStorage.getItem('operator_status') == 'Started') {
                        var seconds = (second_table_datas.length * 1000)
                        console.log(seconds);
                        let timerInterval
                        Swal.fire({
                            title: 'Fetching Data!',
                            html: '<p class="lead">Fetching the latest operator data. Please be patient, as this may take a few moments.</p>',
                            timer: seconds,
                            timerProgressBar: true,
                            didOpen: () => {
                                Swal.showLoading()
                                // const b = Swal.getHtmlContainer().querySelector('b')
                                timerInterval = setInterval(() => {
                                    // b.textContent = Swal.getTimerLeft()
                                }, 100)
                            },
                            willClose: () => {
                                clearInterval(timerInterval)
                            }
                        }).then((result) => {
                            /* Read more about handling dismissals below */
                            if (result.dismiss === Swal.DismissReason.timer) {
                                swalALert("Data Fetched", "Done! Thanks for being patient ;)", "success");
                            }
                        })
                    }
                    for (let data of second_table_datas) {
                        localStorage.setItem('operator_status', data.operator_status);
                        const tr = `<tr id="second_table_tr_${data.operator_number}_${data.line_number}">
                                <td>${data.line_number ? data.line_number : '1'}</td>
                                <td><input id="parts_number_${data.operator_number}_${data.line_number}"  type="text" class="form-control bg-light" value="${data.parts_number ? data.parts_number : localStorage.getItem('item_parts_number')}" style="width:${data.parts_number.length + 4}ch" readonly></td>
                                <td><input id="revision_number_${data.operator_number}_${data.line_number}" type="number" class="form-control bg-light" value="${data.revision_number ? data.revision_number : localStorage.getItem('revision_number')}"  readonly></td>
                                <td><input id="lot_number_${data.operator_number}_${data.line_number}" type="text" class="form-control bg-light" value="${data.lot_number ? data.lot_number : localStorage.getItem('lot_number')}" style="width:${data.lot_number.length + 4}ch" readonly></td>
                                <td><input id="wafer_no_from_${data.operator_number}_${data.line_number}" type="number" class="form-control bg-light" value="${data.wafer_number_from ? data.wafer_number_from : data.wafer_number_from ? data.wafer_number_from : ''}" style="width: 5ch"></td>
                                <td><input id="wafer_no_to_${data.operator_number}_${data.line_number}" type="number" class="form-control bg-light" onkeydown="onkeydown_wafer_no_to(${data.operator_number}, ${data.line_number})" value="${data.wafer_number_to ? data.wafer_number_to : data.wafer_number_to ? data.wafer_number_to : ''}" style="width:5ch"></td>
                                <td><input id="qty_in_${data.operator_number}_${data.line_number}" type="number" class="form-control " value="${data.quantity_in ? data.quantity_in : ''}" oninput="oninput_qty_in(${data.operator_number},${data.line_number})"></td>
                                <td id="ng_count_${data.operator_number}_${data.line_number}">${data.quantity_ng ? data.quantity_ng : '0'}</td>
                                <td><input id="qty_out_${data.operator_number}_${data.line_number}" type="number" oninput="oninput_qty_out(${data.operator_number},${data.line_number})" class="form-control bg-light" value="${data.quantity_out ? data.quantity_out : ''}"></td>
                                <td><input id="sampling_in_${data.operator_number}_${data.line_number}" type="number" class="form-control" value="${data.sampling_in ? data.sampling_in : ''}"  oninput="oninput_sampling_in(${data.operator_number}, ${data.line_number})"></td>
                                <td><input id="sampling_out_${data.operator_number}_${data.line_number}" type="number" class="form-control bg-light" value="${data.sampling_out ? data.sampling_out : ''}" oninput="oninput_sampling_out(${data.operator_number}, ${data.line_number})"></td>
                                <td class="text-center" id="unfinished_qty_${data.operator_number}_${data.line_number}">${data.quantity_unfinished ? data.quantity_unfinished : ''}</td>
                                <td class="d-none">${data.assignment_id}</td>
                            </tr>`;
                        second_table_tbody.innerHTML += tr;
                        // alert(localStorage.getItem('operator_number'));
                        console.log(localStorage.getItem(`tpc_sub_result_type`));
                        if (data.operator_status == "Started") {
                            disableStartBtn(data.operator_number);
                            enableEndBtn(data.operator_number);
                            enableSaveBtn(data.operator_number);
                            disableAddBatchBtn(data.operator_number);
                            disableSecondTable(data.operator_number, "Started");
                            // disableThirdTable(data.operator_number, "Started");
                        }
                        else if (data.operator_status == "Finished") {
                            disableStartBtn(data.operator_number);
                            disableAddBatchBtn(data.operator_number);
                            disableEndBtn(data.operator_number);
                            disableSaveBtn(data.operator_number);
                            disableSecondTable(data.operator_number, "Finished");
                            // disableThirdTable(data.operator_number, "Finished");
                        }
                        else {
                            enableStartBtn(data.operator_number);
                            enableAddBatchBtn(data.operator_number);
                            disableEndBtn(data.operator_number);
                            disableSaveBtn(data.operator_number);
                            getQtyIn(data.operator_number, data.line_number);
                            // if (localStorage.getItem(`tpc_sub_result_type`) == 'Wafer') {
                            //     getNGWafer(data.operator_number);

                            // }
                        }
                        localStorage.setItem('line_number', data.line_number);
                        localStorage.setItem('parts_number', data.parts_number);
                        localStorage.setItem('revision_number', data.revision_number);
                        localStorage.setItem('lot_number', data.lot_number);
                        localStorage.setItem('operator_status', data.operator_status);
                        // console.log(localStorage.getItem('line_number'));

                        if (localStorage.getItem(`tpc_sub_sampling`) == 'False') {
                            document.getElementById(`sampling_in_${data.operator_number}_${data.line_number}`).value = 0;
                            document.getElementById(`sampling_in_${data.operator_number}_${data.line_number}`).readOnly = true;
                            document.getElementById(`sampling_out_${data.operator_number}_${data.line_number}`).value = 0;
                            document.getElementById(`sampling_out_${data.operator_number}_${data.line_number}`).readOnly = true;
                        }

                    }
                    // console.log(localStorage.getItem(`tpc_sub_sampling`));
                    get_third_tbl(operator_number, accordion_count, batch_number);
                }
                // else {
                //     second_table_tbody.innerHTML = '';
                // }
            })
            .catch(error => {
                console.log(error)
            });
        // console.log('Accordion panel shown:', e.target);

    });
    accordion.addEventListener('hidden.bs.collapse', function (e) {
        // console.log('Accordion panel hidden:', e.target);
        second_table_tbody.innerHTML = '';
        third_table_tbody.innerHTML = '';
        getData();
    });

}

function get_third_tbl(operator_number, accordion_count, batch_number) {
    const second_table_tbody = document.getElementById(`second_table_${operator_number}`);
    const third_table_tbody = document.getElementById(`third_table_tbody_${operator_number}`);
    const second_table_tr = second_table_tbody.querySelectorAll(`tr`);
    console.log(second_table_tbody);
    for (let i = 0; i < second_table_tr.length; i++) {
        const td_element = second_table_tr[i].querySelectorAll('td');
        const line_number = td_element[0].textContent;
        const parts_number = td_element[1].querySelector('input').value;
        const revision_number = td_element[2].querySelector('input').value;
        const lot_number = td_element[3].querySelector('input').value;
        const wafer_from = td_element[4].querySelector('input').value;
        const wafer_to = td_element[5].querySelector('input').value;
        // const total_qty = td_element[6].querySelector('input').value;
        // const allocated_qty = td_element[7].textContent;
        // const unallocated_qty = td_element[8].textContent;
        // const total_sampling_in = td_element[9].textContent;
        // const total_sampling_out = td_element[10].textContent;
        let limit = parseInt(wafer_to) - parseInt(wafer_from) + 1;
        console.log(`line_number${line_number}, parts_number ${parts_number}, revision_number ${revision_number}, lot_number ${lot_number}, limit${limit}`);
        const assignment_id = td_element[12].textContent;
        const get_thirdtable_data = new FormData();
        get_thirdtable_data.append('line_number', line_number);
        get_thirdtable_data.append('parts_number', parts_number);
        get_thirdtable_data.append('revision_number', revision_number);
        get_thirdtable_data.append('lot_number', lot_number);
        get_thirdtable_data.append('sub_pid', sub_pid);
        get_thirdtable_data.append('batch_number', batch_number);
        get_thirdtable_data.append('operator_number', operator_number);
        get_thirdtable_data.append('accordion_count', accordion_count);
        get_thirdtable_data.append('get_thirdtable_data', 'true');
        fetch(myFetchURL, {
            method: 'POST',
            body: get_thirdtable_data
        })
            .then(response => response.json())
            .then(third_table_datas => {
                console.log('TIDHIRD TALBE');
                console.log(third_table_datas);
                // third_table_tbody.innerHTML = '';
                if (third_table_datas[0] != 0) {
                    let myPromise = new Promise(function (myResolve, myReject) {
                        let x = 0;
                        if (x == 0) {
                            myResolve(true);
                        } else {
                            myReject(false);
                        }
                    });

                    myPromise.then(
                        function (value) { getNGWafer(operator_number, line_number, limit, localStorage.getItem('sequence_number'), value); },
                        function (error) { getNGWafer(operator_number, line_number, limit, localStorage.getItem('sequence_number'), error); }
                    );
                    let new_line_number = 1;
                    var line_number = third_table_datas[0].line_number;
                    var h5 = `<h5>${third_table_datas[0].lot_number}</h5>`;
                    third_table_tbody.innerHTML += h5;
                    for (let data of third_table_datas) {
                        if (line_number < data.line_number) {
                            h5 = `<h5>${data.lot_number}</h5>`;

                            third_table_tbody.innerHTML += h5;
                            line_number = data.line_number;
                        }
                        const tr =
                            `<tr id="third_table_tr_${data.line_number}_${data.wafer_number}_${operator_number}">
                                <td>${new_line_number}</td>
                                <td style="width:${data.parts_number.length + 5}ch">${data.parts_number}</td>
                                <td style="width:${data.revision_number.length + 2}ch">${data.revision_number}</td>
                                <td>${data.lot_number}</td>
                                <td>${data.wafer_number}</td>
                                <td id="qty_in_${data.line_number}_${data.wafer_number}_${operator_number}">${data.quantity_in ? data.quantity_in : '1'}</td>
                                <td style="width:4ch"><input type="number" class="form-control qtyNG_${data.line_number}_${operator_number}" value="${data.quantity_ng ? data.quantity_ng : '0'}" oninput="oninput_qty_ng(${data.line_number}, ${data.wafer_number}, ${operator_number})" id="qtyng_${data.line_number}_${data.wafer_number}_${operator_number}"></td>
                                <td><input class="form-check-input mx-auto checkbox checkbox_${data.line_number}" type="checkbox" value="1" onchange="checkbox_click(${data.line_number},${data.wafer_number},${operator_number})" id="checkbox_${data.line_number}_${data.wafer_number}_${operator_number}" checked></td>
                                <td id="good_count_${data.line_number}_${data.wafer_number}_${operator_number}">${data.quantity_good ? data.quantity_good : '1'}</td>
                                <td> 
                                    <select class="form-select" aria-label="Default select example" id="select_${data.line_number}_${data.wafer_number}_${operator_number}">
                                        <option selected>${data.ng_reason ? data.ng_reason : 'Open this select menu'}</option>
                                    </select>
                                </td>
                                <td><input type="text" class="form-control" value="${data.batch_item_remarks ? data.batch_item_remarks : ''}" id="remarks_${data.line_number}_${data.wafer_number}_${operator_number}"></td>
                                <td id="operator_id_no_${data.line_number}_${data.wafer_number}_${operator_number}">${data.id_number ? data.id_number : document.getElementById(`operator_id_${operator_number}`).value ? document.getElementById(`operator_id_${operator_number}`).value : ''} </td>
                            </tr>`;
                        new_line_number++;
                        third_table_tbody.innerHTML += tr;
                        if (localStorage.getItem(`operator_status`) == 'Started') {
                            if (localStorage.getItem(`tpc_sub_result_type`) == 'Chips') {
                                document.getElementById(`qty_in_${data.line_number}_${data.wafer_number}_${operator_number}`).textContent = document.getElementById(`qty_in_${data.operator_number}_${data.line_number}`).value;
                                // console.log(document.getElementById(`qty_in_${data.operator_number}_${data.line_number}`).value);
                                document.getElementById(`good_count_${data.line_number}_${data.wafer_number}_${operator_number}`).textContent = document.getElementById(`qty_in_${data.operator_number}_${data.line_number}`).value;
                            }
                        }
                        if (data.quantity_ng > 0) {
                            document.getElementById(`third_table_tr_${data.line_number}_${data.wafer_number}_${operator_number}`).classList.add('table-secondary');
                        }
                        // alert(`THIRD ID${data.operator_status}`);
                        if (accordion_count > 1 && (localStorage.getItem('operator_status') == 'Started' || localStorage.getItem('operator_status') == 'Undefined' || localStorage.getItem('operator_status') == '')) {
                            if (data.id_number > 0) {
                                document.getElementById(`third_table_tr_${data.line_number}_${data.wafer_number}_${operator_number}`).classList.add('table-secondary');
                                document.querySelector(`#checkbox_${data.line_number}_${data.wafer_number}_${operator_number}`).disabled = true;
                                document.getElementById(`qtyng_${data.line_number}_${data.wafer_number}_${operator_number}`).setAttribute('readonly', true);
                                document.getElementById(`select_${data.line_number}_${data.wafer_number}_${operator_number}`).setAttribute('readonly', true);
                                document.getElementById(`remarks_${data.line_number}_${data.wafer_number}_${operator_number}`).setAttribute('readonly', true);
                                document.getElementById(`qty_in_${data.line_number}_${data.wafer_number}_${operator_number}`).setAttribute('readonly', true);
                                document.getElementById(`good_count_${data.line_number}_${data.wafer_number}_${operator_number}`).setAttribute('readonly', true);
                            }
                            if (data.id_number <= 0) {
                                const check = document.querySelectorAll(`.checkbox_${data.line_number}:not([readonly]):not([disabled])`);
                                for (let ch of check) {
                                    ch.checked = false;
                                }
                                const qtyNG = document.querySelectorAll(`.qtyNG_${data.line_number}_${operator_number}:not([readonly]):not([disabled])`);
                                for (let input of qtyNG) {
                                    input.value = '0';
                                    input.disabled = true;
                                }
                            }
                        }

                        if (localStorage.getItem('operator_status') == "Finished") {
                            document.getElementById(`third_table_tr_${data.line_number}_${data.wafer_number}_${operator_number}`).classList.add('table-secondary');
                            document.querySelector(`#checkbox_${data.line_number}_${data.wafer_number}_${operator_number}`).disabled = true;
                            document.getElementById(`qtyng_${data.line_number}_${data.wafer_number}_${operator_number}`).setAttribute('disabled', true);
                            document.getElementById(`select_${data.line_number}_${data.wafer_number}_${operator_number}`).setAttribute('disabled', true);
                            document.getElementById(`remarks_${data.line_number}_${data.wafer_number}_${operator_number}`).setAttribute('disabled', true);
                            document.getElementById(`qty_in_${data.line_number}_${data.wafer_number}_${operator_number}`).setAttribute('disabled', true);
                            document.getElementById(`good_count_${data.line_number}_${data.wafer_number}_${operator_number}`).setAttribute('disabled', true);
                        }
                        // const thisTR = document.getElementById(`third_table_tr_${data.line_number}_${data.wafer_number}_${operator_number}`);
                        // const thisQtyNG = thisTR.querySelector(`#qtyng_${data.line_number}_${data.wafer_number}_${operator_number}`);
                        // console.log(thisQtyNG.value);

                        // if (localStorage.getItem(`tpc_sub_result_type`) === "Wafer" && localStorage.getItem('sequence_number') > 1 && localStorage.getItem(`operator_status`) === "Started") {
                        //     console.log(localStorage.getItem('sequence_number'));
                        //     getNGWafer(operator_number, line_number, limit, localStorage.getItem('sequence_number'));
                        //     // const tr = document.getElementById(`third_table_tr_${data.line_number}_${data.wafer_number}_${data.operator_number}`);
                        //     // const qty_ng = tr.querySelector(`#qtyng_${data.line_number}_${data.wafer_number}_${operator_number}`);
                        //     // console.log(qty_ng);
                        // }
                        // else
                        // {
                        //     console.log(localStorage.getItem(`sequence_number`));
                        // }
                    }
                }
                else {
                    console.log('WALAY SUD');
                }

            })
            .catch(error => {
                console.error(error)
            })
    }
}

function save_time_end(operator_number) {
    const time_end_input = document.getElementById(`time_end_${operator_number}`);
    const time_start_input = document.getElementById(`time_start_${operator_number}`);
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const minute_debug = 1;
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    time_end_input.value = formattedDateTime;

    const date1 = new Date(time_start_input.value);
    const date2 = new Date(time_end_input.value);

    // Get the difference in milliseconds
    const diffInMs = date2 - date1;

    // Convert the difference to minutes and round the result
    const diffInMinutes = Math.round(diffInMs / 60000) + minute_debug;
    const batch_number = localStorage.getItem('batch_number');
    const update_batch_process_data = new FormData();
    update_batch_process_data.append(`sub_pid`, sub_pid);
    update_batch_process_data.append(`operator_number`, operator_number);
    update_batch_process_data.append(`batch_number`, batch_number);
    update_batch_process_data.append(`time_end`, formattedDateTime);
    update_batch_process_data.append(`assignment_id`, assign_id);
    update_batch_process_data.append(`total_time`, diffInMinutes);
    update_batch_process_data.append('update_batch_process_data', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: update_batch_process_data
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            if (data.success) {
                document.getElementById(`save_button_${operator_number}`).click();
            }
        })
        .catch(error => {
            console.error(error);
        })
}

function onkeydown_wafer_no_to(operator_number, line_number) {
    if (localStorage.getItem('tpc_sub_result_type') == 'Wafer') {
        const wafer_from = document.getElementById(`wafer_no_from_${operator_number}_${line_number}`);
        const wafer_to = document.getElementById(`wafer_no_to_${operator_number}_${line_number}`);
        wafer_to.addEventListener("keypress", function (event) {
            if (event.key == "Enter") {
                event.preventDefault();
                // if(localStorage.getItem('tpc_sub_uncontrolled') == 'False')
                // {
                document.getElementById(`qty_in_${operator_number}_${line_number}`).readOnly = false;
                document.getElementById(`qty_in_${operator_number}_${line_number}`).value = parseInt(wafer_to.value) - parseInt(wafer_from.value) + 1;
                // }
                // else
                // {
                // document.getElementById(`qty_in_${operator_number}_${line_number}`).readOnly = true;
                // }
            }
        })
    }
    else {
        const wafer_from = document.getElementById(`wafer_no_from_${operator_number}_${line_number}`);
        const wafer_to = document.getElementById(`wafer_no_to_${operator_number}_${line_number}`);
        wafer_to.addEventListener("keypress", function (event) {
            if (event.key == "Enter") {
                event.preventDefault();
                if (parseInt(wafer_to.value) != parseInt(wafer_from.value)) {
                    swalALert('Error', 'The expected result is in the form of [CHIPS]. Please provide the correct data.', 'info');
                }
                if (localStorage.getItem('tpc_sub_uncontrolled') == 'False') {
                    document.getElementById(`qty_in_${operator_number}_${line_number}`).readOnly = false;
                }
                else {
                    document.getElementById(`qty_in_${operator_number}_${line_number}`).readOnly = true;
                    document.getElementById(`qty_in_${operator_number}_${line_number}`).value = 0;
                }
            }
        })
    }
    if (localStorage.getItem(`tpc_sub_sampling`) == 'True') {
        document.getElementById(`sampling_in_${operator_number}_${line_number}`).value = document.getElementById(`qty_in_${operator_number}_${line_number}`).value;
    }
    else {
        document.getElementById(`sampling_in_${operator_number}_${line_number}`).value = 0;
    }
}


function oninput_sampling_in(operator_number, line_number) {
    const sampling_in = document.getElementById(`sampling_in_${operator_number}_${line_number}`);
    const qty_in = document.getElementById(`qty_in_${operator_number}_${line_number}`);

    if (parseInt(sampling_in.value) > parseInt(qty_in.value)) {
        const title = 'Eror';
        const message = 'Please ensure that the quantity of sampling in does not exceed the total quantity in.';
        const icon = 'error';
        swalALert(title, message, icon);
        disableStartBtn(operator_number);
    }
    else if (isNaN(parseInt(sampling_in.value)) || parseInt(sampling_in.value) < 0) {
        const title = 'Eror';
        const message = 'Sampling in must be greater than or equal to zero[0].';
        const icon = 'error';
        swalALert(title, message, icon);
        disableStartBtn(operator_number);
    }
    else {
        enableStartBtn(operator_number);
    }
}

function oninput_sampling_out(operator_number, line_number) {
    const sampling_in = document.getElementById(`sampling_in_${operator_number}_${line_number}`);
    const sampling_out = document.getElementById(`sampling_out_${operator_number}_${line_number}`);
    if (localStorage.getItem(`tpc_sub_uncontrolled`)) {
        sampling_in.value = parseInt(sampling_out.value);
    }
    else {
        if (parseInt(sampling_out.value) > parseInt(sampling_in.value)) {
            const title = 'Eror';
            const message = 'Sampling out quantity must not exceed Sampling in quantity.';
            const icon = 'error';
            swalALert(title, message, icon);
            disableEndBtn(operator_number);
            disableSaveBtn(operator_number);
        }
        else if (isNaN(parseInt(sampling_out.value)) || parseInt(sampling_out.value) < 0) {
            const title = 'Eror';
            const message = 'Sampling out must be greater than or equal to zero[0].';
            const icon = 'error';
            swalALert(title, message, icon);
            disableEndBtn(operator_number);
            disableSaveBtn(operator_number);
        }
        else {
            enableEndBtn(operator_number);
            enableSaveBtn(operator_number);
        }
    }

}

function oninput_qty_ng(line_number, wafer_number, operator_number) {
    const qtyNG = document.querySelectorAll(`.qtyNG_${line_number}_${operator_number}:not([readonly]):not([disabled])`);
    const qty_out_input = document.getElementById(`qty_out_${operator_number}_${line_number}`);
    const qtyng_input = document.getElementById(`qtyng_${line_number}_${wafer_number}_${operator_number}`);
    const qty_good = document.getElementById(`good_count_${line_number}_${wafer_number}_${operator_number}`);
    const qty_ng_input = document.getElementById(`ng_count_${operator_number}_${line_number}`);
    const select = document.getElementById(`select_${line_number}_${wafer_number}_${operator_number}`);
    const qty_in_input = document.getElementById(`qty_in_${operator_number}_${line_number}`);
    const qty_in = document.getElementById(`qty_in_${line_number}_${wafer_number}_${operator_number}`);
    if (localStorage.getItem('tpc_sub_result_type') == 'Wafer') {
        let good_qty = parseInt(qty_in.textContent) - parseInt(qtyng_input.value);
        // console.log(qtyNG);
        if (isNaN(good_qty)) {
            good_qty = 0;
        }
        if (qtyng_input.value == '1' || qtyng_input.value > 1) {
            qtyng_input.value = 1;
            qty_good.textContent = 0;
            getNgReason(line_number, wafer_number, operator_number);
        }
        else {
            select.innerHTML = '';
            qty_good.textContent = good_qty;
        }
        let ng_count = 0;
        let good_count = 0;
        for (let input of qtyNG) {
            if (input.value == '0' || input.value == '0.00') {
                good_count++;
            }
            else {
                ng_count++;
            }
        }
        qty_out_input.value = good_count;
        qty_ng_input.textContent = ng_count;
    }
    else {
        if (parseInt(qtyng_input.value) > parseInt(qty_in_input.value)) {
            swalALert('Warning!', 'Please revise the quantity of NG accordingly to ensure that the total quantity does not exceed the available quantity.', 'warning');
            disableEndBtn(operator_number);
            disableSaveBtn(operator_number);
        }
        else {
            qty_in.textContent = parseInt(qty_in_input.value);
            qty_out_input.value = parseInt(qty_in_input.value) - parseInt(qtyng_input.value);
            qty_good.textContent = qty_out_input.value;
            qty_ng_input.textContent = parseInt(qtyng_input.value)
            enableEndBtn(operator_number);
            enableSaveBtn(operator_number);
        }
    }
}

function checkbox_click(line_number, wafer_number, operator_number) {
    if (localStorage.getItem('tpc_sub_result_type') == 'Wafer') {
        const third_table_tr = document.querySelector(`#third_table_tr_${line_number}_${wafer_number}_${operator_number}`);
        const checkbox = document.querySelector(`#checkbox_${line_number}_${wafer_number}_${operator_number}`);
        const third_tbl_qty_ng_input = document.getElementById(`qtyng_${line_number}_${wafer_number}_${operator_number}`);
        const third_tbl_select = document.getElementById(`select_${line_number}_${wafer_number}_${operator_number}`)
        const third_tbl_remarks = document.getElementById(`remarks_${line_number}_${wafer_number}_${operator_number}`);
        const third_tbl_qty_in = document.getElementById(`qty_in_${line_number}_${wafer_number}_${operator_number}`);
        const third_tbl_qty_out = document.getElementById(`good_count_${line_number}_${wafer_number}_${operator_number}`);
        const third_tbl_operator_no = document.getElementById(`operator_id_no_${line_number}_${wafer_number}_${operator_number}`);
        const second_tbl_qty_unfinished = document.getElementById(`unfinished_qty_${operator_number}_${line_number}`);
        const checkboxes = document.querySelectorAll(`input[type="checkbox"].checkbox_${line_number}:not([readonly]):not([disabled])`);
        const operator_id = document.getElementById(`operator_id_${operator_number}`).value;
        const qty_in = document.getElementById(`qty_in_${operator_number}_${line_number}`);
        const qty_out = document.getElementById(`qty_out_${operator_number}_${line_number}`);
        let checked_count = 0;
        let unchecked_count = 0;
        // console.log(checkboxes);
        for (let i = 0; i < checkboxes.length; i++) {
            console.log(checkboxes[i].checked);
            if (checkboxes[i].checked) {
                checked_count++;
            }
            else {
                unchecked_count++;
            }
        }
        second_tbl_qty_unfinished.textContent = unchecked_count;
        // console.log(`checked for  line ${line_number} B===D ${unchecked_count}`);
        if (checkbox.checked) {
            console.log(checkbox.value);
            third_tbl_qty_ng_input.disabled = false;
            third_tbl_qty_ng_input.value = 0;
            third_tbl_qty_in.textContent = 1;
            third_tbl_qty_out.textContent = 1;
            third_tbl_operator_no.textContent = operator_id;
            third_tbl_select.disabled = false;
            third_tbl_remarks.disabled = false;
            third_table_tr.classList.remove('table-secondary');
            // console.log(third_table_tr);
            // // alert(checkbox.checked);
            // console.log(checkbox.checked);

        }
        else {
            console.log(checkbox.value);
            third_tbl_qty_ng_input.disabled = true;
            third_tbl_select.disabled = true;
            third_tbl_qty_ng_input.value = '';
            third_tbl_qty_in.textContent = '';
            third_tbl_qty_out.textContent = '';
            third_tbl_operator_no.textContent = '';
            third_tbl_select.innerHTML = '';
            third_tbl_remarks.disabled = true;
            third_table_tr.classList.add('table-secondary');
            // console.log(third_table_tr);
            // console.log(checkbox.checked);
            // alert(checkbox.checked);
        }
        console.log(`checked_count: ${checked_count}, unchecked_count: ${unchecked_count}`);
        qty_out.value = checked_count;
        console.log(`#third_table_tr_${line_number}_${wafer_number}_${operator_number}`);
    }
}

function onchange_checkbox(operator_number) {
    const checkAllCheckbox = document.getElementById(`checkbox_${operator_number}`);
    const checkboxes = document.querySelectorAll('input[type="checkbox"].checkbox:not([disabled])');

    checkAllCheckbox.addEventListener('change', function () {
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = this.checked;
            // checkboxes[i].checked = true;
        }
        if (checkAllCheckbox.checked) {
            document.getElementById(`checkbox_label_${operator_number}`).textContent = 'Uncheck All';
        }
        else {
            document.getElementById(`checkbox_label_${operator_number}`).textContent = 'Check All';
        }
    });
}

function oninput_qty_out(operator_number, line_number) {
    if (localStorage.getItem(`tpc_sub_uncontrolled`)) {
        const wafer_number = 1;
        const qty_in = document.getElementById(`qty_in_${operator_number}_${line_number}`);
        const qty_out = document.getElementById(`qty_out_${operator_number}_${line_number}`);
        const quantity_in = document.getElementById(`qty_in_${line_number}_${wafer_number}_${operator_number}`);
        const good_count = document.getElementById(`good_count_${line_number}_${wafer_number}_${operator_number}`);
        qty_in.value = parseInt(qty_out.value)
        quantity_in.textContent = parseInt(qty_out.value);
        good_count.textContent = parseInt(qty_out.value);
    }
}


function oninput_qty_in(operator_number, line_number) {
    const waferTo = document.getElementById(`wafer_no_to_${operator_number}_${line_number}`);
    const qty_in = document.getElementById(`qty_in_${operator_number}_${line_number}`);

    if (localStorage.getItem('tpc_sub_result_type') == 'Wafer') {
        if (parseFloat(qty_in.value) > parseInt(waferTo.value)) {
            const title = 'Error';
            const message = 'Quantity in must match the overall wafer count.';
            const icon = 'error';
            swalALert(title, message, icon);
            disableStartBtn(operator_number);
        }
        else if (parseFloat(qty_in.value) < 0 || isNaN(parseFloat(qty_in.value))) {
            const title = 'Error';
            const message = 'Quantity in must be greater than or equal to zero[0].';
            const icon = 'error';
            swalALert(title, message, icon);
            disableStartBtn(operator_number);
        }
        else {
            enableStartBtn(operator_number);
        }
    }
}
function getQtyIn(operator_number, line_number) {
    const batch_number = localStorage.getItem('batch_number');
    const assignment_id = assign_id;
    const sequence_number = localStorage.getItem('sequence_number');
    const parts_number = localStorage.getItem('item_parts_number');
    const revision_number = localStorage.getItem('revision_number');
    const lot_number = localStorage.getItem('lot_number');
    const get_qty = new FormData();
    get_qty.append('batch_number', batch_number);
    get_qty.append('assignment_id', assignment_id);
    get_qty.append('SubPid', sub_pid);
    get_qty.append('sequence_number', sequence_number);
    get_qty.append('parts_number', parts_number);
    get_qty.append('revision_number', revision_number);
    get_qty.append('lot_number', lot_number);
    get_qty.append('get_qty', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: get_qty
    })
        .then(response => response.json())
        .then(qty_data => {
            console.log(qty_data);
            if (qty_data) {
                if (qty_data.success) {
                    let sum = 0;
                    for (let data of qty_data.data) {
                        if (data.quantity_out) {
                            let qty_out = data.quantity_out;

                            sum += parseInt(qty_out);
                            document.getElementById(`qty_in_${operator_number}_${line_number}`).value = sum;
                            document.getElementById(`wafer_no_from_${operator_number}_${line_number}`).value = data.wafer_number_from;
                            document.getElementById(`wafer_no_to_${operator_number}_${line_number}`).value = data.wafer_number_to;
                            // document.getElementById(`wafer_no_from_${operator_number}_${line_number}`).style.width = `50px`;
                            // document.getElementById(`wafer_no_to_${operator_number}_${line_number}`).style.width = `50px`; 
                        }
                    }
                }
            }
        })
        .catch(error => {
            console.error(error);
        })

}

function disableStartBtn(operator_number) {
    // console.log(document.getElementById(`start_button_${operator_number}`));
    document.getElementById(`start_button_${operator_number}`).disabled = true;
}
function disableEndBtn(operator_number) {
    document.getElementById(`end_button_${operator_number}`).disabled = true;
    // console.log(document.getElementById(`end_button_${operator_number}`));
}
function disableSaveBtn(operator_number) {
    // console.log(document.getElementById(`save_button_${operator_number}`));
    document.getElementById(`save_button_${operator_number}`).disabled = true;
}
function disableAddBatchBtn(operator_number) {
    document.getElementById(`add_batch_${operator_number}`).disabled = true;
    // console.log(document.getElementById(`add_batch_${operator_number}`));
}

function enableStartBtn(operator_number) {
    document.getElementById(`start_button_${operator_number}`).disabled = false;
    // console.log(document.getElementById(`start_button_${operator_number}`));
}
function enableEndBtn(operator_number) {
    document.getElementById(`end_button_${operator_number}`).disabled = false;
    // console.log(document.getElementById(`end_button_${operator_number}`));
}
function enableSaveBtn(operator_number) {
    document.getElementById(`save_button_${operator_number}`).disabled = false;
    // console.log(document.getElementById(`save_button_${operator_number}`));
}
function enableAddBatchBtn(operator_number) {
    document.getElementById(`add_batch_${operator_number}`).disabled = false;
    // console.log(document.getElementById(`add_batch_${operator_number}`));
}


function swalALert(title, message, icon) {
    return Swal.fire(
        `${title}`,
        `${message}`,
        `${icon}`
    )
}

function getNGWafer(operator_number, line_number, limit, sequence_number, value) {
    if (localStorage.getItem(`tpc_sub_result_type`) === "Wafer" && localStorage.getItem('sequence_number') > 1 && localStorage.getItem(`operator_status`) === "Started" && value) {
        const batch_number = localStorage.getItem('batch_number');
        const parts_number = localStorage.getItem('item_parts_number');
        const revision_number = localStorage.getItem('revision_number');
        const lot_number = localStorage.getItem('lot_number');
        let ng_count = 0;
        console.log(`GetNGWAFER  operator_number=> ${operator_number} line_number=>${line_number} limit=>${limit} sequence_number=>${sequence_number}`);
        // localStorage.setItem('total_operator', data.total_operator);
        // localStorage.setItem('tpc_sub_result_type', data.tpc_sub_result_type);
        // localStorage.setItem('tpc_sub_sampling', data.tpc_sub_sampling);
        const getNGData = new FormData();
        getNGData.append(`batch_number`, batch_number);
        getNGData.append(`parts_number`, parts_number);
        getNGData.append(`revision_number`, revision_number);
        getNGData.append(`lot_number`, lot_number);
        getNGData.append(`SubPid`, sub_pid);
        getNGData.append(`limit`, limit);
        getNGData.append(`assignment_id`, assign_id);
        getNGData.append(`sequence_number`, sequence_number);
        getNGData.append(`getWaferNG`, 'true');
        fetch(myFetchURL, {
            method: 'POST',
            body: getNGData
        })
            .then(response => response.json())
            .then(NGWaferData => {
                // console.log(line_number);
                // console.log(NGWaferData);
                if (NGWaferData) {
                    if (NGWaferData.success) {
                        for (let data of NGWaferData.data) {
                            localStorage.setItem('line_number', data.line_number);
                            localStorage.setItem('wafer_number', data.wafer_number);
                            if (data.quantity_ng > 0) {
                                console.log(data);
                                // ng_count++;
                                // console.log(tr);
                                const tr = document.getElementById(`third_table_tr_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const qty_ng = document.getElementById(`qtyng_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const checkbox = document.getElementById(`checkbox_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const good_qty = document.getElementById(`good_count_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const ng_reason = document.getElementById(`select_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const remarks = document.getElementById(`remarks_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const id_no = document.getElementById(`operator_id_no_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const qty_in = document.getElementById(`qty_in_${operator_number}_${data.line_number}`);
                                const qty_out = document.getElementById(`qty_out_${operator_number}_${data.line_number}`);
                                const ng = document.getElementById(`ng_count_${operator_number}_${data.line_number}`);
                                const wafer_to = document.getElementById(`wafer_no_to_${operator_number}_${data.line_number}`);
                                tr.classList.add(`table-secondary`);
                                qty_ng.value = data.quantity_ng;
                                qty_ng.readOnly = true;
                                checkbox.disabled = true;
                                good_qty.value = data.quantity_good;
                                ng_reason.querySelector(`option`).textContent = data.ng_reason;
                                ng_reason.disabled = true;
                                remarks.value = data.batch_item_remarks;
                                remarks.readOnly = true;
                                id_no.textContent = data.id_number;
                                // console.log(wafer_to.value);
                                // qty_in.value = parseInt(wafer_to.value) - ng_count;
                                // qty_out.value = parseInt(wafer_to.value) - ng_count;
                                // ng.textContent = ng_count;
                                // console.log(ng_count);

                                // const qtyNg = tr.querySelector(`#qtyng_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                // console.log(qtyNg.value);
                                // const tr2 = document.getElementById(`third_table_tbody_${operator_number}`);
                                // // console.log(tr);
                                // const qtyNg = tr2.querySelector(`#qtyng_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                // console.log(qtyNg.value);
                            }
                            // const tr2 = document.getElementById(`third_table_tbody_${operator_number}`);
                            // console.log(tr);
                            // const qtyNg = tr2.querySelector(`#qtyng_${data.line_number}_${data.wafer_number}_${operator_number}`);
                            // console.log(qtyNg.value);
                        }
                        const qty_in2 = document.getElementById(`qty_in_${operator_number}_${line_number}`);
                        const qty_out2 = document.getElementById(`qty_out_${operator_number}_${line_number}`);
                        const ng2 = document.getElementById(`ng_count_${operator_number}_${line_number}`);
                        // const wafer_number_from = document.getElementById(`wafer_no_from_${operator_number}_${line_number}}`);
                        // const wafer_to2 = document.getElementById(`wafer_no_to_${operator_number}_${line_number}`);
                        console.log(`wafer_no_from_${operator_number}_${line_number}`);
                        const tbody = document.getElementById(`third_table_tbody_${operator_number}`);
                        // console.log(wafer_from2);
                        const tr = tbody.querySelectorAll(`tr`);
                        console.log(tr.length);
                        for (let i = 0; i < tr.length; i++) {
                            const td_element = tr[i].querySelectorAll('td');
                            const qtyNG = td_element[6].querySelector(`input`).value;
                            console.log(qtyNG);
                            if (qtyNG > 0) {
                                ng_count++;
                            }
                            console.log(ng_count);
                        }
                        const total = tr.length;
                        qty_in2.value = parseInt(total) - ng_count;
                        qty_out2.value = parseInt(total) - ng_count;
                        ng2.textContent = ng_count;
                        // console.log(tr);
                        // const td = tr.querySelectorAll(`td`);
                        // const qty_ng = tr.querySelector(`#qtyng_${line_number}_${wafer_number}_${operator_number}`);
                        // console.log(qty_ng);
                    }
                }
            })
            .catch(error => {
                console.error(error);
            })
    }
}

function disableSecondTable(operator_number, status) {
    const second_table_tbody = document.getElementById(`second_table_${operator_number}`);
    const tr = second_table_tbody.querySelectorAll('tr');
    for (let i = 0; i < tr.length; i++) {
        const td_element = tr[i].querySelectorAll('td');
        if (status == 'Started') {
            document.getElementById(`operator_id_${operator_number}`).readOnly = true;
            document.getElementById(`operator_id_${operator_number}`).classList.add('bg-light');
            td_element[1].querySelector('input').readOnly = true;
            td_element[2].querySelector('input').readOnly = true;
            td_element[3].querySelector('input').readOnly = true;
            td_element[4].querySelector('input').readOnly = true;
            td_element[5].querySelector('input').readOnly = true;
            td_element[6].querySelector('input').readOnly = true;
            td_element[6].querySelector('input').classList.add('bg-light');
            td_element[8].querySelector('input').readOnly = true;
            td_element[8].querySelector('input').classList.add('bg-light');
            td_element[8].querySelector('input').value = td_element[6].querySelector('input').value;
            td_element[9].querySelector('input').readOnly = true;
            td_element[9].querySelector('input').classList.add('bg-light');
            td_element[10].querySelector('input').value = td_element[9].querySelector('input').value;
            if (localStorage.getItem(`tpc_sub_uncontrolled`)) {
                td_element[8].querySelector('input').classList.remove('bg-light');
                td_element[8].querySelector(`input`).readOnly = false;
                td_element[10].querySelector('input').classList.remove('bg-light');
                td_element[10].querySelector('input').readOnly = false;
            }
        }
        else if (status == 'Finished') {
            document.getElementById(`operator_id_${operator_number}`).readOnly = true;
            document.getElementById(`operator_id_${operator_number}`).classList.add('bg-light');
            td_element[1].querySelector('input').readOnly = true;
            td_element[2].querySelector('input').readOnly = true;
            td_element[3].querySelector('input').readOnly = true;
            td_element[4].querySelector('input').readOnly = true;
            td_element[5].querySelector('input').readOnly = true;
            td_element[6].querySelector('input').classList.add('bg-light');
            td_element[8].querySelector('input').readOnly = true;
            td_element[8].querySelector('input').classList.add('bg-light');
            td_element[9].querySelector('input').readOnly = true;
            td_element[9].querySelector('input').classList.add('bg-light');
            td_element[10].querySelector('input').readOnly = true;
            td_element[10].querySelector('input').classList.add('bg-light');
        }
    }
}
function disableThirdTable(operator_number, status) {
    console.log(operator_number, status);
    const third_table_body = document.getElementById(`third_table_tbody_${operator_number}`);
    const third_tbl_tr = third_table_body.querySelectorAll('tr');
    for (let i = 0; i < third_tbl_tr.length; i++) {
        const td_element = third_tbl_tr[i].querySelectorAll('td');
        if (status == 'Started' && id_number > 0) {
            // td_element[6].querySelector('input').readOnly = true;
            // td_element[7].querySelector('input[type="checkbox"]').disabled = true;
            // td_element[9].querySelector('select').readOnly = true;
            // td_element[10].querySelector('input').readOnly = true;
            third_tbl_tr[i].classList.add('table-info');
        }
        if (status == "Finished") {
            third_tbl_tr[i].classList.add('table-danger');
            td_element[6].querySelector('input').readOnly = true;
            td_element[7].querySelector('input[type="checkbox"]').disabled = true;
            td_element[9].querySelector('select').readOnly = true;
            td_element[10].querySelector('input').readOnly = true;

        }
    }

    // for (let i = 0; i < tr.length; i++) {
    //     const td_element = tr[i].querySelectorAll('td');
    //     if(status == 'Started')
    //     {   
    //         td_element[6].querySelector('input').readOnly = true;
    //         td_element[7].querySelector('checkbox').readOnly = true;
    //         td_element[9].querySelector('input').readOnly = true;
    //         td_element[10].querySelector('input').readOnly = true;
    //     }
    //     else if(status == 'Finished')
    //     {
    //         // tr[i].classList.add('table-danger');
    //         console.log(tr[i]);
    //         // td_element[6].querySelector('input').readOnly = true;
    //         // td_element[7].querySelector('checkbox').readOnly = true;
    //         // td_element[9].querySelector('input').readOnly = true;
    //         // td_element[10].querySelector('input').readOnly = true;
    //     }
    // }
}
// console.log(document.getElementById(`start_process_${operator_number}`));
function getNgReason(line_number, wafer_number, operator_number) {
    const select = document.getElementById(`select_${line_number}_${wafer_number}_${operator_number}`);
    const get_ng_data = new FormData();
    get_ng_data.append('SubPid', sub_pid);
    get_ng_data.append('getNG', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: get_ng_data
    })
        .then(response => response.json())
        .then(ng_data => {
            console.log(ng_data);
            if (ng_data[0] != 0) {
                select.innerHTML = '';
                for (let data of ng_data) {
                    const option = `
                <option value="${data.ng_reason}">${data.ng_reason}</option>`;
                    select.innerHTML += option;
                }
            }
        })
        .catch(error => {
            console.error(error);
        })
}

function end_process() {
    const end_data = new FormData();
    end_data.append('SubPid', sub_pid);
    end_data.append('assignment_id', assign_id);
    end_data.append('end_process', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: end_data
    })
        .then(response => response.json())
        .then(data => {
            console.log(data.success);
            if (data.success) {
                let item_code = localStorage.getItem('itemCode');
                let parts_number = localStorage.getItem('partsNumber');
                let lot_number = localStorage.getItem('lotNo');
                let date_issued = localStorage.getItem('dateIssued');
                let revision_number = localStorage.getItem('revisionNumber');
                let sectionId = localStorage.getItem('sectionId');
                let assign_id = localStorage.getItem('assign_id');
                // console.log(`item_code${item_code},parts_number ${parts_number}, lot_number${lot_number}, date_issued${date_issued},revision_number ${revision_number}, assignment_id ${assign_id}`);
                const refreshData = new FormData();
                refreshData.append('item_code', item_code);
                refreshData.append('parts_number', parts_number);
                refreshData.append('lot_number', lot_number);
                refreshData.append('date_issued', date_issued);
                refreshData.append('revision_number', revision_number);
                refreshData.append('assignment_id', assign_id);
                refreshData.append('QrSubmitBtn', 'true');
                fetch(myFetchURL, {
                    method: 'POST',
                    body: refreshData
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        localStorage.setItem('myData', JSON.stringify(data));
                        localStorage.setItem('sectionId', JSON.stringify(sectionId));
                        // const thisData2 = JSON.parse(localStorage.getItem('myData'));
                        // console.log(thisData2);
                        if (localStorage.getItem('myData') != null || localStorage.getItem('myData') != 0) {
                            // saveBtn.click();
                            window.opener.location.reload(true);
                            window.close();
                        }
                    })
            }
        })
}