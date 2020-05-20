/*
https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);
*/
import View from '../common/View.js';

export default class UserElectricityView extends View {
	
	constructor(controller) {
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'UserElectricityModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		// Start listening notify -messages from ResizeEventObserver:
		//this.controller.master.modelRepo.get('ResizeEventObserver').subscribe(this);
		
		this.menuModel = this.controller.master.modelRepo.get('MenuModel');
		this.rendered = false;
		
		this.initialTouchPos = null;
		//this.rafPending = false;
		this.lastTouchPos = null;
		
		this.swipeHandlers = false;
		
		this.boundHandleGestureStart = evt => this.handleGestureStart(evt);
		this.boundHandleGestureMove = evt => this.handleGestureMove(evt);
		this.boundHandleGestureEnd = evt => this.handleGestureEnd(evt);
		
	}
	
	show() {
		this.render();
	}
	
	
	stopSwipeEventListeners() {
		
		console.log('STOP SWIPE EVENT LISTENERS!!!!');
		
		const ele = this.el.slice(1);
		const swipeFrontElement = document.getElementById(ele);
		if (window.PointerEvent) {
			swipeFrontElement.removeEventListener('pointerdown', this.boundHandleGestureStart, true);
			swipeFrontElement.removeEventListener('pointermove', this.boundHandleGestureMove, true);
			swipeFrontElement.removeEventListener('pointerup', this.boundHandleGestureEnd, true);
			swipeFrontElement.removeEventListener('pointercancel', this.boundHandleGestureEnd, true);
		} else {
			swipeFrontElement.removeventListener('touchstart', this.boundHandleGestureStart, true);
			swipeFrontElement.removeEventListener('touchmove', this.boundHandleGestureMove, true);
			swipeFrontElement.removeEventListener('touchend', this.boundHandleGestureEnd, true);
			swipeFrontElement.removeEventListener('touchcancel', this.boundHandleGestureEnd, true);
			// And finally the mousedown event listener.
			swipeFrontElement.removeEventListener('mousedown', this.boundHandleGestureStart, true);
		}
		this.swipeHandlers = false;
	}
	
	hide() {
		this.rendered = false;
		if (this.swipeHandlers) {
			this.stopSwipeEventListeners();
		}
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		if (this.swipeHandlers) {
			this.stopSwipeEventListeners();
		}
		$(this.el).empty();
	}
	
	updateLatestValues() {
		console.log('UPDATE UserElectricity !!!!!!!');
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='UserElectricityModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('UserElectricityView => UserElectricityModel fetched!');
					if (this.rendered) {
						$('#user-electricity-view-failure').empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#user-electricity-view-failure').empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							const html = '<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>';
							$(html).appendTo('#user-electricity-view-failure');
							setTimeout(() => {
								this.controller.forceLogout();
							}, 3000);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#user-electricity-view-failure');
						}
					} else {
						this.render();
					}
				}
			} /*else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				console.log("UserElectricityView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
			}*/
		}
	}
	
	
	
	
	
	
	
	
	// Handle the start of gestures
	handleGestureStart(evt) {
		
		function getGesturePointFromEvent(evt) {
			var point = {};
			if(evt.targetTouches) {
				// Prefer Touch Events
				point.x = evt.targetTouches[0].clientX;
				point.y = evt.targetTouches[0].clientY;
			} else {
				// Either Mouse event or Pointer Event
				point.x = evt.clientX;
				point.y = evt.clientY;
			}
			return point;
		}
		
		evt.preventDefault();
		if(evt.touches && evt.touches.length > 1) {
			return;
		}
		// Add the move and end listeners
		if (window.PointerEvent) {
			evt.target.setPointerCapture(evt.pointerId);
		} else {
			// Add Mouse Listeners
			document.addEventListener('mousemove', this.boundHandleGestureMove, true);
			document.addEventListener('mouseup', this.boundHandleGestureEnd, true);
		}
		this.initialTouchPos = getGesturePointFromEvent(evt);
		console.log(['START pos=',this.initialTouchPos]);
		//swipeFrontElement.style.transition = 'initial';
	}
	
	handleGestureMove(evt) {
		
		function getGesturePointFromEvent(evt) {
			var point = {};
			if(evt.targetTouches) {
				// Prefer Touch Events
				point.x = evt.targetTouches[0].clientX;
				point.y = evt.targetTouches[0].clientY;
			} else {
				// Either Mouse event or Pointer Event
				point.x = evt.clientX;
				point.y = evt.clientY;
			}
			return point;
		}
		
		
		evt.preventDefault();
		if(!this.initialTouchPos) {
			return;
		}
		this.lastTouchPos = getGesturePointFromEvent(evt);
		
		//console.log(['MOVE pos=',this.lastTouchPos]);
		//if(this.rafPending) {
		//	return;
		//}
		//this.rafPending = true;
		//window.requestAnimFrame(onAnimFrame);
	}
	
	handleGestureEnd(evt) {
		evt.preventDefault();
		if(evt.touches && evt.touches.length > 0) {
			return;
		}
		//this.rafPending = false;
		// Remove Event Listeners
		
		if (window.PointerEvent) {
			evt.target.releasePointerCapture(evt.pointerId);
		} else {
			// Remove Mouse Listeners
			document.removeEventListener('mousemove', this.boundHandleGestureMove, true);
			document.removeEventListener('mouseup', this.boundHandleGestureEnd, true);
		}
		//updateSwipeRestPosition();
		
		console.log(['initial=',this.initialTouchPos]);
		console.log(['END pos=',this.lastTouchPos]);
		
		if (this.initialTouchPos && this.lastTouchPos) {
			if (Math.abs(this.initialTouchPos.x - this.lastTouchPos.x) > 50) {
				console.log('BACK!!!!!');
				this.menuModel.setSelected('USERPAGE');
			}
		}
		this.initialTouchPos = null;
		this.lastTouchPos = null;
	}
	
	// Create a new function that is bound, and give it a new name
	// so that the 'this.sayHello()' call still works.
	/*
	this.boundSayHello = evt => this.sayHello(evt);
	this.elm.addEventListener('click', this.boundSayHello);
	this.elm.removeEventListener('click', this.boundSayHello);
	*/
	
	startSwipeEventListeners() {
		
		console.log('START SWIPE EVENT LISTENERS!!!!');
		
		
		// To do:
		// Think what element to use here??!!
		//
		const ele = this.el.slice(1);
		const swipeFrontElement = document.getElementById(ele);
		
		// Check if pointer events are supported.
		if (window.PointerEvent) {
			// Add Pointer Event Listener
			swipeFrontElement.addEventListener('pointerdown', this.boundHandleGestureStart, true);
			swipeFrontElement.addEventListener('pointermove', this.boundHandleGestureMove, true);
			swipeFrontElement.addEventListener('pointerup', this.boundHandleGestureEnd, true);
			swipeFrontElement.addEventListener('pointercancel', this.boundHandleGestureEnd, true);
		} else {
			// Add Touch Listener
			swipeFrontElement.addEventListener('touchstart', this.boundHandleGestureStart, true);
			swipeFrontElement.addEventListener('touchmove', this.boundHandleGestureMove, true);
			swipeFrontElement.addEventListener('touchend', this.boundHandleGestureEnd, true);
			swipeFrontElement.addEventListener('touchcancel', this.boundHandleGestureEnd, true);
			
			// Add Mouse Listener
			swipeFrontElement.addEventListener('mousedown', this.boundHandleGestureStart, true);
		}
		
		this.swipeHandlers = true;
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
			const localized_string_title = LM['translation'][sel]['USER_ELECTRICITY_TITLE'];
			const localized_string_description = LM['translation'][sel]['USER_ELECTRICITY_DESCRIPTION'];
			//const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="user-electricity-view-failure">'+
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
					$('<div class="error-message"><p>Session has expired... logging out in 3 seconds!</p></div>').appendTo('#user-electricity-view-failure');
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
						'<div class="col s12 center" id="user-electricity-view-failure"></div>'+
					'</div>';
					*/
					'<div class="row">'+
						'<div class="col s12">'+// style="padding-left:0;padding-right:0;">'+
							'<h4 style="text-align:center;">'+localized_string_title+'</h4>'+
							'<p style="text-align:center;"><img src="./svg/userpage/electricity.svg" height="80"/></p>'+
							//'<p class="coming-soon">'+localized_string_coming_soon+'</p>'+
							'<p style="text-align:center;">'+localized_string_description+'</p>'+
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
						'<div class="col s12 center" id="user-electricity-view-failure"></div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				
				
				
				
				this.startSwipeEventListeners();
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				/*const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					
					//self.addSVGEventHandlers();
					//self.localizeSVGTexts();
					//self.updateLatestValues();
					
				});*/
				
				
				/*
				if (window.PointerEvent) {
					console.log('PointerEvent is SUPPORTED!');
				} else {
					console.log('using Touch listeners!');
				}
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
			console.log('UserElectricityView => render Model IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}