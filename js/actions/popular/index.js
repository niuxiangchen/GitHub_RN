//获取最热数据的异步action
import Types from '../types';
import DataStore, {FLAG_STORAGE} from '../../expand/dao/DataStore';
import handleData, {_projectModels} from '../ActionUtil';

/**
 * 获取最热数据的异步action
 * @param storeName
 * @param url
 * @param pageSize
 * @returns {function(*=)}
 */
export function onRefreshPopular(storeName, url, pageSize, favoriteDao) {
  //返回一个对象{}
  return dispatch => {
    //刷新
    dispatch({type: Types.POPULAR_REFRESH, storeName: storeName});
    let dataStore = new DataStore();
    //发送请求
    dataStore
      .fetchData(url, FLAG_STORAGE.flag_popular)
      .then(data => {
        handleData(
          Types.POPULAR_REFRESH_SUCCESS,
          dispatch,
          storeName,
          data,
          pageSize,
        );
      })
      .catch(error => {
        console.log(error);
        dispatch({
          type: Types.POPULAR_REFRESH_FAIL,
          storeName: storeName,
          error,
        });
      }); //异步action与数据流
  };
}

/**
 * 加载更多
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 * @returns {function(*)}
 */
export function onLoadMorePopular(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
  callBack,
) {
  return dispatch => {
    setTimeout(() => {
      //模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        //如果上次已加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more');
        }
        dispatch({
          type: Types.POPULAR_LOAD_MORE_FAIL,
          error: 'no more',
          storeName: storeName,
          pageIndex: --pageIndex,
        });
      } else {
        //本次和载入的最大数量
        let max =
          pageSize * pageIndex > dataArray.length
            ? dataArray.length
            : pageSize * pageIndex;

        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.POPULAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: data,
          });
        });
      }
    }, 500);
  };
}
