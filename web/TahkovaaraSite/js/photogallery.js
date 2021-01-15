(function($) {
	var $pswp = $('.pswp')[0];
	var image = [];
	
	$('.my-gallery').each( function() {
		var $pic     = $(this),
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
})(jQuery);
