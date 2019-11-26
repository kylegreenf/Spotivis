import React from 'react'
import './foundation.css'
import App from './App.js';

class TopFiveFormater extends React.Component{

  constructor(props){
    super(props);
    this.state = {
        selectedItem : 0 
    };
    ;
  }
  
  render(){
    const { topFives } = this.props
    if(topFives!== undefined){

    }
    var css = this.FormatTopFive(topFives)
    return(css)
  }

  FormatTopFive(topFives){

    if(topFives === undefined){

        return <div></div>
    }
      console.log(topFives)

      if(topFives !== undefined){
        
        this.state.selectedItem = topFives[0]
        console.log(this.state.selectedItem)
        
        return(

          <div className = "topfivesobj">
            <div className = "topfivestext">
                <ol id="topFiveList">

                    <li><button className="topfivebutton button1" onClick={() =>{this.selectItem(topFives[0])}}>{topFives[0].name}</button></li>
                    <li><button className="topfivebutton button2" onClick={() =>{this.selectItem(topFives[1]);}}>{topFives[1].name}</button></li>
                    <li><button className="topfivebutton button3">{topFives[2].name}</button></li>
                    <li><button className="topfivebutton button4">{topFives[3].name}</button></li>
                    <li><button className="topfivebutton button5">{topFives[4].name}</button></li>
                </ol>
            </div>

            <div className = "topfivesimage">
                <img src={this.state.selectedItem.album.images[0].url} style={{ height: 150 }} alt = ""/>
            </div>
          </div>

        )
        }
        else{
          return <div></div>
        }
    }

    selectItem(newItem){
        console.log(newItem)
        this.state.selectedItem = newItem
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
