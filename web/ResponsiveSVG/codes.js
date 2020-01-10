/*
	SEE: http://www.petercollingridge.co.uk/tutorials/svg/interactive/javascript/
*/
(function($) {
	let svgObject = undefined;
	
	window.addEventListener("load", function() {
		/*
		The load event is fired when the whole page has loaded, including all 
		dependent resources such as stylesheets and images.
		This is in contrast to DOMContentLoaded, which is fired as soon as the 
		page DOM has been loaded, without waiting for resources to finish loading.
		*/
		svgObject = document.getElementById('svg-object').contentDocument;
		if (typeof svgObject !== 'undefined') {
			console.log("svgObject is now ready!");
		}
	});
	
	$("#toggle-direction").on('click',function(){
		if (typeof svgObject !== 'undefined') {
			let pathElement = svgObject.getElementById('p1');
			//<text id="grid-power" x="400" y="380" font-family="Arial, Helvetica, sans-serif" font-size="42px" fill="#f00">120.0 kW</text>
			let textElement = svgObject.getElementById('grid-power');
			
			
			let d = pathElement.getAttributeNS(null, 'd');
			//console.log(['d=',d]);
			const head = d.slice(0,20);
			const tail = d.slice(20);
			if (head === 'M 300,400 L 1000,400') {
				// Change text GREEN and value 2.5 kW
				while (textElement.firstChild) {
					textElement.removeChild(textElement.firstChild);
				}
				var txt = document.createTextNode("2.5 kW");
				textElement.appendChild(txt);
				textElement.setAttributeNS(null, 'fill', '#16b65f');
				
				const new_d = "M 1000,400 L 300,400" + tail;
				pathElement.setAttributeNS(null, 'd', new_d);
				
			} else {
				// Change text RED and value 120.0 kW
				while (textElement.firstChild) {
					textElement.removeChild(textElement.firstChild);
				}
				var txt = document.createTextNode("120.0 kW");
				textElement.appendChild(txt);
				textElement.setAttributeNS(null, 'fill', '#f00');
				
				const new_d = "M 300,400 L 1000,400" + tail;
				pathElement.setAttributeNS(null, 'd', new_d);
			}
		}
	});
})(jQuery);
