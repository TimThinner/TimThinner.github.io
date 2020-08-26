import View from '../common/View.js';

/*
	VIEW:
	=============
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
		
	}
	areModelsReady()
	modelsErrorMessages()
	forceLogout(vid)
	showSpinner(el)
	
	INFLUXVIEW:
	=============
		this.rendered = false;
		this.counter = 0;
		this.FELID = 'influx-view-failure';
	hide()
	remove()
	updateLatestValues()
	notify(options)  FROM MODELS: InfluxModel
	render()
	
*/
export default class InfluxView extends View {
	
	constructor(controller) {
		
		super(controller); 
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'InfluxModel') {
				this.models[key] = this.controller.models[key];
				console.log(['subscribe ',key,' with InfluxView']);
				this.models[key].subscribe(this);
			}
		});
		this.rendered = false;
		this.counter = 0;
		this.FELID = 'influx-view-failure';
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			console.log(['UNsubscribe ',key,' with InfluxView!']);
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		this.counter = 0;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		$('#fetch-counter-value').empty().append(this.counter);
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='InfluxModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('InfluxView => InfluxModel fetched!');
					this.counter++;
					
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			}
		}
	}
	
	render() {
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			//const LM = this.controller.master.modelRepo.get('LanguageModel');
			//const sel = LM.selected;
			//const localized_string_title = LM['translation'][sel]['SOLAR_PAGE_TITLE'];
			//const localized_string_description = LM['translation'][sel]['SOLAR_PAGE_DESCRIPTION'];
			//const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 influx-content" id="'+this.FELID+'">'+
							'<p class="error-message">'+errorMessages+'</p>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				if (errorMessages.indexOf('Auth failed') >= 0) {
					// Show message and then FORCE LOGOUT in 3 seconds.
					this.forceLogout(this.FELID);
				}
				
			} else {
				const html =
					'<div class="row">'+
						'<div class="col s12 influx-content">'+
							'<h2 style="text-align:center">MARKET INFO</h2>'+
							'<p id="fetch-counter-value" style="margin-top:8px;margin-bottom:8px;color:#000;text-align:center;font-size:32px;background-color:#cff;">'+this.counter+'</p>'+
							"<p>Cheese and biscuits cauliflower cheese cheesy feet. Halloumi taleggio gouda when the cheese comes out everybody's happy fromage smelly cheese fondue jarlsberg. Caerphilly macaroni cheese cheesy grin lancashire pecorino parmesan cheese triangles pecorino. Caerphilly edam taleggio jarlsberg cauliflower cheese blue castello camembert de normandie manchego. Emmental cheeseburger.</p>"+
							"<p>Boursin dolcelatte fromage. Port-salut mozzarella monterey jack melted cheese boursin bavarian bergkase port-salut camembert de normandie. Babybel port-salut mascarpone fromage blue castello pecorino cream cheese cheddar. Cheddar fromage cheesy feet.</p>"+
							"<p>Squirty cheese swiss cheeseburger. Emmental taleggio cheese on toast jarlsberg camembert de normandie fromage frais the big cheese squirty cheese. Chalk and cheese cheesecake cheddar fondue roquefort when the cheese comes out everybody's happy cheese slices cut the cheese. Cheese slices feta croque monsieur.</p>"+
							"<p>Jarlsberg fondue pepper jack. Monterey jack cheese and wine queso cream cheese fondue caerphilly rubber cheese taleggio. Smelly cheese squirty cheese fondue say cheese halloumi chalk and cheese port-salut who moved my cheese. Roquefort st. agur blue cheese monterey jack swiss when the cheese comes out everybody's happy brie melted cheese cheese on toast. Cheesecake.</p>"+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 influx-content" id="'+this.FELID+'"></div>'+
					'</div>';
				$(html).appendTo(this.el);
			}
			this.rendered = true;
		} else {
			console.log('InfluxView => render Model IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
