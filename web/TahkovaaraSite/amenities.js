(function($) {
	
	amenitiesReportError = function() {
		/*
		let markup = '<p style="text-align:center;color:a00;font-weight:bold;">';
		markup += 'NOTE: You must have APIKEY for Google Maps to work.<br/>';
		markup += 'You must create a config.json file, where you define your APIKEY:<br/><br/>';
		markup += '{"APIKEY":"Your API KEY here"}<br/><br/>';
		markup += 'and copy the file into your HTML root.<br/>';
		markup += 'Then refresh the page and Google Maps should be visible.</p>';
		$('#map').empty().append(markup);
		*/
	}
	
	/*
		Read amenities from file "amenities.json" and fill in the MARKUP tagged by 
			#amenities-mobile, 
			#amenities-tablet and 
			#amenities-desktop
	*/
	fetch('varustus.json')
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
				
				// #amenities-tablet: two ul-lists, first with 17 items and second with 15.
				const a1 = myJson.slice(0, 17);
				const a2 = myJson.slice(17);
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
				
				// #amenities-desktop: three ul-lists, first with 12 items, second with 12 items and last with 8 items.
				const b1 = myJson.slice(0, 12);
				const b2 = myJson.slice(12, 24);
				const b3 = myJson.slice(24);
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
			amenitiesReportError();
		});
	
})(jQuery);
