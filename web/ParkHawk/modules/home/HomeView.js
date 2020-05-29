import View from '../common/View.js';

export default class HomeView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'HomeModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.rendered = false;
		this.FELID = 'home-view-failure';
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
		this.rendered = false;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		console.log('HomeView updateLatestValues');
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='HomeModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('HomeView => HomeModel fetched!');
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
				const html =
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<h4>Home</h4>'+
							'<p>This is where the user selects TARGET AREA for the map and cameras.</p>'+
							'<p>&nbsp;</p>'+
							'<p>&nbsp;</p>'+
							'<p>UNDER CONSTRUCTION...</p>'+
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
			console.log('HomeView => render Model IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
