import React, {
  Component,
  Fragment
} from 'react';

import * as timeFormat from 'hh-mm-ss';
import * as _ from 'lodash';

import ProgressBar from 'react-bootstrap/ProgressBar'

class SeekControls extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
            { timeFormat.fromS(trackDurationSeconds, 'mm:ss') }
          </div>
        </div>
      </div>
    );

  }
}

export default SeekControls;
