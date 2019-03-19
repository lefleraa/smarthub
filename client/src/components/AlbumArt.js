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

  componentWillReceiveProps(nextProps) {
    let self = this;

    if (nextProps.playingTrack.id !== self.props.playingTrack.id)
    {
      console.log("next song")
      self.setState({
        toggleImgSwap: !self.state.toggleImgSwap
      });
    }
  }

  render() {
    let self = this;

    const {
      playingTrack
    } = self.props;

    const {
      toggleImgSwap
    } = self.state;

    return (
      <div className="pt-5 pb-5 u-height-p-10">
        { playingTrack ?
          <div className={"d-flex flex-column u-height-p-10 major-album-art-wrap" + (toggleImgSwap ? " major-album-art-wrap-toggle-class" : "")}>
            <img src={playingTrack.album.images[0].url}
                className="u-height-p-10 major-album-art major-album-art-1"
            />
            {/* <img src={playingTrack.album.images[0].url}
                className="u-height-p-10 major-album-art major-album-art-2"
            /> */}
          </div>
          :
          ""
        }
      </div>
    );

  }
}

export default AlbumArt;
