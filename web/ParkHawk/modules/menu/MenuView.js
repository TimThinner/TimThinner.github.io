import MenuModel from './MenuModel.js';
export default class MenuView {
	constructor(controller) {
		this.controller = controller;
		this.menuModel = controller.master.modelRepo.get('MenuModel');
		this.el = controller.el;
	}
	
	hide() {
		$(this.el).empty();
	}
	
	remove() {
		$(this.el).empty();
	}
	
	activate(tab) {
		if (this.menuModel.activeTab === tab) {
			//console.log('TAB is already active!');
		} else {
			this.menuModel.activeTab = tab;
			this.menuModel.store(); // Store activeTab to local storage.
			this.menuModel.selected(tab);
			this.menuModel.menuitems.forEach((key)=>{
				if (key === tab) {
					$('#'+key).addClass('active');
				} else {
					$('#'+key).removeClass('active');
				}
			});
		}
	}
	
	render() {
		$(this.el).empty();
		let html = '<div class="tab-grid">';
		this.menuModel.menuitems.forEach((key)=>{
			// NEW: 'home', 'map', 'camera', 'info'
			if (key === 'home') {
				html += '<a href="javascript:void(0);" class="btn-flat tab-cell" id="'+key+'"><img src="./img/ParkHawkLogo.png" height="38" /></a>';
			} else {
				const icon_map = {'map':'home','camera':'camera_alt','info':'info'};
				const micon = icon_map[key];
				html += '<a href="javascript:void(0);" class="btn-flat tab-cell" id="'+key+'"><i class="small material-icons">'+micon+'</i></a>';
			}
		});
		html += '</div>';
		$(html).appendTo(this.el);
		// Initialize TAB state and click handlers.
		this.menuModel.menuitems.forEach((key)=>{
			if (key === this.menuModel.activeTab) {
				$('#'+key).addClass('active');
			} else {
				$('#'+key).removeClass('active');
			}
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
