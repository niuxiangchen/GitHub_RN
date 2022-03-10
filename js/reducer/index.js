import {combineReducers} from 'redux';
import theme from './theme';

const index = combineReducers({
  theme: theme,
});
export default index;
