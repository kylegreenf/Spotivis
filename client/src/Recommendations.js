import React from 'react'
import './foundation.css'
import './spotistyle.css'


class Recommendations extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            songRecs : {}
        };
    };

    handleClick = (e) =>{


        console.log("click");
      }
    
    addSong = (song) =>{
        this.props.addSavedSong(song);
    }



    render(){
        const {recommendations} = this.props
        if(recommendations[1] === undefined){
            return(<h1></h1>)
        }
        else{

            console.log(recommendations[1]);
            const albumpic = recommendations[1].album.images[0].url;
            return(
              
                <div className = "rec-container">
                <div className = "rec-title">
                <h4>Based on you listening history, we have compiled these song recomendations for you!</h4>
                </div>
                    <div className = "rec-row">
                        <div className = "rec">
                            <img src = {recommendations[0].album.images[0].url}></img>
                            <h1>{recommendations[0].name} - {recommendations[0].artists[0].name}</h1>
                            <button id="recButton1" className="tfbuttonselected" onClick = {() => this.addSong(recommendations[5])}> Click to Add </button>
                        </div>

                        <div className = "rec">
                            <img src = {recommendations[1].album.images[0].url}></img>
                            <h1>{recommendations[1].name} - {recommendations[1].artists[0].name}</h1>
                            <button id="recButton2" className="tfbuttonselected" onClick = {() => this.addSong(recommendations[5])}> Click to Add </button>
                        </div>

                        <div className = "rec">
                            <img src = {recommendations[2].album.images[0].url}></img>
                            <h1>{recommendations[2].name} - {recommendations[2].artists[0].name}</h1>
                            <button id = "recButton3"  className="tfbuttonselected" onClick = {() => this.addSong(recommendations[5])}> Click to Add </button>
                        </div>
                    </div>
                    <div className = "rec-row">
                        <div className = "rec">
                            <img src = {recommendations[3].album.images[0].url}></img>
                            <h1>{recommendations[3].name} - {recommendations[3].artists[0].name}</h1>
                            <button id = "recButton4"  className="tfbuttonselected" onClick = {() => this.addSong(recommendations[5])}> Click to Add </button>
                        </div>

                        <div className = "rec">
                            <img src = {recommendations[4].album.images[0].url}></img>
                            <h1>{recommendations[4].name} - {recommendations[4].artists[0].name}</h1>
                            <button id = "recButton5"  className="tfbuttonselected" onClick = {() => this.addSong(recommendations[5])}> Click to Add </button>
                        </div>

                        <div className = "rec">
                            <img src = {recommendations[5].album.images[0].url}></img>
                            <h1>{recommendations[5].name} - {recommendations[5].artists[0].name}</h1>
                            <button id = "recButton6"  className="tfbuttonselected" onClick = {() => this.addSong(recommendations[5])}> Click to Add </button>
                        </div>
                    </div>
                </div>
            )
        }



    }




}

export default Recommendations