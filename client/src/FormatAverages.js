import React from 'react'
import './foundation.css'
import './spotistyle.css'
var Chart = require('chart.js');
var calculatedaverage;


class FormatAverages extends React.Component {

  constructor(props){
    super(props);
    this.state = {
    }
  }




  render(){
    const { averageinfo } = this.props
    calculatedaverage = averageinfo;
    if (calculatedaverage !== undefined) {
      return(
          <div className="averages">
            <h3><span className = "importantStat">{calculatedaverage.explicitcount}</span> of your <span className = "importantStat">{calculatedaverage.totalLen}</span> songs are explicit</h3>
            <h3><span className = "importantStat">{calculatedaverage.percent}</span>% of your songs contain explicit lyrics - how naughty!</h3>
          </div>
      )
    }
    else {
      return(
        <div>x</div>
      )
    }
  }
}



export default FormatAverages
