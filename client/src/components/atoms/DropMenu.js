import React, {
  Component
} from 'react';

import Dropdown from 'react-bootstrap/Dropdown'

class CustomToggle extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.onClick(e);
  }

  render() {
    let self = this;

    const {
      children
    } = self.props;

    return (
      <span onClick={this.handleClick}
            className="u-bg-none u-border-0 p-0 m-0 u-outline-0"
      >
        {children}
      </span>
    );
  }
}

class CustomMenu extends React.Component {
  render() {
    let self = this;

    const {
      children,
      style,
      className,
      max
    } = self.props;

    return (
      <div className={className + " u-z-index-10 p-3 u-border-radius-5 u-shadow-3 anim_fade_in_quick"}
                style={style}
                max={max || 10}
                scale={1}
      >
        {children}
      </div>
    );
  }
}

class DropMenu extends Component {
  render() {
    let self = this;

    const {
      children,
      alignRight
    } = self.props;

    return (
      <Dropdown alignRight={alignRight ? alignRight : null}>
        {children}
      </Dropdown>
    );

  }
}

class Menu extends Component {
  render() {
    let self = this;

    const {
      children
    } = self.props;

    return (
      <Dropdown.Menu as={CustomMenu} {...self.props}>
        {children}
      </Dropdown.Menu>
    );

  }
}

class MenuItem extends Component {
  render() {
    let self = this;

    const {
      children,
      active
    } = self.props;

    return (
      <Dropdown.Item {...self.props}>
        {children}
      </Dropdown.Item>
    );

  }
}

class Toggle extends Component {
  render() {
    let self = this;

    const {
      children
    } = self.props;

    return (
      <Dropdown.Toggle as={CustomToggle}>
        {children}
      </Dropdown.Toggle>
    );

  }
}

DropMenu.Toggle   = Toggle;
DropMenu.Menu     = Menu;
DropMenu.MenuItem = MenuItem

export default DropMenu;