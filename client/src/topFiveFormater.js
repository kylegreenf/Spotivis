import React from 'react'
function formatTopFive(topFives){
  return(<div>
                <div>
                1. {topFives['valence'][0].name}
                </div>
                <div>
                2. {topFives['valence'][1].name}
                </div>
                <div>
                3. {topFives['valence'][2].name}
                </div>
                <div>
                4. {topFives['valence'][3].name}
                </div>
                <div>
                5. {topFives['valence'][4].name}
                </div>
            </div>
  )
  }
