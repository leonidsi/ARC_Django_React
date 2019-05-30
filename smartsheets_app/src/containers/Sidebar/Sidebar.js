 import React, { Component } from 'react';
import { connect } from 'react-redux';
import clone from 'clone';
import { Link } from 'react-router-dom';
import { Layout } from 'antd';
import { Scrollbars } from 'react-custom-scrollbars';
import Menu from '../../components/uielements/menu';
import SidebarWrapper from './sidebar.style';

import appActions from '../../redux/app/actions';
import Logo from '../../components/utility/logo';
import { rtl } from '../../config/withDirection';
import { getCurrentTheme } from '../ThemeSwitcher/config';
import { themeConfig } from '../../config';

const { Sider } = Layout;
const {
  toggleOpenDrawer,
  changeOpenKeys,
  changeCurrent,
  toggleCollapsed,
} = appActions;
const stripTrailingSlash = str => {
  if (str.substr(-1) === '/') {
    return str.substr(0, str.length - 1);
  }
  return str;
};

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.onOpenChange = this.onOpenChange.bind(this);
  }
  handleClick(e) {
    this.props.changeCurrent([e.key]);
    if (this.props.app.view === 'MobileView') {
      setTimeout(() => {
        this.props.toggleCollapsed();
        this.props.toggleOpenDrawer();
      }, 100);
    }
  }
  onOpenChange(newOpenKeys) {
    const { app, changeOpenKeys } = this.props;
    const latestOpenKey = newOpenKeys.find(
      key => !(app.openKeys.indexOf(key) > -1)
    );
    const latestCloseKey = app.openKeys.find(
      key => !(newOpenKeys.indexOf(key) > -1)
    );
    let nextOpenKeys = [];
    if (latestOpenKey) {
      nextOpenKeys = this.getAncestorKeys(latestOpenKey).concat(latestOpenKey);
    }
    if (latestCloseKey) {
      nextOpenKeys = this.getAncestorKeys(latestCloseKey);
    }
    changeOpenKeys(nextOpenKeys);
  }
  getAncestorKeys = key => {
    const map = {
      sub3: ['sub2'],
    };
    return map[key] || [];
  };

  renderView({ style, ...props }) {
    const viewStyle = {
      marginRight: rtl === 'rtl' ? '0' : '-17px',
      paddingRight: rtl === 'rtl' ? '0' : '9px',
      marginLeft: rtl === 'rtl' ? '-17px' : '0',
      paddingLeft: rtl === 'rtl' ? '9px' : '0',
    };
    return (
      <div className="box" style={{ ...style, ...viewStyle }} {...props} />
    );
  }

  render() {
    const { app, toggleOpenDrawer, currentUser } = this.props;
    const url = stripTrailingSlash(this.props.url);    
    const customizedTheme = getCurrentTheme('sidebarTheme', themeConfig.theme);
    const collapsed = clone(app.collapsed) && !clone(app.openDrawer);
    const { openDrawer } = app;
    const mode = collapsed === true ? 'vertical' : 'inline';
    const onMouseEnter = event => {
      if (openDrawer === false) {
        toggleOpenDrawer();
      }
      return;
    };
    const onMouseLeave = () => {
      if (openDrawer === true) {
        toggleOpenDrawer();
      }
      return;
    };
    const scrollheight = app.height;
    const styling = {
      backgroundColor: customizedTheme.backgroundColor,
    };
    const submenuColor = {
      color: customizedTheme.textColor,
    };
    const isSuperAdmin = currentUser ? currentUser.isSuperAdmin : false;
    return (
      <SidebarWrapper>
        <Sider
          trigger={null}
          collapsible={true}
          collapsed={collapsed}
          width="240"
          className="isomorphicSidebar"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          style={styling}
        >
          <Logo collapsed={collapsed} />
          <Scrollbars
            renderView={this.renderView}
            style={{ height: scrollheight - 70 }}
          >
            <Menu
              onClick={this.handleClick}
              theme="dark"
              mode={mode}
              openKeys={collapsed ? [] : app.openKeys}
              selectedKeys={app.current}
              onOpenChange={this.onOpenChange}
              className="isoDashboardMenu"
            >
              {isSuperAdmin &&
                <Menu.Item key="users">
                  <Link to={`${url}/users`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-person-stalker" />                      
                      <span className="nav-text">
                        Users
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
              <Menu.Item key="projects">
                <Link to={`${url}/projects`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                  <i className="ion-compose" />                      
                    <span className="nav-text">
                      Projects
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              {isSuperAdmin &&
                <Menu.Item key="project_managers">
                  <Link to={`${url}/project_managers`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-person-stalker" />                      
                      <span className="nav-text">
                        Project Managers
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
              {isSuperAdmin &&
                <Menu.Item key="account_managers">
                  <Link to={`${url}/sales_executives`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-ios-contact-outline" /> 
                      <span className="nav-text">
                        Sales Executives
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
              {isSuperAdmin &&
                <Menu.Item key="relationship_managers">
                  <Link to={`${url}/relationship_managers`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-ios-contact-outline" /> 
                      <span className="nav-text">
                        Relationship Managers
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
              {isSuperAdmin &&
                <Menu.Item key="consultants">
                  <Link to={`${url}/consultants`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-android-people" />                      
                      <span className="nav-text">
                        Consultants
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
              <Menu.Item key="clients">
                <Link to={`${url}/clients`}>
                  <span className="isoMenuHolder" style={submenuColor}>
                  <i className="ion-android-contacts" />                      
                    <span className="nav-text">
                      Clients
                    </span>
                  </span>
                </Link>
              </Menu.Item>
              {isSuperAdmin &&
                <Menu.Item key="other_providers">
                  <Link to={`${url}/other_providers`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-ios-people" />                      
                      <span className="nav-text">
                        Other Providers
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
              {isSuperAdmin &&
                <Menu.Item key="how_found_pyx">
                  <Link to={`${url}/how_found_pyx`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-wrench" />                      
                      <span className="nav-text">
                        How Found Pyx
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
              {isSuperAdmin &&
                <Menu.Item key="naics_codes">
                  <Link to={`${url}/naics_codes`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-code-working" />                      
                      <span className="nav-text">
                        Naics Codes
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
              {isSuperAdmin &&
                <Menu.Item key="project_types">
                  <Link to={`${url}/project_types`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-network" />                      
                      <span className="nav-text">
                        Project Types
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
              {isSuperAdmin &&
                <Menu.Item key="project_status">
                  <Link to={`${url}/project_status`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-ios-pulse-strong" />                      
                      <span className="nav-text">
                        Project Status
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
              {isSuperAdmin &&
                <Menu.Item key="help_desk">
                  <Link to={`${url}/help_desk`}>
                    <span className="isoMenuHolder" style={submenuColor}>
                    <i className="ion-ios-help-outline" />                 <span className="nav-text">
                        Help Desk
                      </span>
                    </span>
                  </Link>
                </Menu.Item>
              }
            </Menu>
          </Scrollbars>
        </Sider>
      </SidebarWrapper>
    );
  }
}

export default connect(
  state => ({
    app: state.App.toJS(),
    currentUser: state.Auth.get('currentUser'),
  }),
  { toggleOpenDrawer, changeOpenKeys, changeCurrent, toggleCollapsed }
)(Sidebar);
