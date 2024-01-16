const urlParams = new URLSearchParams(window.location.search);
const assignment_id = urlParams.get('AssignmentId');
const SubPid = urlParams.get('SubPid');
const myFetchURL = 'https://172.16.2.13/batch_process_ver2/backend/parallel.php';

getHeaderData();

function getHeaderData() {
    const get_header_data = new FormData();
    get_header_data.append('assignment_id', assignment_id);
    get_header_data.append('SubPid', SubPid);
    get_header_data.append('get_header_data', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: get_header_data
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                if (data.success) {
                    for (let new_data of data.data) {
                        console.log(new_data);
                        document.getElementById(`subPname`).textContent = new_data.SubPname;
                        document.getElementById(`batch_number`).textContent = new_data.batch_id;
                        document.getElementById(`form_assignment`).textContent = new_data.assignment_id;
                        document.getElementById(`total_operator`).textContent = new_data.total_operator;
                        document.getElementById(`sampling_quantity`).textContent = new_data.tpc_sub_sampling;
                        document.getElementById(`uncontrolled_quantity`).textContent = new_data.tpc_sub_uncontrolled;
                        document.getElementById(`batch_type`).textContent = new_data.tpc_sub_batching_type;
                        document.getElementById(`result_type`).textContent = new_data.tpc_sub_result_type;
                        document.getElementById(`with_quantity`).textContent = new_data.with_quantity = 0 ? 'False' : 'True';
                        localStorage.setItem('parts_number', new_data.item_parts_number);
                        localStorage.setItem('revision_number', new_data.revision_number);
                        localStorage.setItem('lot_number', new_data.lot_number);
                        localStorage.setItem('sequence_number', new_data.sequence_number);
                        localStorage.setItem('item_code', new_data.item_code);
                        localStorage.setItem('date_issued', new_data.date_issued);
                        localStorage.setItem('section_id', new_data.section_id);
                    }
                    let myPromise = new Promise(function (myResolve, myReject) {
                        myResolve(data.success);
                        myReject(data.success);
                    });
                    myPromise.then(
                        function (value) {
                            get_main_data(value);
                        },
                        function (error) {
                            get_main_data(error);
                        }
                    );
                }
                else {
                    swalALert('Message Prompt!', 'Function=> getHeaderData' + data.message, 'info');
                }
            }
        }).catch(error => {
            console.log(error);
            swalALert('Message Prompt!', 'An error occured while connecting to the server, please contact IT Jason Bert Pardillo ID Number-> 3072, Tel No:[222], Top 1 Global Johnson Lodicakes, IGN:[Ketchup] for more information. Function=> getHeaderData', 'info');
        });
}

function get_main_data(value) {
    if (value == true) {
        const main_table = document.getElementById(`main_table`);
        const parts_number = localStorage.getItem('parts_number');
        const revision_number = localStorage.getItem('revision_number');
        const lot_number = localStorage.getItem('lot_number');
        const batch_number = document.getElementById(`batch_number`).textContent;
        const result_type = document.getElementById(`result_type`).textContent;
        const get_main_data = new FormData();
        get_main_data.append('assignment_id', assignment_id);
        get_main_data.append('SubPid', SubPid);
        get_main_data.append('parts_number', parts_number);
        get_main_data.append('revision_number', revision_number);
        get_main_data.append('lot_number', lot_number);
        get_main_data.append('batch_number', batch_number);
        get_main_data.append('get_main_data', 'true');
        fetch(myFetchURL, {
            method: 'POST',
            body: get_main_data
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                if (data) {
                    if (data.success) {
                        main_table.innerHTML = '';
                        let line_number = 0;
                        for (let new_data of data.data) {
                            console.log(new_data);
                            line_number++;
                            let main_tbl_row =
                                `<tr>
                                <td>${line_number}</td>
                                <td><input type="text" id="parts_number_${line_number}" class="form-control" value="${new_data.parts_number}" style="width: ${new_data.parts_number.length + 4}ch"></td>
                                <td><input type="text" id="revision_number_${line_number}" class="form-control" value="${new_data.revision_number}" ></td>
                                <td><input type="text" id="lot_number_${line_number}" class="form-control" value="${new_data.lot_number}" style="width: ${new_data.lot_number.length + 4}ch"></td>
                                <td><input type="text" id="wafer_number_from_${line_number}" class="form-control" value="${new_data.wafer_number_from ? new_data.wafer_number_from : 1}" oninput="oninput_wafer_numbers(${line_number})"></td>
                                <td><input type="text" id="wafer_number_to_${line_number}" class="form-control" value="${new_data.wafer_number_to ? new_data.wafer_number_to : 1}" oninput="oninput_wafer_numbers(${line_number})"></td>
                                <td><input type="text" id="total_quantity_${line_number}" class="form-control" value="${new_data.total_quantity ? new_data.total_quantity : 0.00}" ></td>
                                <td id="allocated_quantity_${line_number}">${new_data.allocated_quantity ? new_data.allocated_quantity : 0.00}</td>
                                <td id="unallocated_quantity_${line_number}">${new_data.unallocated_quantity ? new_data.unallocated_quantity : 0.00}</td>
                                <td id="total_sampling_in_${line_number}">${new_data.total_sampling_in ? new_data.total_sampling_in : 0.00}</td>
                                <td id="total_sampling_out_${line_number}">${new_data.total_sampling_out ? new_data.total_sampling_out : 0.00}</td>
                                <td id="assignment_id_${line_number}" class="d-none">${new_data.assignment_id}</td>
                                <td id="batch_number_${line_number}" class="d-none">${new_data.batch_number}</td>
                                <td><button type="button" class="btn btn-danger btn_remove_batch" onclick="remove_batch(${new_data.batch_async_id})">Remove</button></td>
                            </tr>`;
                            main_table.innerHTML += main_tbl_row;

                            if (new_data.batch_status == 'Started') {
                                disableMainTable();
                                disableAddBatchBtn();
                                disableDoneBtn();
                                enableAddOperatorBtn();
                                enableDoneProcessBtn();
                            }
                            else {
                                enableAddBatchBtn();
                                enableDoneBtn();
                                disableAddOperatorBtn();
                                disableDoneProcessBtn();
                                if (result_type == 'Wafer') {
                                    document.getElementById(`total_quantity_${line_number}`).setAttribute('readonly', 'true');
                                }
                                if (localStorage.getItem('sequence_number') > 1) {
                                    getQtyIn(new_data.line_number ? new_data.line_number : line_number);
                                }
                            }

                        }
                        let myPromise = new Promise(function (myResolve, myReject) {
                            myResolve(data.success);
                            myReject(data.success);
                        });
                        myPromise.then(
                            function (value) {
                                get_table_data(value);
                            },
                            function (error) {
                                get_table_data(error);
                            }
                        );
                        const remove_btn = document.querySelectorAll(`.btn_remove_batch`);
                        for (let i = 0; i < remove_btn.length; i++) {
                            if (data.data[0].batch_status != 'Started') {
                                if (i < 1) {
                                    remove_btn[i].classList.add('d-none');
                                }
                            }
                            else {
                                remove_btn[i].classList.add('d-none');
                            }
                        }
                    }
                    else {
                        swalALert('Message Prompt!', 'Function=> get_main_data' + data.message, 'info');
                    }
                }
            }).catch(error => {
                console.log(error);
                swalALert('Message Prompt!', 'Function=> get_main_data' + error, 'info');
            });
    }
    else {
        console.log(value);
    }
}


function addBatch() {
    const main_table = document.getElementById(`main_table`);
    const tr = main_table.querySelectorAll('tr');
    let line_number = tr.length;
    line_number++;
    let main_tbl_row =
        `<tr>
            <td>${line_number}</td>
            <td><input type="text" id="parts_number_${line_number}" class="form-control is-invalid" value="" onkeypress="return add_new_batch(${line_number}, event)"></td>
            <td><input type="text" id="revision_number_${line_number}" class="form-control is-invalid" value=""></td>
            <td><input type="text" id="lot_number_${line_number}" class="form-control is-invalid" value=""></td>
            <td><input type="text" id="wafer_number_from_${line_number}" class="form-control is-invalid" value=""></td>
            <td><input type="text" id="wafer_number_to_${line_number}" class="form-control is-invalid" value=""></td>
            <td><input type="text" id="total_quantity_${line_number}" class="form-control is-invalid" value="" ></td>
            <td id="allocated_quantity_${line_number}"></td>
            <td id="unallocated_quantity_${line_number}"></td>
            <td id="total_sampling_in_${line_number}"></td>
            <td id="total_sampling_out_${line_number}"></td>
            <td id="assignment_id_${line_number}" class="d-none"></td>
            <td id="batch_number_${line_number}" class="d-none"></td>
        </tr>`;
    main_table.innerHTML += main_tbl_row;
    if (localStorage.getItem('sequence_number') > 1) {
        getQtyIn(line_number);
    }
    disableDoneBtn();
}

function add_new_batch(line_number, event) {
    const parts_number_input = document.getElementById(`parts_number_${line_number}`);
    if (event.keyCode == 'Enter' || event.keyCode == '13') {
        let code = parts_number_input.value.split("|");
        let parts_number = code[1];
        let lot_number = code[2];
        let revision_number = code[4];
        let assignment_id_2 = code[5];
        const batch_number = document.getElementById(`batch_number`).textContent;
        const get_batch_data = new FormData();
        get_batch_data.append('assignment_id', assignment_id_2);
        get_batch_data.append('SubPid', SubPid);
        get_batch_data.append('parts_number', parts_number);
        get_batch_data.append('lot_number', lot_number);
        get_batch_data.append('revision_number', revision_number);
        get_batch_data.append('batch_number', batch_number);
        get_batch_data.append('add_batch', 'true');
        fetch(myFetchURL, {
            method: 'POST',
            body: get_batch_data
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    if (data.success) {
                        getHeaderData();
                    }
                    else {
                        swalALert('Message Prompt!', 'Function=>add_new_batch' + data.message, 'info');
                    }
                }
            }).catch(error => {
                console.log(error);
                swalALert('Message Prompt!', 'Function=>add_new_batch' + error, 'info');
            });
    }
}

function done() {
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, proceed!"
    }).then((result) => {
        if (result.isConfirmed) {

            const main_table = document.getElementById(`main_table`);
            const tr = main_table.querySelectorAll('tr');
            let isEmpty = false;
            for (let i = 0; i < tr.length; i++) {
                const td = tr[i].querySelectorAll('td');
                let line_number = td[0].textContent;
                let parts_number = td[1].querySelector('input').value;
                let revision_number = td[2].querySelector('input').value;
                let lot_number = td[3].querySelector('input').value;
                let wafer_from = td[4].querySelector('input').value;
                let wafer_to = td[5].querySelector('input').value;
                let total_quantity = td[6].querySelector('input').value;
                let allocated_quantity = td[7].textContent;
                let unallocated_quantity = td[8].textContent;
                let total_sampling_in = td[9].textContent;
                let total_sampling_out = td[10].textContent;
                let assignment_id = td[11].textContent;
                let batch_number = document.getElementById(`batch_number`).textContent;
                const main_data = new FormData();
                main_data.append(`line_number_${i}`, line_number);
                main_data.append(`parts_number_${i}`, parts_number);
                main_data.append(`revision_number_${i}`, revision_number);
                main_data.append(`lot_number_${i}`, lot_number);
                main_data.append(`wafer_from_${i}`, wafer_from);
                main_data.append(`wafer_to_${i}`, wafer_to);
                main_data.append(`total_quantity_${i}`, total_quantity);
                main_data.append(`allocated_quantity_${i}`, allocated_quantity);
                main_data.append(`unallocated_quantity_${i}`, unallocated_quantity);
                main_data.append(`total_sampling_in_${i}`, total_sampling_in);
                main_data.append(`total_sampling_out_${i}`, total_sampling_out);
                main_data.append(`assignment_id_${i}`, assignment_id);
                main_data.append(`batch_number_${i}`, batch_number);
                main_data.append(`SubPid_${i}`, SubPid);
                main_data.append(`save_main_data`, `true`);
                fetch(myFetchURL, {
                    method: 'POST',
                    body: main_data
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                        if (data) {
                            if (data.success) {
                                getHeaderData();
                            }
                            else {
                                swalALert('Message Prompt!', 'Function=> done()' + data.message, 'info');
                            }
                        }
                    }).catch(error => {
                        console.log(error);
                        swalALert('Message Prompt!', 'Function=> done()' + error, 'info');
                    });
            }
        }
    });
}

function addOperator() {
    const accordion = document.querySelectorAll(`.accordion`);
    let operator_number = accordion.length;
    if (operator_number > 0) {
        operator_number++;
    }
    else {
        operator_number = 1;
    }
    const batch_number = document.getElementById('batch_number').textContent;
    const add_operator_data = new FormData();
    add_operator_data.append('batch_number', batch_number);
    add_operator_data.append('SubPid', SubPid);
    add_operator_data.append('assignment_id', assignment_id);
    add_operator_data.append('operator_number', operator_number);
    add_operator_data.append('add_operator', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: add_operator_data
    })
        .then(response => response.json())
        .then(data => {
            if (data) {
                if (data.success) {
                    get_table_data(data.success);
                } else {
                    swalALert('Message Prompt!', 'Function=> addOperator()' + data.message, 'info');
                }
            }
        }).catch(error => {
            console.log(error);
            swalALert('Message Prompt!', 'Function=> addOperator()' + error, 'info');
        });
}

function get_table_data(value) {
    if (value == true) {
        const main_div = document.getElementById(`main_div`);
        const batch_number = document.getElementById('batch_number').textContent;
        const get_table_data = new FormData();
        get_table_data.append('batch_number', batch_number);
        get_table_data.append('SubPid', SubPid);
        get_table_data.append('assignment_id', assignment_id);
        get_table_data.append('get_accordion', 'true');
        fetch(myFetchURL, {
            method: 'POST',
            body: get_table_data
        })
            .then(response => response.json())
            .then(response_data => {
                console.log(response_data);
                main_div.innerHTML = '';
                if (response_data) {
                    if (response_data.success) {
                        for (let data of response_data.data) {
                            const accordion = `
                        <div class="accordion col-xl-12 col-lg-12 col-md-12 py-2 mx-auto" id="accordionExample_${data.batch_operator_id}">
                            <div class="accordion-item">
                                <h2 class="accordion-header">
                                    <button class="accordion-button collapsed" type="button" onclick="get_second_tbl_data(${data.operator_number})" data-bs-toggle="collapse" data-bs-target="#collapseOne_${data.operator_number}" aria-expanded="false" aria-controls="collapseOne_${data.operator_number}">
                                        <div class="col-md-12 row mx-auto">
                                            <div class="col-md-1">
                                                <small>Operator ${data.operator_number ? data.operator_number : ''}</small>
                                            </div>
                                            <div class="col-md-1">
                                                <small>ID No. ${data.id_number ? data.id_number : ''}</small>
                                            </div>
                                            <div class="col-md-1">
                                                <small>Name: ${data.operator_name ? data.operator_name : ''}</small>
                                            </div>
                                            <div class="col-md-2">
                                                <small>Total Batch Process: ${data.total_batch_processed ? data.total_batch_processed : ''}</small>
                                            </div>
                                            <div class="col-md-2">
                                                <small>Time Start: ${data.time_start ? data.time_start : ''}</small>
                                            </div>
                                            <div class="col-md-2">
                                                <small>Time End: ${data.time_end ? data.time_end : ''}</small>
                                            </div>
                                            <div class="col-md-1">
                                                <small class="header_status">Status: ${data.operator_status ? data.operator_status : ''}</small>
                                            </div>
                                            <div class="col-md-1">
                                                <a href="#" class="btn btn-sm btn-outline-none btn_delete_operator" id="delete_operator_btn_${data.batch_operator_id}" data-bs-operator_id="${data.operator_number}" data-bs-operator_status="${data.operator_status}"><span class="material-symbols-outlined">delete</span></a>
                                            </div>
                                            <div class="col-md-1">
                                                <a href="#" class="btn btn-sm btn-outline-none btn_edit_operator d-none" id="btn_edit_operator_${data.batch_operator_id}" data-bs-operator_id="${data.operator_number}" data-bs-operator_id_number="${data.id_number}" data-bs-operator_status="${data.operator_status}" data-bs-toggle="modal" data-bs-target="#edit_operator_modal"><span class="material-symbols-outlined">edit</span></a>
                                            </div>
                                        </div>
                                    </button>
                                </h2>
                                <div id="collapseOne_${data.operator_number}" class="accordion-collapse collapse" data-bs-parent="#accordionExample_${data.batch_operator_id}">
                                <div class="accordion-body">
                                    <div class="col-md-12 row mx-auto mx-auto">
                                        <div class="col-xl-4 col-lg-12 row">
                                            <div class="col-xl-6 col-lg-6">
                                                <label for="">ID No:</label>
                                                <input type="text" id="operator_id_${data.operator_number}" class="form-control shadow" value="${data.id_number ? data.id_number : ''}">
                                            </div>
                                            <div class="col-xl-6 col-lg-6">
                                                <label for="">Operator Name:</label>
                                                <input type="text" class="form-control shadow" value="${data.operator_name ? data.operator_name : ''}" readonly>
                                            </div>
                                            <div class="col-xl-6 col-lg-6">
                                                <label for="">Time Start: </label>
                                                <input type="text" id="time_start_${data.operator_number}" class="form-control shadow" value="${data.time_start ? data.time_start : ''}" readonly>
                                            </div>
                                            <div class="col-xl-6 col-lg-6">
                                                <label for="">Time End: </label>
                                                <input type="text" id="time_end_${data.operator_number}" class="form-control shadow" value="${data.time_end ? data.time_end : ''}" readonly>
                                            </div>
                                            <div class="col-xl-12 col-lg-12">
                                                <label for="">Total Time (in minutes)</label>
                                                <input type="text" class="form-control shadow total_time" value="${data.total_time ? data.total_time : ''}" readonly>
                                            </div>
                                            <div class="col-xl-6 col-lg-6 p-2">
                                                <button class="form-control btn btn-sm btn-success p-3  shadow" id="start_button_${data.operator_number}" onclick="save_operator_data(${data.operator_number})">
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
                                                <button class="form-control btn btn-sm btn-secondary p-3 shadow" id="add_batch_${data.operator_number}">
                                                <span class="material-symbols-outlined align-bottom">layers</span>ALLOCATE QUANTITY
                                                </button>
                                            </div>
                                        </div>
                                        <div class="col-xl-8 col-lg-12 mx-auto">
                                            <div class="table-responsive">
                                                <table class="table border rounded shadow">
                                                    <thead>
                                                        <tr>
                                                            <th>Line No.</th>
                                                            <th>Parts No.</th>
                                                            <th>Revision No.</th>
                                                            <th>Lot No.</th>
                                                            <th>Wafer No. From</th>
                                                            <th>Wafer No. To</th>
                                                            <th>Quantity In</th>
                                                            <th>NG Count</th>
                                                            <th>Quantity Out</th>
                                                            <th>Sampling In</th>
                                                            <th>Sampling Out</th>
                                                            <th>Unfinished Qty</th>
                                                            <th></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody id="second_table_tbody_${data.operator_number}">
                                                        
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="col-xl-12 col-lg-12 mx-auto">
                                            <div class="table-responsive overflow-auto text-center" style="margin-top: 5px; max-height: 500px;">
                                                <table class="table border rounded shadow">
                                                    <thead class="sticky-top">
                                                        <tr>
                                                            <th>Line No.</th>
                                                            <th>Parts No.</th>
                                                            <th>Revision No.</th>
                                                            <th>Lot No.</th>
                                                            <th>Wafer Number</th>
                                                            <th>Quantity In</th>
                                                            <th>Quantity NG</th>
                                                            <th>Good Quantity</th>
                                                            <th>NG Reason</th>
                                                            <th>Remarks</th>
                                                            <th>Operator ID</th>
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
                        </div>`;
                            main_div.innerHTML += accordion;
                        }
                        // Delete Operator Button
                        document.getElementById(`total_operator`).textContent = response_data.data.length;
                        const delete_btns = document.querySelectorAll(`.btn_delete_operator`);
                        for (let del_btn of delete_btns) {
                            const operator_status = del_btn.getAttribute('data-bs-operator_status');
                            if (operator_status != 'null') {
                                del_btn.classList.add('d-none');
                            }
                            del_btn.addEventListener("click", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                const delete_data = new FormData();
                                delete_data.append('batch_number', batch_number);
                                delete_data.append('SubPid', SubPid);
                                delete_data.append('assignment_id', assignment_id);
                                delete_data.append('operator_number', del_btn.getAttribute('data-bs-operator_id'));
                                delete_data.append('delete_operator_data', 'true');
                                fetch(myFetchURL, {
                                    method: 'POST',
                                    body: delete_data
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(data);
                                        if (data) {
                                            if (data.success) {
                                                getHeaderData();
                                            }
                                            else {
                                                swalALert('Message Prompt!', 'Function=> get_table_data()' + data.message, 'info');
                                            }
                                        }
                                    })
                                    .catch(error => {
                                        console.log(error);
                                    })
                            })
                        }
                        // Edit Operator Button
                        const edit_btns = document.querySelectorAll(`.btn_edit_operator`);
                        for (let edit_btn of edit_btns) {
                            const operator_status = edit_btn.getAttribute('data-bs-operator_status');
                            const operator_id = edit_btn.getAttribute('data-bs-operator_id_number');
                            const edit_operator_number = edit_btn.getAttribute('data-bs-operator_id');
                            if (operator_status == 'Finished') {
                                edit_btn.classList.remove('d-none');
                            } else {
                                edit_btn.classList.add('d-none');
                            }
                            edit_btn.addEventListener('click', function (e) {
                                e.stopPropagation();
                                const current_id = document.getElementById('edit_operator_current_id_number');
                                const operator_number = document.getElementById('edit_operator_number');
                                const edit_operator_modal = document.getElementById('edit_operator_modal');
                                edit_operator_modal.addEventListener('shown.bs.modal', () => {
                                    current_id.value = operator_id;
                                    operator_number.value = edit_operator_number;
                                })
                            });
                        }
                    }
                    else {
                        swalALert('Message Prompt!', 'Function=> get_table_data' + response_data.message, 'info');
                    }
                }
            }).catch(error => {
                console.log(error);
                swalALert('Message Prompt!', 'Function=> get_table_data' + error, 'info');
            })
    }
    else {
        console.log(value)
    }
}

function confirm_identity() {
    const current_id = document.getElementById('edit_operator_current_id_number');
    const main_id = document.getElementById('edit_operator_id_number');
    const operator_number = document.getElementById('edit_operator_number');
    const dismiss_btn = document.getElementById('dismiss_btn');
    if (main_id.value == '') {
        main_id.classList.add('is-invalid');
        swalALert('Message Prompt!', 'Please do not leave input fields blank to avoid errors!', 'info');
    }
    else {
        main_id.classList.remove('is-invalid');
        main_id.classList.add('is-valid');
        if (current_id.value == main_id.value) {
            swalALert('Good Job!', 'Operator Identification successfully identified!', 'success');
            current_id.value = '';
            main_id.value = '';
            main_id.classList.remove('is-valid');
            dismiss_btn.click();
        }
        else {
            swalALert('Message Prompt!', 'Operator ID Number does not match!', 'error');
        }
    }
}

function get_second_tbl_data(operator_number) {
    const accordion = document.getElementById(`collapseOne_${operator_number}`);
    const batch_number = document.getElementById('batch_number').textContent;
    const second_table = document.getElementById(`second_table_tbody_${operator_number}`);
    // accordion.addEventListener('shown.bs.collapse', function (e) {
    //     e.preventDefault();
    const second_tbl_data = new FormData();
    second_tbl_data.append('SubPid', SubPid);
    second_tbl_data.append('batch_number', batch_number);
    second_tbl_data.append('assignment_id', assignment_id);
    second_tbl_data.append('operator_number', operator_number);
    second_tbl_data.append('get_second_tbl_data', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: second_tbl_data
    })
        .then(response => response.json())
        .then(response_data => {
            console.log(response_data);
            second_table.innerHTML = '';
            if (response_data) {
                if (response_data.success) {
                    for (let data of response_data.data) {
                        const tr =
                            `<tr id="second_table_tr_${data.operator_number}_${data.line_number}">
                                    <td>${data.line_number ? data.line_number : '1'}</td>
                                    <td><input id="parts_number_${data.operator_number}_${data.line_number}"  type="text" class="form-control bg-light" value="${data.parts_number}" style="width:${data.parts_number.length + 4}ch" readonly></td>
                                    <td><input id="revision_number_${data.operator_number}_${data.line_number}" type="number" class="form-control bg-light" value="${data.revision_number}" readonly></td>
                                    <td><input id="lot_number_${data.operator_number}_${data.line_number}" type="text" class="form-control bg-light" value="${data.lot_number}" style="width:${data.lot_number.length + 4}ch" readonly></td>
                                    <td><input id="wafer_no_from_${data.operator_number}_${data.line_number}" type="number" class="form-control bg-light" style="width:${data.wafer_number_from.length + 5}ch" value="${data.wafer_number_from ? data.wafer_number_from : data.waferFrom ? data.waferFrom : ''}"></td>
                                    <td><input id="wafer_no_to_${data.operator_number}_${data.line_number}" type="number" oninput="oninput_wafer_to(${data.operator_number},${data.line_number})" class="form-control bg-light" style="width:${data.wafer_number_to.length + 5}ch" value="${data.wafer_number_to ? data.wafer_number_to : data.waferTo ? data.waferTo : ''}"></td>
                                    <td><input id="qty_in_${data.operator_number}_${data.line_number}" type="number" class="form-control " value="${data.quantity_in ? data.quantity_in : ''}" onkeydown="oninput_qty_in(${data.operator_number}, ${data.line_number})" style="width: ${data.quantity_in.length + 5}ch"></td>
                                    <td id="ng_count_${data.operator_number}_${data.line_number}">${data.quantity_ng ? data.quantity_ng : '0'}</td>
                                    <td><input id="qty_out_${data.operator_number}_${data.line_number}" type="number" oninput="oninput_qty_out(${data.operator_number},${data.line_number})" class="form-control qtyOut_${data.line_number}" value="${data.quantity_out ? data.quantity_out : ''}" style="width: ${data.quantity_out ? data.quantity_out.length + 5 : data.quantity_in.length + 5}ch"></td>
                                    <td><input id="sampling_in_${data.operator_number}_${data.line_number}" type="number" class="form-control" value="${data.sampling_in ? data.sampling_in : '0'}"  oninput="oninput_sampling_in(${data.operator_number}, ${data.line_number})"></td>
                                    <td><input id="sampling_out_${data.operator_number}_${data.line_number}" type="number" class="form-control" value="${data.sampling_out ? data.sampling_out : '0'}" oninput="oninput_sampling_out(${data.operator_number}, ${data.line_number})"></td>
                                    <td class="text-center" id="unfinished_qty_${data.operator_number}_${data.line_number}">${data.quantity_unfinished ? data.quantity_unfinished : ''}</td>
                                    <td><button type="button" id="remove_btn_${data.operator_number}_${data.line_number}" class="btn btn-sm btn-outline-danger d-none" onclick="remove_data(${data.batch_operator_id})">Remove</button></td>
                                    <td class="d-none">${data.assignment_id}</td>
                                </tr>`;
                        second_table.innerHTML += tr;
                        let wafer_from = document.getElementById(`wafer_no_from_${data.operator_number}_${data.line_number}`).value;
                        let wafer_to = document.getElementById(`wafer_no_to_${data.operator_number}_${data.line_number}`).value;
                        let limit = parseInt(wafer_to) - parseInt(wafer_from) + 1;
                        localStorage.setItem('limit', limit);
                    }
                    if (response_data.data[0].operator_status === 'Started') {
                        disableStartBtn(response_data.data[0].operator_number);
                        enableEndBtn(response_data.data[0].operator_number);
                        disableSaveBtn(response_data.data[0].operator_number);
                    }
                    else if (response_data.data[0].operator_status === 'Finished') {
                        disableStartBtn(response_data.data[0].operator_number);
                        disableEndBtn(response_data.data[0].operator_number);
                        disableSaveBtn(response_data.data[0].operator_number);
                    }
                    else {
                        enableStartBtn(response_data.data[0].operator_number);
                        disableEndBtn(response_data.data[0].operator_number);
                        disableSaveBtn(response_data.data[0].operator_number);
                    }
                    let myPromise = new Promise(function (myResolve, myReject) {
                        if (response_data.success) {
                            myResolve(response_data.success);
                        } else {
                            myReject(response_data.success);
                        }
                    });
                    myPromise.then(
                        function (value) { get_third_tbl_data(value, operator_number, response_data.data[0].operator_status); },
                        function (error) { get_third_tbl_data(error, operator_number, response_data.data[0].operator_status); }
                    );
                } else {
                    swalALert('Message Prompt!', 'Function=> get_second_tbl_data' + response_data.message, 'info');
                }
            }
        }).catch(error => {
            console.log(error);
            swalALert('Message Prompt!', 'Function=> get_second_tbl_data' + error, 'info');
        });
    // })
    accordion.addEventListener('hidden.bs.collapse', event => {
        getHeaderData();
    })
}

function get_third_tbl_data(value, operator_number, operator_status) {
    if (value == true) {
        const result_type = document.getElementById(`result_type`).textContent;
        let sequence_number = localStorage.getItem('sequence_number');
        let limit = localStorage.getItem('limit');
        const third_table_tbody = document.getElementById(`third_table_tbody_${operator_number}`);
        const second_table = document.getElementById(`second_table_tbody_${operator_number}`);
        let new_line_number = 1;
        third_table_tbody.innerHTML = '';
        const second_table_tr = second_table.querySelectorAll(`tr`);
        for (let i = 0; i < second_table_tr.length; i++) {
            let td = second_table_tr[i].querySelectorAll(`td`);
            const batch_number = document.getElementById(`batch_number`).textContent;
            let line_number = td[0].textContent;
            let parts_number = td[1].querySelector(`input`).value;
            let lot_number = td[3].querySelector(`input`).value;
            let revision_number = td[2].querySelector(`input`).value;
            const fetch_third_tbl_data = new FormData;
            fetch_third_tbl_data.append('SubPid', SubPid);
            fetch_third_tbl_data.append('batch_number', batch_number);
            fetch_third_tbl_data.append('assignment_id', td[13].textContent);
            fetch_third_tbl_data.append('operator_number', operator_number);
            fetch_third_tbl_data.append('parts_number', parts_number);
            fetch_third_tbl_data.append('lot_number', lot_number);
            fetch_third_tbl_data.append('line_number', line_number);
            fetch_third_tbl_data.append('revision_number', revision_number);
            fetch_third_tbl_data.append('fetch_data', 'true');
            fetch(myFetchURL, {
                method: 'POST',
                body: fetch_third_tbl_data
            })
                .then(response => response.json())
                .then(fetched_data => {
                    console.log(fetched_data);
                    if (fetched_data) {
                        if (fetched_data.success) {
                            var line_number = fetched_data.data[0].line_number;
                            var h5 = `<h5>${fetched_data.data[0].lot_number}</h5>`;
                            third_table_tbody.innerHTML += h5;
                            for (let data of fetched_data.data) {
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
                                    <td id="good_count_${data.line_number}_${data.wafer_number}_${operator_number}">${data.quantity_good ? data.quantity_good : '1'}</td>
                                    <td> 
                                        <select class="form-select" aria-label="Default select example" id="select_${data.line_number}_${data.wafer_number}_${operator_number}">
                                            <option selected>${data.ng_reason ? data.ng_reason : ''}</option>
                                        </select>
                                    </td>
                                    <td><input type="text" class="form-control" value="${data.batch_item_remarks ? data.batch_item_remarks : ''}" id="remarks_${data.line_number}_${data.wafer_number}_${operator_number}"></td>
                                    <td id="operator_id_no_${data.line_number}_${data.wafer_number}_${operator_number}">${data.id_number ? data.id_number : document.getElementById(`operator_id_${operator_number}`).value ? document.getElementById(`operator_id_${operator_number}`).value : ''} </td>
                                    <td class="d-none">${data.batch_wafer_id}</td>
                                </tr>`;
                                third_table_tbody.innerHTML += tr;
                                new_line_number++;
                            }
                        }
                    }
                    let myPromise = new Promise(function (myResolve, myReject) {
                        if (fetched_data.success) {
                            myResolve(fetched_data.success);
                        } else {
                            myReject(fetched_data.success);
                        }
                    });
                    myPromise.then(
                        function (value) {
                            disableSecondTable(value, operator_number, operator_status);
                            getNGWafer(result_type, operator_status, sequence_number, fetched_data.data[0].operator_number, fetched_data.data[0].line_number, limit, fetched_data.data[0].parts_number, fetched_data.data[0].revision_number, fetched_data.data[0].lot_number);
                        },
                        function (error) {
                            disableSecondTable(error, operator_number, operator_status);
                            getNGWafer(result_type, operator_status, sequence_number, fetched_data.data[0].operator_number, fetched_data.data[0].line_number, limit, fetched_data.data[0].parts_number, fetched_data.data[0].revision_number, fetched_data.data[0].lot_number);
                        }
                    );
                })
                .catch(error => {
                    console.log(error);
                    swalALert('Message Prompt!', 'Function=> get_third_tbl_data' + error, 'info');
                });
        }
    }
}

function save_operator_data(operator_number) {
    const id_number = document.getElementById(`operator_id_${operator_number}`);
    if (id_number.value !== '') {
        const main_table = document.getElementById(`main_table`);
        const second_table_tbody = document.getElementById(`second_table_tbody_${operator_number}`);
        const accordion_count = document.querySelectorAll(`.accordion`).length;
        const status = 'Started';
        const time_start_input = document.getElementById(`time_start_${operator_number}`);
        const result_type = document.getElementById(`result_type`).textContent;
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        const hours = String(now.getHours()).padStart(2, "0");
        const minutes = String(now.getMinutes()).padStart(2, "0");

        const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

        time_start_input.value = formattedDateTime;
        const tr = second_table_tbody.querySelectorAll('tr');
        const batch_number = document.getElementById('batch_number').textContent;
        const id_number = document.getElementById(`operator_id_${operator_number}`).value;
        let new_line_number1 = 1;
        let count = 0;
        for (let i = 0; i < tr.length; i++) {
            const td_element = tr[i].querySelectorAll('td');
            const line_number = td_element[0].textContent;
            const parts_number = td_element[1].querySelector('input').value;
            const revision_number = td_element[2].querySelector('input').value;
            const lot_number = td_element[3].querySelector('input').value;
            const wafer_no_from = td_element[4].querySelector('input').value;
            const wafer_no_to = td_element[5].querySelector('input').value;
            const wafer_number = new_line_number1;
            const qty_in = td_element[6].querySelector('input').value;
            const ng_count = td_element[7].textContent ? td_element[7].textContent : '';
            const qty_out = td_element[8].querySelector('input').value;
            const sampling_in = td_element[9].querySelector('input').value;
            const sampling_out = td_element[10].querySelector('input').value;
            const unfinished_qty = td_element[11].textContent ? td_element[11].textContent : '';
            const assign_id = td_element[13].textContent;
            const time_start = time_start_input.value;
            const tr_length = (parseInt(wafer_no_to) - parseInt(wafer_no_from)) + 1;
            if (wafer_no_to < 0 || qty_in < 0) {
                swalALert('Error found!', 'Please enter the required information in the input field.', 'error');
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
                batch_operator_data.append(`sub_pid`, SubPid);
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
                        let myPromise = new Promise(function (myResolve, myReject) {
                            myResolve(datas.success);
                            myReject(datas.success);
                        });
                        myPromise.then(
                            function (value) {
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
                                    batch_process_data.append(`qty_in_${j}`, qty_in);
                                    batch_process_data.append(`ng_count_${j}`, ng_count);
                                    batch_process_data.append(`qty_out_${j}`, qty_out);
                                    batch_process_data.append(`sampling_in_${j}`, sampling_in);
                                    batch_process_data.append(`sampling_out_${j}`, sampling_out);
                                    batch_process_data.append(`unfinished_qty_${j}`, unfinished_qty);
                                    batch_process_data.append(`operator_number_${j}`, operator_number);
                                    batch_process_data.append(`batch_number_${j}`, batch_number);
                                    batch_process_data.append(`sub_pid_${j}`, SubPid);
                                    batch_process_data.append(`id_number`, id_number);
                                    batch_process_data.append(`accordion_count`, accordion_count);
                                    batch_process_data.append(`result_type`, result_type);
                                    batch_process_data.append('save_batch_process', 'true');
                                    new_line_number1++;
                                    wafer_line_number++;
                                    fetch(myFetchURL, {
                                        method: 'POST',
                                        body: batch_process_data
                                    })
                                        .then(response => response.json())
                                        .then(datas => {
                                            if (datas) {
                                                if (datas.success) {
                                                    console.log(datas);
                                                    count++;
                                                }
                                                else {
                                                    swalALert('Message Prompt!', 'Function=> save_operator_data' + datas.message, 'info');
                                                }
                                            }
                                            if (count == tr_length) {
                                                let timerInterval;
                                                Swal.fire({
                                                    title: "Good job",
                                                    html: "Saving data time left: <b></b> milliseconds.",
                                                    timer: 1000,
                                                    timerProgressBar: true,
                                                    didOpen: () => {
                                                        Swal.showLoading();
                                                        const timer = Swal.getPopup().querySelector("b");
                                                        timerInterval = setInterval(() => {
                                                            timer.textContent = `${Swal.getTimerLeft()}`;
                                                        }, 100);
                                                    },
                                                    willClose: () => {
                                                        clearInterval(timerInterval);
                                                    }
                                                }).then((result) => {
                                                    if (result.dismiss === Swal.DismissReason.timer) {
                                                        getHeaderData();
                                                    }
                                                });

                                            }
                                        })
                                        .catch(error => {
                                            console.log(error);
                                            swalALert('Message Prompt!', 'Function=> save_operator_data' + error, 'info');
                                        })
                                }
                            },
                            function (error) {
                                console.log(error);
                            }
                        );
                    })
                    .catch(error => {
                        console.log(error);
                        swalALert('Message Prompt!', 'Function=> save_operator_data' + error, 'info');
                    })
            }
        }
    }
    else {
        swalALert('Warning!', 'Please provide your ID number for verification to prevent errors. Thank you!', 'info');
        id_number.classList.add('class', 'is-invalid');
    }
}

function save_time_end(operator_number) {
    const second_table_tbody = document.getElementById(`second_table_tbody_${operator_number}`);
    const second_tbl_tr = second_table_tbody.querySelectorAll('tr');
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

    const diffInMs = date2 - date1;

    const diffInMinutes = Math.round(diffInMs / 60000) + minute_debug;
    const batch_number = document.getElementById('batch_number').textContent;
    let count = 0;
    for (let i = 0; i < second_tbl_tr.length; i++) {
        const second_tbl_td_element = second_tbl_tr[i].querySelectorAll('td');
        const second_tbl_assignment_id = second_tbl_td_element[13].textContent;
        const update_batch_process_data = new FormData();
        update_batch_process_data.append(`sub_pid`, SubPid);
        update_batch_process_data.append(`operator_number`, operator_number);
        update_batch_process_data.append(`batch_number`, batch_number);
        update_batch_process_data.append(`time_end`, formattedDateTime);
        update_batch_process_data.append(`assignment_id`, second_tbl_assignment_id);
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
                    count++;
                    if (count == second_tbl_tr.length) {
                        enableSaveBtn(operator_number);
                        document.getElementById(`save_button_${operator_number}`).click();
                    }
                }
            })
            .catch(error => {
                console.log(error);
                swalALert('Message Prompt!', 'Function=> save_time_end' + error, 'info');
            })
    }
}

function save_process_data(operator_number) {
    const second_table_tbody = document.getElementById(`second_table_tbody_${operator_number}`);
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
    const diffInMs = date2 - date1;
    let count = 0;
    const diffInMinutes = Math.round(diffInMs / 60000) + minute_debug;
    for (let i = 0; i < second_tbl_tr.length; i++) {
        const second_tbl_td_element = second_tbl_tr[i].querySelectorAll('td');
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
        const second_tbl_assignment_id = second_tbl_td_element[13].textContent;
        const batch_number = document.getElementById('batch_number').textContent;
        const save_second_tbl_data = new FormData();
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
        save_second_tbl_data.append(`sub_pid`, SubPid);
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
                if (save_second_tbl_datas) {
                    if (save_second_tbl_datas.success) {
                        count++;
                        if (count == second_tbl_tr.length) {
                            save_third_tbl_data(operator_number);
                        }
                    } else {
                        swalALert('Message Prompt!', 'Function=> save_process_data' + save_second_tbl_datas.message, 'info');
                    }
                }
            })
            .catch(error => {
                console.log(error);
                swalALert('Message Prompt!', 'Function=> save_process_data' + error, 'info');
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
    const result_type = document.getElementById(`result_type`).textContent;
    let count = 0;
    for (let j = 0; j < third_tbl_tr.length; j++) {
        const third_tbl_td_element = third_tbl_tr[j].querySelectorAll('td');
        const third_tbl_line_number = third_tbl_td_element[0].textContent;
        const third_tbl_parts_number = third_tbl_td_element[1].textContent;
        const third_tbl_revision_number = third_tbl_td_element[2].textContent;
        const third_tbl_lot_number = third_tbl_td_element[3].textContent;
        const third_tbl_wafer_number = third_tbl_td_element[4].textContent;
        const third_tbl_qty_in = third_tbl_td_element[5].textContent;
        const third_tbl_qty_ng = third_tbl_td_element[6].querySelector('input').value;
        const third_tbl_good_qty = third_tbl_td_element[7].textContent;
        const third_tbl_ng_reason = third_tbl_td_element[8].querySelector('select').value = 'Open this select menu' ? '' : third_tbl_td_element[8].querySelector('select').value;
        const third_tbl_remarks = third_tbl_td_element[9].querySelector('input').value;
        const third_tbl_operator_id_no = third_tbl_td_element[10].textContent;
        const batch_wafer_id = third_tbl_td_element[11].textContent;
        const batch_number = document.getElementById('batch_number').textContent;
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
        save_third_tbl_data.append(`sub_pid`, SubPid);
        save_third_tbl_data.append(`batch_wafer_id`, batch_wafer_id);
        save_third_tbl_data.append(`operator_number`, operator_number);
        save_third_tbl_data.append(`batch_number`, batch_number);
        save_third_tbl_data.append(`time_end`, formattedDateTime);
        save_third_tbl_data.append(`assignment_id`, assignment_id);
        save_third_tbl_data.append(`result_type`, result_type);
        save_third_tbl_data.append(`save_third_table_data`, 'true');

        fetch(myFetchURL, {
            method: 'POST',
            body: save_third_tbl_data
        })
            .then(response => response.json())
            .then(third_table_datas => {
                console.log(third_table_datas);
                if (third_table_datas.success) {
                    count++;
                    if (count == third_tbl_tr.length) {
                        if (count == third_tbl_tr.length) {
                            let timerInterval;
                            Swal.fire({
                                title: "Good job",
                                html: "Saving data time left: <b></b> milliseconds.",
                                timer: 1000,
                                timerProgressBar: true,
                                didOpen: () => {
                                    Swal.showLoading();
                                    const timer = Swal.getPopup().querySelector("b");
                                    timerInterval = setInterval(() => {
                                        timer.textContent = `${Swal.getTimerLeft()}`;
                                    }, 100);
                                },
                                willClose: () => {
                                    clearInterval(timerInterval);
                                }
                            }).then((result) => {
                                if (result.dismiss === Swal.DismissReason.timer) {
                                    getHeaderData();
                                }
                            });
                        }
                    }
                }
            })
            .catch(error => {
                console.log(error);
                swalALert('Message Prompt!', 'Function=> save_third_tbl_data' + error, 'info');
            })
    }
}

function getNgReason(line_number, wafer_number, operator_number) {
    const select = document.getElementById(`select_${line_number}_${wafer_number}_${operator_number}`);
    const get_ng_data = new FormData();
    get_ng_data.append('SubPid', SubPid);
    get_ng_data.append('get_ng', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: get_ng_data
    })
        .then(response => response.json())
        .then(ng_data => {
            if (ng_data && ng_data.success) {
                select.innerHTML = '';
                for (let data of ng_data) {
                    const option = `
                    <option value="${data.ng_reason}">${data.ng_reason}</option>`;
                    select.innerHTML += option;
                }
            }
        })
        .catch(error => {
            console.log(error);
            swalALert('Message Prompt!', 'Function=> getNgReason' + error, 'info');
        })
}

function getNGWafer(result_type, operator_status, sequence_number, operator_number, line_number, limit, parts_number, revision_number, lot_number) {
    if (result_type === 'Wafer' && sequence_number > 1 && operator_status === 'Started') {
        const batch_number = document.getElementById('batch_number').textContent;
        const getNGData = new FormData();
        getNGData.append(`batch_number`, batch_number);
        getNGData.append(`parts_number`, parts_number);
        getNGData.append(`revision_number`, revision_number);
        getNGData.append(`lot_number`, lot_number);
        getNGData.append(`SubPid`, SubPid);
        getNGData.append(`limit`, limit);
        getNGData.append(`get_wafer_ng`, 'true');
        fetch(myFetchURL, {
            method: 'POST',
            body: getNGData
        })
            .then(response => response.json())
            .then(NGWaferData => {
                console.log(NGWaferData);
                if (NGWaferData) {
                    if (NGWaferData.success) {
                        console.log(NGWaferData);
                        let ng_count = 0;
                        for (let data of NGWaferData.data) {
                            if (data.quantity_ng > 0) {
                                const tr = document.getElementById(`third_table_tr_${data.line_number}_${data.wafer_number}_${data.operator_number}`);
                                const qty_ng = document.getElementById(`qtyng_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const good_qty = document.getElementById(`good_count_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const ng_reason = document.getElementById(`select_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const remarks = document.getElementById(`remarks_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const id_no = document.getElementById(`operator_id_no_${data.line_number}_${data.wafer_number}_${operator_number}`);
                                const qty_in = document.getElementById(`qty_in_${operator_number}_${data.line_number}`);
                                const qty_out = document.getElementById(`qty_out_${operator_number}_${data.line_number}`);
                                const ng = document.getElementById(`ng_count_${operator_number}_${data.line_number}`);
                                const wafer_to = document.getElementById(`wafer_no_to_${operator_number}_${data.line_number}`);
                                tr.classList.remove(`table-info`);
                                tr.classList.add(`table-secondary`);
                                qty_ng.value = data.quantity_ng;
                                qty_ng.readOnly = true;
                                good_qty.value = data.quantity_good;
                                ng_reason.querySelector(`option`).textContent = data.ng_reason;
                                ng_reason.disabled = true;
                                remarks.value = data.batch_item_remarks;
                                remarks.readOnly = true;
                                id_no.textContent = data.id_number;
                            }
                        }
                        const qty_in2 = document.getElementById(`qty_in_${operator_number}_${line_number}`);
                        const qty_out2 = document.getElementById(`qty_out_${operator_number}_${line_number}`);
                        const ng2 = document.getElementById(`ng_count_${operator_number}_${line_number}`);
                        const tbody = document.getElementById(`third_table_tbody_${operator_number}`);
                        const tr = tbody.querySelectorAll(`tr`);
                        for (let i = 0; i < limit; i++) {
                            const td_element = tr[i].querySelectorAll('td');
                            const qtyNG = td_element[6].querySelector(`input`).value;
                            if (qtyNG > 0) {
                                ng_count++;
                            }
                        }
                        const total = limit;
                        qty_in2.value = parseInt(total) - ng_count;
                        qty_out2.value = parseInt(total) - ng_count;
                        ng2.textContent = ng_count;
                    }
                }
            })
            .catch(error => {
                console.log(error);
                swalALert('Message Prompt!', 'Function=> getNGWafer' + error, 'info');
            })
    }
}

function getQtyIn(line_number) {
    const batch_number = document.getElementById(`batch_number`).textContent;
    const parts_number = localStorage.getItem('parts_number');
    const revision_number = localStorage.getItem('revision_number');
    const lot_number = localStorage.getItem('lot_number');
    const sequence_number = localStorage.getItem(`sequence_number`);
    const get_qty = new FormData();
    get_qty.append('batch_number', batch_number);
    get_qty.append('assignment_id', assignment_id);
    get_qty.append('parts_number', parts_number);
    get_qty.append('revision_number', revision_number);
    get_qty.append('lot_number', lot_number);
    get_qty.append('sub_pid', SubPid);
    get_qty.append('sequence_number', sequence_number);
    get_qty.append('get_qty', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: get_qty
    })
        .then(response => response.json())
        .then(qty_data => {
            if (qty_data) {
                if (qty_data.success) {
                    let sum = 0;
                    for (let data of qty_data.data) {
                        let qty_out = data.quantity_out;
                        sum += parseInt(qty_out);
                        document.getElementById(`total_quantity_${line_number}`).value = sum;
                    }
                }
                else {
                    swalALert('Message Prompt!', 'Function=> getQtyIn' + qty_data.message, 'info');
                }
            }
        })
        .catch(error => {
            console.log(error);
            swalALert('Message Prompt!', 'Function=> getQtyIn' + error, 'info');
        })

}

function remove_batch(batch_async_id) {
    const batch_number = document.getElementById(`batch_number`).textContent;
    const remove_batch_data = new FormData();
    remove_batch_data.append('batch_async_id', batch_async_id);
    remove_batch_data.append('batch_number', batch_number);
    remove_batch_data.append('remove_batch', 'true');
    fetch(myFetchURL, {
        method: 'POST',
        body: remove_batch_data
    }).then(response => response.json())
        .then(data => {
            if (data) {
                if (data.success) {
                    getHeaderData();
                }
                else {
                    swalALert('Message Prompt!', 'Function=> remove_batch' + data.message, 'info');
                }
            }
        }).catch(error => {
            console.log(error);
            swalALert('Message Prompt!', 'Function=> remove_batch' + error, 'info');
        });
}

function doneProcess() {
    const accordions = document.querySelectorAll('.accordion');
    const time_inputs = document.querySelectorAll('.total_time');
    const main_table = document.getElementById('main_table');
    const main_tr = main_table.querySelectorAll(`tr`);
    const batch_number = document.getElementById(`batch_number`).textContent;
    let total_time = 0;
    let count = 0;
    for (let time of time_inputs) {
        if (!isNaN(parseInt(time.value))) {
            let time_value = time.value;
            total_time += parseInt(time_value);
            console.log(total_time);
        }
    }
    for (let accordion of accordions) {
        let status = accordion.querySelector('.header_status').textContent;
        const thisStatus = status.split(":");
        if (thisStatus[1] != " Finished") {
            count++;
        }
    }
    if (count > 0) {
        swalALert('Message Prompt!', `There's ${count} process remains in progress at the present moment.`, 'info');
    }
    else {
        for (let i = 0; i < main_tr.length; i++) {
            const td_element = main_tr[i].querySelectorAll('td');
            const line_number = td_element[0].textContent;
            const parts_number = td_element[1].querySelector('input').value;
            const revision_number = td_element[2].querySelector('input').value;
            const lot_number = td_element[3].querySelector('input').value;
            const wafer_from = td_element[4].querySelector('input').value;
            const wafer_to = td_element[5].querySelector('input').value;
            const total_qty = td_element[6].querySelector('input').value;
            const allocated_qty = td_element[7].textContent;
            const unallocated_qty = td_element[8].textContent;
            const total_sampling_in = td_element[9].textContent;
            const total_sampling_out = td_element[10].textContent;
            const tbl_assignment_id = td_element[11].textContent;
            const time = total_time;
            const total_operator = accordions.length;
            const total_batch = main_tr.length;

            const main_tbl_data = new FormData();
            main_tbl_data.append(`line_number_${i}`, line_number);
            main_tbl_data.append(`parts_number_${i}`, parts_number);
            main_tbl_data.append(`revision_number_${i}`, revision_number);
            main_tbl_data.append(`lot_number_${i}`, lot_number);
            main_tbl_data.append(`wafer_from_${i}`, wafer_from);
            main_tbl_data.append(`wafer_to_${i}`, wafer_to);
            main_tbl_data.append(`total_qty_${i}`, total_qty);
            main_tbl_data.append(`allocated_qty_${i}`, allocated_qty);
            main_tbl_data.append(`unallocated_qty_${i}`, unallocated_qty);
            main_tbl_data.append(`total_sampling_in_${i}`, total_sampling_in);
            main_tbl_data.append(`total_sampling_out_${i}`, total_sampling_out);
            main_tbl_data.append(`assignment_id_${i}`, tbl_assignment_id);
            main_tbl_data.append(`total_time_${i}`, time);
            main_tbl_data.append(`total_operator_${i}`, total_operator);
            main_tbl_data.append(`total_batch_${i}`, total_batch);
            main_tbl_data.append(`batch_number_${i}`, batch_number);
            main_tbl_data.append(`SubPid_${i}`, SubPid);
            main_tbl_data.append('done_batch_process', 'true');

            fetch(myFetchURL, {
                method: 'POST',
                body: main_tbl_data
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data);
                    if (data) {
                        if (data.success) {
                            swalALert('Good job!', data.message, 'success');
                            const end_data = new FormData();
                            end_data.append('SubPid', SubPid);
                            end_data.append('assignment_id', assignment_id);
                            end_data.append('end_process', 'true');
                            fetch(myFetchURL, {
                                method: 'POST',
                                body: end_data
                            })
                                .then(response => response.json())
                                .then(data => {
                                    if (data) {
                                        if (data.success) {
                                            let item_code = localStorage.getItem('item_code');
                                            let parts_number = localStorage.getItem('parts_number');
                                            let lot_number = localStorage.getItem('lot_number');
                                            let date_issued = localStorage.getItem('date_issued');
                                            let revision_number = localStorage.getItem('revision_number');
                                            let section_id = localStorage.getItem('section_id');
                                            const refreshData = new FormData();
                                            refreshData.append('item_code', item_code);
                                            refreshData.append('parts_number', parts_number);
                                            refreshData.append('lot_number', lot_number);
                                            refreshData.append('date_issued', date_issued);
                                            refreshData.append('revision_number', revision_number);
                                            refreshData.append('assignment_id', assignment_id);
                                            refreshData.append('qr_submit_btn', 'true');
                                            fetch(myFetchURL, {
                                                method: 'POST',
                                                body: refreshData
                                            })
                                                .then(response => response.json())
                                                .then(data => {
                                                    console.log(data);
                                                    localStorage.setItem('myData', JSON.stringify(data));
                                                    localStorage.setItem('sectionId', JSON.stringify(section_id));
                                                    if (localStorage.getItem('myData') != null || localStorage.getItem('myData') != 0) {
                                                        window.opener.location.reload(true);
                                                        window.close();
                                                    }
                                                })
                                        }
                                    }
                                })
                                .catch(error => {
                                    console.log(error);
                                    swalALert('Message Prompt!', error, 'info');
                                })
                        }
                    }
                })
        }
    }
}

function swalALert(title, message, icon) {
    return Swal.fire(
        `${title}`,
        `${message}`,
        `${icon}`
    )
}

// Validations
function disableMainTable() {
    const main_table_tbody = document.getElementById(`main_table`);
    const main_tbl_tr = main_table_tbody.querySelectorAll('tr');
    main_table_tbody.classList.add('table-danger')
    for (let i = 0; i < main_tbl_tr.length; i++) {
        main_tbl_tr[i].classList.add('table-secondary');
        const td_element = main_tbl_tr[i].querySelectorAll('td');
        const parts_number = td_element[1].querySelector('input');
        const revision_number = td_element[2].querySelector('input');
        const lot_number = td_element[3].querySelector('input');
        const wafer_from = td_element[4].querySelector('input');
        const wafer_to = td_element[5].querySelector('input');
        const total_qty = td_element[6].querySelector('input');
        parts_number.setAttribute('readonly', 'true');
        parts_number.classList.add('bg-light');
        revision_number.setAttribute('readonly', 'true')
        revision_number.classList.add('bg-light');
        lot_number.setAttribute('readonly', 'true')
        lot_number.classList.add('bg-light');
        wafer_from.setAttribute('readonly', 'true')
        wafer_from.classList.add('bg-light');
        wafer_to.setAttribute('readonly', 'true')
        wafer_to.classList.add('bg-light');
        total_qty.setAttribute('readonly', 'true')
        total_qty.classList.add('bg-light');
    }
}

function disableSecondTable(value, operator_number, status) {
    if (value == true) {
        const tpc_sub_uncontrolled = document.getElementById('uncontrolled_quantity').textContent;
        const with_quantity = document.getElementById('with_quantity').textContent;
        const tpc_sub_sampling = document.getElementById('sampling_quantity').textContent;
        const second_table_tbody = document.getElementById(`second_table_tbody_${operator_number}`);
        const third_table_tbody = document.getElementById(`third_table_tbody_${operator_number}`);
        const result_type = document.getElementById('result_type').textContent;
        const tr = second_table_tbody.querySelectorAll('tr');
        const third_tr = third_table_tbody.querySelectorAll('tr');
        for (let i = 0; i < tr.length; i++) {
            const td_element = tr[i].querySelectorAll('td');
            if (status == 'Started') {
                document.getElementById(`operator_id_${operator_number}`).setAttribute('readonly', 'true');
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
                td_element[9].querySelector('input').readOnly = true;
                td_element[9].querySelector('input').classList.add('bg-light');
                if (tpc_sub_uncontrolled == 'True' && with_quantity == 'True') {
                    td_element[8].querySelector('input').readOnly = false;
                    td_element[8].querySelector('input').classList.remove('bg-light');
                    td_element[6].querySelector('input').readOnly = false;
                    td_element[6].querySelector('input').classList.remove('bg-light');
                }
                else if (with_quantity == 'True') {
                    td_element[8].querySelector('input').readOnly = false;
                    td_element[8].querySelector('input').classList.remove('bg-light');
                    td_element[6].querySelector('input').readOnly = false;
                    td_element[6].querySelector('input').classList.remove('bg-light');
                }
                if (result_type == 'Wafer') {
                    td_element[6].querySelector('input').readOnly = true;
                    td_element[6].querySelector('input').classList.add('bg-light');
                    td_element[8].querySelector('input').readOnly = true;
                    td_element[8].querySelector('input').classList.add('bg-light');
                    td_element[8].querySelector('input').value = td_element[6].querySelector('input').value;
                }
                else {
                    td_element[8].querySelector('input').value = td_element[6].querySelector('input').value;
                }
                if (tpc_sub_sampling == 'True') {
                    td_element[9].querySelector('input').readOnly = false;
                    td_element[9].querySelector('input').classList.remove('bg-light');
                    td_element[10].querySelector('input').readOnly = false;
                    td_element[10].querySelector('input').classList.remove('bg-light');
                }
                else {
                    td_element[9].querySelector('input').readOnly = true;
                    td_element[9].querySelector('input').classList.add('bg-light');
                    td_element[10].querySelector('input').readOnly = true;
                    td_element[10].querySelector('input').classList.add('bg-light');
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
                td_element[6].querySelector('input').readOnly = true;
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
    let myPromise = new Promise(function (myResolve, myReject) {
        myResolve(value);
        myReject(value);
    });
    myPromise.then(
        function (value) {
            disableThirdTable(value, operator_number, status);
        },
        function (error) {
            disableThirdTable(value, operator_number, status);
        }
    );
}

function disableThirdTable(value, operator_number, status) {
    if (value == true) {
        const third_table_body = document.getElementById(`third_table_tbody_${operator_number}`);
        const second_table_tbody = document.getElementById(`second_table_tbody_${operator_number}`);
        const third_tbl_tr = third_table_body.querySelectorAll('tr');
        const second_tbl_tr = second_table_tbody.querySelectorAll('tr');
        const result_type = document.getElementById('result_type').textContent;
        for (let i = 0; i < third_tbl_tr.length; i++) {
            const td_element = third_tbl_tr[i].querySelectorAll('td');
            if (status === 'Started') {
                third_tbl_tr[i].classList.add('table-info');
                if (result_type === 'Chips') {
                    let second_tbl_value = document.getElementById(`qty_in_${operator_number}_${i + 1}`).value;
                    td_element[5].textContent = second_tbl_value;
                    td_element[7].textContent = second_tbl_value;
                    var event = new Event('input', {
                        bubbles: true,
                        cancelable: true,
                    });
                    td_element[6].querySelector('input').dispatchEvent(event);
                }
            }
            else if (status === "Finished") {
                third_tbl_tr[i].classList.add('table-secondary');
                td_element[6].querySelector('input').readOnly = true;
                td_element[8].querySelector('select').readOnly = true;
                td_element[9].querySelector('input').readOnly = true;
                td_element[9].querySelector('input').classList.add('bg-light');
            }
        }
    }
}

function oninput_wafer_to(operator_number, line_number) {
    let result_type = document.getElementById('result_type').textContent;
    let uncontrolled_quantity = document.getElementById('uncontrolled_quantity').textContent;
    if (result_type == 'Wafer') {
        const wafer_from = document.getElementById(`wafer_no_from_${operator_number}_${line_number}`);
        const wafer_to = document.getElementById(`wafer_no_to_${operator_number}_${line_number}`);
        if (uncontrolled_quantity == 'False') {
            document.getElementById(`qty_in_${operator_number}_${line_number}`).value = parseInt(wafer_to.value) - parseInt(wafer_from.value) + 1;
        }
        else {
            document.getElementById(`qty_in_${operator_number}_${line_number}`).value = 0;
        }
    }
}

function oninput_qty_ng(line_number, wafer_number, operator_number) {
    const result_type = document.getElementById('result_type').textContent;
    const qtyNG = document.querySelectorAll(`.qtyNG_${line_number}_${operator_number}:not([readonly]):not([disabled])`);
    const qty_out_input = document.getElementById(`qty_out_${operator_number}_${line_number}`);
    const qtyng_input = document.getElementById(`qtyng_${line_number}_${wafer_number}_${operator_number}`);
    const qty_good = document.getElementById(`good_count_${line_number}_${wafer_number}_${operator_number}`);
    const qty_ng_input = document.getElementById(`ng_count_${operator_number}_${line_number}`);
    const select = document.getElementById(`select_${line_number}_${wafer_number}_${operator_number}`);
    const qty_in = document.getElementById(`qty_in_${line_number}_${wafer_number}_${operator_number}`);
    const quantity_unfinished = document.getElementById(`unfinished_qty_${operator_number}_${line_number}`);
    const second_tbl_qty_in = document.getElementById(`qty_in_${operator_number}_${line_number}`).value;
    let good_qty = parseInt(qty_in.textContent) - parseInt(qtyng_input.value);
    let total_qty = 0;
    if (result_type == 'Chips') {
        if (parseInt(qtyng_input.value) > parseInt(second_tbl_qty_in)) {
            swalALert('Error', 'Quantity NG must not exceed Quantity IN', 'warning');
            disableEndBtn(operator_number);
        }
        else {
            enableEndBtn(operator_number);
            qty_in.textContent = second_tbl_qty_in;
            qty_good.textContent = parseInt(qty_in.textContent) - parseInt(qtyng_input.value);
            total_qty = parseInt(qtyng_input.value) + parseInt(qty_good.textContent);
            qty_out_input.value = qty_good.textContent;
            qty_ng_input.textContent = parseInt(qtyng_input.value);
            quantity_unfinished.textContent = second_tbl_qty_in - total_qty;
        }

        if (isNaN(qtyng_input.value) || qtyng_input.value == '') {
            qtyng_input.value = 0;
            qty_in.textContent = second_tbl_qty_in;
            qty_good.textContent = parseInt(qty_in.textContent) - parseInt(qtyng_input.value);
            total_qty = parseInt(qtyng_input.value) + parseInt(qty_good.textContent);
            qty_out_input.value = qty_good.textContent;
            qty_ng_input.textContent = parseInt(qtyng_input.value);
            quantity_unfinished.textContent = second_tbl_qty_in - total_qty;
        }

    }
    else {
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
        total_qty = ng_count + good_count;
        quantity_unfinished.textContent = second_tbl_qty_in - total_qty;
        qty_out_input.value = good_count;
        qty_ng_input.textContent = ng_count;
    }

}

function oninput_total_qty(line_number) {
    const result_type = document.getElementById('result_type').textContent;
    const total_qty = document.getElementById(`total_qty_${line_number}`).value;
    const wafer_no_to = document.getElementById(`wafer_number_to_${line_number}`).value;
    if (result_type === "Wafer") {
        if (parseInt(total_qty) > parseInt(wafer_no_to)) {
            swalALert('Error Found!', 'Total Quantity cannot be greater than Wafer number.', 'error');
            disableDoneBtn();
        }
        else {
            enableDoneBtn();
        }
    }
}

function oninput_wafer_numbers(line_number) {
    const wafer_number_from = document.getElementById(`wafer_number_from_${line_number}`);
    const wafer_number_to = document.getElementById(`wafer_number_to_${line_number}`);
    const total_quantity = document.getElementById(`total_quantity_${line_number}`);
    const result_type = document.getElementById('result_type').textContent;
    if (result_type === "Wafer") {
        let total_qty = parseInt(wafer_number_to.value) - parseInt(wafer_number_from.value) + 1;
        total_quantity.value = total_qty;
        total_quantity.setAttribute('readonly', 'true');
    }
}


// Disable button functions

function disableAddBatchBtn() {
    document.getElementById(`add_batch_btn`).disabled = true;
}

function disableDoneBtn() {
    document.getElementById(`done_btn`).disabled = true;
}

function disableAddOperatorBtn() {
    document.getElementById(`add_operator_btn`).disabled = true;
}

function disableDoneProcessBtn() {
    document.getElementById(`done_process_btn`).disabled = true;
}

function disableStartBtn(operator_number) {
    document.getElementById(`start_button_${operator_number}`).disabled = true;
}

function disableEndBtn(operator_number) {
    document.getElementById(`end_button_${operator_number}`).disabled = true;
}

function disableSaveBtn(operator_number) {
    document.getElementById(`save_button_${operator_number}`).disabled = true;
}
// Enable button functions

function enableAddBatchBtn() {
    document.getElementById(`add_batch_btn`).disabled = false;
}

function enableDoneBtn() {
    document.getElementById(`done_btn`).disabled = false;
}

function enableAddOperatorBtn() {
    document.getElementById(`add_operator_btn`).disabled = false;
}

function enableDoneProcessBtn() {
    document.getElementById(`done_process_btn`).disabled = false;
}

function enableStartBtn(operator_number) {
    document.getElementById(`start_button_${operator_number}`).disabled = false;
}

function enableEndBtn(operator_number) {
    document.getElementById(`end_button_${operator_number}`).disabled = false;
}

function enableSaveBtn(operator_number) {
    document.getElementById(`save_button_${operator_number}`).disabled = false;
}