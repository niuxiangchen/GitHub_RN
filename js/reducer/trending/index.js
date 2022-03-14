import Types from '../../actions/types';

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
    case Types.TRENDING_REFRESH_SUCCESS: //下拉刷新成功
      return {
        ...state,
        //[xxx]对象的另一种取值方式
        [action.storeName]: {
          //这里为了从action中取出storeName并作为{}中的key使用所以需要借助[]，否则会js语法检查不通过...state[action.storeName],
          ...state[action.storeName],
          items: action.items, //原始数据
          projectModels: action.projectModels, //此次要展示的数据
          isLoading: false,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case Types.TRENDING_REFRESH: // 下拉刷新
      return {
        ...state,
        //[xxx]对象的另一种取值方式
        [action.storeName]: {
          ...state[action.storeName], //在刷新的过程中保持原有的数据
          isLoading: true,
        },
      };
    case Types.TRENDING_REFRESH_FAIL: // 下拉刷新失败
      return {
        ...state,
        //[xxx]对象的另一种取值方式
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false,
          hideLoadingMore: true,
        },
      };
    case Types.TRENDING_LOAD_MORE_SUCCESS: //上拉加载更多成功
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          projectModels: action.projectModels,
          hideLoadingMore: false,
          pageIndex: action.pageIndex,
        },
      };
    case Types.TRENDING_LOAD_MORE_FAIL: //上拉加载更多失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          hideLoading: true,
          pageIndex: action.pageIndex,
        },
      };
    default:
      return state;
  }
}
