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
  getAudioFeaturesHelper(tracksToSearch, ihundreds) {
    var trackIds = [];
    // Find every track ID to search from the track object's id variable
    for (var i = 0; i < 100; i++) {
      if (tracksToSearch[i] != null) {
        trackIds[i] = tracksToSearch[i].id;
      }
    }

    // Find the Audio Features for each track, then merge with existing track object
    spotifyApi.getAudioFeaturesForTracks(trackIds)
      .then((response) => {
        for (var i = 0; i < 100; i++) {
          if (tracksToSearch[i*100] != null) {
            tracksToSearch[i] = Object.assign(tracksToSearch[i*100], response.audio_features[i]);
          }
        }
      });

  }

// Slices tracks saved and calculates features (danceability for ex)
// in increments of 100 songs at a time.
  getAudioFeatures() {
    var totalSaved = this.state.importantInfo.numSavedSongs;
    var minimumTotalCalls = Math.ceil(totalSaved / 100);

    for (var i = 0; i < minimumTotalCalls; i++) {
      this.getAudioFeaturesHelper(this.state.multiTracks.tracks.slice(i*100,(i+1)*100), i);
    }
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
          <button onClick={() => this.getAudioFeatures()}>
            Analyze after check
          </button>
        }
      </div>
    );
  }
}

export default App;
