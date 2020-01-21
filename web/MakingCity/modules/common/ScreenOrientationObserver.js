export default class ScreenOrientationObserver {
	
	constructor() {
		this.resize_handler_set = false;
		this.resizeTimeout      = null;
		this.mode               = undefined;
		this.observers = [];
	}
	subscribe(fn) {
		this.observers.push(fn);
	}
	unsubscribe(fn) {
		this.observers = this.observers.filter((subscriber) => subscriber !== fn);
	}
	renderAll() {
		this.observers.forEach((subscriber) => subscriber.render());
	}
	
	resize() {
		const vpw = $(window).width();
		const vph = $(window).height();
		//console.log(['W=',vpw,' H=',vph]);
		//let _mode = undefined;
		let _mode = 'SQUARE';
		// Tolerance +-25% for square
		let diffe = 0;
		if (vpw > vph) {
			// Maybe landscape?
			diffe = vpw-vph;
			if (diffe > 0.25*vpw) {
				_mode = 'LANDSCAPE';
			}
		} else {
			// Maybe portrait?
			diffe = vph-vpw;
			if (diffe > 0.25*vph) {
				_mode = 'PORTRAIT';
			}
		}
		if (typeof this.mode === 'undefined') {
			console.log('ScreenOrientationObserver => FIRST TIME RENDER');
			this.mode = _mode;
			this.renderAll(); // {mode:this.mode}
			
		} else {
			if (this.mode !== _mode) {
				console.log('ScreenOrientationObserver => MODE CHANGE RENDER');
				this.mode = _mode;
				this.renderAll(); // {mode:this.mode}
			}
		}
	}
	
	resizeThrottler() {
		// ignore resize events as long as an resize execution is in the queue
		if (!this.resizeTimeout) {
			this.resizeTimeout = setTimeout(() => {
				// The resize will execute at a rate of 5 fps
				this.resizeTimeout = null;
				this.resize();
			}, 200);
		}
	}
	
	setResizeHandler() {
		const self = this;
		// First remove handler if already set.
		if (this.resize_handler_set) {
			$(window).off('resize');
		}
		// SEE: http://www.456bereastreet.com/archive/201205/safer_event_handling_with_jquery_namespaced_events/
		//console.log('setResizeHandler ');
		$(window).on('resize', function() {
			self.resizeThrottler();
		});
		this.resize_handler_set = true;
	}
	
	unsetResizeHandler() {
		if (this.resize_handler_set) {
			//console.log('unsetResizeHandler');
			$(window).off('resize');
		}
		this.resize_handler_set = false;
	}
	
	start() {
		this.mode = undefined;
		this.setResizeHandler();
		this.resize(); // resize now!
	}
	
	stop() {
		this.unsetResizeHandler();
	}
}
