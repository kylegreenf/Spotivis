import React from 'react'
import './foundation.css'

function FormatTopFive(topFives){
  topFives = topFives.topFives

  if(topFives !== undefined){
    var selectedItem = topFives[0]



    return(
      <div>
        <div className = "topfivestext">
            <ol id="topFiveList">
                <li><a className = "topFiveItem" id = '0'>{topFives[0].name}</a></li>
                <li><a className = "topFiveItem" id = '1'>{topFives[1].name}</a></li>
                <li><a className = "topFiveItem" >{topFives[2].name}</a></li>
                <li><a className = "topFiveItem" >{topFives[3].name}</a></li>
                <li><a className = "topFiveItem" >{topFives[4].name}</a></li>
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
