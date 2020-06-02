
export default class HomeView {
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.homeModel = controller.master.modelRepo.get('HomeModel');
		this.homeModel.subscribe(this);
		this.menuModel = controller.master.modelRepo.get('MenuModel');
	}
	
	show() {
		this.render();
	}
	
	hide() {
		$(this.el).empty();
	}
	
	remove() {
		this.homeModel.unsubscribe(this);
		$(this.el).empty();
	}
	
	notify(options) {
		if (options.model==='HomeModel' && options.method==='selected') {
			console.log('HomeView HomeModel selected => set active class');
			Object.keys(this.homeModel.targets).forEach(key => {
				if (key === options.target) {
					$('#'+key).addClass('active');
				} else {
					$('#'+key).removeClass('active');
				}
			});
			this.menuModel.setHomeLogo(this.homeModel.targets[options.target].logo);
			this.menuModel.setSelected('map');
			
		} else if (options.model==='HomeModel' && options.method==='restored') {
			
			this.menuModel.setHomeLogo(this.homeModel.targets[options.target].logo);
			
		}
	}
	
	render() {
		$(this.el).empty();
		let html = '<div class="row"><div class="col s12 center"><h4>Parkkihaukka</h4>';
		html += '<p>Valitse kansallispuisto klikkaamalla puiston tunnusta.</p>';
		Object.keys(this.homeModel.targets).forEach(key => {
			html += '<p><a href="javascript:void(0);" id="'+key+'"><img src="'+this.homeModel.targets[key].logo+'" height="120" /></a></p>';
		});
		html += '</div></div>';
		html += '<div class="row"><div class="col s12 center"><p>&nbsp;</p><p style="color:#aaa">Copyright &copy; 2020 VTT</div></div>';
		$(html).appendTo(this.el);
		
		// Initialize state and click handlers.
		Object.keys(this.homeModel.targets).forEach(key => {
			if (key === this.homeModel.activeTarget) {
				$('#'+key).addClass('active');
			} else {
				$('#'+key).removeClass('active');
			}
			// Set up the click handler.
			// It seems that for some mobile devices, the 'click'-handling is not enough to 
			// capture same effect as with mouse events on laptop and desktop. But fortunately 
			// it also seems that adding 'touchstart' is sufficient to capture tap on mobile browsers.
			$("#"+key).on('click touchstart',()=>{  // 'click touchstart'
				this.homeModel.setSelected(key);
			});
		});
	}
}
