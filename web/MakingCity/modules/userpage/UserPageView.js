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
			} /*else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("UserPageView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}*/
		}
	}
	/*
	addSVGEventHandlers() {
		const self = this;
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const logOut = svgObject.getElementById('logout');
			logOut.addEventListener("click", function(){
				
				const UM = self.controller.master.modelRepo.get('UserModel')
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
	*/
	/*
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			
			// Use like this:
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
		}
	}
	*/
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.areModelsReady()) {
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="user-page-view-failure">'+
							'<div class="error-message"><p>'+errorMessages+'</p></div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s6 center">'+
							'<a href="javascript:void(0);" id="back" class="waves-effect waves-light btn-large"><i class="material-icons left">arrow_back</i>BACK</a>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				if (errorMessages.indexOf('Auth failed') >= 0) {
					// Show message and then FORCE LOGOUT in 3 seconds.
					$('<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>').appendTo('#user-page-view-failure');
					setTimeout(() => {
						this.controller.forceLogout();
					}, 3000);
				}
				
			} else {
				/*
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
				}*/
				const LM = this.controller.master.modelRepo.get('LanguageModel');
				const sel = LM.selected;
				const localized_string_da_back = LM['translation'][sel]['DA_BACK'];
				const localized_string_title = LM['translation'][sel]['USER_PAGE_TITLE'];
				const localized_string_description = LM['translation'][sel]['USER_PAGE_DESCRIPTION'];
				const localized_string_bullet_1 = LM['translation'][sel]['USER_PAGE_BULLET_1'];
				const localized_string_bullet_2 = LM['translation'][sel]['USER_PAGE_BULLET_2'];
				const localized_string_bullet_3 = LM['translation'][sel]['USER_PAGE_BULLET_3'];
				
				const localized_string_electricity = LM['translation'][sel]['USER_PAGE_ELECTRICITY'];
				const localized_string_heating = LM['translation'][sel]['USER_PAGE_HEATING'];
				const localized_string_water = LM['translation'][sel]['USER_PAGE_WATER'];
				
				const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
				const html =
				/*
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
					*/
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<h4 style="text-align:center;">'+localized_string_title+
							'<a href="javascript:void(0);" id="logout" class="logout">'+
								'<img src="./svg/logout.svg" />'+
							'</a></h4>'+
						'</div>'+
						'<div class="col s12 center">'+
							'<p class="coming-soon">'+localized_string_coming_soon+'</p>'+
							//'<p style="text-align:center;">'+localized_string_description+'</p>'+
							//'<ul style="text-align:center;"><li>'+localized_string_bullet_1+'</li>'+
							//'<li>'+localized_string_bullet_2+'</li>'+
							//'<li>'+localized_string_bullet_3+'</li></ul>'+
						'</div>'+
						'<div class="col s4 center">'+
							'<h5>'+localized_string_electricity+'</h5>'+
							'<p style="text-align:center;"><img src="./svg/electricity.svg" height="50" /></p>'+
						'</div>'+
						'<div class="col s4 center">'+
							'<h5>'+localized_string_heating+'</h5>'+
							'<p style="text-align:center;"><img src="./svg/radiator.svg" height="50" /></p>'+
						'</div>'+
						'<div class="col s4 center">'+
							'<h5>'+localized_string_water+'</h5>'+
							'<p style="text-align:center;"><img src="./svg/water.svg" height="50" /></p>'+
						'</div>'+
						'<div class="col s6 center" style="margin-top:14px;">'+
							'<button class="btn waves-effect waves-light" id="back">'+localized_string_da_back+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="grid-page-view-failure"></div>'+
					'</div>';
					
				$(html).appendTo(this.el);
				
				$('#logout').on('click',function() {
					const UM = self.controller.master.modelRepo.get('UserModel')
					if (UM) {
						UM.logout();
					}
				});
			}
			$('#back').on('click',function() {
				self.menuModel.setSelected('menu');
			});
			this.rendered = true;
		} else {
			console.log('UserPageView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}