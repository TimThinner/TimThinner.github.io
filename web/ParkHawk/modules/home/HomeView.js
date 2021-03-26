
export default class HomeView {
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.appDataModel = controller.master.modelRepo.get('AppDataModel');
		this.appDataModel.subscribe(this);
	}
	
	show() {
		this.render();
	}
	
	hide() {
		$(this.el).empty();
	}
	
	remove() {
		this.appDataModel.unsubscribe(this);
		$(this.el).empty();
	}
	
	notify(options) {
		if (options.model==='AppDataModel' && options.method==='targetselected') {
			
			Object.keys(this.appDataModel.targets).forEach(key => {
				if (key === options.target) {
					$('#'+key).addClass('active');
				} else {
					$('#'+key).removeClass('active');
				}
			});
			this.appDataModel.setHomeLogo(this.appDataModel.targets[options.target].logo);
			this.appDataModel.setSelectedTab('map');
			
		} else if (options.model==='AppDataModel' && options.method==='restored') {
			
			this.appDataModel.setHomeLogo(this.appDataModel.targets[options.target].logo);
			
		}
	}
	
	render() {
		$(this.el).empty();
		let html = '<div class="row"><div class="col s12 center"><h4>Parkkihaukka</h4>';
		html += '<p>Valitse kansallispuisto klikkaamalla puiston tunnusta.</p>';
		Object.keys(this.appDataModel.targets).forEach(key => {
			html += '<p><a href="javascript:void(0);" id="'+key+'"><img src="'+this.appDataModel.targets[key].logo+'" height="120" /></a></p>';
		});
		html += '</div></div>';
		html += '<div class="row"><div class="col s12 center"><p>&nbsp;</p><p style="color:#aaa">Copyright &copy; 2021 VTT</p></div></div>';
		$(html).appendTo(this.el);
		
		// Initialize state and click handlers.
		Object.keys(this.appDataModel.targets).forEach(key => {
			if (key === this.appDataModel.activeTarget) {
				$('#'+key).addClass('active');
			} else {
				$('#'+key).removeClass('active');
			}
			// Set up the click handler.
			// It seems that for some mobile devices, the 'click'-handling is not enough to 
			// capture same effect as with mouse events on laptop and desktop. But fortunately 
			// it also seems that adding 'touchstart' is sufficient to capture tap on mobile browsers.
			$("#"+key).on('click touchstart',()=>{  // 'click touchstart'
				this.appDataModel.setSelectedTarget(key);
			});
		});
	}
}
