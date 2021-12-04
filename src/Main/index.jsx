import React from 'react';
import { Divider, Spin, Badge, Tooltip, notification, Button } from 'antd';
import { LoadingOutlined, QuestionCircleOutlined, BulbOutlined } from '@ant-design/icons';
import PubSub from 'pubsub-js';
import * as d3 from 'd3';
import AOS from 'aos';
import SongSelector from '../SongSelector'
import PhraseSelector from '../PhraseSelector';
import ModeSelector from '../ModeSelector';
import YearBrusher from '../YearBrusher';
import SongView from '../SongView';
import KeyModeView from '../KeyModeView';
import MelodyView from '../MelodyView';
import MeterView from '../MeterView';
import ChordDurationView from '../ChordDurationView';
import PitchRangeView from '../PitchRangeView';
import ChordView from '../ChordView';
import Logo from '../Logo';
import { themeColor, server } from '../utils';
import './index.css';
import 'aos/dist/aos.css';

const loading1 = <div style={{textAlign:'center', paddingTop:'20px'}}><Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} tip='Loading...'/></div>
const loading2 = <div style={{textAlign:'center', paddingTop:'250px'}}><Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} tip='Loading...'/></div>
const loading3 = <div style={{textAlign:'center', paddingTop:'100px'}}><Spin indicator={<LoadingOutlined style={{ fontSize: 30 }} spin />} tip='Loading...'/></div>
const closebtn = <Button type="primary" size="small" onClick={() => notification.close('help')}>Ok</Button>
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
        this.showWelcome();
    }

    showWelcome(){
        notification.open({
            key:'welcome',
            message: 'Welcome to POPVIS!',
            description:
              'POPVIS is a visualzation of the POP909 Dataset created by Music-X-Lab, NYU Shanghai. If you are confused about the design logic, you may find it helpful by clicking the view title or the card ribbon. For some views, you may click the button next to the view title to enter the fullscreen mode.',
            duration:10,
            icon: <BulbOutlined style={{color:'green'}}/>
          });
    }
    showHelp(des){
        notification.open({
            message: 'User Guid',
            description:des,
            duration:0,
            btn:closebtn,
            key:'help',
            onClose: () => {},
            icon: <QuestionCircleOutlined style={{color:'#1890ff'}}/>
        });
    }
    showSelectorHelp = () => {
        this.showHelp('1111')
    }
    showStatisticsHelp = () => {
        this.showHelp('1111')
    }
    showSongHelp = () => {
        this.showHelp('1111')
    }
    showChordProgressionHelp = () => {
        this.showHelp('1111')
    }
    showMelodyHelp = () => {
        this.showHelp('1111')
    }
    showKeyModeHelp = () => {
        this.showHelp('1111')
    }
    showPitchRangeHelp = () => {
        this.showHelp('1111')
    }
    showChordDurationHelp = () => {
        this.showHelp('1111')
    }
    showMeterHelp = () => {
        this.showHelp('1111')
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
                <div data-aos-once={true} data-aos='flip-down' data-aos-delay={400}>
                <Badge.Ribbon text={<div onClick={this.showSelectorHelp} className='card-title'><Tooltip title = 'Click to show help' color='blue'>Selector</Tooltip></div>}>
                    <div className='year-brusher card' >
                    {this.state.data.length === 0 ? loading1:
                        <div id='year-brusher-box'>
                            <YearBrusher 
                                data={this.state.data}
                            />
                        </div>
                    }
                        <div className='main-display-selector'>
                            <div className='phrase-selector'>
                                <PhraseSelector/>
                            </div>
                            <Divider type='vertical' style={{float:'left', marginTop:'14px', backgroundColor:'gray', marginLeft:'1%'}}></Divider>
                            <div className='mode-selector'>
                                <ModeSelector/>
                            </div>
                        </div>
                    </div>
                    </Badge.Ribbon>
                </div>
                <div data-aos-once={true} data-aos='flip-right' data-aos-delay={600}>
                <Badge.Ribbon text={<div onClick={this.showStatisticsHelp} className='card-title'><Tooltip title = 'Click to show help' color='green'>Statistics</Tooltip></div>} color='green'>
                    <div className='main-display card' >
                    {this.state.data.length === 0 ? loading2:
                        <>
                            <div className='song-selector' style={{backgroundColor:themeColor[10]}}>
                                <SongSelector data={this.state.dataFiltered} highlightChange={(h) => {this.onHighlightChange(h)}} yearFilter={this.state.yearFilter}/>
                            </div>
                            <div className='song-selector-right'>
                                <div className='main-display-major'>
                                    <div className='chord-view view' data-aos='flip-down' data-aos-delay={700} data-aos-once={true}>
                                        <div className='view-title' onClick={this.showChordProgressionHelp}><Tooltip title = 'Click to show help' color='blue'>Chord Progressions: Click to explore</Tooltip></div>
                                        <ChordView data={this.state.dataFiltered}/>
                                    </div>
                                    <div className='melody-view view' data-aos='flip-right' data-aos-delay={800} data-aos-once={true}>
                                        <div className='view-title' onClick={this.showMelodyHelp}><Tooltip title = 'Click to show help' color='blue'>Melody Pieces: Hover to highlight</Tooltip></div>
                                        <MelodyView data={this.state.dataFiltered}/>
                                    </div>
                                </div>
                                <div className='main-display-minor'>
                                    <div className='key-mode-view view' data-aos='flip-up' data-aos-delay={100} data-aos-once={true}>
                                        <div className='view-title' onClick={this.showKeyModeHelp}><Tooltip title = 'Click to show help' color='blue'>Keys and Modes</Tooltip></div>
                                        <KeyModeView data={this.state.dataFiltered} highlight={this.state.highlight}/>
                                    </div>
                                    <div className='little-view-group'>
                                        <div className='pitch-range-view view' data-aos='flip-up' data-aos-delay={200} data-aos-once={true}>
                                            <div className='view-title' onClick={this.showPitchRangeHelp}><Tooltip title = 'Click to show help' color='blue'>Pitch range: Dynamics of Melody</Tooltip></div>
                                            <PitchRangeView data={this.state.dataFiltered} highlight={this.state.highlight}/>
                                        </div>
                                        <div className='pie-view-group'>
                                            <div className='chord-duration-view view' data-aos='flip-down' data-aos-delay={300} data-aos-once={true}>
                                                <div className='view-title' onClick={this.showChordDurationHelp}><Tooltip title = 'Click to show help' color='blue'>Chord Duration: Pie Chart</Tooltip></div>
                                                <ChordDurationView data={this.state.dataFiltered} highlight={this.state.highlight}/>
                                            </div>
                                            <div className='meter-view view' data-aos='flip-down' data-aos-once={true}>
                                                <div className='view-title' onClick={this.showMeterHelp}><Tooltip title = 'Click to show help' color='blue'>Meters: Pie Chart</Tooltip></div>
                                                <MeterView data={this.state.dataFiltered} highlight={this.state.highlight}/>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    </div>
                    </Badge.Ribbon>
                </div>
                <div data-aos='flip-up' data-aos-once={true} data-aos-offset={300}>
                    <Badge.Ribbon text={<div onClick={this.showSongHelp} className='card-title'><Tooltip title = 'Click to show help' color='gold'>Statistics</Tooltip></div>} color='gold'>
                    <div className='song-display card'>
                    {this.state.data.length === 0 ? loading3:<SongView data={this.state.data} song={this.state.songSelect}/>
                    }
                    </div>
                    </Badge.Ribbon>
                </div>
                <div className='footer' >POP-909 Dataset: Wang, Ziyu, et al. "Pop909: A pop-song dataset for music arrangement generation." arXiv preprint arXiv:2008.07142 (2020).</div>
                <div className='footer' style={{paddingBottom:'30x',}}>POP909 Dataset Phrase Analysis: Dai, Shuqi, et al "Automatic Analysis and Influence of Hierarchical Structure on Melody, Rhythm and Harmony in Popular Music." arXiv preprint arXiv:2010.07518 (2020).</div>
                <div className='footer'><span style={{float:'left', paddingTop:'10px', paddingBottom:'100px'}}>NYU Shanghai ｜ Information Visualization Final Project</span> <span style={{float:'right', paddingTop:'10px', paddingBottom:'100px'}}> Copyright @ Billy Yi | 易立</span></div>
            </div>
        )
    }
    
}

