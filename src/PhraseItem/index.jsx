import { Statistic, Tooltip, Typography } from 'antd';
import React, { Component } from 'react';
import './index.css';
const { Text } = Typography
const tonicMap = { 0:'C',1:'D♭',2:'D',3:'E♭',4:'E',5:'F',6:'F♯',7:'G',8:'A♭',9:'A',10:'B♭',11:'B' }
const modeMap = { maj:' Major', min:' Minor' }
export default class PhraseItem extends Component {

    state = {playing:'stop'}

    changeDisplay = () => {
        if (this.props.displayed === false){
            this.props.changeDisplay(this.props.id)
        }
    }
    collapse = () => {
        this.props.changeDisplay('-1');
    }
    testVocal = () => {
        return /[A-Z]/.test(this.props.label) ? 'has-vocal':'no-vocal'
    }
    testVocalUI = () => {
        return /[A-Z]/.test(this.props.label) ? 'Vocal ':'Instrumental '
    }
    getProgression = () => {
        var progressionStr = ''
        for (var i=0; i < this.props.item.chord_progression.length; i++){
            progressionStr = progressionStr + ' - ' + this.props.item.chord_progression[i]
        }
        console.log(progressionStr)
        return progressionStr.substring(2)
    }
    play = (e) =>{
        if (this.state.playing === 'stop'){
            this.mp3 = new Audio(`/api/popvis_back_end/chordprogression/${this.props.songId}/${this.props.id}`);
            this.mp3.play();
            this.mp3.addEventListener('ended', (event) => {
                this.setState({
                        playing:'stop'
                    })
                });
            this.setState({
                playing:'playing'
            })
        }
        else if (this.state.playing === 'pause'){
            this.mp3.play();
            this.setState({
                playing:'playing'
            })
        }
        else if (this.state.playing === 'playing'){
            this.setState({
                playing:'pause'
            })
            this.mp3.pause();
        }
    }

    render() {
        return (
            <div data-aos="flip-left" data-aos-delay={parseInt(this.props.id)*50} data-aos-once={true} style={{display:'inline-block'}}>
                <Tooltip title={`${this.testVocalUI()}${mapType(this.props.label)} with ${this.props.length} bars`}>
                
                {this.props.displayed ? 
                    <div className={`song-display-phrase-item song-display-phrase-item-${mapType(this.props.label)}`} style={{
                        minWidth: '400px', maxWidth: '400px',
                    }} onClick={this.changeDisplay}>
                        <div data-aos='fade-in-out' data-aos-duration={400} data-aos-once={true}>
                            <Tooltip title={'Click to Collapse'} placement='bottom'><h1 className='phrase-item-title' onClick={this.collapse}>{mapTypeCap(this.props.label) + ' Phrase'}</h1></Tooltip>
                            <p>
                                <Statistic title={<div style={{lineHeight:'5px'}}>Length</div>} 
                                    value={this.props.length + ' Bars'} 
                                    valueStyle={{color:'rgba(0,0,0,0.7)', fontFamily:'zillaslab,palatino,"Palatino Linotype",serif'}} 
                                    style={{display:'inline-block', width:'45%', marginLeft:'5%'}} />
                                <Statistic title={<div style={{lineHeight:'5px'}}>Tonic/Mode</div>} 
                                    value={tonicMap[this.props.item.tonic] + ' ' + modeMap[this.props.item.mode]} 
                                    valueStyle={{color:'rgba(0,0,0,0.7)', fontFamily:'zillaslab,palatino,"Palatino Linotype",serif'}} 
                                    style={{display:'inline-block', width:'45%', marginRight:'5%'}} />
                            </p>
                            <p>
                                <Statistic title={<div style={{lineHeight:'5px'}}>Chord Duration</div>} 
                                    value={this.props.item.chord_duration + ' Quarters'} 
                                    valueStyle={{color:'rgba(0,0,0,0.7)', fontFamily:'zillaslab,palatino,"Palatino Linotype",serif'}} 
                                    style={{display:'inline-block',width:'45%', marginLeft:'5%'}} />
                                <Statistic title={<div style={{lineHeight:'5px'}}>Pitch Range</div>} 
                                    value={this.props.item.pitch_range} 
                                    valueStyle={{color:'rgba(0,0,0,0.7)', fontFamily:'zillaslab,palatino,"Palatino Linotype",serif'}} 
                                    style={{display:'inline-block',width:'45%', marginRight:'5%'}} />
                            </p>
                            <div style={{textAlign:'center',fontSize:'20px', color:'rgba(0,0,0,0.7)',transition:'0.5s', paddingLeft:'8%', paddingRight:'8%'}}>
                            <Tooltip placement='bottom' title={'Click to play chord progression: ' + this.getProgression()}
                            overlayStyle={{maxWidth:'500px'}}>
                                <Text ellipsis={true} onClick={this.play} style={{color:this.state.playing==='playing'? 'green':'black'}}>{this.getProgression()}</Text>
                            </Tooltip>
                            </div>
                        </div>
                    </div>
                    :
                    <div className={`song-display-phrase-item song-display-phrase-item-${mapType(this.props.label)} ${this.testVocal()}`} style={{
                        minWidth: 0.4*(this.props.length * 50) + 'px', maxWidth: 0.4*(this.props.length * 50) + 'px',
                    }} onClick={this.changeDisplay}>
                    <h1 className='phrase-item-title trans'>&nbsp;</h1>
                    </div>
                }
                </Tooltip>
            </div>
        )
    }
}
function mapType(type){
    const typeNameMap = {
        'i':'intro','I':'intro','a':'verse','A':'verse','b':'chorus','B':'chorus','o':'outro','O':'outro', 
    }
    if (type in typeNameMap){
        return typeNameMap[type]
    }
    else{
        return 'other'
    }
}
function mapTypeCap(type){
    const typeNameMap = {
        'i':'Intro','I':'Intro','a':'Verse','A':'Verse','b':'Chorus','B':'Chorus','o':'Outro','O':'Outro', 
    }
    if (type in typeNameMap){
        return typeNameMap[type]
    }
    else{
        return 'Other'
    }
}

