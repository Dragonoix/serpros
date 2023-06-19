('use strict');
// Revoke User Access
$(document).on('click', '.revoke_access', function () {
    let location = $(this).attr('data-location');
    let path = $(this).attr('data-url');
    if (location) {
        window.location.href = window.location.protocol + '//' + window.location.host + location + (path ? '?path=' + path : '');
    }
});
// Revoke User Access

// handle-date-time start

$(document).ready(function () {
    let allDates = document.querySelectorAll('.handle-date-time');
    if (allDates) {
        allDates.forEach((item, index, parent) => {
            let dateTime = $(item).attr('data-time');
            if (dateTime) {
                let timeText = '';
                let past24HrStartTime = moment().subtract(24, 'hours');
                if (moment(past24HrStartTime).isSameOrBefore(dateTime)) {
                    timeText = moment(dateTime).fromNow();
                } else {
                    timeText = moment(dateTime).format('YYYY-MM-DD hh:mm A');
                }
                $(item).text(timeText);
            }
        });
    }

    let select2 = $('.select2'),
        accountNumberMask = $('.dt-contact'),
        accountZipCode = $('.account-zip-code'),
        accountUploadImg = $('#account-upload-img'),
        accountUploadBtn = $('#account-upload'),
        accountUserImage = $('.uploadedAvatar'),
        accountResetBtn = $('#account-reset');
    //phone
    if (accountNumberMask.length) {
        accountNumberMask.each(function () {
            new Cleave($(this), {
                phone: true,
                phoneRegionCode: 'US'
            });
        });
    }

    //zip code
    if (accountZipCode.length) {
        accountZipCode.each(function () {
            new Cleave($(this), {
                delimiter: '',
                numeral: true
            });
        });
    }

    // For all Select2
    if (select2.length) {
        select2.each(function () {
            let $this = $(this);
            $this.wrap('<div class="position-relative"></div>');
            $this.select2({
                dropdownParent: $this.parent()
            });
        });
    }

    // Update user photo on click of button
    if (accountUserImage) {
        let resetImage = accountUserImage.attr('src');
        accountUploadBtn.on('change', function (e) {
            let reader = new FileReader(),
                files = e.target.files;
            reader.onload = function () {
                if (accountUploadImg) {
                    accountUploadImg.attr('src', reader.result);
                }
            };
            reader.readAsDataURL(files[0]);
            accountResetBtn.removeClass("d-none");
        });

        accountResetBtn.on('click', function () {
            accountUserImage.attr('src', resetImage);
            accountResetBtn.addClass("d-none");
        });
    }


    //Common JS For New Zealand Region Cities and Suburb > Location Module
    /* city as per state*/
    $('#region').change(function () {
        $('#city').html("<option disabled selected>Please Choose The City</option>");
        let regionId = $(this).val();
        
        $.ajax({
            type: "GET",
            url: window.location.protocol + '//' + window.location.host + "/city/get-all-cities/" + regionId,
            dataType: "json",
            beforeSend: function () {
            },
            success: function (result) {
                if (result.data.length > 0) {
                    var html = "<option disabled selected>Please Choose The City</option>";
                    $.each(result.data, function (index, value) {
                        html += "<option value=" + value._id + ">" + value.cityName + "</option>"
                    });
                    console.log(html);
                    $('#city').html(html);
                } else {
                    var html = "<option value=''>Select City</option>";
                    $('#city').html(html);
                }
            },
            error: function(err) {
                console.log(err);
            },
            complete: function () {
            },
        })

    });

    

});

// handle-date-time ends