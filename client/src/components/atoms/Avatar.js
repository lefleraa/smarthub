import React, {
  Component,
  Fragment
} from 'react';

class Avatar extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let self = this;

    const {
      user
    } = self.props;

    return (
      <a className="avatar"
          href='http://localhost:8888'
      >
        { user.me &&
          <img src={user.me.images[0].url} />
        }
      </a>
    );

  }
}

export default Avatar;
