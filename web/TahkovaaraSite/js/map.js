
(function($) {
	
	initMap = function() {
		var uluru = {lat: 63.2485, lng: 28.0513};
		var map = new google.maps.Map(document.getElementById('map'), {
			zoom: 13,
			scrollwheel: false,
			center: uluru
		});
		var marker = new google.maps.Marker({
			position: uluru,
			map: map
		});
		$("#map").on('click',function(){
			map.setOptions({scrollwheel:true});
		});
	}
	
	reportError = function() {
		let markup = '<p style="text-align:center;color:a00;font-weight:bold;">';
		markup += 'NOTE: You must have APIKEY for Google Maps to work.<br/>';
		markup += 'You must create a config.json file, where you define your APIKEY:<br/><br/>';
		markup += '{"APIKEY":"Your API KEY here"}<br/><br/>';
		markup += 'and copy the file into your HTML root.<br/>';
		markup += 'Then refresh the page and Google Maps should be visible.</p>';
		$('#map').empty().append(markup);
	}
	
	fetch('config.json')
		.then(function(response) {
			status = response.status;
			return response.json();
		})
		.then(function(myJson) {
			
			if (typeof myJson.APIKEY !== 'undefined') {
				let script = document.createElement('script');
				script.src="https://maps.googleapis.com/maps/api/js?key=" + myJson.APIKEY + "&callback=initMap";
				document.body.append(script); // (*)
				console.log ('APIKEY OK');
			} else {
				console.log ('APIKEY NOT OK');
				reportError();
			}
		})
		.catch(error => {
			console.log (['error=',error]);
			reportError();
		});
	
})(jQuery);
