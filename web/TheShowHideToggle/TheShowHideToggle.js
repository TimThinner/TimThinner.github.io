(function($) {
	// Is this browser sufficiently modern to continue?
	if (!("querySelector" in document && "addEventListener" in window && "getComputedStyle" in window)) {
		console.log('Sorry, NO JavaScript available!');
		return;
	} 
	console.log('OH YES, we have JavaScript and we can continue with enhanced style!');
	window.document.documentElement.className += " enhanced";
	
	var nav = document.querySelector('.nav ul'),
		navToggle = document.querySelector('.nav .skip');
	if (navToggle) {
		
		$('a.skip > p').empty().append('&#x2630;');
		
		navToggle.addEventListener('click',
		function(e){
			// do NOT forget we have also "menu-navigation" in .nav ul classes
			// <ul id="menu" class="menu-navigation">
			//console.log(nav.className);
			if (nav.className.indexOf('open') !== -1) { // Found
				nav.className = 'menu-navigation';
				$('a.skip > p').empty().append('&#x2630;');
				
			} else {
				nav.className = 'menu-navigation open';
				$('a.skip > p').empty().append('X');
			}
			e.preventDefault();
		},false);
	}
	
	var vpw = $(window).width();
	//var vph = $(window).height();
	$("#vpw").empty().append(vpw);
	//$("#vph").empty().append(vph);
	
	$(window).on('resize', function() {
		vpw = $(window).width();
		//vph = $(window).height();
		$("#vpw").empty().append(vpw);
		//$("#vph").empty().append(vph);
	});
	
	
})(jQuery);