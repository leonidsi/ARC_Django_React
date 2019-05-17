import { fromJS } from "immutable";
import actions from "./actions";
import { mapUser } from '../../helpers/utility';

const initState = fromJS({
  usersList: [],
  singleUser: {},
  loading: false,
  error: ''
});

export default function usersReducer(state = initState, action) {
  switch (action.type) {
    case actions.FETCH_USERS_SUCCESS: {
      let users = action.payload
      users = users.map((item) => mapUser(item))
      return state
        .set('usersList', fromJS(users));
    }
    case actions.FETCH_UNASSIGNED_SUCCESS:
    let users = action.payload
    users = users.map((item) => {
      return mapUser(item)
    })
      return state
        .set('usersList', fromJS(users));
    case actions.DELETE_USER_SUCCESS:
      return state
        .update('usersList', usersList => usersList.filter(item => item.get('id') !== action.payload.id));
    case actions.INSERT_USER_REQUEST:
    case actions.UPDATE_USER_REQUEST:
      return state.set('loading', true)
    case actions.INSERT_USER_ERROR:
    case actions.UPDATE_USER_ERROR:
      return state.set('loading', false)
    case actions.INSERT_USER_SUCCESS:
      return state
        .update('usersList', usersList => usersList.push(mapUser(action.payload)))
        .set('loading', false);
    case actions.UPDATE_USER_SUCCESS:
      return state
        .update('usersList', usersList => usersList.update(usersList.findIndex(user => user.get('id') === action.payload.id), user => mapUser(action.payload)))
        .set('loading', false);
    case actions.GET_USER_SUCCESS:
      return state
      .set('singleUser', fromJS(mapUser(action.payload)));
    default:
      return state
  }
}
