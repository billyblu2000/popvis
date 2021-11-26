import React, { Component } from 'react'

export default class Logo extends Component {
    render() {
        return (
            <div style={{...this.props.style}}>
                <svg width={`${265*this.props.scale}`} height={`${514*this.props.scale}`} xmlns="http://www.w3.org/2000/svg" p-id="2612" version="1.1" className="icon" t="1637598946996">
                    <g>
                        <title>Layer 1</title>
                        <g transform={`scale(${this.props.scale})`}>
                            <g transform="rotate(-10.9933 133.009 261.703)" stroke="null" id="svg_4">
                                <ellipse stroke="null" transform="matrix(0.978843 -0.20694 0.204614 0.989973 -60.9424 106.009)" ry="80.62528" rx="49.04126" id="svg_2" cy="58.41445" cx="221.87915" fill="#003a8c"/>
                                <path stroke="null" id="svg_1" fill="#003a8c" p-id="2613" d="m-25.21157,385.52743l143.54639,127.62276l0.2097,0.85981l31.0519,-7.7464l-72.95014,-299.11262c32.55553,21.2682 76.64091,31.11797 118.10777,20.77339c71.63232,-17.86985 107.54542,-88.81399 93.45645,-146.58208c-14.08607,-57.75617 -73.76928,-84.31403 -145.41057,-66.44195c-71.63232,17.86985 -127.48733,73.25059 -113.40126,131.00677l68.87714,284.39781l-102.48413,-91.10618l-21.00244,46.3285l-0.00081,0.0002zm177.46029,-331.88306c51.17781,-12.76714 97.69289,3.23174 105.51529,35.30538c7.8253,32.08555 -21.27342,87.49784 -72.45123,100.26497c-51.16845,12.7648 -102.41743,-22.60344 -110.24273,-54.689c-7.82252,-32.07416 26.01023,-68.11655 77.17867,-80.88135z"/>
                            </g>
                        </g>
                    </g>
                </svg>
            </div>
        )
    }
}