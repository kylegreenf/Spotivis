import React from 'react'
import './foundation.css'
import './spotistyle.css'

class TopBar extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      timeframeChosen : ""
    };
;
  }

  // update = () => {
  //   console.log("aaaaaa");
  //   this.props.timelineUpdate("test");
  // }


  // handleClick = (e) =>{
  //   e.preventDefault();
  //   if(e.target.matches('.timeframe-unselected')){
  //     var selected = document.getElementsByClassName("timeframe-selected");
  //     var i;
  //     for(i = 0; i < selected.length; i++){
  //       selected[i].className = "timeframe-unselected";
  //     }
  //     e.target.className = "timeframe-selected";
  //     this.props.timelineUpdate(e.target.id);
  //   }
  // }


  render(){
    const { username } = this.props
    const {profilepic} = this.props
    return(
        <div className="top-bar-container" data-sticky-container>
            <div className="sticky sticy-topbar" data-sticky data-options="anchor: page; marginTop: 0; stickyOn: small;">
                <div className="top-bar">
                    <ul className="menu" data-dropdown-menu>
                        <li className="menu-text"><div className="logoimg">xxxxxxx</div></li>
                        <li className = "returnlogincontainer"><a className = "logout" href='http://localhost:8888'>Log Out</a></li>
                        <li className = "userinfocontainer"><h1 className="username">{username}</h1><img src = {profilepic} alt = "" className = "profilepic"></img></li>
                    </ul>
                </div>
                {/*
                <div className="top-bar2">
                  <div className="timeline">
                    <a id="AllSaved" className="timeframe-selected" onClick={this.handleClick}>All currently saved songs</a>
                    <a id="last50" className="timeframe-unselected" onClick={this.handleClick}>Most recent 50 songs</a>
                    <a id="last250" className="timeframe-unselected" onClick={this.handleClick}>Most recent 250 songs</a>
                    <a id="favoritegenre" className="timeframe-unselected" onClick={this.handleClick}>Music saved from my favorite genre</a>
                  </div>
                </div>
                */}
            </div>
        </div>
    )
  }
}



export default TopBar
