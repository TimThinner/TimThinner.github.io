import View from '../common/View.js';

export default class CameraView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
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
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.rendered = false;
		$(this.el).empty();
	}
	
	updateLatestImages() {
		
		this.imageLoadCount = 0;
		const self = this;
		const yPos = window.scrollY;
		
		const ts = new Date().getTime();
		let urls = [];
		let i = 0;
		
		const ADM = this.getModel('AppDataModel');
		if (typeof ADM !== 'undefined') {
			ADM.targets[ADM.activeTarget].cameras.forEach(cam => {
				urls[i] = cam.url + '?time=' + ts;
				i++;
			});
			i = 0;
			urls.forEach(url => {
				$('#camera-'+i).empty().append('<img class="responsive-img" id="camera-'+i+'-image" src="'+url+'" alt="" />');
				$('#camera-'+i+'-image').on('load',function() {
					self.imageLoadCount++;
					console.log(['self.imageLoadCount=',self.imageLoadCount]);
					if (self.imageLoadCount === 4) {
						console.log('Scroll!');
						window.scroll(0, yPos);
					}
				});
				i++;
			});
		}
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='CameraModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('CameraView => CameraModel fetched!');
					if (this.rendered) {
						this.updateLatestImages();
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
		
		const ADM = this.getModel('AppDataModel');
		if (typeof ADM !== 'undefined') {
			ADM.targets[ADM.activeTarget].cameras.forEach(cam => {
				urls[i] = cam.url + '?time=' + ts;
				i++;
			});
			const html =
				'<div class="row">'+
					'<div class="col s12 center">'+
						'<div id="pics" style="margin-top:6px;"></div>'+
					'</div>'+
				'</div>';
			$(html).appendTo(this.el);
			if (urls.length > 0) {
				i = 0;
				urls.forEach(url => {
					$('#pics').append('<div id="camera-'+i+'" style="margin:6px 0;"><img class="responsive-img" src="'+url+'" alt="" /></div>');
					i++;
				});
			} else {
				$('#pics').append('<p class="no-items-message">Kameroita ei ole vielä asennettu.</p>');
			}
			this.rendered = true;
		}
	}
}
