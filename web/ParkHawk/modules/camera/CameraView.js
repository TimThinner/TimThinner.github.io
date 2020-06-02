import View from '../common/View.js';

export default class CameraView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'CameraModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		
		//this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		//this.REO.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'camera-view-failure';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		//this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		let count = 0;
		Object.keys(this.models).forEach(key => {
			if (key === 'CameraModel') {
				count = this.models[key].picCount;
			}
		});
		$('#count').empty().text('Counter value is '+count);
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='CameraModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('CameraView => CameraModel fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
					} else {
						this.render();
					}
				}
			} else if (options.model === 'ResizeEventObserver' && options.method === 'resize') {
				if (this.rendered) {
					console.log('resize!');
				} else {
					console.log('resize: Camera NOT rendered yet!');
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'">'+
							'<div class="error-message"><p>'+errorMessages+'</p></div>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
			} else {
				let count = 0;
				Object.keys(this.models).forEach(key => {
					if (key === 'CameraModel') {
						count = this.models[key].picCount;
					}
				});
				const homeActiveTarget = this.controller.master.modelRepo.get('HomeModel').activeTarget;
				const html =
					'<div class="row">'+
						'<div class="col s12">'+
							'<h4 style="text-align:center;">'+homeActiveTarget+' kamerat</h4>'+
							'<p id="count" style="text-align:center;">Counter value is '+count+'</p>'+
							'<p>&nbsp;</p>'+
							'<p>&nbsp;</p>'+
							'<p>&nbsp;</p>'+
							'<p>&nbsp;</p>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'"></div>'+
					'</div>';
				$(html).appendTo(this.el);
			}
			this.rendered = true;
		} else {
			console.log('CameraView => render Model IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
