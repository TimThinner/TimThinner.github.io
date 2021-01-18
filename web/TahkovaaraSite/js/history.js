(function($) {
	
	historyReportError = function(error) {
		let markup = '<p style="text-align:center;color:a00;font-weight:bold;">';
		if (typeof error.message !== '') {
			markup += error.message;
		} else {
			
		}
		markup += '</p>';
		$('#history').empty().append(markup);
	}
	/*
	generateOriginalDrawingMarkup = function() {
		const markup = '<section class="my-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+
				'<div class="row" style="margin-top:1em">'+
					'<div class="large-12 columns">'+
						'<figure class="history-schema" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">'+
							'<a href="./img/history.png" itemprop="contentUrl" data-size="1970x944" data-index="0">'+
								'<img src="./img/history-tn.png" itemprop="thumbnail" alt="Image description" />'+
							'</a>'+
						'</figure>'+
					'</div>'+
				'</div>'+
			'</section>'+
			'<p class="caption">Nokia Oy:n edustussaunan alkuperäiset piirustukset</p>';
		return markup;
	}
	*/
	/*
		Read amenities from file "historia.json" and fill in the MARKUP tagged by 
			#history-mobile, 
			#history-tablet and 
			#history-desktop
	*/
	fetch('./json/historia.json')
		.then(function(response) {
			status = response.status;
			return response.json();
		})
		.then(function(myJson) {
			
			if (Array.isArray(myJson)) {
				// #history-mobile: put all paragraphs within one div
				let html = '<div class="col s12">';
				myJson.forEach((a,i)=>{
					if (i===0) {
						html += '<p>'+a+'</p>';
						html += '<img class="responsive-img materialboxed" width="1970" src="./img/history.png" style="border: 1px solid #444;">';
						html += '<p style="font-style:italic;color:#888;">Nokia Oy:n edustussaunan alkuperäiset piirustukset</p>';
					} else {
						html += '<p>'+a+'</p>';
					}
				});
				html += '</div>';
				$(html).appendTo('#history-mobile');
				
				// #history-tablet: two cols, left with 2 paragraphs, right 3 paragraphs.
				const a1 = myJson.slice(0, 2); // 0,1
				const a2 = myJson.slice(2);    // 2,3,4
				html = '<div class="col s6">';
				a1.forEach((a,i)=>{
					if (i===0) {
						html += '<p>'+a+'</p>';
						html += '<img class="responsive-img materialboxed" width="1970" src="./img/history.png" style="border: 1px solid #444;">';
						html += '<p style="font-style:italic;color:#888;">Nokia Oy:n edustussaunan alkuperäiset piirustukset</p>';
					} else {
						html += '<p>'+a+'</p>';
					}
				});
				html += '</div><div class="col s6" style="border-left:1px solid #aaa">';
				a2.forEach(a=>{
					html += '<p>'+a+'</p>';
				});
				html += '</div>';
				$(html).appendTo('#history-tablet');
				
				// #history-desktop: two divs, left with 2 paragraphs, center 2 paragraphs, right 1 paragraphs.
				const b1 = myJson.slice(0, 1); // 0
				const b2 = myJson.slice(1, 3); // 1,2
				const b3 = myJson.slice(3);    // 3,4
				html = '<div class="col s4">';
				b1.forEach((a,i)=>{
					if (i===0) {
						html += '<p>'+a+'</p>';
						html += '<img class="responsive-img materialboxed" width="1970" src="./img/history.png" style="border: 1px solid #444;">';
						html += '<p style="font-style:italic;color:#888;">Nokia Oy:n edustussaunan alkuperäiset piirustukset</p>';
					} else {
						html += '<p>'+a+'</p>';
					}
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
				$(html).appendTo('#history-desktop');
				
				$('.materialboxed').materialbox();
			}
		})
		.catch(error => {
			console.log (['error=',error]);
			historyReportError(error);
		});
	
})(jQuery);
