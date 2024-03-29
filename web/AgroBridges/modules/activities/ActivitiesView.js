import View from '../common/View.js';

export default class ActivitiesView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.rendered = false;
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
		
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_marketing_channel_query =  LM['translation'][sel]['marketting_channel_query'];
		const ll_offering_query =  LM['translation'][sel]['offering_query'];
		
		const a_Options = [
			{prop:'Dummy_wholesale',id:'wholesale',label:''},
			{prop:'Dummy_supermarket_regional',id:'regional',label:''},
			{prop:'Dummy_supermarket_noregio',id:'noregio',label:''},
			{prop:'Dummy_farmer_market',id:'market',label:''},
			{prop:'Dummy_farmer_shop',id:'shop',label:''},
			{prop:'Dummy_food_assemblies',id:'assemblies',label:''},
			{prop:'Dummy_food_box_delivery',id:'box',label:''},
			{prop:'Dummy_restaurant',id:'restaurant',label:''},
			{prop:'Dummy_public_canteens',id:'canteens',label:''},
			{prop:'Dummy_no_SFSC',id:'no-sfsc',label:''}
		];
		
		const b_Options = [
			{prop:'Dummy_commu_supp_agri',id:'commu-supp',label:''},
			{prop:'Dummy_Pickyourown',id:'pick-own',label:''}
		];
		
		// Fill in the labels:
		a_Options.forEach(o=>{
			o.label = LM['translation'][sel][o.prop];
		});
		b_Options.forEach(o=>{
			o.label = LM['translation'][sel][o.prop];
		});
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = '<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">ACTIVITIES</h3>'+
						'<p><img src="./img/activities.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="input-field col s12 m10 offset-m1">'+
						'<h6>'+ll_marketing_channel_query+'</h6>'+
						'<div id="activities-a-options-wrapper"></div>'+
					'</div>'+
					'<div class="input-field col s12 m10 offset-m1">'+
						'<h6>'+ll_offering_query+'</h6>'+
						'<div id="activities-b-options-wrapper"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="activities-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		// Insert checkbox markup for options:
		a_Options.forEach(o=>{
			const html = '<p><label><input type="checkbox" class="filled-in" id="'+o.id+'" /><span>'+o.label+'</span></label></p>';
			$('#activities-a-options-wrapper').append(html);
		});
		b_Options.forEach(o=>{
			const html = '<p><label><input type="checkbox" class="filled-in" id="'+o.id+'" /><span>'+o.label+'</span></label></p>';
			$('#activities-b-options-wrapper').append(html);
		});
		
		// Restore current selection:
		a_Options.forEach(o=>{
			if (this.USER_MODEL.profile[o.prop]===true) {
				$("#"+o.id).prop("checked", true);
			} else {
				$("#"+o.id).prop("checked", false);
			}
		});
		
		b_Options.forEach(o=>{
			if (this.USER_MODEL.profile[o.prop]===true) {
				$("#"+o.id).prop("checked", true);
			} else {
				$("#"+o.id).prop("checked", false);
			}
		});
		
		// Set checkbox change -handlers:
		a_Options.forEach(o=>{
			$("#"+o.id).change(function() {
				if(this.checked) {
					self.USER_MODEL.profile[o.prop] = true;
					// DATABASE Update USER_MODEL
				} else {
					self.USER_MODEL.profile[o.prop] = false;
					// DATABASE Update USER_MODEL
				}
			});
		});
		
		b_Options.forEach(o=>{
			$("#"+o.id).change(function() {
				if(this.checked) {
					self.USER_MODEL.profile[o.prop] = true;
					// DATABASE Update USER_MODEL
				} else {
					self.USER_MODEL.profile[o.prop] = false;
					// DATABASE Update USER_MODEL
				}
			});
		});
		
		$("#activities-ok").on('click', function() {
			self.controller.models['MenuModel'].setSelected('main');
		});
		this.rendered = true;
	}
}
