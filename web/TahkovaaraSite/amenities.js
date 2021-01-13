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
	
	fetch('varustus.json')
		.then(function(response) {
			status = response.status;
			return response.json();
		})
		.then(function(myJson) {
			
			console.log(['amenities myJson=',myJson]);
			
			
			/*
			Read amenities from file "amenities.json" and fill in the MARKUP tagged by #amenities-mobile, #amenities-tablet and #amenities-desktop
			
			#amenities-mobile 1 COLUMN => 
						<div class="col s12">
							<ul>							32
								<li>Lattialämmitys</li>
								...
							</ul>
						</div>
						
			#amenities-tablet 2 COLUMNS =>
							<div class="col s4">
								<ul>						17
									<li>Lattialämmitys</li>
									<li>Jäähdytys</li>
									...
								</ul>
							</div>
							<div class="col s8">
								<ul>						15
									<li>Leivänpaahdin</li>
									<li>Sähkövatkain</li>
							...
			#amenities-desktop 3 COLUMNS =>
			
							<div class="col s4">			12
							<div class="col s4">			12
							<div class="col s4">			8
			
			
			*/
			/*
			if (typeof myJson.APIKEY !== 'undefined') {
				let script = document.createElement('script');
				script.src="https://maps.googleapis.com/maps/api/js?key=" + myJson.APIKEY + "&callback=initMap";
				document.body.append(script); // (*)
				console.log ('APIKEY OK');
			} else {
				console.log ('APIKEY NOT OK');
				amenitiesreportError();
			}*/
		})
		.catch(error => {
			console.log (['error=',error]);
			amenitiesReportError();
		});
	
})(jQuery);
