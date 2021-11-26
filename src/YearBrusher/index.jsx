import React, { Component } from 'react'
import * as d3 from "d3";
import PubSub from 'pubsub-js';

const margin={top:5, left:20,right:20,bottom:12}
export default class YearBrusher extends Component {

    constructor(props){
        super(props);
        this.parseDate = d3.timeParse('%Y-%m');
        this.formatDate = d3.timeFormat('%Y-%m');
        this.preprocess();
        this.xAxisScale = d3.scaleTime()
                       .domain([new Date(this.minMonth), new Date(this.maxMonth)])
                       .range([margin.left, 600-margin.right]);
        this.yAxisScale = d3.scaleLinear()
                       .domain([0, this.maxCount])
                       .range([70-margin.bottom, margin.top]);
    }

    preprocess(){
        var months = this.props.data.map((item)=>{
            return this.parseDate(item.publish_year.toString() +'-'+ item.publish_month.toString());
        })
        this.minMonth = Math.min.apply(null,months);
        this.maxMonth = Math.max.apply(null,months);
        var monthsStats = months.reduce((obj, month) => { 
            if (month.getTime() in obj) {
                obj[month.getTime()] ++
            } 
            else {
                obj[month.getTime()] = 1
            }
            return obj
        }, {})
        this.maxCount = Math.max.apply(null, Object.values(monthsStats));
        this.countPublishs = [];
        var memo = {}
        months.forEach(item => {
            if (item.getTime() in memo){
                return
            }
            else{
                this.countPublishs.push([item,monthsStats[item.getTime()]])
                memo[item.getTime()] = 1
            }
        })
    }

    componentDidMount(){
        
        this.svg = d3.select('#year-brusher-svg')
                    .on("touchstart", event => event.preventDefault())
                    .on("pointermove", this.pointermoved)
                    .on('mouseenter', this.mouseEnter)
                    .on('mouseleave', this.mouseLeave);
                     
        this.svg.append("g")
                .attr("transform", `translate(0,${70-margin.bottom})`)
                .call(d3.axisBottom(this.xAxisScale).ticks(d3.timeYear.every(3)).tickSize(4))
                .call(g => g.selectAll(".tick line")
                            .attr("stroke", '#777777'))
                .call(g => g.selectAll(".domain")
                            .attr("stroke", '#777777'))
                .call(g => g.selectAll(".tick text")
                            .attr("fill", '#777777')
                            .attr("font-size", '5px'))
        
        this.svg.append("path")
                .attr('id','year-brusher-selected')
                .attr("fill", "url('#myGradient-selected')")
                .datum(this.countPublishs)
                .attr("d", this.area(this.xAxisScale, this.yAxisScale));
                                

        this.svg.append("path")
                .attr('id','year-brusher-other')
                .attr("fill", "url('#myGradient-other')")
                .datum([])
                .attr("d", this.area(this.xAxisScale, this.yAxisScale))
                
        this.rule = this.svg.append("g");
        this.rule.append("line")
                 .attr("y1", margin.top+5)
                 .attr("y2", 70 - margin.bottom)
                 .attr("stroke", "#777777")
                 .attr('stroke-width','0.5px')
                 .attr('opacity','0');
        this.rule.append("line")
                 .attr("y1", margin.top+5)
                 .attr("y2", margin.top+5)
                 .attr("x1", 0)
                 .attr("x2", 20)
                 .attr("stroke", "#777777")
                 .attr('stroke-width','0.5px')
                 .attr('opacity','0');
        
        this.tooltip = this.svg.append("text")
                         .attr("y", 8)
                         .attr('font-size','6px')
                         .attr('fill','#777777')
                         .attr('opacity','0');
        
        this.svg.append("g")
                .call(d3.brushX()
                        .extent([[margin.left, margin.top+5], [600 - margin.right, 70 - margin.bottom]])
                        .on('brush', this.brushed)
                        .on("end", this.brushended));
        
        PubSub.publish('yearFilterChange', [new Date(this.minMonth), new Date(this.maxMonth)]);
    }
    area = (x, y) => {
        return d3.area()
                 .x(d => x(d[0]))
                 .y0(y(0))
                 .y1(d => y(d[1]))
                 .curve(d3.curveBasis);
    }

    brushed = (event) =>{
        // if (event.selection){
        //     var start = this.xAxisScale.invert(event.selection[0])
        //     var end = this.xAxisScale.invert(event.selection[1])
        //     var selectedData = this.countPublishs.filter((item) => {
        //         return item[0] >= start && item[0] <= end;
        //     })
        //     var otherData = this.countPublishs.filter((item) => {
        //         return item[0] < start || item[0] > end;
        //     })
        //     console.log(selectedData);
        //     var elem = document.getElementById("year-brusher-selected"); 
        //     if (elem !== null){ elem.parentNode.removeChild(elem); }
        //     elem = document.getElementById("year-brusher-other"); 
        //     if (elem !== null){ elem.parentNode.removeChild(elem); }
        //     this.svg.append("path")
        //             .attr('id','year-brusher-selected')
        //             .attr("fill", "url('#myGradient-selected')")
        //     this.svg.append("path")
        //             .attr('id','year-brusher-other')
        //             .attr("fill", "url('#myGradient-other')")
                                
        // }
    }

    brushended = (event) => {
        if (event.selection){
            var start = this.xAxisScale.invert(event.selection[0])
            var end = this.xAxisScale.invert(event.selection[1])
            PubSub.publish('yearFilterChange', [start, end]);
        }
        else{
            PubSub.publish('yearFilterChange', [new Date(this.minMonth), new Date(this.maxMonth)]);
        }
    }
    pointermoved = (event) => {
        var xPosition = d3.pointer(event)[0];
        this.rule.attr("transform", `translate(${xPosition},0)`);
        var xText = this.formatDate(this.xAxisScale.invert(xPosition))
        if (this.tooltip.attr('text') !== xText){
            this.tooltip
                .attr('x',xPosition)
                .attr('text', xText)
                .text(xText);
        }
    }
    mouseEnter = () => {
        this.rule.selectAll('line').attr('opacity','1');
        this.tooltip.attr('opacity','1');
    }
    mouseLeave = () => {
        this.rule.selectAll('line').attr('opacity','0');
        this.tooltip.attr('opacity','0');
    }

    render() {
        return (
            <div id='year-brusher-svg-parent-div'>
                <svg id='year-brusher-svg' width='100%' height='100%' viewBox='0 0 600 70' preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="myGradient-selected" gradientTransform="rotate(90)">
                            <stop offset="30%" stopColor="rgb(52, 105, 203)" stopOpacity='1' />
                            <stop offset="100%"  stopColor="rgb(52, 105, 203)" stopOpacity='0.1'/>
                            
                        </linearGradient>

                        <linearGradient id="myGradient-other" gradientTransform="rotate(90)">
                            <stop offset="30%" stopColor="rgb(52, 0, 203)" stopOpacity='1' />
                            <stop offset="100%"  stopColor="rgb(52, 0, 203)" stopOpacity='0.1'/>
                            
                        </linearGradient>
                    </defs>
                </svg>
            </div>
        )
    }
}
