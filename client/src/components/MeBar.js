import React, {
  Component,
  Fragment
} from 'react';

const IconBtn = (props) =>(
  <span className={"u-cursor-pointer fa-fw fa-lg fa-" + props.icon + " mt-5 "
                 + (props.active ? "u-color-primary" : "u-color-white")
                 + (props.activeWeight ? " fa" : " fal")}
        onClick={props.handleClick}
  ></span>
);

class MeBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
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
          { user.me &&
            <Fragment>
              <a className="avatar"
                 href='http://localhost:8888'
              >
                <img src={user.me.images[0].url} />
              </a>

            </Fragment>
          }
          <IconBtn icon="heart"
                   active={nowPlaying.in_favorites ? "u-color-primary" : "u-color-white"}
                   activeWeight="fa"
                   handleClick={() => console.log("toggle saved")}
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
