import React from 'react'
import './foundation.css'
import './spotistyle.css'

class TopBar extends React.Component{

  constructor(props){
    super(props);
    this.state = {};
    console.log(props);
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

                        <li className="timeframecontainer">Select analysis timeframe:
                          <div className="dropdown">
                          <button onClick={myFunction} className="dropbtn">All saved songs</button>
                            <div id="myDropdown" className="dropdown-content">
                              <a href="#home">All currently saved songs</a>
                              <a href="#about">All listening history</a>
                              <a href="#about">Past 6 month listening history</a>
                              <a href="#contact">Past 4 weeks listening history</a>
                            </div>
                          </div>
                        </li>
                        <li className = "returnlogincontainer"><a className = "logout" href='http://localhost:8888'>Log out</a></li>
                        <li className = "userinfocontainer"><h1>{username}</h1><img src = {profilepic} className = "profilepic"></img></li>
                    </ul>
                </div>
                <div className="top-bar2">
                  <div className="timeline">
                    <a>All currently saved songs</a>
                    <a>All listening history</a>
                    <a>Past 6 months</a>
                    <a>Past 4 weeks listening history</a>
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
