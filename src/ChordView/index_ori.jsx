import React, { Component } from 'react'
import * as d3 from 'd3'

var testData = {
    name:'root',
    value:'305',
    children:[
        {
            name:'child1',
            value:'100',
            children:[{name:'child11',value:'100'}]
        },
        {
            name:'child2',
            value:'205',
        },
        {
            name:'child3',
            value:'205',
        },
        {
            name:'child4',
            value:'205',
        }
    ]
}

var testData2 = {
    name:'root',
    value:'305',
    children:[{name:'1', value:1}]
    
}

const width = 632;
const height = 464;
const svg = d3.select('#chord-svg')
const simulation = d3.forceSimulation()
                    .force('link', d3.forceLink().id(function(d) { return d.id; }))
                    .force('charge', d3.forceManyBody().strength(-15).distanceMax(300))
                    .force('center', d3.forceCenter( width/2, height/4 ))
                    .on('tick', () =>{
                        link
                        .attr('x1', function(d){ return d.source.x; })
                        .attr('y1', function(d){ return d.source.y; })
                        .attr('x2', function(d){ return d.target.x; })
                        .attr('y2', function(d){ return d.target.y; })
                      
                       node
                        .attr('transform', function(d){ return `translate(${d.x}, ${d.y})`})
                    })

export default class ChordView extends Component {

    state = {
        data:this.props.data
    }


    static getDerivedStateFromProps(props, state){
        if (props.data !== state.data){
        }
        return {data:props.data}
    }

    // click = (event, node) => {
    //     if (node.children) {
    //         node._children = node.children;
    //         node.children = null;
    //     } else {
    //         node.children = node._children;
    //         node._children = null;
    //     }
    //     console.log(node)
    //     console.log(testData)
    //     this.update()
    // }
    update = () => {
        // this.root = d3.hierarchy(testData);
        // this.links = this.root.links();
        // this.nodes = this.root.descendants();
        // this.simulation = d3.forceSimulation(this.nodes)
        //                     .force("link", d3.forceLink(this.links).id(d => d.id).distance(20).strength(1))
        //                     .force("charge", d3.forceManyBody().strength(-50))
        //                     .force("x", d3.forceX())
        //                     .force("y", d3.forceY());
        // this.link = this.link.data(this.links);
        // this.node = this.node.data(this.nodes);
        // this.node.enter().append("circle")
        //                     .attr("class", "node")
        //                     .attr("fill", d => d.children ? null : "#000")
        //                     .attr("stroke", d => d.children ? null : "#fff")
        //                     .attr("r", 10)
        //                     .attr("cx", function(d) { return d.x; })
        //                     .attr("cy", function(d) { return d.y; })
        //                     .on("click", this.click)
        //                     .call(drag(this.simulation));
        // this.node.exit().remove();
        // this.link.enter().insert("line", ".node")
        //     .attr("class", "link")
        //     .attr("x1", function(d) { return d.source.x; })
        //     .attr("y1", function(d) { return d.source.y; })
        //     .attr("x2", function(d) { return d.target.x; })
        //     .attr("y2", function(d) { return d.target.y; });
        // this.link.exit().remove();
    }

    componentDidMount(){
        // this.root = d3.hierarchy(testData);
        // this.links = this.root.links();
        // this.nodes = this.root.descendants();
        // this.simulation = d3.forceSimulation(this.nodes)
        //                     .force("link", d3.forceLink(this.links).id(d => d.id).distance(20).strength(1))
        //                     .force("charge", d3.forceManyBody().strength(-50))
        //                     .force("x", d3.forceX())
        //                     .force("y", d3.forceY());
        // this.svg = d3.select('#chord-svg')
        // this.link = this.svg.append("g")
        //                     .attr('transform', 'translate(300,200)')
        //                     .attr("stroke", "#999")
        //                     .attr("stroke-opacity", 0.6)
        //                     .selectAll("line")
        //                     .data(this.links)
        //                     .join("line")
        //                     .attr('class', 'link');
        // this.node = this.svg.append("g")
        //                     .attr('transform', 'translate(300,200)')
        //                     .attr("fill", "#fff")
        //                     .attr("stroke", "#000")
        //                     .attr("stroke-width", 1.5)
        //                     .selectAll("circle")
        //                     .data(this.nodes)
        //                     .join("circle")
        //                     .attr('class', 'node')
        //                     .attr("fill", d => d.children ? null : "#000")
        //                     .attr("stroke", d => d.children ? null : "#fff")
        //                     .attr("r", 10)
        //                     .on("click", this.click)
        //                     .call(drag(this.simulation));
        // this.simulation.on("tick", () => {
        //     this.link
        //         .attr("x1", d => d.source.x)
        //         .attr("y1", d => d.source.y)
        //         .attr("x2", d => d.target.x)
        //         .attr("y2", d => d.target.y);
        //     this.node
        //         .attr("cx", d => d.x)
        //         .attr("cy", d => d.y);
        // });
        update()
    }

    render() {
        return (
            <div id='chord-svg-parent-div'>
                <svg id='chord-svg' width='100%' height='100%' viewBox='0 0 632 464' preserveAspectRatio="none">
                </svg>
            </div>
        )
    }
}

function drag(simulation){
  
  function dragstarted(event, d) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }
  
  function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
  }
  
  function dragended(event, d) {
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}


var root = d3.hierarchy(testData);
var node, link;
var nodeId = 0;

function update() {
  const nodes = flatten(root)
  const links = root.links()
  
  link = svg.selectAll('.link')
            .data(links, function(d){ return d.target.id })
  
  link.exit().remove()
  
  const linkEnter = link
                    .enter()
                    .append('line')
                    .attr('class', 'link')
                    .style('stroke', '#000' )
                    .style('opacity', '0.2')
                    .style('stroke-width', 2)
  
  link = linkEnter.merge(link)
  
  node = svg.selectAll('.node')
            .data(nodes, function(d){ return d.id })

  node.exit().remove()
  
  const nodeEnter = node.enter()
                        .append('g')
                        .attr('class', 'node')
                        .attr('stroke', '#666')
                        .attr('stroke-width', 2)
                        .style('fill', color)
                        .style('opacity', 1)
                        .on('click', clicked)
                        .call(drag(simulation))
  
  nodeEnter.append('circle')
            .attr("r", function(d) { return Math.sqrt(d.data.size) / 10 || 4.5; })
            .style('text-anchor', function(d){ return d.children ? 'end' : 'start'; })
            .text(function(d){ return d.data.name })

    node = nodeEnter.merge(node)
    simulation.nodes(nodes)
    simulation.force('link').links(links)
}


function color(d) {
  return d._children ? "#51A1DC" // collapsed package
      : d.children ? "#51A1DC" // expanded package
      : "#F94B4C"; // leaf node
}

function ticked() {
  
}

function clicked(d) {
    if (d.children) {
        d._children = d.children;
        d.children = null;
    } else {
        d.children = d._children;
        d._children = null;
    }
    update()

}

function flatten(root) {
  const nodes = []
  function recurse(node) {
    if (node.children) node.children.forEach(recurse)
    if (!node.id) node.id = ++nodeId;
    else ++nodeId;
    nodes.push(node)
  }
  recurse(root)
  return nodes
}