import React from 'react'
import './foundation.css'
import './spotistyle.css'

class TopBar extends React.Component{

  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
    const { username } = this.props
    const {profilepic} = this.props
    return(
        <div className="top-bar-container" data-sticky-container>
            <div className="sticky sticy-topbar" data-sticky data-options="anchor: page; marginTop: 0; stickyOn: small;">
                <div className="top-bar">
                    <ul className="menu" data-dropdown-menu>
                        <li className="menu-text"><div className="logoimg">xxxxxxx</div></li>

                        <li className="timeframecontainer">Select which of your listening history we should analyze:
                        </li>
                        <li className = "returnlogincontainer"><a className = "logout" href='http://localhost:8888'>Log out</a></li>
                        <li className = "userinfocontainer"><h1>{username}</h1><img src = {profilepic} alt = "" className = "profilepic"></img></li>
                    </ul>
                </div>
                <div className="top-bar2">
                  <div className="timeline">
                    <a>All currently saved songs</a>
                    <a>Most recent 50 songs</a>
                    <a>Most recent 250 songs</a>
                    <a>Music saved from my favorite genre</a>
                  </div>
                </div>
            </div>
        </div>
    )
  }
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
function myFunction() {
  document.getElementById("myDropdown").classList.toggle("show");
}

// Close the dropdown if the user clicks outside of it
window.onclick = function(event) {
  if (!event.target.matches('.dropbtn')) {
    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
      var openDropdown = dropdowns[i];
      if (openDropdown.classList.contains('show')) {
        openDropdown.classList.remove('show');
      }
    }
  }
}


export default TopBar
