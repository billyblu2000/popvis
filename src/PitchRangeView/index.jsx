import React, { Component } from 'react';
import * as d3 from 'd3';
import { themeColor } from '../utils';

const width = 535;
const height = 197;
const margin = {top:40, left:50, right:30, bottom:20}
export default class PitchRangeView extends Component {

    state = {
        data:this.props.data,
        highlight:this.props.highlight
    }

    static getDerivedStateFromProps(props, state){
        if (props.data !== state.data){
            remove(['pitch-range-view-axis','pitch-range-view-rect','pitch-range-view-label']);
            var stats = []
            for (let i in props.data){
                for (let j in props.data[i].phrases){
                    var range = props.data[i].phrases[j].pitch_range;
                    stats.push(range)
                }
            }
            var converted = [];
            for (let i in stats){
                if (stats[i] !== 0){
                    converted.push(stats[i]);
                }
            }
            var testData = converted;
            var maxRange = Math.max.apply(null, testData);
            const I = d3.range(testData.length);
            const X = d3.map(testData, d=>d);
            const Y = d3.map(testData, d=>1);
            const bins = d3.bin().thresholds(maxRange).value(i => X[i])(I);

            const xDomain = [bins[0].x0, bins[bins.length - 1].x1];
            const yDomain = [0, d3.max(bins, I => d3.sum(I, i => Y[i]))];
            const xScale = d3.scaleLinear(xDomain, [margin.left, width - margin.right]);
            const yScale = d3.scaleLinear(yDomain, [height - margin.bottom, margin.top]);
            const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
            const yAxis = d3.axisLeft(yScale).ticks(height / 40);

            var svg = d3.select('#pitch-range-svg')
            svg.append("g")
                .attr('id', 'pitch-range-view-axis')
                .attr("transform", `translate(${margin.left},0)`)
                .call(yAxis)
                .call(g => g.select(".domain").remove())
                .call(g => g.selectAll(".tick line").clone()
                    .attr("x2", width - margin.left - margin.right)
                    .attr("stroke-opacity", 0.1))
                .call(g => g.append("text")
                    .attr("x", margin.left)
                    .attr("y", 30)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "start"));

            svg.append("g")
                .attr('id', 'pitch-range-view-rect')
                .attr("fill", themeColor[5])
                .selectAll("rect")
                .data(bins)
                .join("rect")
                .attr("data-aos", 'zoom-in-up')
                .attr("data-aos-delay", d => d.x0*50)
                .attr("x", d => xScale(d.x0) + 0.5)
                .attr("width", d => Math.max(0, xScale(d.x1) - xScale(d.x0) - 0.5 - 0.5))
                .attr("y", d => yScale(d3.sum(d, i => Y[i])))
                .attr("height", d => yScale(0) - yScale(d3.sum(d, i => Y[i])))
                .on("mouseover",function(e,d){
                    console.log(d)
                    d3.select(this).attr("fill", 'orange')
                    d3.select('#pitch-range-tooltip').attr('opacity', '1').text(`[${d.x0},${d.x1}): ${d3.sum(d, i => Y[i])}`);
                })
                .on("mouseout",function(e,d){
                    d3.select(this).attr("fill", themeColor[5])
                    d3.select('#pitch-range-tooltip').attr('opacity', '0');
                })
                .append("title")
                .text((d, i) => [`${d.x0} ≤ x < ${d.x1}`].join("\n"));

            svg.append("g")
                .attr('id', 'pitch-range-view-label')
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(xAxis)
                .call(g => g.append("text")
                    .attr("x", width - margin.right)
                    .attr("y", 27)
                    .attr("fill", "currentColor")
                    .attr("text-anchor", "end"));

            return {data:props.data, highlight:props.highlight}
        }
        if (props.highlight !== state.highlight){
            return {data:props.data, highlight:props.highlight}
        }
        return {data:props.data, highlight:props.highlight}
    }

    render() {
        return (
            <div id='pitch-range-svg-parent-div'>
                <svg id='pitch-range-svg' width='100%' height='100%' viewBox='0 0 535 197' preserveAspectRatio="none">
                <text id='pitch-range-tooltip' x='450' y='20' opacity='0'></text>
                </svg>
            </div>
        )
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