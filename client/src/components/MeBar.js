import React, {
  Component,
  Fragment
} from 'react';

import Avatar from './atoms/Avatar'

const IconBtn = (props) =>(
  <span className={"u-cursor-pointer u-color-hover-primary fa-fw fa-lg fa-" + props.icon + " mt-5 "
                 + (props.active ? "u-color-primary" : "u-color-white")
                 + ((props.activeWeight && props.active) ? " fa" : " fal")}
        onClick={props.handleClick}
  ></span>
);

class MeBar extends Component {
  constructor(props) {
    super(props);
    this.handleToggleFavorite = this.handleToggleFavorite.bind(this);
    this.state = {};
  }

  handleToggleFavorite() {
    let self = this;

    const {
      onToggleFavorite
    } = self.props.actions;

    if ( onToggleFavorite )
    {
      onToggleFavorite();
    }
  }

  render() {
    let self = this;

    const {
      user,
      nowPlaying
    } = self.props;

    return (
      <div className="pt-5 pb-5 pr-5 pl-0 u-height-p-10 d-flex flex-column align-items-center justify-content-between">
        <div className="d-flex flex-column align-items-center">
          <Avatar user={user} />
          <IconBtn icon="heart"
                   active={nowPlaying.in_favorites}
                   activeWeight="fa"
                   handleClick={self.handleToggleFavorite}
          />
          <IconBtn icon="clock"
                   handleClick={() => console.log("view recently played")}
          />
          <IconBtn icon="plus-circle"
                   handleClick={() => console.log("add to playlist")}
          />
          <IconBtn icon="ellipsis-h"
                   handleClick={() => console.log("options")}
          />
          {/* { user.playlist &&
            <Fragment>
              {(user.playlist.items && user.playlist.items.length) && user.playlist.items.map(playlist =>
                <div>{playlist.name}</div>
              )}
            </Fragment>
          } */}
        </div>
      </div>
    );

  }
}

export default MeBar;
