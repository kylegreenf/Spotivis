import React, { Component } from 'react';

import './App.css';


import './foundation.css';
import './spotistyle.css';

import TopBar from './TopBar';
import SideNav from './SideNav';
import formatTopFive from './topFiveFormater';


import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
var stats = require('./statsHelper');
var Chart = require('chart.js');
var username = "lol";

class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false, // True if user is logged in
      multiTracks: {tracks: [] }, // Array to hold all saved tracks + info as object
      importantInfo: { //Important information to be used by our app
        numSavedSongs: 0, //Count of songs saved by a user
        apiResponses: 0,
        display_name: null,
      },
      mostDanceableSong: {
        name: 'Not Checked',
        albumArt: ''
      },
      topFives: {},
      loaded: false,
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    this.getAllSavedTracks();
    this.donutChart()
    this.barChart()

    spotifyApi.getMe()
      .then((response) => {
        if (response.display_name != null) {
          username = response.display_name
        }
      });
  }

// Helps getAllSavedTracks info for 50 songs sent with offset
  getAllSavedHelper(offset, tracks) {
    spotifyApi.getMySavedTracks({limit: 50, offset: offset})
      .then((response) => {
        var trackIds = [];

        for (var i = 0; i < 50; i++) {
          if (response.items[i] != null) {
            tracks[offset+i] = response.items[i].track;
            tracks[offset+i].recently_added = i+offset;
            trackIds[i] = response.items[i].track.id;
          }
        }


        // Find the Audio Features for each track, then merge with existing track object
        spotifyApi.getAudioFeaturesForTracks(trackIds)
          .then((response) => {
            for (var i = 0; i < 50; i++) {
              if (tracks[offset+i] != null) {
                tracks[offset+i] = Object.assign(tracks[offset+i], response.audio_features[i]);
                this.state.importantInfo.apiResponses += 1;
              }

            }
            this.setState({
              multiTracks: {
                tracks: tracks
              },
            });
            if (this.state.importantInfo.apiResponses === this.state.importantInfo.numSavedSongs) {
                    this.drawCharts();
                    this.sortMostDanceable();
                    this.displayTopFives();
              //remove loading loading screen
            }
          });



      })
  }

// Finds every track a user has saved
  getAllSavedTracks() {
    spotifyApi.getMySavedTracks()
      .then((response) => {
        this.setState({
          importantInfo: {
            numSavedSongs: response.total,
            apiResponses: 0,
          }
        });
        var totalSaved = this.state.importantInfo.numSavedSongs;
        var minimumTotalCalls = Math.ceil(totalSaved / 50);
        var offset = 0;
        var tracks = new Array();

        for (var i = 0; i < minimumTotalCalls; i++) {
          this.getAllSavedHelper(offset, tracks);
          offset+= 50;
        }

      }).catch(e => {console.log("xx");});



  }

// Sort all tracks by most danceable attribute
  sortMostDanceable() {
    var tracks = this.state.multiTracks.tracks;
    tracks.sort((a, b) => (a.danceability > b.danceability) ? 1 : -1);
    this.setState({
      mostDanceableSong: {
          name: tracks[tracks.length-1].name,
          albumArt: tracks[this.state.importantInfo.numSavedSongs-1].album.images[0].url,
        }
    });
    this.setState({
      loaded: true,
    })
  }

// Graphs and barchart tests
 barChart(dataArr, LabelsArr) {
    var ctx = 'genreChart';

    var dataArr = [4, 12, 52, 2, 12]
    var labelsArr = ["Rock", "Hip hop", "Blues", "Metal", "Jazz"]
    var colorsArr = ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"]
    var options = {
        title: {
            display: true,
            text: 'My big ol bar chart'
        },
        legend: { display: false },
        scales: {
            xAxes: [{
                gridLines: {
                    offsetGridLines: true
                }
            }]
        }
    };


    var myBarChart = new Chart(ctx, {
    type: 'bar',
    data: {

    labels: labelsArr,
    datasets: [{
        backgroundColor: colorsArr,
        data: dataArr
    }]
    },
    options: options
    });
 }

  donutChart(dataArr, labelsArr, colorsArr, title, chartName="valence-breakdown") {
    var tracks = this.state.multiTracks.tracks;
    //chartName = "valence-breakdown";
    var ctx = chartName;
        var options = {
            elements: {
                arc: {
                    borderWidth: 1,
                    }
            },
            title: {
                display: true,
                text: title
            },
            legend:{
                display:true
            }
        };


        var myBarChart = new Chart(ctx, {
        type: 'doughnut',
        data: {

        labels: labelsArr,
        datasets: [{
            backgroundColor: colorsArr,
            data: dataArr
        }]
        },
        options: options
        });
   }


  drawCharts(){
    var valenceCounts = stats.splitByField(this.state.multiTracks.tracks,"valence");
    var valenceData = stats.getBucketCount(valenceCounts);
    var valenceLabels = stats.getBucketLabel(valenceCounts);
    var colors = ["#000000", "#1A1A1A","#333333","#4D4D4D","#696969","#808080","#999999","#B0B0B0","#C9C9C9","#E3E3E3","#FFFFFF"]
    var title = 'Valence break down of your saved songs'
    this.donutChart(valenceData,valenceLabels, colors,title,"valence-breakdown");
  }

  displayTopFives(){
  var fields = ['valence','danceability','tempo','liveness','loudness','energy','duration_ms','popularity']
  for (var f in fields){
      var topFiveArr = stats.getTopFive(this.state.multiTracks.tracks,fields[f])
      this.state.topFives[f] = topFiveArr;
  }

}


// When page first loads, check if logged in. If not, redirect to log in.
// Otherwise, find all the user's data.
  componentDidMount() {
    if (this.state.loggedIn === false) {
      window.location.replace("http://localhost:8888/");
    }

    try {
      this.getNowPlaying();
    }
    catch(error) {
      console.log("eerrr");
    }


  }


  render() {
    let {loaded} = this.state;

    return (
      <div className="App">
        {loaded ?
          ("") :
          (<div class = "loadingscreen">
            <h1>Loading</h1>
            <h2>Please bear with us while we analyze your listening history</h2>
            <h3>This should take no longer than 30 seconds.</h3>
            <br/>
            <div class="item">
				        <div class="loader09">
                </div>
			      </div>
          </div>
          )}


        <div className="Below">
          <TopBar />
          <div className="SideNav-Wrapper">
            <SideNav/>
          </div>
          <div className="Content">
            <div>
              You have saved: {this.state.importantInfo.numSavedSongs}
            </div>
            <div>
              Your most danceable song: {this.state.mostDanceableSong.name}
            </div>
            <div>
              <img src={this.state.mostDanceableSong.albumArt} style={{ height: 150 }} alt = ""/>
            </div>
            <div className="Top 5s">
                Your Top 5 Most Valent Songs :
                <formatTopFive topFives = {this.state.topFives['valence']}/>
            </div>
            <div className="Chart-container">
                <canvas id="valence-breakdown" width="2" height="1"></canvas>
            </div>
            <div>
              <h1>Content</h1>
              <h1>Content</h1>
              <h1>Content</h1>
              <h1>Content</h1>
              <h1>Content</h1>
              <h1>Content</h1>
              <h1>Content</h1>
              <h1>Content</h1>
              <h1>Content</h1>
              <h1>Content</h1>
              <h1>Content</h1>
            </div>
          </div>

        </div>


      </div>
    );
  }
}

export default App;
