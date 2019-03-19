import React, {
  Component,
  Fragment
} from 'react';

import * as timeFormat from 'hh-mm-ss';
import * as $ from "jquery"
import * as _ from 'lodash';

import ProgressBar from 'react-bootstrap/ProgressBar'

class SeekControls extends Component {
  constructor(props) {
    super(props);
    this.handleSeek = this.handleSeek.bind(this);
    this.handleStopPlaybackPolling = this.handleStopPlaybackPolling.bind(this);
    this.state = {};
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

    if (prevProps.playingState.item.id !== self.props.playingState.item.id) {
      self.bindSeekDrag();
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

  handleStopPlaybackPolling(callback=_.noop()) {
    let self = this;

    const {
      onStopPlaybackPolling
    } = self.props.actions;

    if ( onStopPlaybackPolling )
    {
      onStopPlaybackPolling(callback);
    }
  }

  bindSeekDrag() {
    let self = this;

    const {
      playingState
    } = self.props;

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
        self.handleStopPlaybackPolling(() => {
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
      playingState
    } = self.props;

    let progressPercent = (playingState.progress_ms / playingState.item.duration_ms) * 100;

    let trackProgressSeconds = Math.ceil(playingState.progress_ms / 1000);
    let trackDurationSeconds = Math.ceil(playingState.item.duration_ms / 1000);

    return (
      <div className="seek-controls pt-4"
           id="seek-controls"
      >
        <div className="seek-controls-progress">
          <ProgressBar now={progressPercent} />
          <div className="seek-controls-handle"
               style={{left: progressPercent + "%"}}
          ></div>
        </div>
        <div className="d-flex justify-content-between align-items-center small mt-1 u-color-white u-opacity-7 u-text-bold">
          <div>
            { timeFormat.fromS(trackProgressSeconds, 'mm:ss') }
          </div>
          <div>
            -{ timeFormat.fromS((trackDurationSeconds - trackProgressSeconds), 'mm:ss') }
          </div>
        </div>
      </div>
    );

  }
}

export default SeekControls;
