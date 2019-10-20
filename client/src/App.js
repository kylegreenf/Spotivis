import React, { Component } from 'react';
import './App.css';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();

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
      }
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
        for (var i = 0; i < 50; i++) {
          if (response.items[i] != null) {
            tracks[offset+i] = response.items[i].track;
          }
        }
        this.setState({
          multiTracks: {
            tracks: tracks
          },
        });

      })
  }

// Finds every track a user has saved
  getAllSavedTracks() {
    spotifyApi.getMySavedTracks()
      .then((response) => {
        this.setState({
          importantInfo: {
            numSavedSongs: response.total
          }
        });
      });

    var totalSaved = this.state.importantInfo.numSavedSongs;
    var minimumTotalCalls = Math.ceil(totalSaved / 50);
    var offset = 0;
    var tracks = new Array();

    for (var i = 0; i < minimumTotalCalls; i++) {
      this.getAllSavedHelper(offset, tracks);
      offset+= 50;
    }

  }

// Input: array of track objects. Can do a maximum of 100 songs per call.
// Finds features (danceability/tempo/etc) of song.
// 100 tracks sent by getAudioFeatures()
  getAudioFeaturesHelper(tracksToSearch) {
    var trackIds = [];
    console.log(tracksToSearch[0].id);
    for (var i = 0; i < 100; i++) {
      trackIds[i] = tracksToSearch[i].id;
    }

    spotifyApi.getAudioFeaturesForTracks(trackIds)
      .then((response) => {
        console.log(response);
      });
  }

// Slices tracks saved and calculates features (danceability for ex)
// in increments of 100 songs at a time.
  getAudioFeatures() {
    this.getAudioFeatures(this.state.multiTracks.tracks.slice(0,100));
  }


  render() {

    return (
      <div className="App">
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
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
        { this.state.loggedIn &&
          <button onClick={() => this.analyzeFirstSong()}>
            Analyze after check
          </button>
        }
      </div>
    );
  }
}

export default App;
