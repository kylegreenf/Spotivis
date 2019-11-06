import React from 'react'
import './foundation.css'
import './spotistyle.css'

function SideNav() {
    return(
        <div className="sidenav">
            <div class="nav-wrapper">
              <div class="dropdown">
                <a href="#">Top 5</a>
              </div>
              <div class="dropdown">
                <a href="#">Totals</a>
              </div>
              <div class="dropdown">
                <a href="#">Genre Breakdown</a>
              </div>
              <div class="dropdown">
                <a href="#">Hipster Rating</a>
              </div>
              <div class="dropdown">
                <a href="#">Averages</a>
              </div>
            </div>
        </div>
    )
}

export default SideNav
