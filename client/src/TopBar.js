import React from 'react'
import './foundation.css'
import './spotistyle.css'


function TopBar() {
    return(
        <div className="top-bar-container" data-sticky-container>
            <div className="sticky sticy-topbar" data-sticky data-options="anchor: page; marginTop: 0; stickyOn: small;">
                <div className="top-bar">
                    <ul className="menu" data-dropdown-menu>
                        <li className="menu-text"><div className="logoimg">xxxxxxx</div></li>

                        <li className="dropdown"><div className="dropdown">
                          <button onClick="myFunction()" className="dropbtn">Timeframe</button>
                            <div id="myDropdown" className="dropdown-content">
                              <a href="#home">Home</a>
                              <a href="#about">About</a>
                              <a href="#contact">Contact</a>
                            </div>
                          </div>
                        </li>
                        <li className = "returnlogincontainer"><a className = "logout" href='http://localhost:8888'>Log out</a></li>
                    </ul>
                </div>
            </div>
        </div>
    )

}

export default TopBar
