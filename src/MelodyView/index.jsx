import React, { Component } from 'react';
import * as d3 from 'd3'

const height = 430;
const margin = {top:50, left:20, right:20, bottom:50}
const axisScale = d3.scaleLinear().domain([1,7]).range([height-margin.bottom-10, margin.top]);
export default class MelodyView extends Component {

    state = {
        data:this.props.data
    }

    static getDerivedStateFromProps(props, state){
        if (props.data !== undefined && props.data !== state.data){
            var path=document.getElementById("melody-path");
            if (path !== undefined && path !== null){
                path.remove();
            }
            var stats = {};
            for (var i=0; i<props.data.length; i++){
                var phrases = props.data[i].phrases;
                for (var j=0; j<phrases.length; j++){
                    var melody_pieces = phrases[j].melody_pieces;
                    for (let k in melody_pieces){
                        if (k in stats){
                            stats[k] = stats[k] + melody_pieces[k];
                        }
                        else{
                            stats[k] = melody_pieces[k];
                        }
                    }
                }
            }
            var converted = [];
            for (let i in stats){
                converted.push([i,stats[i]]);
            }
            converted = d3.sort(converted, (a, b) => d3.ascending(b[1], a[1])).slice(0,30);
            var colorMap = d3.scalePow().exponent(1).domain([converted[0][1],converted[converted.length-1][1]]).range([0,1])
            var svg = d3.select('#melody-svg');
            svg.append("g")
                .attr('id', 'melody-path')
               .attr("fill", "none")
               .attr("stroke-width", 1.5)
               .selectAll("path")
               .data(converted)
               .join("g")
               .attr("transform", d => `translate(0,${(Math.random()-0.5)*10})`)
               .append("path")
               .attr('data-aos', 'fade-zoom-in')
               .attr('data-aos-delay', (d,idx) => `${idx*50}`)
               .attr("stroke", d => d3.interpolateBlues(colorMap(d[1])))
               .attr("stroke-width", d => colorMap(d[1]) * 4)
               .attr('stroke-opacity','0.5')
               .attr("d", d => d3.line()([
                   [65, axisScale(d[0][0])],
                   [65+80*1, axisScale(d[0][1])],
                   [65+80*2, axisScale(d[0][2])],
                   [65+80*3, axisScale(d[0][3])],
                   [65+80*4, axisScale(d[0][4])],
                ]
               ))
               .on("mouseover",function(e,d){
                    d3.select(this).attr("stroke","orange").attr("stroke-width", 6).attr('stroke-opacity','1');
                    d3.select(this.parentNode).raise();
                    d3.select('#melody-tooltip').attr('opacity', '1').text(`${d[0]}: Appears ${d[1]} times`);
                })
                .on("mouseout",function(e,d){
                    d3.select(this).attr("stroke",d3.interpolateBlues(colorMap(d[1]))).attr('stroke-opacity','0.5').attr("stroke-width", d => colorMap(d[1]) * 4);
                    d3.select('#melody-tooltip').attr('opacity', '0');
                })
               .append("title")
               .text(d => d.name);
        }
            
        return {data:props.data}
    }

    componentDidMount(){
        this.svg = d3.select('#melody-svg');

        const keys = ['1st', '2nd', '3rd', '4th', '5th']
        this.svg.append("g")
            .selectAll("g")
            .data(keys)
            .join("g")
            .attr("transform", (d,idx) => `translate(${idx*80+65},0)`)
            .each(function(d) { d3.select(this).call(d3.axisLeft(axisScale).ticks(7))
                                               .call(g => g.selectAll(".tick line")
                                                           .attr("stroke", '#777777'))
                                               .call(g => g.selectAll(".domain")
                                                           .attr("stroke", '#777777')); })
            .call(g => g.append("text")
                .attr("x", -10)
                .attr("y", height-margin.bottom+10)
                .attr("text-anchor", "start")
                .attr("fill", "currentColor")
                .text(d => d))
            }

    render() {
        return (
            <div id='melody-svg-parent-div'>
                <svg id='melody-svg' width='100%' height='100%' viewBox='0 0 428 430' preserveAspectRatio="none">
                <text id='melody-tooltip' x='20' y='420' opacity='0'></text>
                </svg>
            </div>
        )
    }
}
