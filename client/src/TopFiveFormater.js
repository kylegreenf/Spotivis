import React from 'react'
import './foundation.css'
import App from './App.js';

class TopFiveFormater extends React.Component{

  constructor(props){
    super(props);
    this.state = {
        selectedItem : 0
    };
    
  }

  render(){
    const { topFives } = this.props
    const { field } = this.props
    const { setSelected } = this.props
    const { selected } = this.props

    var css = this.FormatTopFive(topFives, field, setSelected, selected)
    return(css)
  }

  FormatTopFive(topFives, field, setSelected, selected){

    if(topFives === undefined){

        return <div></div>
    }
      var topFives = topFives[field]


      if(topFives !== undefined){
        var selectedIdx = selected[field]
        this.state.selectedItem = topFives[selectedIdx]
        var buttonNames = ["topfivebutton tfbutton","topfivebutton tfbutton","topfivebutton tfbutton","topfivebutton tfbutton","topfivebutton tfbutton"]
        buttonNames[selectedIdx] = "tfbuttonselected"

        return(

          <div className = "topfivesobj">
            <div className = "topfivestext">
                <ol id="topFiveList">

                    <li><button className={buttonNames[0]} onClick={() =>{setSelected(field,0)}}>{topFives[0].name}</button></li>
                    <li><button className={buttonNames[1]} onClick={() =>{setSelected(field,1)}}>{topFives[1].name}</button></li>
                    <li><button className={buttonNames[2]} onClick={() =>{setSelected(field,2)}}>{topFives[2].name}</button></li>
                    <li><button className={buttonNames[3]} onClick={() =>{setSelected(field,3)}}>{topFives[3].name}</button></li>
                    <li><button className={buttonNames[4]} onClick={() =>{setSelected(field,4)}}>{topFives[4].name}</button></li>
                </ol>
            </div>

            <div className = "topfivesimage">
                Artist: {this.state.selectedItem.artists[0].name}
                <br></br>
                <img src={this.state.selectedItem.album.images[0].url} style={{ height: 150 }} alt = ""/>
            </div>
          </div>

        )
        }
        else{
          return <div></div>
        }
    }

}




export default TopFiveFormater
/*


        <img src={selectedItem.album.images[0].url} style={{ height: 150 }} alt = ""/>

      return(<div align="left">
                    <div>
                    1. Track: {topFives[0].name} , Artist: {topFives[0].artists[0].name}
                    </div>
                    <div>
                    2. Track: {topFives[1].name} , Artist: {topFives[1].artists[0].name}
                    </div>
                    <div>
                    3. Track: {topFives[2].name} , Artist: {topFives[2].artists[0].name}
                    </div>
                    <div>
                    4. Track: {topFives[3].name} , Artist: {topFives[3].artists[0].name}
                    </div>
                    <div>
                    5. Track: {topFives[4].name} , Artist: {topFives[4].artists[0].name}
                    </div>
                </div>
      )
  }
    */
