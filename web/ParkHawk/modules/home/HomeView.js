
export default class HomeView {
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.homeModel = controller.master.modelRepo.get('HomeModel');
		this.menuModel = controller.master.modelRepo.get('MenuModel');
	}
	
	show() {
		this.render();
	}
	
	hide() {
		$(this.el).empty();
	}
	
	remove() {
		$(this.el).empty();
	}
	
	activate(target) {
		console.log(['activate target=',target]);
		/*
		if (this.homeModel.activeTarget === target) {
			console.log('TARGET is already active!');
			
			
		} else {
			
		*/
		this.homeModel.activeTarget = target;
		this.homeModel.store(); // Store activeTarget to local storage.
		this.menuModel.setSelected('map');
	}
	
	render() {
		$(this.el).empty();
		let count = 1;
		let html = '<div class="row"><div class="col s12 center"><h4>Parkkihaukka</h4>';
		html += '<p>Valitse kansallispuisto klikkaamalla puiston tunnusta.</p>';
		Object.keys(this.homeModel.targets).forEach(key => {
			html += '<p><a href="javascript:void(0);" id="'+key+'"><img src="'+this.homeModel.targets[key].logo+'" height="300" /></a></p>';
			count++;
		});
		html += '</div></div>';
		$(html).appendTo(this.el);
		
		// Initialize state and click handlers.
		Object.keys(this.homeModel.targets).forEach(key => {
			
			//console.log(['key=',key]);
			/*
			if (key === this.homeModel.activeTarget) {
				$('#'+key).addClass('active');
			} else {
				$('#'+key).removeClass('active');
			}*/
			// Set up the click handler.
			// It seems that for some mobile devices, the 'click'-handling is not enough to 
			// capture same effect as with mouse events on laptop and desktop. But fortunately 
			// it also seems that adding 'touchstart' is sufficient to capture tap on mobile browsers.
			$("#"+key).on('click touchstart',()=>{  // 'click touchstart'
				this.activate(key);
			});
		});
		
	}
}
