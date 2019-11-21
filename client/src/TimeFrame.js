import React from 'react'
import './foundation.css'
import './spotistyle.css'

class TimeFrame extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            timeframeChosen : "",
        }

    }

    handleClick = (e) =>{
        e.preventDefault();
        if(e.target.matches('.timeframe-unselected')){
          var selected = document.getElementsByClassName("timeframe-selected");
          var i;
          for(i = 0; i < selected.length; i++){
            selected[i].className = "timeframe-unselected";
          }
          e.target.className = "timeframe-selected";
          this.props.timelineUpdate(e.target.id);
        }
      }


    render () {

        return(
            <div className="timeframe">
                <h5>Select which of you listening history we should analyze:</h5>
                <div className="timeframe-links">
                <a id="AllSaved" className="timeframe-selected" onClick={this.handleClick}>All currently saved songs</a>
                <a id="last50" className="timeframe-unselected" onClick={this.handleClick}>Most recent 50 songs</a>
                <a id="last250" className="timeframe-unselected" onClick={this.handleClick}>Most recent 250 songs</a>
                <a id="favoritegenre" className="timeframe-unselected" onClick={this.handleClick}>Music saved from my favorite genre</a>
                </div>
            </div>
        )

    }

}


export default TimeFrame