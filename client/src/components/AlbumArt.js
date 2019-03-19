import React, {
  Component,
  Fragment
} from 'react';

import * as $ from "jquery"
import * as _ from 'lodash';

class AlbumArt extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleImgSwap: true
    };
  }
  componentDidMount() {
    let self = this;

    let $albumArt = $('#major-album-art');
    let albumHeight = $(window).height();
    $albumArt.css({
      width: albumHeight
    })
  }

  componentWillReceiveProps(nextProps) {
    let self = this;

    if (nextProps.playingTrack.id !== self.props.playingTrack.id)
    {
      self.setState({
        toggleImgSwap: !self.state.toggleImgSwap,
        previousTrack: self.props.playingTrack
      });
    }
  }

  render() {
    let self = this;

    const {
      playingTrack
    } = self.props;

    const {
      toggleImgSwap,
      previousTrack
    } = self.state;

    let currentArt  = playingTrack.album.images[0].url;
    let previousArt = previousTrack ? previousTrack.album.images[0].url : currentArt;

    return (
      <div className={"major-album-art-wrap" + (toggleImgSwap ? " major-album-art-wrap-toggle-class" : "")}
           id="major-album-art"
      >
        { playingTrack ?
          <Fragment>
            <div className="major-album-art major-album-art-1">
              <img src={toggleImgSwap ?  previousArt : currentArt} />
            </div>
            <div className="major-album-art major-album-art-2">
              <img src={!toggleImgSwap ? previousArt : currentArt} />
            </div>
          </Fragment>
          :
          ""
        }
      </div>
    );

  }
}

export default AlbumArt;
