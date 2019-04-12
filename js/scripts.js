'use strict'
$(document).ready(function () {
    var toggleMobileMenu = function () {
        if ($(window).width() < 768) {
            $('.menu-collapsed').toggleClass("menu-expanded");
        }
    };

    $(".menu-collapsed").on('click', function () {
        toggleMobileMenu();
    });

    //smooth scrolling
    $('a[href*="#"]:not([href="#"])').on('click', function () {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var target = $(this.hash);
            target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
            toggleMobileMenu();
            if (target.length) {
                $('html, body').animate({
                    scrollTop: target.offset().top
                }, 1000);
                return false;
            }
        }
    });

    //animating progress bars
    $('.js-skill-set').waypoint({
        handler: function () {
            $(".progress-bar").each(function () {
                $(this).animate({
                    width: $(this).attr('aria-valuenow') + '%'
                }, 200);
            });
            this.destroy();
        },
        offset: '50%'
    });

    //animating headers
    var hideHeader = function(header) {
        header.css('text-indent', '-9999px');
    };

    var showHeader = function(header) {
        header.css('text-indent', '0px');
    };

    var animateHeader = function(header, text) {
        //clear header text
        header.text("");
        //and animate it
        var nextAnimationStep = function() {
            if (text.length > 0) {
                header.text(header.text() + text.substr(0,1));
                text = text.substr(1);
               setTimeout(nextAnimationStep, 100);
            }
        };
        nextAnimationStep();
    };

    var animateHeaders = function(headers) {
        return Object.keys(headers).map(function(key, index) {
            var elementSelector = key;
            var offset = headers[key];
            var header = $(elementSelector);
            hideHeader(header);
            var waypoint = {};
            waypoint[key] = header.waypoint({
                handler: function() {
                    showHeader(header);
                    animateHeader(header, header.text());
                    this.destroy();
                },
                offset: offset
            })[0];
            return waypoint;
        }).reduce(Object.assign, {});
    };

    var animatedHeaders = animateHeaders({
        "#hello_header": '90%',
        "#resume_header": '70%',
        "#portfolio_header": '70%',
        "#testimonials_header": '70%',
        "#contacts_header": '70%'
    });

    // Refresh waypoints on document size change (portfolo clicks)
    // Dirty hack, but it's not possible to do in a different way
    function onElementHeightChange(elm, callback) {
    var lastHeight = elm.clientHeight, newHeight;
        (function run(){
            newHeight = elm.clientHeight;
            if( lastHeight != newHeight )
                callback();
            lastHeight = newHeight;

            if( elm.onElementHeightChangeTimer )
                clearTimeout(elm.onElementHeightChangeTimer);

            elm.onElementHeightChangeTimer = setTimeout(run, 200);
        })();
    }
    onElementHeightChange(document.body, function() {
        animatedHeaders['#testimonials_header'].context.refresh();
        animatedHeaders['#contacts_header'].context.refresh();
    });

    //filtering for portfolio
    var previousClickedMenuLink = undefined;
    $('.portfolio_menu').on('click', 'a', function(event){
        event.preventDefault();

        if (previousClickedMenuLink) {
            previousClickedMenuLink.removeClass('active');
        }
        var link = $(event.target);
        link.addClass('active');
        previousClickedMenuLink = link;

        var targetTag = $(event.target).data('portfolio-target-tag');
        var portfolioItems = $('.portfolio_items').children();

        if (targetTag === 'all') {
            portfolioItems.fadeIn({duration: 500});
        } else {
            portfolioItems.hide();
        }

        portfolioItems.each(function(index, value){
            var item = $(value);
            if (item.data('portfolio-tag') === targetTag) {
                item.fadeIn({duration: 500});
            }
        });
    });

    //review slider stuff
    var reviewSlides = $('#reviews').children();
    var numOfReviews = reviewSlides.length;
    var currentSlide = 0;

    reviewSlides.hide();
    reviewSlides.eq(currentSlide).fadeIn();

    $('.js-review-btn-left').on('click', function (event){
        event.preventDefault();
        reviewSlides.eq(currentSlide).hide();

        if(currentSlide === 0) {
            currentSlide = numOfReviews - 1;
        } else {
            currentSlide = currentSlide - 1;
        };

        reviewSlides.eq(currentSlide).fadeIn();
    });

    $('.js-review-btn-right').on('click', function (event){
        event.preventDefault();
        reviewSlides.eq(currentSlide).hide();

        if(currentSlide === numOfReviews - 1) {
            currentSlide = 0;
        } else {
            currentSlide = currentSlide + 1;
        };

        reviewSlides.eq(currentSlide).fadeIn();
    });

    // Contact form action
    $('#contact-form').submit(function () {
        var name = $('#name-input').val();
        var email = $('#email-input').val();
        var message = $('#message-input').val();

        var formData = {
            name: name,
            email: email,
            message: message
        };

        $.ajax({
          type: "POST",
          url: '/mail.php',
          data: formData,
          success: function() {
            $('#form-submit-errors').text("Success!");
          },
          error: function() {
            $('#form-submit-errors').text("Something went wrong...");
          }
        });

        return false;
    });
});
