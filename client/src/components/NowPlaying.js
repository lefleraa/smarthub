import React, {
  Component,
  Fragment
} from 'react';

import SeekControls from './SeekControls';
import DropMenu from './atoms/DropMenu';

import * as $ from "jquery"
import * as _ from 'lodash';

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

  shouldComponentUpdate() {
    let self = this;
    return !self.draggingSeek;
  }

  componentDidMount() {
    let self = this;
    self.bindSeekDrag();
  }

  componentDidUpdate(prevProps) {
    let self = this;

    if (prevProps.nowPlaying.playingState.item.id !== self.props.nowPlaying.playingState.item.id) {
      self.bindSeekDrag();
    }
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
    } = self.props.playerActions;

    if ( onTogglePlay )
    {
      onTogglePlay();
    }
  }

  handleSkipToPrevious() {
    let self = this;

    const {
      onSkipToPrevious
    } = self.props.playerActions;

    if ( onSkipToPrevious )
    {
      onSkipToPrevious();
    }
  }

  handleSkipToNext() {
    let self = this;

    const {
      onSkipToNext
    } = self.props.playerActions;

    if ( onSkipToNext )
    {
      onSkipToNext();
    }
  }

  handleToggleShuffle() {
    let self = this;

    const {
      onToggleShuffle
    } = self.props.playerActions;

    if ( onToggleShuffle )
    {
      onToggleShuffle();
    }
  }

  handleSelectDevice(device_id) {
    let self = this;

    const {
      onSelectDevice
    } = self.props.playerActions;

    if ( onSelectDevice )
    {
      onSelectDevice(device_id);
    }
  }

  handleSeek(ms_position, callback=_.noop()) {
    let self = this;

    const {
      onSeek
    } = self.props.playerActions;

    if ( onSeek )
    {
      onSeek(ms_position, callback);
    }
  }

  bindSeekDrag() {
    let self = this;

    const {
      stopPlaybackPolling
    } = self.props;

    const {
      playingState
    } = self.props.nowPlaying;

    let $seek_controls        = $("#seek-controls");
    let $seek_controls_handle = $seek_controls.find('.seek-controls-handle');
    let $seek_controls_bar    = $seek_controls.find('.progress-bar');
    let seek_controls_width   = $seek_controls.width();

    let parentOffset          = $seek_controls.parent().offset();
    let relX                  = 0;
    let seek_percent          = 0;
    let ms_position           = 0;

    function find_ms(e) {
      relX = e.pageX - parentOffset.left;
      seek_percent = (relX / seek_controls_width);
      ms_position = Math.floor(playingState.item.duration_ms * seek_percent);
    }

    function drag_controls() {
      $seek_controls_handle.css({
        left: seek_percent * 100 + "%"
      });
      $seek_controls_bar.css({
        width: seek_percent * 100 + "%"
      });
    }

    $seek_controls
      .on('mousedown', function(e) {
        self.draggingSeek = true;
        $seek_controls.addClass('seek-controls-dragging');
        stopPlaybackPolling(() => {
          seek_controls_width = $seek_controls.width();
          find_ms(e);
          drag_controls();
        });
      })
      .on('mousemove', function(e) {
        if (self.draggingSeek)
        {
          find_ms(e);
          drag_controls();
        }
      })
      .on('mouseup', function(e) {
        self.draggingSeek = false;
        $seek_controls.removeClass('seek-controls-dragging');
        self.handleSeek(ms_position);
      });
  }

  render() {
    let self = this;

    const {
      toggleImgSwap
    } = self.state;

    const {
      user
    } = self.props;

    const {
      playingTrack,
      playingState
    } = self.props.nowPlaying;

    return (
      <div className="d-flex u-width-p-12 u-height-p-10">
        <div className="col p-5 u-z-index-2 d-flex flex-column">
          <div className="col p-0">
            <div className="mb-5 u-color-white u-opacity-6">
              <p className="mb-0 mr-3 u-text-bold d-inline-block">
                {playingTrack.album.name}
              </p>
              { (playingTrack.artists && !!playingTrack.artists.length) &&
                <Fragment>
                  <span className="mr-3">•</span>
                  <p className="mb-0 u-text-bold d-inline-block">
                    {playingTrack.artists.map((artist, i) =>
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
              {playingTrack.name}
            </h1>
            {playingTrack.explicit &&
              <div className="badge u-bg-white u-color-black u-opacity-8">
                EXPLICIT
              </div>
            }
          </div>
          <div className="col-auto p-0 d-flex justify-content-between align-items-center">
            <div className="d-flex flex-nowrap align-items-center">
              <span className="u-color-white u-color-hover-primary fa fa-step-backward fa-2x u-cursor-pointer"
                    onClick={self.handleSkipToPrevious}
              ></span>
              <span className={"u-color-white u-color-hover-primary fa fa-4x ml-5 mr-5 u-cursor-pointer " + "fa-" + (playingState.is_playing ? "pause" : "play") + "-circle"}
                    onClick={self.handleTogglePlay}
              ></span>
              <span className="u-color-white u-color-hover-primary fa fa-step-forward fa-2x u-cursor-pointer"
                    onClick={self.handleSkipToNext}
              ></span>
            </div>
            <span className={"major-controls-icon far fa-fw fa-random " + (playingState.shuffle_state ? "major-controls-icon-active" : "") }
                  onClick={self.handleToggleShuffle}
            ></span>
          </div>
          <div className="col-auto p-0 pt-2">
            <SeekControls playingState={playingState}
                          onSeek={self.handleSeek}
            />
          </div>
          <div className="col-auto p-0 pt-4 d-flex justify-content-between align-items-center">
            { user.devices ?
              <DropMenu>
                <DropMenu.Toggle>
                  <div className="u-text-bold d-flex align-items-center u-color-white u-color-hover-primary u-cursor-pointer">
                    <div className="col-auto p-0 pr-3">
                      { playingState.device.type === "Smartphone" ?
                        <span className="far fa-fw fa-mobile"></span>
                        :
                        <span className="far fa-fw fa-desktop"></span>
                      }
                    </div>
                    <div className="col p-0 u-opacity-6 u-color-white">
                      {playingState.device.name}
                    </div>
                    <div className="col-auto p-0 pl-2 u-opacity-6 small u-color-white">
                      <span className="far fa-fw fa-chevron-up"></span>
                    </div>
                  </div>
                </DropMenu.Toggle>
                <DropMenu.Menu max={3}>
                  { user.devices.map(device =>
                    <DropMenu.MenuItem className={(device.id === playingState.device.id) ? 'active' : ''}
                                       onClick={() => self.handleSelectDevice(device.id)}
                    >
                      <div className="d-flex flex-nowrap align-items-center">
                        <div className="col-auto p-0 pr-3">
                          { (device.id === playingState.device.id) ?
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
