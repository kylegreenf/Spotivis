import React from 'react'
import './foundation.css'
import './spotistyle.css'
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
            <h3>{calculatedaverage.explicitcount} of your {calculatedaverage.totalLen} songs are explicit</h3>
            <h3>{calculatedaverage.percent}% of your songs contain explicit lyrics - how naughty!</h3>
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
