import React, {
  Component,
  Fragment
} from 'react';

import DropMenu from './atoms/DropMenu';

import * as _ from 'lodash';

class DeviceList extends Component {
  constructor(props) {
    super(props);
    this.handleSelectDevice = this.handleSelectDevice.bind(this);
    this.state = {};
  }

  handleSelectDevice(device_id) {
    let self = this;

    const {
      onSelect
    } = self.props.actions;

    if ( onSelect )
    {
      onSelect(device_id);
    }
  }

  render() {
    let self = this;

    const {
      devices,
      dropdown
    } = self.props;

    const Tag = dropdown ? DropMenu.MenuItem : "li";

    return (
      <Fragment>
          { devices.map(device =>
            <Tag className={(device.is_active ? ' active' : '')
                          + (dropdown ? " " : " list-group-item")}
                 onClick={() => self.handleSelectDevice(device.id)}
                 key={device.id}
            >
              <div className="d-flex flex-nowrap align-items-center">
                <div className="col-auto p-0 pr-3">
                  { device.is_active ?
                    <span className="far fa-fw fa-check"></span>
                    :
                    <Fragment>
                      { device.type === "Smartphone" ?
                        <span className="far fa-fw fa-mobile"></span>
                        :
                        <span className="far fa-fw fa-desktop"></span>
                      }
                    </Fragment>
                  }
                </div>
                <div className="col p-0">
                  { device.is_active ?
                    <Fragment>
                      <div className="u-text-bold">LISTENING ON</div>
                      <div className="d-flex align-items-center flex-nowrap">
                        <span className="fal fa-volume mr-2"></span>
                        {device.name}
                      </div>
                    </Fragment>
                    :
                    <Fragment>
                      {device.name}
                      <div className="small">{device.type}</div>
                    </Fragment>
                  }
                </div>
              </div>
            </Tag>
          )}
      </Fragment>
    );

  }
}

export default DeviceList;
