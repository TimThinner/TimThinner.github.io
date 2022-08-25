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
	
	
	
	result_text:
			"Intro_Definition_Business_Models":"Five business models can be differentiated for Short Food Supply Chains. These are Community Supported Agriculture (CSA), Face-to-Face Sales, Retail Trade, Online Trade, and Improved Logistics. They can be defined as follows:",
			"Definition_CSA":"Definition CSA: Producers and consumers have a pre-existing agreement were consumers pay an agreed membership fee or offer labour services (or both), in exchange for produce. Two sales channels of the business model are considered in the analysis: A) CSA - 'Trading working hours for a share of the harvest', B) CSA - 'Subscription - payment of an annual fee for a share of the harvest'. The products are delivered by the farmer.",
			"Definition_Face_2_Face":"Defintion Face-to-Face: 'Consumer purchases a product directly from the producer/processor on a Face-to-Face basis. Three sales channels of the business model are considered in the analysis: A) Farm shops, B) Farmers markets, C) Pick-Your-Own",
			"Definition_Online_Trade":"Definition Online-Trade: Products are traded online using the farmer’s websites or shared marketing websites. Two different sales channels are considered: A) Online Food Trade - 'Post box delivery', B) Online Food Trade - 'Box scheme subscription & Direct Delivery’",
			"Definition_Retail_Trade":"Definition Local Food / Retail Trade: Products are produced and sold in the specific region of production, and consumers are made aware of the ‘local’ nature of the product at the point of sale. The sales channel considered in the analysis is: Retail Store - ‘The origin is highlighted’",
			"Definition_Improved_Logistics":"Definition Improved Logistics: Selling products to producer organisations, food hubs or other distributors enables farmers to benefit from improved logistics by sharing costs and pooling resources for distribution. In this way, larger quantities can be sold to channels such as supermarket chains. This business model is always considered to be an option and not part of the ranking procedure.",
			"More_Info_Business_Models":"More information on the five business models can be found here: Link (to the business model canvas)",
			"Result1_Models_Considered":"The following business models and sales channels were considered in your analysis:",
			"Result_Farms_more_than_2_suitable":"Our analysis shows that the sales channels can be ranked as follows. The most suitable channel is ranked first:",
			"Results2_Farm_more_2_suitable":"Improved logistics' is also an option for you. It is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g., the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms.",
			"Results1_farms_no_suitable_channels":"Based on the characteristics of your farm non of the sales channels are considered to be an option for you. Please check the information you entered.",
			"Results2_farm_no_suitable_Channels":"If the information was correct: 'Improved Logistics' is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by larger farms. 'Improved logistics' is assumed to be suitable for all farmers regardless of their location and their production characteristics.",
			"Results1_only_one_channel":"Based on the characteristics of your farm only one of the sales channels is considered to be an option for you and no ranking is possible. This sales channel is:",
			"Results2_only_one_channel":"However, 'Improved logistics' is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g., sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms and could be interesting for you.",
			"How_calculated":"How were the results calculated?' The ranking is based on a set of sustainability criteria. The sales channel that reaches the economic, environmental and social criteria best is considered to be the most suitable option and ranked first. The graphics show to what extent the SFSC sales channels meet the different criteria. The values for the economic, environmental and social performance are not individually calculated. They are averages from data coming from 208 food producers from seven countries (six within the EU). More details about the data can be found here: Malak-Rawlikowska, A. et al. (2019): Measuring the Economic, Environmental and Social Sustainability of Short Food Supply Chains. Sustainability Vol. 11 (1). 1-23.",
			"Definition_Criteria":"Would you like to know how the criteria are defined? Please follow this Link.",
			"Intro_not_all_sales_channels_con":"Not all sales channels were considered. Why?' Some business models were excluded, because they were considered to be less suitable for your farm or region because of certain farm or regional characteristics (e.g., how attractive your region is for sales).",
			"Relative_Attractiveness":"The attractiveness of your region for sales was considered to be:",
			"Suitability_farm_Characterstics":"This relative attractiveness depends on the population density and the income of the inhabitants. This was determined on a regional level (NUTS3 areas are defined as small areas for specific diagnoses with 150,000 - 800,000 inhabitants ), we used the population densities and the income of the households to determine whether a region is more or less attractive for sales. Business models such as Community Supported Agriculture strongly depend on high population densities and might be especially suitable for organic farms. Intensively managed on-farm shops run by staff might also only be successful in areas with high income and higher population densities.",
			"Disclaimer_Header":"A Disclaimer",
			"Disclaimer":"The success of the different business models and their associated sales channels depends on multiple factors and some of them are not considered in the model e.g., the effect of marketing or negotiation skills. Additionally, the expected sales volumes and profits are based on average values. In reality, these might vary across regions and for different products. You are, therefore, advised to make careful investment calculations, before engaging in any of the business models. The responsibility for the decision and its consequences remains with you.",
			"Additional_Info_PickU":"The harvesting labour saved by Pick-Your-Own is not reflected in the Labour to Produce Ratio. The Labour to Produce Ratio only considered Labour Requirements for Sales.",
			"Describtion_Spiderweb":"How to read the diagrams? In a spider chart, each criterion gets its spoke, and the spokes are evenly distributed around the wheel. The farther toward the outside of the chart, the better a business model fulfills the criteria. A spoke close to the center means that the sales channel can only fulfill the criteria to a limited extents. You can see in example that SFSC enable you to reach higher prices (Price Premium), but they are labour-intensive (labour to produce ratio), which reduces profit and usually only enable you to sell smaller quantities (volume) in comparison to wholesale."
	
	
    "bm_definition_texts": [
        {
            "definition": "Producers and consumers have a pre-existing agreement were consumers pay an agreed membership fee or offer labour services (or both), in exchange for produce. Two sales channels of the business model are considered in the analysis: A) CSA - 'Trading working hours for a share of the harvest', B) CSA - 'Subscription - payment of an annual fee for a share of the harvest'. The products are delivered by the farmer.",
            "title": "Community Supported Agriculture",
            "var_name": "CSA"
        },
        {
            "definition": "Consumer purchases a product directly from the producer/processor on a Face-to-Face basis. Three sales channels of the business model are considered in the analysis: A) Farm shops, B) Farmers markets, C) Pick-Your-Own",
            "title": "Face-to-Face",
            "var_name": "Face-to-Face"
        },
        {
            "definition": "Products are traded online using the farmer’s websites or shared marketing websites. Two different sales channels are considered: A) Online Food Trade - 'Post box delivery', B) Online Food Trade - 'Box scheme subscription & Direct Delivery’",
            "title": "Online Trade",
            "var_name": "Online_Trade"
        },
        {
            "definition": "Products are produced and sold in the specific region of production, and consumers are made aware of the ‘local’ nature of the product at the point of sale. The sales channel considered in the analysis is: Retail Store - ‘The origin is highlighted’",
            "title": "Retail Trade",
            "var_name": "Retail_Trade"
        },
        {
            "definition": "Selling products to producer organisations, food hubs or other distributors enables farmers to benefit from improved logistics by sharing costs and pooling resources for distribution. In this way, larger quantities can be sold to channels such as supermarket chains. This business model is always considered to be an option and not part of the ranking procedure.",
            "title": "Improved Logistics",
            "var_name": "Improved_Logistics"
        }
    ],
	
	
	Volume .....
	
	"Definition_Criteria": "Would you like to know how the criteria are defined? Please follow this",
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
		this.bm_titlez = {};
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
	
	setBMTitles() {
		this.bm_titlez = {};
		if (this.USER_MODEL.analysisResult.bm_definition_texts) {
			this.USER_MODEL.analysisResult.bm_definition_texts.forEach(e=>{
				/* Each e has:
					{
            "definition": "Products are pr.... s highlighted’",
            "title": "Retail Trade",
            "var_name": "Retail_Trade"
					}
				*/
				this.bm_titlez[e.var_name] = {title:e.title, definition:e.definition};
			});
		}
	}
	
	setLabels() {
		this.labelz = {};
		if (this.USER_MODEL.analysisResult.diagram_dimension_labels) {
			this.USER_MODEL.analysisResult.diagram_dimension_labels.forEach(e=>{
				/* Each e has:
					{
					"var_name": "Volume",
					"title": "Volume",
					"chart_title": "",
					
					}
				*/
				this.labelz[e.var_name] = e.chart_title;
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
			recom['Sales_Channel'] = r['Sales_Channel']; // "Sales_Channel": "Pick_Your_Own",
			
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
			
			if (name === 'wholesale') {
				
				let d = data[i];
				// Note that when we show "wholesale" spider, we do not have access to 
				// this.showRecommendation['R'+i] -object.
				const color = this.colors.DARK_GREEN;
				let coordinates = getPathCoordinates(d);
				svg.append("path")
					.datum(coordinates)
					.attr("d", line)
					.attr("stroke-width", 2)
					.attr("stroke", color)
					.attr("fill", "none")//color)
					.attr("stroke-opacity", 1)
					.attr("opacity", 1) //0.5);
				
				
			} else if (this.showRecommendation['R'+i].value === true) {
				let d = data[i];
				const color = this.showRecommendation['R'+i].color;
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
			/*
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
			}*/
		}
	}
	
	renderTitle() {
		if (this.USER_MODEL.analysisResult.result_text) {
			const ll_title = this.USER_MODEL.analysisResult.result_text.analysis_title;
			const html = '<h3 style="color:'+this.colors.DARK_GREEN+'">'+ll_title+'</h3>';
			$("#analysis-title-wrapper").empty().append(html);
		}
	}
	
	/*
			"Intro_Definition_Business_Models":"Five business models can be differentiated for Short Food Supply Chains. These are Community Supported Agriculture (CSA), Face-to-Face Sales, Retail Trade, Online Trade, and Improved Logistics. They can be defined as follows:",
			"Definition_CSA":"Definition CSA: Producers and consumers have a pre-existing agreement were consumers pay an agreed membership fee or offer labour services (or both), in exchange for produce. Two sales channels of the business model are considered in the analysis: A) CSA - 'Trading working hours for a share of the harvest', B) CSA - 'Subscription - payment of an annual fee for a share of the harvest'. The products are delivered by the farmer.",
			"Definition_Face_2_Face":"Defintion Face-to-Face: 'Consumer purchases a product directly from the producer/processor on a Face-to-Face basis. Three sales channels of the business model are considered in the analysis: A) Farm shops, B) Farmers markets, C) Pick-Your-Own",
			"Definition_Online_Trade":"Definition Online-Trade: Products are traded online using the farmer’s websites or shared marketing websites. Two different sales channels are considered: A) Online Food Trade - 'Post box delivery', B) Online Food Trade - 'Box scheme subscription & Direct Delivery’",
			"Definition_Retail_Trade":"Definition Local Food / Retail Trade: Products are produced and sold in the specific region of production, and consumers are made aware of the ‘local’ nature of the product at the point of sale. The sales channel considered in the analysis is: Retail Store - ‘The origin is highlighted’",
			"Definition_Improved_Logistics":"Definition Improved Logistics: Selling products to producer organisations, food hubs or other distributors enables farmers to benefit from improved logistics by sharing costs and pooling resources for distribution. In this way, larger quantities can be sold to channels such as supermarket chains. This business model is always considered to be an option and not part of the ranking procedure.",
			"More_Info_Business_Models":"More information on the five business models can be found here: Link (to the business model canvas)",
	*/
	renderBusinessModels() {
		//const LM = this.controller.master.modelRepo.get('LanguageModel');
		//const sel = LM.selected;
		/*
            "var_name": "CSA"
            "var_name": "Face-to-Face"
            "var_name": "Online_Trade"
            "var_name": "Retail_Trade"
            "var_name": "Improved_Logistics"
			this.bm_titlez[e.var_name] = {title:e.title, definition:e.definition};
		*/
		//const ll_title_a = LM['translation'][sel]['CSA'];
		//const ll_title_b = LM['translation'][sel]['Face-to-Face'];
		//const ll_title_c = LM['translation'][sel]['Online_Trade'];
		//const ll_title_d = LM['translation'][sel]['Retail_Trade'];
		//const ll_title_e = LM['translation'][sel]['Improved_Logistics'];
		
		
		const ll_title_a = this.bm_titlez['CSA']['title'];
		const ll_title_b = this.bm_titlez['Face-to-Face']['title'];
		const ll_title_c = this.bm_titlez['Online_Trade']['title'];
		const ll_title_d = this.bm_titlez['Retail_Trade']['title'];
		const ll_title_e = this.bm_titlez['Improved_Logistics']['title'];
		
		const ll_def_a = this.bm_titlez['CSA']['definition'];
		const ll_def_b = this.bm_titlez['Face-to-Face']['definition'];
		const ll_def_c = this.bm_titlez['Online_Trade']['definition'];
		const ll_def_d = this.bm_titlez['Retail_Trade']['definition'];
		const ll_def_e = this.bm_titlez['Improved_Logistics']['definition'];
		
		if (this.USER_MODEL.analysisResult.result_text) {
			
			const ll_intro = this.USER_MODEL.analysisResult.result_text.Intro_Definition_Business_Models;
			//const ll_def_csa = this.USER_MODEL.analysisResult.result_text.Definition_CSA;
			//const ll_def_f2f = this.USER_MODEL.analysisResult.result_text.Definition_Face_2_Face;
			//const ll_def_online_trade = this.USER_MODEL.analysisResult.result_text.Definition_Online_Trade;
			//const ll_def_retail_trade = this.USER_MODEL.analysisResult.result_text.Definition_Retail_Trade;
			//const ll_def_improved_logistics = this.USER_MODEL.analysisResult.result_text.Definition_Improved_Logistics;
			
			const ll_title = this.USER_MODEL.analysisResult.result_text.Intro_Definition_Business_Models_title;
			
			const html = '<ul class="collapsible">'+
				'<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_title_a+'</div>'+
					'<div class="collapsible-body">'+ll_def_a+'</div>'+
				'</li>'+
				'<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_title_b+'</div>'+
					'<div class="collapsible-body">'+ll_def_b+'</div>'+
				'</li>'+
				'<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_title_c+'</div>'+
					'<div class="collapsible-body">'+ll_def_c+'</div>'+
				'</li>'+
				'<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_title_d+'</div>'+
					'<div class="collapsible-body">'+ll_def_d+'</span></div>'+
				'</li>'+
				'<li>'+
					'<div class="collapsible-header"><i class="material-icons">info_outline</i>'+ll_title_e+'</div>'+
					'<div class="collapsible-body">'+ll_def_e+'</span></div>'+
				'</li>'+
			'</ul>';
			$('#business-models-intro-title').empty().append('<h5 style="text-align:center">'+ll_title+'</h5>');
			$('#business-models-intro-wrapper').empty().append(ll_intro);
			$('#business-models-collapsible-wrapper').empty().append(html);
			
			
			/*
			TODO
			Add link to the end of this chapter!
			"links": [
			{
            "link_title": "Link",
            "url": "https://agrobridges-toolbox.eu/",
            "var_name": "More_Info_Business_Models_link"
			}
			],*/
			let link_url = undefined;
			let link_title = undefined;
			this.USER_MODEL.analysisResult.links.forEach(l=>{
				if (l.var_name === 'More_Info_Business_Models_link') {
					link_url = l.url;
					link_title = l.link_title;
				}
			});
			let ll_more_info = '<p>'+this.USER_MODEL.analysisResult.result_text.More_Info_Business_Models;
			// NOTE: If link is defined => Opens new "tab" for the linked page.
			if (typeof link_url !== 'undefined' && typeof link_title !== 'undefined') {
				ll_more_info += ' <a href="'+link_url+'" target="_blank">'+link_title+'</a></p>';
			} else {
				ll_more_info += '</p>';
			}
			$("#business-models-more-info-wrapper").empty().append(ll_more_info);
		}
	}
	
	
	/*
		"Result1_Models_Considered":"The following business models and sales channels were considered in your analysis:",
		"Result_Farms_more_than_2_suitable":"Our analysis shows that the sales channels can be ranked as follows. The most suitable channel is ranked first:",
		"Results1_farms_no_suitable_channels":"Based on the characteristics of your farm non of the sales channels are considered to be an option for you. Please check the information you entered.",
		"Results1_only_one_channel":"Based on the characteristics of your farm only one of the sales channels is considered to be an option for you and no ranking is possible. This sales channel is:",
		
		
		
		
		The following business models and sales channels were considered in your analysis. 
		Our analysis shows that the sales channels can be ranked as follows. 
		The most suitable channel is ranked first.
	*/
	renderRecommendationsTitle() {
		if (this.USER_MODEL.analysisResult.result_text) {
			const title = this.USER_MODEL.analysisResult.result_text.recommendation_title;
			const html ='<h5 style="text-align:center">'+title+'</h5>';
			$("#recommendations-title-wrapper").empty().append(html);
		}
	}
	
	renderRecommendationsText() {
		
		if (this.USER_MODEL.analysisResult.result_text) {
			const ll_intro = this.USER_MODEL.analysisResult.result_text.Result1_Models_Considered;
			const ll_resu = this.USER_MODEL.analysisResult.result_text.rank_intro1_id; // "Our analysis shows that the sales channels can be ranked as follows. The most suitable channel is ranked first.",
			const ll_add_info = this.USER_MODEL.analysisResult.result_text.Result1_add_info; // - The graphics show to which extent the SFSC sales channels meet the different criteria.
			
			//const ll_r1_no_suitable = this.USER_MODEL.analysisResult.result_text.Results1_farms_no_suitable_channels;
			//const ll_r1_only_1_suitable = this.USER_MODEL.analysisResult.result_text.Results1_only_one_channel;
			//const ll_r1_more_than_2_suitable = this.USER_MODEL.analysisResult.result_text.Result_Farms_more_than_2_suitable;
			
			//const numberOfResults = this.USER_MODEL.analysisResult.recommendation.length;
			
			const html = '<p>'+ll_intro+' '+ll_resu+' '+ll_add_info+'</p>';
			/*let html;
			
			if (numberOfResults === 0) {
				html = '<p>'+ll_intro+' '+ll_r1_no_suitable+'</p>';
				
			} else if(numberOfResults === 1) {
				html = '<p>'+ll_intro+' '+ll_r1_only_1_suitable+'</p>';
				
			} else { // Two or more...
				html = '<p>'+ll_intro+' '+ll_r1_more_than_2_suitable+'</p>';
			}
			*/
			$("#recommendations-text-wrapper").empty().append(html);
		}
	}
	
	renderRecommendationsList() {
		const self = this;
		
		// Generate following HTML dynamically based on analysis recommendations:
		let ll_sales_channel_title = 'Sales Channel';
		let ll_business_model_title = 'Business Model';
		let ll_show_title = 'Show';
		if (this.USER_MODEL.analysisResult.result_text) {
			ll_sales_channel_title = this.USER_MODEL.analysisResult.result_text.rec_table_sc_title
			ll_business_model_title = this.USER_MODEL.analysisResult.result_text.rec_table_bm_title;
			ll_show_title = this.USER_MODEL.analysisResult.result_text.rec_table_checkbox_title;
		}
		let html = 
			'<div class="row" style="margin-bottom:0;">'+
				'<div class="col s5">'+
					'<p style="font-weight:bold;">'+ll_sales_channel_title+'</p>'+
				'</div>'+
				'<div class="col s5">'+
					'<p style="font-weight:bold;">'+ll_business_model_title+'</p>'+
				'</div>'+
				'<div class="col s2">'+
					'<p style="font-weight:bold;">'+ll_show_title+'</p>'+
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
		
		this.recommendationz.forEach((r,index) => {
			// Check if "Pick_Your_Own" is recommended?
			if (r["Sales_Channel"] === 'Pick_Your_Own') {
				console.log('Pick_Your_Own FOUND!!!!!');
				/*
				"rec_additional_text": {
					"result_text_id": "Additional_Info_PickU",
					"sales_channel_id": "Pick_Your_Own",
					"text": "The harvesting labour saved by Pick-Your-Own is not reflected in the Labour to Produce Ratio. The Labour to Produce Ratio only considered Labour Requirements for Sales."
				},
				*/
				if (this.USER_MODEL.analysisResult.rec_additional_text) {
					
					const ll_txt_id = this.USER_MODEL.analysisResult.rec_additional_text['result_text_id']; //": "Additional_Info_PickU",
					const ll_sc_id = this.USER_MODEL.analysisResult.rec_additional_text['sales_channel_id']; // ": "Pick_Your_Own",
					const ll_txt = this.USER_MODEL.analysisResult.rec_additional_text['text'];//": "The harvesting labour saved by Pick-Your-Own is not reflected in the Labour to Produce Ratio. The Labour to Produce Ratio only considered Labour Requirements for Sales."
					
					const html = '<p>'+ll_txt+'</p>';
					
					$('#pick-your-own-wrapper').empty();
					$(html).appendTo('#pick-your-own-wrapper');
				}
			}
		})
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
	
	// CHAPTER 3: Improved logistics is also an option for all farmers
	
	/*
		"Results2_Farm_more_2_suitable":"Improved logistics' is also an option for you. It is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g., the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms.",
		"Results2_farm_no_suitable_Channels":"If the information was correct: 'Improved Logistics' is a business model strongly based on cooperation e.g. the sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by larger farms. 'Improved logistics' is assumed to be suitable for all farmers regardless of their location and their production characteristics.",
		"Results2_only_one_channel":"However, 'Improved logistics' is assumed to be suitable for all farmers and was not included in your ranking. It is a business model strongly based on cooperation e.g., sharing of costs for packaging and transport. This allows smaller farms to deliver to sales channels that are usually served by very large farms and could be interesting for you.",
	*/
	
	
	renderImprovedLogistics() {
		
		if (this.USER_MODEL.analysisResult.result_text) {
			
			//const ll_r2_no_suitable = this.USER_MODEL.analysisResult.result_text.Results2_farm_no_suitable_Channels;
			//const ll_r2_only_1_suitable = this.USER_MODEL.analysisResult.result_text.Results2_only_one_channel;
			//const ll_r2_more_than_2_suitable = this.USER_MODEL.analysisResult.result_text.Results2_Farm_more_2_suitable;
			
			const title = this.USER_MODEL.analysisResult.result_text.Improved_Logistics_title;
			const resu = this.USER_MODEL.analysisResult.result_text.rank_intro2_id;
			
			//const numberOfResults = this.USER_MODEL.analysisResult.recommendation.length;
			/*
			let html;
			
			if (numberOfResults === 0) {
				html = '<p>'+ll_r2_no_suitable+'</p>';
				
			} else if(numberOfResults === 1) {
				html = '<p>'+ll_r2_only_1_suitable+'</p>';
				
			} else { // Two or more...
				html = '<p>'+ll_r2_more_than_2_suitable+'</p>';
			}*/
			const html = '<h5 style="text-align:center">'+title+'</h5><p>'+resu+'</p>';
			$("#improved-logistics-wrapper").empty().append(html);
		}
	}
	
	/*
		NOTE: when "Pick-Your-Own" sales channel is recommended => 
        {
            "Business_Model": "Face-to-Face",
            "Carbon_Footprint": 0.05,
            "Chain_Added_Value": 0.95,
            "Consumer_Contact": 1.0,
            "Gender_Equality": 0.0,
            "Labor_Produce": 0.01,
            "Price_Premium": 1.0,
            "Ranking": 2,
            "Sales_Channel": "Pick_Your_Own",
            "Volume": 0.2,
            "business_model_title": "Face-to-Face",
            "sales_channel_title": "Pick-Your-Own"
        }
		
		MUST read additional text and display:
		    
			"rec_additional_text": {
				"result_text_id": "Additional_Info_PickU",
				"sales_channel_id": "Pick_Your_Own",
				"text": "The harvesting labour saved by Pick-Your-Own is not reflected in the Labour to Produce Ratio. The Labour to Produce Ratio only considered Labour Requirements for Sales."
			},
		
		
		
		
	*/
	renderWholesaleDescription() {
		
		if (this.USER_MODEL.analysisResult.result_text) {
			const ll_dse = this.USER_MODEL.analysisResult.result_text.Description_Spiderweb_example; //Describtion_Spiderweb;
			const ll_title = this.USER_MODEL.analysisResult.result_text.Wholesale_Comparison_title;
			$("#comparison-to-wholesale-title").empty().append(ll_title);
			$("#wholesale-description-wrapper").empty().append('<p>'+ll_dse+'</p>');
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
	
	renderHowToSpiders() {
		if (this.USER_MODEL.analysisResult.result_text) {
			const ll_title = this.USER_MODEL.analysisResult.result_text.Description_Spiderweb_title;
			const ll_how_to_read = this.USER_MODEL.analysisResult.result_text.Describtion_Spiderweb;
			//const ll_def_crite = this.USER_MODEL.analysisResult.result_text.Definition_Criteria;
			//const ll_def_crite_link = this.USER_MODEL.analysisResult.result_text.Definition_Criteria_link;
		
			const html = '<h5 style="text-align:center">'+ll_title+'</h5>'+'<p>'+ll_how_to_read+'</p>';
				//'<p>'+ll_def_crite+' '+ll_def_crite_link+'</p>';
				
			$("#how-to-read-spiders").empty().append(html);
		}
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
	
	renderFarmCharacteristics() {
		if (this.USER_MODEL.analysisResult.result_text) {
			
			const title = this.USER_MODEL.analysisResult.result_text.Suitability_farm_Characteristics_title;
			const intro = this.USER_MODEL.analysisResult.result_text.Intro_not_all_sales_channels_con;
			const descr = this.USER_MODEL.analysisResult.result_text.Suitability_farm_Characterstics;
			
			const relative_attractiveness_text = this.USER_MODEL.analysisResult.Region_Attractiveness.Relative_Attractiveness; // "The relative attractiveness of your region was considered to be:"
			const value = this.USER_MODEL.analysisResult.Region_Attractiveness.value; // "medium"
			
			/*
			TODO
			Add link to the end of this chapter!
			"links": [
			{
            "link_title": "Link",
            "url": "https://agrobridges-toolbox.eu/",
            "var_name": "Suitability_farm_Characteristics_info_link"
			}
			],*/
			//"Suitability_farm_Characteristics_info": "If you would like to learn more about farms or regional characteristics, and how these affect the suitability of the business models, please follow this",
			//"Suitability_farm_Characteristics_info_link": "Link",
			//Suitability_farm_Characteristics_info
			
			let link_url = undefined;
			let link_title = undefined;
			const link_text = this.USER_MODEL.analysisResult.result_text.Suitability_farm_Characteristics_info;
			
			this.USER_MODEL.analysisResult.links.forEach(l=>{
				if (l.var_name === 'Suitability_farm_Characteristics_info_link') {
					link_url = l.url;
					link_title = l.link_title;
				}
			});
			
			let html = '<h5 style="text-align:center">'+title+'</h5>'+
			'<p>'+intro+'</p>'+
			'<p style="color:'+this.colors.DARK_GREEN+'; font-weight:bold;">'+relative_attractiveness_text+' <span style="color:'+this.colors.DARK_ORANGE+'">'+value+'</span></p>'+
			'<p>'+descr+'</p>';
			// NOTE: If link is defined => Opens new "tab" for the linked page.
			if (typeof link_url !== 'undefined' && typeof link_title !== 'undefined') {
				html += '<p>'+link_text+' <a href="'+link_url+'" target="_blank">'+link_title+'</a></p>';
			}
			$("#farm-characteristics-wrapper").empty().append(html);
		}
	}
	
	renderHowCalculated() {
		if (this.USER_MODEL.analysisResult.result_text) {
			const ll_how_calculated_title = this.USER_MODEL.analysisResult.result_text.How_calculated_title;
			const ll_how_calculated_text = this.USER_MODEL.analysisResult.result_text.How_calculated;
			
			let link_url = undefined;
			let link_title = undefined;
			this.USER_MODEL.analysisResult.links.forEach(l=>{
				if (l.var_name === 'How_calculated_link') {
					link_url = l.url;
					link_title = l.link_title;
				}
			});
			
			let how_calculated_link = '';
			if (typeof link_url !== 'undefined' && typeof link_title !== 'undefined') {
				how_calculated_link = '<a href="'+link_url+'" target="_blank">'+link_title+'</a>';
			}
			const html = '<h5 style="text-align:center">'+ll_how_calculated_title+'</h5><p>'+ll_how_calculated_text+' '+how_calculated_link+'</p>';
			$("#how-calculated-wrapper").empty().append(html);
		}
	}
	
	renderDisclaimer() {
		if (this.USER_MODEL.analysisResult.result_text) {
			const ll_d_title = this.USER_MODEL.analysisResult.result_text.Disclaimer_Header;
			const ll_d_text = this.USER_MODEL.analysisResult.result_text.Disclaimer;
			const html = '<h6>'+ll_d_title+'</h6><p>'+ll_d_text+'</p>';
			$("#disclaimer-text-wrapper").empty().append(html);
		}
	}
	
	renderAll() {
		this.renderTitle();
		// CHAPTER 1: Business models explained
		this.setBMTitles();
		this.renderBusinessModels();
		
		this.setLabels();
		this.setComparison();
		this.setRecommendations();
		
		// CHAPTER 2: Recommendations
		this.renderRecommendationsTitle();
		this.renderRecommendationsText();
		this.renderRecommendationsList();
		this.renderRecommendationsSpider();
		
		// CHAPTER 3: Improved logistics is also an option for all farmers
		this.renderImprovedLogistics();
		
		// CHAPTER 4: Comparison to Wholesale
		this.renderWholesaleDescription();
		this.renderWholesaleSpider();
		
		// CHAPTER 5: How to read the diagrams
		this.renderHowToSpiders();
		this.renderDimensionsCollapsible();
		
		// CHAPTER 6: Farm and regional characteristics
		this.renderFarmCharacteristics();
		
		// CHAPTER 7: How the results were calculated?
		this.renderHowCalculated();
		
		// CHAPTER 8: Disclaimer
		this.renderDisclaimer();
		
		$('.collapsible').collapsible({
			accordion: true,
			onOpenEnd: function(el) { console.log(['open el=',el]); /*self.previewOpen=true;*/ },
			onCloseEnd: function(el) { console.log(['close el=',el]); /*self.previewOpen=false;*/ }
		});
	}
	
	notify(options) {
		if (this.controller.visible) {
			if (options.model==='ResizeEventObserver' && options.method==='resize') {
				
				this.show();
				
			} else if (options.model==='UserModel' && options.method==='runAnalysis') {
				if (options.status === 200) {
					
					$('#'+this.FELID).empty();
					
					this.renderAll();
					
				} else {
					// Report error.
					const html = '<div class="error-message"><p>'+options.message+'</p></div>';
					$('#'+this.FELID).empty().append(html);
				}
			}
		}
	}
	
	render() {
		const self = this;
		$(this.el).empty();
		const html = 
			'<div class="row">'+
				'<div class="col s12">'+
					'<div class="col s12 center" id="analysis-title-wrapper">'+
					'</div>'+
				'</div>'+
				
				// CHAPTER 1: Business models explained
				'<div class="col s12">'+
					'<div id="business-models-intro-title" class="col s12 m10 offset-m1">'+
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
				
				// CHAPTER 2: Recommendations 
				'<div class="col s12" style="border-top: 1px solid #888; border-bottom: 1px solid #ccc; margin-top:16px; background-color:'+this.colors.LIGHT_GREEN_2+';">'+
					'<div class="col s12 m10 offset-m1" id="recommendations-title-wrapper">'+
					'</div>'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="recommendations-text-wrapper"></div>'+
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
						'<div id="pick-your-own-wrapper"></div>'+
					'</div>'+
				'</div>'+
				
				// CHAPTER 3: Improved logistics is also an option for all farmers
				'<div class="col s12" style="border-bottom: 1px solid #ccc; background-color:'+this.colors.LIGHT_GREEN_2+';">'+
					'<div class="col s12 m10 offset-m1" >'+
						'<div id="improved-logistics-wrapper"></div>'+
					'</div>'+
				'</div>'+
				
				// CHAPTER 4: Comparison to Wholesale
				'<div class="col s12" style="border-bottom: 1px solid #888; background-color:'+this.colors.LIGHT_GREEN_2+';">'+
					'<div class="col s12 m10 offset-m1">'+
						'<h5 id="comparison-to-wholesale-title" style="text-align:center"></h5>'+
						'<div class="row">'+
							'<div class="col s12 m5" id="wholesale-description-wrapper">'+
							'</div>'+
							'<div class="col s12 m7" id="wholesale-spider-wrapper">'+
							'</div>'+
						'</div>'+
					'</div>'+
				'</div>'+
				
				// CHAPTER 5: How to read the diagrams
				'<div class="col s12">'+
					'<div id="how-to-read-spiders" class="col s12 m10 offset-m1">'+
						//'<h5 style="text-align:center">'+ll_how_to_read_spiders_title+'</h5>'+
						//'<p>'+ll_how_to_read_spiders_text+'</p>'+
						//'<p>'+ll_definition_criteria+'</p>'+
					'</div>'+
					'<div id="dimension-collapsible-wrapper" class="col s12 m10 offset-m1">'+
					'</div>'+
				'</div>'+
				
				// CHAPTER 6: Farm and regional characteristics
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="farm-characteristics-wrapper"></div>'+
					'</div>'+
				'</div>'+
				
				// CHAPTER 7: How the results were calculated?
				'<div class="col s12">'+
					'<div class="col s12 m10 offset-m1">'+
						'<div id="how-calculated-wrapper"></div>'+
					'</div>'+
				'</div>'+
				// CHAPTER 8: Disclaimer
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
			self.controller.models['MenuModel'].setSelected('menu');
		});
		
		if (this.USER_MODEL.analysisReady) {
			
			this.renderAll();
			
		} else {
			this.showSpinner('#recommendations-text-wrapper');
		}
		
		this.rendered = true;
	}
}
