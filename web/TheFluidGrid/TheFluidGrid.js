(function($) {
	var vpw = $(window).width();
	$("#vpw").empty().append(vpw);
	$(window).on('resize', function() {
		vpw = $(window).width();
		$("#vpw").empty().append(vpw);
	});
})(jQuery);
