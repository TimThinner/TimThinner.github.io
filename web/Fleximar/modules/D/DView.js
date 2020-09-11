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
	
	DVIEW:
	=============
		this.rendered = false;
		this.counter = 0;
		this.FELID = 'd-view-failure';
	hide()
	remove()
	updateLatestValues()
	notify(options)  FROM MODELS: DModel
	render()
	
*/
export default class DView extends View {
	
	constructor(controller) {
		
		super(controller); 
		
		Object.keys(this.controller.models).forEach(key => {
			if (key === 'DModel') {
				this.models[key] = this.controller.models[key];
				console.log(['subscribe ',key,' with DView']);
				this.models[key].subscribe(this);
			}
		});
		
		// Start listening notify -messages from ResizeEventObserver:
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.rendered = false;
		this.counter = 0;
		//this.data = undefined;
		this.FELID = 'd-view-failure';
		//this.timeoutIDs = [];
	}
	
	hide() {
		
		// MUST CLEAR ALL TIMERS!!!
		/*this.timeoutIDs.forEach(timeout => {
			clearTimeout(timeout);
		});
		this.timeoutIDs = [];*/
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		
		// MUST CLEAR ALL TIMERS!!!
		/*this.timeoutIDs.forEach(timeout => {
			clearTimeout(timeout);
		});
		this.timeoutIDs = [];*/
		Object.keys(this.models).forEach(key => {
			console.log(['UNsubscribe ',key,' with DView!']);
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.rendered = false;
		this.counter = 0;
		$(this.el).empty();
	}
	
	updateLatestValues() {
		// Not needed here!
		//$('#fetch-counter-value').empty().append(this.counter);
	}
	
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='DModel' && options.method==='fetched') {
				if (options.status === 200) {
					console.log('DView => DModel fetched!');
					this.counter++;
					
					if (this.rendered) {
						$('#'+this.FELID).empty();
						this.updateLatestValues();
						this.chart();
						
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
				console.log("DView ResizeEventObserver resize!!!!!!!!!!!!!!");
				// Set SVG width and height according to new window dimensions:
				// options.width options.height
				const new_width = options.width-80;
				const new_height = options.height/4;
				
				document.getElementById('chart-1').setAttribute("width",new_width);
				document.getElementById('chart-1').setAttribute("height",new_height);
				/*
				document.getElementById('chart-2').setAttribute("width",new_width);
				document.getElementById('chart-2').setAttribute("height",new_height);
				
				document.getElementById('chart-3').setAttribute("width",new_width);
				document.getElementById('chart-3').setAttribute("height",new_height);
				*/
				
				this.chart();
				
			} else if (options.model==='DModel' && options.method==='fruit-selected') {
				
				this.chart();
				
			} else if (options.model==='DModel' && options.method==='fruit-added') {
				
				this.chart();
				
			} else if (options.model==='DModel' && options.method==='fruit-reset') {
				
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
	
	
	*/
	
	
	
	// Complete General Update Pattern
	fruitBowl(selection) { //, props) {
		//const {width, height} = props;
		
		const width = this.REO.width-80;
		const height = this.REO.height/4;
		
		const numberOfFruits = this.controller.models['DModel'].fruits.length;
		const onew = width/(numberOfFruits+2);
		const apple_r = 0.8*onew/2;
		const lemon_r = 0.7*apple_r;
		const padding = apple_r;
		
		const colorScale = d3.scaleOrdinal()
			.domain(['apple','lemon'])
			.range(['red','yellow']);
			
		const radiusScale = d3.scaleOrdinal()
			.domain(['apple','lemon'])
			.range([apple_r,lemon_r]);
		
		const xPosition = (d,i) => i*onew + onew + padding;
		
		// Singular element:
		const rect = selection.selectAll('rect').data([null]);
		rect
			.enter().append('rect')
				.attr('y',10)
				.attr('x',10)
				.attr('rx',50)
			.merge(rect)
				.attr('width',width-20)
				.attr('height',0.8*height);
		
		
		const circles = selection.selectAll('circle')
			.data(this.controller.models['DModel'].fruits, d => d.id); // d3 data join
			
		circles // Enter
			.enter().append('circle')
				.attr('cx', xPosition)
				.attr('cy', height/2)
				.attr('r',0)
				.style('cursor', 'pointer')
			.merge(circles) // Merge (Enter & Update)
				.attr('fill',d => colorScale(d.type))
				.attr('stroke-width',3)
				.attr('stroke', d => d.id === this.controller.models['DModel'].selectedFruit ? 'black' : 'none')
				
				.on('click', d => {
					const iid = d.id;
					const id = d.originalTarget.__data__.id;
					
					console.log(['iid=',iid,'id=',id]);
					
					this.controller.models['DModel'].selectFruit(id);
					
					// How to update ONLY fruitlist?
					//this.chart(width, height);
					//originalTarget
					//__data__: Object { type: "apple", id: 0.8184561889269303 }
					//console.log(id);
				})
				/*
				.on('mouseover', d => {
					const id = d.originalTarget.__data__.id;
					this.selectFruit(id);
				})
				.on('mouseout', () => {
					this.selectFruit(undefined);
				})
				*/
				.transition()
					.duration(1000)
					.attr('cx', xPosition)
					.attr('r',d => radiusScale(d.type));
		circles // Exit
			.exit()
				.transition()
					.duration(1000)
					.attr('r',0)
				.remove();
	}
	
	/*
	// Nested elements version fruitBowl!
	fruitBowlNested(selection, props) {
		// Note: if calling props has more than one property, use
		// something like this:
		//fruitBowl(selection, props) {
		const {width, height} = props;
		
		const numberOfFruits = this.controller.models['DModel'].fruits.length;
		const onew = width/(numberOfFruits+2);
		const apple_r = 0.75*onew/2;
		const lemon_r = 0.75*apple_r;
		const padding = 0.5*apple_r;
		
		let fontSize = '1.2em';
		if (width < 600) {
			fontSize = '0.75em';
		}

		const colorScale = d3.scaleOrdinal()
			.domain(['apple','lemon'])
			.range(['red','yellow']);
			
		const radiusScale = d3.scaleOrdinal()
			.domain(['apple','lemon'])
			.range([apple_r,lemon_r]);
		
		
		// Singular element:
		const bowl = selection.selectAll('rect')
			.data([null])
			.enter().append('rect')
				.attr('y',10)
				.attr('x',10)
				.attr('width',width-20)
				.attr('height',0.8*height)
				.attr('rx',50)
		
		const groups = selection.selectAll('g')
			.data(this.controller.models['DModel'].fruits); // d3 data join
		const groupsEnter = groups.enter().append('g');
		//`translate(${i*100+50},60)`
		groupsEnter
			.merge(groups) // Merge (Enter & Update)
				.attr('transform', (d,i) =>
				`translate(${i*onew + onew + padding},${height/2})`
				);
		groups.exit().remove();
		
		groupsEnter.append('circle')
			.attr('stroke','#000')
			.attr('stroke-width',2)
			.merge(groups.select('circle'))
			// Merge (Enter & Update)
				.attr('fill',d => colorScale(d.type))
				.attr('r',d => radiusScale(d.type));
		
		groupsEnter.append('text')
		.attr('style','font-size:'+fontSize)
			.merge(groups.select('text'))
			// Merge (Enter & Update)
				.text(d => d.type)
					
					.attr('class','fruit-label')
					.attr('y', 50);
	}*/
	/*
	
	TODO: Read this:
	
	https://observablehq.com/@d3/selection-join
	
	*/
	/*fruitBowlNestedTransitions(selection, props) {
		// Nested elements version fruitBowl!
		// Note: if calling props has more than one property, use
		// something like this:
		//fruitBowl(selection, props) {
		const {width, height} = props;
		
		const numberOfFruits = this.controller.models['DModel'].fruits.length;
		const onew = width/(numberOfFruits+2);
		const apple_r = 0.75*onew/2;
		const lemon_r = 0.75*apple_r;
		const padding = 0.5*apple_r;
		
		let fontSize = '1.2em';
		if (width < 600) {
			fontSize = '0.75em';
		}
		
		const colorScale = d3.scaleOrdinal()
			.domain(['apple','lemon'])
			.range(['red','yellow']);
			
		const radiusScale = d3.scaleOrdinal()
			.domain(['apple','lemon'])
			.range([apple_r,lemon_r]);
		
		// Singular element:
		const bowl = selection.selectAll('rect')
			.data([null])
			.enter().append('rect')
				.attr('y',10)
				.attr('x',10)
				.attr('width',width-20)
				.attr('height',0.8*height)
				.attr('rx',50)
		
		const groups = selection.selectAll('g').data(this.controller.models['DModel'].fruits, d => d.id); // d3 data join
		const groupsEnter = groups.enter().append('g');
		groupsEnter
			.attr('transform', (d,i) => `translate(${i*onew + onew + padding},${height/2})`)
			.attr('opacity',0)
			.merge(groups) // Merge (Enter & Update)
				.transition()
					.duration(1000)
					.attr('transform', (d,i) => `translate(${i*onew + onew + padding},${height/2})`)
					.attr('opacity',1);
		groups.exit()
			.transition()
				.duration(1000)
				.attr('opacity',0)
			.remove();
		
		const circles = groups.select('circle');
		groupsEnter.append('circle')
			.attr('r',0)
			.attr('stroke','#000')
			.attr('stroke-width',2)
			.merge(circles)
			// Merge (Enter & Update)
				.attr('fill',d => colorScale(d.type))
				.transition()
					.duration(1000)
					.attr('r',d => radiusScale(d.type));
		circles.exit()
			.transition()
				.duration(1000)
				.attr('r',0)
			.remove();
		
		const texts = groups.select('text');
		groupsEnter.append('text')
			.attr('style','font-size:'+fontSize)
			.merge(texts)
			// Merge (Enter & Update)
				.text(d => d.type)
					.attr('class','fruit-label')
					.attr('y', 50);
	}
	*/
	
	chart() {
		
		// MUST CLEAR ALL TIMERS BEFORE SETTING THEM!!!
		/*this.timeoutIDs.forEach(timeout => {
			clearTimeout(timeout);
		});*/
		
		// NOTE: If SVG content is emptied here, 
		// ALL TRANSITIONS ARE NOT VISIBLE! WE LOOSE THEM!
		// But be careful when "empty" is needed and when not!!!
		//$('#chart-1').empty();
		
		
		
		const svg1 = d3.select('svg#chart-1');
		//const svg2 = d3.select('svg#chart-2');
		//const svg3 = d3.select('svg#chart-3');
		//const data = this.data;
		//console.log(data);
		//$('#chart-1').empty();
		//$('#chart-2').empty();
		//$('#chart-3').empty();
		
		this.fruitBowl(svg1); //, {width, height});
		//this.fruitBowlNested(svg2, {width, height});
		//this.fruitBowlNestedTransitions(svg3, {width, height});
		/*
		// eat an apple
		this.timeoutIDs[0] = setTimeout(() => {
			this.fruits.pop();
			this.fruitBowl(svg1, {width, height});
			this.fruitBowlNested(svg2, {width, height});
			this.fruitBowlNestedTransitions(svg3, {width, height});
		}, 1000);
		// replace an apple with a lemon
		this.timeoutIDs[1] = setTimeout(() => {
			this.fruits[2].type = 'lemon';
			this.fruitBowl(svg1, {width, height});
			this.fruitBowlNested(svg2, {width, height});
			this.fruitBowlNestedTransitions(svg3, {width, height});
		}, 2000);
		
		// eat an apple
		this.timeoutIDs[2] = setTimeout(() => {
			fruits = fruits.filter((d,i)=> i !== 1);
			this.fruitBowl(svg1, {fruits, width, height});
			this.fruitBowlNested(svg2, {fruits, width, height});
			this.fruitBowlNestedTransitions(svg3, {fruits, width, height});
		}, 3000);
		
		// eat an apple
		this.timeoutIDs[3] = setTimeout(() => {
			fruits = fruits.filter((d,i)=> i !== 0);
			this.fruitBowl(svg1, {fruits, width, height});
			this.fruitBowlNested(svg2, {fruits, width, height});
			this.fruitBowlNestedTransitions(svg3, {fruits, width, height});
		}, 4000);
		
		// eat an apple
		this.timeoutIDs[4] = setTimeout(() => {
			fruits = fruits.filter((d,i)=> i !== 2);
			this.fruitBowl(svg1, {fruits, width, height});
			this.fruitBowlNested(svg2, {fruits, width, height});
			this.fruitBowlNestedTransitions(svg3, {fruits, width, height});
		}, 5000);
		
		// eat an apple
		this.timeoutIDs[5] = setTimeout(() => {
			fruits.pop();
			this.fruitBowl(svg1, {fruits, width, height});
			this.fruitBowlNested(svg2, {fruits, width, height});
			this.fruitBowlNestedTransitions(svg3, {fruits, width, height});
		}, 6000);*/
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
				const initial_width = this.REO.width-80;
				const initial_height = this.REO.height/4;
				
				const html =
					'<div hidden>'+
						'<span id="new-window-0">Opens in a new window</span>'+
						'<span id="new-window-1">Opens an external site</span>'+
						'<span id="new-window-2">Opens an external site in a new window</span>'+
					'</div>'+
					'<div class="row">'+
						'<div class="col s12 content">'+
							'<h3 style="text-align:center">The General Update Pattern</h3>'+
							'<p>The general update pattern is a deprecated pattern for using selection.data to update the DOM based on new data.'+
							' See <a href="https://observablehq.com/@d3/general-update-pattern" target="_blank" rel="noopener" aria-describedby="new-window-2">'+
							'&nbsp;General Update Pattern <i class="material-icons">open_in_new</i></a> to learn more.</p>'+
						'</div>'+
					'</div>'+
					
					'<svg id="chart-1" width="'+initial_width+'" height="'+initial_height+'"></svg>'+
					//'<svg id="chart-2" width="'+initial_width+'" height="'+initial_height+'"></svg>'+
					//'<svg id="chart-3" width="'+initial_width+'" height="'+initial_height+'"></svg>'+
					
					'<div class="row">'+
						'<div class="col s12 content" id="'+this.FELID+'"></div>'+
					'</div>'+
					
					'<div class="row">'+
						'<div class="col s6 content center">'+
							'<a href="javascript:void(0);" id="add-fruit" class="waves-effect waves-light btn-large"><i class="material-icons">plus_one</i>ADD FRUIT</a>'+
						'</div>'+
						'<div class="col s6 content center">'+
							'<a href="javascript:void(0);" id="reset-fruits" class="waves-effect waves-light btn-large">RESET</a>'+
						'</div>'+
					'</div>';
				$(html).appendTo(this.el);
				
				
				$('#add-fruit').on('click',()=> {
					this.controller.models['DModel'].addFruit('apple');
				});
				$('#reset-fruits').on('click',()=> {
					this.controller.models['DModel'].reset();
				});
				
				
				this.chart(); // Render the complete General Update Pattern with Apples and a Lemon.
			}
			this.rendered = true;
		} else {
			console.log('DView => render Model IS NOT READY!!!!');
			this.showSpinner(this.el);
		}
	}
}
