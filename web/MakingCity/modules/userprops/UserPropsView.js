/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserPropsView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserPropsModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		this.FELID = 'user-props-view-failure';
		this.price = {
			energy: 4, // sents
			energy_frac: 56,
			transfer: 2, // sents
			transfer_frac: 34,
			monthly: 4, // euros
			monthly_frac: 95 // sents
		};
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
		console.log('UPDATE UserProps  !!!!!!!');
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserPropsModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('UserPropsView => UserPropsModel fetched!');
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
	
	handlePriceSlider(id, hash) {
		const self = this;
		
		const value = this.price[hash];
		let s_value = value.toString();
		if (id.indexOf('frac') > 0 && value < 10) {
			s_value = '0'+s_value;
		}
		$('#'+id+'-value').empty().append(s_value);
		//console.log(['value=',value]);
		
		//	energy: 4, // sents
		//	energy_frac: 36,
		//	transfer: 2, // sents
		//	transfer_frac: 99,
		//	monthly: 6, // euros
		//	monthly_frac: 30 // sents
		$('#'+id).change(function(){
			let val = $(this).val(); // "20"
			const vali = parseInt(val, 10);
			self.price[hash] = vali;
			
			if (id.indexOf('frac') > 0 && vali < 10) {
				val = '0'+val;
			}
			//console.log(['val=',val]);
			$('#'+id+'-value').empty().append(val);
		});
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const UM = this.controller.master.modelRepo.get('UserModel')
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			const localized_string_title = LM['translation'][sel]['USER_PROPS_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_PROPS_DESCRIPTION'];
			
			let buttons_html = '';
			if (UM.is_superuser) {
				buttons_html = 
					'<div class="col s12 center">'+
						'<p>Admin can view and edit RegCodes, view Users and associated ReadKeys.</p>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" id="regcodes">RegCodes</button>'+
					'</div>'+
					'<div class="col s6 center">'+
						'<button class="btn waves-effect waves-light" id="users">Users</button>'+
					'</div>'+
					'<div class="col s12 center" style="margin-top:32px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
							'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>';
					
			} else {
				buttons_html = 
					'<div class="col s12 center" style="margin-top:32px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
							'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>';
			}
			
			const localized_string_amount = 'Anna energian hinta (sentteinä)';
			// Ones, Tens, Hundreds
			// Tenths, Hundredths
			// Perusmaksu €/kk
			// Energiamaksu snt/kWh
			// Siirtomaksu snt/kWh
			const html =
				'<div class="row">'+
					'<div class="col s12">'+
						'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
						'<p style="text-align:center;"><img src="./svg/userpage/user.svg" height="80"/></p>'+
						'<p style="text-align:center;">'+localized_string_description+'</p>'+
					'</div>'+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12">'+
						'<h5 style="text-align:center;">Sähkömaksut</h5>'+
						'<p style="text-align:center;">Syötä hinnat omasta sähkösopimuksestasi, niin voimme tehdä arvion sinun sähkölaskustasi.</p>'+
					'</div>'+
				'</div>'+
				
				'<div class="row user-property-box">'+
					'<div class="col s12 center">'+
						'<p class="price-field">Perusmaksu: '+
							'<span id="energy-monthly-price-value"></span>,'+
							'<span id="energy-monthly-price-fractions-value"></span>'+
							'<span class="price-field-postfix"> €/kk</span></p>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:-42px">'+
						'<p style="font-size:14px;text-align:left;" class="range-field">'+
							'<input type="range" id="energy-monthly-price" min="0" max="100"><span class="thumb"><span class="value"></span></span>'+
						'</p>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:-42px">'+
						'<p style="font-size:14px;text-align:left;" class="range-field">'+
							'<input type="range" id="energy-monthly-price-fractions" min="0" max="99"><span class="thumb"><span class="value"></span></span>'+
						'</p>'+
					'</div>'+
				'</div>'+
					
				'<div class="row user-property-box">'+
					'<div class="col s12 center">'+
						'<p class="price-field">Energiamaksu: '+
							'<span id="energy-price-value"></span>,'+
							'<span id="energy-price-fractions-value"></span>'+
							'<span class="price-field-postfix"> snt/kWh</span></p>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:-42px">'+
						'<p style="font-size:14px;text-align:left;" class="range-field">'+
							'<input type="range" id="energy-price" min="0" max="100"><span class="thumb"><span class="value"></span></span>'+
						'</p>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:-42px">'+
						'<p style="font-size:14px;text-align:left;" class="range-field">'+
							'<input type="range" id="energy-price-fractions" min="0" max="99"><span class="thumb"><span class="value"></span></span>'+
						'</p>'+
					'</div>'+
				'</div>'+
				
				'<div class="row user-property-box">'+
					'<div class="col s12 center">'+
						'<p class="price-field">Siirtomaksu: '+
							'<span id="energy-transfer-price-value"></span>,'+
							'<span id="energy-transfer-price-fractions-value"></span>'+
							'<span class="price-field-postfix"> snt/kWh</span></p>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:-42px">'+
						'<p style="font-size:14px;text-align:left;" class="range-field">'+
							'<input type="range" id="energy-transfer-price" min="0" max="100"><span class="thumb"><span class="value"></span></span>'+
						'</p>'+
					'</div>'+
					'<div class="col s6 center" style="margin-top:-42px">'+
						'<p style="font-size:14px;text-align:left;" class="range-field">'+
							'<input type="range" id="energy-transfer-price-fractions" min="0" max="99"><span class="thumb"><span class="value"></span></span>'+
						'</p>'+
					'</div>'+
				'</div>'+
				
				
				'<div class="row">'+buttons_html+
				'</div>'+
				'<div class="row">'+
					'<div class="col s12 center" id="'+this.FELID+'"></div>'+
				'</div>';
			$(html).appendTo(this.el);
			
			// Initialize the sliders.
			$("#energy-price").val(this.price.energy);
			$("#energy-price-fractions").val(this.price.energy_frac);
			$("#energy-transfer-price").val(this.price.transfer);
			$("#energy-transfer-price-fractions").val(this.price.transfer_frac);
			$("#energy-monthly-price").val(this.price.monthly);
			$("#energy-monthly-price-fractions").val(this.price.monthly_frac);
			
			this.handlePriceSlider('energy-price','energy');
			this.handlePriceSlider('energy-price-fractions','energy_frac');
			this.handlePriceSlider('energy-transfer-price','transfer');
			this.handlePriceSlider('energy-transfer-price-fractions','transfer_frac');
			this.handlePriceSlider('energy-monthly-price','monthly');
			this.handlePriceSlider('energy-monthly-price-fractions','monthly_frac');
			
			
			
			// How to input energy price? For example 4,38 snt/kWh.
			// Are there any additional costs per month for example?
			
			// Three input fields:
			//   - Energy price    snt/kWh?   NN,NN
			//   - Transfer price  snt/kWh?   05,34 snt/kWh
			//   - Monthly fee:    NN,NN € / kk
			
			
			
			
			if (UM.is_superuser) {
				$('#regcodes').on('click',function() {
					self.menuModel.setSelected('REGCODES');
				});
				$('#users').on('click',function() {
					self.menuModel.setSelected('USERS');
				});
				$('#readkeys').on('click',function() {
					self.menuModel.setSelected('READKEYS');
				});
			}
			/*
			this.startSwipeEventListeners(
				()=>{this.menuModel.setSelected('USERPAGE');},
				()=>{this.menuModel.setSelected('USERWATER');}
			);*/
			
			$('#back').on('click',function() {
				self.menuModel.setSelected('USERPAGE');
			});
			
			this.handleErrorMessages(this.FELID);
			
			this.rendered = true;
			
		} else {
			console.log('UserPropsView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}