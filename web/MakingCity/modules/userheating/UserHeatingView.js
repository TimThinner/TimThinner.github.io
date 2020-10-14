/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserHeatingView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserHeatingNowModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'user-heating-view-failure';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		super.hide();
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		super.remove();
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
	}
	
	
	updateLatestValues() {
		console.log('UPDATE UserHeating !!!!!!!');
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserHeatingNowModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('UserHeatingView => UserHeatingNowModel fetched!');
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
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			const localized_string_title = LM['translation'][sel]['USER_HEATING_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_HEATING_DESCRIPTION'];
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'">'+
							'<div class="error-message"><p>'+errorMessages+'</p></div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
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
						'<div class="col s12">'+
							'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
							'<p style="text-align:center;"><img src="./svg/userpage/radiator.svg" height="80"/></p>'+
							'<p style="text-align:center;">'+localized_string_description+'</p>'+
						'</div>'+
						
						'<div class="col s12 center">'+
							'<p style="text-align:center;"><img src="./svg/userpage/SmileyHappy.svg" height="60"/></p>'+
						'</div>'+
						
						'<div class="col s12" style="background-color:#fff">'+
							'<table class="centered striped">'+
								'<thead>'+
									'<tr>'+
										'<th>Period</th>'+
										'<th>kWh</th>'+
										'<th>€</th>'+
										'<th>kgCO2</th>'+
									'</tr>'+
								'</thead>'+
								'<tbody>'+
									'<tr>'+
										'<td>Today</td>'+
										'<td>3.65</td>'+
										'<td>0.41</td>'+
										'<td>1</td>'+
									'</tr>'+
									'<tr>'+
										'<td>This week</td>'+
										'<td>20.56</td>'+
										'<td>2.36</td>'+
										'<td>5.65</td>'+
									'</tr>'+
									'<tr>'+
										'<td>This month</td>'+
										'<td>295</td>'+
										'<td>33.9</td>'+
										'<td>81.1</td>'+
									'</tr>'+
								'</tbody>'+
							'</table>'+
						'</div>'+
						
						'<div class="col s4 center" style="margin-top:16px;">'+
							'<a id="view-charts" >'+
								'<img src="./svg/userpage/viewcharts.svg" class="view-button" />'+
							'</a>'+
						'</div>'+
						'<div class="col s4 center" style="margin-top:16px;">'+
							'<a id="targets" >'+
								'<img src="./svg/userpage/targets.svg" class="view-button" />'+
							'</a>'+
						'</div>'+
						'<div class="col s4 center" style="margin-top:16px;">'+
							'<a id="compensate" >'+
								'<img src="./svg/userpage/compensate.svg" class="view-button" />'+
							'</a>'+
						'</div>'+
						
						'<div class="col s12 center" style="margin-top:16px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="'+this.FELID+'"></div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				this.startSwipeEventListeners(
					()=>{this.menuModel.setSelected('USERPAGE');},
					()=>{this.menuModel.setSelected('USERELECTRICITY');}
				);
				
				$('#view-charts').on('click',function() {
					//console.log('VIEW CHARTS!');
					self.menuModel.setSelected('USERHEATINGCHARTS');
				});
				$('#targets').on('click',function() {
					//console.log('TARGETS!');
					self.menuModel.setSelected('USERHEATINGTARGETS');
				});
				$('#compensate').on('click',function() {
					//console.log('COMPENSATE!');
					self.menuModel.setSelected('USERHEATINGCOMPENSATE');
				});
				
			}
			$('#back').on('click',function() {
				
				self.menuModel.setSelected('USERPAGE');
				
			});
			this.rendered = true;
		} else {
			console.log('UserHeatingView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}