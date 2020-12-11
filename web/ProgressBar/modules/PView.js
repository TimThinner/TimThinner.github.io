import View from './View.js';

export default class PView extends View {
	
	constructor(controller) {
		
		super(controller);
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'PModel') {
				this.models[key] = this.controller.models[key];
				console.log(['subscribe ',key,' with PView']);
				this.models[key].subscribe(this);
			}
		});
		
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		this.rendered = false;
		this.FELID = 'view-failure';
	}
	
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			console.log(['UNsubscribe ',key,' with PView!']);
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	show() {
		this.render();
	}
	
	
	// <animate attributeType="XML" attributeName="width" from="0" to="1300" dur="3s" fill="freeze" />
	createAnimateElement() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (svgObject) {
			
			
			const start_date = this.models['PModel'].start_date.format('DD.MM.YYYY');
			const end_date = this.models['PModel'].end_date.format('DD.MM.YYYY');
			
			const alldays = this.models['PModel'].alldays;
			const nowdays = this.models['PModel'].nowdays;
			const today = this.models['PModel'].nowdate.format('DD.MM.YYYY');
			
			const percentage = nowdays*100/alldays;
			const val = percentage*645/100; // 645 => 100%
			console.log(['val=',val]);
			
			const leftdays = alldays-nowdays;
			$('#days-left').empty().append('&nbsp;'+leftdays+'&nbsp;&nbsp;');
			
			
			const rect = svgObject.getElementById('bar');
			
			const svgAnimateElement = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
			svgAnimateElement.setAttributeNS(null,'attributeName','width');
			svgAnimateElement.setAttributeNS(null,'from','0');
			svgAnimateElement.setAttributeNS(null,'to',val);
			svgAnimateElement.setAttributeNS(null,'dur','2s');
			svgAnimateElement.setAttributeNS(null,'fill','freeze');
			rect.appendChild(svgAnimateElement);
			
			const TE1 = svgObject.getElementById('percentage-value');
			while (TE1.firstChild) {
				TE1.removeChild(TE1.firstChild);
			}
			TE1.appendChild(document.createTextNode(percentage.toFixed(2) + "%"));
			
			
			const TE2 = svgObject.getElementById('all-days');
			while (TE2.firstChild) {
				TE2.removeChild(TE2.firstChild);
			}
			TE2.appendChild(document.createTextNode(alldays + " days"));
			
			const TE3 = svgObject.getElementById('now-days');
			while (TE3.firstChild) {
				TE3.removeChild(TE3.firstChild);
			}
			TE3.appendChild(document.createTextNode(nowdays + " days"));
			
			const valFix1 = (val-310).toFixed(0);
			const valFix2 = (val-300).toFixed(0);
			const group = svgObject.getElementById('now-days-group');
			const svgPathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			svgPathElement.setAttributeNS(null,'d','M-290,100 L-290,105 L-300,100 L-290,95 L-290,100 L'+
				valFix1+',100 L'+valFix1+',105 L'+valFix2+',100 L'+valFix1+',95 L'+valFix1+',100');
			svgPathElement.setAttributeNS(null,'stroke','#000');
			svgPathElement.setAttributeNS(null,'stroke-width',1);
			svgPathElement.setAttributeNS(null,'fill','none');
			svgPathElement.setAttributeNS(null,'opacity',0.5);
			group.appendChild(svgPathElement);
			
			const svgPE2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
			svgPE2.setAttributeNS(null,'d','M'+valFix2+',-50 L'+valFix2+',120');
			svgPE2.setAttributeNS(null,'stroke','#000');
			svgPE2.setAttributeNS(null,'stroke-width',1);
			svgPE2.setAttributeNS(null,'fill','none');
			svgPE2.setAttributeNS(null,'opacity',0.5);
			group.appendChild(svgPE2);
			
			let yVal = -(val-278);	// Portrait
			let xVal = 50;			// Portrait
			const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
			if (mode === 'LANDSCAPE' || mode === 'SQUARE') {
				yVal = val-480;
				xVal = 160;
			} 
			
			console.log(['xVal=',xVal,'yVal=',yVal]);
			
			const dgroup = svgObject.getElementById('dates-group');
			const svgPE3 = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
			svgPE3.setAttributeNS(null,'x',xVal);
			svgPE3.setAttributeNS(null,'y',yVal);
			svgPE3.setAttributeNS(null,'width','120px');
			svgPE3.setAttributeNS(null,'height','24px');
			
			const svgPE3Text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
			svgPE3Text.setAttributeNS(null,'font-family','Arial, Helvetica, sans-serif');
			svgPE3Text.setAttributeNS(null,'font-size','20px');
			svgPE3Text.setAttributeNS(null,'fill','#aaa');
			svgPE3Text.setAttributeNS(null,'x','50%');
			svgPE3Text.setAttributeNS(null,'y','50%');
			svgPE3Text.setAttributeNS(null,'dominant-baseline','middle');
			svgPE3Text.setAttributeNS(null,'text-anchor','middle');
			
			svgPE3Text.appendChild(document.createTextNode(today));
			svgPE3.appendChild(svgPE3Text);
			dgroup.appendChild(svgPE3);
			
			if (mode === 'LANDSCAPE' || mode === 'SQUARE') {
				//<path d="M-300,-80 L-250,-120 L-130,-120" style="stroke:#080;stroke-width:1;fill:none;opacity:0.5;" />
				const xPos1 = (val-300).toFixed(0);
				const xPos2 = (val-330).toFixed(0);
				const xPos3 = (val-440).toFixed(0);
				const svgPE4 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
				svgPE4.setAttributeNS(null,'d','M'+xPos1+',110 L'+xPos2+',140 L'+xPos3+',140');
				svgPE4.setAttributeNS(null,'stroke','#080');
				svgPE4.setAttributeNS(null,'stroke-width',1);
				svgPE4.setAttributeNS(null,'fill','none');
				svgPE4.setAttributeNS(null,'opacity',0.5);
				dgroup.appendChild(svgPE4);
				
			}
			
			
			//start_date
			//end_date
			// id=date-of-birth
			// id=date-of-retirement
			const dobElem = svgObject.getElementById('date-of-birth');
			if (dobElem) {
				while (dobElem.firstChild) {
					dobElem.removeChild(dobElem.firstChild);
				}
				const txtnode = document.createTextNode(start_date);
				dobElem.appendChild(txtnode);
			}
			const dorElem = svgObject.getElementById('date-of-retirement');
			if (dorElem) {
				while (dorElem.firstChild) {
					dorElem.removeChild(dorElem.firstChild);
				}
				const txtnode = document.createTextNode(end_date);
				dorElem.appendChild(txtnode);
			}
		}
	}
	
	updateLatestState() {
		console.log('UPDATE!');
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='PModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('PView => PModel fetched!');
					this.counter++;
					
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateLatestState();
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						
						$('#'+this.FELID).empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#'+this.FELID);
						
					} else {
						this.render();
					}
				}
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				console.log("PView ResizeEventObserver resize!!!!!!!!!!!!!!");
				this.render();
				
			}
		}
	}
	
	
	addSVGEventHandlers() {
		this.createAnimateElement();
		
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		
		if (this.areModelsReady()) {
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 content" id="'+this.FELID+'">'+
							'<p class="error-message">'+errorMessages+'</p>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
			} else {
				const mode = this.controller.master.modelRepo.get('ResizeEventObserver').mode;
				let svgFile, svgClass;
				
				if (mode === 'LANDSCAPE') {
					console.log('LANDSCAPE');
					svgFile = './svg/landscape.svg';
					svgClass = 'svg-landscape-container';
					
				} else if (mode === 'PORTRAIT') {
					console.log('PORTRAIT');
					svgFile = './svg/portrait.svg';
					svgClass = 'svg-portrait-container';
					
				} else {
					console.log('SQUARE');
					svgFile = './svg/square.svg';
					svgClass = 'svg-square-container';
				}
				const html =
					'<div class="row">'+
						'<div class="col s12">'+
							'<div class="'+svgClass+'">'+
								'<object type="image/svg+xml" data="'+svgFile+'" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12" id="'+this.FELID+'"></div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					console.log('ADD SVG EVENT HANDLERS!');
					self.addSVGEventHandlers();
				});
			}
			this.rendered = true;
			
		} else {
			console.log('PView => render Model IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
