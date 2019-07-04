import React, { Component } from 'react';
import { Alert } from 'antd';
import StyleWrapper from './index.style';

class AuthFailed extends Component {
  render() {
    return (
      <StyleWrapper className="AuthPage">
        <Alert
          message="Authentication Failed"
          description="Onelogin Authentication Failed! Please try again."
          type="error"
          showIcon
        />
      </StyleWrapper>
    );
  }
}

export default AuthFailed;
