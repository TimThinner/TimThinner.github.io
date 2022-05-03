/*
const DUMMY_DATA = [
  { id: 'd1', value: 10, region: 'USA' },
  { id: 'd2', value: 11, region: 'India' },
  { id: 'd3', value: 12, region: 'China' },
  { id: 'd4', value: 6, region: 'Germany' },
];
*/
const DUMMY_DATA = [
	{name: "1", value:226023},
	{name: "2", value:254004},
	{name: "3", value:363994},
	{name: "4", value:267438},
	{name: "5", value:228513},
	{name: "6", value:274456},
	{name: "7", value:200336},
	{name: "8", value:296441},
	{name: "9", value:220501},
	{name: "10", value:184820},
	{name: "11", value:251908},
	{name: "12", value:349117},
	{name: "13", value:365553},
	{name: "14", value:380513},
	{name: "15", value:460285},
	{name: "16", value:409174},
	{name: "17", value:410304},
	{name: "18", value:415214},
	{name: "19", value:420598},
	{name: "20", value:471354},
	{name: "21", value:469132},
	{name: "22", value:438532},
	{name: "23", value:471041},
	{name: "24", value:450723},
	{name: "25", value:501573},
	{name: "26", value:518566},
	{name: "27", value:521528},
	{name: "28", value:544084},
	{name: "29", value:522578},
	{name: "30", value:533628},
	{name: "31", value:510077},
	{name: "32", value:523862},
	{name: "33", value:520614},
	{name: "34", value:518082},
	{name: "35", value:621009},
	{name: "36", value:538670}
];

render = function() {
	console.log('render v3.0');
	$('svg').empty();
	
	const w = $(window).width()-40; // set a little margin in both dimensions.
	const h = $(window).height()-40;
	
	const xScale = d3
		.scaleBand()
		.domain(DUMMY_DATA.map((dataPoint) => dataPoint.name))
		.rangeRound([0, w])
		.padding(0.1);
	const yScale = d3.scaleLinear().domain([0, 700000]).range([h, 0]);
	
	const container = d3.select('svg')//.classed('container', true);
		.attr('width',w+'px')
		.attr('height',h+'px')
		.style('border','1px solid #720570');
	
	const bars = container
		.selectAll('.bar')
		.data(DUMMY_DATA)
		.enter()
		.append('rect')
		.classed('bar', true)
		.attr('width', xScale.bandwidth())
		.attr('height', (data) => h - yScale(data.value))
		.attr('x', data => xScale(data.name))
		.attr('y', data => yScale(data.value));
}
/*setTimeout(() => {
  bars.data(DUMMY_DATA.slice(0, 2)).exit().remove();
}, 2000);*/

$(window).on('resize', function() {
	render();
});

render();
