import React from 'react'
import './foundation.css'
import './spotistyle.css'

function SideNav() {
    return(
        <div className="sidenav">
            <div className="nav-wrapper">
            <input type="text" id="myInput" onkeyup="myFunction()" placeholder="Search for graphs">
            </input>
              <div className="dropdown">
                <div className="dropdowncategory">
                  <a href="#">Top 5</a>
                </div>
                  <div className="dropdownselection">
                    <a href = "#">- Artists</a>
                    <a href = "#">- Songs</a>
                    <a href = "#">- Albums</a>
                  </div>
              </div>
              <div className="dropdown">
                <div className="dropdowncategory">
                  <a href="#">Totals</a>
                </div>
                <div className="dropdownselection">
                  <a href = "#">- Artists</a>
                  <a href = "#">- Songs</a>
                  <a href = "#">- Albums</a>
                </div>
              </div>
              <div className="dropdown">
                <div className="dropdowncategory">
                  <a href="#">Genre Breakdown</a>
                </div>

              </div>
              <div className="dropdown">
                <div className="dropdowncategory">
                  <a href="#">Hipster Rating</a>
                </div>

                <div className="dropdownselection">
                  <a href = "#">- Average popularity</a>
                  <a href = "#">- Most popular</a>
                  <a href = "#">- Most underground</a>
                </div>
              </div>
              <div className="dropdown">
                <div className="dropdowncategory">
                  <a href="#">Averages</a>
                </div>

                <div className="dropdownselection">
                  <a href = "#">- Average danceability</a>
                  <a href = "#">- Average happiness</a>
                  <a href = "#">- Average energy</a>
                </div>
              </div>
            </div>
        </div>
    )
}



export default SideNav
