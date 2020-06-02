//import MenuModel from './MenuModel.js';
export default class MenuView {
	constructor(controller) {
		this.controller = controller;
		this.menuModel = controller.master.modelRepo.get('MenuModel');
		this.menuModel.subscribe(this);
		this.el = controller.el;
	}
	
	show() {
		this.render();
	}
	
	hide() {
		$(this.el).empty();
	}
	
	remove() {
		this.menuModel.unsubscribe(this);
		$(this.el).empty();
	}
	
	notify(options) {
		if (options.model==='MenuModel' && options.method==='selected') {
			console.log('MenuView MenuModel selected => set active class');
			Object.keys(this.menuModel.menuitems).forEach((key)=>{
				if (key === options.tab) {
					$('#'+key).addClass('active');
				} else {
					$('#'+key).removeClass('active');
				}
			});
		} else if (options.model==='MenuModel' && options.method==='logochanged') {
			const logo = this.menuModel.menuitems['home'].logo;
			$('#home').empty().append('<img src="'+logo+'" height="40" />');
		}
	}
	
	render() {
		$(this.el).empty();
		let html = '<div class="tab-grid">';
		Object.keys(this.menuModel.menuitems).forEach((key)=>{
			const logo = this.menuModel.menuitems[key].logo;
			if (key === 'home') {
				html += '<a href="javascript:void(0);" class="btn-flat tab-cell" id="'+key+'"><img src="'+logo+'" height="40" /></a>';
			} else {
				html += '<a href="javascript:void(0);" class="btn-flat tab-cell" id="'+key+'"><i class="small material-icons">'+logo+'</i></a>';
			}
		});
		html += '</div>';
		$(html).appendTo(this.el);
		// Initialize TAB state and click handlers.
		Object.keys(this.menuModel.menuitems).forEach((key)=>{
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
				if (this.menuModel.activeTab === key) {
					console.log('TAB is already active!');
				} else {
					this.menuModel.setSelected(key);
				}
			});
		});
	}
}
