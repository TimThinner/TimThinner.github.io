import View from '../common/View.js';

/*
	D3 Spider Chart Tutorial
	https://yangdanny97.github.io/blog/2019/03/01/D3-Spider-Chart
	
	Spider charts, also known as radar charts, are a type of chart that can display multiple features of each data point.
	They are similar to bar charts, except each axis extends out radially from the center of the chart.
	They can sometimes be an alternative to line charts, and are useful for overlaying and comparing data that have multiple variables.
	
	
	Three different shades of green:
	
	this.colors.LIGHT_GREEN // 
	this.colors.LIGHT_GREEN_2 // darker
	this.colors.LIGHT_GREEN_3 // more darker
	
*/

export default class AnalysisView extends View {
	
	constructor(controller) {
		super(controller);
		Object.keys(this.controller.models).forEach(key => {
			this.models[key] = this.controller.models[key];
			this.models[key].subscribe(this);
		});
		
		this.REO = this.controller.master.modelRepo.get('ResizeEventObserver');
		this.REO.subscribe(this);
		
		this.USER_MODEL = this.controller.master.modelRepo.get('UserModel');
		this.USER_MODEL.subscribe(this);
		
		this.showRecommendation = {
			"R0":{id:'show-r-0', value:true, color:this.colors.DARK_GREEN},
			"R1":{id:'show-r-1', value:true, color:this.colors.DARK_ORANGE},
			"R2":{id:'show-r-2', value:true, color:this.colors.DARK_BLUE},
			"R3":{id:'show-r-3', value:true, color:this.colors.DARK_RED}
		};
		
		// All 7 features in counter clockwise order.
		// This is the order they are processed, so that spider-dimensions are always in the same order.
		// NOTE: var_name is used here.
		this.featurez = [
			"Volume",
			"Consumer_Contact",
			"Gender_Equality",
			"Labor_Produce",
			"Carbon_Footprint",
			"Chain_Added_Value",
			"Price_Premium"
		];
		this.labelz = {}; // var_name => localized name pairs
		this.recommendationz = [];
		this.comparisonz = {};
		
		this.rendered = false;
		this.FELID = 'analysis-message';
	}
	
	show() {
		this.render();
	}
	
	hide() {
		this.rendered = false;
		$(this.el).empty();
	}
	
	remove() {
		Object.keys(this.models).forEach(key => {
			this.models[key].unsubscribe(this);
		});
		this.REO.unsubscribe(this);
		this.USER_MODEL.unsubscribe(this);
		this.rendered = false;
		$(this.el).empty();
	}
	
	setLabels() {
		this.labelz = {};
		if (this.USER_MODEL.analysisResult.diagram_dimension_labels) {
			this.USER_MODEL.analysisResult.diagram_dimension_labels.forEach(e=>{
				/* Each e has:
					{
					"var_name": "Volume",
					"title": "Volume ",
					"definition": null
					}
				*/
				this.labelz[e.var_name] = e.title;
			});
		}
	}
	
	setComparison() {
		this.comparisonz = {};
		const comp = this.USER_MODEL.analysisResult.comparison; // is a JavaScript object
		Object.keys(comp).forEach(key => {
			if (typeof this.labelz[key] !== 'undefined') {
				// This is one of the features (dimensions).
				this.comparisonz[key] = comp[key];
			}
		});
		// + extras
		this.comparisonz['business_model_title'] = comp['business_model_title'];
		this.comparisonz['sales_channel_title'] = comp['sales_channel_title'];
	}
	
	setRecommendations() {
		this.recommendationz = [];
		//this.showRecommendation = {};
		
		const colors = [
			this.colors.DARK_GREEN, // First recommendation.
			this.colors.DARK_ORANGE, // Second recommendation.
			this.colors.DARK_BLUE // Third recommendation.
		];
		// "R0":{id:'show-r-0',value:true, color:this.colors.DARK_GREEN}
		// "R1":{id:'show-r-1',value:true, color:this.colors.DARK_ORANGE}
		// "R2":{id:'show-r-2',value:true, color:this.colors.DARK_BLUE}
		this.USER_MODEL.analysisResult.recommendation.forEach((r,index) => {
			const recom = {};
			Object.keys(r).forEach(key => {
				if (typeof this.labelz[key] !== 'undefined') {
					// This is one of the features (dimensions).
					recom[key] = r[key];
				}
			});
			// + extras
			recom['business_model_title'] = r['business_model_title'];
			recom['sales_channel_title'] = r['sales_channel_title'];
			
			this.recommendationz.push(recom);
			let color = '#000000';
			if (index < 3) {
				color = colors[index];
			}
			// NOTE: set only new ones => we want to keep old "checked" values when "resize-render" is called.
			if (typeof this.showRecommendation["R"+index] === 'undefined') {
				this.showRecommendation["R"+index] = {id:'show-r-'+index, value:true, color:color};
			}
		});
	}
	
	drawSpider(name, spider_id, width, height) {
		const self = this;
		
		$('#'+spider_id).empty();
		
		const svg = d3.select('#'+spider_id);
		
		const horiz_center = width*0.5;
		const verti_center = height*0.5;
		
		const min_dim = Math.min(horiz_center, verti_center);
		
		// Make spider a litle bit smaller:
		//const range = min_dim - 0.15*min_dim;
		const range = min_dim - 0.25*min_dim;
		console.log(['range=',range,' width=',width]);
		
		let fontsize;
		if (range <= 120) {
			fontsize = 8;
		} else if (range > 120 && range <= 160) {
			fontsize = 10;
		} else if (range > 160 && range <= 200) {
			fontsize = 12;
		} else {
			fontsize = 14;
		}
		
		let data = [];
		/*
		Seven Features. Volume is at 12 o'clock, others spread evenly counter clockwise.
		But in the result they are listed in clockwise:
					"Volume": 0.2,
					"Price_Premium": 0.73,
					"Chain_Added_Value": 0.69,
					"Carbon_Footprint": 0.07,
					"Labor_Produce": 0.31,
					"Gender_Equality": 0.65,
					"Consumer_Contact": 0.4,
					
					
					"Business_Model": "Face-to-Face",
					"Sales_Channel": "On_Farm_Shop_extensive",
					"Ranking": 3,
				"Volume": 0.2,
				"Price_Premium": 0.73,
				"Chain_Added_Value": 0.69,
				"Carbon_Footprint": 0.07,
				"Labor_Produce": 0.31,
				"Gender_Equality": 0.65,
				"Consumer_Contact": 0.4,
					"business_model_title": "Face-to-Face",
					"sales_channel_title": "On-Farm Shop (extensively managed, unstaffed)"
		*/
		if (name === 'wholesale') {
			
			data.push(this.comparisonz);
			
		} else {
			this.recommendationz.forEach(r=>{
				data.push(r);
			});
		}
		//let svg = d3.select("spider").append("svg").attr("width", 600).attr("height", 600);
		//let radialScale = d3.scaleLinear().domain([0, 10]).range([0, 250]);
		let radialScale = d3.scaleLinear().domain([0, 1]).range([0, range]);
		//let ticks = [0.2, 0.4, 0.6, 0.8, 1];
		let ticks = [1, 0.8, 0.6, 0.4, 0.2];
		//draw grid lines (circles)
		ticks.forEach(t =>
			svg.append("circle")
				//.attr("cx", 300)
				//.attr("cy", 300)
				.attr("cx", horiz_center) // min_dim)
				.attr("cy", verti_center) // min_dim)
				.attr("fill", '#fff')//"#e5ecf6") // "none"
				.attr("stroke", this.colors.GREY)
				.attr("r", radialScale(t))
		);
		// draw tick labels
		// fontsize = 8,10,12,14
		ticks.forEach(t =>
			svg.append("text")
				//.attr("x", 305)
				//.attr("y", 300 - radialScale(t))
				.attr("x", horiz_center+5)
				.attr("y", verti_center - radialScale(t))
				.attr("font-size",fontsize+2)
				.text(t.toString())
		);
		//draw axis for each feature
		function angleToCoordinate(angle, value) {
			let x = Math.cos(angle) * radialScale(value);
			let y = Math.sin(angle) * radialScale(value);
			//return { "x": 300 + x, "y": 300 - y };
			return { "x": horiz_center + x, "y": verti_center - y };
		}
		for (var i = 0; i < this.featurez.length; i++) {
			let ft_name = this.featurez[i];
			let angle = (Math.PI / 2) + (2 * Math.PI * i / this.featurez.length);
			let line_coordinate = angleToCoordinate(angle, 1);//10);
			let label_coordinate = angleToCoordinate(angle, 1.1); // 10.5);
			
			// fontsize = 8,10,12,14
			
			// Label is always mapped to this.labelz[ft_name]
			const cc = this.labelz[ft_name].length;
			label_coordinate.x -= fontsize*cc/4;
			/*
			if (ft_name === 'Volume') {
				label_coordinate.x -= fontsize*3; // 6 characters
			} else if (ft_name === 'Consumer_Contact') { // 16 characters
				label_coordinate.x -= fontsize*7;
			} else if (ft_name === 'Gender_Equality') { // 15 characters
				label_coordinate.x -= fontsize*3;
			} else if (ft_name === 'Labor_Produce') { // 25 characters
				label_coordinate.x -= fontsize*8;
			} else if (ft_name === 'Carbon_Footprint') { // 22 characters
				label_coordinate.x -= fontsize*4;
			} else if (ft_name === 'Chain_Added_Value') { // 17 characters
				label_coordinate.x -= fontsize*4;
			} else if (ft_name === 'Price_Premium') { // 13 characters
				label_coordinate.x -= fontsize*3;
			}
			*/
			svg.append("line")
				.attr("x1", horiz_center)//min_dim 300)
				.attr("y1", verti_center)//min_dim 300)
				.attr("x2", line_coordinate.x)
				.attr("y2", line_coordinate.y)
				.attr("stroke", this.colors.GREY);
			svg.append("text")
				.attr("x", label_coordinate.x)
				.attr("y", label_coordinate.y)
				.attr("font-size",fontsize)
				.text(this.labelz[ft_name]); // this.labelz = {}; // var_name => localized name pairs
		}
		//drawing the line for the spider chart
		let line = d3.line().x(d => d.x).y(d => d.y);
		//get coordinates for a data point
		function getPathCoordinates(d) {
			let coordinates = [];
			for (var i = 0; i < self.featurez.length; i++) {
				let angle = (Math.PI / 2) + (2 * Math.PI * i / self.featurez.length);
				coordinates.push(angleToCoordinate(angle, d[self.featurez[i]]));
			}
			// Add also the last connecting coordinate from last point to the first point.
			coordinates.push(angleToCoordinate(Math.PI/2, d[self.featurez[0]]));
			return coordinates;
		}
		// Draw in reverse order => RANK 3 is in background and RANK 1 in foreground.
		for (let i=data.length-1; i>=0; i--) {
			// draw the path element
			// IF THE SHOW CHECKBOX is checked!!!!
			// BUT do not block the "wholesale" spider!
			if (data.length === 1 || this.showRecommendation['R'+i].value === true) {
				
				let d = data[i];
				let color;
				// Note that when we show "wholesale" spider, we do not have access to 
				// this.showRecommendation['R'+i] -object.
				if (name === 'wholesale') {
					color = this.colors.DARK_GREEN;
				} else {
					color = this.showRecommendation['R'+i].color;
				}
				let coordinates = getPathCoordinates(d);
				svg.append("path")
					.datum(coordinates)
					.attr("d", line)
					.attr("stroke-width", 2)
					.attr("stroke", color)
					.attr("fill", "none")//color)
					.attr("stroke-opacity", 1)
					.attr("opacity", 1) //0.5);
			}
		}
	}
	
	renderWholesaleSpider() {
		$('#wholesale-spider-wrapper').empty();
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		
		let width = w*0.5;					// 50% of width
		let height = this.REO.height*0.5;	// 50% of height
		
		if (w < 576) { // s12 => takes "whole width"  should be 601, but because we are "cropping" a little bit...
			width = w*0.9;					// 90% of width
			height = this.REO.height*0.5;	// 50% of height
		}
		
		const html = '<svg id="spider" width="'+width+'" height="'+height+'"></svg>';
		$(html).appendTo('#wholesale-spider-wrapper');
		this.drawSpider('wholesale','spider', width, height);
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				//console.log('ResizeEventObserver resize => SHOW()!');
				this.show();
				
			} else if (options.model==='UserModel' && options.method==='runAnalysis') {
				if (options.status === 200) {
					
					$('#'+this.FELID).empty();
					
					this.renderBusinessModels();
					
					this.setLabels();
					this.setComparison();
					this.setRecommendations();
					
					this.renderRecommendationsPart1Text();
					this.renderRecommendationsList();
					this.renderRecommendationsSpider();
					
					this.renderAdditionalDescriptionPart1();
					this.renderAdditionalDescriptionPart2();
					this.renderWholesaleSpider();
					this.appendAttractiveness();
					
					this.renderDimensionsCollapsible();
					this.renderDisclaimer();
					
					$('.collapsible').collapsible({
						accordion: true,
						onOpenEnd: function(el) { console.log(['open el=',el]); /*self.previewOpen=true;*/ },
						onCloseEnd: function(el) { console.log(['close el=',el]); /*self.previewOpen=false;*/ }
					});
					
					
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
				}
			}
		}
	}
	/*
			"result_text": {
				"Intro_Definition_Business_Models": "Five business models can be differentiated for the Short Food Supply Chain. These are Consumer Supported Agriculture (CSA), Face-to-Face Sales, Retail Trade, Online Trade, and Improved Logistics. They can be defined as follows:",
				"Definition_CSA": "Definition CSA: Producers and consumers have a pre-existing agreement where consumers pay an agreed membership fee or offer labour services (or both), in exchange for produce. Two sales channels of the business model are considered in the analysis: A) CSA -\u00a0 Trading working hours for a share of the harvest, B) CSA - Subscription - payment of an annual fee for a share of the harvest",
				"Definition_Face_2_Face": "Definition Face-to-Face Trade: Consumer purchases a product directly from the producer/processor on a face-to-face basis.\u00a0Three sales channels of the business model are considered in the analysis: A) Farm shops, B) Farmers markets, C) Pick your own",
				"Definition_Online_Trade": "Definition Online Trade: Products are traded online using websites of farmers or shared marketing websites.\u00a0We consider two different sales channels: A) Online Food Trade - Post box delivery, B) Online Food Trade - Box scheme subscription & Direct Delivery",
				"Definition_Retail_Trade": "Definition Retail Trade: Products are produced and retailed in the specific region of production, and consumers are made aware of the \u2018local\u2019 nature of the product at the point of sale.\u00a0The sales channels considered in the analysis is: Retail Store -\u00a0 the origin is highlighted",
				"Definition_Improved_Logistics": "Definition Improved Logistics: Selling products to producers organisations, food hubs or other distributors, enables farmers to benefit from improved logistics by sharing costs and pooling resources for distribution. This way larger quantities can be sold to channels like supermarket chains. This business model is always considered to be an option and not part of the ranking procedure.",
				"More_Info_Business_Models": "More information about the five business models e.g. practice cases can be found here: Link",
				"Result1_Models_Considered": "The following business models and sales channels were considered in your analysis:",
				"How_calculated": "How where the results calculated? The ranking is based on a set of sustainability criteria. The sales channel that reaches the economic, environmental and social criteria best is considered to be the most suitable option and ranked first. The graphics show to which extent the SFSC sales channels meet the different criteria.",
				"Describtion_Spiderweb": "As you can see the SFSC enable you to reach higher prices (price premium), but they are labor-intensive (labor to produce ratio), which reduces profit and usually only enable you to sell smaller quantities (volume) in comparison to wholesale.",
				"Intro_not_all_sales_channels_con": "Not all sales channels were considered. Why? Some business models were excluded, because they were considered to be less suitable for your farm or in your region. Reasons for this are farms or regional characteristics (e.g. how attractive your region is for sales).",
				"Relative_Attractiveness": "The relative attractiveness of your region was considered to be:",
				"Suitability_farm_Characterstics": "This relative attractiveness in the model depends on the population density and the income of the inhabitants. If you would like to learn more about farms or regional characteristics, and how these affect the suitability of the business models, please follow this Link.",
				"Disclaimer_Header": "Disclaimer",
				"Disclaimer": "The success of the different business models and their associated sales channels depends on multiple factors and some of them are not considered in the model e.g. the effect of marketing or negotiation skills. Additionally, the expected sales volumes and profits are based on average values. In reality, these might vary across regions and for different products. You are, therefore, advised to make careful investment calculations, before engaging in any of the business models. The responsibility for the decision and its consequences remain with you.",
				"rank_intro1_id": "Our analysis shows that the sales channels can be ranked as follows. The most suitable channel is ranked first:",
				"rank_intro2_id": "Improved logistics is also an option for you. It is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms."
			},
	*/
	
	
	/*
			"result_text": {
				"Intro_Definition_Business_Models": "Five business models can be differentiated for the Short Food Supply Chain. These are Consumer Supported Agriculture (CSA), Face-to-Face Sales, Retail Trade, Online Trade, and Improved Logistics. They can be defined as follows:",
				"Definition_CSA": "Definition CSA: Producers and consumers have a pre-existing agreement where consumers pay an agreed membership fee or offer labour services (or both), in exchange for produce. Two sales channels of the business model are considered in the analysis: A) CSA -\u00a0 Trading working hours for a share of the harvest, B) CSA - Subscription - payment of an annual fee for a share of the harvest",
				"Definition_Face_2_Face": "Definition Face-to-Face Trade: Consumer purchases a product directly from the producer/processor on a face-to-face basis.\u00a0Three sales channels of the business model are considered in the analysis: A) Farm shops, B) Farmers markets, C) Pick your own",
				"Definition_Online_Trade": "Definition Online Trade: Products are traded online using websites of farmers or shared marketing websites.\u00a0We consider two different sales channels: A) Online Food Trade - Post box delivery, B) Online Food Trade - Box scheme subscription & Direct Delivery",
				"Definition_Retail_Trade": "Definition Retail Trade: Products are produced and retailed in the specific region of production, and consumers are made aware of the \u2018local\u2019 nature of the product at the point of sale.\u00a0The sales channels considered in the analysis is: Retail Store -\u00a0 the origin is highlighted",
				"Definition_Improved_Logistics": "Definition Improved Logistics: Selling products to producers organisations, food hubs or other distributors, enables farmers to benefit from improved logistics by sharing costs and pooling resources for distribution. This way larger quantities can be sold to channels like supermarket chains. This business model is always considered to be an option and not part of the ranking procedure.",
				"More_Info_Business_Models": "More information about the five business models e.g. practice cases can be found here: Link",
			},
	*/
	renderBusinessModels() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_title_a = LM['translation'][sel]['CSA'];
		const ll_title_b = LM['translation'][sel]['Face-to-Face'];
		const ll_title_c = LM['translation'][sel]['Online_Trade'];
		const ll_title_d = LM['translation'][sel]['Retail_Trade'];
		const ll_title_e = LM['translation'][sel]['Improved_Logistics'];
		
		if (this.USER_MODEL.analysisResult.result_text) {
			const ll_intro = this.USER_MODEL.analysisResult.result_text.Intro_Definition_Business_Models;
			const ll_def_csa = this.USER_MODEL.analysisResult.result_text.Definition_CSA;
			const ll_def_f2f = this.USER_MODEL.analysisResult.result_text.Definition_Face_2_Face;
			const ll_def_online_trade = this.USER_MODEL.analysisResult.result_text.Definition_Online_Trade;
			const ll_def_retail_trade = this.USER_MODEL.analysisResult.result_text.Definition_Retail_Trade;
			const ll_def_improved_logistics = this.USER_MODEL.analysisResult.result_text.Definition_Improved_Logistics;
			const ll_def_more_info = this.USER_MODEL.analysisResult.result_text.More_Info_Business_Models;
			const html = '<ul class="collapsible">'+
				'<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_title_a+'</div>'+
					'<div class="collapsible-body">'+ll_def_csa+'</div>'+
				'</li>'+
				'<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_title_b+'</div>'+
					'<div class="collapsible-body">'+ll_def_f2f+'</div>'+
				'</li>'+
				'<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_title_c+'</div>'+
					'<div class="collapsible-body">'+ll_def_online_trade+'</div>'+
				'</li>'+
				'<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_title_d+'</div>'+
					'<div class="collapsible-body">'+ll_def_retail_trade+'</span></div>'+
				'</li>'+
				'<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_title_e+'</div>'+
					'<div class="collapsible-body">'+ll_def_improved_logistics+'</span></div>'+
				'</li>'+
			'</ul>';
			
			$('#business-models-intro-wrapper').empty().append(ll_intro);
			$('#business-models-collapsible-wrapper').empty().append(html);
			$("#business-models-more-info-wrapper").empty().append(ll_def_more_info);
		}
	}
	
	
	/*
				"Result1_Models_Considered": "The following business models and sales channels were considered in your analysis:",
				"How_calculated": "How where the results calculated? The ranking is based on a set of sustainability criteria. The sales channel that reaches the economic, environmental and social criteria best is considered to be the most suitable option and ranked first. The graphics show to which extent the SFSC sales channels meet the different criteria.",
				"Describtion_Spiderweb": "As you can see the SFSC enable you to reach higher prices (price premium), but they are labor-intensive (labor to produce ratio), which reduces profit and usually only enable you to sell smaller quantities (volume) in comparison to wholesale.",
				"Intro_not_all_sales_channels_con": "Not all sales channels were considered. Why? Some business models were excluded, because they were considered to be less suitable for your farm or in your region. Reasons for this are farms or regional characteristics (e.g. how attractive your region is for sales).",
				"Relative_Attractiveness": "The relative attractiveness of your region was considered to be:",
				"Suitability_farm_Characterstics": "This relative attractiveness in the model depends on the population density and the income of the inhabitants. If you would like to learn more about farms or regional characteristics, and how these affect the suitability of the business models, please follow this Link.",
				"Disclaimer_Header": "Disclaimer",
				"Disclaimer": "The success of the different business models and their associated sales channels depends on multiple factors and some of them are not considered in the model e.g. the effect of marketing or negotiation skills. Additionally, the expected sales volumes and profits are based on average values. In reality, these might vary across regions and for different products. You are, therefore, advised to make careful investment calculations, before engaging in any of the business models. The responsibility for the decision and its consequences remain with you.",
				"rank_intro1_id": "Our analysis shows that the sales channels can be ranked as follows. The most suitable channel is ranked first:",
				"rank_intro2_id": "Improved logistics is also an option for you. It is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms."
	
	*/
	renderRecommendationsPart1Text() {
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_intro = LM['translation'][sel]['Result1_Models_Considered'];
		const ll_r1_no_suitable = LM['translation'][sel]['Results1_farms_no_suitable_channels'];
		const ll_r1_only_1_suitable = LM['translation'][sel]['Results1_only_one_channel'];
		const ll_r1_more_than_2_suitable = LM['translation'][sel]['Result_Farms_more_than_2_suitable'];
		
		const numberOfResults = this.USER_MODEL.analysisResult.recommendation.length;
		
		let html;
		
		if (numberOfResults === 0) {
			html = '<p>'+ll_intro+' '+ll_r1_no_suitable+'</p>';
			
		} else if(numberOfResults === 1) {
			html = '<p>'+ll_intro+' '+ll_r1_only_1_suitable+'</p>';
			
		} else { // Two or more...
			html = '<p>'+ll_intro+' '+ll_r1_more_than_2_suitable+'</p>';
		}
		$("#recommendations-text-part-1-wrapper").empty().append(html);
	}
	
	renderRecommendationsSpider() {
		$('#recommendations-spider-wrapper').empty();
		
		let w = this.REO.width;
		if (w > 1600) { w = 1600; }
		
		let width = w*0.5;					// 50% of width
		let height = this.REO.height*0.5;	// 50% of height
		
		if (w < 576) { // s12 => takes "whole width"  should be 601, but because we are "cropping" a little bit...
			width = w*0.9;					// 90% of width
			height = this.REO.height*0.5;	// 50% of height
		}
		
		const html = '<svg id="spider-r" width="'+width+'" height="'+height+'"></svg>';
		$(html).appendTo('#recommendations-spider-wrapper');
		
		this.drawSpider('peterparker', 'spider-r', width, height);
	}
	
	renderRecommendationsList() {
		const self = this;
		
		// Generate following HTML dynamically based on analysis recommendations:
		let html = 
			'<div class="row" style="margin-bottom:0;">'+
				'<div class="col s5">'+
					'<p style="font-weight:bold;">Sales Channel</p>'+
				'</div>'+
				'<div class="col s5">'+
					'<p style="font-weight:bold;">Business Model</p>'+
				'</div>'+
				'<div class="col s2">'+
					'<p style="font-weight:bold;">Show</p>'+
				'</div>'+
			'</div>';
		
		this.recommendationz.forEach((r,index) => {
			//r['business_model_title']
			//r['sales_channel_title']
			const id = this.showRecommendation["R"+index].id;
			let checked = '';
			if (this.showRecommendation["R"+index].value===true) {
				checked = 'checked="checked" ';
			}
			html += '<div class="row" style="margin-bottom:0;">'+
				'<div class="col s5">'+
					'<p style="color:'+this.showRecommendation["R"+index].color+'">'+r["sales_channel_title"]+'</p>'+
				'</div>'+
				'<div class="col s5">'+
					'<p style="color:'+this.showRecommendation["R"+index].color+'">'+r["business_model_title"]+'</p>'+
				'</div>'+
				'<div class="input-field col s2" style="padding-top:0">'+
					'<p><label><input type="checkbox" class="filled-in" id="'+id+'" '+checked+'/><span></span></label></p>'+
				'</div>'+
			'</div>';
		});
		$("#recommendations-list-wrapper").empty().append(html);
		
		this.USER_MODEL.analysisResult.recommendation.forEach((r,index) => {
			
			const id = this.showRecommendation["R"+index].id;
			
			$('#'+id).on('click', function(){
				if (self.showRecommendation["R"+index].value === true) {
					self.showRecommendation["R"+index].value = false;
				} else {
					self.showRecommendation["R"+index].value = true;
				}
				self.renderRecommendationsSpider();
			});
		});
	}
	
	
	renderAdditionalDescriptionPart1() {
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		
		const ll_no_suitable = LM['translation'][sel]['Results2_farm_no_suitable_Channels'];
		const ll_only_one_suitable = LM['translation'][sel]['Results2_only_one_channel'];
		const ll_more_than_2_suitable = LM['translation'][sel]['Results2_Farm_more_2_suitable'];
		
		const numberOfResults = this.USER_MODEL.analysisResult.recommendation.length;
		
		let html;
		if (numberOfResults === 0) {
			html = '<p>'+ll_no_suitable+'</p>';
			
		} else if(numberOfResults === 1) {
			html = '<p>'+ll_only_one_suitable+'</p>';
			
		} else { // Two or more...
			html = '<p>'+ll_more_than_2_suitable+'</p>';
		}
		$("#additional-description-text-part-1-wrapper").empty().append(html);
	}
	
	renderAdditionalDescriptionPart2() {
		/*
			"Description_Spiderweb_example":"You can see in example that SFSC enable you to reach higher prices (price premium), 
			but they are labor-intensive (lower labor to produce ratio), which reduces profit and usually only enable you to 
			sell smaller quantities (volume) in comparison to wholesale.",
		*/
		if (this.USER_MODEL.analysisResult.result_text) {
			const ll_dse = this.USER_MODEL.analysisResult.result_text.Describtion_Spiderweb;
			const html = '<p>'+ll_dse+'</p>';
			$("#wholesale-description-wrapper").empty().append(html);
		}
	}
	
	appendAttractiveness() {
		// To do: take result from recommendation response.
		//const result = this.USER_MODEL.analysisResult.attractiveness;
		const relative_attractiveness_text = this.USER_MODEL.analysisResult.Region_Attractiveness.Relative_Attractiveness; // "The relative attractiveness of your region was considered to be:"
		const value = this.USER_MODEL.analysisResult.Region_Attractiveness.value; // "medium"
		const html = relative_attractiveness_text+' <span style="color:'+this.colors.DARK_ORANGE+'">'+value+'</span>';
		$("#attractiveness-wrapper").empty().append(html);
	}
	
	renderDimensionsCollapsible() {
		// TODO: Also move the second collapsible to function where value are filled from the this.USER_MODEL.analysisResult.diagram_dimension_labels
		if (this.USER_MODEL.analysisResult.diagram_dimension_labels) {
			
			let html = '<ul class="collapsible">';
			this.USER_MODEL.analysisResult.diagram_dimension_labels.forEach(e=>{
				/* Each e has:
					{
						"var_name": "Volume",
						"title": "Volume ",
						"definition": null
					}
				*/
				let def = '';
				if (e.definition) {
					def = e.definition;
				}
				html += '<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+e.title+'</div>'+
					'<div class="collapsible-body">'+def+'</div>'+
				'</li>';
			});
			html += '</ul>';
			$("#dimension-collapsible-wrapper").empty().append(html);
		}
	}
	
	/*
		if (this.USER_MODEL.analysisResult.result_text) {
			const ll_dh = this.USER_MODEL.analysisResult.result_text.Disclaimer_Header
			const ll_d = this.USER_MODEL.analysisResult.result_text.Disclaimer
				"Disclaimer_Header": "Disclaimer",
				"Disclaimer": "The success of the different business models and their associated sales channels depends on multiple factors and some of them are not considered in the model e.g. the effect of marketing or negotiation skills. Additionally, the expected sales volumes and profits are based on average values. In reality, these might vary across regions and for different products. You are, therefore, advised to make careful investment calculations, before engaging in any of the business models. The responsibility for the decision and its consequences remain with you.",
	*/
	renderDisclaimer() {
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		//const sel = LM.selected;
		//const ll_d_title = LM['translation'][sel]['Disclaimer_Header'];
		//const ll_d_text = LM['translation'][sel]['Disclaimer'];
		if (this.USER_MODEL.analysisResult.result_text) {
			const ll_d_title = this.USER_MODEL.analysisResult.result_text.Disclaimer_Header;
			const ll_d_text = this.USER_MODEL.analysisResult.result_text.Disclaimer;
			const html = '<h6>'+ll_d_title+'</h6><p>'+ll_d_text+'</p>';
			$("#disclaimer-text-wrapper").empty().append(html);
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		
		const LM = this.controller.master.modelRepo.get('LanguageModel');
		const sel = LM.selected;
		const ll_intro_business_models_title = LM['translation'][sel]['Intro_Definition_Business_Models_title'];
		const ll_intro_business_models = LM['translation'][sel]['Intro_Definition_Business_Models'];
		
		const ll_recommendations_title = 'Recommendations for Short Food Supply Chain';
		const ll_improved_logistics_title = 'Improved logistics as an option for all farmers';
		const ll_comparison_to_wholesale_title = "Comparison to Wholesale";
		
		const ll_how_to_read_spiders_title = LM['translation'][sel]['Description_Spiderweb_title'];
		const ll_how_to_read_spiders_text = LM['translation'][sel]['Describtion_Spiderweb'];
		const ll_definition_criteria = LM['translation'][sel]['Definition_Criteria'];
		
		const ll_farm_and_regional_chars_title = LM['translation'][sel]['Suitability_farm_Characteristics_title'];
		const ll_farm_and_regional_chars_intro = LM['translation'][sel]['Intro_not_all_sales_channels_con'];
		const ll_farm_and_regional_chars_text = LM['translation'][sel]['Suitability_farm_Characterstics'];
		const ll_farm_and_regional_chars_more = LM['translation'][sel]['Suitability_farm_Characteristics_info'];
		
		const ll_how_calculated_title = LM['translation'][sel]['How_calculated_title'];
		const ll_how_calculated_text = LM['translation'][sel]['How_calculated'];
		
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<h3 style="color:'+this.colors.DARK_GREEN+'">ANALYSIS</h3>'+
					'</div>'+
				'</div>'+
				
				// FIRST "CHAPTER"
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_intro_business_models_title+'</h5>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="business-models-intro-wrapper"></div>'+
					'</div>'+
					'<div id="business-models-collapsible-wrapper" class="col s12 m10 offset-m1">'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="business-models-more-info-wrapper"></div>'+
					'</div>'+
				'</div>'+
				
				// SECOND "CHAPTER"
				'<div class="col s12" style="border-top: 1px solid #888; border-bottom: 1px solid #ccc; margin-top:16px; background-color:'+this.colors.LIGHT_GREEN_2+';">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_recommendations_title+'</h5>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="recommendations-text-part-1-wrapper"></div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div class="row">'+
							'<div class="col s12 m5" id="recommendations-list-wrapper">'+
							'</div>'+
							'<div class="col s12 m7" id="recommendations-spider-wrapper">'+
							'</div>'+
						'</div>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="recommendations-text-part-2-wrapper"></div>'+
					'</div>'+
				'</div>'+
				'<div class="col s12" style="border-bottom: 1px solid #ccc; background-color:'+this.colors.LIGHT_GREEN_2+';">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_improved_logistics_title+'</h5>'+
					'</div>'+
					'<div class="col s12 m10 offset-m1" >'+
						'<div id="additional-description-text-part-1-wrapper"></div>'+
					'</div>'+
				'</div>'+
				'<div class="col s12" style="border-bottom: 1px solid #888; background-color:'+this.colors.LIGHT_GREEN_2+';">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_comparison_to_wholesale_title+'</h5>'+
						'<div class="row">'+
							'<div class="col s12 m5" id="wholesale-description-wrapper">'+
							'</div>'+
							'<div class="col s12 m7" id="wholesale-spider-wrapper">'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				
				// THIRD "CHAPTER"
				
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_how_to_read_spiders_title+'</h5>'+
						'<p>'+ll_how_to_read_spiders_text+'</p>'+
						'<p>'+ll_definition_criteria+'</p>'+
					'</div>'+
					'<div id="dimension-collapsible-wrapper" class="col s12 m10 offset-m1">'+ // filled in this.renderDimensionsCollapsible();
					'</div>'+
				'</div>'+
				
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_farm_and_regional_chars_title+'</h5>'+
						'<p>'+ll_farm_and_regional_chars_intro+'</p>'+
						'<p id="attractiveness-wrapper" style="color:'+this.colors.DARK_GREEN+'; font-weight:bold;"></p>'+
						'<p>'+ll_farm_and_regional_chars_text+'</p>'+
						'<p>'+ll_farm_and_regional_chars_more+'</p>'+
					'</div>'+
				'</div>'+
				
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 style="text-align:center">'+ll_how_calculated_title+'</h5>'+
						'<p>'+ll_how_calculated_text+'</p>'+
					'</div>'+
				'</div>'+
				
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="disclaimer-text-wrapper" style="font-size:75%; color:#888; border:1px solid #888; margin-top:16px; padding:16px;"></div>'+
					'</div>'+
				'</div>'+
			'</div>'+
			
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1" id="'+this.FELID+'">'+
					'</div>'+
				'</div>'+
			'</div>'+
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center">'+
						'<button class="btn waves-effect waves-light" id="analysis-ok" style="width:120px">OK</button>'+
						'<p>&nbsp;</p>'+
					'</div>'+
				'</div>'+
			'</div>';
		$(this.el).append(html);
		
		$("#analysis-ok").on('click', function() {
			self.controller.models['MenuModel'].setSelected('main');
		});
		
		if (this.USER_MODEL.analysisReady) {
			
			this.renderBusinessModels();
			
			this.setLabels();
			this.setComparison();
			this.setRecommendations();
			
			this.renderRecommendationsPart1Text();
			this.renderRecommendationsList();
			this.renderRecommendationsSpider();
			
			this.renderAdditionalDescriptionPart1();
			this.renderAdditionalDescriptionPart2();
			this.renderWholesaleSpider();
			this.appendAttractiveness();
			
			this.renderDimensionsCollapsible();
			this.renderDisclaimer();
			
			$('.collapsible').collapsible({
				accordion: true,
				onOpenEnd: function(el) { console.log(['open el=',el]); /*self.previewOpen=true;*/ },
				onCloseEnd: function(el) { console.log(['close el=',el]); /*self.previewOpen=false;*/ }
			});
			
			
		} else {
			this.showSpinner('#recommendations-text-part-1-wrapper');
		}
		
		this.rendered = true;
	}
}
