'use strict';
let allow_to_navigate = true;

let FormControls = function () {
    let addNewUserValidation = function () {
        $("#userForm").validate({
            rules: {
                full_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                fullName: {
                    required: "Please enter fullname",
                    letterswithbasicpunc: "Please enter alphabets only",
                    minlength: "Please enter a valid fullname"
                },
                email: {
                    required: "Please enter email",
                    email: "Please enter a valid email"
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }
    let editUserValidation = function () {
        $("#editUserForm").validate({
            rules: {
                full_name: {
                    required: true,
                    letterswithbasicpunc: true,
                },
                email: {
                    required: true,
                    email: true
                },
                bio: {
                    maxlength: 30
                }
            },
            messages: {
                full_name: {
                    required: "Please enter Full Name",
                    letterswithbasicpunc: "Please enter alphabets only",
                    minlength: "Please enter a valid fullname"
                },
                email: {
                    required: "Please enter email",
                    email: "Please enter a valid email"
                },
                bio: {
                    maxlength: "Please enter bio within limit"
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }
    let adminAcntFrmValidation = function () {
        $("#adminAcntFrm").validate({
            rules: {
                first_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 3
                },
                last_name: {
                    required: true,
                    letterswithbasicpunc: true,
                    minlength: 3
                },
                email: {
                    required: true,
                    email: true
                }
            },
            messages: {
                first_name: {
                    required: "Please enter your first name",
                    letterswithbasicpunc: "Please enter alphabets only",
                    minlength: "Please enter a valid firstname"
                },
                last_name: {
                    required: "Please enter your last name",
                    letterswithbasicpunc: "Please enter alphabets only",
                    minlength: "Please enter a valid lastname"
                },
                email: {
                    required: "Please enter your email",
                    email: "Please enter a valid email"
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let adminChangePasswordValidation = function () {
        $("#adminChangePassword").validate({
            rules: {
                'old_password': {
                    required: true
                },
                'password': {
                    required: true,
                    minlength: 8
                },
                'confirm-new-password': {
                    required: true,
                    minlength: 8,
                    equalTo: '#account-new-password'
                }
            },
            messages: {
                'old_password': {
                    required: 'Enter old password'
                },
                'password': {
                    required: 'Enter new password',
                    minlength: 'Enter at least 8 characters'
                },
                'confirm-new-password': {
                    required: 'Please confirm new password',
                    minlength: 'Enter at least 8 characters',
                    equalTo: 'The password and its confirm are not the same'
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                // allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let formChangePasswordValidation = function () {
        $("#formChangePassword").validate({
            rules: {
                newPassword: {
                    required: true,
                    required: true,
                    pattern: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
                    minlength: 8
                },
                confirmPassword: {
                    required: true,
                    minlength: 8,
                    equalTo: '#newPassword'
                }
            },
            messages: {
                newPassword: {
                    required: 'Enter new password',
                    pattern: "Please meet password field's minimum requirements",
                    minlength: 'Enter at least 8 characters'
                },
                confirmPassword: {
                    required: 'Please confirm new password',
                    minlength: 'Enter at least 8 characters',
                    equalTo: 'The password and its confirm are not the same'
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let addNewCmsValidation = function () {
        $("#add-new-cms").validate({
            rules: {
                'title': {
                    required: true,
                    minlength: 3
                }
            },
            messages: {
                'title': {
                    required: 'Title is required',
                    minlength: "Please enter a valid title"
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                // form[0].submit();
                form[0].submit();
            }
        });
    }

    let settingsformValidation = function () {
        $("#settingsform").validate({
            rules: {
                'contactNumber': {
                    required: true,
                    phoneUS: true
                },
                'email': {
                    required: true,
                    email: true
                },
                'address': {
                    required: true
                },
                'playstoreURL': {
                    required: true,
                    url: true,
                    pattern: /play\.google/
                },
                'applestoreURL': {
                    required: true,
                    url: true,
                    pattern: /apple/
                },
                'socialLinks.fb': {
                    required: true,
                    url: true,
                    pattern: /^(https?:\/\/)?((w{3}\.)?)facebook\.com\/.*/i
                },
                'socialLinks.twtr': {
                    required: true,
                    url: true,
                    pattern: /^(https?:\/\/)?((w{3}\.)?)twitter\.com\/.*/i
                },
                'socialLinks.insta': {
                    required: true,
                    url: true,
                    pattern: /^(https?:\/\/)?((w{3}\.)?)instagram\.com\/.*/i
                },
                'socialLinks.lnkdn': {
                    required: true,
                    url: true,
                    pattern: /^(https?:\/\/)?((w{3}\.)?)linkedin\.com\/.*/i
                }
            },
            messages: {
                'contactNumber': {
                    required: 'Contact Number is required',
                    phoneUS: "US Contact Number is required"
                },
                'email': {
                    required: 'Email is required',
                    email: "Please enter a valid email"
                },
                'address': {
                    required: 'Address is required'
                },
                'playstoreURL': {
                    required: 'Play Store URL is required',
                    url: "Please enter a valid URL",
                    pattern: "Please enter a valid Google Play Store URL"
                },
                'applestoreURL': {
                    required: 'Apple Store URL is required',
                    url: "Please enter a valid URL",
                    pattern: "Please enter a valid Apple App Store URL"
                },
                'socialLinks.fb': {
                    required: 'Facebook URL is required',
                    url: "Please enter a valid URL",
                    pattern: "Please enter a valid Facebook URL"
                },
                'socialLinks.twtr': {
                    required: 'Twitter URL is required',
                    url: "Please enter a valid URL",
                    pattern: "Please enter a valid Twitter URL"
                },
                'socialLinks.insta': {
                    required: 'Instagram URL is required',
                    url: "Please enter a valid URL",
                    pattern: "Please enter a valid Instagram URL"
                },
                'socialLinks.lnkdn': {
                    required: 'LinkedIn URL is required',
                    url: "Please enter a valid URL",
                    pattern: "Please enter a valid LinkedIn URL"
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let addCategoryValidation = function () {
        $("#addCategoryForm").validate({
            rules: {
                'categoryName': {
                    required: true,
                }
            },
            messages: {
                'categoryName': {
                    required: 'Category Name Is Required',
                },
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let editCategoryValidation = function () {
        $("#editCategoryForm").validate({
            rules: {
                'categoryName': {
                    required: true,
                }
            },
            messages: {
                'categoryName': {
                    required: 'Category Name Is Required',
                },
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let addFaqValidation = function () {
        $("#addFaqForm").validate({
            ignore: "",
            rules: {
                'question': {
                    required: true,
                },
                'answer': {
                    required: true,
                }
            },
            messages: {
                'question': {
                    required: 'Question Is Required',
                },
                'answer': {
                    required: 'Answer Is Required',
                },
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let editFaqValidation = function () {
        $("#editFaqForm").validate({
            ignore: "",
            rules: {
                'question': {
                    required: true,
                },
                'answer': {
                    required: true,
                }
            },
            messages: {
                'question': {
                    required: 'Question Is Required',
                },
                'answer': {
                    required: 'Answer Is Required',
                },
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }


    let addTestimonialValidation = function () {
        $("#addTestimonialForm").validate({
            ignore: "",
            rules: {
                'name': {
                    required: true,
                },
                'rating': {
                    required: true
                },
                'message': {
                    required: true
                },
                'image': {
                    required: true
                }
            },
            messages: {
                'name': {
                    required: 'Name Is Required',
                },
                'rating': {
                    required: 'Rating Is Required'
                },
                'message': {
                    required: 'Message Is Required'
                },
                'image': {
                    required: 'Image Is Required'
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let editTestimonialValidation = function () {
        $("#editTestimonialForm").validate({
            rules: {
                'name': {
                    required: true,
                },
                'rating': {
                    required: true
                },
                'message': {
                    required: true
                }
            },
            messages: {
                'name': {
                    required: 'Name Is Required',
                },
                'rating': {
                    required: 'Rating Is Required'
                },
                'message': {
                    required: 'Message Is Required'
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let addRegionValidation = function () {
        $("#addRegionForm").validate({
            ignore: "",
            rules: {
                'regionName': {
                    required: true,
                },
            },
            messages: {
                'regionName': {
                    required: 'Region Name Is Required',
                },
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }
    let editRegionValidation = function () {
        $("#editRegionForm").validate({
            ignore: "",
            rules: {
                'greater_than': {
                    required: true,
                },
                'less_than': {
                    required: true,
                }
            },
            messages: {
                'greater_than': {
                    required: 'Greater Than Is Required',
                },
                'less_than': {
                    required: 'Less Than Is Required',
                },
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }


    let priceFilterMasterFormValidation = function () {
        $("#priceFilterMasterForm").validate({
            ignore: "",
            rules: {
                'greater_than': {
                    required: true,
                },
                'less_than': {
                    required: true,
                },
            },
            messages: {
                'greater_than': {
                    required: 'Greater Than Is Required',
                },
                'less_than': {
                    required: 'Less Than Is Required',
                },
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let addCityValidation = function () {
        $("#addCityForm").validate({
            ignore: "",
            rules: {
                'region': {
                    required: true,
                },
                'cityName': {
                    required: true,
                },
            },
            messages: {
                'region': {
                    required: 'Choose The Region',
                },
                'cityName': {
                    required: 'Please Enter City',
                },
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let editCityValidation = function () {
        $("#editCityForm").validate({
            ignore: "",
            rules: {
                'region': {
                    required: true,
                },
                'cityName': {
                    required: true,
                },
            },
            messages: {
                'region': {
                    required: 'Choose The Region',
                },
                'cityName': {
                    required: 'Please Enter City',
                },
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let addSuburbValidation = function () {
        $("#addSuburbForm").validate({
            ignore: "",
            rules: {
                'region': {
                    required: true,
                },
                'city': {
                    required: true,
                },
                'suburbName': {
                    required: true
                }
            },
            messages: {
                'region': {
                    required: 'Choose The Region',
                },
                'city': {
                    required: 'Choose The City',
                },
                'suburbName': {
                    required: 'Please Enter Suburb',
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let editSuburbValidation = function () {
        $("#editSuburbForm").validate({
            ignore: "",
            rules: {
                'region': {
                    required: true,
                },
                'city': {
                    required: true,
                },
                'suburbName': {
                    required: true
                }
            },
            messages: {
                'region': {
                    required: 'Choose The Region',
                },
                'city': {
                    required: 'Choose The City',
                },
                'suburbName': {
                    required: 'Please Enter Suburb',
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    
    let howItWorksformValidation = function () {
        $("#howItWorksform").validate({
            ignore: "",
            rules: {
                'btn_url1': {
                    required: false,
                    url: true,
                    pattern: /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
                },
                'btn_url2': {
                    required: false,
                    url: true,
                    pattern: /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
                },
                'btn_url3': {
                    required: false,
                    url: true,
                    pattern: /^(http|https|ftp):\/\/[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/i
                }
            },
            messages: {
                'btn_url1': {
                    url: "Please enter a URL",
                    pattern: "Please enter a valid URL"
                },
                'btn_url2': {
                    url: "Please enter a URL",
                    pattern: "Please enter a valid URL"
                },
                'btn_url3': {
                    url: "Please enter a URL",
                    pattern: "Please enter a valid URL"
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }

    let footerCmsformValidation = function () {
        $("#footerCmsform").validate({
            ignore: "",
            rules: {
                'phone': {
                    required: false,
                    pattern: /^(\+?1-?)?(\([2-9]\d{2}\)|[2-9]\d{2})-?[2-9]\d{2}-?\d{4}$/
                },
                'email': {
                    required: false,
                    pattern: /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/
                },
                'facebook_url': {
                    required: false,
                    url: true,
                    pattern: /^(https?:\/\/)?((w{3}\.)?)facebook\.com\/.*/i
                },
                'twitter_url': {
                    required: false,
                    url: true,
                    pattern: /^(https?:\/\/)?((w{3}\.)?)twitter\.com\/.*/i
                },
                'instagram_url': {
                    required: false,
                    url: true,
                    pattern: /^(https?:\/\/)?((w{3}\.)?)instagram\.com\/.*/i
                },
                'youtube_url': {
                    required: false,
                    url: true,
                    pattern: /^(https?:\/\/)?((w{3}\.)?)youtube\.com\/.*/i
                }
            },
            messages: {
                'phone': {
                    pattern: "Please enter a valid phone number"
                },
                'email': {
                    pattern: "Please enter a valid email address"
                },
                'facebook_url': {
                    url: "Please enter a valid URL",
                    pattern: "Please enter a valid Facebook URL"
                },
                'twitter_url': {
                    url: "Please enter a valid URL",
                    pattern: "Please enter a valid Twitter URL"
                },
                'instagram_url': {
                    url: "Please enter a valid URL",
                    pattern: "Please enter a valid Instagram URL"
                },
                'youtube_url': {
                    url: "Please enter a valid URL",
                    pattern: "Please enter a valid Youtube URL"
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });

    }



    let skillFormValidation = function () {
        $("#skillForm").validate({
            ignore: "",
            rules: {
                'skill': {
                    required: true,
                },
                'category': {
                    required: true,
                }
            },
            messages: {
                'skill': {
                    required: 'Enter Skill Name',
                },
                'category': {
                    required: 'Choose Category',
                }
            },
            invalidHandler: function (event, validator) {
                allow_to_navigate = false;
            },
            submitHandler: function (form) {
                allow_to_navigate = true;
                $(".app-content, nav, .main-menu").css("filter", "blur(5px)");
                $('#gif').css('visibility', 'visible');
                // $(form).submit();
                form[0].submit();
            }
        });
    }


    return {
        init: function () {
            addNewUserValidation();
            editUserValidation();
            adminAcntFrmValidation();
            adminChangePasswordValidation();
            formChangePasswordValidation();
            addNewCmsValidation();
            settingsformValidation();
            addCategoryValidation();
            editCategoryValidation();
            addFaqValidation();
            editFaqValidation();
            addTestimonialValidation();
            editTestimonialValidation();
            addRegionValidation();
            editRegionValidation();
            priceFilterMasterFormValidation();
            addCityValidation();
            editCityValidation();
            addSuburbValidation();
            editSuburbValidation();
            howItWorksformValidation();
            footerCmsformValidation();
            skillFormValidation();
        }
    };
}();

// Form Validation Initialize
$(document).ready(function () {
    FormControls.init();
    
    // Handle Dirty Form
    // $('form').on('change', function() {
    //     allow_to_navigate = false;
    //     // $(this).find("button[type='reset']").prop('disabled', false);
    //     $(this).find("button[type='submit']").prop('disabled', false);
    // });

    // $("button[type='reset']").on("click", function() {
    //     allow_to_navigate = true;
    //     // $("button[type='reset']").prop('disabled', true);
    //     $("button[type='submit']").prop('disabled', true);
    // });

    // if ($(document).find("form").length) {
    //     // $("button[type='reset']").prop('disabled', true);
    //     $("button[type='submit']").prop('disabled', true);
    //     let current__active_menu = $('li.active');
    //     window.addEventListener('beforeunload', function (event) {
    //         if (!allow_to_navigate) {
    //             event.preventDefault();
    //             event.returnValue = 'You have unsaved changes. Are you sure you want to navigate anyway?';
    //         }
    //     });

    //     $('li').on('click', function () {
    //         if (!allow_to_navigate) {
    //             setTimeout(function () {
    //                 $('li').removeClass('active');
    //                 if ($(current__active_menu).length) {
    //                     for (let i=0;i<$(current__active_menu).length;i++) {
    //                         $($(current__active_menu)[i]).addClass('active');
    //                     }
    //                 }
    //             }, 10);
    //         }
    //     });

    //     $('form').submit(function(){
    //         allow_to_navigate = true;
    //     });
    // }
    // Handle Dirty Form
});

