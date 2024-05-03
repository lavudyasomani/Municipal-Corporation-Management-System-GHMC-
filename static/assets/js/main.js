(function ($) {

	'use strict';

	// Check if element exists
	$.fn.elExists = function () {
		return this.length > 0;
	};

	// Global State Object
	var jqState = {};
	window.jqState = jqState;


	// Variables

	var $html = $('html'),
		$body = $('body'),
		$header = $('.site-header'),
		$headerPosition = ($header.elExists()) ? $header.offset().top : '',
		$mainHeaderHeight = ($header.elExists()) ? $header[0].getBoundingClientRect().height : 0,
		$headerTotalHeight = $headerPosition + $mainHeaderHeight,
		$fixedHeader = $('.header--fixed'),
		$fixedHeaderPosition = ($fixedHeader.elExists()) ? $fixedHeader.offset().top : '',
		$elementCarousel = $('.element-carousel'),
		$instafeed = $('.instafeed-wrapper');

	/*Variables*/
	var $offcanvasNav = $('.offcanvas-menu'),
	$offcanvasNavSubMenu = $offcanvasNav.find('.sub-menu');
	$offcanvasNavSubMenu.parent().prepend('<span class="menu-expand"><i class="pe-7s-angle-down"></i></span>');
	$offcanvasNavSubMenu.slideUp();
	$offcanvasNav.on('click', 'li a, li .menu-expand', function(e) {
	    var $this = $(this);
	    if ( ($this.parent().attr('class').match(/\b(menu-has-submenu)\b/)) && ($this.attr('href') === '#' || $this.hasClass('menu-expand')) ) {
	        e.preventDefault();
	        if ($this.siblings('ul:visible').length){
	            $this.siblings('ul').slideUp('slow');
	        }else {
	            $this.closest('li').siblings('li').find('ul:visible').slideUp('slow');
	            $this.siblings('ul').slideDown('slow');
	        }
	    }
	    if( $this.is('a') || $this.is('span') || $this.attr('clas').match(/\b(menu-expand)\b/) ){
	    	$this.parent().toggleClass('menu-open');
	    }else if( $this.is('li') && $this.attr('class').match(/\b('menu-item-has-children')\b/) ){
	    	$this.toggleClass('menu-open');
	    }
	});


	/**********************
	 * Sticky Header
	 ***********************/

	var $position = $(window).scrollTop();
	if ($position > $headerTotalHeight) {
		$('.header--fixed').addClass('header--unpinned');
	}

	$(window).on('scroll', function () {
		var $scroll = $(window).scrollTop();
		if ($scroll > $position && $position > $headerTotalHeight) {
			$('.header--fixed').addClass('header--unpinned');
			$('.site-header').addClass('is-sticky');
			$('.header--fixed').removeClass('header--pinned');
		} else if ($scroll < $fixedHeaderPosition || $scroll == 0) {
			$('.header--fixed').removeClass('header--unpinned header--pinned');
			$('.site-header').removeClass('is-sticky');
		} else if ($scroll < $position) {
			$('.header--fixed').removeClass('header--unpinned');
			$('.header--fixed').addClass('header--pinned');
		}
		$position = $scroll;
	});

	$('.sticky-header-height').css('height', $headerTotalHeight);
	$('.header--fixed').css('top', 0);



	/**********************
	 * Contact Form
	 ***********************/

	var $form = $('#contact-form');
	var $formMessages = $('.form__output');
	// Set up an event listener for the contact form.
	$form.submit(function (e) {
		// Stop the browser from submitting the form.
		e.preventDefault();

		// Serialize the form data.
		var formData = $(this).serialize();
		// Submit the form using AJAX.
		$.ajax({
				type: 'POST',
				url: $($form).attr('action'),
				data: formData
			})
			.done(function (response) {
				// Make sure that the formMessages div has the 'success' class.
				$formMessages.removeClass('error');
				$formMessages.addClass('success');

				// Set the message text.
				$formMessages.text(response);

				// Clear the form.
				$('#contact-form input,#contact-form textarea').val('');
			})
			.fail(function (data) {
				// Make sure that the formMessages div has the 'error' class.
				$formMessages.removeClass('success');
				$formMessages.addClass('error');

				// Set the message text.
				if (data.responseText !== '') {
					$formMessages.text(data.responseText);
				} else {
					$formMessages.text('Oops! An error occured and your message could not be sent.');
				}
		});
	});



	/**********************
	 *BootStrap Tab
	 ***********************/

	$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
		var target = $(e.target).attr("href");
		var relatedTarget = $(e.relatedTarget).attr("href");
		$(relatedTarget).removeClass('animated');
		$(target).addClass('animated');
	});


	/**********************
	 *Element Carousel
	 ***********************/

	if ($elementCarousel.elExists()) {
		var slickInstances = [];

		/*For RTL*/
		if ($html.attr("dir") == "rtl" || $body.attr("dir") == "rtl") {
			$elementCarousel.attr("dir", "rtl");
		}


		$elementCarousel.each(function (index, element) {
			var $this = $(this);

			// Carousel Options

			var $options = typeof $this.data('slick-options') !== 'undefined' ? $this.data('slick-options') : '';

			var $spaceBetween = $options.spaceBetween ? parseInt($options.spaceBetween, 10) : 0,
				$spaceBetween_xl = $options.spaceBetween_xl ? parseInt($options.spaceBetween_xl, 10) : 0,
				$rowSpace = $options.rowSpace ? parseInt($options.rowSpace, 10) : 0,
				$vertical = $options.vertical ? $options.vertical : false,
				$focusOnSelect = $options.focusOnSelect ? $options.focusOnSelect : false,
				$asNavFor = $options.asNavFor ? $options.asNavFor : '',
				$fade = $options.fade ? $options.fade : false,
				$autoplay = $options.autoplay ? $options.autoplay : false,
				$autoplaySpeed = $options.autoplaySpeed ? parseInt($options.autoplaySpeed, 10) : 5000,
				$swipe = $options.swipe ? $options.swipe : true,
				$swipeToSlide = $options.swipeToSlide ? $options.swipeToSlide : true,
				$touchMove = $options.touchMove ? $options.touchMove : true,
				$verticalSwiping = $options.verticalSwiping ? $options.verticalSwiping : true,
				$draggable = $options.draggable ? $options.draggable : true,
				$arrows = $options.arrows ? $options.arrows : false,
				$dots = $options.dots ? $options.dots : false,
				$adaptiveHeight = $options.adaptiveHeight ? $options.adaptiveHeight : true,
				$infinite = $options.infinite ? $options.infinite : false,
				$variableWidth = $options.variableWidth ? $options.variableWidth : false,
				$centerMode = $options.centerMode ? $options.centerMode : false,
				$centerPadding = $options.centerPadding ? $options.centerPadding : '',
				$speed = $options.speed ? parseInt($options.speed, 10) : 500,
				$appendArrows = $options.appendArrows ? $options.appendArrows : $this,
				$prevArrow = $arrows === true ? ($options.prevArrow ? '<span class="' + $options.prevArrow.buttonClass + '"><i class="' + $options.prevArrow.iconClass + '"></i></span>' : '<button class="tty-slick-text-btn tty-slick-text-prev">previous</span>') : '',
				$nextArrow = $arrows === true ? ($options.nextArrow ? '<span class="' + $options.nextArrow.buttonClass + '"><i class="' + $options.nextArrow.iconClass + '"></i></span>' : '<button class="tty-slick-text-btn tty-slick-text-next">next</span>') : '',
				$rows = $options.rows ? parseInt($options.rows, 10) : 1,
				$rtl = $options.rtl || $html.attr('dir="rtl"') || $body.attr('dir="rtl"') ? true : false,
				$slidesToShow = $options.slidesToShow ? parseInt($options.slidesToShow, 10) : 1,
				$slidesToScroll = $options.slidesToScroll ? parseInt($options.slidesToScroll, 10) : 1;

			/*Responsive Variable, Array & Loops*/
			var $responsiveSetting = typeof $this.data('slick-responsive') !== 'undefined' ? $this.data('slick-responsive') : '',
				$responsiveSettingLength = $responsiveSetting.length,
				$responsiveArray = [];
			for (var i = 0; i < $responsiveSettingLength; i++) {
				$responsiveArray[i] = $responsiveSetting[i];
			}

			// Adding Class to instances
			$this.addClass('slick-carousel-' + index);
			$this.parent().find('.slick-dots').addClass('dots-' + index);
			$this.parent().find('.slick-btn').addClass('btn-' + index);

			if ($spaceBetween != 0) {
				$this.addClass('slick-gutter-' + $spaceBetween);
			}
			if ($spaceBetween_xl != 0) {
				$this.addClass('slick-gutter-xl-' + $spaceBetween_xl);
			}
			var $slideCount = null;
			$this.on('init', function (event, slick) {
				$this.find('.slick-active').first().addClass('first-active');
				$this.find('.slick-active').last().addClass('last-active');
				$slideCount = slick.slideCount;
				if ($slideCount <= $slidesToShow) {
					$this.children('.slick-dots').hide();
				}
				var $firstAnimatingElements = $('.slick-slide').find('[data-animation]');
				doAnimations($firstAnimatingElements);
			});

			$this.slick({
				slidesToShow: $slidesToShow,
				slidesToScroll: $slidesToScroll,
				asNavFor: $asNavFor,
				autoplay: $autoplay,
				autoplaySpeed: $autoplaySpeed,
				speed: $speed,
				infinite: $infinite,
				arrows: $arrows,
				dots: $dots,
				adaptiveHeight: $adaptiveHeight,
				vertical: $vertical,
				focusOnSelect: $focusOnSelect,
				centerMode: $centerMode,
				centerPadding: $centerPadding,
				swipe: $swipe,
				swipeToSlide: $swipeToSlide,
				touchMove: $touchMove,
				draggable: $draggable,
				verticalSwiping: $verticalSwiping,
				variableWidth: $variableWidth,
				fade: $fade,
				appendArrows: $appendArrows,
				prevArrow: $prevArrow,
				nextArrow: $nextArrow,
				rtl: $rtl,
				responsive: $responsiveArray
			});



			$this.on('beforeChange', function (e, slick, currentSlide, nextSlide) {
				$this.find('.slick-active').first().removeClass('first-active');
				$this.find('.slick-active').last().removeClass('last-active');
				var $animatingElements = $('.slick-slide[data-slick-index="' + nextSlide + '"]').find('[data-animation]');
				doAnimations($animatingElements);
			});

			function doAnimations(elements) {
				var animationEndEvents = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
				elements.each(function () {
					var $el = $(this);
					var $animationDelay = $el.data('delay');
					var $animationDuration = $el.data('duration');
					var $animationType = 'animated ' + $el.data('animation');
					$el.css({
						'animation-delay': $animationDelay,
						'animation-duration': $animationDuration,
					});
					$el.addClass($animationType).one(animationEndEvents, function () {
						$el.removeClass($animationType);
					});
				});
			}

			$this.on('afterChange', function (e, slick) {
				$this.find('.slick-active').first().addClass('first-active');
				$this.find('.slick-active').last().addClass('last-active');
			});

			// Updating the sliders in tab
			$('body').on('shown.bs.tab', 'a[data-toggle="tab"], a[data-toggle="pill"]', function (e) {
				$this.slick('setPosition');
			});
		});
	}



	/**********************
	 *WOW Js activation 
	 ***********************/

	new WOW().init();

	/**********************
	 *Counter activation 
	 ***********************/

	$('.counter').counterUp({
		delay: 10,
		time: 2000
	});


	/*=====================================
	Instagram Feed JS
	======================================*/

	if($instafeed.elExists()){
		$instafeed.each(function(){
			var $this = $(this);
			var $settings = $this.data('insta-config');
			var activeId = $this.attr('id');
			if(activeId.length){
			   	var template = $settings.template ? $settings.template : '',
			    accesstoken = $settings.accesstoken ? $settings.accesstoken : '',
			    limit = $settings.limit ? +$settings.limit : '';
 
				var userFeed = new Instafeed({
					accessToken: accesstoken,
					template: template,
					limit: limit
				});
				userFeed.run();
			}
		});		
	}

	/**********************
	 *Magnific Popup Activation
	 ***********************/

	var imagePopup = $('.popup-btn');

	imagePopup.magnificPopup({
		type: 'image',
		gallery: {
			enabled: true
		}
	});


	/**********************
	 *Tooltip
	 ***********************/

	var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
	tooltipTriggerList.map(function (tooltipTriggerEl) {
		return new bootstrap.Tooltip(tooltipTriggerEl)
	})


	/*================================
	    Accordion 
	==================================*/

	$('.accordion-button').on('click', function (e) {
		e.preventDefault();
		var $this = $(this);
		$this.closest('.accordion-item').toggleClass('acc-open');
		$this.closest('.accordion-item').siblings().removeClass('acc-open');
	});


	/*================================
	    Newsletter Form JS
	==================================*/
	var subscribeUrl = $(".mc-form").attr('action');

	$('.mc-form').ajaxChimp({
		language: 'en',
		url: subscribeUrl,
		callback: mailChimpResponse
	});

	function mailChimpResponse(resp) {
		if (resp.result === 'success') {
			$('.mailchimp-success').html('' + resp.msg).fadeIn(900);
			$('.mailchimp-error').fadeOut(400);
			$(".mc-form").trigger('reset');
		} else if (resp.result === 'error') {
			$('.mailchimp-error').html('' + resp.msg).fadeIn(900);
		}
	}

	/*================================
	    Isotope Filter
	==================================*/


	jqState.isotopeFilter = function () {
		var $filter = $('.filter-wrapper');
		var $boxes = $('.filter-item');

		$('.filter-btns button').on('click', function () {

			var filterValue = $(this).attr('data-filter');
			$filter.isotope({
				filter: filterValue
			});

			$('.filter-btns button').removeClass('is-checked');
			$(this).addClass('is-checked');
		});
	}

	// Global Masonry Settings

	var get_isotope_column_number = function (w_w, item_w) {
		w_w = (w_w > 1824) ? 1824 : w_w;
		return Math.round(w_w / item_w);
	};

	var getWidth = function ($itemwidth, thiswidth, $margin, $wrapperwidth, $minimumWidth, $portfolionumber) {
		var $finalWidth = Math.floor(($itemwidth * thiswidth) - ($margin / 2));
		var $remainWidth = ($wrapperwidth - ($minimumWidth * $portfolionumber));
		var $remainWidthRound = Math.round(($wrapperwidth - ($minimumWidth * $portfolionumber)));
		if ($itemwidth > $remainWidth && $remainWidthRound > 1) {
			$finalWidth = $finalWidth + ($remainWidth / $portfolionumber);
		}
		return Math.floor($finalWidth);
	}


	jqState.Masonry = function () {
		$('.filter-wrapper').each(function () {
			var $this = $(this);
			var $settings = typeof $this.data('masonry-settings') !== 'undefined' ? $this.data('masonry-settings') : '',
				$item_selector = $settings.itemSelector ? $settings.itemSelector : '',
				$type = $settings.type ? $settings.type : '',
				$columnWidth = $settings.columnWidth ? $settings.columnWidth : 1,
				$base_width = $settings.itemWidth ? $settings.itemWidth : '',
				$base_height = $settings.itemHeight ? $settings.itemHeight : '',
				$margin = $settings.itemMargin ? $settings.itemMargin : 0;

			if ($margin != 0) {
				$this.addClass('space-' + $margin);
				$($item_selector).addClass('p-' + $margin);
			}

			var $wrapperwidth = $this.width();
			var $portfolionumber;


			if ($type == 'default') {
				$portfolionumber = $settings.column.defaultCol;
			} else {
				$portfolionumber = get_isotope_column_number($wrapperwidth, $base_width);
			}

			if (jqState.window_width < 1200) {
				$portfolionumber = $settings.column.lgCol ? $settings.column.lgCol : $portfolionumber;
			}
			if (jqState.window_width < 992) {
				$portfolionumber = $settings.column.mdCol ? $settings.column.mdCol : $portfolionumber;
			}
			if (jqState.window_width < 768) {
				$portfolionumber = $settings.column.smCol ? $settings.column.smCol : $portfolionumber;
			}
			if (jqState.window_width < 576) {
				$portfolionumber = $settings.column.xsCol ? $settings.column.xsCol : 1;
			}

			var $itemwidth, dimension, $calcWidthArr = [],
				$minimumWidth, $finalWidth;

			if ($type == 'default') {
				$itemwidth = 100 / $portfolionumber;
			} else {
				$itemwidth = Math.floor($wrapperwidth / $portfolionumber),
					dimension = parseFloat($base_width / $base_height);
			}


			var i = 0;
			var $selector_length = $($item_selector).length;

			$($item_selector).each(function () {
				i += 1;
				var thiswidth = parseFloat($(this).data('width') || 1),
					thisheight = parseFloat($(this).data('height') || 1);

				if (isNaN(thiswidth)) thiswidth = 1;
				if (isNaN(thisheight)) thisheight = 1;

				if (jqState.window_width < 1200) {
					thiswidth = thisheight = 1;
				}
				var $calcWidth = Math.floor(($itemwidth * thiswidth) - ($margin / 2));
				$calcWidthArr.push($calcWidth);
				if (i == $selector_length) {
					$minimumWidth = Math.min.apply(Math, $calcWidthArr);
				}
			});

			$($item_selector, $this).each(function (idx) {
				var thiswidth = parseFloat($(this).data('width') || 1),
					thisheight = parseFloat($(this).data('height') || 1),
					_css = {};

				if (isNaN(thiswidth)) thiswidth = 1;
				if (isNaN(thisheight)) thisheight = 1;

				if (jqState.window_width < 1200) {
					thiswidth = thisheight = 1;
				}
				if ($type == 'default') {
					_css.width = $itemwidth + '%';
					_css.height = 'auto';
				} else {
					$finalWidth = getWidth($itemwidth, thiswidth, $margin, $wrapperwidth, $minimumWidth, $portfolionumber);
					_css.width = $finalWidth;
					_css.height = Math.floor(($itemwidth / dimension) * thisheight);
				}

				if (jqState.window_width < 1200) {
					_css.height = 'auto';
				}

				$(this).css(_css);
			});


			if ($type == 'default') {
				$this.imagesLoaded({
					background: true
				}, function () {
					$this.isotope({
						itemSelector: '.filter-item'
					});
				});
			} else {
				if (jqState.window_width < 1200) {
					$this.removeClass('cover-img-bg');
				} else {
					$this.addClass('cover-img-bg');
				}
				$this.imagesLoaded(function () {
					$this.isotope({
						itemSelector: '.filter-item',
						masonry: {
							columnWidth: 1
						}
					});
				});
			}

		});
	};



	jqState.imageBgSettings = function () {
		$(".cover-img").each(function () {
			var $this = $(this);
			var img = $this.find("img").attr("src");
			$this.css({
				backgroundImage: "url(" + img + ")"
			});
		});
	};


	/**********************
	 *Preloader 
	 ***********************/

	$(window).on('load', function () {
		$('.pisces-preloader').removeClass("active");
	});




	/**********************
	 *Initialization 
	 ***********************/

	jqState.window_width = $(window).width();

	$(window).on('load', function () {
		jqState.isotopeFilter();
		jqState.Masonry();
	});

	$(window).on('resize', function () {
		jqState.window_width = $(window).width()
		jqState.Masonry();
	});
})(jQuery);



(function () {

	const state = {};

	state.DOM = {
		body: document.querySelector('body'),
		overlay: document.querySelector('.global-overlay'),
		wrapper: document.querySelectorAll('.wrapper *'),
		header: document.querySelector('.site-header'),
		fixedHeader: document.querySelector('.header--fixed'),
		menuLinks: document.querySelectorAll('.main-navigation a'),
		homeLink: document.querySelector('.main-navigation a[href="index.html"]'),
		offcanvasNav: document.querySelector('.offcanvas-menu'),
		offcanvasNavSubMenu: document.querySelectorAll('.offcanvas-menu .sub-menu'),
		sliderHeight: document.querySelectorAll('.slider-height'),
		bgImage: document.querySelectorAll('.bg-image'),
		bgColor: document.querySelectorAll('.bg-color'),
		toolbarBtn: document.querySelectorAll('.toolbar-btn'),
		closeBtn: document.querySelectorAll('.btn-close'),
		scrollTopBtn: document.querySelector('.scroll-to-top'),
		funfactCounter: document.querySelectorAll('.funfact__counter')
	};

	state.windowSize = {
		width: window.innerWidth,
		height: window.innerHeight
	};

	state.vars = {
		headerPosition: state.DOM.header !== null ? state.DOM.header.offsetTop : '',
		mainHeaderHeight: state.DOM.header !== null ? state.DOM.header.clientHeight : '',
		pageUrl: window.location.href.substr(window.location.href.lastIndexOf("/") + 1),
		headerTotalHeight: function () {
			return this.headerPosition + this.mainHeaderHeight;
		},
		setSliderHeight: function () {
			return state.windowSize.height - this.headerTotalHeight();
		}
	};

	state.setActiveClassInMenu = function () {
		this.DOM.menuLinks.forEach(menuLink => {
			let pageUrl = this.vars.pageUrl;
			let href = menuLink.getAttribute('href');

			if (pageUrl === href || href === '') {
				const parent = getClosest(menuLink, '.mainmenu__item');
				menuLink.parentElement.classList.add('active');
				parent.classList.add('active');
			} else if (window.location.pathname === '/' || window.location.pathname === '/index.html') {
				this.DOM.homeLink.parentElement.classList.add('active');
			}
		});
	};

	state.setSliderHeight = function () {
		Array.from(this.DOM.sliderHeight, el => el.style.height = `${this.vars.setSliderHeight()}px`);
	};

	state.renderBgImage = function () {
		Array.from(this.DOM.bgImage, el => {
			const imageSrc = el.dataset.bgimage;
			el.style.backgroundImage = `url(${imageSrc})`;
		});
	};

	state.renderBgColor = function () {
		Array.from(this.DOM.bgColor, el => {
			const color = el.dataset.bgcolor;
			el.style.backgroundColor = color;
		});
	};

	state.toolbarBtnClick = function (event, el) {
		event.preventDefault();
		event.stopPropagation();
		if (el.nodeName === 'A' || el.childNodes[1].nodeName === 'I') {
			const parentClassName = el.parentNode.className;
			const parent = document.querySelector(`.${parentClassName.split(' ')[1]}`);
			const siblings = getSiblings(parent);
			const link = el.getAttribute('href');
			var relatedLink;
			Array.from(siblings, sibling => {
				relatedLink = sibling.children[0].getAttribute('href');
			});
			document.querySelector(relatedLink).classList.remove('open');
			document.querySelector(link).classList.add('open');
			state.DOM.overlay.classList.add('overlay-open');
		}
	};

	state.clickOnDOM = function (e) {
		const target = e.target;
		const toolbar = getClosest(target, '.toolbar-btn');
		const dom = this.DOM.wrapper;
		const parent = getClosest(e.target, '.open');
		if (toolbar === null && parent === null) {
			Array.from(dom, el => {
				el.classList.remove('open');
			});
			state.DOM.overlay.classList.remove('overlay-open');
		}
	};

	state.closeEl = function (e) {
		e.preventDefault();
		const parent = getClosest(e.target, '.open');
		state.DOM.overlay.classList.remove('overlay-open');
		parent.classList.remove('open');
	};

	state.scrollBtnReveal = function () {
		if (window.scrollY > 300) {
			state.DOM.scrollTopBtn.classList.add('is-visible');
		} else {
			state.DOM.scrollTopBtn.classList.remove('is-visible');
		}
	};

	state.scrollTo = function () {
		if (window.scrollY != 0) {
			setTimeout(function () {
				window.scrollTo(0, window.scrollY - 30);
				state.scrollTo();
			}, 150);
		}
	};

	var getSiblings = function (elem) {
		var siblings = [];
		var sibling = elem.parentNode.firstChild;
		while (sibling) {
			if (sibling.nodeType === 1 && sibling !== elem) {
				siblings.push(sibling);
			}
			sibling = sibling.nextSibling;
		}
		return siblings;
	};

	var getClosest = function (elem, selector) {

		// Element.matches() polyfill
		if (!Element.prototype.matches) {
			Element.prototype.matches =
				Element.prototype.matchesSelector ||
				Element.prototype.mozMatchesSelector ||
				Element.prototype.msMatchesSelector ||
				Element.prototype.oMatchesSelector ||
				Element.prototype.webkitMatchesSelector ||
				function (s) {
					var matches = (this.document || this.ownerDocument).querySelectorAll(s),
						i = matches.length;
					while (--i >= 0 && matches.item(i) !== this) {}
					return i > -1;
				};
		}

		for (; elem && elem !== document; elem = elem.parentNode) {
			if (elem.matches(selector)) return elem;
		}
		return null;
	};

	// Initialization

	state.setActiveClassInMenu();
	state.setSliderHeight();
	state.renderBgImage();
	state.renderBgColor();
	window.addEventListener('scroll', state.scrollBtnReveal);
	state.DOM.scrollTopBtn.addEventListener('click', (e) => {
		e.preventDefault();
		state.scrollTo(e);
	});
	Array.from(state.DOM.toolbarBtn, el => {
		el.addEventListener('click', event => state.toolbarBtnClick(event, el));
	});
	state.DOM.body.addEventListener('click', e => state.clickOnDOM(e));
	Array.from(state.DOM.closeBtn, el => {
		el.addEventListener('click', e => state.closeEl(e));
	});
})();


