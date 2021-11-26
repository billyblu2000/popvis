import React from 'react'
import PubSub from 'pubsub-js'
import './index.css'

export default class ModeSelector extends React.Component {

    state = {
        major:false,
        minor:false
    }
    handelClick = (event) => {
        if (event.target.id === 'mode-select-major') {
            this.setState({major:!this.state.major});
            this.publishFilter(!this.state.major, this.state.minor);
        }
        else{
            this.setState({minor:!this.state.minor});
            this.publishFilter(this.state.major, !this.state.minor);
        }
    }
    publishFilter = (major, minor) => {
        if (!major &&  !minor){
            PubSub.publish('modeFilterChange', [true, true]);
        }
        else{
            PubSub.publish('modeFilterChange', [major, minor]);
        }
    }
    render(){
        return (
            <div className='mode-selector-root'>
                <div style={{cursor:'pointer'}}  onClick={this.handelClick}>
                    {this.state.major ? 
                        <div className='mode-selection mode-selection-left-radius major' id='mode-select-major'>Major</div>
                        :
                        <div className='mode-selection mode-selection-left-radius mode-not-selected' id='mode-select-major'>Major</div>
                    }
                </div>
                <div style={{cursor:'pointer'}} onClick={this.handelClick}>
                    {this.state.minor ? 
                        <div className='mode-selection mode-selection-right-radius minor' id='mode-select-minor'>Minor</div>
                        :
                        <div className='mode-selection mode-selection-right-radius mode-not-selected' id='mode-select-minor'>Minor</div>
                    }
                </div>
            </div>
        )
    }
}
