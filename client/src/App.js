import './static/stylesheets/css/style.css';

import React, {
  Component,
  Fragment
} from 'react';

import * as _ from 'lodash';
import SpotifyWebApi from 'spotify-web-api-js';

import MeBar from './components/MeBar'
import NowPlaying from './components/NowPlaying'

const spotifyApi = new SpotifyWebApi();

class App extends Component {
  constructor(){
    super();

    const params = this.getHashParams();
    const token = params.access_token;

    if (token) {
      spotifyApi.setAccessToken(token);
    }

    this.toggleIsPlaying = this.toggleIsPlaying.bind(this);
    this.skipToNext = this.skipToNext.bind(this);
    this.skipToPrevious = this.skipToPrevious.bind(this);
    this.toggleShuffle = this.toggleShuffle.bind(this);
    this.transferToDevice = this.transferToDevice.bind(this);
    this.seek = this.seek.bind(this);

    this.stopPlaybackPolling = this.stopPlaybackPolling.bind(this);

    this.pollingInterval = 1000;

    this.state = {
      loggedIn: token ? true : false,
      user: {},
      nowPlaying: {}
    }
  }

  getHashParams() {
    let hashParams = {};
    let e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  componentWillMount() {
    let self = this;
    self.getUserData();
    self.getPlayerData();
    self.startPlaybackPolling();
  }

  startPlaybackPolling(callback=_.noop()) {
    let self = this;
    self.stopPlaybackPolling(() => {
      self.playbackPolling = setInterval(() => {
        self.getPlayerData();
        self.getUserData();
      }, self.pollingInterval);
    }, callback);
  }

  stopPlaybackPolling(callback=_.noop()) {
    let self = this;
    clearTimeout(self.playbackPolling);
    if (callback)
    {
      callback();
    }
  }

  // GET

  getPlayerData(callback=_.noop()) {
    let self = this;
    self.getPlayingTrack(() => {
      self.getPlayerState(() => {
        self.setNowPlayingState({
          resolved: true
        }, callback);
      });
    });
  }

  getUserData(callback=_.noop()) {
    let self = this;
    self.getUser(() => {
      self.getUserPlaylists(() => {
        self.getMyDevices(() => {
          self.setUserState({
            resolved: true
          }, callback);
        });
      });
    });
  }

  getPlayingTrack(callback=_.noop()) {
    let self = this;
    spotifyApi.getMyCurrentPlayingTrack().then((data) => {
      self.setNowPlayingState({
        playingTrack: data.item
      }, callback);
    });
  }

  getPlayerState(callback=_.noop()) {
    let self = this;
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      self.setNowPlayingState({
        playingState: data
      }, callback);
    });
  }

  getUser(callback=_.noop()) {
    let self = this;

    spotifyApi.getMe().then((data) => {
      self.setUserState({
        me: data
      }, callback);
    });
  }

  getUserPlaylists(callback=_.noop()) {
    let self = this;

    spotifyApi.getUserPlaylists().then((data) => {
      self.setUserState({
        playlist: data
      }, callback);
    });
  }

  getMyDevices(callback=_.noop()) {
    let self = this;

    spotifyApi.getMyDevices().then((data) => {
      self.setUserState({
        devices: data.devices
      }, callback);
    });
  }

  // SET

  setUserState(update, callback=_.noop()) {
    let self = this;

    const {
      user
    } = self.state;

    let updated_user = _.assignIn(_.cloneDeep(user), update);

    self.setState({
      user: updated_user
    }, callback);
  }

  setPlaybackState(update, callback=_.noop()) {
    let self = this;

    const {
      nowPlaying
    } = self.state;

    let updated_nowPlaying = _.cloneDeep(nowPlaying);

    _.assignIn(updated_nowPlaying.playingState, update);

    self.setState({
      nowPlaying: updated_nowPlaying
    }, callback);
  }

  setNowPlayingState(update, callback=_.noop()) {
    let self = this;

    const {
      nowPlaying
    } = self.state;

    let updated_nowPlaying = _.assignIn(_.cloneDeep(nowPlaying), update);

    self.setState({
      nowPlaying: updated_nowPlaying
    }, callback);
  }

  toggleIsPlaying(callback=_.noop()) {
    let self = this;

    const {
      is_playing
    } = self.state.nowPlaying.playingState;

    if (is_playing)
    {
      self.playerPause(callback);
    }
    else
    {
      self.playerPlay(callback);
    }
  }

  playerPause(callback=_.noop()) {
    let self = this;
    spotifyApi.pause().then(() => {
      self.setPlaybackState({
        is_playing: false
      });
    });
  }

  playerPlay(callback=_.noop()) {
    let self = this;
    spotifyApi.play().then(() => {
      self.setPlaybackState({
        is_playing: true
      }, () => {
        self.startPlaybackPolling(callback);
      });
    });
  }

  toggleShuffle(callback=_.noop()) {
    let self = this;

    const {
      shuffle_state
    } = self.state.nowPlaying.playingState;

    if (shuffle_state)
    {
      self.playerShuffle(false, callback);
    }
    else
    {
      self.playerShuffle(true, callback);
    }
  }

  playerShuffle(update, callback=_.noop()) {
    let self = this;
    self.setPlaybackState({
      shuffle_state: update
    }, () => {
      spotifyApi.setShuffle(update).then(callback);
    });
  }

  skipToNext(callback=_.noop()) {
    let self = this;
    spotifyApi.skipToNext(() => {
      self.seek(0, () => {
        self.playerPlay(callback);
      })
    });
  }

  skipToPrevious(callback=_.noop()) {
    let self = this;
    spotifyApi.skipToNext(() => {
      self.seek(0, () => {
        self.playerPlay(callback);
      })
    });
  }

  seek(ms_position, callback=_.noop()) {
    let self = this;
    spotifyApi.seek(ms_position).then(() => {
      self.playerPlay(() => {
        self.startPlaybackPolling();
      }, callback);
    });
  }

  transferToDevice(device_id, callback=_.noop())
  {
    let self = this;
    spotifyApi.transferMyPlayback([ device_id ]).then(callback);
  }

  render() {
    let self = this;

    const {
      nowPlaying
    } = self.state;

    let playerResolved = (nowPlaying.playingTrack && nowPlaying.playingState);

    return (
      <Fragment>
        { playerResolved &&
          <Fragment>
            <div className="u-pos-fixed u-height-p-10 u-width-p-12 major-album-background-img"
                  style={{backgroundImage: "url('" + nowPlaying.playingTrack.album.images[0].url + "')"}}
            ></div>
            <div className="d-flex u-pos-fixed u-height-p-10 u-width-p-12 major-album-background">
              <div className="col p-0">
                <NowPlaying {...self.state}
                            stopPlaybackPolling={self.stopPlaybackPolling}
                            actions={{
                              onTogglePlay:     self.toggleIsPlaying,
                              onSkipToNext:     self.skipToNext,
                              onSkipToPrevious: self.skipToPrevious,
                              onToggleShuffle:  self.toggleShuffle,
                              onSelectDevice:   self.transferToDevice,
                              onSeek:           self.seek
                            }}
                />
              </div>
              <div className="col-auto p-0 u-z-index-3">
                <MeBar {...self.state} />
              </div>
            </div>
          </Fragment>
        }
      </Fragment>
    );

  }
}

export default App;
