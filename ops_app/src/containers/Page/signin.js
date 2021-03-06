import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import Input from '../../components/uielements/input';
import Checkbox from '../../components/uielements/checkbox';
import Button from '../../components/uielements/button';
import authAction from '../../redux/auth/actions';
import IntlMessages from '../../components/utility/intlMessages';
import SignInStyleWrapper from './signin.style';

const { login } = authAction;

class SignIn extends Component {
  constructor(props) {
    super(props);

    this.state = {
      redirectToReferrer: this.props.isLoggedIn
    };
    // this.keyPress = this.keyPress.bind(this);
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
  keyPress = (e) => {
    if(e.key === 'Enter'){
      this.handleLogin()
    }
  }
  render() {
    // const from = { pathname: '/dashboard' };
    // const { redirectToReferrer } = this.state;
    // if (redirectToReferrer) {
    //   return <Redirect to={from} />;
    // }
    return (
      <SignInStyleWrapper className="isoSignInPage">
        <div className="isoLoginContentWrapper">
          <div className="isoLoginContent">
            <div className="isoLogoWrapper">
              <Link to="/dashboard">
                <IntlMessages id="page.signInTitle" />
              </Link>
            </div>

            <div className="isoSignInForm">
              <div className="isoInputWrapper">
                <Input
                  id="inputUserName"
                  size="large"
                  placeholder="Email"
                />
              </div>

              <div className="isoInputWrapper">
                <Input
                  id="inpuPassword"
                  size="large"
                  type="password"
                  placeholder="Password"
                  onKeyPress={this.keyPress}
                />
              </div>

              <div className="isoInputWrapper isoLeftRightComponent">
                <Checkbox>
                  <IntlMessages id="page.signInRememberMe" />
                </Checkbox>
                <Button type="primary" onClick={this.handleLogin}>
                  <IntlMessages id="page.signInButton" />
                </Button>
              </div>
              <p className="isoHelperText">
                <IntlMessages id="page.signInPreview" />
              </p>
            </div>
          </div>
        </div>
      </SignInStyleWrapper>
    );
  }
}

export default connect(
  state => ({
    isLoggedIn: state.Auth.get('idToken') !== null ? true : false
  }),
  { login }
)(SignIn);
