import EventObserver from './EventObserver.js';

export default class ResizeEventObserver extends EventObserver {
	
	constructor() {
		super();
		this.resize_handler_set = false;
		this.resizeTimeout = null;
		this.SCROLLBARWIDTH = 8;
		this.mode = undefined;
		this.width = undefined;
		this.height = undefined;
	}
	
	resize() {
		const w = $(window).width();
		const h = $(window).height();
		/*
		Screen Sizes (in Materialize CSS)
		Mobile Devices		Tablet Devices		Desktop Devices		Large Desktop Devices
		<= 600px 			> 600px 			> 992px 				> 1200px
		*/
		// New implementation:
		// Notify ALWAYS, but set mode also because there are views which need to know 
		// are we in PORTRAIT, SQUARE or LADSCAPE mode (aspect ratio).
		let _mode = 'SQUARE';
		// Tolerance +-25% for square
		let diffe = 0;
		if (w > h) {
			// Maybe landscape?
			diffe = w - h;
			if (diffe > 0.25*w) {
				_mode = 'LANDSCAPE';
			}
		} else {
			// Maybe portrait?
			diffe = h - w;
			if (diffe > 0.25*h) {
				_mode = 'PORTRAIT';
			}
		}
		this.mode = _mode;
		/*
		if (w <= 600) { // Mobile Devices
			this.width = w;
			if (_mode === 'LANDSCAPE') {
				this.height = h;
			} else {
				this.height = h - this.SCROLLBARWIDTH;
			}
		} else {
			this.width = w - this.SCROLLBARWIDTH;
			this.height = h - this.SCROLLBARWIDTH;
		}*/
		this.width = w - this.SCROLLBARWIDTH;
		this.height = h - this.SCROLLBARWIDTH;
		setTimeout(() => this.notifyAll({model:'ResizeEventObserver',method:'resize',status:200,message:''}), 100);
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
	
	start() {
		const self = this;
		this.mode = undefined;
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
		this.resize(); // resize now!
	}
	
	stop() {
		if (this.resize_handler_set) {
			//console.log('unsetResizeHandler');
			$(window).off('resize');
		}
		this.resize_handler_set = false;
	}
}
