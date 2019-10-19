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
      trackInfo: { firstplaylistname: "saved" },
      multiTracks: {tracks: [] }
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





  getRecentSaved() {
    spotifyApi.getMySavedTracks()
      .then((response) => {
                console.log(response);
        this.setState({
          trackInfo: {
            firstplaylistname: response.items[0].track.name
          }
        });
      })
  }
  getNowPlaying(){
    //To remove
    this.getRecentSaved();
    this.getAllSaved();

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
    spotifyApi.getMySavedTracks()
      .then((response) => {
        var tracks = [""];
        console.log(response);
        for (var i = 0; i < 20; i++) {
          tracks += response.items[i].track.name;
          tracks += '\n';
        }
        this.setState({
          multiTracks: {
            tracks: tracks
          }
        });
      })
  }


  render() {

    return (
      <div className="App">
        <a href='http://localhost:8888' > Login to Spotify </a>
        <div>
          Now Playing: { this.state.nowPlaying.name }
        </div>
        <div>
          <img src={this.state.nowPlaying.albumArt} style={{ height: 150 }}/>
        </div>
        <div>
         Most recently saved: {this.state.trackInfo.firstplaylistname}
        </div>
        <div>
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
