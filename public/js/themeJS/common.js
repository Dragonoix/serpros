$(window).on('load', function() {
    if (feather) {
        feather.replace({
            width: 14,
            height: 14
        });
    }
    // Handle Day Night Toggler
    let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
    if (admin_day_night_toggler && admin_day_night_toggler == "night") {
        $("#light_dark").click();
        setTimeout(function () {
            sessionStorage.setItem("admin_day_night_toggler", "night");
            let darkBgColor = sessionStorage.getItem('dark-background-color');
            let darkCardBgColor = sessionStorage.getItem('dark-card-background-color');
            let darkCardMutedTextColor = sessionStorage.getItem('dark-card-muted-text-color');
            let darkMenuBgColor = sessionStorage.getItem('dark-menu-background-color');
            let darkMenuIconColor = sessionStorage.getItem('dark-menu-icon-color');
            let darkMenuHeaderTextColor = sessionStorage.getItem('dark-menu-header-text-color');
            let darkMenuBrandTextColor = sessionStorage.getItem('dark-menu-brand-text-color');
            let darkContentHeaderTextColor = sessionStorage.getItem('dark-content-header-text-color');
            let darkFormLabelTextColor = sessionStorage.getItem('dark-form-label-text-color');
            let darkAnchorColor = sessionStorage.getItem('dark-anchor-text-color');
            let darkHeaderTagTextColor = sessionStorage.getItem('dark-header-tag-text-color');
            let darkBodyTextColor = sessionStorage.getItem('dark-body-text-color');

            if (darkBgColor) {
                setTimeout(()=>{
                $('body, .dark-layout body').css('cssText', 'background-color: ' + darkBgColor + '!important');
                });
                $("#inputBgColorDark").val(darkBgColor)
            }

            if (darkCardBgColor) {
                $('.card').css('background-color', darkCardBgColor);
                $("#inputCardColorDark").val(darkCardBgColor)
            }

            if (darkCardMutedTextColor) {
                $('.text-muted').css('cssText', 'color: ' + darkCardMutedTextColor + ' !important');
                $("#inputCardMutedTextColorDark").val(darkCardMutedTextColor);
            }

            if (darkMenuBgColor) {
                $('.navbar-dark, .menu-dark, .navigation, nav, .main-menu').css('cssText', 'background-color: ' + darkMenuBgColor + ' !important');
                $("#inputMenuBgColorDark").val(darkMenuBgColor)
            }

            if (darkMenuIconColor) {
                // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('color', darkMenuIconColor);
                $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('cssText', 'color: ' + darkMenuIconColor + ' !important');
                $("#inputMenuIconColorDark").val(darkMenuIconColor)
            }

            if (darkMenuHeaderTextColor) {
                $('.main-menu.menu-dark .navigation .navigation-header').css('color', darkMenuHeaderTextColor);
                $("#inputMenuHeaderTextColorDark").val(darkMenuHeaderTextColor)
            }

            if (darkMenuBrandTextColor) {
                $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', darkMenuBrandTextColor);
                $("#inputMenuBrandTextColorDark").val(darkMenuBrandTextColor)
            }

            if (darkContentHeaderTextColor) {
                $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', darkContentHeaderTextColor);
                $("#inputContentHeaderTextColorDark").val(darkContentHeaderTextColor)
            }

            if (darkFormLabelTextColor) {
                $('.form-label').css('color', darkFormLabelTextColor);
                $("#inputFormLabelTextColorDark").val(darkFormLabelTextColor)
            }

            if (darkAnchorColor) {
                $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', darkAnchorColor);
                $("#inputAnchorTextColorDark").val(darkAnchorColor)
            }

            if (darkHeaderTagTextColor) {
                $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', darkHeaderTagTextColor);
                $("#inputHeaderTagTextColorDark").val(darkHeaderTagTextColor)
            }

            if (darkBodyTextColor) {
                $('body, .text-body').css('cssText', 'color: ' + darkBodyTextColor + ' !important');
                $("#inputBodyTextColorDark").val(darkBodyTextColor)
            }
        }, 10);
    }
    // switches between dark mode or light mode based on device color scheme
    else
    if (!admin_day_night_toggler && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        // dark mode
        setTimeout(function () {
            $("#light_dark").click();
        }, 10);
        setTimeout(function () {
            sessionStorage.setItem("admin_day_night_toggler", "night");
            let darkBgColor = sessionStorage.getItem('dark-background-color');
            let darkCardBgColor = sessionStorage.getItem('dark-card-background-color');
            let darkCardMutedTextColor = sessionStorage.getItem('dark-card-muted-text-color');
            let darkMenuBgColor = sessionStorage.getItem('dark-menu-background-color');
            let darkMenuIconColor = sessionStorage.getItem('dark-menu-icon-color');
            let darkMenuHeaderTextColor = sessionStorage.getItem('dark-menu-header-text-color');
            let darkMenuBrandTextColor = sessionStorage.getItem('dark-menu-brand-text-color');
            let darkContentHeaderTextColor = sessionStorage.getItem('dark-content-header-text-color');
            let darkFormLabelTextColor = sessionStorage.getItem('dark-form-label-text-color');
            let darkAnchorColor = sessionStorage.getItem('dark-anchor-text-color');
            let darkHeaderTagTextColor = sessionStorage.getItem('dark-header-tag-text-color');
            let darkBodyTextColor = sessionStorage.getItem('dark-body-text-color');

            if (darkBgColor) {
                setTimeout(()=>{
                $('body, .dark-layout body').css('cssText', 'background-color: ' + darkBgColor + '!important');
                });
                $("#inputBgColorDark").val(darkBgColor)
            }

            if (darkCardBgColor) {
                $('.card').css('background-color', darkCardBgColor);
                $("#inputCardColorDark").val(darkCardBgColor)
            }

            if (darkCardMutedTextColor) {
                $('.text-muted').css('cssText', 'color: ' + darkCardMutedTextColor + ' !important');
                $("#inputCardMutedTextColorDark").val(darkCardMutedTextColor);
            }

            if (darkMenuBgColor) {
                $('.navbar-dark, .menu-dark, .navigation, nav, .main-menu').css('cssText', 'background-color: ' + darkMenuBgColor + ' !important');
                $("#inputMenuBgColorDark").val(darkMenuBgColor)
            }

            if (darkMenuIconColor) {
                // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('color', darkMenuIconColor);
                $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('cssText', 'color: ' + darkMenuIconColor + ' !important');
                $("#inputMenuIconColorDark").val(darkMenuIconColor)
            }

            if (darkMenuHeaderTextColor) {
                $('.main-menu.menu-dark .navigation .navigation-header').css('color', darkMenuHeaderTextColor);
                $("#inputMenuHeaderTextColorDark").val(darkMenuHeaderTextColor)
            }

            if (darkMenuBrandTextColor) {
                $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', darkMenuBrandTextColor);
                $("#inputMenuBrandTextColorDark").val(darkMenuBrandTextColor)
            }

            if (darkContentHeaderTextColor) {
                $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', darkContentHeaderTextColor);
                $("#inputContentHeaderTextColorDark").val(darkContentHeaderTextColor)
            }

            if (darkFormLabelTextColor) {
                $('.form-label').css('color', darkFormLabelTextColor);
                $("#inputFormLabelTextColorDark").val(darkFormLabelTextColor)
            }

            if (darkAnchorColor) {
                $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', darkAnchorColor);
                $("#inputAnchorTextColorDark").val(darkAnchorColor)
            }

            if (darkHeaderTagTextColor) {
                $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', darkHeaderTagTextColor);
                $("#inputHeaderTagTextColorDark").val(darkHeaderTagTextColor)
            }

            if (darkBodyTextColor) {
                $('body, .text-body').css('cssText', 'color: ' + darkBodyTextColor + ' !important');
                $("#inputBodyTextColorDark").val(darkBodyTextColor)
            }
        }, 20);
    } else {
        let lightBgColor = sessionStorage.getItem('light-background-color');
        let lightCardBgColor = sessionStorage.getItem('light-card-background-color');
        let lightCardMutedTextColor = sessionStorage.getItem('light-card-muted-text-color');
        let lightMenuBgColor = sessionStorage.getItem('light-menu-background-color');
        let lightMenuIconColor = sessionStorage.getItem('light-menu-icon-color');
        let lightMenuHeaderTextColor = sessionStorage.getItem('light-menu-header-text-color');
        let lightMenuBrandTextColor = sessionStorage.getItem('light-menu-brand-text-color');
        let lightContentHeaderTextColor = sessionStorage.getItem('light-content-header-text-color');
        let lightFormLabelTextColor = sessionStorage.getItem('light-form-label-text-color');
        let lightAnchorColor = sessionStorage.getItem('light-anchor-text-color');
        let lightHeaderTagTextColor = sessionStorage.getItem('light-header-tag-text-color');
        let lightBodyTextColor = sessionStorage.getItem('light-body-text-color');

        if (lightBgColor) {
            setTimeout(()=>{
            $('body').css("cssText",'background-color: ' + lightBgColor + ' !important');
            },15);
            $("#inputBgColorLight").val(lightBgColor)
        }

        if (lightCardBgColor) {
            $('.card').css('background-color', lightCardBgColor);
            $("#inputCardColorLight").val(lightCardBgColor)
        }

        if (lightCardMutedTextColor) {
            $('.text-muted').css('cssText', 'color: ' + lightCardMutedTextColor + ' !important');
            $("#inputCardMutedTextColorLight").val(lightCardMutedTextColor);
        }

        if (lightMenuBgColor) {
            $('.navbar-light, .menu-light, .navigation, nav, .main-menu').css('background-color', lightMenuBgColor);
            $("#inputMenuBgColorLight").val(lightMenuBgColor)
        }

        if (lightMenuIconColor) {
            // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('color', lightMenuIconColor);
            $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('cssText', 'color: ' + lightMenuIconColor + ' !important');
            $("#inputMenuIconColorLight").val(lightMenuIconColor)
        }

        if (lightMenuHeaderTextColor) {
            $('.main-menu.menu-light .navigation .navigation-header').css('color', lightMenuHeaderTextColor);
            $("#inputMenuHeaderTextColorLight").val(lightMenuHeaderTextColor)
        }

        if (lightMenuBrandTextColor) {
            $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', lightMenuBrandTextColor);
            $("#inputMenuBrandTextColorLight").val(lightMenuBrandTextColor)
        }

        if (lightContentHeaderTextColor) {
            $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', lightContentHeaderTextColor);
            $("#inputContentHeaderTextColorLight").val(lightContentHeaderTextColor)
        }

        if (lightFormLabelTextColor) {
            $('.form-label').css('color', lightFormLabelTextColor);
            $("#inputFormLabelTextColorLight").val(lightFormLabelTextColor)
        }

        if (lightAnchorColor) {
            $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', lightAnchorColor);
            $("#inputAnchorTextColorLight").val(lightAnchorColor)
        }

        if (lightHeaderTagTextColor) {
            $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', lightHeaderTagTextColor);
            $("#inputHeaderTagTextColorLight").val(lightHeaderTagTextColor)
        }

        if (lightBodyTextColor) {
            $('body, .text-body').css('cssText', 'color: ' + lightBodyTextColor + ' !important');
            $("#inputBodyTextColorLight").val(lightBodyTextColor)
        }
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        const newColorScheme = event.matches ? "dark" : "light";
        if (newColorScheme == 'dark') {
            if (admin_day_night_toggler == "day") {
                setTimeout(function () {
                    $("#light_dark").click();
                }, 10);
            }
            
            setTimeout(function () {
                sessionStorage.setItem("admin_day_night_toggler", "night");
                let darkBgColor = sessionStorage.getItem('dark-background-color');
                let darkCardBgColor = sessionStorage.getItem('dark-card-background-color');
                let darkCardMutedTextColor = sessionStorage.getItem('dark-card-muted-text-color');
                let darkMenuBgColor = sessionStorage.getItem('dark-menu-background-color');
                let darkMenuIconColor = sessionStorage.getItem('dark-menu-icon-color');
                let darkMenuHeaderTextColor = sessionStorage.getItem('dark-menu-header-text-color');
                let darkMenuBrandTextColor = sessionStorage.getItem('dark-menu-brand-text-color');
                let darkContentHeaderTextColor = sessionStorage.getItem('dark-content-header-text-color');
                let darkFormLabelTextColor = sessionStorage.getItem('dark-form-label-text-color');
                let darkAnchorColor = sessionStorage.getItem('dark-anchor-text-color');
                let darkHeaderTagTextColor = sessionStorage.getItem('dark-header-tag-text-color');
                let darkBodyTextColor = sessionStorage.getItem('dark-body-text-color');

                if (darkBgColor) {
                    setTimeout(()=>{
                    $('body, .dark-layout body').css('cssText', 'background-color: ' + darkBgColor + '!important');
                    });
                    $("#inputBgColorDark").val(darkBgColor)
                }

                if (darkCardBgColor) {
                    $('.card').css('background-color', darkCardBgColor);
                    $("#inputCardColorDark").val(darkCardBgColor)
                }

                if (darkCardMutedTextColor) {
                    $('.text-muted').css('cssText', 'color: ' + darkCardMutedTextColor + ' !important');
                    $("#inputCardMutedTextColorDark").val(darkCardMutedTextColor);
                }

                if (darkMenuBgColor) {
                    $('.navbar-dark, .menu-dark, .navigation, nav, .main-menu').css('cssText', 'background-color: ' + darkMenuBgColor + ' !important');
                    $("#inputMenuBgColorDark").val(darkMenuBgColor)
                }

                if (darkMenuIconColor) {
                    // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('color', darkMenuIconColor);
                    $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('cssText', 'color: ' + darkMenuIconColor + ' !important');
                    $("#inputMenuIconColorDark").val(darkMenuIconColor)
                }

                if (darkMenuHeaderTextColor) {
                    $('.main-menu.menu-dark .navigation .navigation-header').css('color', darkMenuHeaderTextColor);
                    $("#inputMenuHeaderTextColorDark").val(darkMenuHeaderTextColor)
                }

                if (darkMenuBrandTextColor) {
                    $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', darkMenuBrandTextColor);
                    $("#inputMenuBrandTextColorDark").val(darkMenuBrandTextColor)
                }

                if (darkContentHeaderTextColor) {
                    $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', darkContentHeaderTextColor);
                    $("#inputContentHeaderTextColorDark").val(darkContentHeaderTextColor)
                }

                if (darkFormLabelTextColor) {
                    $('.form-label').css('color', darkFormLabelTextColor);
                    $("#inputFormLabelTextColorDark").val(darkFormLabelTextColor)
                }

                if (darkAnchorColor) {
                    $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', darkAnchorColor);
                    $("#inputAnchorTextColorDark").val(darkAnchorColor)
                }

                if (darkHeaderTagTextColor) {
                    $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', darkHeaderTagTextColor);
                    $("#inputHeaderTagTextColorDark").val(darkHeaderTagTextColor)
                }

                if (darkBodyTextColor) {
                    $('body, .text-body').css('cssText', 'color: ' + darkBodyTextColor + ' !important');
                    $("#inputBodyTextColorDark").val(darkBodyTextColor)
                }
            }, 12);
        } else {
            if (admin_day_night_toggler == "night") {
                setTimeout(function () {
                    $("#light_dark").click();
                }, 10);
            }
            
            setTimeout(function () {
                sessionStorage.setItem("admin_day_night_toggler", "day");
                let lightBgColor = sessionStorage.getItem('light-background-color');
                let lightCardBgColor = sessionStorage.getItem('light-card-background-color');
                let lightCardMutedTextColor = sessionStorage.getItem('light-card-muted-text-color');
                let lightMenuBgColor = sessionStorage.getItem('light-menu-background-color');
                let lightMenuIconColor = sessionStorage.getItem('light-menu-icon-color');
                let lightMenuHeaderTextColor = sessionStorage.getItem('light-menu-header-text-color');
                let lightMenuBrandTextColor = sessionStorage.getItem('light-menu-brand-text-color');
                let lightContentHeaderTextColor = sessionStorage.getItem('light-content-header-text-color');
                let lightFormLabelTextColor = sessionStorage.getItem('light-form-label-text-color');
                let lightAnchorColor = sessionStorage.getItem('light-anchor-text-color');
                let lightHeaderTagTextColor = sessionStorage.getItem('light-header-tag-text-color');
                let lightBodyTextColor = sessionStorage.getItem('light-body-text-color');

                if (lightBgColor) {
                    setTimeout(()=>{
                    $('body').css("cssText",'background-color: ' + lightBgColor + ' !important');
                    },15);
                    $("#inputBgColorLight").val(lightBgColor)
                }

                if (lightCardBgColor) {
                    $('.card').css('background-color', lightCardBgColor);
                    $("#inputCardColorLight").val(lightCardBgColor)
                }

                if (lightCardMutedTextColor) {
                    $('.text-muted').css('cssText', 'color: ' + lightCardMutedTextColor + ' !important');
                    $("#inputCardMutedTextColorLight").val(lightCardMutedTextColor);
                }

                if (lightMenuBgColor) {
                    $('.navbar-light, .menu-light, .navigation, nav, .main-menu').css('background-color', lightMenuBgColor);
                    $("#inputMenuBgColorLight").val(lightMenuBgColor)
                }

                if (lightMenuIconColor) {
                    // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('color', lightMenuIconColor);
                    $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('cssText', 'color: ' + lightMenuIconColor + ' !important');
                    $("#inputMenuIconColorLight").val(lightMenuIconColor)
                }

                if (lightMenuHeaderTextColor) {
                    $('.main-menu.menu-light .navigation .navigation-header').css('color', lightMenuHeaderTextColor);
                    $("#inputMenuHeaderTextColorLight").val(lightMenuHeaderTextColor)
                }

                if (lightMenuBrandTextColor) {
                    $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', lightMenuBrandTextColor);
                    $("#inputMenuBrandTextColorLight").val(lightMenuBrandTextColor)
                }

                if (lightContentHeaderTextColor) {
                    $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', lightContentHeaderTextColor);
                    $("#inputContentHeaderTextColorLight").val(lightContentHeaderTextColor)
                }

                if (lightFormLabelTextColor) {
                    $('.form-label').css('color', lightFormLabelTextColor);
                    $("#inputFormLabelTextColorLight").val(lightFormLabelTextColor)
                }

                if (lightAnchorColor) {
                    $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', lightAnchorColor);
                    $("#inputAnchorTextColorLight").val(lightAnchorColor)
                }

                if (lightHeaderTagTextColor) {
                    $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', lightHeaderTagTextColor);
                    $("#inputHeaderTagTextColorLight").val(lightHeaderTagTextColor)
                }

                if (lightBodyTextColor) {
                    $('body').css('color', lightBodyTextColor);
                    $("#inputBodyTextColorLight").val(lightBodyTextColor)
                }
            }, 12);
        }
    });
    // switches between dark mode or light mode based on device color scheme ends here

    // Handle Day Night Toggler

    let times = $('.calc-time-diff');
    if (times.length) {
        times.each(function(){
            let currentHTML = $(this).html();
            if (currentHTML) {
                let hasUpdated = /updated/i.test(currentHTML);
                let shownTime = currentHTML.replace('Updated', '').trim();
                let oldtime = new Date(shownTime);
                calcTime($(this), oldtime, hasUpdated);
            }
        });
    }
});

function calcTime(item, time, hasUpdated) {
    if (moment(time).isSameOrBefore(moment().subtract(23, 'hours'))) {
        if (hasUpdated) {
            $(item).html(`Updated ${moment(time).format('dddd, Do of MMMM, YYYY - hh:mm A (Z)')}`);
        } else {
            $(item).html(`${moment(time).format('dddd, Do of MMMM, YYYY - hh:mm A (Z)')}`);
        }
    } else {
        setInterval(function(){
            if (hasUpdated) {
                $(item).html(`Updated ${moment(time).fromNow()}`);
            } else {
                $(item).html(`${moment(time).fromNow()}`);
            }
        }, 1000);
    }
}

// Handle Day Night Toggler
$("#light_dark").on("click", function() {
    let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
    if (admin_day_night_toggler) {
        if (admin_day_night_toggler == "night") {
            sessionStorage.setItem("admin_day_night_toggler", "day");
            let lightBgColor = sessionStorage.getItem('light-background-color');
            let lightCardBgColor = sessionStorage.getItem('light-card-background-color');
            let lightCardMutedTextColor = sessionStorage.getItem('light-card-muted-text-color');
            let lightMenuBgColor = sessionStorage.getItem('light-menu-background-color');
            let lightMenuIconColor = sessionStorage.getItem('light-menu-icon-color');
            let lightMenuHeaderTextColor = sessionStorage.getItem('light-menu-header-text-color');
            let lightMenuBrandTextColor = sessionStorage.getItem('light-menu-brand-text-color');
            let lightContentHeaderTextColor = sessionStorage.getItem('light-content-header-text-color');
            let lightFormLabelTextColor = sessionStorage.getItem('light-form-label-text-color');
            let lightAnchorColor = sessionStorage.getItem('light-anchor-text-color');
            let lightHeaderTagTextColor = sessionStorage.getItem('light-header-tag-text-color');
            let lightBodyTextColor = sessionStorage.getItem('light-body-text-color');

            if (lightBgColor) {
                setTimeout(()=>{
                $('body').css("cssText",'background-color: ' + lightBgColor + ' !important');
                },15);
                $("#inputBgColorLight").val(lightBgColor)
            }

            if (lightCardBgColor) {
                $('.card').css('background-color', lightCardBgColor);
                $("#inputCardColorLight").val(lightCardBgColor)
            }

            if (lightCardMutedTextColor) {
                $('.text-muted').css('cssText', 'color: ' + lightCardMutedTextColor + ' !important');
                $("#inputCardMutedTextColorLight").val(lightCardMutedTextColor);
            }

            if (lightMenuBgColor) {
                $('.navbar-light, .menu-light, .navigation, nav, .main-menu').css('background-color', lightMenuBgColor);
                $("#inputMenuBgColorLight").val(lightMenuBgColor)
            }

            if (lightMenuIconColor) {
                // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('color', lightMenuIconColor);
                $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('cssText', 'color: ' + lightMenuIconColor + ' !important');
                $("#inputMenuIconColorLight").val(lightMenuIconColor)
            }

            if (lightMenuHeaderTextColor) {
                $('.main-menu.menu-light .navigation .navigation-header').css('color', lightMenuHeaderTextColor);
                $("#inputMenuHeaderTextColorLight").val(lightMenuHeaderTextColor)
            }

            if (lightMenuBrandTextColor) {
                $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', lightMenuBrandTextColor);
                $("#inputMenuBrandTextColorLight").val(lightMenuBrandTextColor)
            }

            if (lightContentHeaderTextColor) {
                $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', lightContentHeaderTextColor);
                $("#inputContentHeaderTextColorLight").val(lightContentHeaderTextColor)
            }

            if (lightFormLabelTextColor) {
                $('.form-label').css('color', lightFormLabelTextColor);
                $("#inputFormLabelTextColorLight").val(lightFormLabelTextColor)
            }

            if (lightAnchorColor) {
                $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', lightAnchorColor);
                $("#inputAnchorTextColorLight").val(lightAnchorColor)
            }

            if (lightHeaderTagTextColor) {
                $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', lightHeaderTagTextColor);
                $("#inputHeaderTagTextColorLight").val(lightHeaderTagTextColor)
            }

            if (lightBodyTextColor) {
                $('body').css('color', lightBodyTextColor);
                $("#inputBodyTextColorLight").val(lightBodyTextColor)
            }
        } else {
            sessionStorage.setItem("admin_day_night_toggler", "night");
            let darkBgColor = sessionStorage.getItem('dark-background-color');
            let darkCardBgColor = sessionStorage.getItem('dark-card-background-color');
            let darkCardMutedTextColor = sessionStorage.getItem('dark-card-muted-text-color');
            let darkMenuBgColor = sessionStorage.getItem('dark-menu-background-color');
            let darkMenuIconColor = sessionStorage.getItem('dark-menu-icon-color');
            let darkMenuHeaderTextColor = sessionStorage.getItem('dark-menu-header-text-color');
            let darkMenuBrandTextColor = sessionStorage.getItem('dark-menu-brand-text-color');
            let darkContentHeaderTextColor = sessionStorage.getItem('dark-content-header-text-color');
            let darkFormLabelTextColor = sessionStorage.getItem('dark-form-label-text-color');
            let darkAnchorColor = sessionStorage.getItem('dark-anchor-text-color');
            let darkHeaderTagTextColor = sessionStorage.getItem('dark-header-tag-text-color');
            let darkBodyTextColor = sessionStorage.getItem('dark-body-text-color');

            if (darkBgColor) {
                setTimeout(()=>{
                $('body, .dark-layout body').css('cssText', 'background-color: ' + darkBgColor + '!important');
                });
                $("#inputBgColorDark").val(darkBgColor)
            }

            if (darkCardBgColor) {
                $('.card').css('background-color', darkCardBgColor);
                $("#inputCardColorDark").val(darkCardBgColor)
            }

            if (darkCardMutedTextColor) {
                $('.text-muted').css('cssText', 'color: ' + darkCardMutedTextColor + ' !important');
                $("#inputCardMutedTextColorDark").val(darkCardMutedTextColor);
            }

            if (darkMenuBgColor) {
                $('.navbar-dark, .menu-dark, .navigation, nav, .main-menu').css('cssText', 'background-color: ' + darkMenuBgColor + ' !important');
                $("#inputMenuBgColorDark").val(darkMenuBgColor)
            }

            if (darkMenuIconColor) {
                // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('color', darkMenuIconColor);
                $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('cssText', 'color: ' + darkMenuIconColor + ' !important');
                $("#inputMenuIconColorDark").val(darkMenuIconColor)
            }

            if (darkMenuHeaderTextColor) {
                $('.main-menu.menu-dark .navigation .navigation-header').css('color', darkMenuHeaderTextColor);
                $("#inputMenuHeaderTextColorDark").val(darkMenuHeaderTextColor)
            }

            if (darkMenuBrandTextColor) {
                $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', darkMenuBrandTextColor);
                $("#inputMenuBrandTextColorDark").val(darkMenuBrandTextColor)
            }

            if (darkContentHeaderTextColor) {
                $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', darkContentHeaderTextColor);
                $("#inputContentHeaderTextColorDark").val(darkContentHeaderTextColor)
            }

            if (darkFormLabelTextColor) {
                $('.form-label').css('color', darkFormLabelTextColor);
                $("#inputFormLabelTextColorDark").val(darkFormLabelTextColor)
            }

            if (darkAnchorColor) {
                $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', darkAnchorColor);
                $("#inputAnchorTextColorDark").val(darkAnchorColor)
            }

            if (darkHeaderTagTextColor) {
                $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', darkHeaderTagTextColor);
                $("#inputHeaderTagTextColorDark").val(darkHeaderTagTextColor)
            }

            if (darkBodyTextColor) {
                $('body, .text-body').css('cssText', 'color: ' + darkBodyTextColor + ' !important');
                $("#inputBodyTextColorDark").val(darkBodyTextColor)
            }
        }
    } else {
        sessionStorage.setItem("admin_day_night_toggler", "night");
        let darkBgColor = sessionStorage.getItem('dark-background-color');
        let darkCardBgColor = sessionStorage.getItem('dark-card-background-color');
        let darkCardMutedTextColor = sessionStorage.getItem('dark-card-muted-text-color');
        let darkMenuBgColor = sessionStorage.getItem('dark-menu-background-color');
        let darkMenuIconColor = sessionStorage.getItem('dark-menu-icon-color');
        let darkMenuHeaderTextColor = sessionStorage.getItem('dark-menu-header-text-color');
        let darkMenuBrandTextColor = sessionStorage.getItem('dark-menu-brand-text-color');
        let darkContentHeaderTextColor = sessionStorage.getItem('dark-content-header-text-color');
        let darkFormLabelTextColor = sessionStorage.getItem('dark-form-label-text-color');
        let darkAnchorColor = sessionStorage.getItem('dark-anchor-text-color');
        let darkHeaderTagTextColor = sessionStorage.getItem('dark-header-tag-text-color');
        let darkBodyTextColor = sessionStorage.getItem('dark-body-text-color');

        if (darkBgColor) {
            setTimeout(()=>{
            $('body, .dark-layout body').css('cssText', 'background-color: ' + darkBgColor + '!important');
            });
            $("#inputBgColorDark").val(darkBgColor)
        }

        if (darkCardBgColor) {
            $('.card').css('background-color', darkCardBgColor);
            $("#inputCardColorDark").val(darkCardBgColor)
        }

        if (darkCardMutedTextColor) {
            $('.text-muted').css('cssText', 'color: ' + darkCardMutedTextColor + ' !important');
            $("#inputCardMutedTextColorDark").val(darkCardMutedTextColor);
        }

        if (darkMenuBgColor) {
            $('.navbar-dark, .menu-dark, .navigation, nav, .main-menu').css('cssText', 'background-color: ' + darkMenuBgColor + ' !important');
            $("#inputMenuBgColorDark").val(darkMenuBgColor)
        }

        if (darkMenuIconColor) {
            // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('color', darkMenuIconColor);
            $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('cssText', 'color: ' + darkMenuIconColor + ' !important');
            $("#inputMenuIconColorDark").val(darkMenuIconColor)
        }

        if (darkMenuHeaderTextColor) {
            $('.main-menu.menu-dark .navigation .navigation-header').css('color', darkMenuHeaderTextColor);
            $("#inputMenuHeaderTextColorDark").val(darkMenuHeaderTextColor)
        }

        if (darkMenuBrandTextColor) {
            $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', darkMenuBrandTextColor);
            $("#inputMenuBrandTextColorDark").val(darkMenuBrandTextColor)
        }

        if (darkContentHeaderTextColor) {
            $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', darkContentHeaderTextColor);
            $("#inputContentHeaderTextColorDark").val(darkContentHeaderTextColor)
        }

        if (darkFormLabelTextColor) {
            $('.form-label').css('color', darkFormLabelTextColor);
            $("#inputFormLabelTextColorDark").val(darkFormLabelTextColor)
        }

        if (darkAnchorColor) {
            $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', darkAnchorColor);
            $("#inputAnchorTextColorDark").val(darkAnchorColor)
        }

        if (darkHeaderTagTextColor) {
            $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', darkHeaderTagTextColor);
            $("#inputHeaderTagTextColorDark").val(darkHeaderTagTextColor)
        }

        if (darkBodyTextColor) {
            $('body, .text-body').css('cssText', 'color: ' + darkBodyTextColor + ' !important');
            $("#inputBodyTextColorDark").val(darkBodyTextColor)
        }
    }
});

$("#light_dark_2").on("click", function() {
    let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
    if (admin_day_night_toggler) {
        if (admin_day_night_toggler == "night") {
            sessionStorage.setItem("admin_day_night_toggler", "day");
            let lightBgColor = sessionStorage.getItem('light-background-color');
            let lightCardBgColor = sessionStorage.getItem('light-card-background-color');
            let lightCardMutedTextColor = sessionStorage.getItem('light-card-muted-text-color');
            let lightMenuBgColor = sessionStorage.getItem('light-menu-background-color');
            let lightMenuIconColor = sessionStorage.getItem('light-menu-icon-color');
            let lightMenuHeaderTextColor = sessionStorage.getItem('light-menu-header-text-color');
            let lightMenuBrandTextColor = sessionStorage.getItem('light-menu-brand-text-color');
            let lightContentHeaderTextColor = sessionStorage.getItem('light-content-header-text-color');
            let lightFormLabelTextColor = sessionStorage.getItem('light-form-label-text-color');
            let lightAnchorColor = sessionStorage.getItem('light-anchor-text-color');
            let lightHeaderTagTextColor = sessionStorage.getItem('light-header-tag-text-color');
            let lightBodyTextColor = sessionStorage.getItem('light-body-text-color');

            if (lightBgColor) {
                setTimeout(()=>{
                $('body').css("cssText",'background-color: ' + lightBgColor + ' !important');
                },15);
                $("#inputBgColorLight").val(lightBgColor)
            }

            if (lightCardBgColor) {
                $('.card').css('background-color', lightCardBgColor);
                $("#inputCardColorLight").val(lightCardBgColor)
            }

            if (lightCardMutedTextColor) {
                $('.text-muted').css('cssText', 'color: ' + lightCardMutedTextColor + ' !important');
                $("#inputCardMutedTextColorLight").val(lightCardMutedTextColor);
            }

            if (lightMenuBgColor) {
                $('.navbar-light, .menu-light, .navigation, nav, .main-menu').css('background-color', lightMenuBgColor);
                $("#inputMenuBgColorLight").val(lightMenuBgColor)
            }

            if (lightMenuIconColor) {
                // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('color', lightMenuIconColor);
                $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('cssText', 'color: ' + lightMenuIconColor + ' !important');
                $("#inputMenuIconColorLight").val(lightMenuIconColor)
            }

            if (lightMenuHeaderTextColor) {
                $('.main-menu.menu-light .navigation .navigation-header').css('color', lightMenuHeaderTextColor);
                $("#inputMenuHeaderTextColorLight").val(lightMenuHeaderTextColor)
            }

            if (lightMenuBrandTextColor) {
                $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', lightMenuBrandTextColor);
                $("#inputMenuBrandTextColorLight").val(lightMenuBrandTextColor)
            }

            if (lightContentHeaderTextColor) {
                $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', lightContentHeaderTextColor);
                $("#inputContentHeaderTextColorLight").val(lightContentHeaderTextColor)
            }

            if (lightFormLabelTextColor) {
                $('.form-label').css('color', lightFormLabelTextColor);
                $("#inputFormLabelTextColorLight").val(lightFormLabelTextColor)
            }

            if (lightAnchorColor) {
                $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', lightAnchorColor);
                $("#inputAnchorTextColorLight").val(lightAnchorColor)
            }

            if (lightHeaderTagTextColor) {
                $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', lightHeaderTagTextColor);
                $("#inputHeaderTagTextColorLight").val(lightHeaderTagTextColor)
            }

            if (lightBodyTextColor) {
                $('body').css('color', lightBodyTextColor);
                $("#inputBodyTextColorLight").val(lightBodyTextColor)
            }
        } else {
            sessionStorage.setItem("admin_day_night_toggler", "night");
            let darkBgColor = sessionStorage.getItem('dark-background-color');
            let darkCardBgColor = sessionStorage.getItem('dark-card-background-color');
            let darkCardMutedTextColor = sessionStorage.getItem('dark-card-muted-text-color');
            let darkMenuBgColor = sessionStorage.getItem('dark-menu-background-color');
            let darkMenuIconColor = sessionStorage.getItem('dark-menu-icon-color');
            let darkMenuHeaderTextColor = sessionStorage.getItem('dark-menu-header-text-color');
            let darkMenuBrandTextColor = sessionStorage.getItem('dark-menu-brand-text-color');
            let darkContentHeaderTextColor = sessionStorage.getItem('dark-content-header-text-color');
            let darkFormLabelTextColor = sessionStorage.getItem('dark-form-label-text-color');
            let darkAnchorColor = sessionStorage.getItem('dark-anchor-text-color');
            let darkHeaderTagTextColor = sessionStorage.getItem('dark-header-tag-text-color');
            let darkBodyTextColor = sessionStorage.getItem('dark-body-text-color');

            if (darkBgColor) {
                setTimeout(()=>{
                $('body, .dark-layout body').css('cssText', 'background-color: ' + darkBgColor + '!important');
                });
                $("#inputBgColorDark").val(darkBgColor)
            }

            if (darkCardBgColor) {
                $('.card').css('background-color', darkCardBgColor);
                $("#inputCardColorDark").val(darkCardBgColor)
            }

            if (darkCardMutedTextColor) {
                $('.text-muted').css('cssText', 'color: ' + darkCardMutedTextColor + ' !important');
                $("#inputCardMutedTextColorDark").val(darkCardMutedTextColor);
            }

            if (darkMenuBgColor) {
                $('.navbar-dark, .menu-dark, .navigation, nav, .main-menu').css('cssText', 'background-color: ' + darkMenuBgColor + ' !important');
                $("#inputMenuBgColorDark").val(darkMenuBgColor)
            }

            if (darkMenuIconColor) {
                // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('color', darkMenuIconColor);
                $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('cssText', 'color: ' + darkMenuIconColor + ' !important');
                $("#inputMenuIconColorDark").val(darkMenuIconColor)
            }

            if (darkMenuHeaderTextColor) {
                $('.main-menu.menu-dark .navigation .navigation-header').css('color', darkMenuHeaderTextColor);
                $("#inputMenuHeaderTextColorDark").val(darkMenuHeaderTextColor)
            }

            if (darkMenuBrandTextColor) {
                $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', darkMenuBrandTextColor);
                $("#inputMenuBrandTextColorDark").val(darkMenuBrandTextColor)
            }

            if (darkContentHeaderTextColor) {
                $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', darkContentHeaderTextColor);
                $("#inputContentHeaderTextColorDark").val(darkContentHeaderTextColor)
            }

            if (darkFormLabelTextColor) {
                $('.form-label').css('color', darkFormLabelTextColor);
                $("#inputFormLabelTextColorDark").val(darkFormLabelTextColor)
            }

            if (darkAnchorColor) {
                $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', darkAnchorColor);
                $("#inputAnchorTextColorDark").val(darkAnchorColor)
            }

            if (darkHeaderTagTextColor) {
                $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', darkHeaderTagTextColor);
                $("#inputHeaderTagTextColorDark").val(darkHeaderTagTextColor)
            }

            if (darkBodyTextColor) {
                $('body, .text-body').css('cssText', 'color: ' + darkBodyTextColor + ' !important');
                $("#inputBodyTextColorDark").val(darkBodyTextColor)
            }
        }
    } else {
        sessionStorage.setItem("admin_day_night_toggler", "night");
        let darkBgColor = sessionStorage.getItem('dark-background-color');
        let darkCardBgColor = sessionStorage.getItem('dark-card-background-color');
        let darkCardMutedTextColor = sessionStorage.getItem('dark-card-muted-text-color');
        let darkMenuBgColor = sessionStorage.getItem('dark-menu-background-color');
        let darkMenuIconColor = sessionStorage.getItem('dark-menu-icon-color');
        let darkMenuHeaderTextColor = sessionStorage.getItem('dark-menu-header-text-color');
        let darkMenuBrandTextColor = sessionStorage.getItem('dark-menu-brand-text-color');
        let darkContentHeaderTextColor = sessionStorage.getItem('dark-content-header-text-color');
        let darkFormLabelTextColor = sessionStorage.getItem('dark-form-label-text-color');
        let darkAnchorColor = sessionStorage.getItem('dark-anchor-text-color');
        let darkHeaderTagTextColor = sessionStorage.getItem('dark-header-tag-text-color');
        let darkBodyTextColor = sessionStorage.getItem('dark-body-text-color');

        if (darkBgColor) {
            setTimeout(()=>{
            $('body, .dark-layout body').css('cssText', 'background-color: ' + darkBgColor + '!important');
            });
            $("#inputBgColorDark").val(darkBgColor)
        }

        if (darkCardBgColor) {
            $('.card').css('background-color', darkCardBgColor);
            $("#inputCardColorDark").val(darkCardBgColor)
        }

        if (darkCardMutedTextColor) {
            $('.text-muted').css('cssText', 'color: ' + darkCardMutedTextColor + ' !important');
            $("#inputCardMutedTextColorDark").val(darkCardMutedTextColor);
        }

        if (darkMenuBgColor) {
            $('.navbar-dark, .menu-dark, .navigation, nav, .main-menu').css('cssText', 'background-color: ' + darkMenuBgColor + ' !important');
            $("#inputMenuBgColorDark").val(darkMenuBgColor)
        }

        if (darkMenuIconColor) {
            // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('color', darkMenuIconColor);
            $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('cssText', 'color: ' + darkMenuIconColor + ' !important');
            $("#inputMenuIconColorDark").val(darkMenuIconColor)
        }

        if (darkMenuHeaderTextColor) {
            $('.main-menu.menu-dark .navigation .navigation-header').css('color', darkMenuHeaderTextColor);
            $("#inputMenuHeaderTextColorDark").val(darkMenuHeaderTextColor)
        }

        if (darkMenuBrandTextColor) {
            $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', darkMenuBrandTextColor);
            $("#inputMenuBrandTextColorDark").val(darkMenuBrandTextColor)
        }

        if (darkContentHeaderTextColor) {
            $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', darkContentHeaderTextColor);
            $("#inputContentHeaderTextColorDark").val(darkContentHeaderTextColor)
        }

        if (darkFormLabelTextColor) {
            $('.form-label').css('color', darkFormLabelTextColor);
            $("#inputFormLabelTextColorDark").val(darkFormLabelTextColor)
        }

        if (darkAnchorColor) {
            $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', darkAnchorColor);
            $("#inputAnchorTextColorDark").val(darkAnchorColor)
        }

        if (darkHeaderTagTextColor) {
            $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', darkHeaderTagTextColor);
            $("#inputHeaderTagTextColorDark").val(darkHeaderTagTextColor)
        }

        if (darkBodyTextColor) {
            $('body, .text-body').css('cssText', 'color: ' + darkBodyTextColor + ' !important');
            $("#inputBodyTextColorDark").val(darkBodyTextColor)
        }
    }
});
// Handle Day Night Toggler

$('#admin_color_schema_form').ready(function () {
    let themeFormExists = document.getElementById("admin_color_schema_form");
    if (!themeFormExists) {
        let adminThemeConfig = JSON.parse($('#adminThemeConfig').val());
        sessionStorage.setItem('light-background-color', adminThemeConfig.bgColorLight);
        sessionStorage.setItem('dark-background-color', adminThemeConfig.bgColorDark);
        sessionStorage.setItem('light-card-background-color', adminThemeConfig.cardColorLight);
        sessionStorage.setItem('dark-card-background-color', adminThemeConfig.cardColorDark);
        sessionStorage.setItem('light-card-muted-text-color', adminThemeConfig.cardMutedTextColorLight);
        sessionStorage.setItem('dark-card-muted-text-color', adminThemeConfig.cardMutedTextColorDark);
        sessionStorage.setItem('light-menu-background-color', adminThemeConfig.menuBgColorLight);
        sessionStorage.setItem('dark-menu-background-color', adminThemeConfig.menuBgColorDark);
        sessionStorage.setItem('light-menu-icon-color', adminThemeConfig.menuIconColorLight);
        sessionStorage.setItem('dark-menu-icon-color', adminThemeConfig.menuIconColorDark);
        sessionStorage.setItem('light-menu-header-text-color', adminThemeConfig.menuHeaderTextColorLight);
        sessionStorage.setItem('dark-menu-header-text-color', adminThemeConfig.menuHeaderTextColorDark);
        sessionStorage.setItem('light-menu-brand-text-color', adminThemeConfig.menuBrandTextColorLight);
        sessionStorage.setItem('dark-menu-brand-text-color', adminThemeConfig.menuBrandTextColorDark);
        sessionStorage.setItem('light-content-header-text-color', adminThemeConfig.contentHeaderTextColorLight);
        sessionStorage.setItem('dark-content-header-text-color', adminThemeConfig.contentHeaderTextColorDark);
        sessionStorage.setItem('light-form-label-text-color', adminThemeConfig.formLabelTextColorLight);
        sessionStorage.setItem('dark-form-label-text-color', adminThemeConfig.formLabelTextColorDark);
        sessionStorage.setItem('light-anchor-text-color', adminThemeConfig.anchorTextColorLight);
        sessionStorage.setItem('dark-anchor-text-color', adminThemeConfig.anchorTextColorDark);
        sessionStorage.setItem('light-header-tag-text-color', adminThemeConfig.headerTagTextColorLight);
        sessionStorage.setItem('dark-header-tag-text-color', adminThemeConfig.headerTagTextColorDark);
        sessionStorage.setItem('light-body-text-color', adminThemeConfig.bodyTextColorLight);
        sessionStorage.setItem('dark-body-text-color', adminThemeConfig.bodyTextColorDark);

        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            let darkBgColor = sessionStorage.getItem('dark-background-color');
            let darkCardBgColor = sessionStorage.getItem('dark-card-background-color');
            let darkCardMutedTextColor = sessionStorage.getItem('dark-card-muted-text-color');
            let darkMenuBgColor = sessionStorage.getItem('dark-menu-background-color');
            let darkMenuIconColor = sessionStorage.getItem('dark-menu-icon-color');
            let darkMenuHeaderTextColor = sessionStorage.getItem('dark-menu-header-text-color');
            let darkMenuBrandTextColor = sessionStorage.getItem('dark-menu-brand-text-color');
            let darkContentHeaderTextColor = sessionStorage.getItem('dark-content-header-text-color');
            let darkFormLabelTextColor = sessionStorage.getItem('dark-form-label-text-color');
            let darkAnchorColor = sessionStorage.getItem('dark-anchor-text-color');
            let darkHeaderTagTextColor = sessionStorage.getItem('dark-header-tag-text-color');
            let darkBodyTextColor = sessionStorage.getItem('dark-body-text-color');

            if (darkBgColor) {
                setTimeout(()=>{
                $('body, .dark-layout body').css('cssText', 'background-color: ' + darkBgColor + '!important');
                });
                $("#inputBgColorDark").val(darkBgColor)
            }

            if (darkCardBgColor) {
                $('.card').css('background-color', darkCardBgColor);
                $("#inputCardColorDark").val(darkCardBgColor)
            }

            if (darkCardMutedTextColor) {
                $('.text-muted').css('cssText', 'color: ' + darkCardMutedTextColor + ' !important');
                $("#inputCardMutedTextColorDark").val(darkCardMutedTextColor);
            }

            if (darkMenuBgColor) {
                $('.navbar-dark, .menu-dark, .navigation, nav, .main-menu').css('cssText', 'background-color: ' + darkMenuBgColor + ' !important');
                $("#inputMenuBgColorDark").val(darkMenuBgColor)
            }

            if (darkMenuIconColor) {
                // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('color', darkMenuIconColor);
                $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('cssText', 'color: ' + darkMenuIconColor + ' !important');
                $("#inputMenuIconColorDark").val(darkMenuIconColor)
            }

            if (darkMenuHeaderTextColor) {
                $('.main-menu.menu-dark .navigation .navigation-header').css('color', darkMenuHeaderTextColor);
                $("#inputMenuHeaderTextColorDark").val(darkMenuHeaderTextColor)
            }

            if (darkMenuBrandTextColor) {
                $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', darkMenuBrandTextColor);
                $("#inputMenuBrandTextColorDark").val(darkMenuBrandTextColor)
            }

            if (darkContentHeaderTextColor) {
                $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', darkContentHeaderTextColor);
                $("#inputContentHeaderTextColorDark").val(darkContentHeaderTextColor)
            }

            if (darkFormLabelTextColor) {
                $('.form-label').css('color', darkFormLabelTextColor);
                $("#inputFormLabelTextColorDark").val(darkFormLabelTextColor)
            }

            if (darkAnchorColor) {
                $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', darkAnchorColor);
                $("#inputAnchorTextColorDark").val(darkAnchorColor)
            }

            if (darkHeaderTagTextColor) {
                $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', darkHeaderTagTextColor);
                $("#inputHeaderTagTextColorDark").val(darkHeaderTagTextColor)
            }

            if (darkBodyTextColor) {
                $('body, .text-body').css('cssText', 'color: ' + darkBodyTextColor + ' !important');
                $("#inputBodyTextColorDark").val(darkBodyTextColor)
            }
        } else {
            let lightBgColor = sessionStorage.getItem('light-background-color');
            let lightCardBgColor = sessionStorage.getItem('light-card-background-color');
            let lightCardMutedTextColor = sessionStorage.getItem('light-card-muted-text-color');
            let lightMenuBgColor = sessionStorage.getItem('light-menu-background-color');
            let lightMenuIconColor = sessionStorage.getItem('light-menu-icon-color');
            let lightMenuHeaderTextColor = sessionStorage.getItem('light-menu-header-text-color');
            let lightMenuBrandTextColor = sessionStorage.getItem('light-menu-brand-text-color');
            let lightContentHeaderTextColor = sessionStorage.getItem('light-content-header-text-color');
            let lightFormLabelTextColor = sessionStorage.getItem('light-form-label-text-color');
            let lightAnchorColor = sessionStorage.getItem('light-anchor-text-color');
            let lightHeaderTagTextColor = sessionStorage.getItem('light-header-tag-text-color');
            let lightBodyTextColor = sessionStorage.getItem('light-body-text-color');

            if (lightBgColor) {
                setTimeout(()=>{
                $('body').css("cssText",'background-color: ' + lightBgColor + ' !important');
                },15);
                $("#inputBgColorLight").val(lightBgColor)
            }

            if (lightCardBgColor) {
                $('.card').css('background-color', lightCardBgColor);
                $("#inputCardColorLight").val(lightCardBgColor)
            }

            if (lightCardMutedTextColor) {
                $('.text-muted').css('cssText', 'color: ' + lightCardMutedTextColor + ' !important');
                $("#inputCardMutedTextColorLight").val(lightCardMutedTextColor);
            }

            if (lightMenuBgColor) {
                $('.navbar-light, .menu-light, .navigation, nav, .main-menu').css('background-color', lightMenuBgColor);
                $("#inputMenuBgColorLight").val(lightMenuBgColor)
            }

            if (lightMenuIconColor) {
                // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('color', lightMenuIconColor);
                $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('cssText', 'color: ' + lightMenuIconColor + ' !important');
                $("#inputMenuIconColorLight").val(lightMenuIconColor)
            }

            if (lightMenuHeaderTextColor) {
                $('.main-menu.menu-light .navigation .navigation-header').css('color', lightMenuHeaderTextColor);
                $("#inputMenuHeaderTextColorLight").val(lightMenuHeaderTextColor)
            }

            if (lightMenuBrandTextColor) {
                $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', lightMenuBrandTextColor);
                $("#inputMenuBrandTextColorLight").val(lightMenuBrandTextColor)
            }

            if (lightContentHeaderTextColor) {
                $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', lightContentHeaderTextColor);
                $("#inputContentHeaderTextColorLight").val(lightContentHeaderTextColor)
            }

            if (lightFormLabelTextColor) {
                $('.form-label').css('color', lightFormLabelTextColor);
                $("#inputFormLabelTextColorLight").val(lightFormLabelTextColor)
            }

            if (lightAnchorColor) {
                $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', lightAnchorColor);
                $("#inputAnchorTextColorLight").val(lightAnchorColor)
            }

            if (lightHeaderTagTextColor) {
                $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', lightHeaderTagTextColor);
                $("#inputHeaderTagTextColorLight").val(lightHeaderTagTextColor)
            }

            if (lightBodyTextColor) {
                $('body').css('color', lightBodyTextColor);
                $("#inputBodyTextColorLight").val(lightBodyTextColor)
            }
        }
    } 
    // else {
    //     console.log(JSON.parse($('#adminThemeConfig').val()), 'adminThemeConfig')
    // }
    $("#inputBgColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('body').css('cssText','background-color: ' + $(this).val() + ' !important');
        }
        sessionStorage.setItem('light-background-color', $(this).val());
    });
    $("#inputBgColorDark").on('change', function(){ // dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('body, .dark-layout body').css('cssText','background-color: ' + $(this).val() + ' !important');
        }
        sessionStorage.setItem('dark-background-color', $(this).val());
    });

    $("#inputCardColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('.card').css('background-color', $(this).val());
        }
        sessionStorage.setItem('light-card-background-color', $(this).val());
    });
    $("#inputCardColorDark").on('change', function(){ // dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('.card').css('background-color', $(this).val());
        }
        sessionStorage.setItem('dark-card-background-color', $(this).val());
    });

    $("#inputCardMutedTextColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('.text-muted, .text-muted span, .text-muted p, .text-muted label, .text-muted h').css('color', $(this).val());
        }
        sessionStorage.setItem('light-card-muted-text-color', $(this).val());
    });
    $("#inputCardMutedTextColorDark").on('change', function(){ // Dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('.text-muted, .text-muted span, .text-muted p, .text-muted label, .text-muted h').css('color', $(this).val());
        }
        sessionStorage.setItem('dark-card-muted-text-color', $(this).val());
    });

    $("#inputMenuBgColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('.navbar-light, .menu-light, .navigation').css('background-color', $(this).val());
        }
        sessionStorage.setItem('light-menu-background-color', $(this).val());
    });
    $("#inputMenuBgColorDark").on('change', function(){ // dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('.navbar-dark, .menu-dark, .navigation').css('background-color', $(this).val());
        }
        sessionStorage.setItem('dark-menu-background-color', $(this).val());
    });

    $("#inputMenuIconColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('color', $(this).val());
            $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-light .navigation li a').not(".main-menu.menu-light .navigation > li.active > a, .main-menu.menu-light .navigation > li ul .active > a").css('cssText', 'color: ' + $(this).val() + ' !important');
        }
        sessionStorage.setItem('light-menu-icon-color', $(this).val());
    });
    $("#inputMenuIconColorDark").on('change', function(){ // dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            // $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('color', $(this).val());
            $('.header-navbar .navbar-container ul.navbar-nav li i.ficon, .header-navbar .navbar-container ul.navbar-nav li svg.ficon, .main-menu.menu-dark .navigation li a, .dark-layout .main-menu-content .navigation-main .nav-item i, .dark-layout .main-menu-content .navigation-main .nav-item svg').not(".dark-layout .main-menu-content .navigation-main .active .menu-title, .dark-layout .main-menu-content .navigation-main .active i, .dark-layout .main-menu-content .navigation-main .active svg").css('cssText', 'color: ' + $(this).val() + ' !important');
        }
        sessionStorage.setItem('dark-menu-icon-color', $(this).val());
    });

    $("#inputMenuHeaderTextColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('.main-menu.menu-light .navigation .navigation-header').css('color', $(this).val());
        }
        sessionStorage.setItem('light-menu-header-text-color', $(this).val());
    });
    $("#inputMenuHeaderTextColorDark").on('change', function(){ // dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('.main-menu.menu-dark .navigation .navigation-header').css('color', $(this).val());
        }
        sessionStorage.setItem('dark-menu-header-text-color', $(this).val());
    });

    $("#inputMenuBrandTextColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', $(this).val());
        }
        sessionStorage.setItem('light-menu-brand-text-color', $(this).val());
    });
    $("#inputMenuBrandTextColorDark").on('change', function(){ // Dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('.main-menu .navbar-header .navbar-brand .brand-text').css('color', $(this).val());
        }
        sessionStorage.setItem('dark-menu-brand-text-color', $(this).val());
    });

    $("#inputContentHeaderTextColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', $(this).val());
        }
        sessionStorage.setItem('light-content-header-text-color', $(this).val());
    });
    $("#inputContentHeaderTextColorDark").on('change', function(){ // Dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('html .content .content-wrapper .content-header-title, .breadcrumb-item.active').css('color', $(this).val());
        }
        sessionStorage.setItem('dark-content-header-text-color', $(this).val());
    });

    $("#inputFormLabelTextColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('.form-label').css('color', $(this).val());
        }
        sessionStorage.setItem('light-form-label-text-color', $(this).val());
    });
    $("#inputFormLabelTextColorDark").on('change', function(){ // dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('.form-label').css('color', $(this).val());
        }
        sessionStorage.setItem('dark-form-label-text-color', $(this).val());
    });

    $("#inputAnchorTextColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', $(this).val());
        }
        sessionStorage.setItem('light-anchor-text-color', $(this).val());
    });
    $("#inputAnchorTextColorDark").on('change', function(){ // dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('a').not(".main-menu.menu-light .navigation li a, .main-menu.menu-dark .navigation li a").css('color', $(this).val());
        }
        sessionStorage.setItem('dark-anchor-text-color', $(this).val());
    });

    $("#inputHeaderTagTextColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', $(this).val());
        }
        sessionStorage.setItem('light-header-tag-text-color', $(this).val());
    });
    $("#inputHeaderTagTextColorDark").on('change', function(){ // dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('h1, .h1, h2, .h2, h3, .h3, h4, .h4, h5, .h5, h6, .h6').not(".main-menu .navbar-header .navbar-brand .brand-text").css('color', $(this).val());
        }
        sessionStorage.setItem('dark-header-tag-text-color', $(this).val());
    });

    $("#inputBodyTextColorLight").on('change', function(){ // light
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "day") {
            $('body').css('color', $(this).val());
        }
        sessionStorage.setItem('light-body-text-color', $(this).val());
    });
    $("#inputBodyTextColorDark").on('change', function(){ // Dark
        let admin_day_night_toggler = sessionStorage.getItem("admin_day_night_toggler");
        if (admin_day_night_toggler && admin_day_night_toggler == "night") {
            $('body').css('color', $(this).val());
        }
        sessionStorage.setItem('dark-body-text-color', $(this).val());
    });
});