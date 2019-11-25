import React from 'react'
import './foundation.css'

function FormatTopFive(topFives){
  topFives = topFives.topFives

  if(topFives !== undefined){
    var selectedItem = topFives[0]



    return(
      <div className = "topfivesobj">
        <div className = "topfivestext">
            <ol id="topFiveList">

                <li><button className="topfivebutton button1">{topFives[0].name}</button></li>
                <li><button className="topfivebutton button2">{topFives[1].name}</button></li>
                <li><button className="topfivebutton button3">{topFives[2].name}</button></li>
                <li><button className="topfivebutton button4">{topFives[3].name}</button></li>
                <li><button className="topfivebutton button5">{topFives[4].name}</button></li>
            </ol>
        </div>

        <div className = "topfivesimage">
            <img src={selectedItem.album.images[0].url} style={{ height: 150 }} alt = ""/>
        </div>
      </div>

    )
    }
    else{
      return <div></div>
    }
}

function selectItem(selectedItem,newItem){
    selectedItem = newItem
}
export default FormatTopFive
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
