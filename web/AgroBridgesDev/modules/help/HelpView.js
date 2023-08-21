import View from '../common/View.js';

export default class HelpView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.rendered = false;
		this.FELID = 'help-message';
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
		const ll_help_title = LM['translation'][sel]['info_title'];
		const ll_main_instruction_1 = LM['translation'][sel]['main_instruction_1'];
		const ll_main_instruction_2 = LM['translation'][sel]['main_instruction_2'];
		const ll_main_instruction_3 = LM['translation'][sel]['main_instruction_3'];
		const ll_main_instruction_4 = LM['translation'][sel]['main_instruction_4'];
		
		/* New: Add links at the end this page. */
		const more_info = LM['translation'][sel]['more_info']; // "More information:"
		const user_guide_title = LM['translation'][sel]['user_guide']; // "User guide"
		const user_guide_link = LM['translation'][sel]['user_guide_link']; // "https://agrobridges-toolbox.eu/decisionsupporttool/"
		const video_title = LM['translation'][sel]['video']; //"Video"
		const video_link = LM['translation'][sel]['video_link']; // "https://www.youtube.com/watch?v=lRf8OdKtjYs"
		const more_info_markup = more_info + ' ' +
			'<a href="'+user_guide_link+'" target="_blank">'+user_guide_title+'</a>, '+
			'<a href="'+video_link+'" target="_blank">'+video_title+'</a>';
		
		const color = this.colors.DARK_GREEN; // DARK_GREEN:'#0B7938',
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+color+'">'+ll_help_title+'</h3>'+
						'<p><img src="./img/help.png" height="150"/></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						//'<p>Please, fill in the information about the Farm, Farm activities and Producer.</p>'+
						//'<p>Light red/green boxes indicate if you have completed all mandatory questions.</p>'+
						//'<p>Once all the mandatory information is filled in, the analysis button in the centre will be activated.</p>'+
						//'<p>You will receive the analysis about the most suitable business models and sales channels.</p>'+
						'<p>'+ll_main_instruction_1+'</p>'+
						'<p>'+ll_main_instruction_2+'</p>'+
						'<p>'+ll_main_instruction_3+'</p>'+
						'<p>'+ll_main_instruction_4+'</p>'+
						'<p>'+more_info_markup+'</p>'+
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
						'<button class="btn waves-effect waves-light" id="help-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
						'<p style="font-size:14px;color:#bbb">v 23.06.30</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		$("#help-ok").on('click', function() {
			self.models['MenuModel'].setSelected('menu');
		});
		
		this.rendered = true;
	}
}
