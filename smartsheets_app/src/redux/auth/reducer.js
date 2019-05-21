import { Map } from 'immutable';
import actions from './actions';
import { getToken, mapUser } from '../../helpers/utility';

const initState = new Map({
  idToken: null,
  userId: null,
  currentUser: null,
});

export default function authReducer(
  state = initState.merge(getToken()),
  action
) {
  switch (action.type) {
    case actions.LOGIN_SUCCESS:
      return state.set('idToken', action.token).set('userId', action.userId);
    case actions.VALIDATE_AUTH_TOKEN_SUCCESS:
      return state.set('idToken', action.token);
    case actions.LOGOUT:
      return state.set('idToken', null);
    case actions.SET_USER_DATA:
      return state.set('currentUser', mapUser(action.payload))
    default:
      return state;
  }
}
