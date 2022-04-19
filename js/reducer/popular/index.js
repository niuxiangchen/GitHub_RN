import Types from '../../action/types';

const defaultState = {};
/**
 * popular:{
 *     java:{
 *         items:[],
 *         isLoading:false
 *     },
 *     ios:{
 *         items:[],
 *         isLoading:false
 *     }
 * }
 * 0.state树，横向扩展
 * 1.如何动态的设置store，和动态获取store(难点：store key不固定)；
 * @param state
 * @param action
 * @returns {{theme: (onAction|*|string)}}
 */
export default function onAction(state = defaultState, action) {
  switch (action.type) {
    case Types.POPULAR_REFRESH_SUCCESS: //下拉刷新成功
      return {
        ...state,
        [action.storeName]: {
          //这里为了从action中取出storeName并作为{}中的key使用所以需要借助[]，否则会js语法检查不通过
          ...state[action.storeName], //这里是为了解构state中action.storeName对应的属性，所以需要用到[]
          items: action.items, //原始数据
          projectModels: action.projectModels, //此次要展示的数据
          isLoading: false,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case Types.POPULAR_REFRESH: //下拉刷新
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true,
          hideLoadingMore: true,
        },
      };
    case Types.POPULAR_REFRESH_FAIL: //下拉刷新失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
        },
      };
    case Types.POPULAR_LOAD_MORE_SUCCESS: //上拉加载更多成功
      return {
        ...state, //Object.assign @http://www.devio.org/2018/09/09/ES6-ES7-ES8-Feature/
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case Types.POPULAR_LOAD_MORE_FAIL: //上拉加载更多失败
      return {
        ...state, //Object.assign @http://www.devio.org/2018/09/09/ES6-ES7-ES8-Feature/
        [action.storeName]: {
          ...state[action.storeName],
          hideLoadingMore: true,
          pageIndex: action.pageIndex,
        },
      };
    case Types.FLUSH_POPULAR_FAVORITE: //刷新收藏状态
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
        },
      };
    default:
      return state;
  }
}
