$(document).ready(function () {
    $('#main_table').DataTable({
        pagingType: 'full',
        "lengthMenu": [ [10, 25, 50, 100, -1], [10, 25, 50, 100, "All"] ],
        "pageLength": 10
    });
});