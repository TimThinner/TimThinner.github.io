
(function($) {
	
	
	reportError = function() {
	
	
	}
	
	/*
		"form-link-wrapper"
			"form-link"
		"form-params"
			"form-cancel"
			"form-send"
	*/
	// Toggle show/hide form
	
	//$("#form-params").hide();
	// style="display:none"
	// style="display:block"
	
	$('#form-link').on('click',function() {
		
		
		$("#form-link-wrapper").hide();
		$("#form-params").show();
		
		
		
		
		
		
		
		
		
		
		
		const personcount = 3;
		const days = 7;
		const body = 'henkilöitä%3A'+personcount + '%0D%0Avuorokausia%3A'+days + '%0D%0AJos haluat voit lisätä vielä vapaamuotoisen viestin tähän%3A%0D%0A%0D%0A%0D%0A';
		const mailto = '<a class="waves-effect waves-light btn" href="mailto:arto.kallio-kokko@intelcon.fi?subject=Tahkovaara&body=' + body + '">LÄHETÄ<i class="material-icons right">send</i></a>';
		$('#form-send').empty().append(mailto);
		
		
		
		// LF 	line feed 	%0A
		// CR 	carriage return 	%0D
		
		
	});
	
	$('.datepicker').datepicker();
	/*
	$('#form-send').on('click',function() {
		$("#form-params").hide();
		$("#form-link-wrapper").show();
		
		
		
	});
	*/
	
	$('#form-cancel').on('click',function() {
		$("#form-params").hide();
		$("#form-link-wrapper").show();
	});
	
})(jQuery);
