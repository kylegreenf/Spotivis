import React, { Component } from 'react';

import './App.css';
//import splitByValence from './statsHelper';
import './foundation.css';
import './spotistyle.css';

import TopBar from './TopBar';
import SideNav from './SideNav';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
var Chart = require('chart.js');

class App extends Component {
  constructor(props){
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      profilepic : {},
      username : "",
      loggedIn: token ? true : false, // True if user is logged in
      multiTracks: {tracks: [] }, // Array to hold all saved tracks + info as object
      topArtists: [],
      importantInfo: { //Important information to be used by our app
        numSavedSongs: 0, //Count of songs saved by a user
        apiResponses: 0,
        display_name: null,
      },
      mostDanceableSong: {
        name: 'Not Checked',
        albumArt: ''
      },
      loaded: false,
      percentLoaded: 0,
      timeframeChosen: "AllSaved" //AllSaved default, other options are AllListeningHistory vs. MediumTerm vs. ShortTerm
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

  startAnalysis(){
    if (this.state.timeframeChosen === "AllSaved") {
      this.getAllSavedTracks(); //Get all saved tracks
    }
    else if (this.state.timeframeChosen === "AllListeningHistory") {

    }
    else if (this.state.timeframeChosen === "MediumTerm") {

    }
    else if (this.state.timeframeChosen === "ShortTerm") {

    }



    spotifyApi.getMe()
      .then((response) => {
        if (!!response.display_name) {
          this.setState({username: response.display_name});
        }
        if(!!response.images) {
          this.setState({profilepic: response.images[0]});
        }
        if (response.images === null) {
          this.setState({profilepic: null})
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

        var percentSave = 0;
        // Find the Audio Features for each track, then merge with existing track object
        spotifyApi.getAudioFeaturesForTracks(trackIds)
          .then((response) => {
            for (var i = 0; i < 50; i++) {
              if (tracks[offset+i] != null) {
                percentSave = Math.ceil((this.state.importantInfo.apiResponses / this.state.importantInfo.numSavedSongs) *100);
                tracks[offset+i] = Object.assign(tracks[offset+i], response.audio_features[i]);
                this.setState({
                  importantInfo: {
                      apiResponses: this.state.importantInfo.apiResponses + 1
                    }
                });
                this.setState({
                  percentLoaded: percentSave
                });

              }

            }
            this.setState({
              multiTracks: {
                tracks: tracks
              },
            });
            if (this.state.importantInfo.apiResponses === this.state.importantInfo.numSavedSongs) {
                    this.RadarAnalysis();
                    this.drawCharts();
                    this.sortMostDanceable();
            }
          });



      })
  }

  RadarAnalysis() {

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

  donutChart(dataArr, labelsArr, colorsArr, title) {
    var tracks = this.state.multiTracks.tracks;
    var ctx = 'donut-chart';
        var options = {
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
    var valenceCounts = this.splitByValence(this.state.multiTracks.tracks);
    var valenceData = this.getBucketCount(valenceCounts);
    var valenceLabels = this.getBucketLabel(valenceCounts);
    var colors = ["#412967", "#4C3078","#613D9A","#764ABC","#825AC2","#8E6AC8","#9B7BCE","#B49CDA","#C0ACE0", "#D9CDEC"]
    var title = 'Happiness break down of your saved songs'
    this.donutChart(valenceData,valenceLabels, colors,title);
    this.barChart();
    this.RadarChart();
  }

  RadarChart() {
    var tracks = this.state.multiTracks.tracks;
    var ctx = 'radar-chart';
        var options = {
            title: {
                display: true,
                text: "Diversity Analysis"
            },
            legend:{
                display:true
            }
        };
    var options = {
        scale: {
            angleLines: {
                display: true
            },
            ticks: {
                suggestedMin: 0,
                suggestedMax: 290
            }
        }
    };


        var myBarChart = new Chart(ctx, {
          type: 'radar',
          data: {
            labels: ['Danceability', 'Energy', 'Loudness', 'Happiness', 'Acousticness'],
            datasets: [{
                borderColor: ["#764abc"],
                backgroundColor: ["#361a9c"],
                data: [250, 100, 40, 190, 165],
            }]
          },
          options: options
        });
  }

// When page first loads, check if logged in. If not, redirect to log in.
// Otherwise, find all the user's data.
  componentDidMount() {
    if (this.state.loggedIn === false) {
      window.location.replace("http://localhost:8888/");
    }

    try {
      this.startAnalysis();
    }
    catch(error) {
      console.log("eerrr");
    }


  }


  getBucketCount(dict){
    var valArr = [];
    for (var key in dict){
        valArr.push(dict[key])
    }
    return valArr;
  }

  getBucketLabel(dict){
    var valArr = [];
    for (var key in dict){
        valArr.push(key.toString() + "-" +(parseInt(key)+10))
    }
    return valArr;
  }

  splitByValence(tracks){
    var totalLen = tracks.length
    var countDict = {}
    for (var i in tracks){
        var val = tracks[i].valence
        val = (Math.floor(val*10))*10

        if(val in countDict){
            countDict[val] += 1
        }else{
            countDict[val] = 1
        }
    }
    return countDict
  }


  render() {
    let {loaded} = this.state;

    return (
      <div className="App">
        {loaded ?
          ("") :
          (<div class = "loadingscreen">
            <br/>
            <h1>Loading {this.state.percentLoaded}%</h1>
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
          <TopBar username = {this.state.username} profilepic = {this.state.profilepic}/>
          <div className="SideNav-Wrapper">
            <SideNav />
          </div>
          <div className="Content">
            <div>
              <h1>Welcome to Spotiviz!</h1>
              <h3>Please select how far back we should analyze your music at the top.</h3>
              <hr/>
            </div>
            <div>
              <h2>The Basics:</h2>
              <h5>You have saved {this.state.importantInfo.numSavedSongs} songs.</h5>
              <br/>
              <hr/>
            </div>
            <div>
              Your most danceable song: {this.state.mostDanceableSong.name}
            </div>
            <div>
              <img src={this.state.mostDanceableSong.albumArt} style={{ height: 150 }} alt = ""/>
            </div>
            <div className="Chart-container">
                <canvas id="donut-chart" width="2" height="1"></canvas>
                <canvas id="genreChart" width="400" height="200"></canvas>
                <canvas id="radar-chart" width="2" height="1"></canvas>
                <br/>
                <br/>
                <br/>
            </div>
          </div>

        </div>


      </div>
    );
  }
}

export default App;
