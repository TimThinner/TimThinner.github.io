import View from '../common/View.js';

export default class InfoView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'info-message';
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
		this.USER_MODEL.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserModel' && options.method==='updateUserProfile') {
				if (options.status === 200) {
					
					$('#'+this.FELID).empty();
					// const msg = 'Feedback submitted OK';
					// Show Toast: Saved OK!
					const LM = this.controller.master.modelRepo.get('LanguageModel');
					const sel = LM.selected;
					const save_ok = LM['translation'][sel]['PROFILE_SAVE_OK'];
					M.toast({
						displayLength:500, 
						html: save_ok,
						classes: 'green darken-1'
					});
					// After 1 second go back to FARM-page automatically.
					setTimeout(() => this.controller.models['MenuModel'].setSelected('farm'), 1000);
					
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
					
					// After 1 second go back to MAIN-page automatically.
					setTimeout(() => this.controller.models['MenuModel'].setSelected('farm'), 1000);
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_farm_size_query = LM['translation'][sel]['farm_hectare_query'];
		const ll_deliver_months_query = LM['translation'][sel]['delivery_month_total_query'];
		const ll_organic_query = LM['translation'][sel]['organic_query'];
		const ll_yes = LM['translation'][sel]['dummy_yes'];
		const ll_no = LM['translation'][sel]['dummy_no'];
		
		const ll_quality_query = LM['translation'][sel]['quality_cert_query'];
		const ll_cert_min = LM['translation'][sel]['Cert_Min'];
		const ll_cert_high = LM['translation'][sel]['Cert_High'];
		const ll_cert_uncertified = LM['translation'][sel]['Cert_uncertified'];
		
		const ll_harvest_query = LM['translation'][sel]['harvest_query'];
		const ll_harvest_only = LM['translation'][sel]['Harv_farmers_org'];
		const ll_harvest_plus = LM['translation'][sel]['Harv_Clean_Sort_Ref'];
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">FARM INFO</h3>'+
						'<p><img src="./img/photo-info.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="input-field col s12 m10 offset-m1">'+
						'<h6 class="required">'+ll_farm_size_query+'</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="farm-size-slider"></div>'+
					'</div>'+
					'<div class="input-field col s12 m10 offset-m1">'+
						'<h6 class="required">'+ll_deliver_months_query+'</h6>'+
						'<p>&nbsp;</p>'+
						'<div id="deliver-months-slider"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6>'+ll_organic_query+'</h6>'+
						'<p><label><input class="with-gap" name="organicStatus" id="organic-no" type="radio" value="no" /><span>'+ll_no+'</span></label></p>'+
						'<p><label><input class="with-gap" name="organicStatus" id="organic-yes" type="radio" value="yes" /><span>'+ll_yes+'</span></label></p>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6>'+ll_quality_query+'</h6>'+
						'<p><label><input class="with-gap" name="qualityStatus" id="quality-min" type="radio" value="min" /><span>'+ll_cert_min+'</span></label></p>'+
						'<p><label><input class="with-gap" name="qualityStatus" id="quality-high" type="radio" value="high" /><span>'+ll_cert_high+'</span></label></p>'+
						'<p><label><input class="with-gap" name="qualityStatus" id="quality-uncertified" type="radio" value="uncertified" /><span>'+ll_cert_uncertified+'</span></label></p>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<h6>'+ll_harvest_query+'</h6>'+
						'<p><label><input class="with-gap" name="harvestStatus" id="harvest-only" type="radio" value="only" /><span>'+ll_harvest_only+'</span></label></p>'+
						'<p><label><input class="with-gap" name="harvestStatus" id="harvest-plus" type="radio" value="plus" /><span>'+ll_harvest_plus+'</span></label></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1" id="'+this.FELID+'">'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="info-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		// Restore current selection:
		const farm_size = this.USER_MODEL.profile.Hectare_farm;
		const delivery_month_total = this.USER_MODEL.profile.Delivery_month_total;
		
		if (this.USER_MODEL.profile.Dummy_organic === 'No') {
			$("#organic-no").prop("checked", true);
			
		} else if (this.USER_MODEL.profile.Dummy_organic === 'Yes') {
			$("#organic-yes").prop("checked", true);
		}
		
		// Only one of these can be true at any one time (radio buttons).
		if (this.USER_MODEL.profile.Cert_Min === true) {
			$("#quality-min").prop("checked", true);
			
		} else if (this.USER_MODEL.profile.Cert_High === true) {
			$("#quality-high").prop("checked", true);
			
		} else if (this.USER_MODEL.profile.Cert_uncertified === true) {
			$("#quality-uncertified").prop("checked", true);
		}
		
		if (this.USER_MODEL.profile.Harv_farmers_org === true) {
			$("#harvest-only").prop("checked", true);
		} else if (this.USER_MODEL.profile.Harv_Clean_Sort_Ref === true) {
			$("#harvest-plus").prop("checked", true);
		}
		
		const farmSizeSlider = document.getElementById('farm-size-slider');
		noUiSlider.create(farmSizeSlider, {
			start: [farm_size],
			connect: 'lower',
			tooltips: [wNumb({decimals:0,suffix:' ha'})],
			step: 1,
			keyboardSupport: true,      // Default true
			keyboardDefaultStep: 5,     // Default 10
			keyboardPageMultiplier: 5,  // Default 5
			keyboardMultiplier: 5,      // Default 1
			range: {
				'min': [0],
				'max': [500]
			}
		});
		farmSizeSlider.noUiSlider.on('change', function (values) {
			console.log(['values=',values]);
			if (Array.isArray(values) && values.length > 0) {
				self.USER_MODEL.profile.Hectare_farm = Math.round(values[0]);
			}
		});
		
		const deliverySlider = document.getElementById('deliver-months-slider');
		noUiSlider.create(deliverySlider, {
			start: [delivery_month_total],
			connect: 'lower',
			tooltips: [wNumb({decimals:0})],
			step: 1,
			keyboardSupport: true,      // Default true
			keyboardDefaultStep: 5,     // Default 10
			keyboardPageMultiplier: 5,  // Default 5
			keyboardMultiplier: 5,      // Default 1
			range: {
				'min': [0],
				'max': [12]
			}
		});
		deliverySlider.noUiSlider.on('change', function (values) {
			console.log(['values=',values]);
			if (Array.isArray(values) && values.length > 0) {
				self.USER_MODEL.profile.Delivery_month_total = Math.round(values[0]);
			}
		});
		
		$('input[type=radio][name=organicStatus]').change(function() {
			if (this.value == 'no') {
				self.USER_MODEL.profile.Dummy_organic = 'No';
				
			} else if (this.value == 'yes') {
				self.USER_MODEL.profile.Dummy_organic = 'Yes';
			}
		});
		
		$('input[type=radio][name=qualityStatus]').change(function() {
			if (this.value == 'min') {
				self.USER_MODEL.profile.Cert_Min = true;
				self.USER_MODEL.profile.Cert_High = false;
				self.USER_MODEL.profile.Cert_uncertified = false;
			} else if (this.value == 'high') {
				self.USER_MODEL.profile.Cert_Min = false;
				self.USER_MODEL.profile.Cert_High = true;
				self.USER_MODEL.profile.Cert_uncertified = false;
			} else {
				self.USER_MODEL.profile.Cert_Min = false;
				self.USER_MODEL.profile.Cert_High = false;
				self.USER_MODEL.profile.Cert_uncertified = true;
			}
		});
		
		$('input[type=radio][name=harvestStatus]').change(function() {
			if (this.value == 'only') {
				self.USER_MODEL.profile.Harv_farmers_org = true;
				self.USER_MODEL.profile.Harv_Clean_Sort_Ref = false;
			} else {
				self.USER_MODEL.profile.Harv_farmers_org = false;
				self.USER_MODEL.profile.Harv_Clean_Sort_Ref = true;
			}
		});
		
		$("#info-ok").on('click', function() {
			
			// Tell user that this might take some time...
			const html = '<div class="highlighted-message"><p><b>WAIT...</b> if the backend is not running in your machine, this takes approximately 20 seconds and after error message continues without saving anything to database.</p></div>';
			$('#'+self.FELID).empty().append(html);
			
			const data = [
				{propName:'Hectare_farm', value:self.USER_MODEL.profile.Hectare_farm},
				{propName:'Delivery_month_total', value:self.USER_MODEL.profile.Delivery_month_total}
			];
			
			if (self.USER_MODEL.profile.Dummy_organic === true) {
				data.push({propName:'Dummy_organic', value:1});
			} else {
				data.push({propName:'Dummy_organic', value:0});
			}
			
			if (self.USER_MODEL.profile.Cert_Min === true) {
				data.push({propName:'Cert_Min', value:1});
			} else {
				data.push({propName:'Cert_Min', value:0});
			}
			
			if (self.USER_MODEL.profile.Cert_High === true) {
				data.push({propName:'Cert_High', value:1});
			} else {
				data.push({propName:'Cert_High', value:0});
			}
			
			if (self.USER_MODEL.profile.Cert_uncertified === true) {
				data.push({propName:'Cert_uncertified', value:1});
			} else {
				data.push({propName:'Cert_uncertified', value:0});
			}
			if (self.USER_MODEL.profile.Harv_farmers_org === true) {
				data.push({propName:'Harv_farmers_org', value:1});
			} else {
				data.push({propName:'Harv_farmers_org', value:0});
			}
			if (self.USER_MODEL.profile.Harv_Clean_Sort_Ref === true) {
				data.push({propName:'Harv_Clean_Sort_Ref', value:1});
			} else {
				data.push({propName:'Harv_Clean_Sort_Ref', value:0});
			}
			
			self.USER_MODEL.updateUserProfile(data, "prod_nl_1");
		});
		
		this.rendered = true;
	}
}
