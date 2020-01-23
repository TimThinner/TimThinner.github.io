/*

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/super
super([arguments]); // calls the parent constructor.
super.functionOnParent([arguments]);

*/
import View from '../common/View.js';
export default class DistrictAView extends View {
	
	constructor(controller) {
		super(controller);
		this.model = this.controller.master.modelRepo.get('DistrictAModel');
		this.model.subscribe(this);
		this.rendered = false;
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		this.model.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		console.log("UPDATE!");
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='DistrictAModel' && options.method==='fetched') {
				if (options.status === 200) {
					//console.log('DistrictAView => DistrictAModel fetched!');
					if (this.rendered) {
						$('#district-a-view-failure').empty();
						this.updateLatestValues();
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						$('#district-a-view-failure').empty();
						const html = '<div class="error-message"><p>'+options.message+'</p></div>';
						$(html).appendTo('#district-a-view-failure');
					} else {
						this.render();
					}
				}
			}
		}
	}
	
	addSVGEventHandlers() {
		
		$("#toggle-direction").on('click',function(){
			
			const svgObject = document.getElementById('svg-object').contentDocument;
			if (typeof svgObject !== 'undefined') {
				
				let pathElement = svgObject.getElementById('p1');
				//<text id="grid-power" x="400" y="380" font-family="Arial, Helvetica, sans-serif" font-size="42px" fill="#f00">120.0 kW</text>
				const textElement = svgObject.getElementById('grid-power');
				
				let d = pathElement.getAttributeNS(null, 'd');
				//console.log(['d=',d]);
				const head = d.slice(0,20);
				const tail = d.slice(20);
				if (head === 'M 300,400 L 1000,400') {
					// Change text GREEN and value 2.5 kW
					while (textElement.firstChild) {
						textElement.removeChild(textElement.firstChild);
					}
					var txt = document.createTextNode("2.5 kW");
					textElement.appendChild(txt);
					textElement.setAttributeNS(null, 'fill', '#0a0');
					
					const new_d = "M 1000,400 L 300,400" + tail;
					pathElement.setAttributeNS(null, 'd', new_d);
					
				} else {
					// Change text RED and value 120.0 kW
					while (textElement.firstChild) {
						textElement.removeChild(textElement.firstChild);
					}
					var txt = document.createTextNode("120.0 kW");
					textElement.appendChild(txt);
					textElement.setAttributeNS(null, 'fill', '#f00');
					
					const new_d = "M 300,400 L 1000,400" + tail;
					pathElement.setAttributeNS(null, 'd', new_d);
				}
			}
		});
	}
	
	localizeSVGTexts() {
		const svgObject = document.getElementById('svg-object').contentDocument;
		if (typeof svgObject !== 'undefined') {
			
			const LM = this.controller.master.modelRepo.get('LanguageModel');
			const sel = LM.selected;
			const localized_string = LM['translation'][sel]['SOLAR_PANELS'];
			
			const textElement = svgObject.getElementById('solar-panels');
			while (textElement.firstChild) {
				textElement.removeChild(textElement.firstChild);
			}
			var txt = document.createTextNode(localized_string);
			textElement.appendChild(txt);
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		if (this.model.ready) {
			if (this.model.errorMessage.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 center" id="district-a-view-failure">'+
							'<div class="error-message"><p>'+this.model.errorMessage+'</p></div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<p>UUPS! Something went wrong.</p>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s6 center">'+
							'<a href="javascript:void(0);" id="back" class="waves-effect waves-light btn-large"><i class="material-icons left">arrow_back</i>BACK</a>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
			} else {
				
				
				const LM = this.controller.master.modelRepo.get('LanguageModel');
				const sel = LM.selected;
				const localized_string_da_description = LM['translation'][sel]['DA_DESCRIPTION'];
				
				const html =
					'<div class="row">'+
						'<div class="col s12">'+
							'<div class="svg-landscape-container">'+
								'<object type="image/svg+xml" data="./svg/DA.svg" id="svg-object" width="100%" height="100%" class="svg-content"></object>'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center" id="district-a-view-failure"></div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 center">'+
							'<p>'+localized_string_da_description+'</p>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s6 center">'+
							//'<a href="javascript:void(0);" id="back" class="waves-effect waves-light btn-large"><i class="material-icons left">arrow_back</i>BACK</a>'+
							'<button class="btn waves-effect waves-light" id="back">BACK'+
								'<i class="material-icons left">arrow_back</i>'+
							'</button>'+
						'</div>'+
						'<div class="col s6 center">'+
							'<button class="btn waves-effect waves-light" id="toggle-direction">Toggle direction'+
								'<i class="material-icons right">send</i>'+
							'</button>'+
							//'<a id="toggle-direction" class="waves-effect waves-light btn-large">Toggle direction</a>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				// This button will be available as soon as SVG is fully loaded.
				$("#toggle-direction").prop("disabled", true);
				
				// AND WAIT for SVG object to fully load, before assigning event handlers!
				const svgObj = document.getElementById("svg-object");
				svgObj.addEventListener('load', function(){
					//setTimeout(() => self.addSVGEventHandlers(), 4000);
					self.addSVGEventHandlers();
					self.localizeSVGTexts();
					$("#toggle-direction").prop("disabled", false);
				});
			}
			$('#back').on('click',function() {
				self.controller.menuModel.setSelected('menu');
			});
			this.rendered = true;
		} else {
			//console.log('DistrictAView => render MenuModel IS NOT READY!!!!');
			// this.el = '#content'
			this.showSpinner(this.el);
		}
	}
}
