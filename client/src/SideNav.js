import React from 'react'
import './foundation.css'
import './spotistyle.css'

class SideNav extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      graph : "",
    }
  }


  render(){

    return(
        <div className="sidenav">
          <div className="row">
              <input className = "searchInput" type="text" id="myInput" onKeyUp={searchGraphs} placeholder="Search for graphs">
              </input>
              <ul id="myMenu">
                <li className = "graphdropdown"><a className = "sideNavParent" href="#">The Basics</a></li>
                <li className = "graphdropdown"><a className = "sideNavParent" href="#top5">Top 5</a></li>
                <li className = "graphdropdown"><a className = "sideNavChild" href="#">- Artists</a></li>
                <li className = "graphdropdown"><a className = "sideNavChild" href="#">- Songs</a></li>
                <li className = "graphdropdown"><a className = "sideNavChild" href = "#">- Albums</a></li>
                <li className = "graphdropdown"><a href="#">Genre Breakdown</a></li>
                <li className = "graphdropdown"><a href="#">Hipster Rating</a></li>
                <li className = "graphdropdown"><a className = "sideNavChild" href="#">- Average popularity</a></li>
                <li className = "graphdropdown"><a className = "sideNavChild" href="#">- Most popular</a></li>
                <li className = "graphdropdown"><a className = "sideNavChild" href="#">- Most underground</a></li>
                <li className = "graphdropdown"><a href="#">Averages</a></li>
                <li className = "graphdropdown"><a className = "sideNavChild" href="#">- Average danceability</a></li>
                <li className = "graphdropdown"><a className = "sideNavChild" href="#">- Average happiness</a></li>
                <li className = "graphdropdown"><a className = "sideNavChild" href="#">- Average energy</a></li>
              </ul>
            </div>
        </div>
    )
}
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
