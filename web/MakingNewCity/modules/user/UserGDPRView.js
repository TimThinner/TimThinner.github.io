import View from '../common/View.js';

export default class UserGDPRView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
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
		
		const gdpr_title = LM['translation'][sel]['GDPR_TITLE'];
		const gdpr_description = LM['translation'][sel]['GDPR_DESCRIPTION'];
		const gdpr_chapter_1 = LM['translation'][sel]['GDPR_CHAPTER_1'];
		const gdpr_chapter_1a  = LM['translation'][sel]['GDPR_CHAPTER_1A'];
		const gdpr_chapter_1b  = LM['translation'][sel]['GDPR_CHAPTER_1B'];
		const gdpr_chapter_2 = LM['translation'][sel]['GDPR_CHAPTER_2'];
		const gdpr_chapter_2a  = LM['translation'][sel]['GDPR_CHAPTER_2A'];
		const gdpr_chapter_2aa  = LM['translation'][sel]['GDPR_CHAPTER_2AA'];
		const gdpr_chapter_2aaa  = LM['translation'][sel]['GDPR_CHAPTER_2AAA'];
		const gdpr_chapter_2aab  = LM['translation'][sel]['GDPR_CHAPTER_2AAB'];
		const gdpr_chapter_2aac  = LM['translation'][sel]['GDPR_CHAPTER_2AAC'];
		const gdpr_chapter_2ab  = LM['translation'][sel]['GDPR_CHAPTER_2AB'];
		const gdpr_chapter_2aba  = LM['translation'][sel]['GDPR_CHAPTER_2ABA'];
		const gdpr_chapter_2abb  = LM['translation'][sel]['GDPR_CHAPTER_2ABB'];
		const gdpr_chapter_2abc  = LM['translation'][sel]['GDPR_CHAPTER_2ABC'];
		const gdpr_chapter_2b  = LM['translation'][sel]['GDPR_CHAPTER_2B'];
		const gdpr_chapter_2ba = LM['translation'][sel]['GDPR_CHAPTER_2BA'];
		const gdpr_chapter_2ba_email = LM['translation'][sel]['GDPR_CHAPTER_2BA_EMAIL'];
		const gdpr_chapter_2bb = LM['translation'][sel]['GDPR_CHAPTER_2BB'];
		const gdpr_chapter_2bb_email = LM['translation'][sel]['GDPR_CHAPTER_2BB_EMAIL'];
		const gdpr_chapter_2bc = LM['translation'][sel]['GDPR_CHAPTER_2BC'];
		const gdpr_chapter_2bc_email = LM['translation'][sel]['GDPR_CHAPTER_2BC_EMAIL'];
		const gdpr_chapter_2bd = LM['translation'][sel]['GDPR_CHAPTER_2BD'];
		const gdpr_chapter_2bd_email = LM['translation'][sel]['GDPR_CHAPTER_2BD_EMAIL'];
		const gdpr_chapter_2be = LM['translation'][sel]['GDPR_CHAPTER_2BE'];
		const gdpr_chapter_2be_email = LM['translation'][sel]['GDPR_CHAPTER_2BE_EMAIL'];
		const gdpr_chapter_2bf = LM['translation'][sel]['GDPR_CHAPTER_2BF'];
		const gdpr_chapter_2bf_email = LM['translation'][sel]['GDPR_CHAPTER_2BF_EMAIL'];
		const gdpr_chapter_2bg = LM['translation'][sel]['GDPR_CHAPTER_2BG'];
		const gdpr_chapter_2bg_email = LM['translation'][sel]['GDPR_CHAPTER_2BG_EMAIL'];
		const gdpr_chapter_2bh = LM['translation'][sel]['GDPR_CHAPTER_2BH'];
		const gdpr_chapter_2bh_email = LM['translation'][sel]['GDPR_CHAPTER_2BH_EMAIL'];
		const gdpr_chapter_2bi = LM['translation'][sel]['GDPR_CHAPTER_2BI'];
		const gdpr_chapter_2bi_email = LM['translation'][sel]['GDPR_CHAPTER_2BI_EMAIL'];
		const gdpr_chapter_2bj = LM['translation'][sel]['GDPR_CHAPTER_2BJ'];
		const gdpr_chapter_2bj_email = LM['translation'][sel]['GDPR_CHAPTER_2BJ_EMAIL'];
		const gdpr_chapter_2bk = LM['translation'][sel]['GDPR_CHAPTER_2BK'];
		const gdpr_chapter_2bk_email = LM['translation'][sel]['GDPR_CHAPTER_2BK_EMAIL'];
		const gdpr_chapter_2bl = LM['translation'][sel]['GDPR_CHAPTER_2BL'];
		const gdpr_chapter_2bl_email = LM['translation'][sel]['GDPR_CHAPTER_2BL_EMAIL'];
		const gdpr_chapter_3 = LM['translation'][sel]['GDPR_CHAPTER_3'];
		const gdpr_chapter_3a = LM['translation'][sel]['GDPR_CHAPTER_3A'];
		const gdpr_chapter_4 = LM['translation'][sel]['GDPR_CHAPTER_4'];
		const gdpr_chapter_4a = LM['translation'][sel]['GDPR_CHAPTER_4A'];
		const gdpr_chapter_4b = LM['translation'][sel]['GDPR_CHAPTER_4B'];
		const gdpr_chapter_5 = LM['translation'][sel]['GDPR_CHAPTER_5'];
		const gdpr_chapter_5a = LM['translation'][sel]['GDPR_CHAPTER_5A'];
		const gdpr_chapter_5b = LM['translation'][sel]['GDPR_CHAPTER_5B'];
		const gdpr_chapter_5ba = LM['translation'][sel]['GDPR_CHAPTER_5BA'];
		const gdpr_chapter_5baa = LM['translation'][sel]['GDPR_CHAPTER_5BAA'];
		const gdpr_chapter_5bab = LM['translation'][sel]['GDPR_CHAPTER_5BAB'];
		const gdpr_chapter_5bb = LM['translation'][sel]['GDPR_CHAPTER_5BB'];
		const gdpr_chapter_5bba = LM['translation'][sel]['GDPR_CHAPTER_5BBA'];
		const gdpr_chapter_5bc = LM['translation'][sel]['GDPR_CHAPTER_5BC'];
		const gdpr_chapter_5bd = LM['translation'][sel]['GDPR_CHAPTER_5BD'];
		const gdpr_chapter_5b_sup = LM['translation'][sel]['GDPR_CHAPTER_5B_SUP'];
		const gdpr_chapter_6 = LM['translation'][sel]['GDPR_CHAPTER_6'];
		const gdpr_chapter_6a = LM['translation'][sel]['GDPR_CHAPTER_6A'];
		const gdpr_chapter_7 = LM['translation'][sel]['GDPR_CHAPTER_7'];
		const gdpr_chapter_7a = LM['translation'][sel]['GDPR_CHAPTER_7A'];
		const gdpr_chapter_7aa = LM['translation'][sel]['GDPR_CHAPTER_7AA'];
		const gdpr_chapter_7ab = LM['translation'][sel]['GDPR_CHAPTER_7AB'];
		const gdpr_chapter_7ac = LM['translation'][sel]['GDPR_CHAPTER_7AC'];
		const gdpr_chapter_7ad = LM['translation'][sel]['GDPR_CHAPTER_7AD'];
		const gdpr_chapter_7ae = LM['translation'][sel]['GDPR_CHAPTER_7AE'];
		const gdpr_chapter_7af = LM['translation'][sel]['GDPR_CHAPTER_7AF'];
		const gdpr_chapter_7ag = LM['translation'][sel]['GDPR_CHAPTER_7AG'];
		const gdpr_chapter_7ah = LM['translation'][sel]['GDPR_CHAPTER_7AH'];
		const gdpr_chapter_7ai = LM['translation'][sel]['GDPR_CHAPTER_7AI'];
		const gdpr_chapter_7aj = LM['translation'][sel]['GDPR_CHAPTER_7AJ'];
		const gdpr_chapter_7ak = LM['translation'][sel]['GDPR_CHAPTER_7AK'];
		const gdpr_chapter_7al = LM['translation'][sel]['GDPR_CHAPTER_7AL'];
		const gdpr_chapter_7am = LM['translation'][sel]['GDPR_CHAPTER_7AM'];
		const gdpr_chapter_8 = LM['translation'][sel]['GDPR_CHAPTER_8'];
		const gdpr_chapter_8a = LM['translation'][sel]['GDPR_CHAPTER_8A'];
		const gdpr_chapter_8aa = LM['translation'][sel]['GDPR_CHAPTER_8AA'];
		const gdpr_chapter_8ab = LM['translation'][sel]['GDPR_CHAPTER_8AB'];
		const gdpr_chapter_8ac = LM['translation'][sel]['GDPR_CHAPTER_8AC'];
		const gdpr_chapter_8ba = LM['translation'][sel]['GDPR_CHAPTER_8BA'];
		const gdpr_chapter_8bb = LM['translation'][sel]['GDPR_CHAPTER_8BB'];
		const gdpr_chapter_8bc = LM['translation'][sel]['GDPR_CHAPTER_8BC'];
		const gdpr_chapter_8bd = LM['translation'][sel]['GDPR_CHAPTER_8BD'];
		const gdpr_chapter_8be = LM['translation'][sel]['GDPR_CHAPTER_8BE'];
		const gdpr_chapter_9 = LM['translation'][sel]['GDPR_CHAPTER_9'];
		const gdpr_chapter_9a = LM['translation'][sel]['GDPR_CHAPTER_9A'];
		const gdpr_chapter_10 = LM['translation'][sel]['GDPR_CHAPTER_10'];
		const gdpr_chapter_10a = LM['translation'][sel]['GDPR_CHAPTER_10A'];
		const gdpr_chapter_10b = LM['translation'][sel]['GDPR_CHAPTER_10B'];
		const gdpr_chapter_10ba = LM['translation'][sel]['GDPR_CHAPTER_10BA'];
		const gdpr_chapter_10bb = LM['translation'][sel]['GDPR_CHAPTER_10BB'];
		const gdpr_chapter_10bc = LM['translation'][sel]['GDPR_CHAPTER_10BC'];
		const gdpr_chapter_10c = LM['translation'][sel]['GDPR_CHAPTER_10C'];
		
		const gdpr_chapter_11 = LM['translation'][sel]['GDPR_CHAPTER_11'];
		const gdpr_chapter_11a = LM['translation'][sel]['GDPR_CHAPTER_11A'];
		const gdpr_chapter_11aa = LM['translation'][sel]['GDPR_CHAPTER_11AA'];
		const gdpr_chapter_11ab = LM['translation'][sel]['GDPR_CHAPTER_11AB'];
		const gdpr_chapter_11ac = LM['translation'][sel]['GDPR_CHAPTER_11AC'];
		const gdpr_chapter_11b = LM['translation'][sel]['GDPR_CHAPTER_11B'];
		const gdpr_chapter_11c = LM['translation'][sel]['GDPR_CHAPTER_11C'];
		const gdpr_chapter_11ca = LM['translation'][sel]['GDPR_CHAPTER_11CA'];
		const gdpr_chapter_11cb = LM['translation'][sel]['GDPR_CHAPTER_11CB'];
		const gdpr_chapter_11cc = LM['translation'][sel]['GDPR_CHAPTER_11CC'];
		const gdpr_chapter_11cd = LM['translation'][sel]['GDPR_CHAPTER_11CD'];
		const gdpr_chapter_11ce = LM['translation'][sel]['GDPR_CHAPTER_11CE'];
		const gdpr_chapter_11cf = LM['translation'][sel]['GDPR_CHAPTER_11CF'];
		const gdpr_chapter_11d = LM['translation'][sel]['GDPR_CHAPTER_11D'];
		const gdpr_chapter_11da = LM['translation'][sel]['GDPR_CHAPTER_11DA'];
		const gdpr_chapter_11db = LM['translation'][sel]['GDPR_CHAPTER_11DB'];
		const gdpr_chapter_11dc = LM['translation'][sel]['GDPR_CHAPTER_11DC'];
		
		const gdpr_chapter_12 = LM['translation'][sel]['GDPR_CHAPTER_12'];
		const gdpr_chapter_12a = LM['translation'][sel]['GDPR_CHAPTER_12A'];
		const gdpr_chapter_12b = LM['translation'][sel]['GDPR_CHAPTER_12B'];
		const gdpr_chapter_12c = LM['translation'][sel]['GDPR_CHAPTER_12C'];
		const gdpr_chapter_12ca = LM['translation'][sel]['GDPR_CHAPTER_12CA'];
		const gdpr_chapter_12d = LM['translation'][sel]['GDPR_CHAPTER_12D'];
		const gdpr_chapter_12da = LM['translation'][sel]['GDPR_CHAPTER_12DA'];
		const gdpr_chapter_12e = LM['translation'][sel]['GDPR_CHAPTER_12E'];
		const gdpr_chapter_12ea = LM['translation'][sel]['GDPR_CHAPTER_12EA'];
		const gdpr_chapter_12f = LM['translation'][sel]['GDPR_CHAPTER_12F'];
		const gdpr_chapter_12fa = LM['translation'][sel]['GDPR_CHAPTER_12FA'];
		const gdpr_chapter_12g = LM['translation'][sel]['GDPR_CHAPTER_12G'];
		const gdpr_chapter_12ga = LM['translation'][sel]['GDPR_CHAPTER_12GA'];
		const gdpr_chapter_12h = LM['translation'][sel]['GDPR_CHAPTER_12H'];
		const gdpr_chapter_12ha = LM['translation'][sel]['GDPR_CHAPTER_12HA'];
		const gdpr_chapter_12i = LM['translation'][sel]['GDPR_CHAPTER_12I'];
		const gdpr_chapter_12ia = LM['translation'][sel]['GDPR_CHAPTER_12IA'];
		const gdpr_chapter_12j = LM['translation'][sel]['GDPR_CHAPTER_12J'];
		
		const localized_string_ok = LM['translation'][sel]['OK'];
		const html =
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h4>'+gdpr_title+'</h4>'+
						'<p>'+gdpr_description+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_1+'</h5>'+
						'<p>'+gdpr_chapter_1a+'<br/>'+gdpr_chapter_1b+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_2+'</h5>'+
						'<p>'+gdpr_chapter_2a+'</p>'+
						'<div class="row">'+
							'<div class="col s1">&nbsp;</div>'+
							'<div class="col s11">'+
								'<p><b>'+gdpr_chapter_2aa+'</b><br/>'+
								gdpr_chapter_2aaa+'<br/>'+
								gdpr_chapter_2aab+'<br/>'+
								gdpr_chapter_2aac+'</p>'+
							'</div>'+
							'<div class="col s1">&nbsp;</div>'+
							'<div class="col s11">'+
								'<p><b>'+gdpr_chapter_2ab+'</b><br/>'+
								gdpr_chapter_2aba+'<br/>'+
								gdpr_chapter_2abb+'<br/>'+
								gdpr_chapter_2abc+'</p>'+
							'</div>'+
						'</div>'+
						'<p>'+gdpr_chapter_2b+'</p>'+
						'<div class="row">'+
							'<div class="col s1">&nbsp;</div>'+
							'<div class="col s11">'+
								'<p>'+gdpr_chapter_2ba+'<br/>'+
								gdpr_chapter_2ba_email+'<br/>'+
								gdpr_chapter_2bb+'<br/>'+
								gdpr_chapter_2bb_email+'<br/>'+
								gdpr_chapter_2bc+'<br/>'+
								gdpr_chapter_2bc_email+'<br/>'+
								gdpr_chapter_2bd+'<br/>'+
								gdpr_chapter_2bd_email+'<br/>'+
								gdpr_chapter_2be+'<br/>'+
								gdpr_chapter_2be_email+'<br/>'+
								gdpr_chapter_2bf+'<br/>'+
								gdpr_chapter_2bf_email+'<br/>'+
								gdpr_chapter_2bg+'<br/>'+
								gdpr_chapter_2bg_email+'<br/>'+
								gdpr_chapter_2bh+'<br/>'+
								gdpr_chapter_2bh_email+'<br/>'+
								gdpr_chapter_2bi+'<br/>'+
								gdpr_chapter_2bi_email+'<br/>'+
								gdpr_chapter_2bj+'<br/>'+
								gdpr_chapter_2bj_email+'<br/>'+
								gdpr_chapter_2bk+'<br/>'+
								gdpr_chapter_2bk_email+'<br/>'+
								gdpr_chapter_2bl+'<br/>'+
								gdpr_chapter_2bl_email+'</p>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_3+'</h5>'+
						'<p>'+gdpr_chapter_3a+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_4+'</h5>'+
						'<p>'+gdpr_chapter_4a+'</p>'+
						'<p>'+gdpr_chapter_4b+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_5+'</h5>'+
						'<p>'+gdpr_chapter_5a+'</p>'+
						'<p>'+gdpr_chapter_5b+'</p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_5ba+'</span></label></p>'+
						'<p style="padding-left:64px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_5baa+'</span></label></p>'+
						'<p style="padding-left:64px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_5bab+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_5bb+'</span></label></p>'+
						'<p style="padding-left:64px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_5bba+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" checked="checked" /><span style="color:#000;">'+gdpr_chapter_5bc+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_5bd+'</span></label></p>'+
						'<p>'+gdpr_chapter_5b_sup+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_6+'</h5>'+
						'<p>'+gdpr_chapter_6a+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_7+'</h5>'+
						'<p>'+gdpr_chapter_7a+'</p>'+
						'<div class="row">'+
							'<div class="col s1">&nbsp;</div>'+
							'<div class="col s11">'+
								'<p>'+gdpr_chapter_7aa+'<br/>'+
								gdpr_chapter_7ab+'<br/>'+
								gdpr_chapter_7ac+'<br/>'+
								gdpr_chapter_7ad+'<br/>'+
								gdpr_chapter_7ae+'<br/>'+
								gdpr_chapter_7af+'<br/>'+
								gdpr_chapter_7ag+'<br/>'+
								gdpr_chapter_7ah+'<br/>'+
								gdpr_chapter_7ai+'<br/>'+
								gdpr_chapter_7aj+'<br/>'+
								gdpr_chapter_7ak+'<br/>'+
								gdpr_chapter_7al+'<br/>'+
								gdpr_chapter_7am+'</p>'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_8+'</h5>'+
						'<p>'+gdpr_chapter_8a+'</p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" checked="checked" /><span style="color:#000;">'+gdpr_chapter_8aa+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_8ab+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_8ac+'</span></label></p>'+
						'<p style="padding-left:64px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_8ba+'</span></label></p>'+
						'<p style="padding-left:64px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_8bb+'</span></label></p>'+
						'<p style="padding-left:64px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_8bc+'</span></label></p>'+
						'<p style="padding-left:64px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_8bd+'</span></label></p>'+
						'<p style="padding-left:64px;color:#9e9e9e;">'+gdpr_chapter_8be+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_9+'</h5>'+
						'<p>'+gdpr_chapter_9a+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_10+'</h5>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_10a+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" checked="checked" /><span style="color:#000;">'+gdpr_chapter_10b+'</span></label></p>'+
						'<p style="padding-left:64px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_10ba+'</span></label></p>'+
						'<p style="padding-left:64px"><label><input type="checkbox" class="filled-in" disabled="disabled" checked="checked" /><span style="color:#000;">'+gdpr_chapter_10bb+'</span></label></p>'+
						'<p style="padding-left:64px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_10bc+'</span></label></p>'+
						'<p style="padding-left:32px;">'+gdpr_chapter_10c+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_11+'</h5>'+
						'<p>'+gdpr_chapter_11a+'</p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_11aa+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" checked="checked" /><span style="color:#000;">'+gdpr_chapter_11ab+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_11ac+'</span></label></p>'+
						'<p>'+gdpr_chapter_11b+'</p>'+
						'<p>'+gdpr_chapter_11c+'</p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" checked="checked" /><span style="color:#000;">'+gdpr_chapter_11ca+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" checked="checked" /><span style="color:#000;">'+gdpr_chapter_11cb+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_11cc+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_11cd+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_11ce+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_11cf+'</span></label></p>'+
						'<p>'+gdpr_chapter_11d+'</p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" checked="checked" /><span style="color:#000;">'+gdpr_chapter_11da+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" checked="checked" /><span style="color:#000;">'+gdpr_chapter_11db+'</span></label></p>'+
						'<p style="padding-left:32px"><label><input type="checkbox" class="filled-in" disabled="disabled" /><span>'+gdpr_chapter_11dc+'</span></label></p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12">'+
						'<h5>'+gdpr_chapter_12+'</h5>'+
						'<p>'+gdpr_chapter_12a+'</p>'+
						'<p>'+gdpr_chapter_12b+'</p>'+
						'<p>'+gdpr_chapter_12c+'</p>'+
						'<p>'+gdpr_chapter_12ca+'</p>'+
						'<p>'+gdpr_chapter_12d+'</p>'+
						'<p>'+gdpr_chapter_12da+'</p>'+
						'<p>'+gdpr_chapter_12e+'</p>'+
						'<p>'+gdpr_chapter_12ea+'</p>'+
						'<p>'+gdpr_chapter_12f+'</p>'+
						'<p>'+gdpr_chapter_12fa+'</p>'+
						'<p>'+gdpr_chapter_12g+'</p>'+
						'<p>'+gdpr_chapter_12ga+'</p>'+
						'<p>'+gdpr_chapter_12h+'</p>'+
						'<p>'+gdpr_chapter_12ha+'</p>'+
						'<p>'+gdpr_chapter_12i+'</p>'+
						'<p>'+gdpr_chapter_12ia+'</p>'+
						'<p>'+gdpr_chapter_12j+'</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center" style="margin-top:16px;">'+
						'<button class="btn waves-effect waves-light" id="back">'+localized_string_ok+
							//'<i class="material-icons left">arrow_back</i>'+
						'</button>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		
		this.rendered = true;
		
		$("#back").on('click', function() {
			const caller = self.controller.models['UserGDPRModel'].caller;
			if (typeof caller !== 'undefined') {
				self.controller.models['MenuModel'].setSelected(caller);
			} else {
				self.controller.models['MenuModel'].setSelected('usersignup');
			}
		});
		
	}
}
