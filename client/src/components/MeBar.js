import React, {
  Component,
  Fragment
} from 'react';

class MeBar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let self = this;

    const {
      loggedIn,
      user
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
