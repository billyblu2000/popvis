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
export default class ChordDurationView extends Component {

    state = {
        data:this.props.data,
        highlight:this.props.highlight,
        colorMap:null
    }

    static getDerivedStateFromProps(props, state){
        if (props.data !== state.data){
            var stats = {}
            for (let i in props.data){
                for (let j in props.data[i].phrases){
                    var chordDuration = props.data[i].phrases[j].chord_duration;
                    if (chordDuration in stats){
                        stats[chordDuration] ++;
                    }
                    else{
                        stats[chordDuration] = 1;
                    }
                }
            }
            var converted = [];
            for (let i in stats){
                converted.push([i, stats[i]])
            }
            var sortedData = d3.sort(converted, (a, b) => d3.ascending(b[1], a[1]));
            var visData = sortedData.slice(0,5);
            var otherData = sortedData.slice(5,sortedData.length);
            var otherSum = d3.sum(otherData, d => d[1])
            var allValues = []
            for (let i in visData){
                allValues.push(visData[i][0])
            }
            var least = Math.min.apply(null, allValues);
            var most = Math.max.apply(null, allValues);
            const colorMap = d3.scaleLinear().domain([least,most]).range([0.2,0.7]);
            visData.push(['other', otherSum])
            const arcs = d3.pie().value(i => i[1])(visData);
            var svg = d3.select('#chord-duration-svg');
            svg.append("g")
                .attr('transform','translate(130,110)')
                .attr("stroke", 'white')
                .attr("stroke-width", '1px')
                .attr("stroke-linejoin", 'round')
                .selectAll("path")
                .data(arcs)
                .join("path")
                .attr('class', 'chord-duration-paths')
                .attr("fill", d => {
                    if (d.data[0] === 'other'){
                        return d3.interpolateGnBu(0)
                    }
                    return d3.interpolateGnBu(colorMap(d.data[0]))
                })
                .attr("d", arc)
                .attr('data-aos', 'zoom-in')
                .attr('data-aos-delay', (d,idx) => `${idx*300}`)
                .on("mouseover",function(e,d){
                    d3.select(this).attr("fill","orange");
                    d3.select('#chord-duration-tooltip').attr('opacity', '1').text(`${d.data[0]}: ${d.data[1]} Phrases`)
                })
                .on("mouseout",function(e,d){
                    d3.select(this).attr("fill", () => {
                        if (d.data[0] === 'other'){
                        return d3.interpolateGnBu(0)
                        }
                    return d3.interpolateGnBu(colorMap(d.data[0]))});
                    d3.select('#chord-duration-tooltip').attr('opacity', '0')
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
            var paths = d3.selectAll('.chord-duration-paths')
            var song = props.data.filter((item) => item.id.toString() === props.highlight)
            console.log(song, song[0])
            if  (song === undefined || song.length !== 1){
                paths.attr("fill", d =>  {
                    if (d.data[0] === 'other'){
                        return d3.interpolateGnBu(0)
                    }
                    return d3.interpolateGnBu(state.colorMap(d.data[0]))
                })
                return {data:props.data, highlight: props.highlight, colorMap:state.colorMap}
            }
            var allDurations = {}
            for (let i in song[0].phrases){
                allDurations[song[0].phrases[i].chord_duration] = song[0].phrases[i].chord_duration
            }
            paths.attr('fill', d => {
                if (d.data[0] in allDurations){
                    return 'orange'
                }
                if (d.data[0] === 'other'){
                    return d3.interpolateGnBu(0)
                }
                return d3.interpolateGnBu(state.colorMap(d.data[0]))
            })
            return {data:props.data, highlight: props.highlight, colorMap:state.colorMap}
        }
    }

    render() {
        return (
            <div id='chord-duration-svg-parent-div'>
                <svg id='chord-duration-svg' width='100%' height='100%' viewBox='0 0 268 197' preserveAspectRatio="none">
                <text id='chord-duration-tooltip' x='20' y='190' opacity='0'></text>
                </svg>
            </div>
        )
    }
}
