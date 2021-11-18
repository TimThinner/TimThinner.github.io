/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class EnvironmentPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			// Subscribe to all models from Controller:
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		this.rendered = false;
		this.FELID = 'environment-page-view-failure';
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
	
	notifyError(options) {
		console.log(['ERROR IN FETCHING ',options.model]);
		if (this.rendered) {
			
			$('#'+this.FELID).empty();
			const html = '<div class="error-message"><p>'+options.message+'</p></div>';
			$(html).appendTo('#'+this.FELID);
			
		} else {
			this.render();
		}
	}
	
	/*
{ "results": [ 
{ "country": "FI", "date_time": "2021-11-15 15:27:49", "em_cons": 138.5389, "em_prod": 139.6106, "emdb": "EcoInvent", "id": 154805 },
{ "country": "FI", "date_time": "2021-11-15 15:01:03", "em_cons": 140.5014, "em_prod": 141.0444, "emdb": "EcoInvent", "id": 154697 }, 
{ "country": "FI", "date_time": "2021-11-15 15:03:51", "em_cons": 140.0652, "em_prod": 140.3119, "emdb": "EcoInvent", "id": 154709 }, 
{ "country": "FI", "date_time": "2021-11-15 15:06:50", "em_cons": 139.1719, "em_prod": 140.0983, "emdb": "EcoInvent", "id": 154721 }, 
*/
	
	updateResults() {
		//{ "results": [ { "country": "FI", "date_time": "2021-11-16 10:31:06", "em_cons": 160.305, "em_prod": 148.0854, "emdb": "EcoInvent", "id": 159293 } ] }
		const res = this.models['EcoInventModel'].results;
		console.log(['res length=',res.length]);
		if (res.length > 0) {
			
			
			
			let datetime = '<p>datetime: -</p>';
			let emcons = '<p>emissions consumed: -</p>';
			let emprod = '<p>emissions produced: -</p>';
			let emdb = '';
			
			if (typeof res[0].date_time !== 'undefined') {
				datetime = '<p>datetime: ' + res[0].date_time + '</p>';
			}
			if (typeof res[0].em_cons !== 'undefined') {
				emcons = '<p>emissions consumed: ' + res[0].em_cons + '</p>';
			}
			if (typeof res[0].em_prod !== 'undefined') {
				emprod = '<p>emissions produced: ' + res[0].em_prod + '</p>';
			}
			if (typeof res[0].emdb !== 'undefined') {
				emdb = '<h3>' + res[0].emdb + '</h3>';
			}
			const html = emdb + datetime + emcons + emprod;
			$('#results-wrapper').empty().append(html);
			
			
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model === 'EcoInventModel' && options.method==='fetched') {
				if (options.status === 200) {
					//console.log('EnvironmentPageView => ' + options.model + ' fetched!');
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateResults();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					this.notifyError(options);
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
		const localized_string_title = LM['translation'][sel]['ENVIRONMENT_PAGE_TITLE'];
		const localized_string_description = LM['translation'][sel]['ENVIRONMENT_PAGE_DESCRIPTION'];
		
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
					'<p style="text-align:center;">'+localized_string_description+'</p>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="results-wrapper"></div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
						'<i class="material-icons left">arrow_back</i>'+
					'</button>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12 center" id="'+this.FELID+'"></div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		$('#back').on('click',function() {
			self.models['MenuModel'].setSelected('menu');
		});
		
		this.rendered = true;
		
		if (this.areModelsReady()) {
			this.handleErrorMessages(this.FELID);
			this.updateResults();
		}
	}
}