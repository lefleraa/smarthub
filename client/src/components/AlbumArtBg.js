import React, {
  Component
} from 'react';

class AlbumArtBg extends Component {
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
      <div className={"major-album-background-wrap" + (toggleImgSwap ? " major-album-background-wrap-toggle-class" : "")}>
        { previousTrack &&
          <div className="major-album-background-img major-album-background-img-1"
                style={{backgroundImage: "url('" + (toggleImgSwap ?  previousArt : currentArt) + "')"}}
          ></div>
        }
        <div className="major-album-background-img major-album-background-img-2"
              style={{backgroundImage: "url('" + (!toggleImgSwap ? previousArt : currentArt) + "')"}}
        ></div>
      </div>
    );

  }
}

export default AlbumArtBg;
