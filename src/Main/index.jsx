import React from 'react';
import { Divider, Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import PubSub from 'pubsub-js';
import * as d3 from 'd3'
import AOS from 'aos'

import SongSelector from '../SongSelector'
import PhraseSelector from '../PhraseSelector';
import ModeSelector from '../ModeSelector';
import YearBrusher from '../YearBrusher';
import SongView from '../SongView';
import Logo from '../Logo';
import { themeColor, server } from '../utils';

import './index.css';
import 'aos/dist/aos.css';

const loading1 = <div style={{textAlign:'center', paddingTop:'20px'}}><Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} tip='Loading...'/></div>
const loading2 = <div style={{textAlign:'center', paddingTop:'250px'}}><Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} tip='Loading...'/></div>
const loading3 = <div style={{textAlign:'center', paddingTop:'100px'}}><Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} tip='Loading...'/></div>
export default class Main extends React.Component {

    state = {
        data:[],
        dataFiltered:[],
        yearFilter:null,
        phraseFilter:[true,true,true,true,true],
        modeFilter:[true,true],
        highlight:'-1',
        songSelect:'-1',
    }
    parseDate = d3.timeParse('%Y-%m-%d');

    componentDidMount(){
        AOS.init({
            offset: 0,
            duration: 200,
            easing: 'ease-in-quad',
            delay: 0,
          });
        server('/data', this, 'data');
        this.yearFilterChangeSub = PubSub.subscribe('yearFilterChange', this.onYearFilterChange);
        this.phraseFilterChangeSub = PubSub.subscribe('phraseFilterChange', this.onPhraseFilterChange);
        this.modeFilterChangeSub = PubSub.subscribe('modeFilterChange', this.onModeFilterChange);
        this.songSelectChangeSub = PubSub.subscribe('songSelectChange', this.onSongSelectChange);
    }

    onYearFilterChange = (name, msg) => {
        this.filterData(msg, this.state.phraseFilter, this.state.modeFilter, 'yearFilter', msg);
    }
    onPhraseFilterChange = (name, msg) => {
        this.filterData(this.state.yearFilter, msg, this.state.modeFilter, 'phraseFilter', msg);
    }
    onModeFilterChange = (name, msg) => {
        this.filterData(this.state.yearFilter, this.state.phraseFilter, msg, 'modeFilter', msg);
    }
    onHighlightChange = (h) => {
        this.setState({highlight:h});
    }
    onSongSelectChange = (name, msg) => {
        this.setState({songSelect:msg});
    }

    filterData = (year, phrase, mode, from, msg) => {
        var filtered = []
        for(var i = 0; i < this.state.data.length; i++) {
            var flag = true;
            var dataCopy = JSON.parse(JSON.stringify(this.state.data[i]));
            var songDate = this.parseDate(dataCopy.publish_date);
            if (songDate < year[0] ||  songDate > year[1]){
                flag = false;
            }
            var newPhrases = [];
            for (var j =0; j < dataCopy.phrases.length; j++){
                if ((mode[0] === true && dataCopy.phrases[j].mode === 'maj')
                    || (mode[1] === true && dataCopy.phrases[j].mode === 'min')){
                        var label = dataCopy.phrases[j].label;
                        if ((phrase[0] === true && (label === 'i' || label === 'I'))
                        || (phrase[1] === true && (label === 'a' || label === 'A'))
                        || (phrase[2] === true && (label === 'b' || label === 'B'))
                        || (phrase[3] === true && (label === 'o' || label === 'O'))
                        || (phrase[4] === true && (label !== 'i' && label !== 'I' 
                                                && label !== 'a' && label !== 'A' 
                                                && label !== 'b' && label !== 'B' 
                                                && label !== 'o' && label !== 'O'))){
                            newPhrases.push(dataCopy.phrases[j]);
                        }
                }
            }
            dataCopy.phrases = newPhrases;
            if (flag === true){
                filtered.push(dataCopy)
            }
        }
        this.setState({dataFiltered:filtered, [from]:msg});
    }

    componentWillUnmount(){
        PubSub.unsubscribe(this.yearFilterChangeSub);
        PubSub.unsubscribe(this.phraseFilterChangeSub);
        PubSub.unsubscribe(this.modeFilterChangeSub);
        PubSub.unsubscribe(this.songSelectChangeSub);
    }

    render(){
        return (
            <div className='main'>
                <div className='header'>
                    <div style={{float:'left', minWidth:'2%',minHeight:'100%', backgroundColor:themeColor[10]}}></div>
                    <div style={{float:'left', minWidth:'40%'}}>
                        <div style={{float:'left', marginLeft:'5%'}}>
                            <Logo scale={0.2} style={{float:'left',marginTop:'10px'}}/>
                        </div>
                        <div style={{float:'left', marginLeft:'5px'}}>
                            <h1 className='main-title' style={{color:themeColor[8]}}>OPVIS</h1>
                            <Divider style={{marginTop:'0px',marginBottom:'10px', lineHeight:'1px'}} />
                            <h5 className='main-des'>A visualization of POP909 dataset</h5>
                        </div>
                    </div>
                    <div style={{float:'right', marginLeft:'20px', minWidth:'50%',minHeight:'100%', backgroundColor:themeColor[10]}}></div>
                </div>
                <div className='year-brusher card' data-aos-once={true} data-aos='flip-down' data-aos-delay={400}>
                {this.state.data.length === 0 ? loading1:
                    <div id='year-brusher-box'>
                        <YearBrusher 
                            data={this.state.data}
                        />
                    </div>
                }
                </div>
                <div className='main-display card' data-aos-once={true} data-aos='flip-right' data-aos-delay={600}>
                {this.state.data.length === 0 ? loading2:
                    <>
                        <div className='song-selector' style={{backgroundColor:themeColor[10]}}>
                            <SongSelector data={this.state.dataFiltered} highlightChange={(h) => {this.onHighlightChange(h)}} yearFilter={this.state.yearFilter}/>
                        </div>
                        <div className='song-selector-right'>
                            <div className='main-display-selector'>
                                <div className='phrase-selector'>
                                    <PhraseSelector/>
                                </div>
                                <Divider type='vertical' style={{float:'left', marginTop:'14px', backgroundColor:'gray', marginLeft:'1%'}}></Divider>
                                <div className='mode-selector'>
                                    <ModeSelector/>
                                </div>
                            </div>
                            <div className='main-display-major'>
                                <div className='chord-view view' data-aos='flip-down' data-aos-delay={700} data-aos-once={true}>
                                    <div className='view-title'>Chord Progressions: Click to explore</div>
                                </div>
                                <div className='melody-view view' data-aos='flip-right' data-aos-delay={800} data-aos-once={true}>
                                    <div className='view-title'>Melody Pieces: Hover to highlight</div>
                                </div>
                            </div>
                            <div className='main-display-minor'>
                                <div className='key-mode-view view' data-aos='flip-up' data-aos-once={true}>
                                    <div className='view-title'>Keys and Modes</div>
                                </div>
                                <div className='little-view-group'>
                                    <div className='pitch-range-view view' data-aos='flip-up' data-aos-once={true}>
                                        <div className='view-title'>Pitch range: Dynamics of Melody</div>
                                    </div>
                                    <div className='pie-view-group'>
                                        <div className='chord-duration-view view' data-aos='flip-down' data-aos-once={true}>
                                            <div className='view-title'>Chord Duration: Pie Chart</div>
                                        </div>
                                        <div className='meter-view view' data-aos='flip-down' data-aos-once={true}>
                                            <div className='view-title'>Meters: Pie Chart</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                }
                </div>
                
                <div className='song-display card' data-aos='flip-up' data-aos-once={true} data-aos-offset={300}>
                {this.state.data.length === 0 ? loading3:<SongView data={this.state.data} song={this.state.songSelect}/>
                }
                </div>
                <div className='footer'><span style={{float:'left'}}>NYU Shanghai ｜ Information Visualization Final Project</span> <span style={{float:'right'}}> Copyright @ Billy Yi | 易立</span></div>
            </div>
        )
    }
    
}

