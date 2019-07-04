import styled from 'styled-components';
import { palette } from 'styled-theme';
import { borderRadius } from '../style-util';
import WithDirection from '../withDirection';

const WDInputBoxWrapper = styled.div`
  &.isoInputBox {
    width: 100%;
    max-width: 500px;
    display: flex;
    flex-direction: column;
    margin-right: 35px;
    margin-bottom: 35px;

    &:last-child {
      margin-right: 0;
    }

    label {
      font-size: 14px;
      font-weight: 500;
      color: ${palette('text', 0)};
      line-height: 1.2;
      margin-bottom: 17px;
      display: flex;
      position: relative;

      .asterisk {
        font-size: 15px;
        font-weight: 400;
        color: ${palette('color', 0)};
        line-height: 1.2;
        margin: ${props =>
          props['data-rtl'] === 'rtl' ? '0 3px 0 0' : '0 0 0 3px'};
      }
    }

    input {
      ${borderRadius()};
    }
  }
`;

const InputBoxWrapper = WithDirection(WDInputBoxWrapper);

export { InputBoxWrapper };
