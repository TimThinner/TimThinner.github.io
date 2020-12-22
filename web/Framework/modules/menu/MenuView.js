import MenuModel from './MenuModel.js';
import UserModel from '../user/UserModel.js';

export default class MenuView {
	constructor(controller) {
		this.controller = controller;
		this.menuModel = controller.master.modelRepo.get('MenuModel');
		this.menuModel.subscribe(this); // This View handles the "restored" and "selected" notifications.
		this.el = controller.el;
	}
	
	hide() {
		$(this.el).empty();
	}
	
	remove() {
		this.menuModel.unsubscribe(this);
		$(this.el).empty();
	}
	
	notify(options){
		console.log(['MenuView NOTIFY: model=',options.model,' method=',options.method]);
		
		if (options.model==='MenuModel' && options.method==='restored') {
			
			this.render();
			
		} else if (options.model==='MenuModel' && options.method==='selected') {
			console.log('MenuModel menu selected => store!');
			const um = this.controller.master.modelRepo.get('UserModel');
			if (um) {
				this.menuModel.store(um.id); // Store activeTab to local storage.
			}
			this.menuModel.menuitems.forEach((mi)=>{
				if (mi.key === options.tab) {
					$('#'+mi.key).addClass('active');
				} else {
					$('#'+mi.key).removeClass('active');
				}
			});
			// Now we should close the Hamburger if it is open.
			this.closeHamburger();
		}
	}
	
	activate(tab) {
		console.log(['activate tab=',tab]);
		
		if (this.menuModel.activeTab === tab) {
			console.log('TAB is already active!');
		} else {
			
			this.menuModel.setSelected(tab); // This sends notification: {model:'MenuModel',method:'selected',tab:tab}
			
		}
	}
	
	setLogoutHandler() {
		$('#logout').on('click',()=>{
			const um = this.controller.master.modelRepo.get('UserModel');
			if (um) {
				um.logout();
			}
		});
	}
	
	setLoginHandler() {
		$('#login').on('click',()=>{
			const um = this.controller.master.modelRepo.get('UserModel');
			if (um) {
				um.login();
			}
		});
	}
	closeHamburger() {
		if ($('.menu-navigation').hasClass('open')) {
			$('.menu-navigation').removeClass('open');
			$('#hamburger i').empty().append('menu');
		}
	}
	
	toggleHamburger() {
		if ($('.menu-navigation').hasClass('open')) {
			$('.menu-navigation').removeClass('open');
			$('#hamburger i').empty().append('menu');
		} else {
			$('.menu-navigation').addClass('open');
			$('#hamburger i').empty().append('close');
		}
	}
	
	setHamburgerHandler() {
		$('#hamburger').on('click',()=>{
			this.toggleHamburger();
		});
		// Initialize TAB state and click handlers.
		this.menuModel.menuitems.forEach(mi => {
			// Set up the click handler.
			// It seems that for some mobile devices, the 'click'-handling is not enough to 
			// capture same effect as with mouse events on laptop and desktop. But fortunately 
			// it also seems that adding 'touchstart' is sufficient to capture tap on mobile browsers.
			$("#"+mi.key).on('click touchstart',()=>{  // 'click touchstart'
				this.activate(mi.key);
			});
		});
	}
	
	createHamburgerHTML() {
		let html = '<div><a id="hamburger" class="hamburger" href="javascript:void(0);"><i class="small material-icons">menu</i></a></div>';
		html += '<ul class="menu-navigation">';
		this.menuModel.menuitems.forEach(mi => {
			if (this.menuModel.activeTab === mi.key) {
				html += '<li class="menu-wrapper"><a class="menu-item active" id="'+mi.key+'">'+mi.value+'</a></li>';
			} else {
				html += '<li class="menu-wrapper"><a class="menu-item" id="'+mi.key+'">'+mi.value+'</a></li>';
			}
		});
		html += '</ul>';
		return html;
	}
	/*
		<i class="material-icons">menu</i>
		<i class="material-icons">close</i>
		<i class="material-icons">person</i>
		<i class="material-icons">power_settings_new</i>
	*/
	render() {
		
		let user_is_defined = false;
		let user_is_logged_in = false;
		
		const um = this.controller.master.modelRepo.get('UserModel');
		//console.log(['um=',um]);
		if (um) {
			user_is_defined = true;
			if (um.authToken.length > 0) {
				user_is_logged_in = true;
			}
		}
		
		$(this.el).empty();
		
		let html = '<div class="nav">';
		
		//html += '<h1 class="logo"><img src="logo-rwd.svg"  alt="Fleximarex" /></h1>';
		html += '<h1 class="logo">FRWRK</h1>';
		if (user_is_defined) {
			if (user_is_logged_in) {
				// Add the Logout-button.
				html += '<div><a id="logout" class="auth-button" href="javascript:void(0);"><i class="small material-icons">power_settings_new</i></a></div>';
				// Add the Hamburger-button and menuitems.
				html += this.createHamburgerHTML();
			} else {
				html += '<div><a id="login" class="auth-button" href="javascript:void(0);"><i class="small material-icons">person</i></a></div>';
			}
		} else {
			// Add the Hamburger-button and menuitems.
			html += this.createHamburgerHTML();
		}
		html += '</div>';
		$(html).appendTo(this.el);
		
		if (user_is_defined) {
			if (user_is_logged_in) {
				this.setLogoutHandler();
				this.setHamburgerHandler();
			} else {
				this.setLoginHandler();
			}
		} else {
			this.setHamburgerHandler();
		}
	}
}
