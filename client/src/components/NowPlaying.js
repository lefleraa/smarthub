import React, {
  Component,
  Fragment
} from 'react';

import SeekControls from './SeekControls';
import AlbumArt from './AlbumArt';
import DropMenu from './atoms/DropMenu';
import DeviceList from './DeviceList'

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
              <Fragment key={artist.id}>
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
      <div className="badge u-bg-none u-border-1 u-border-color-white u-color-white u-opacity-4">
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
          <div className="d-flex align-items-center u-color-primary u-cursor-pointer small">
            <div className="col-auto p-0 pr-3">
              { props.activeDevice.type === "Smartphone" ?
                <span className="far fa-fw fa-mobile"></span>
                :
                <span className="far fa-fw fa-desktop"></span>
              }
            </div>
            <div className="col p-0">
              Listening on <span className="u-text-bold">{props.activeDevice.name}</span>
            </div>
            <div className="col-auto p-0 pl-2 u-opacity-6 small">
              <span className="far fa-fw fa-chevron-up"></span>
            </div>
          </div>
        </DropMenu.Toggle>
        <DropMenu.Menu max={3}>
          <DeviceList devices={props.devices}
                      dropdown={true}
                      actions={{
                        onSelect: props.actions.onSelect
                      }}
          />
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
    <span className={"major-controls-icon far fa-fw fa-random " + (props.isShuffle ? "major-controls-icon-active" : "") }
          onClick={props.actions.onToggleShuffle}
    ></span>
    <div className="d-flex flex-nowrap align-items-center major-controls">
      <span className="u-color-white fa fa-step-backward fa-2x"
            onClick={props.actions.onSkipToPrevious}
      ></span>
      <span className={"u-hover-grow-2 u-color-white fa fa-4x ml-5 mr-5 " + "fa-" + (props.isPlaying ? "pause" : "play") + "-circle"}
            onClick={props.actions.onTogglePlay}
      ></span>
      <span className="u-color-white fa fa-step-forward fa-2x"
            onClick={props.actions.onSkipToNext}
      ></span>
    </div>
    <span className={"major-controls-icon far fa-fw fa-repeat"
                   + ((props.repeatMode === "track")   ? "  major-controls-icon-active major-controls-icon-repeat-track" : "")
                   + ((props.repeatMode === "context") ? " major-controls-icon-active" : "")}
          onClick={props.actions.onChangeRepeat}
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
    this.handleChangeRepeat = this.handleChangeRepeat.bind(this);
    this.handleSelectDevice = this.handleSelectDevice.bind(this);
    this.handleSeek = this.handleSeek.bind(this);

    this.draggingSeek = false;

    this.state = {};
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

  handleChangeRepeat() {
    let self = this;

    const {
      onChangeRepeat
    } = self.props.actions;

    if ( onChangeRepeat )
    {
      onChangeRepeat();
    }
  }

  handleSelectDevice(device) {
    let self = this;

    const {
      onSelectDevice
    } = self.props.actions;

    if ( onSelectDevice )
    {
      onSelectDevice(device);
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
      user,
      stopPlaybackPolling
    } = self.props;

    const {
      playingTrack,
      playingState
    } = self.props.nowPlaying;

    return (
      <div className="d-flex u-width-p-12 u-height-p-10">
        <div className="col pt-5 pb-5 pl-5 pr-0 u-z-index-2 d-flex flex-column">
          <div className="col p-0">
            <TitleLockup playingTrack={playingTrack} />
          </div>
          <div className="col-auto p-0">
            <PlayerControls isPlaying={playingState.is_playing}
                            isShuffle={playingState.shuffle_state}
                            repeatMode={playingState.repeat_state}
                            actions={{
                              onSkipToPrevious: self.handleSkipToPrevious,
                              onSkipToNext: self.handleSkipToNext,
                              onTogglePlay: self.handleTogglePlay,
                              onToggleShuffle: self.handleToggleShuffle,
                              onChangeRepeat: self.handleChangeRepeat
                            }}
            />
          </div>
          <div className="col-auto p-0 pt-2 pb-4">
            <SeekControls playingState={playingState}
                          actions={{
                            onStopPlaybackPolling: stopPlaybackPolling,
                            onSeek: self.handleSeek
                          }}
            />
          </div>
          <div className="col-auto p-0 d-flex justify-content-between align-items-center u-height-1">
            <DeviceSelector devices={user.devices}
                            activeDevice={playingState.device}
                            actions={{
                              onSelect: self.handleSelectDevice
                            }}
            />
            <span className="far fa-fw fa-indent u-color-white"></span>
          </div>
        </div>
        <div className="col-auto p-0 u-z-index-1">
          <AlbumArt playingTrack={playingTrack}
                    isPlaying={playingState.is_playing}
                    actions={{
                      onTogglePlay: self.handleTogglePlay
                    }}
          />
        </div>
      </div>
    );

  }
}

export default NowPlaying;
