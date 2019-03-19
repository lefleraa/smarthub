import './static/stylesheets/css/style.css';

import React, {
  Component,
  Fragment
} from 'react';

import * as _ from 'lodash';
import SpotifyWebApi from 'spotify-web-api-js';

import MeBar      from './components/MeBar'
import NowPlaying from './components/NowPlaying'
import AlbumArtBg from './components/AlbumArtBg'
import DeviceList from './components/DeviceList'
import Avatar     from './components/atoms/Avatar';

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
    this.setRepeat = this.setRepeat.bind(this);
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


  ///////////////////////////////////
  // POLLING
  ///////////////////////////////////

  startPlaybackPolling(callback=_.noop()) {
    let self = this;
    self.stopPlaybackPolling(() => {
      self.playbackPolling = setInterval(() => {
        self.getPlayerData(callback);
        self.getUserData();
      }, self.pollingInterval);
    });
  }

  stopPlaybackPolling(callback=_.noop()) {
    let self = this;
    clearTimeout(self.playbackPolling);
    if (callback)
    {
      callback();
    }
  }


  ///////////////////////////////////
  // GET
  ///////////////////////////////////

  getPlayerData(callback=_.noop()) {
    let self = this;
    self.getPlayerState(() => {
      self.containsMySavedTracks(callback);
    });
  }

  getUserData(callback=_.noop()) {
    let self = this;
    self.getUser(() => {
      self.getUserPlaylists(() => {
        self.getMyDevices(callback);
      });
    });
  }

  getPlayerState(callback=_.noop()) {
    let self = this;
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      self.setNowPlayingState({
        playingState: data,
        playingTrack: data.item
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

  containsMySavedTracks(callback=_.noop()) {
    let self = this;

    const {
      nowPlaying
    } = self.state;

    if (nowPlaying)
    {
      const {
        playingTrack
      } = nowPlaying;

      if (playingTrack)
      {
        spotifyApi.containsMySavedTracks([playingTrack.id]).then((data) => {
          self.setNowPlayingState({
            in_favorites: data[0]
          }, callback);
        });
      }
    }
    else if (callback) {
      callback();
    }
  }


  ///////////////////////////////////
  // SET
  ///////////////////////////////////

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
      }, callback);
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

  setRepeat(callback=_.noop())
  {
    let self = this;

    const {
      repeat_state
    } = self.state.nowPlaying.playingState;

    let new_state = 'off';

    if (repeat_state === 'off')
    {
      new_state = 'context';
    }
    else if (repeat_state === 'context')
    {
      new_state = 'track';
    }

    self.setPlaybackState({
      repeat_state: new_state
    }, () => {
      spotifyApi.setRepeat(new_state).then(callback);
    });
  }

  skipToNext(callback=_.noop()) {
    let self = this;
    spotifyApi.skipToNext().then(() => {
      self.seek(0, () => {
        self.playerPlay(callback);
      })
    });
  }

  skipToPrevious(callback=_.noop()) {
    let self = this;
    spotifyApi.skipToNext().then(() => {
      self.seek(0, () => {
        self.playerPlay(callback);
      })
    });
  }

  seek(ms_position, callback=_.noop()) {
    let self = this;
    spotifyApi.seek(ms_position).then(() => {
      self.playerPlay(() => {
        self.startPlaybackPolling(callback);
      });
    });
  }

  transferToDevice(device_id, callback=_.noop())
  {
    let self = this;
    spotifyApi.transferMyPlayback([ device_id ]).then(callback);
  }


  ///////////////////////////////////
  // MAIN APP VIEW
  ///////////////////////////////////

  render() {
    let self = this;

    const {
      nowPlaying,
      user
    } = self.state;

    let playerResolved = (nowPlaying.playingTrack && nowPlaying.playingState);

    return (
      <Fragment>
        { playerResolved ?
          <div className="anim_fade_in">
            <AlbumArtBg playingTrack={nowPlaying.playingTrack} />
            <div className="d-flex u-pos-fixed u-height-p-10 u-width-p-12 major-album-background">
              <div className="col p-0">
                <NowPlaying {...self.state}
                            stopPlaybackPolling={self.stopPlaybackPolling}
                            actions={{
                              onTogglePlay:     self.toggleIsPlaying,
                              onSkipToNext:     self.skipToNext,
                              onSkipToPrevious: self.skipToPrevious,
                              onToggleShuffle:  self.toggleShuffle,
                              onChangeRepeat:   self.setRepeat,
                              onSelectDevice:   self.transferToDevice,
                              onSeek:           self.seek
                            }}
                />
              </div>
              <div className="col-auto p-0 u-z-index-3">
                <MeBar {...self.state} />
              </div>
            </div>
          </div>
          :
          <div className="d-flex align-items-center justify-content-center u-pos-fixed u-height-p-10 u-width-p-12 major-album-background">
            { (user && user.devices && user.devices.length) ?
              <div className="anim_fade_in"
                   style={{
                     width: 350
                   }}
              >
                <div className="text-center">
                  <Avatar user={user} />
                </div>
                <h3 className="mb-5 mt-4 u-color-white u-text-bold text-center u-nowrap">
                   <span className="fa fa-volume mr-4 u-color-primary"></span>
                   Connect to a device<span className="u-color-primary">.</span>
                </h3>
                <ul className="list-group m-0">
                  <DeviceList devices={user.devices}
                              actions={{
                                onSelect: self.transferToDevice
                              }}
                  />
                </ul>
              </div>
              :
              <div className="text-center anim_fade_in">
                <span className="fa fa-circle-notch fa-3x fa-spin u-color-primary"></span>
                <p className="mt-3 mb-0 u-color-white">Looking for a device...</p>
              </div>
            }
          </div>
        }
      </Fragment>
    );

  }
}

export default App;
