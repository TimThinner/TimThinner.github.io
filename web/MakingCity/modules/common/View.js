export default class View {
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
	}
	
	fillSVGTextElement(svgObject, id, txt) {
		const textElement = svgObject.getElementById(id);
		if (textElement) {
			while (textElement.firstChild) {
				textElement.removeChild(textElement.firstChild);
			}
			const txtnode = document.createTextNode(txt);
			textElement.appendChild(txtnode);
		}
	}
	
	showSpinner(el) {
		const html =
			'<div id="preload-spinner" style="text-align:center;"><p>&nbsp;</p>'+
				'<div class="preloader-wrapper active">'+
					'<div class="spinner-layer spinner-blue-only">'+
						'<div class="circle-clipper left">'+
							'<div class="circle"></div>'+
						'</div>'+
						'<div class="gap-patch">'+
							'<div class="circle"></div>'+
						'</div>'+
						'<div class="circle-clipper right">'+
							'<div class="circle"></div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<p>&nbsp;</p>'+
			'</div>';
		$(html).appendTo(el);
	}
}
