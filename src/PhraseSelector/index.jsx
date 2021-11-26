import React from 'react';
import PubSub from 'pubsub-js';
import './index.css'

export default class PhraseSelector extends React.Component {

    state = {
        intro:false,
        verse:false,
        chorus:false,
        outro:false,
        other:false
    }
    handelClick = (event) => {
        if (event.target.id === 'phrase-select-intro') {
            this.publishFilter(!this.state.intro, this.state.verse, this.state.chorus, this.state.outro, this.state.other);
            this.setState({intro:!this.state.intro});
        }
        else if (event.target.id === 'phrase-select-verse'){
            this.publishFilter(this.state.intro, !this.state.verse, this.state.chorus, this.state.outro, this.state.other);
            this.setState({verse:!this.state.verse});
        }
        else if (event.target.id === 'phrase-select-chorus'){
            this.publishFilter(this.state.intro, this.state.verse, !this.state.chorus, this.state.outro, this.state.other);
            this.setState({chorus:!this.state.chorus});
        }
        else if (event.target.id === 'phrase-select-outro'){
            this.publishFilter(this.state.intro, this.state.verse, this.state.chorus, !this.state.outro, this.state.other);
            this.setState({outro:!this.state.outro});
        }
        else{
            this.publishFilter(this.state.intro, this.state.verse, this.state.chorus, this.state.outro, !this.state.other);
            this.setState({other:!this.state.other});
        }
    }

    publishFilter = (intro, verse, chorus, outro, other) => {
        if (!intro &&  !verse && !chorus && !outro && !other){
            PubSub.publish('phraseFilterChange', [true, true, true, true, true]);
        }
        else{
            PubSub.publish('phraseFilterChange', [intro, verse, chorus, outro, other]);
        }
    }

    render(){
        return (
            <div className='phrase-selector-root'>
                <div style={{cursor:'pointer'}} onClick={this.handelClick}>
                    {this.state.intro ? 
                        <div className='phrase-selection phrase-selection-left-radius intro' id='phrase-select-intro'>Intro</div>
                        :
                        <div className='phrase-selection phrase-selection-left-radius not-selected' id='phrase-select-intro'>Intro</div>
                    }
                </div>
                <div style={{cursor:'pointer'}} onClick={this.handelClick}>
                    {this.state.verse ? 
                        <div className='phrase-selection verse' id='phrase-select-verse'>Verse</div>
                        :
                        <div className='phrase-selection not-selected' id='phrase-select-verse'>Verse</div>
                    }
                </div>
                <div style={{cursor:'pointer'}}   onClick={this.handelClick}>
                    {this.state.chorus ? 
                        <div className='phrase-selection chorus' id='phrase-select-chorus'>Chorus</div>
                        :
                        <div className='phrase-selection not-selected' id='phrase-select-chorus'>Chorus</div>
                    }
                </div>
                <div style={{cursor:'pointer'}} onClick={this.handelClick}>
                    {this.state.outro ? 
                        <div className='phrase-selection outro' id='phrase-select-outro' >Outro</div>
                        :
                        <div className='phrase-selection not-selected' id='phrase-select-outro' >Outro</div>
                    }
                </div>
                <div style={{cursor:'pointer'}} onClick={this.handelClick}>
                    {this.state.other ? 
                        <div className='phrase-selection phrase-selection-right-radius other' id='phrase-select-other'>Other</div>
                        :
                        <div className='phrase-selection phrase-selection-right-radius not-selected' id='phrase-select-other'>Other</div>
                    }
                </div>
            </div>
        )
    }
}
