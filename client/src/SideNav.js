import React from 'react'
import './foundation.css'
import './spotistyle.css'

function SideNav() {
    return(
        <div className="sidenav">
            <div className="nav-wrapper">
            <input className = "searchInput" type="text" id="myInput" onKeyUp={searchGraphs} placeholder="Search for graphs">
            </input>
              <div className = "graphdropdownwrapper">
                  <div className="graphdropdown">
                    <div className="graphdropdowncategory graphdropdownhighlight">
                      <a href="#">Top 5</a>
                    </div>
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Artists</a>
                          </div>
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Songs</a>
                          </div>
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Albums</a>
                      </div>
                  </div>
                  <div className="graphdropdown">
                    <div className="graphdropdowncategory graphdropdownhighlight">
                      <a href="#">Totals</a>
                    </div>
                    <div className="graphdropdownselection">
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Artists</a>
                      </div>
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Songs</a>
                      </div>
                    </div>
                  </div>
                  <div className="graphdropdown">
                    <div className="graphdropdowncategory graphdropdownhighlight">
                      <a href="#">Genre Breakdown</a>
                    </div>

                  </div>
                  <div className="graphdropdown">
                    <div className="graphdropdowncategory graphdropdownhighlight">
                      <a href="#">Hipster Rating</a>
                    </div>

                    <div className="graphdropdownselection">
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Average popularity</a>
                      </div>
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Most popular</a>
                      </div>
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Most underground</a>
                      </div>
                    </div>
                  </div>
                  <div className="graphdropdown">
                    <div className="graphdropdowncategory graphdropdownhighlight">
                      <a href="#">Averages</a>
                    </div>
                    <div className="graphdropdownselection">
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Average danceability</a>
                      </div>
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Average happiness</a>
                      </div>
                      <div className="graphdropdownselection graphdropdownhighlight">
                        <a href = "#">- Average energy</a>
                      </div>
                    </div>
                  </div>
                  </div>
            </div>
        </div>
    )
}

function searchGraphs() {
  var input, filter, ul, li, a, i;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  ul = document.getElementById("myMenu");
  li = ul.getElementsByTagName("li");
  for (i = 0; i < li.length; i++) {
    a = li[i].getElementsByTagName("a")[0];
    if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}



export default SideNav
