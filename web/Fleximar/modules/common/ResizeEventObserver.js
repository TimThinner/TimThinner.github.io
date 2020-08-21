import EventObserver from './EventObserver.js';

export default class ResizeEventObserver extends EventObserver {
	
	constructor() {
		super();
		this.resize_handler_set = false;
		this.resizeTimeout = null;
		//this.mode = undefined;
		this.width = $(window).width();
		this.height = $(window).height();
	}
	
	resize() {
		this.width = $(window).width();
		this.height = $(window).height();
		/*
		let _mode = 'SQUARE';
		// Tolerance +-25% for square
		let diffe = 0;
		if (this.width > this.height) {
			// Maybe landscape?
			diffe = this.width - this.height;
			if (diffe > 0.25*this.width) {
				_mode = 'LANDSCAPE';
			}
		} else {
			// Maybe portrait?
			diffe = this.height - this.width;
			if (diffe > 0.25*this.height) {
				_mode = 'PORTRAIT';
			}
		}
		if (typeof this.mode === 'undefined') {
			console.log('ResizeEventObserver => FIRST TIME RENDER');
			this.mode = _mode;
			setTimeout(() => this.notifyAll({model:'ResizeEventObserver',method:'resize',status:200,message:''}), 100);
		} else {
			if (this.mode !== _mode) {
				console.log('ResizeEventObserver => MODE CHANGE RENDER');
				this.mode = _mode;
				setTimeout(() => this.notifyAll({model:'ResizeEventObserver',method:'resize',status:200,message:''}), 100);
			}
		}*/
		
		console.log('ResizeEventObserver => AFTER TIMEOUT (100ms) RENDER!');
		setTimeout(() => this.notifyAll({
			model:'ResizeEventObserver',
			method:'resize',
			width:this.width,
			height:this.height
		}), 100);
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
		//this.mode = undefined;
		this.setResizeHandler();
		this.resize(); // resize now!
	}
	
	stop() {
		this.unsetResizeHandler();
	}
}
