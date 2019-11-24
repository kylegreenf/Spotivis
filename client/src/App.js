import React, { Component } from 'react';

import './App.css';


import './foundation.css';
import './spotistyle.css';

import TopBar from './TopBar';
import SideNav from './SideNav';
import FormatTopFive from './topFiveFormater';
import TimeFrame from './TimeFrame';
import FormatAverages from './FormatAverages';

import placeholder from './placeholder.jpg';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
var stats = require('./statsHelper');
var averagesHelper = require('./averagesHelper');
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
      topFives: {},
      averagesInfo: {},
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


    spotifyApi.getMe()
      .then((response) => {
        if (!!response.display_name) {
          this.setState({username: response.display_name});
        }
        if(!!response.images && response.images.length !== 0) {
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
                    this.drawCharts();
              //remove loading loading screen
            }
          }).catch(e => {
            this.setState({
                    loaded: true,
                    importantInfo: {
                      numToAnlayzeSavedSongs: this.state.apiResponses,
                    },
                    error: true,
                  });
                  this.drawCharts();
                });



      })
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

  donutChart() {
    var valenceCounts = this.splitByValence(this.state.multiTracks.tracks);
    var dataArr = this.getBucketCount(valenceCounts);
    var labelsArr = this.getBucketLabel(valenceCounts);
    var colorsArr = ["#412967","#764ABC","#8E6AC8","#B49CDA", "#D9CDEC"]
    //    var colors = ["#412967", "#4C3078","#613D9A","#764ABC","#825AC2","#8E6AC8","#9B7BCE","#B49CDA","#C0ACE0", "#D9CDEC"]
    var title = 'Emotional break down of your saved songs'
    var chartName = "valence-breakdown";

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

   getAverages() {
     this.setState()
     var explicitinfo = averagesHelper.explicitCount(this.state.multiTracks.tracks);
     this.setState({
       averagesInfo: explicitinfo,
     });
   }


  drawCharts(){
    this.donutChart();
    this.barChart();
    this.RadarChart();
    this.loadTopFives();
    this.getAverages();
    this.setState({
      loaded: true,
    });
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

  loadTopFives(){
  var fields = ['valence','danceability','tempo','liveness','loudness','energy','duration_ms','popularity']
  for (var f in fields){
      var topFiveArr = stats.getTopFive(this.state.multiTracks.tracks,fields[f])
      this.state.topFives[fields[f]] = topFiveArr;
  }
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
              <br/>
              <hr/>
            </div>
            <div  className="top-5 container">
              <a class="anchor" id="top5"></a>
              <h2>Top 5's</h2>

              <div className="topfives">
                  Valent
                  <FormatTopFive topFives = {this.state.topFives['valence']}/>
                  Fastest
                  <FormatTopFive topFives = {this.state.topFives['tempo']}/>
                  Dancable
                  <FormatTopFive topFives = {this.state.topFives['danceability']}/>
              </div>
              <br/>
              <hr/>
            </div>

            <div className="Chart-container">
              <a class="anchor" id="genre"></a>
              <h2>Genre Breakdown</h2>
                <canvas id="valence-breakdown" width="2" height="1"></canvas>
                <canvas id="genreChart" width="400" height="200"></canvas>
                <canvas id="radar-chart" width="2" height="1"></canvas>
                <br/>
                <br/>
              <hr/>
            </div>
            <div className="hipster-container">
              <a class="anchor" id="hipster"></a>
              <h2>Hipster Rating</h2>
              <img src={placeholder}></img>
              <hr/>
            </div>
            <div classname="averages-container">
              <a class="anchor" id="averages"></a>
              <h2>Averages</h2>
              <FormatAverages averageinfo = {this.state.averagesInfo}/>
              <img src={placeholder}></img>
              <hr/>
            </div>
          </div>

        </div>


      </div>
    );
  }
}

export default App;
