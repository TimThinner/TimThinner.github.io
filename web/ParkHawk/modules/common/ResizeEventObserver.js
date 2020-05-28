import EventObserver from './EventObserver.js';

export default class ResizeEventObserver extends EventObserver {
	
	constructor() {
		super();
		this.resize_handler_set = false;
		this.resizeTimeout = null;
		this.width = undefined;
		this.height = undefined;
	}
	
	resize() {
		this.width = $(window).width();
		this.height = $(window).height();
		setTimeout(() => this.notifyAll({model:'ResizeEventObserver',method:'resize'}), 100);
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
		this.setResizeHandler();
		this.resize(); // resize now!
	}
	
	stop() {
		this.unsetResizeHandler();
	}
}
