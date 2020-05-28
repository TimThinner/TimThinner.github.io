
import EventObserver from '../common/EventObserver.js';

export default class MenuModel extends EventObserver {
	constructor(menuitems) {
		super();
		this.menuitems = menuitems;
		this.activeTab = menuitems[0];
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
		this.activeTab = this.menuitems[0];
		
		const status = localStorage.getItem(itemID);
		if (status == null) {
			console.log('No status stored in localStorage.');
		} else {
			// Status exist: Restore current situation from localStorage.
			const stat = JSON.parse(status);
			if (typeof stat.activeTab !== 'undefined') {
				// Make sure localStorage has valid tab!
				if (this.menuitems.includes(stat.activeTab)) {
					this.activeTab = stat.activeTab;
				}
			}
		}
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'restore',status:200,message:'Menu restored.',tab:this.activeTab}), 100);
	}
	
	selected(tab) {
		this.activeTab = tab;
		setTimeout(() => this.notifyAll({model:'MenuModel',method:'selected',status:200,message:'',tab:tab}), 100);
	}
}
