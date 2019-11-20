import React from 'react'

function FormatTopFive(topFives){
  topFives = topFives.topFives


  if(topFives !== undefined){
    console.log(topFives[0].artists[0])
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
  }else{
      return <div></div>
  }
}
export default FormatTopFive
