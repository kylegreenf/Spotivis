import React from 'react'
import './foundation.css'
import './spotistyle.css'

function TopBar() {
    return(
        <div className="top-bar-container" data-sticky-container>
            <div className="sticky sticy-topbar" data-sticky data-options="anchor: page; marginTop: 0; stickyOn: small;">
                <div className="top-bar">
                    <ul className="menu" data-dropdown-menu>
                        <li className="menu-text"><div class="logoimg">xxxxxxx</div></li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default TopBar
