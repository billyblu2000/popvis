import React, { Component } from 'react'
import { Badge, Statistic, Empty } from 'antd';
import { themeColor } from '../utils';
import PhraseItem from '../PhraseItem';
import './index.css'
const tonicMap = { 0:'C',1:'D♭',2:'D',3:'E♭',4:'E',5:'F',6:'F♯',7:'G',8:'A♭',9:'A',10:'B♭',11:'B' }
const modeMap = { maj:' Major', min:' Minor' }
export default class SongView extends Component {

    state = {song:'waiting', display:'-1'}
    static getDerivedStateFromProps(props, state){
        var songInfo
        if (props.song === null || props.song === '-1'){
            songInfo = 'waiting'
        }
        for (var i = 0; i < props.data.length; i++){
            if (props.data[i].id.toString() === props.song){
                songInfo = props.data[i]
            }
        }
        if (songInfo !== state.song){
            return { song:songInfo, display:'-1' }
        }
    }
    changeDisplay = (id) => {
        this.setState({display:id.toString()});
    }
    render() {
        return (
            <div>
                {this.state.song === 'waiting' || this.state.song === undefined ? <Empty style={{paddingTop:'80px'}} description='Please select a song to view detailed information.'/>:
                    <div style={{marginLeft:'5%', marginRight:'5%', paddingTop:'30px'}}>
                        <div className='song-info'>
                            <div className='song-title'>
                                {this.state.song.name}
                                <Badge count={`${this.state.song.artist}`} style={{ backgroundColor: themeColor[8],marginLeft:'5px' }}/>
                            </div>
                            <Statistic title={<div style={{lineHeight:'5px'}}>Publish Date</div>} value={this.state.song.publish_date} style={{float:'right', marginLeft:'5%'}}/>
                            <Statistic title={<div style={{lineHeight:'5px'}}>Meter</div>} value={this.state.song.meter} style={{float:'right', marginLeft:'5%'}} />
                            <Statistic title={<div style={{lineHeight:'5px'}}>Initial Tonic/Mode</div>} value={tonicMap[this.state.song.phrases[0].tonic] + modeMap[this.state.song.phrases[0].mode]} style={{float:'right', marginLeft:'5%'}} />
                        </div>
                        <div className='song-display-divider'></div>
                        <div className='song-structure'>
                        <div style={{ minWidth:'1%', display:'inline-block'}}><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p><p>&nbsp;</p></div>
                        {this.state.song.phrases.sort((a, b)=>{
                            return a.id - b.id
                        }).map((item)=>{
                            return <PhraseItem songId= {this.state.song.id} item={item} displayed={this.state.display === item.id.toString()} length={item.length} label={item.label} id={item.id} changeDisplay={idx => {return this.changeDisplay(idx)}}></PhraseItem>
                        })}
                        </div>
                    </div>
                }
            </div>
        )
        
    }
}
