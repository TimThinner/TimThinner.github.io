/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserPageView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserPageModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		// Start listening notify -messages from ResizeEventObserver:
		this.controller.master.modelRepo.get('ResizeEventObserver').subscribe(this);
		
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
		
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserPageModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('UserPageView => UserPageModel fetched!');
					if (this.rendered) {
						$('#user-page-view-failure').empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#user-page-view-failure').empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							const html = '<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>';
							$(html).appendTo('#user-page-view-failure');
							setTimeout(() => {
								this.controller.forceLogout();
							}, 3000);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#user-page-view-failure');
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("UserPageView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}
		}
	}
	
	addSVGEventHandlers() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const logOut = svgObject.getElementById('logout');
			logOut.addEventListener("click", function(){
				
				const UM = self.controller.master.modelRepo.get('UserModel');
				if (UM) {
					UM.logout();
				}
				//if (options.model === 'UserModel' && options.method === 'logout') {
				// User is now logged out
				// This notification is already handled in MasterController, 
				// so there is really no need to do anything here!
			}, false);
			
			const back = svgObject.getElementById('back');
			back.addEventListener("click", function(){
				
				self.menuModel.setSelected('menu');
				
			}, false);
			
		} else {
			console.log("svgObject is NOT ready!");
		}
	}
	
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			
			// Use like this:
			/*
			const localized_userpage_title = LM['translation'][sel]['USER_PAGE_TITLE'];
			const localized_userpage_description = LM['translation'][sel]['USER_PAGE_DESCRIPTION'];
			const localized_userpage_bullet_1 = LM['translation'][sel]['USER_PAGE_BULLET_1'];
			const localized_userpage_bullet_2 = LM['translation'][sel]['USER_PAGE_BULLET_2'];
			const localized_userpage_bullet_3 = LM['translation'][sel]['USER_PAGE_BULLET_3'];
			
			this.fillSVGTextElement(svgObject, 'user-page-title', localized_userpage_title);
			this.fillSVGTextElement(svgObject, 'user-page-description', localized_userpage_description);
			this.fillSVGTextElement(svgObject, 'user-page-bullet-1', localized_userpage_bullet_1);
			this.fillSVGTextElement(svgObject, 'user-page-bullet-2', localized_userpage_bullet_2);
			this.fillSVGTextElement(svgObject, 'user-page-bullet-3', localized_userpage_bullet_3);
			*/
			
			
			const UM = this.controller.master.modelRepo.get('UserModel');
			if (UM) {
				const index = UM.email.indexOf('@');
				const email = UM.email.slice(0,index);
				this.fillSVGTextElement(svgObject, 'user-email', email);
			}
		}
	}
	
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			const UM = this.controller.master.modelRepo.get('UserModel')
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
			const localized_string_title = LM['translation'][sel]['USER_PAGE_TITLE'];
			//const localized_string_description = LM['translation'][sel]['USER_PAGE_DESCRIPTION'];
			//const localized_string_bullet_1 = LM['translation'][sel]['USER_PAGE_BULLET_1'];
			//const localized_string_bullet_2 = LM['translation'][sel]['USER_PAGE_BULLET_2'];
			//const localized_string_bullet_3 = LM['translation'][sel]['USER_PAGE_BULLET_3'];
			
			const localized_string_electricity = LM['translation'][sel]['USER_PAGE_ELECTRICITY'];
			const localized_string_heating = LM['translation'][sel]['USER_PAGE_HEATING'];
			const localized_string_water = LM['translation'][sel]['USER_PAGE_WATER'];
			const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
			const localized_string_user_email = LM['translation'][sel]['USER_EMAIL'];
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="user-page-view-failure">'+
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
				
				$('#back').on('click',function() {
					self.menuModel.setSelected('menu');
				});
				
				if (errorMessages.indexOf('Auth failed') >= 0) {
					// Show message and then FORCE LOGOUT in 3 seconds.
					$('<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>').appendTo('#user-page-view-failure');
					setTimeout(() => {
						this.controller.forceLogout();
					}, 3000);
				}
				
			} else {
				const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
				let svgFile, svgClass;
				if (mode === 'LANDSCAPE') {
					console.log('LANDSCAPE');
					svgFile = './svg/UserPageLandscape.svg';
					svgClass = 'svg-landscape-container';
				} else if (mode === 'PORTRAIT') {
					console.log('PORTRAIT');
					svgFile = './svg/UserPagePortrait.svg';
					svgClass = 'svg-portrait-container';
				} else {
					console.log('SQUARE');
					svgFile = './svg/UserPageSquare.svg';
					svgClass = 'svg-square-container';
				}
				const html =
					'<div class="row">'+
						'<div class="col s12" style="padding-left:0;padding-right:0;">'+
							'<div class="'+svgClass+'">'+
								'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="user-page-view-failure"></div>'+
					'</div>';
					
					/*
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<h4 style="text-align:center;">'+localized_string_title+
								'<img id="logout" class="logout" src="./svg/logout.svg" />'+
							'</h4>'+
							'<p style="text-align:center;">'+localized_string_user_email+': '+UM.email+'</p>'+
						'</div>'+
						'<div class="col s4 center">'+
							'<div class="mc-more-button">'+
								'<h5>'+localized_string_electricity+'</h5>'+
								'<p style="text-align:center;"><img src="./svg/electricity.svg" height="50" /></p>'+
								//'<p class="user-page-main-figure">0.25 kWh</p>'+
							'</div>'+
						'</div>'+
						'<div class="col s4 center">'+
							'<div class="mc-more-button">'+
								'<h5>'+localized_string_heating+'</h5>'+
								'<p style="text-align:center;"><img src="./svg/radiator.svg" height="50" /></p>'+
								//'<p class="user-page-main-figure">22.4 &degC</p>'+
							'</div>'+
						'</div>'+
						'<div class="col s4 center">'+
							'<div class="mc-more-button">'+
								'<h5>'+localized_string_water+'</h5>'+
								'<p style="text-align:center;"><img src="./svg/water.svg" height="50" /></p>'+
								//'<p class="user-page-main-figure"><img src="./svg/watercold.svg" height="32" />20 L<br/>'+
								//'<img src="./svg/waterhot.svg" height="32" />40 L</p>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+ // style="margin-top:14px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="user-page-view-failure"></div>'+
					'</div>';
					*/
				$(html).appendTo(this.el);
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					
					self.addSVGEventHandlers();
					self.localizeSVGTexts();
					self.updateLatestValues();
				});
			}
			this.rendered = true;
		} else {
			console.log('UserPageView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}

/*
						'<div class="col s12">'+
							'<table class="centered">'+
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
										'<td>6.56</td>'+
										'<td>0.70</td>'+
										'<td>0.87</td>'+
									'</tr>'+
									'<tr>'+
										'<td>This week</td>'+
										'<td>55.87</td>'+
										'<td>3.56</td>'+
										'<td>5.70</td>'+
									'</tr>'+
									'<tr>'+
										'<td>This month</td>'+
										'<td>64.78</td>'+
										'<td>37.78</td>'+
										'<td>212.80</td>'+
									'</tr>'+
								'</tbody>'+
							'</table>'+
						'</div>'+
*/