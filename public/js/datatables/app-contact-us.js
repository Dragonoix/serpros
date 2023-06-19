$(function () {
    ('use strict');

    var dtUserTable = $('.user-list-table'),
        select = $('.select2'),
        statusObj = {
            'Active': { title: 'Active', class: 'badge-light-success' },
            'Inactive': { title: 'Inactive', class: 'badge-light-secondary' }
        };

    select.each(function () {
        var $this = $(this);
        $this.wrap('<div class="position-relative"></div>');
        $this.select2({
            // the following code is used to disable x-scrollbar when click in select input and
            // take 100% width in responsive also
            dropdownAutoWidth: true,
            width: '100%',
            dropdownParent: $this.parent()
        });
    });

    // Users List datatable
    if (dtUserTable.length) {
        dtUserTable.on('processing.dt', function () {
            let times = $('.calc-time-diff');
            if (times.length) {
                times.each(function () {
                    let currentHTML = $(this).html();
                    if (currentHTML) {
                        let hasUpdated = /updated/i.test(currentHTML);
                        let shownTime = currentHTML.replace('Updated', '').trim();
                        let oldtime = new Date(moment(shownTime, 'dddd, Do of MMMM, YYYY - hh:mm A (Z)').format());
                        calcTime($(this), oldtime, hasUpdated);
                    }
                });
            }
        }).DataTable({
            paging: true,
            sorting: true,
            serverSide: true,
            ajax: {
                url: `${window.location.protocol}//${window.location.host}/contact-us/getall`,
                method: 'post',
                dataFilter: function (data) {
                    var json = JSON.parse(data);
                    json.recordsTotal = json.data.recordsTotal;
                    json.recordsFiltered = json.data.recordsFiltered;
                    json.data = json.data.data;
                    return JSON.stringify(json);
                }
            },
            columns: [
                // columns according to JSON
                { data: '' },
                { data: 'fullName' },
                { data: 'email' },
                { data: 'phone' },
                { data: '' },
            ],
            columnDefs: [
                {
                    targets: 0,
                    title: 'Date',
                    orderable: false,
                    searchable: true,
                    render: function (data, type, full, meta) {
                        return moment(full['createdAt']).format('MM-DD-YYYY')
                    }
                },
                {
                    //Action
                    targets: -1,
                    title: 'Actions',
                    orderable: false,
                    searchable: false,
                    render: function (data, type, full, meta) {
                      return (
                        '<a href="' + window.location.protocol + '//' + window.location.host + '/contact-us/detail/' + full["_id"] + '" style="color:blue;">View</a>'
                      );
                    }
                  }
            ],
            order: [[1, 'asc']],
            dom:
                '<"d-flex justify-content-between align-items-center header-actions mx-2 row mt-75"' +
                '<"col-sm-12 col-lg-4 d-flex justify-content-center justify-content-lg-start" l>' +
                '<"col-sm-12 col-lg-8 ps-xl-75 ps-0"<"dt-action-buttons d-flex align-items-center justify-content-center justify-content-lg-end flex-lg-nowrap flex-wrap"<"me-1"f>B>>' +
                '>t' +
                '<"d-flex justify-content-between mx-2 row mb-1"' +
                '<"col-sm-12 col-md-6"i>' +
                '<"col-sm-12 col-md-6"p>' +
                '>',
            language: {
                sLengthMenu: 'Show _MENU_',
                search: 'Search',
                searchPlaceholder: 'Search..',
                "zeroRecords": "No data Found",
                "processing": 'Loading',
                paginate: {
                    // remove previous & next text from pagination
                    // previous: '&nbsp;',
                    // next: '&nbsp;'
                }
            },
            // Buttons with Dropdown
            buttons: [
                // {
                //     extend: 'collection',
                //     className: 'btn btn-outline-secondary dropdown-toggle me-2',
                //     text: feather.icons['external-link'].toSvg({ class: 'font-small-4 me-50' }) + 'Export',
                //     buttons: [
                //         {
                //             extend: 'print',
                //             text: feather.icons['printer'].toSvg({ class: 'font-small-4 me-50' }) + 'Print',
                //             className: 'dropdown-item',
                //             exportOptions: { columns: [1, 2, 3] }
                //         },
                //         {
                //             extend: 'csv',
                //             text: feather.icons['file-text'].toSvg({ class: 'font-small-4 me-50' }) + 'Csv',
                //             className: 'dropdown-item',
                //             exportOptions: { columns: [1, 2, 3] }
                //         },
                //         {
                //             extend: 'excel',
                //             text: feather.icons['file'].toSvg({ class: 'font-small-4 me-50' }) + 'Excel',
                //             className: 'dropdown-item',
                //             exportOptions: { columns: [1, 2, 3] }
                //         },
                //         {
                //             extend: 'pdf',
                //             text: feather.icons['clipboard'].toSvg({ class: 'font-small-4 me-50' }) + 'Pdf',
                //             className: 'dropdown-item',
                //             exportOptions: { columns: [1, 2, 3] }
                //         },
                //         {
                //             extend: 'copy',
                //             text: feather.icons['copy'].toSvg({ class: 'font-small-4 me-50' }) + 'Copy',
                //             className: 'dropdown-item',
                //             exportOptions: { columns: [1, 2, 3] }
                //         }
                //     ],
                //     init: function (api, node, config) {
                //         $(node).removeClass('btn-secondary');
                //         $(node).parent().removeClass('btn-group');
                //         setTimeout(function () {
                //             $(node).closest('.dt-buttons').removeClass('btn-group').addClass('d-inline-flex mt-50');
                //         }, 50);
                //     }
                // },
                // Add New Button
                // {
                //     text: 'Add Skill',
                //     className: 'add-new btn btn-primary',
                //     init: function (api, node, config) {
                //         $(node).removeClass('btn-secondary');
                //     }
                // }
            ],
            // For responsive popup
            responsive: {
                details: {
                    display: $.fn.dataTable.Responsive.display.modal({
                        header: function (row) {
                            var data = row.data();
                            return 'Details of ' + data['categoryName'];
                        }
                    }),
                    type: 'column',
                    renderer: function (api, rowIdx, columns) {
                        var data = $.map(columns, function (col, i) {
                            return col.columnIndex !== 6 // ? Do not show row in modal popup if title is blank (for check box)
                                ? '<tr data-dt-row="' +
                                col.rowIdx +
                                '" data-dt-column="' +
                                col.columnIndex +
                                '">' +
                                '<td>' +
                                col.title +
                                ':' +
                                '</td> ' +
                                '<td>' +
                                col.data +
                                '</td>' +
                                '</tr>'
                                : '';
                        }).join('');
                        return data ? $('<table class="table"/>').append('<tbody>' + data + '</tbody>') : false;
                    }
                }
            },

        });
    }

    $(document).on('click', '.add-new', function () {
        window.location.href = `${window.location.protocol}//${window.location.host}/contact-us/create`;
    });

    $(document).on('click', '.categoryStatusUpadte', function () {
        var elemID = $(this).data('id');
        var status = $(this).data('status');
        var inputs = new Promise((resolve, reject) => {
            setTimeout(() => {
                if (status === "Active") {
                    let options = {
                        "Active": "Active",
                        "Inactive": "Inactive"
                    }
                    return resolve(options);
                } else {
                    let options = {
                        "Inactive": "Inactive",
                        "Active": "Active"
                    }
                    return resolve(options);
                }
            }, 200);
        });
        swal.fire({
            title: 'Are you sure?',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, change it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then(function (result) {
            if (result.value) {
                window.location.href = `${window.location.protocol}//${window.location.host}/contact-us/status-change/${elemID}`;
            }
        });
    });

    $(document).on('click', '.deleteUser', function () {
        var elemID = $(this).attr('id').replace('del-', '');
        swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, cancel!',
            reverseButtons: true
        }).then(function (result) {
            if (result.value) {
                window.location.href = `${location.protocol}//${window.location.host}/contact-us/delete/${elemID}`;
            }
        });
    });
});



function calcTime(item, time, hasUpdated) {
    if (moment(time).isSameOrBefore(moment().subtract(23, 'hours'))) {
        if (hasUpdated) {
            $(item).html(`Updated ${moment(time).format('dddd, Do of MMMM, YYYY - hh:mm A (Z)')}`);
        } else {
            $(item).html(`${moment(time).format('dddd, Do of MMMM, YYYY - hh:mm A (Z)')}`);
        }
    } else {
        setInterval(function () {
            if (hasUpdated) {
                $(item).html(`Updated ${moment(time).fromNow()}`);
            } else {
                $(item).html(`${moment(time).fromNow()}`);
            }
        }, 1000);
    }

}

