import View from '../common/View.js';

export default class MenuView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		//this.LM = this.controller.master.modelRepo.get('LanguageModel');
		//this.LM.subscribe(this);
		
		this.FELID = 'menu-message';
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
		this.REO.unsubscribe(this);
		//this.LM.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				this.show();
				
			} 
			
			/*
			else if (options.model==='LanguageModel' && options.method==='loadTranslation') {
				if (options.status === 200) {
					// OK.
					const html = '<div class="success-message"><p>Translation loaded OK.</p></div>';
					$('#'+this.FELID).empty().append(html);
					$('#login').removeClass('disabled');
					
					// After 2 seconds remove the OK message automatically.
					setTimeout(() => $('#'+this.FELID).empty(), 2000);
					
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
				}
			}*/
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const w = this.REO.width; // We don't want scroll bars to the right or bottom of view.
		const h = this.REO.height;
		
		let footer_fontsize;
		let descr_fontsize;
		if (w <= 600) {
			footer_fontsize = '10px';
			descr_fontsize = '12px';
		} else if (w > 600 && w <= 992) {
			footer_fontsize = '12px';
			descr_fontsize = '14px';
		} else if (w > 992 && w <= 1200) {
			footer_fontsize = '14px';
			descr_fontsize = '16px';
		} else {
			footer_fontsize = '16px';
			descr_fontsize = '20px';
		}
		//const title = 'Welcome to promote short supply food chain!';
		
		const title = 'Welcome to assess business models for selling over the short food supply chain in your farm!';
		
		const descr_A = 'Decision Support Tool for producers';
		const descr_B = 'You will be able to evaluate the most suitable business models for Short Supply Food Chains.';
		const descr_C = 'Evaluations and recommendations are based on information about your farm, products and activities.';
		const footer_text = "THIS PROJECT HAS RECEIVED FUNDING FROM THE EUROPEAN UNION'S HORIZON 2020 RESEARCH AND INNOVATION PROGRAMME UNDER GRANT AGREEMENT N&deg;&nbsp;101000788";
		
		// LIGHT_GREEN:'#EEF8EB', R=238, G=248, B=235
		const frameStyle = 'padding:16px; background-color:rgba(238,248,235,0.9);border-radius:32px;border:1px solid '+this.colors.DARK_GREEN+';';
		const html = 
			// Title:
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h4 style="color:'+this.colors.DARK_ORANGE+'">'+title+'</h4>'+
					'</div>'+
				'</div>'+
			'</div>'+
			// Description:
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 hero" style="padding-top:32px;">'+
						'<div class="col s12" style="'+frameStyle+'">'+
							'<h5 style="color:'+this.colors.DARK_ORANGE+'">'+descr_A+'</h5>'+
							'<p style="color:'+this.colors.DARK_GREEN+';font-size:'+descr_fontsize+';">'+descr_B+'</p>'+
							'<p style="color:'+this.colors.DARK_GREEN+';font-size:'+descr_fontsize+';">'+descr_C+'</p>'+
						'</div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center" id="'+this.FELID+'">'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="login">Login</button>'+
					'</div>'+
				'</div>'+
			'</div>'+
			// FOOTER:
				//padding: 2em;
				//margin-top: 2em;
				//text-align: center;
				//border-top: 1px solid #0B7938;
			'<div class="row">'+
				'<div class="col s12 footer">'+
					'<div class="col s2 center">'+
						'<p><img src="./img/640px-Flag_of_Europe.svg.png" class="responsive-img"/></p>'+ // Original logo is 640 x 427 pixels.
					'</div>'+
					'<div class="col s8 center">'+
						'<p style="color:'+this.colors.DARK_GREEN+';font-size:'+footer_fontsize+';">'+footer_text+'</p>'+
					'</div>'+
					'<div class="col s2 center">'+
						'<p><img src="./img/logo2.png" class="responsive-img" /></p>'+ // Original logo is 960 x 540 pixels.
					'</div>'+
					'<div class="col s12 center">'+
						//'<p style="color:#ccc;">W='+w+'px H='+h+'px</p>'+
						'<p style="color:#ccc;">Version 22.08.16-Alfa</p>'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="input-field col s6">'+
						'<p><label><input type="checkbox" class="filled-in" id="isMockup" /><span>MOCKUP</span></label></p>'+
					'</div>'+
					'<div class="input-field col s6">'+
						'<input value="" id="user_id" type="text" class="validate">'+
						'<label class="active" for="user_id">User id:</label>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		/*
		Use version "letters":
		Alfa, Bravo, Charlie, Delta, Echo, Foxtrot, Golf, Hotel, India, Juliett, Kilo, Lima, Mike, November, 
		Oscar, Papa, Quebec, Romeo, Sierra, Tango, Uniform, Victor, Whiskey, X-ray, Yankee, Zulu.
		*/
		
		const UM = this.controller.master.modelRepo.get('UserModel');
		//const CM = this.controller.master.modelRepo.get('CountriesModel');
		//const RM = this.controller.master.modelRepo.get('RegionsModel');
		
		$("#user_id").val(UM.id);
		
		if (UM.MOCKUP) {
			$("#isMockup").prop("checked", true);
		} else {
			$("#isMockup").prop("checked", false);
		}
		
		//$('#login').addClass('disabled');
		//this.LM.loadTranslation('en');
		
		// Test language change.
		/*
		$("#isMockup").change(function() {
			if(this.checked) {
				// NO DB.
				$('#login').addClass('disabled');
				//self.LM.MOCKUP = true;
				UM.MOCKUP = true;
				CM.MOCKUP = true;
				RM.MOCKUP = true;
				//self.LM.loadTranslation('en');
			} else {
				$('#login').addClass('disabled');
				// Try to use DB.
				//self.LM.MOCKUP = false;
				UM.MOCKUP = false;
				CM.MOCKUP = false;
				RM.MOCKUP = false;
				//self.LM.loadTranslation('en');
			}
		});*/
		
		$("#login").on('click', function() {
			/*
			const uid = $("#user_id").val();
			UM.id = uid;
			if($("#isMockup").is(':checked')) {
				self.LM.MOCKUP = true;
				UM.MOCKUP = true;
				CM.MOCKUP = true;
				RM.MOCKUP = true;
			} else {
				self.LM.MOCKUP = false;
				UM.MOCKUP = false;
				CM.MOCKUP = false;
				RM.MOCKUP = false;
			}
			self.controller.models['MenuModel'].setSelected('main');
			*/
			const uid = $("#user_id").val();
			let mockup = false;
			if($("#isMockup").is(':checked')) {
				mockup = true;
			}
			const query_string = '?userid='+uid+'&country=IE&language=en&MOCKUP='+mockup;
			window.open("http://mars1.collab-cloud.eu/agrobridges/index.html"+query_string, "_blank");
		});
		
		this.rendered = true;
	}
}
