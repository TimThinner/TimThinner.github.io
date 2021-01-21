(function($) {
	
	welcomeReportError = function(error) {
		let markup = '<p style="text-align:center;color:a00;font-weight:bold;">';
		if (typeof error.message !== 'undefined') {
			markup += error.message;
		} else {
			markup += 'Error without message has occurred.';
		}
		markup += '</p>';
		$('#introduction').empty().append(markup);
	}
	
	/*
		Read welcome text from file "tervetuloa.json" and fill in the MARKUP tagged by 
			#welcome-mobile, 
			#welcome-tablet and 
			#welcome-desktop
	*/
	fetch('./json/tervetuloa.json')
		.then(function(response) {
			status = response.status;
			return response.json();
		})
		.then(function(myJson) {
			
			if (Array.isArray(myJson)) {
				// #welcome-mobile: put all paragraphs within one div
				let html = '<div class="col s12">';
				myJson.forEach(a=>{
					html += '<p>'+a+'</p>';
				});
				html += '</div>';
				$(html).appendTo('#welcome-mobile');
				
				// #welcome-tablet: two cols, both with 3 paragraphs.
				const a1 = myJson.slice(0, 3); // 0,1,2
				const a2 = myJson.slice(3);    // 3,4,5,6
				html = '<div class="col s6">';
				a1.forEach(a=>{
					html += '<p>'+a+'</p>';
				});
				html += '</div><div class="col s6" style="border-left:1px solid #aaa">';
				a2.forEach(a=>{
					html += '<p>'+a+'</p>';
				});
				html += '</div>';
				$(html).appendTo('#welcome-tablet');
				
				// #welcome-desktop: three cols, each with 2 paragraphs.
				const b1 = myJson.slice(0, 2); // 0, 1
				const b2 = myJson.slice(2, 4); // 2, 3
				const b3 = myJson.slice(4);    // 4, 5, 6
				html = '<div class="col s4">';
				b1.forEach(a=>{
					html += '<p>'+a+'</p>';
				});
				html += '</div><div class="col s4" style="border-left:1px solid #aaa">';
				b2.forEach(a=>{
					html += '<p>'+a+'</p>';
				});
				html += '</div><div class="col s4" style="border-left:1px solid #aaa">';
				b3.forEach(a=>{
					html += '<p>'+a+'</p>';
				});
				html += '</div>';
				$(html).appendTo('#welcome-desktop');
			}
		})
		.catch(error => {
			console.log (['error=',error]);
			welcomeReportError(error);
		});
	
})(jQuery);
