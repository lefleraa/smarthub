import React, {
  Component,
  Fragment
} from 'react';

import SeekControls from './SeekControls';
import DropMenu from './atoms/DropMenu';

import * as _ from 'lodash';

///////////////////////////////////
// TITLE LOCKUP
///////////////////////////////////

const TitleLockup = (props) => (
  <Fragment>
    <div className="mb-5 u-color-white u-opacity-6">
      <p className="mb-0 mr-3 u-text-bold d-inline-block">
        {props.playingTrack.album.name}
      </p>
      { (props.playingTrack.artists && !!props.playingTrack.artists.length) &&
        <Fragment>
          <span className="mr-3">•</span>
          <p className="mb-0 u-text-bold d-inline-block">
            {props.playingTrack.artists.map((artist, i) =>
              <Fragment>
                { (i > 0) &&
                  ", "
                }
                {artist.name}
              </Fragment>
            )}
          </p>
        </Fragment>
      }
    </div>
    <h1 className="major-song-title u-color-white mb-2">
      {props.playingTrack.name}
    </h1>
    {props.playingTrack.explicit &&
      <div className="badge u-bg-white u-color-black u-opacity-8">
        EXPLICIT
      </div>
    }
  </Fragment>
);


///////////////////////////////////
// DEVICE SELECTOR
///////////////////////////////////

const DeviceSelector = (props) => (
  <Fragment>
    { props.devices ?
      <DropMenu>
        <DropMenu.Toggle>
          <div className="u-text-bold d-flex align-items-center u-color-white u-color-hover-primary u-cursor-pointer">
            <div className="col-auto p-0 pr-3">
              { props.activeDevice.type === "Smartphone" ?
                <span className="far fa-fw fa-mobile"></span>
                :
                <span className="far fa-fw fa-desktop"></span>
              }
            </div>
            <div className="col p-0 u-opacity-6 u-color-white">
              {props.activeDevice.name}
            </div>
            <div className="col-auto p-0 pl-2 u-opacity-6 small u-color-white">
              <span className="far fa-fw fa-chevron-up"></span>
            </div>
          </div>
        </DropMenu.Toggle>
        <DropMenu.Menu max={3}>
          { props.devices.map(device =>
            <DropMenu.MenuItem className={(device.id === props.activeDevice.id) ? 'active' : ''}
                              onClick={() => props.actions.onSelect(device.id)}
            >
              <div className="d-flex flex-nowrap align-items-center">
                <div className="col-auto p-0 pr-3">
                  { (device.id === props.activeDevice.id) ?
                    <span className="far fa-fw fa-check"></span>
                    :
                    <Fragment>
                      { device.type === "Smartphone" ?
                        <span className="far fa-fw fa-mobile"></span>
                        :
                        <span className="far fa-fw fa-desktop"></span>
                      }
                    </Fragment>
                  }
                </div>
                <div className="col p-0">
                  {device.name}
                  <div className="small">{device.type}</div>
                </div>
              </div>
            </DropMenu.MenuItem>
          )}
        </DropMenu.Menu>
      </DropMenu>
      :
      <span className="far fa-fw fa-circle-notch fa-spin u-color-white"></span>
    }
  </Fragment>
);

///////////////////////////////////
// PLAYER CONTROLS
///////////////////////////////////

const PlayerControls = (props) => (
  <div className="d-flex justify-content-between align-items-center">
    <div className="d-flex flex-nowrap align-items-center">
      <span className="u-color-white u-color-hover-primary fa fa-step-backward fa-2x u-cursor-pointer"
            onClick={props.actions.onSkipToPrevious}
      ></span>
      <span className={"u-color-white u-color-hover-primary fa fa-4x ml-5 mr-5 u-cursor-pointer " + "fa-" + (props.isPlaying ? "pause" : "play") + "-circle"}
            onClick={props.actions.onTogglePlay}
      ></span>
      <span className="u-color-white u-color-hover-primary fa fa-step-forward fa-2x u-cursor-pointer"
            onClick={props.actions.onSkipToNext}
      ></span>
    </div>
    <span className={"major-controls-icon far fa-fw fa-random " + (props.isShuffle ? "major-controls-icon-active" : "") }
          onClick={props.actions.onToggleShuffle}
    ></span>
  </div>
);


///////////////////////////////////
// MAIN LAYOUT
///////////////////////////////////

class NowPlaying extends Component {
  constructor(props) {
    super(props);

    this.handleTogglePlay = this.handleTogglePlay.bind(this);
    this.handleSkipToPrevious = this.handleSkipToPrevious.bind(this);
    this.handleSkipToNext = this.handleSkipToNext.bind(this);
    this.handleToggleShuffle = this.handleToggleShuffle.bind(this);
    this.handleSelectDevice = this.handleSelectDevice.bind(this);
    this.handleSeek = this.handleSeek.bind(this);

    this.draggingSeek = false;

    this.state = {
      toggleImgSwap: true
    };
  }

  componentWillReceiveProps(nextProps) {
    let self = this;

    if (nextProps.nowPlaying.playingTrack.id !== self.props.nowPlaying.playingTrack.id)
    {
      self.setState({
        toggleImgSwap: !self.state.toggleImgSwap
      });
    }
  }

  handleTogglePlay() {
    let self = this;

    const {
      onTogglePlay
    } = self.props.actions;

    if ( onTogglePlay )
    {
      onTogglePlay();
    }
  }

  handleSkipToPrevious() {
    let self = this;

    const {
      onSkipToPrevious
    } = self.props.actions;

    if ( onSkipToPrevious )
    {
      onSkipToPrevious();
    }
  }

  handleSkipToNext() {
    let self = this;

    const {
      onSkipToNext
    } = self.props.actions;

    if ( onSkipToNext )
    {
      onSkipToNext();
    }
  }

  handleToggleShuffle() {
    let self = this;

    const {
      onToggleShuffle
    } = self.props.actions;

    if ( onToggleShuffle )
    {
      onToggleShuffle();
    }
  }

  handleSelectDevice(device_id) {
    let self = this;

    const {
      onSelectDevice
    } = self.props.actions;

    if ( onSelectDevice )
    {
      onSelectDevice(device_id);
    }
  }

  handleSeek(ms_position, callback=_.noop()) {
    let self = this;

    const {
      onSeek
    } = self.props.actions;

    if ( onSeek )
    {
      onSeek(ms_position, callback);
    }
  }

  render() {
    let self = this;

    const {
      toggleImgSwap
    } = self.state;

    const {
      user,
      stopPlaybackPolling
    } = self.props;

    const {
      playingTrack,
      playingState
    } = self.props.nowPlaying;

    return (
      <div className="d-flex u-width-p-12 u-height-p-10">
        <div className="col p-5 u-z-index-2 d-flex flex-column">
          <div className="col p-0">
            <TitleLockup playingTrack={playingTrack} />
          </div>
          <div className="col-auto p-0">
            <PlayerControls isPlaying={playingState.is_playing}
                            isShuffle={playingState.shuffle_state}
                            actions={{
                              onSkipToPrevious: self.handleSkipToPrevious,
                              onSkipToNext: self.handleSkipToNext,
                              onTogglePlay: self.handleTogglePlay,
                              onToggleShuffle: self.handleToggleShuffle
                             }}
            />
          </div>
          <div className="col-auto p-0 pt-2">
            <SeekControls playingState={playingState}
                          actions={{
                            onStopPlaybackPolling: stopPlaybackPolling,
                            onSeek: self.handleSeek
                          }}
            />
          </div>
          <div className="col-auto p-0 pt-4 d-flex justify-content-between align-items-center">
            <DeviceSelector devices={user.devices}
                            activeDevice={playingState.device}
                            actions={{
                              onSelect: self.handleSelectDevice
                            }}
            />
            <span className="far fa-fw fa-indent u-color-white"></span>
          </div>
        </div>
        <div className="col-auto p-0 pt-5 pb-5 u-z-index-1">
          { playingTrack &&
            <div className={"d-flex flex-column u-height-p-10 major-album-art-wrap " + (toggleImgSwap ? "major-album-art-wrap-toggle-class" : "")}>
              <img src={playingTrack.album.images[0].url}
                  className="u-height-p-10 major-album-art major-album-art-1"
              />
              {/* <img src={playingTrack.album.images[0].url}
                  className="u-height-p-10 major-album-art major-album-art-2"
              /> */}
            </div>
          }
        </div>
      </div>
    );

  }
}

export default NowPlaying;
