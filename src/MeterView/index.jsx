import React, { Component } from 'react'
import * as d3 from 'd3';

const width = 268;
const height = 197;
const margin = {top:20, left:10, right:10, bottom:20}
const innerRadius = 0;
const outerRadius = (Math.min(width, height)-margin.top-margin.bottom) / 2.2;
const labelRadius = (innerRadius * 0.4 + outerRadius * 0.6);
const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
export default class MeterView extends Component {

    state = {
        data:this.props.data,
        highlight:this.props.highlight,
        colorMap:null
    }

    static getDerivedStateFromProps(props, state){
        if (props.data !== state.data){
            var stats = {}
            for (let i in props.data){
                var meter = props.data[i].meter;
                if (meter in stats){
                    stats[meter] ++;
                }
                else{
                    stats[meter] = 1;
                }
            }
            var converted = [];
            for (let i in stats){
                converted.push([i, stats[i]])
            }
            var testData = converted;
            var allValues = []
            for (let i in testData){
                allValues.push(testData[i][1])
            }
            var least = Math.min.apply(null, allValues);
            var most = Math.max.apply(null, allValues);
            const colorMap = d3.scaleLinear().domain([least,most]).range([0.3,0.6]);
            const arcs = d3.pie().value(i => i[1])(testData);
            var svg = d3.select('#meter-svg');
            svg.append("g")
                .attr('transform','translate(130,110)')
                .attr("stroke", 'white')
                .attr("stroke-width", '1px')
                .attr("stroke-linejoin", 'round')
                .selectAll("path")
                .data(arcs)
                .join("path")
                .attr('class', 'meter-paths')
                .attr("fill", d => d3.interpolatePuBuGn(colorMap(d.data[1])))
                .attr("d", arc)
                .attr('data-aos', 'zoom-in')
                .attr('data-aos-delay', (d,idx) => `${idx*300}`)
                .on("mouseover",function(e,d){
                    d3.select(this).attr("fill","orange");
                    d3.select('#meter-tooltip').attr('opacity', '1').text(`${d.data[0]}: ${d.data[1]} Songs`)
                })
                .on("mouseout",function(e,d){
                    d3.select(this).attr("fill",d3.interpolatePuBuGn(colorMap(d.data[1])));
                    d3.select('#meter-tooltip').attr('opacity', '0')
                })
                .append("title")
                .text(d => d[0]);

            svg.append("g")
                .attr('transform','translate(130,110)')
                .attr("font-family", "sans-serif")
                .attr("font-size", 10)
                .attr("text-anchor", "middle")
                .selectAll("text")
                .data(arcs)
                .join("text")
                .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
                .selectAll("tspan")
                .data(d => {
                    const lines = `${d.data[0]}`.split(/\n/);
                    return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
                })
                .join("tspan")
                .attr("x", 0)
                .attr("y", (_, i) => `${i * 1.1}em`)
                .attr("font-weight", (_, i) => i ? null : "bold")
                .text(d => d);
                return {data:props.data, highlight: props.highlight, colorMap:colorMap}
        }
        if (props.highlight !== state.highlight){
            var song = props.data.filter((item) => item.id.toString() === props.highlight)
            if (song.length !== 1){
                song = [{meter:-1}]
            }
            var paths = d3.selectAll('.meter-paths')
            paths.attr("fill", d => {
                if (song[0].meter === d.data[0]){
                    return 'orange'
                }
                else{
                    return d3.interpolatePuBuGn(state.colorMap(d.data[1]))
                }
            })
            return {data:props.data, highlight: props.highlight, colorMap:state.colorMap}
        }
    }

    render() {
        return (
            <div id='meter-svg-parent-div'>
                <svg id='meter-svg' width='100%' height='100%' viewBox='0 0 268 197' preserveAspectRatio="none">
                <text id='meter-tooltip' x='20' y='190' opacity='0'></text>
                </svg>
            </div>
        )
    }
}
