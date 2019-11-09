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
                <div className="dropdowncategory dropdownhighlight">
                  <a href="#">Top 5</a>
                </div>
                  <div className="dropdownselection dropdownhighlight">
                    <a href = "#">- Artists</a>
                      </div>
                  <div className="dropdownselection dropdownhighlight">
                    <a href = "#">- Songs</a>
                      </div>
                  <div className="dropdownselection dropdownhighlight">
                    <a href = "#">- Albums</a>
                  </div>
              </div>
              <div className="dropdown">
                <div className="dropdowncategory dropdownhighlight">
                  <a href="#">Totals</a>
                </div>
                <div className="dropdownselection">
                <div className="dropdownselection dropdownhighlight">
                  <a href = "#">- Artists</a>
                </div>
                <div className="dropdownselection dropdownhighlight">
                  <a href = "#">- Songs</a>
                </div>
                <div className="dropdownselection dropdownhighlight">

                </div>



                </div>
              </div>
              <div className="dropdown">
                <div className="dropdowncategory dropdownhighlight">
                  <a href="#">Genre Breakdown</a>
                </div>

              </div>
              <div className="dropdown">
                <div className="dropdowncategory dropdownhighlight">
                  <a href="#">Hipster Rating</a>
                </div>

                <div className="dropdownselection">
                  <div className="dropdownselection dropdownhighlight">
                    <a href = "#">- Average popularity</a>
                  </div>
                  <div className="dropdownselection dropdownhighlight">
                    <a href = "#">- Most popular</a>
                  </div>
                  <div className="dropdownselection dropdownhighlight">
                    <a href = "#">- Most underground</a>
                  </div>
                </div>
              </div>
              <div className="dropdown">
                <div className="dropdowncategory dropdownhighlight">
                  <a href="#">Averages</a>
                </div>
                <div className="dropdownselection">
                  <div className="dropdownselection dropdownhighlight">
                    <a href = "#">- Average danceability</a>
                  </div>
                  <div className="dropdownselection dropdownhighlight">
                    <a href = "#">- Average happiness</a>
                  </div>
                  <div className="dropdownselection dropdownhighlight">
                    <a href = "#">- Average energy</a>
                  </div>
                </div>
              </div>
            </div>
        </div>
    )
}



export default SideNav
