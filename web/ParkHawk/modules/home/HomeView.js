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
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
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
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		console.log('updateLatestValues');
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
		} else if (options.model === 'ResizeEventObserver' && options.method === 'resize') {
			if (this.rendered) {
				console.log('resize!');
			} else {
				console.log('resize: Home NOT rendered yet!');
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
						'<div class="col s12">'+
							'<h4 style="text-align:center;">Home</h4>'+
							"<p>Bavarian bergkase cheesy feet mozzarella. When the cheese comes out everybody's happy croque monsieur paneer camembert de normandie port-salut manchego cheesy feet say cheese. Smelly cheese mascarpone parmesan mascarpone cheddar fromage frais brie squirty cheese. Brie parmesan squirty cheese manchego fromage frais cauliflower cheese cheese triangles cheese and wine. Mozzarella.</p>"+
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
