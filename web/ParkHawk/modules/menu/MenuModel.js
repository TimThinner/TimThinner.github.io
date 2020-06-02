
import EventObserver from '../common/EventObserver.js';

export default class MenuModel extends EventObserver {
	constructor(menuitems) {
		super();
		this.menuitems = menuitems;
		this.activeTab = 'home'; // 'map', 'camera', 'info'
	}
	
	store() {
		const itemID = 'ParkhawkTabState';
		const new_status = {'activeTab':this.activeTab};
		const status = localStorage.getItem(itemID);
		if (status == null) {
			// no previous status.
			const encoded = JSON.stringify(new_status);
			localStorage.setItem(itemID, encoded);
		} else {
			// previous status exist.
			localStorage.removeItem(itemID);
			const encoded = JSON.stringify(new_status);
			localStorage.setItem(itemID, encoded);
		}
	}
	
	restore() {
		const itemID = 'ParkhawkTabState';
		
		// By default FIRST item is selected!
		this.activeTab = 'home';
		
		const status = localStorage.getItem(itemID);
		if (status == null) {
			console.log('No status stored in localStorage.');
		} else {
			// Status exist: Restore current situation from localStorage.
			const stat = JSON.parse(status);
			if (typeof stat.activeTab !== 'undefined') {
				// Make sure localStorage has valid tab!
				if (Object.keys(this.menuitems).includes(stat.activeTab)) {
					this.activeTab = stat.activeTab;
				}
			}
		}
		setTimeout(() => {
			this.notifyAll({model:'MenuModel',method:'restored',tab:this.activeTab});
		}, 100);
	}
	
	setHomeLogo(logo) {
		this.menuitems['home'].logo = logo;
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'logochanged'}), 100);
	}
	
	setSelected(tab) {
		this.activeTab = tab;
		this.store(); // Store activeTab to local storage.
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'selected',tab:tab}), 100);
	}
}
