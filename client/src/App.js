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
      loggedIn: token ? true : false,
      nowPlaying: { name: 'Not Checked', albumArt: '' },
      multiTracks: {tracks: new Array() },
      importantInfo: {
        numSavedSongs: 0
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
    this.getAllTheSaved();

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

  getAllSaved() {
    spotifyApi.getMySavedTracks({limit: 50, offset: 10})
      .then((response) => {
        var tracks = [""];
        console.log(response);
        for (var i = 0; i < 20; i++) {
          tracks[i] = response.items[i].track.name;
        }
        this.setState({
          multiTracks: {
            tracks: tracks
          },
          importantInfo: {
            numSavedSongs: response.total
          }
        });
      })
  }

  getAllSavedHelper(offset) {
    spotifyApi.getMySavedTracks({limit: 50, offset: offset})
      .then((response) => {
        //var tracks = this.state.multiTracks.tracks;
        var tracks = [""];
        console.log(response);
        for (var i = 0; i < 50; i++) {
          if (response.items[i] != null) {
            tracks[offset+i] = i + ". " +response.items[i].track.name + '\n';
          }
        }
        this.setState({
          multiTracks: {
            tracks: tracks
          },
        });
      })
  }

  getAllTheSaved() {
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

    for (var i = 0; i < minimumTotalCalls; i++) {
      this.getAllSavedHelper(offset);
      offset+= 50;
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
         More recently saved: {this.state.multiTracks.tracks}
        </div>
        { this.state.loggedIn &&
          <button onClick={() => this.getNowPlaying()}>
            Check Now Playing
          </button>
        }
      </div>
    );
  }
}

export default App;
