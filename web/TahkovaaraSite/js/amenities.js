(function($) {
	
	amenitiesReportError = function(error) {
		let markup = '<p style="text-align:center;color:a00;font-weight:bold;">';
		if (typeof error.message !== 'undefined') {
			markup += error.message;
		} else {
			markup += 'Error without message has occurred.';
		}
		markup += '</p>';
		$('#amenities').empty().append(markup);
	}
	
	/*
		Read amenities from file "varustus.json" and fill in the MARKUP tagged by 
			#amenities-mobile, 
			#amenities-tablet and 
			#amenities-desktop
	*/
	fetch('./json/varustus.json')
		.then(function(response) {
			status = response.status;
			return response.json();
		})
		.then(function(myJson) {
			//console.log(['amenities myJson=',myJson]);
			if (Array.isArray(myJson)) {
				// #amenities-mobile: put all entries within one ul-list.
				let html = '<div class="col s12"><ul>';
				myJson.forEach(a=>{
					html += '<li>'+a+'</li>';
				});
				html += '</ul></div>';
				$(html).appendTo('#amenities-mobile');
				
				// #amenities-tablet: two ul-lists, first with 19 items and second with 14.
				const a1 = myJson.slice(0, 19); // 0 - 18
				const a2 = myJson.slice(19);    // 19 - 32
				html = '<div class="col s4"><ul>';
				a1.forEach(a=>{
					html += '<li>'+a+'</li>';
				});
				html += '</ul></div><div class="col s8"><ul>';
				a2.forEach(a=>{
					html += '<li>'+a+'</li>';
				});
				html += '</ul></div>';
				$(html).appendTo('#amenities-tablet');
				
				// #amenities-desktop: three ul-lists, first with 15 items, second with 12 items and last with 6 items.
				const b1 = myJson.slice(0, 15);  // 0 - 14
				const b2 = myJson.slice(15, 27); // 15 - 26
				const b3 = myJson.slice(27);     // 27 -
				html = '<div class="col s4"><ul>';
				b1.forEach(a=>{
					html += '<li>'+a+'</li>';
				});
				html += '</ul></div><div class="col s4"><ul>';
				b2.forEach(a=>{
					html += '<li>'+a+'</li>';
				});
				html += '</ul></div><div class="col s4"><ul>';
				b3.forEach(a=>{
					html += '<li>'+a+'</li>';
				});
				html += '</ul></div>';
				$(html).appendTo('#amenities-desktop');
			}
		})
		.catch(error => {
			console.log (['error=',error]);
			amenitiesReportError(error);
		});
	
})(jQuery);
