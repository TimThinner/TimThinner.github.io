import View from '../common/View.js';

export default class CameraView extends View {
	
	constructor(controller) {
		super(controller);
		/*
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'CameraModel') {
				this.models[key] = this.controller.models[key];
				this.models[key].subscribe(this);
			}
		});
		*/
		//this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		//this.REO.subscribe(this);
		
		this.appDataModel = this.controller.master.modelRepo.get('AppDataModel');
		this.appDataModel.subscribe(this);
		
		this.rendered = false;
		this.imageLoadCount = 0;
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		/*
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});*/
		this.appDataModel.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		
		this.imageLoadCount = 0;
		const self = this;
		const yPos = window.scrollY;
		//console.log(['yPos=',yPos]);
		
		const ts = new Date().getTime();
		let urls = [];
		let i = 0;
		this.appDataModel.targets[this.appDataModel.activeTarget].cameras.forEach(cam => {
			urls[i] = cam.url + '?time=' + ts;
			i++;
		});
		i = 0;
		urls.forEach(url => {
			$('#camera-'+i).empty().append('<img class="responsive-img" id="camera-'+i+'-image" src="'+url+'" alt="" />');
			$('#camera-'+i+'-image').on('load',function() {
				self.imageLoadCount++;
				console.log(['self.imageLoadCount=',self.imageLoadCount]);
				if (self.imageLoadCount===4) {
					console.log('Scroll!');
					
					window.scroll(0, yPos);
				}
				//if ($(this).height() > 10) {
					//
				//}
				
			});
			i++;
		});
		/*
		setTimeout(() => {
			window.scroll(0, yPos);
		}, 1000);*/
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='AppDataModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('CameraView => AppDataModel fetched!');
					if (this.rendered) {
						this.updateLatestValues();
					} else {
						this.render();
					}
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const ts = new Date().getTime();
		let urls = [];
		let i = 0;
		const atarget = this.appDataModel.activeTarget;
		this.appDataModel.targets[atarget].cameras.forEach(cam => {
			urls[i] = cam.url + '?time=' + ts;
			i++;
		});
		
		const html =
			/*'<div class="row">'+
				'<div class="col s12 center">'+
					'<h4>'+atarget+' parkkipaikat</h4>'+
				'</div>'+
			'</div>'+*/
			'<div class="row">'+
				'<div class="col s12 center">'+
					'<div id="pics" style="margin-top:6px;"></div>'+
				'</div>'+
			'</div>';
		$(html).appendTo(this.el);
		i = 0;
		urls.forEach(url => {
			$('#pics').append('<div id="camera-'+i+'" style="margin:6px 0;"><img class="responsive-img" src="'+url+'" alt="" /></div>');
			i++;
		});
		this.rendered = true;
	}
}
