import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Spin from '../../components/uielements/spin';
import authAction from '../../redux/auth/actions';
import AuthStyleWrapper from './auth.style';

const { validateAuthToken } = authAction;

const getParameterByName = (name, url) => {
  if (!url) url = window.location.href;
  name = name.replace(/[[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
      results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

class Auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: this.props.isLoggedIn
    };
  }
  componentDidMount() {
    const { location, validateAuthToken } = this.props;
    if (location) {
      const accessToken = getParameterByName('accessToken', location.search);
      const userId = getParameterByName('userId', location.search);

      if (accessToken) {
        validateAuthToken({ userId, accessToken });
      } else {
        this.setState({ redirectToReferrer: true });
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    if (
      this.props.isLoggedIn !== nextProps.isLoggedIn &&
      nextProps.isLoggedIn === true
    ) {
      this.setState({ redirectToReferrer: true });
    }
  }
  handleLogin = () => {
    const { login, history } = this.props;
    const userInfo = {
      email: document.getElementById('inputUserName').value || '',
      password: document.getElementById('inpuPassword').value || ''
    };
    login({ history, userInfo });
  };
  render() {
    const from = { pathname: '/dashboard' };
    const { redirectToReferrer } = this.state;

    if (redirectToReferrer) {
      return <Redirect to={from} />;
    }

    return (
      <AuthStyleWrapper className="AuthPage">
        <Spin size="large" tip="Authenticating..." />
      </AuthStyleWrapper>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: state.Auth.get('idToken') !== null ? true : false
  }),
  { validateAuthToken }
)(Auth);
