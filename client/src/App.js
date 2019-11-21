import React, { Component } from 'react';

import './App.css';
//import splitByValence from './statsHelper';
import './foundation.css';
import './spotistyle.css';

import TopBar from './TopBar';
import SideNav from './SideNav';
import TimeFrame from './TimeFrame';

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
        numToAnlayzeSavedSongs: 0, //Count of songs saved by a user
        display_name: null,
        numSavedSongs: 0,
      },
      mostDanceableSong: {
        name: 'Not Checked',
        albumArt: ''
      },
      apiResponses: 0,
      loaded: false,
      percentLoaded: 0,
      timeframeChosen: "AllSaved", //AllSaved default, other options are last50 vs. last250 vs. favoritegenre
      graphScrollTo: "",
      prevtimeframeChosen: "AllSaved",
      error: false,
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
      this.getAllSavedTracks(2000); //Get all saved tracks
    }
    else if (this.state.timeframeChosen === "last50") {
      this.getAllSavedTracks(50); //Get 50 tracks
    }
    else if (this.state.timeframeChosen === "last250") {
      this.getAllSavedTracks(250); //get 250 saved
    }
    else if (this.state.timeframeChosen === "last2000") {
      this.getAllSavedTracks(2000); //get 2000 saved
    }
    else if (this.state.timeframeChosen === "favoritegenre") {
      this.getAllSavedTracks(-1); //analyze favoritegenre
    }



    spotifyApi.getMe()
      .then((response) => {
        if (!!response.display_name) {
          this.setState({username: response.display_name});
        }
        if(!!response.images && response.images.length !== 0) {
          //console.log(response);
          this.setState({profilepic: response.images[0].url});
        }
        else {
          this.setState({profilepic: "https://icon-library.net/images/generic-profile-icon/generic-profile-icon-8.jpg"})
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
                percentSave = Math.ceil((this.state.apiResponses / this.state.importantInfo.numToAnlayzeSavedSongs) *100);
                tracks[offset+i] = Object.assign(tracks[offset+i], response.audio_features[i]);
                this.setState({ apiResponses: this.state.apiResponses + 1 })
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
            if (this.state.apiResponses === this.state.importantInfo.numToAnlayzeSavedSongs) {
                    this.RadarAnalysis();
                    this.drawCharts();
                    this.sortMostDanceable();
            }
          }).catch(e => {
            this.setState({
                    loaded: true,
                    importantInfo: {
                      numToAnlayzeSavedSongs: this.state.apiResponses,
                    },
                    error: true,
                  });
                  this.RadarAnalysis();
                  this.drawCharts();
                  this.sortMostDanceable();
                });



      })
  }

  RadarAnalysis() {

  }

// Finds every track a user has saved
  getAllSavedTracks(trackcounttofind) {
    spotifyApi.getMySavedTracks()
      .then((response) => {
        var totalSaved = response.total;
        var realTotalSaved = response.total;
        //Code for track count = all tracks means trackcounttofind is 0
        if (trackcounttofind === 50) {
          if (totalSaved > 50) {
            totalSaved = 50;
          }
        }
        else if (trackcounttofind === 250) {
          if (totalSaved > 250) {
            totalSaved = 250;
          }
        }
        else if (trackcounttofind === 2000) {
          if (totalSaved > 2000) {
            totalSaved = 2000;
          }
        }

        this.setState({
          importantInfo: {
            numToAnlayzeSavedSongs: totalSaved,
            numSavedSongs: realTotalSaved,
          },
          apiResponses: 0
        });
        var minimumTotalCalls = Math.ceil(totalSaved / 50);
        var offset = 0;
        var tracks = [];

        for (var i = 0; i < minimumTotalCalls; i++) {
          this.getAllSavedHelper(offset, tracks);
          offset+= 50;
        }

      }).catch(e => { this.setState({
                          error: true,
                        });});



  }

// Sort all tracks by most danceable attribute
  sortMostDanceable() {
    var tracks = this.state.multiTracks.tracks;
    tracks.sort((a, b) => (a.danceability > b.danceability) ? 1 : -1);
    this.setState({
      mostDanceableSong: {
          name: tracks[tracks.length-1].name,
          albumArt: tracks[this.state.importantInfo.numToAnlayzeSavedSongs-1].album.images[0].url,
        }
    });
    this.setState({
      loaded: true,
    })
  }

// Graphs and barchart tests
 barChart(dataArr, LabelsArr) {
    var ctx = 'genreChart';

    var dataArr = [4, 12, 52, 2, 12];
    var labelsArr = ["Rock", "Hip hop", "Blues", "Metal", "Jazz"];
    var colorsArr = ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850"];
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
    var colors = ["#412967","#764ABC","#8E6AC8","#B49CDA", "#D9CDEC"]
    //    var colors = ["#412967", "#4C3078","#613D9A","#764ABC","#825AC2","#8E6AC8","#9B7BCE","#B49CDA","#C0ACE0", "#D9CDEC"]
    var title = 'Emotional break down of your saved songs'
    this.donutChart(valenceData,valenceLabels, colors,title);
    this.barChart();
    this.RadarChart();
  }

  RadarChart() {
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
    this.setState({
      percentLoaded: 0,
      loaded: false,
      error: false,
    });


    try {
      this.startAnalysis();
    }
    catch(error) {
      this.setState({
                         error: true,
                       });
    }
  }


  componentDidUpdate(prevProps) {
    if (this.state.prevtimeframeChosen !== this.state.timeframeChosen) {
      this.setState({
        prevtimeframeChosen: this.state.timeframeChosen
      });
      this.componentDidMount();
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
    var valArr = ["Negative emotions", "Leaning negative", "Neutral", "Leaning positive", "Very positive emotions"];
    /*for (var key in dict){
        valArr.push(key.toString() + "-" +(parseInt(key)+20))
    }*/
    return valArr;
  }

  splitByValence(tracks){
    var countDict = {}
    for (var i in tracks){
        var val = tracks[i].valence
        val = (Math.floor(val*5))*20

        if(val in countDict){
            countDict[val] += 1
        }else{
            countDict[val] = 1
        }
    }
    return countDict
  }

  timelineUpdate = (time) => {
    this.setState({
      timeframeChosen : time
    })
  }

  graphScroll = (graph) => {
    this.setState({
      graphScrollTo : graph
    })
  }


  render() {
    let {loaded} = this.state;
    let {error} = this.state;
    return (
      <div className="App">
        {loaded ?
          ("") :
          (<div className = "loadingscreen">
            <br/>
            <h1>Loading {this.state.percentLoaded}%</h1>
            <h2>Please bear with us while we analyze your listening history</h2>
            <h3>This should take no longer than 30 seconds.</h3>
            {error ?
            (<h1>There was an error on Spotify's end. Please try again later.</h1>) :
            ("")}
            <br/>
            <div className="item">
				        <div className="loader09">
                </div>
			      </div>
          </div>
          )}


        <div className="Below">
          <TopBar username = {this.state.username} profilepic = {this.state.profilepic} timelineUpdate = {this.timelineUpdate}/>
          <div className="SideNav-Wrapper">
            <SideNav graphScroll = {this.graphScroll} />
          </div>
          <TimeFrame timelineUpdate = {this.timelineUpdate} />
          <div className="Content">
            <div>
              <h1>Welcome to Spotiviz!</h1>
              <h3>Please select how far back we should analyze your music at the top.</h3>
              <hr/>
            </div>
            <div>
              <h2>The Basics:</h2>
              <h5>You have saved {this.state.importantInfo.numSavedSongs} songs.</h5>
              {error ?
              (<h5>There was an error on Spotify's end. We are able to analyze {this.state.importantInfo.numToAnlayzeSavedSongs} songs.</h5>) :
              (<h5>We will be analyzing your most recent {this.state.importantInfo.numToAnlayzeSavedSongs} songs.</h5>)}
              <h5>Time Frame Chosen: {this.state.timeframeChosen}</h5>
              <br/>
              <hr/>
            </div>
            <div id = "top5">
              <h2>Top 5's:</h2>
              Your most danceable song: {this.state.mostDanceableSong.name}
              <br/>
              <img src={this.state.mostDanceableSong.albumArt} style={{ height: 150 }} alt = ""/>
              <hr/>
            </div>
            <div className="Chart-container">
              <h2>Genre Breakdown</h2>
                <canvas id="donut-chart" width="2" height="1"></canvas>
                <canvas id="genreChart" width="400" height="200"></canvas>
                <canvas id="radar-chart" width="2" height="1"></canvas>
                <br/>
                <br/>
              <hr/>
            </div>
            <div>
              <h2>Averages</h2>
              <hr/>
            </div>
          </div>

        </div>


      </div>
    );
  }
}

export default App;
