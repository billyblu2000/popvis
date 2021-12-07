import React, { Component } from 'react'
import './index.css'
import * as d3 from 'd3'

const width = 500;
const height = 360;
const majorTonics = ['C','G','D', 'A', 'E', 'B/C♭', 'F♯/G♭', 'C♯/D♭', 'A♭', 'E♭', 'B♭', 'F']
const minorTonics = ['a','e','b', 'f♯', 'c♯', 'g♯/a♭', 'd♯/e♭', 'a♯/b♭', 'f', 'c', 'g', 'd']
const majorTonicsMap = {0:0, 1:7, 2:2, 3:9, 4:4, 5:11, 6:6, 7:1, 8:8,9:3,10:10, 11:5}
const minorTonicsMap = {0:9, 1:4, 2:11, 3:6, 4:1, 5:8, 6:3,7:10, 8:5, 9:0, 10:7, 11:2}
export default class KeyModeView extends Component {

    state = {
        data: this.props.data,
        highlight:'-1',
        statsMajor:[0,0,0,0,0,0,0,0,0,0,0,0],
        statsMinor:[0,0,0,0,0,0,0,0,0,0,0,0],
    }

    static getDerivedStateFromProps(props, state){
        var least, most, colorMap, song
        if (props.data !== state.data){
            var statsMajor = [0,0,0,0,0,0,0,0,0,0,0,0]
            var statsMinor = [0,0,0,0,0,0,0,0,0,0,0,0]
            for (var i=0; i<props.data.length; i++){
                song = props.data[i];
                for (var j=0; j<song.phrases.length; j++){
                    var phrase = song.phrases[j]
                    if (phrase.mode === 'maj'){
                        statsMajor[majorTonicsMap[phrase.tonic]] ++;
                        }
                    else{
                        statsMinor[minorTonicsMap[phrase.tonic]] ++;
                    }
                }
            }
            least = Math.min(Math.min.apply(null, statsMajor),  Math.min.apply(null, statsMinor))
            most = Math.max(Math.max.apply(null, statsMajor),  Math.max.apply(null, statsMinor))
            colorMap = d3.scaleLinear().domain([least,most]).range([0.1,0.9])
            d3.selectAll('.key-note-view-major-path')
                .attr("fill", (d,i) => d3.interpolateBlues(colorMap(statsMajor[i])))
                .on("mouseover",function(e,d){
                    d3.select(this).attr("fill","orange");
                    d3.select('#key-mode-tooltip').attr('opacity', '1').text(d.data + ': ' + statsMajor[d.index] + ' Phrases')
                })
                .on("mouseout",function(e,d){
                    d3.select(this).attr("fill",d3.interpolateBlues(colorMap(statsMajor[d.index])));
                    d3.select('#key-mode-tooltip').attr('opacity', '0')
                })
            d3.selectAll('.key-note-view-minor-path')
                .attr("fill", (d,i) => d3.interpolateBlues(colorMap(statsMinor[i])))
                .on("mouseover",function(e,d){
                    d3.select(this).attr("fill","orange");
                    d3.select('#key-mode-tooltip').attr('opacity', '1').text(d.data + ': ' + statsMinor[d.index] + ' Phrases')
                })
                .on("mouseout",function(e,d){
                    d3.select(this).attr("fill",d3.interpolateBlues(colorMap(statsMinor[d.index])));
                    d3.select('#key-mode-tooltip').attr('opacity', '0')
                })
            return {data:props.data, statsMinor:statsMinor, statsMajor:statsMajor}
        }
        if (props.highlight !== state.highlight){
            least = Math.min(Math.min.apply(null, state.statsMajor),  Math.min.apply(null, state.statsMinor))
            most = Math.max(Math.max.apply(null, state.statsMajor),  Math.max.apply(null, state.statsMinor))
            colorMap = d3.scaleLinear().domain([least,most]).range([0.1,0.9])
            song = state.data.filter((item) => item.id.toString() === props.highlight)
            if (song.length !== 1){
                d3.selectAll('.key-note-view-major-path')
                    .attr("fill", (d,i) => {
                        return d3.interpolateBlues(colorMap(state.statsMajor[i]));
                    });
                d3.selectAll('.key-note-view-minor-path')
                    .attr("fill", (d,i) => {
                        return d3.interpolateBlues(colorMap(state.statsMinor[i]));
                    });
                return {data:props.data,highlight:props.highlight}
            }
            if (song[0].phrases[0] !== undefined){
                var map = song[0].phrases[0].mode === 'maj'? majorTonicsMap : minorTonicsMap
                var index = map[song[0].phrases[0].tonic]
                if (song[0].phrases[0].mode === 'maj'){
                    d3.selectAll('.key-note-view-major-path')
                        .attr("fill", (d,i) => {
                            return i === index ? 'orange': d3.interpolateBlues(colorMap(state.statsMajor[i]));
                        });
                    d3.selectAll('.key-note-view-minor-path')
                        .attr("fill", (d,i) => {
                            return d3.interpolateBlues(colorMap(state.statsMinor[i]));
                        });
                }
                else{
                    d3.selectAll('.key-note-view-major-path')
                        .attr("fill", (d,i) => {
                            return d3.interpolateBlues(colorMap(state.statsMajor[i]));
                        });
                    d3.selectAll('.key-note-view-minor-path')
                        .attr("fill", (d,i) => {
                            return i === index ? 'orange': d3.interpolateBlues(colorMap(state.statsMinor[i]));
                        });
                }
            }
            else{
                d3.selectAll('.key-note-view-major-path')
                        .attr("fill", (d,i) => {
                            return d3.interpolateBlues(colorMap(state.statsMajor[i]));
                        });
                d3.selectAll('.key-note-view-minor-path')
                        .attr("fill", (d,i) => {
                            return d3.interpolateBlues(colorMap(state.statsMinor[i]));
                        });
            }
            
        }
        return {highlight:props.highlight}
    }

    calcStats = (data) => {

        var statsMajor = [0,0,0,0,0,0,0,0,0,0,0,0]
        var statsMinor = [0,0,0,0,0,0,0,0,0,0,0,0]
        for (var i=0; i<data.length; i++){
            var song = data[i];
            for (var j=0; j<song.phrases.length; j++){
                var phrase = song.phrases[j]
                if (phrase.mode === 'maj'){
                    statsMajor[majorTonicsMap[phrase.tonic]] ++;
                    }
                else{
                    statsMinor[minorTonicsMap[phrase.tonic]] ++;
                }
            }
        }
        return [statsMajor, statsMinor]
    }

    componentDidMount(){

        const innerRadiusMajor = Math.min(width, height) / 3;
        const outerRadiusMajor = Math.min(width, height) / 2;
        const labelRadiusMajor = (innerRadiusMajor + outerRadiusMajor) / 2;
        const arcsMajor = d3.pie().value(1)(majorTonics);
        const arcMajor = d3.arc().innerRadius(innerRadiusMajor).outerRadius(outerRadiusMajor);
        const arcLabelMajor = d3.arc().innerRadius(labelRadiusMajor).outerRadius(labelRadiusMajor);

        const innerRadiusMinor = Math.min(width, height) / 6;
        const outerRadiusMinor = Math.min(width, height) / 3;
        const labelRadiusMinor = (innerRadiusMinor + outerRadiusMinor) / 2;
        const arcsMinor = d3.pie().value(1)(minorTonics);
        const arcMinor = d3.arc().innerRadius(innerRadiusMinor).outerRadius(outerRadiusMinor);
        const arcLabelMinor = d3.arc().innerRadius(labelRadiusMinor).outerRadius(labelRadiusMinor);

        this.svg = d3.select("#key-mode-svg");

        this.svg.append("g")
                .attr('transform', 'translate(258,200)')
                .attr("stroke", 'white')
                .attr("stroke-width", '1px')
                .attr("stroke-linejoin", 'round')
                .selectAll("path")
                .data(arcsMajor)
                .join("path")
                .attr('class','key-note-view-major-path')
                .attr('data-aos','zoom-in')
                .attr('data-aos-delay',(d,i) => `${i*100+600+300}`)
                .attr("d", arcMajor)
                .append("title")
                .text(d => d.data);
        this.svg.append("g")
                .attr('transform', 'translate(258,200)')
                .attr("stroke", 'white')
                .attr("stroke-width", '1px')
                .attr("stroke-linejoin", 'round')
                .selectAll("path")
                .data(arcsMinor)
                .join("path")
                .attr('class','key-note-view-minor-path')
                .attr('data-aos','zoom-in')
                .attr('data-aos-delay',(d,i) => `${i*100+300}`)
                .attr("d", arcMinor)
                .append("title")
                .text(d => d.data);

        this.svg.append("g")
                .attr('transform', 'translate(258,205)')
                .attr("font-family", "sans-serif")
                .attr("font-size", 14)
                .attr("text-anchor", "middle")
                .selectAll("text")
                .data(arcsMajor)
                .join("text")
                    .attr("transform", d => `translate(${arcLabelMajor.centroid(d)})`)
                .selectAll("tspan")
                .data(d => d.data)
                .join("tspan")
                    .attr("x", (_, i, arr) => `${(i - arr.length/2+ 0.5) * 0.7}em`)
                    .attr("y", 0)
                    .attr("font-weight", (_, i) => i ? null : "bold")
                    .text(d => d);
        this.svg.append("g")
                .attr('transform', 'translate(258,205)')
                .attr("font-family", "sans-serif")
                .attr("font-size", 12)
                .attr("text-anchor", "middle")
                .selectAll("text")
                .data(arcsMinor)
                .join("text")
                .attr("transform", d => `translate(${arcLabelMinor.centroid(d)})`)
                .selectAll("tspan")
                .data(d => d.data)
                .join("tspan")
                    .attr("x", (_, i, arr) => `${(i - arr.length/2+ 0.5) * 0.7}em`)
                    .attr("y", 0)
                    .attr("font-weight", (_, i) => i ? null : "bold")
                    .text(d => d);
    }

    render() {
        return (
            <div id='key-mode-svg-parent-div'>
                <svg id='key-mode-svg' width='100%' height='100%' viewBox='0 0 525 380' preserveAspectRatio="none">
                <text id='key-mode-tooltip' x='20' y='380' opacity='0'></text>
                <text  x='215' y='190' opacity='1' fontSize='12px'>Outer for Major</text>
                <text  x='215' y='205' opacity='1' fontSize='12px'>Inner for Minor</text>
                </svg>
            </div>
        )
    }
}
