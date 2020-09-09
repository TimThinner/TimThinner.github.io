import View from '../common/View.js';

/*
	VIEW:
	=============
	constructor(controller) {
		this.controller = controller;
		this.el = controller.el;
		this.models = {};
		
	}
	areModelsReady()
	modelsErrorMessages()
	forceLogout(vid)
	showSpinner(el)
	
	FEDVIEW:
	=============
		this.rendered = false;
		this.counter = 0;
		this.FELID = 'e-view-failure';
	hide()
	remove()
	updateLatestValues()
	notify(options)  FROM MODELS: DModel
	render()
	
*/
export default class FedView extends View {
	
	constructor(controller) {
		
		super(controller); 
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'FedModel') {
				this.models[key] = this.controller.models[key];
				console.log(['subscribe ',key,' with FedView']);
				this.models[key].subscribe(this);
			}
		});
		
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.rendered = false;
		
		this.FELID = 'e-view-failure';
	}
	
	hide() {
		
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		
		Object.keys(this.models).forEach(key => {
			console.log(['UNsubscribe ',key,' with FedView!']);
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		
		$(this.el).empty();
	}
	
	updateLatestValues() {
		// Not needed here!
		//$('#fetch-counter-value').empty().append(this.counter);
	}
	
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='FedModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('FedView => FedModel fetched!');
					this.counter++;
					
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateLatestValues();
						
						
					} else {
						this.render();
					}
				} else { // Error in fetching.
					if (this.rendered) {
						
						$('#'+this.FELID).empty();
						if (options.status === 401) {
							// This status code must be caught and wired to forceLogout() action.
							// Force LOGOUT if Auth failed!
							this.forceLogout(this.FELID);
							
						} else {
							const html = '<div class="error-message"><p>'+options.message+'</p></div>';
							$(html).appendTo('#'+this.FELID);
						}
					} else {
						this.render();
					}
				}
			} else if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				console.log('RESIZZEEEE!');
				const new_width = options.width-80;
				const new_height = options.height;
				document.getElementById('chart-1').setAttribute("width",new_width);
				document.getElementById('chart-1').setAttribute("height",new_height);
				
				$('#chart-1').empty();
				
				this.chart();
			}
		}
	}
	
	/*
	In each SVG w = window width-60 and h = window height/4.
	We can scale the apples (and bowl) according to actual window dimensions.
	We want to accommodate 7 apples => 
	 
	
	The width for each apple (using margins on both side) = W/(7+2)
	The height of each apple = 
	
	
	
	https://unpkg.com/world-atlas@1.1.4/world/110m.tsv
	https://unpkg.com/world-atlas@1.1.4/world/110m.json
	
	*/
	
	chart() {
		
		const width = this.REO.width-80;
		const height = this.REO.height*1.5;
		
		const svg = d3.select('svg#chart-1');
		
		// The Margin Convention: These 3 lines and ...
		const margin = {top:10, right:120, bottom:10, left:80};
		const innerWidth = width - margin.left - margin.right;
		const innerHeight = height - margin.top - margin.bottom;
		
		
		const treeLayout = d3.tree()  // cluster() ?
			.size([innerHeight, innerWidth]);
		
		
		// The Margin Convention: ... g-element where paths and labels are appended
		const zoomG = svg
			.attr('width',width)
			.attr('height',height)
		.append('g');
			//.attr('transform', `translate(${margin.left},${margin.top})`);
		const g = zoomG.append('g')
			.append('g')
				.attr('transform', `translate(${margin.left},${margin.top})`);
		
		
		
		svg.call(d3.zoom().on('zoom',event=>{
			//console.log('Zoom!');
			zoomG.attr('transform',event.transform);
		}));
		
		
		d3.json('./data/worldcountries.json')
		.then(data=>{
			//console.log(data);
			
			const root = d3.hierarchy(data);
			const links = treeLayout(root).links();
			const linkPathGenerator = d3.linkHorizontal()
				.x(d => d.y)
				.y(d => d.x);
			
			g.selectAll('path').data(links)
				.enter().append('path')
					.attr('class','fed-path')
					.attr('d', linkPathGenerator);
			
			g.selectAll('text').data(root.descendants())
				.enter().append('text')
					.attr('class','fed-labels')
					.attr('x', d => d.y)
					.attr('y', d => d.x)
					.attr('dy','0.32em')
					.attr('text-anchor',d=>d.children?'middle':'start')
					.attr('font-size',d=>3.25-d.depth+'em')
					.text(d => d.data.data.id);
					
			
		});
		
		
	}
	
	render() {
		$(this.el).empty();
		if (this.areModelsReady()) {
			
			//const LM = this.controller.master.modelRepo.get('LanguageModel');
			//const sel = LM.selected;
			//const localized_string_title = LM['translation'][sel]['SOLAR_PAGE_TITLE'];
			//const localized_string_description = LM['translation'][sel]['SOLAR_PAGE_DESCRIPTION'];
			//const localized_string_coming_soon = LM['translation'][sel]['COMING_SOON'];
			
			const errorMessages = this.modelsErrorMessages();
			if (errorMessages.length > 0) {
				const html =
					'<div class="row">'+
						'<div class="col s12 content" id="'+this.FELID+'">'+
							'<p class="error-message">'+errorMessages+'</p>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				if (errorMessages.indexOf('Auth failed') >= 0) {
					// Show message and then FORCE LOGOUT in 3 seconds.
					this.forceLogout(this.FELID);
				}
				
			} else {
				const width = this.REO.width-80;
				const height = this.REO.height*1.5
				const html =
					
					'<div class="row">'+
						'<div class="col s12 content">'+
							'<h3 style="text-align:center">World Countries Tree</h3>'+
						'</div>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 content" id="'+this.FELID+'"></div>'+
					'</div>'+
					'<div class="row">'+
					'<div class="col s12 center">'+
						'<svg id="chart-1" width="'+width+'" height="'+height+'"></svg>'+
					'</div>';
				$(html).appendTo(this.el);
				
				this.chart();
				
			}
			this.rendered = true;
		} else {
			console.log('FedView => render Model IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
