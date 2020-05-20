/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserWaterView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserWaterModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		// Start listening notify -messages from ResizeEventObserver:
		//this.controller.master.modelRepo.get('ResizeEventObserver').subscribe(this);
		
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
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
	
	
	updateLatestValues() {
		console.log('UPDATE UserWater !!!!!!!');
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserWaterModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('UserWaterView => UserWaterModel fetched!');
					if (this.rendered) {
						$('#user-water-view-failure').empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#user-water-view-failure').empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							const html = '<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>';
							$(html).appendTo('#user-water-view-failure');
							setTimeout(() => {
								this.controller.forceLogout();
							}, 3000);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#user-water-view-failure');
						}
					} else {
						this.render();
					}
				}
			} /*else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("UserWaterView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}*/
		}
	}
	/*
	addSVGEventHandlers() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			
			
		} else {
			console.log("svgObject is NOT ready!");
		}
	}
	*/
	/*
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			
			// Use like this:
			const localized_userhome_title = LM['translation'][sel]['USERHOME_TITLE'];
			const localized_userhome_description = LM['translation'][sel]['USERHOME_DESCRIPTION'];
			const localized_userhome_bullet_1 = LM['translation'][sel]['USERHOME_BULLET_1'];
			const localized_userhome_bullet_2 = LM['translation'][sel]['USERHOME_BULLET_2'];
			const localized_userhome_bullet_3 = LM['translation'][sel]['USERHOME_BULLET_3'];
			
			this.fillSVGTextElement(svgObject, 'user-home-title', localized_userhome_title);
			this.fillSVGTextElement(svgObject, 'user-home-description', localized_userhome_description);
			this.fillSVGTextElement(svgObject, 'user-home-bullet-1', localized_userhome_bullet_1);
			this.fillSVGTextElement(svgObject, 'user-home-bullet-2', localized_userhome_bullet_2);
			this.fillSVGTextElement(svgObject, 'user-home-bullet-3', localized_userhome_bullet_3);
			
		}
	}
	*/
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			const localized_string_title = LM['translation'][sel]['USER_WATER_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_WATER_DESCRIPTION'];
			//const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="user-water-view-failure">'+
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
					$('<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>').appendTo('#user-water-view-failure');
					setTimeout(() => {
						this.controller.forceLogout();
					}, 3000);
				}
				
			} else {
				/*const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
				let svgFile, svgClass;
				if (mode === 'LANDSCAPE') {
					console.log('LANDSCAPE');
					svgFile = './svg/UserHomeLandscape.svg';
					svgClass = 'svg-landscape-container';
				} else if (mode === 'PORTRAIT') {
					console.log('PORTRAIT');
					svgFile = './svg/UserHomePortrait.svg';
					svgClass = 'svg-portrait-container';
				} else {
					console.log('SQUARE');
					svgFile = './svg/UserHomeSquare.svg';
					svgClass = 'svg-square-container';
				}*/
				const html =
					/*
					'<div class="row">'+
						'<div class="col s12" style="padding-left:0;padding-right:0;">'+
							'<div class="'+svgClass+'">'+
								'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
							'</div>'+
						'</div>'+
						'<div class="col s6 center" style="margin-top:14px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="user-water-view-failure"></div>'+
					'</div>';
					*/
					'<div class="row">'+
						'<div class="col s12">'+// style="padding-left:0;padding-right:0;">'+
							'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
							'<p style="text-align:center;"><img src="./svg/userpage/water.svg" height="80"/></p>'+
							//'<p class="coming-soon">'+localized_string_coming_soon+'</p>'+
							'<p style="text-align:center;">'+localized_string_description+'</p>'+
						'</div>'+
						'<div class="col s12" style="background-color:#fff">'+
							'<table class="centered striped">'+
								'<thead>'+
									'<tr>'+
										'<th>Period</th>'+
										//'<th><img src="./svg/userpage/waterhot.svg" height="30"/> L</th>'+
										//'<th><img src="./svg/userpage/watercold.svg" height="30"/> L</th>'+
										'<th>HOT (L)</th>'+
										'<th>COLD (L)</th>'+
										'<th>€</th>'+
										'<th>kgCO2</th>'+
									'</tr>'+
								'</thead>'+
								'<tbody>'+
									'<tr>'+
										'<td>Today</td>'+
										'<td>10.5</td>'+
										'<td>22</td>'+
										'<td>2.3</td>'+
										'<td>3.4</td>'+
									'</tr>'+
									'<tr>'+
										'<td>This week</td>'+
										'<td>123</td>'+
										'<td>400</td>'+
										'<td>19.4</td>'+
										'<td>26.1</td>'+
									'</tr>'+
									'<tr>'+
										'<td>This month</td>'+
										'<td>523</td>'+
										'<td>1621</td>'+
										'<td>51.1</td>'+
										'<td>95.3</td>'+
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
						
						'<div class="col s12 center" style="margin-top:32px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="user-water-view-failure"></div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				/*
				const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					//self.addSVGEventHandlers();
					//self.localizeSVGTexts();
					//self.updateLatestValues();
					
				});
				*/
				$('#view-charts').on('click',function() {
					console.log('VIEW CHARTS!');
					//self.menuModel.setSelected('USERPAGE');
				});
				$('#targets').on('click',function() {
					console.log('TARGETS!');
					//self.menuModel.setSelected('USERPAGE');
				});
				$('#compensate').on('click',function() {
					console.log('COMPENSATE!');
					//self.menuModel.setSelected('USERPAGE');
				});
			}
			$('#back').on('click',function() {
				
				self.menuModel.setSelected('USERPAGE');
				
			});
			this.rendered = true;
		} else {
			console.log('UserWaterView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}