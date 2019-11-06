import React, { Component } from 'react';

import './App.css';
import './foundation.css';
import './spotistyle.css';
import TopBar from './TopBar';
import SideNav from './SideNav';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();
var Chart = require('chart.js');

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
      nowPlaying: { name: 'Not Checked', albumArt: '' }, // Name of current song + picture
      multiTracks: {tracks: [] }, // Array to hold all saved tracks + info as object
      importantInfo: { //Important information to be used by our app
        numSavedSongs: 0, //Count of songs saved by a user
        apiResponses: 0
      },
      mostDanceableSong: {
        name: 'Not Checked',
        albumArt: ''
      },
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
    this.donutChart()
    this.barChart()

    //To remove
    this.getAllSavedTracks();

    spotifyApi.getMyCurrentPlaybackState()
      .then((response) => {
        if (response.item != null) {
          this.setState({
            nowPlaying: {
                name: response.item.name,
                albumArt: response.item.album.images[0].url
              }
          });
        }
        else {
          this.setState({
            nowPlaying: {
                name: "Nothing is playing currently"
              }
          });
        }
      })
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
                      this.sortMostDanceable();
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

      });



  }


  sortMostDanceable() {
    var tracks = this.state.multiTracks.tracks;
    tracks.sort((a, b) => (a.danceability > b.danceability) ? 1 : -1);
    this.setState({
      mostDanceableSong: {
          name: tracks[tracks.length-1].name,
          albumArt: tracks[this.state.importantInfo.numSavedSongs-1].album.images[0].url,
        }
    });
  }


 barChart(dataArr, LabelsArr) {
    var ctx = 'genreChart';

    var dataArr = [4, 12, 554, 2, 12]
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

  donutChart(dataArr, LabelsArr) {
    var ctx = 'donut-chart';

        var dataArr = [30, 10, 30, 15, 20]
        var labelsArr = ["Rock", "Hip hop", "Blues", "Metal", "Jazz"]
        var colorsArr = ["#3e95cd", "#8e5ea2","#3cba9f","#e8c3b9","#c45850","#c45850"]
        var options = {
            title: {
                display: true,
                text: 'My big ol donut chart'
            },
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

  componentDidMount() {
    this.getNowPlaying();
  }

  render() {

    return (
      <div className="App">

        <TopBar />
        <div className="Below">
          <div className="SideNav-Wrapper">
            <SideNav />
          </div>
          <div className="Content">
            <a href='http://localhost:8888' > Login to Spotify </a>
            <div>
              Now Playing: { this.state.nowPlaying.name }
            </div>
            <div>
              <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }} alt = ""/>
            </div>
            <div>
            <div>
              You have saved: {this.state.importantInfo.numSavedSongs}
            </div>
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
