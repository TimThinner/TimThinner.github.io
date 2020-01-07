(function($) {
	
	scrollHandler = function() {
		const mybutton = document.getElementById("my-to-top-button");
		if (document.body.scrollTop > 60 || document.documentElement.scrollTop > 60) {
			mybutton.style.display = "block";
		} else {
			mybutton.style.display = "none";
		}
	}
	
	// When the user scrolls down 60px from the top of the document, show the button
	$(window).on("scroll", scrollHandler);
	
	/*
	$(window).on('resize', function() {
		vpw = $(window).width();
		console.log(['vpw=',vpw]);
	});
	*/
	
	/*
		SEE: Smooth Scrolling
		https://css-tricks.com/snippets/jquery/smooth-scrolling/
	*/
	$('a[href*="#"]:not([href="#"])').click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var target = $(this.hash);
			target = target.length ? target : $('[name=' + this.hash.slice(1) +']');
			if (target.length) {
				$('html, body').animate({
					scrollTop: target.offset().top
				}, 500);
				// leave the page-anchor (#nnn) to the location url, return false would not show it.
				return false;
			}
		}
	});
	
})(jQuery);
