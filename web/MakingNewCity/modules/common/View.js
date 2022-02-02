export default class View {
	
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
		
		// Swipe feature:
		this.initialTouchPos = null;
		this.lastTouchPos = null;
		this.swipeFF = undefined;
		this.swipeRW = undefined;
		// Create a new function that is bound, and give it a new name
		// so that the 'this.handleGestureStart(evt)' call still works.
		/*
		this.boundSayHello = evt => this.sayHello(evt);
		this.elm.addEventListener('click', this.boundSayHello);
		this.elm.removeEventListener('click', this.boundSayHello);
		*/
		this.boundHandleGestureStart = evt => this.handleGestureStart(evt);
		this.boundHandleGestureMove = evt => this.handleGestureMove(evt);
		this.boundHandleGestureEnd = evt => this.handleGestureEnd(evt);
	}
	
	hide() {
		if (typeof this.swipeFF !== 'undefined' || typeof this.swipeRW !== 'undefined') {
			this.stopSwipeEventListeners();
			this.swipeFF = undefined;
			this.swipeRW = undefined;
		}
	}
	
	remove() {
		if (typeof this.swipeFF !== 'undefined' || typeof this.swipeRW !== 'undefined') {
			this.stopSwipeEventListeners();
			this.swipeFF = undefined;
			this.swipeRW = undefined;
			
		}
	}
	
	areModelsReady() {
		let retval = true;
		Object.keys(this.models).forEach(key => {
			if (this.models[key].ready===false) {
				retval = false;
			}
		});
		return retval;
	}
	/*
		If one (or more) of the models has status 401 => returns false.
	*/
	is401Detected() {
		let retval = false;
		Object.keys(this.models).forEach(key => {
			if (this.models[key].status===401) {
				retval = true;
			}
		});
		return retval;
	}
	
	modelsErrorMessages() {
		let retval = '';
		Object.keys(this.models).forEach(key => {
			if (this.models[key].errorMessage.length > 0) {
				retval += this.models[key].errorMessage + ' ';
			}
		});
		if (retval.length > 0) {
			return retval.slice(0, -1);
		}
		return retval;
	}
	
	forceLogout(vid) {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_session_expired = LM['translation'][sel]['SESSION_EXPIRED']; // Session has expired... logging out in 3 seconds!
		const html = '<div class="error-message"><p>'+localized_string_session_expired+'</p></div>';
		$(html).appendTo('#'+vid);
		setTimeout(() => {
			this.controller.forceLogout();
		}, 3000);
	}
	
	handleErrorMessages(FELID) {
		const errorMessages = this.modelsErrorMessages();
		if (errorMessages.length > 0) {
			const html = '<div class="error-message"><p>'+errorMessages+'</p></div>';
			$(html).appendTo('#'+FELID);
			if (this.is401Detected()) {
				// 401 Unauthorized must be caught and wired to forceLogout() action.
				// Force LOGOUT if Auth failed!
				// Show message and then FORCE LOGOUT in 3 seconds.
				this.forceLogout(FELID);
			}
		}
	}
	
	fillSVGTextElement(svgObject, id, txt) {
		const textElement = svgObject.getElementById(id);
		if (textElement) {
			while (textElement.firstChild) {
				textElement.removeChild(textElement.firstChild);
			}
			const txtnode = document.createTextNode(txt);
			textElement.appendChild(txtnode);
		}
	}
	
	/*
		Called by views.
	*/
	handlePollingInterval(id, name) {
		const self = this;
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const localized_string_auto_update_msg_1 = LM['translation'][sel]['AUTO_UPDATE_MSG_1'];
		const localized_string_auto_update_msg_2 = LM['translation'][sel]['AUTO_UPDATE_MSG_2'];
		const localized_string_auto_update_msg_3 = LM['translation'][sel]['AUTO_UPDATE_MSG_3'];
		
		const initialPollingInterval = this.controller.getPollingInterval(name)/1000;
		$("#"+id+"-chart-refresh-interval").val(initialPollingInterval);
		if (initialPollingInterval > 0) {
			$("#"+id+"-chart-refresh-note").empty().append(localized_string_auto_update_msg_1+' '+initialPollingInterval+' '+localized_string_auto_update_msg_2);
		} else {
			$("#"+id+"-chart-refresh-note").empty().append(localized_string_auto_update_msg_3);
		}
		$("#"+id+"-chart-refresh-interval").change(function(){
			const val = $(this).val(); // "20"
			const vali = parseInt(val, 10) * 1000;
			if (vali > 0) {
				$("#"+id+"-chart-refresh-note").empty().append(localized_string_auto_update_msg_1+' '+val+' '+localized_string_auto_update_msg_2);
			} else {
				$("#"+id+"-chart-refresh-note").empty().append(localized_string_auto_update_msg_3);
			}
			self.controller.restartPollingInterval(name, vali);
		});
	}
	
	showSpinner(el) {
		const html =
			'<div id="preload-spinner" style="text-align:center;"><p>&nbsp;</p>'+
				'<div class="preloader-wrapper active">'+
					'<div class="spinner-layer spinner-blue-only">'+
						'<div class="circle-clipper left">'+
							'<div class="circle"></div>'+
						'</div>'+
						'<div class="gap-patch">'+
							'<div class="circle"></div>'+
						'</div>'+
						'<div class="circle-clipper right">'+
							'<div class="circle"></div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<p>&nbsp;</p>'+
			'</div>';
		$(html).appendTo(el);
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
	}
	
	getGesturePointFromEvent(evt) {
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
	
	// Handle the start of gestures
	handleGestureStart(evt) {
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
		this.initialTouchPos = this.getGesturePointFromEvent(evt);
		console.log(['START pos=',this.initialTouchPos]);
		//swipeFrontElement.style.transition = 'initial';
	}
	
	handleGestureMove(evt) {
		evt.preventDefault();
		if(!this.initialTouchPos) {
			return;
		}
		this.lastTouchPos = this.getGesturePointFromEvent(evt);
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
			
			if (this.initialTouchPos.x > this.lastTouchPos.x) {
				if (this.initialTouchPos.x - this.lastTouchPos.x > 50) {
					console.log('GO FORWARD!');
					if (typeof this.swipeFF !== 'undefined') {
						this.swipeFF();
					}
				}
			} else {
				if (this.lastTouchPos.x - this.initialTouchPos.x > 50) {
					console.log('GO BACK!');
					if (typeof this.swipeRW !== 'undefined') {
						this.swipeRW();
					}
				}
			}
		}
		this.initialTouchPos = null;
		this.lastTouchPos = null;
	}
	
	startSwipeEventListeners(swipeRW, swipeFF) {
		
		this.swipeRW = swipeRW; // A Callback function
		this.swipeFF = swipeFF; // A Callback function
		
		console.log('START SWIPE EVENT LISTENERS!!!!');
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
	}
}
