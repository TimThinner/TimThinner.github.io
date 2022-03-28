export default class View {
	
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
		
		// NOTE: in styles.css background-color is '#ccc'
		this.colors = {
			SPACE_FILL:'#ccc',
			WHITE:'#fff',
			LIGHT_GREEN:'#EEF8EB',
			DARK_GREEN:'#0B7938',
			LIGHT_ORANGE: '#F4D25A',
			DARK_ORANGE:'#EF8806'
		};
	}
	
	hide() {
	
	}
	
	remove() {
	
	}
	
	areModelsReady() {
		let retval = true;
		Object.keys(this.models).forEach(key => {
			if (this.models[key].ready===true) {
				console.log(['areModelsReady key=',key,' is READY!']);
			} else {
				console.log(['areModelsReady key=',key,' is NOT READY!']);
				retval = false;
			}
		});
		return retval;
	}
	/*
		If one (or more) of the models has status 401 => returns false.
	*/
	is401Detected() {
		let retval = false;
		Object.keys(this.models).forEach(key => {
			if (this.models[key].status===401) {
				retval = true;
			}
		});
		return retval;
	}
	
	modelsErrorMessages() {
		let retval = '';
		Object.keys(this.models).forEach(key => {
			if (this.models[key].errorMessage.length > 0) {
				retval += this.models[key].errorMessage + ' ';
			}
		});
		if (retval.length > 0) {
			return retval.slice(0, -1);
		}
		return retval;
	}
	
	forceLogout(vid) {
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		//const sel = LM.selected;
		const localized_string_session_expired = 'Session has expired... logging out in 3 seconds!';//LM['translation'][sel]['SESSION_EXPIRED']; // Session has expired... logging out in 3 seconds!
		const html = '<div class="error-message"><p>'+localized_string_session_expired+'</p></div>';
		$(html).appendTo('#'+vid);
		setTimeout(() => {
			this.controller.forceLogout();
		}, 3000);
	}
	
	handleErrorMessages(FELID) {
		const errorMessages = this.modelsErrorMessages();
		if (errorMessages.length > 0) {
			const html = '<div class="error-message"><p>'+errorMessages+'</p></div>';
			$(html).appendTo('#'+FELID);
			if (this.is401Detected()) {
				// 401 Unauthorized must be caught and wired to forceLogout() action.
				// Force LOGOUT if Auth failed!
				// Show message and then FORCE LOGOUT in 3 seconds.
				this.forceLogout(FELID);
			}
		}
	}
	
	fillSVGTextElement(svgObject, id, txt) {
		const textElement = svgObject.getElementById(id);
		if (textElement) {
			while (textElement.firstChild) {
				textElement.removeChild(textElement.firstChild);
			}
			const txtnode = document.createTextNode(txt);
			textElement.appendChild(txtnode);
		}
	}
	
	showSpinner(el) {
		const html =
			'<div id="preload-spinner" style="text-align:center;"><p>&nbsp;</p>'+
				'<div class="preloader-wrapper active">'+
					'<div class="spinner-layer spinner-blue-only">'+
						'<div class="circle-clipper left">'+
							'<div class="circle"></div>'+
						'</div>'+
						'<div class="gap-patch">'+
							'<div class="circle"></div>'+
						'</div>'+
						'<div class="circle-clipper right">'+
							'<div class="circle"></div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				'<p>&nbsp;</p>'+
			'</div>';
		$(html).appendTo(el);
	}
}
