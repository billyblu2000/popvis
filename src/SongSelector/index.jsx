import { Divider, Input } from 'antd'
import { SearchOutlined } from "@ant-design/icons";
import React, { Component } from 'react'
import './index.css'
import PubSub from 'pubsub-js'

export default class SongSelector extends Component {

    
    constructor(props){
        super(props);
        this.state = {
            selected:null,
            yearFilter:this.props.yearFilter,
            displayed:this.props.data,
            data:this.props.data,
        }
        this.searchInput = React.createRef()
    }

    UNSAFE_componentWillReceiveProps(props){
        if (this.state.yearFilter !== props.yearFilter){
            this.setState({ data:props.data, displayed:props.data, yearFilter:props.yearFilter });
        }
        else{
            var value = this.searchInput.current.state.value;
            if (value !== undefined){
                this.setState({
                    displayed:props.data.filter((item) => { 
                        return item.name.search(value) !== -1 || item.artist.search(value) !== -1 
                    })
                })
            }
        }
    }

    handelClick = (event) => {
        this.setState({selected:event.target.id.split('-')[1]})
        PubSub.publish('songSelectChange',event.target.id.split('-')[1])
    }
    handelMouseEnter = (event) => {
        this.props.highlightChange(event.target.id.split('-')[1])
    }
    handelMouseLeave = () => {
        this.props.highlightChange(null)
    }

    search = (event) => {
        this.setState({
            displayed:this.props.data.filter((item) => { return item.name.search(event.target.value) !== -1 || item.artist.search(event.target.value) !== -1 })
        })
    }

    render() {
        return (
            <div className='song-selector-root'>
                <div className='song-selector-search' ><Input ref={this.searchInput} placeholder="Type name or artist" prefix={<SearchOutlined style={{color:'rgba(135, 165, 189, 0.678)'}}/>} bordered={false} allowClear={true} style={{width:'100%'}} onChange={this.search}/></div>
                <div style={{overflow: 'scroll', maxHeight: '800px'}}>
                    {this.state.displayed.map((item,idx) => {
                        return (
                            <div 
                                key={`s-${item.id}`}
                                id={`s-${item.id}`}
                                onClick={this.handelClick} 
                                onMouseEnter={this.handelMouseEnter} 
                                onMouseLeave={this.handelMouseLeave} 
                                className={item.id.toString() === this.state.selected ?'song-item-selected':'song-item'}>
                                <p id={`s-${item.id}`} className='song-item-artist'>{item.artist}</p>
                                <Divider id={`s-${item.id}`} style={{marginTop:'0px', marginBottom:'10px'}}/>
                                <p id={`s-${item.id}`} className='song-item-title'>{item.name}</p>
                            </div>
                        )
                    })}
                </div>
                
            </div>
        )
    }
}
