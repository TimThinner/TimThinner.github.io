(function($) {
	
	historyReportError = function(error) {
		let markup = '<p style="text-align:center;color:a00;font-weight:bold;">';
		if (typeof error.message !== 'undefined') {
			markup += error.message;
		} else {
			markup += 'Error without message has occurred.';
		}
		markup += '</p>';
		$('#history').empty().append(markup);
	}
	
	initPhotoGallery = function() {
		var $pswp = $('.pswp')[0];
		var image = [];
		
		$('.my-gallery').each( function() {
			var $pic = $(this),
			getItems = function() {
				var items = [];
				$pic.find('a').each(function() {
					var $href   = $(this).attr('href'),
						$size   = $(this).data('size').split('x'),
						$width  = $size[0],
						$height = $size[1],
						$index  = $(this).data('index'),
						$figcaption = $(this).siblings('figcaption');
					var item = {
						src : $href,
						w   : $width,
						h   : $height,
						index : $index,
						title : $figcaption.text()
					}
					items.push(item);
				});
				return items;
			}
			var items = getItems();
			$.each(items, function(index, value) {
				image[index]     = new Image();
				image[index].src = value['src'];
			});
			$pic.on('click', 'figure', function(event) {
				event.preventDefault();
				//var $index = $(this).index();
				var $index = $(this).find('a').data('index');
				var options = {
					index: $index,
					bgOpacity: 0.8,
					showHideOpacity: true
				}
				var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
				lightBox.init();
			});
		});
	}
	/* history1.png and history2.png 1854 x 1322 */
	generateOriginalDrawingMarkup1 = function() {
		const markup = '<section class="my-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+
				'<div class="row" style="margin-top:1em">'+
					'<div class="col s12">'+
						'<figure style="border: 1px solid #444;" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">'+
							'<a href="./img/history1.png" itemprop="contentUrl" data-size="1854x1322" data-index="0">'+
								'<img src="./img/history1_tn.png" itemprop="thumbnail" alt="Image description" />'+
							'</a>'+
						'</figure>'+
					'</div>'+
				'</div>'+
			'</section>';
			//'<p class="caption">Nokia Oy:n edustussaunan alkuperäiset piirustukset</p>';
		return markup;
	}
	generateOriginalDrawingMarkup2 = function() {
		const markup = '<section class="my-gallery" itemscope itemtype="http://schema.org/ImageGallery">'+
				'<div class="row" style="margin-top:1em">'+
					'<div class="col s12">'+
						'<figure style="border: 1px solid #444;" itemprop="associatedMedia" itemscope itemtype="http://schema.org/ImageObject">'+
							'<a href="./img/history2.png" itemprop="contentUrl" data-size="1854x1322" data-index="0">'+
								'<img src="./img/history2_tn.png" itemprop="thumbnail" alt="Image description" />'+
							'</a>'+
						'</figure>'+
					'</div>'+
				'</div>'+
			'</section>';
			//'<p class="caption">Nokia Oy:n edustussaunan alkuperäiset piirustukset</p>';
		return markup;
	}
	
	/*
		Read history from file "historia.json" and fill in the MARKUP tagged by 
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
						html += generateOriginalDrawingMarkup1();
					} else {
						html += '<p>'+a+'</p>';
						html += generateOriginalDrawingMarkup2();
					}
				});
				html += '</div>';
				$(html).appendTo('#history-mobile');
				
				// #history-tablet: two cols, left with 1 paragraphs, right 1 paragraphs.
				const a1 = myJson.slice(0, 1); // 0
				const a2 = myJson.slice(1);    // 1
				html = '<div class="col s6">';
				a1.forEach((a,i)=>{
					
					html += '<p>'+a+'</p>';
					html += generateOriginalDrawingMarkup1();
					
				});
				html += '</div><div class="col s6" style="border-left:1px solid #aaa">';
				a2.forEach(a=>{
					html += '<p>'+a+'</p>';
					html += generateOriginalDrawingMarkup2();
				});
				html += '</div>';
				$(html).appendTo('#history-tablet');
				
				// #history-desktop: two divs, left with 1 paragraphs, center 1 paragraphs, right picture.
				const b1 = myJson.slice(0, 1); // 0
				const b2 = myJson.slice(1); // 1
				
				html = '<div class="col s4">';
				b1.forEach((a,i)=>{
					
					html += '<p>'+a+'</p>';
					
				});
				html += '</div><div class="col s4" style="border-left:1px solid #aaa">';
				b2.forEach(a=>{
					html += '<p>'+a+'</p>';
				});
				html += '</div><div class="col s4" style="border-left:1px solid #aaa">';
				html += generateOriginalDrawingMarkup1();
				html += generateOriginalDrawingMarkup2();
				html += '</div>';
				$(html).appendTo('#history-desktop');
				
				initPhotoGallery();
				
			} else {
				historyReportError({message:'Error: historia.json content is NOT an Array.'});
			}
		})
		.catch(error => {
			console.log (['error=',error]);
			historyReportError(error);
		});
	
})(jQuery);
