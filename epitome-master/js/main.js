/* ===================================================================
 * Epitome - Main JS
 *
 * ------------------------------------------------------------------- */

(function($) {

    "use strict";
    
    var cfg = {
        scrollDuration : 800, // smoothscroll duration
        mailChimpURL   : ''   // mailchimp url
    },

    $WIN = $(window);

    // Add the User Agent to the <html>
    // will be used for IE10/IE11 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; rv:11.0))
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);


   /* Preloader
    * -------------------------------------------------- */
    var ssPreloader = function() {
        
        $("html").addClass('ss-preload');

        var hideLoader = function() {
            //force page scroll position to top at page refresh
            $('html, body').animate({ scrollTop: 0 }, 'normal');

            // will first fade out the loading animation 
            $("#loader").fadeOut("slow", function() {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            }); 
            
            // for hero content animations 
            $("html").removeClass('ss-preload');
            $("html").addClass('ss-loaded');
        };

        if (document.readyState === 'complete') {
            hideLoader();
        } else {
            $WIN.on('load', hideLoader);
            setTimeout(hideLoader, 2000); // Safety fallback
        }
    };


   /* Menu on Scrolldown
    * ------------------------------------------------------ */
    var ssMenuOnScrolldown = function() {
        
        var hdr = $('.s-header'),
            hdrTop = $('.s-header').offset().top;

        $WIN.on('scroll', function() {

            if ($WIN.scrollTop() > hdrTop) {
                hdr.addClass('sticky');
            }
            else {
                hdr.removeClass('sticky');
            }

        });
    };


   /* Mobile Menu
    * ---------------------------------------------------- */ 
    var ssMobileMenu = function() {

        var toggleButton = $('.header-menu-toggle'),
            nav = $('.header-nav-wrap');

        toggleButton.on('click', function(event){
            event.preventDefault();

            toggleButton.toggleClass('is-clicked');
            nav.slideToggle();
        });

        if (toggleButton.is(':visible')) nav.addClass('mobile');

        $WIN.on('resize', function() {
            if (toggleButton.is(':visible')) nav.addClass('mobile');
            else nav.removeClass('mobile');
        });

        nav.find('a').on("click", function() {

            if (nav.hasClass('mobile')) {
                toggleButton.toggleClass('is-clicked');
                nav.slideToggle(); 
            }
        });

    };

   /* Highlight the current section in the navigation bar
    * ------------------------------------------------------ */
    var ssWaypoints = function() {

        var sections = $(".target-section"),
            navigation_links = $(".header-main-nav li a");

        var setActiveNav = function(sectionId) {
            if (!sectionId) return;
            var active_link = $('.header-main-nav li a[href="#' + sectionId + '"]');
            if (active_link.length && !active_link.parent().hasClass('current')) {
                navigation_links.parent().removeClass("current");
                active_link.parent().addClass("current");
            }
        };

        var updateActiveSection = function() {
            var scrollPos = $WIN.scrollTop();
            var winHeight = $WIN.height();
            var docHeight = $(document).height();

            // When scrolled at or near the bottom of page, always highlight the last section (#contact)
            if (scrollPos + winHeight >= docHeight - 100) {
                var lastSectionId = sections.last().attr("id");
                setActiveNav(lastSectionId);
                return;
            }

            // When at the very top, activate first section (#intro)
            if (scrollPos <= 80) {
                var firstSectionId = sections.first().attr("id");
                setActiveNav(firstSectionId);
                return;
            }

            // Determine which section currently occupies the viewport
            var currentSectionId = null;
            sections.each(function() {
                var $sec = $(this);
                var top = $sec.offset().top - (winHeight * 0.35);
                var bottom = top + $sec.outerHeight();

                if (scrollPos >= top && scrollPos < bottom) {
                    currentSectionId = $sec.attr("id");
                }
            });

            if (currentSectionId) {
                setActiveNav(currentSectionId);
            }
        };

        var isTicking = false;
        $WIN.on('scroll.navHighlight resize.navHighlight', function() {
            if (!isTicking) {
                window.requestAnimationFrame(function() {
                    updateActiveSection();
                    isTicking = false;
                });
                isTicking = true;
            }
        });

        updateActiveSection();

    };


   /* Masonry
    * ---------------------------------------------------- */ 
    var ssMasonryFolio = function () {
        
        var containerBricks = $('.masonry');

        containerBricks.imagesLoaded(function () {
            containerBricks.masonry({
                itemSelector: '.masonry__brick',
                resize: true
            });
        });

    };


   /* photoswipe
    * ----------------------------------------------------- */
    var ssPhotoswipe = function() {
        var items = [],
            $pswp = $('.pswp')[0],
            $folioItems = $('.item-folio');

        // get items
        $folioItems.each( function(i) {

            var $folio = $(this),
                $thumbLink =  $folio.find('.thumb-link'),
                $title = $folio.find('.item-folio__title'),
                $caption = $folio.find('.item-folio__caption'),
                $titleText = '<h4>' + $.trim($title.html()) + '</h4>',
                $captionText = $.trim($caption.html()),
                $href = $thumbLink.attr('href'),
                $size = $thumbLink.data('size').split('x'),
                $width  = $size[0],
                $height = $size[1];
        
            var item = {
                src  : $href,
                w    : $width,
                h    : $height
            }

            if ($caption.length > 0) {
                item.title = $.trim($titleText + $captionText);
            }

            items.push(item);
        });

        // bind click event
        $folioItems.each(function(i) {

            $(this).find('.thumb-link').on('click', function(e) {
                e.preventDefault();
                var options = {
                    index: i,
                    showHideOpacity: true
                }

                // initialize PhotoSwipe
                var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
                lightBox.init();
            });

        });
    };


   /* slick slider
    * ------------------------------------------------------ */
    var ssSlickSlider = function() {
        
        $('.testimonials__slider').slick({
            arrows: false,
            dots: true,
            infinite: true,
            slidesToShow: 1,
            slidesToScroll: 1,
            pauseOnFocus: false,
            autoplaySpeed: 1500,
            fade: true,
            cssEase: 'linear'
        });
    };


   /* Smooth Scrolling
    * ------------------------------------------------------ */
    var ssSmoothScroll = function() {
        
        $('.smoothscroll').on('click', function (e) {
            var target = this.hash,
            $target    = $(target);
            
            if (!$target.length) return;

            e.preventDefault();
            e.stopPropagation();

            // Immediately highlight clicked link in nav
            if ($(this).closest('.header-main-nav').length) {
                $('.header-main-nav li').removeClass('current');
                $(this).parent().addClass('current');
            }

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing').promise().done(function () {

                // check if menu is open
                if ($('body').hasClass('menu-is-open')) {
                    $('.header-menu-toggle').trigger('click');
                }

                window.location.hash = target;
            });
        });

    };


   /* Alert Boxes
    * ------------------------------------------------------ */
    var ssAlertBoxes = function() {

        $('.alert-box').on('click', '.alert-box__close', function() {
            $(this).parent().fadeOut(500);
        }); 

    };


   /* Animate On Scroll
    * ------------------------------------------------------ */
    var ssAOS = function() {
        
        AOS.init( {
            offset: 200,
            duration: 600,
            easing: 'ease-in-sine',
            delay: 300,
            once: true,
            disable: 'mobile'
        });

    };


   /* Initialize
    * ------------------------------------------------------ */
    (function clInit() {

        ssPreloader();
        ssMenuOnScrolldown();
        ssMobileMenu();
        ssWaypoints();
        ssMasonryFolio();
        ssPhotoswipe();
        ssSlickSlider();
        ssSmoothScroll();
        ssAlertBoxes();
        ssAOS();

    })();

})(jQuery);

/* ===================================================================
 * Starfield Canvas Animation
 * ------------------------------------------------------------------- */
(function() {
    const canvas = document.getElementById('starfield');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let width, height;
    let stars = [];
    const numStars = 800; // Dense stars

    let mouse = { x: -1000, y: -1000 };
    const repelRadius = 150;

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < numStars; i++) {
            const alpha = Math.random() * 0.35 + 0.10; // Soft brightness
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.16, // Slightly increased drift speed
                vy: (Math.random() - 0.5) * 0.16,
                radius: Math.random() * 1.2 + 0.6, // Slightly bigger stars
                alpha: alpha,
                baseColor: `rgba(255, 255, 255, ${alpha.toFixed(2)})`,
                color: ''
            });
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < numStars; i++) {
            let star = stars[i];

            // Gentle random wandering
            star.vx += (Math.random() - 0.5) * 0.005;
            star.vy += (Math.random() - 0.5) * 0.005;
            
            // Limit maximum speed
            const maxSpeed = 0.16;
            if (star.vx > maxSpeed) star.vx = maxSpeed;
            if (star.vx < -maxSpeed) star.vx = -maxSpeed;
            if (star.vy > maxSpeed) star.vy = maxSpeed;
            if (star.vy < -maxSpeed) star.vy = -maxSpeed;

            // Update position
            star.x += star.vx;
            star.y += star.vy;

            // Bounce off edges (left to right, right to left)
            if (star.x < 0) {
                star.x = 0;
                star.vx *= -1;
            }
            if (star.x > width) {
                star.x = width;
                star.vx *= -1;
            }
            // Still wrap vertically to keep the flow
            if (star.y < 0) star.y = height;
            if (star.y > height) star.y = 0;

            // Mouse interaction
            let dx = mouse.x - star.x;
            let dy = mouse.y - star.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            star.color = star.baseColor;

            if (distance < repelRadius) {
                // Soft pink glow near cursor
                star.color = `rgba(207, 23, 103, ${Math.min(star.alpha + 0.25, 0.65)})`;
                
                // Repel gently
                let force = (repelRadius - distance) / repelRadius;
                star.x -= (dx / distance) * force * 2.0;
                star.y -= (dy / distance) * force * 2.0;
            }

            // Draw star
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = star.color;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = -1000;
        mouse.y = -1000;
    });

    resize();
    animate();
})();