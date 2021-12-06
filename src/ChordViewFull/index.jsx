import React, { Component } from 'react'
import * as d3 from 'd3'

import './index.css'

// var testData = {
//     name:'I',
//     value:'305',
//     children:[
//         {
//             name:'V',
//             value:'100',
//             children:[{name:'ii',value:'100'}]
//         },
//         {
//             name:'VII',
//             value:'205',
//         },
//         {
//             name:'IV',
//             value:'205',
//         },
//         {
//             name:'V',
//             value:'205',
//         }
//     ]
// }

const width = 1200;
const height = 800;
var nodeId = 0;

export default class ChordViewFull extends Component {

    state = {
        data:this.props.data,
        full:this.props.full
    }

    shouldComponentUpdate(nextProps, nextState){
        
        return true
    }

    static getDerivedStateFromProps(props, state){
        return {data: props.data}
    }

    clicked =(e, d) => {
        if (d.children) {
            d._children = d.children;
            d.children = null;
            if (d.parent){
                for(var i in d.parent._children){
                    d.parent.children.push(d.parent._children[i]);
                }
                d.parent._children = null
            }
        }
        else {
            d.children = d._children;
            d._children = null;
            if (d.parent){
                if (d.parent.children){
                    d.parent._children = [];
                    for (let i in d.parent.children){
                        if (d.parent.children[i] !== d){
                            d.parent._children.push(d.parent.children[i]);
                        }
                    }
                    d.parent.children = [d];
                }
                console.log(d.parent.children, d.parent._children)
            }
            
        }
        this.update()
    }

    update = (withinit=false) => {
        this.nodes = this.flatten(this.root);
        const links = this.root.links();
        if (withinit){
            this.simulation = d3.forceSimulation()
            .force('link', d3.forceLink(links).id(function(d) { return d.id; }).distance(100).strength(1))
            .force('charge', d3.forceManyBody().strength(-50))
            .force('center', d3.forceCenter( width/2, height/2 ))
            .force("x", d3.forceX())
            .force("y", d3.forceY())
        }
        const sizeScale = this.sizeScale;
        const colorScale = this.colorScale;
        this.link = this.linkGroup.selectAll('.link')
                        .data(links, function(d){ return d.target.id })
        this.link.exit().remove()
        const linkEnter = this.link.enter()
                                    .append('line')
                                    .attr('class', 'link')
                                    .style('stroke', '#000' )
                                    .style('opacity', '0.1')
                                    .style('stroke-width', 1)
        
        this.link = linkEnter.merge(this.link)
        
        this.node = this.nodeGroup.selectAll('.node')
                    .data(this.nodes, function(d){ return d.id })

        this.node.exit().remove()
        
        const nodeEnter = this.node.enter()
                                .append('g')
                                .attr('class', 'node')
                                .attr('stroke', '#666')
                                .attr('stroke-width', 2)
                                .style('fill', function(d) { 
                                    if(d.data.name === 'root'){
                                        return 'red'
                                    }
                                    else{
                                        return d3.interpolateBlues(colorScale(d.data.value))
                                    }
                                })
                                .style('opacity', 1)
                                .on('click', this.clicked)
                                .call(drag(this.simulation))
        
        nodeEnter.append('circle')
                    .attr("r", function(d) { return sizeScale(d.data.value) })
                    .on("mouseover",function(e,d){
                        d3.select(this).style('fill','orange')
                        d3.select('#chord-full-tooltip').attr('opacity', '1').text(`${d.data.name}: ${d.data.value}`)
                    })
                    .on("mouseout",function(e,d){
                        d3.select(this).style('fill', function(d) { 
                            if(d.data.name === 'root'){
                                return 'red'
                            }
                            else{
                                return d3.interpolateBlues(colorScale(d.data.value))
                            }
                        })
                        d3.select('#chord-full-tooltip').attr('opacity', '0')
                    })
                    
                    .text(function(d){ return d.data.name })
        nodeEnter.append('text')
                .style('text-anchor', 'middle')
                .style('font-size', '12px')
                .style('font-weight', '10px')
                .attr('fill', 'black')
                .attr('stroke-width', '0.5')
                .style('user-select', 'none')
                .text(function(d) { 
                    if (sizeScale(d.data.value) > 10){
                        return d.data.name; 
                    }
                    else{
                        return '';
                    }
                });
                    

        this.node = nodeEnter.merge(this.node)
        this.simulation.on('tick', () =>{
            this.link
            .attr('x1', function(d){ return d.source.x; })
            .attr('y1', function(d){ return d.source.y; })
            .attr('x2', function(d){ return d.target.x; })
            .attr('y2', function(d){ return d.target.y; })
        
            this.node
                .attr('transform', function(d){ return `translate(${d.x}, ${d.y})`})
        })
        this.simulation.nodes(this.nodes)
        this.simulation.force('link').links(links)
        if (withinit){
            this.nodes.forEach(function(d) {
                if (d.children && d.parent) {
                    d._children = d.children;
                    d.children = null;
                }
            });
        }
        if (withinit){
            this.update()
        }
    }

    flatten(root) {
        var nodes = []
        function recurse(node) {
            if (node.children) node.children.forEach(recurse)
            if (!node.id) node.id = ++nodeId;
            else ++nodeId;
            nodes.push(node)
        }
        recurse(root)
        return nodes
    }

    zoomed = ({transform}) => {
        this.svg.attr("transform", transform);
    }

    componentDidMount(){
        remove(['node-group-full', 'link-group-full']);
        const zoom = d3.zoom().scaleExtent([0.1, 40]).on("zoom", this.zoomed);
        this.svg = d3.select('#chord-full-svg').append('g');
        this.svg.call(zoom)
        this.nodeGroup = this.svg.append('g').attr('id', 'node-group-full')
        this.linkGroup = this.svg.append('g').attr('id', 'link-group-full')
        var converted = processData(this.props.data)
        this.root = d3.hierarchy(converted);
        this.node = undefined;
        this.link = undefined;
        this.sizeScale = d3.scaleSqrt().domain([0,converted.sum]).range([5,30]);
        this.colorScale = d3.scalePow().exponent(0.2).domain([0,converted.sum]).range([0,0.7]);
        this.update(true)
    }

    render() {
        return (
            <div id='chord-full-svg-parent-div'>
                <svg id='chord-full-svg' width='100%' height='100%' viewBox='0 0 1200 770' preserveAspectRatio="none">
                    <text id='chord-full-tooltip' x='600' y='30' opacity='0'></text>
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
function processData(data){
    if (data){
        var stats = {name:'root', value:0, children:[], sum:0}
        for (let i in data){
            for (let j in data[i].phrases){
                var cp = [].concat(data[i].phrases[j].chord_progression);
                var oriLength = cp.length;
                var currentRoot = stats.children;
                while (cp.length !== 0 && oriLength - cp.length <= 6){
                    var current = cp.shift();
                    var flag = false
                    for (let k in currentRoot){
                        if (currentRoot[k].name === current){
                            flag = true;
                            currentRoot[k].value += 1;
                            currentRoot = currentRoot[k].children;
                            break
                        }
                    }
                    if (flag === false){
                        currentRoot.push({name:current, value:1, children:[]})
                        currentRoot = currentRoot[currentRoot.length-1].children
                    }
                }
            }
        }
        stats.value = 1
        stats.sum = d3.max(stats.children, d => d.value)
        return stats
    }
}
function remove(idList){
    for (let i in idList){
        var ele=document.getElementById(idList[i]);
        if (ele !== undefined && ele !== null){
            ele.remove();
        }
    }
}