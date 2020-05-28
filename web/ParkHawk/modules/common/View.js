export default class View {
	
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
	}
	
	areModelsReady() {
		let retval = true;
		Object.keys(this.models).forEach(key => {
			if (this.models[key].ready===true) {
				
			} else {
				retval = false;
			}
		});
		return retval;
	}
	
	modelsErrorMessages() {
		let retval = '';
		Object.keys(this.models).forEach(key => {
			if (this.models[key].errorMessage.length > 0) {
				retval += this.models[key].errorMessage + ' ';
			}
		});
		if (retval.length > 0) {
			return retval.slice(0, -1);
		}
		return retval;
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
