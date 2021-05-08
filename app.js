const DUMMY_DATA = [
  { id: 'd1', value: 10, region: 'USA' },
  { id: 'd2', value: 11, region: 'India' },
  { id: 'd3', value: 12, region: 'China' },
  { id: 'd4', value: 6, region: 'Germany' },
];

// const xScale = d3
//   .scaleBand()
//   .domain(DUMMY_DATA.map((dataPoint) => dataPoint.region))
//   .rangeRound([0, 250])
//   .padding(0.1);
// const yScale = d3.scaleLinear().domain([0, 15]).range([200, 0]);

// const container = d3.select('svg').classed('container', true);

// const bars = container
//   .selectAll('.bar')
//   .data(DUMMY_DATA)
//   .enter()
//   .append('rect')
//   .classed('bar', true)
//   .attr('width', xScale.bandwidth())
//   .attr('height', (data) => 200 - yScale(data.value))
//   .attr('x', data => xScale(data.region))
//   .attr('y', data => yScale(data.value));

// setTimeout(() => {
//   bars.data(DUMMY_DATA.slice(0, 2)).exit().remove();
// }, 2000);

const MARGINS = {top: 20, bottom: 10}
const CHART_WIDTH = 600
const CHART_HEIGHT = 400 - MARGINS.top - MARGINS.bottom

let selectedData = DUMMY_DATA

//defining range 
const x = d3.scaleBand().rangeRound([0, CHART_WIDTH]).padding(0.1)
const y = d3.scaleLinear().range([CHART_HEIGHT, 0])
 

const charContainer = d3
  .select('svg')
  .attr('width', CHART_WIDTH) 
  .attr('height', CHART_HEIGHT + MARGINS.top + MARGINS.bottom)
  //domain specify items to be positioned/scale
  //d is a just convention 
  x.domain(DUMMY_DATA.map((d) => d.region))
  // y.domain([0,15])   hard code data for range
  //max is a built in  helper method
  //will look at all value and use it as upper bound
  //adding 3 to have a bit of space on top 
  y.domain([0,d3.max(DUMMY_DATA, d=> d.value) + 3])
  
const chart = charContainer.append('g')
//append a new group
//call is js function
//axis bottom create a bottom axis
//x holds all the info of x-axis scale
//the bottom/top is not the actual position

chart
  .append('g') 
  //takes the tick from outer line
  .call(d3.axisBottom(x).tickSizeOuter(0))
  .attr('transform', `translate(0,${CHART_HEIGHT })`)
  .attr('color','#4F009E' )

function renderChart(){
  chart
    .select('.bar')
    .data(selectedData, data => data.id)
    .enter()
    .append('rect')
    .classed('bar,true')
    //equall widthfor all bars/ calculates with padding
    .attr('width', x.bandwidth() )
    //set anonymous function to get data .value
    .attr('height', (data) => CHART_HEIGHT - y(data.value))
    .attr('x', (data) => x(data.region))
    .attr('y', (data) => y(data.value))
  //to remove the bars from view when uncheck 
  chart.selectAll('.bar').data(selectedData, data => data.id).exit().remove() 

  //adding labels for the chart
    chart
      .selectAll('.label')
      .data(selectedData,data => data.id )
      .enter()
      .append('text')
      .text((data) => data.value)
      //setting coordinates x y for the label
      .attr('x', dat a => x(data.value) + x.bandwidth() / 2 )
      // calculate form top, deduct not adding
      .attr('y', data => y(data.value) - 20 )
      //text anchor is a svg element we can set 
      .attr('text-anchor', 'middle')
      .classed('label', true)

  chart.selectAll('.label').data(selectedData, data => data.id).exit().remove()
}


//initial chart at loading
renderChart()
//set up empty array first
let unselectedIds =  []

const listItems = d3
  .select('#data')
  .select('ul')
  .selectAll('li').data(DUMMY_DATA)
  .enter()
  .append('li')

listItems.append('span').text(data => data.region)

listItems
  .append('input')
  .attr('type, checkbox')
  .attr('checked', true)  
  // on is an event listener
  .on('change', (data) => {
    if (unselectedIds.indexOf(data.id) === -1){
      unselectedIds.push(data.id)
    } else {
      unselectedIds = unselectedIds.filter(id=> id !== data.id)
    }
    selectedData = DUMMY_DATA.filter(
      (d) => unselectedIds.indexOf(d.id) === -1
    )
    console.log(selectedData)
    renderChart()
  }) 
 
