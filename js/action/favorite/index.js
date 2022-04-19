import Types from '../types';
import FavoriteDao from '../../expand/dao/FavoriteDao';
import ProjectModel from '../../model/ProjectModel';
import {_projectModels} from '../ActionUtil';

/**
 * 加载收藏的项目
 * @param flag 标识
 * @param isShowLoading 是否显示loading
 * @returns {function(*)}
 */
export function onLoadFavoriteData(flag, isShowLoading) {
  return dispatch => {
    if (isShowLoading) {
      dispatch({type: Types.FAVORITE_LOAD_DATA, storeName: flag});
    }
    new FavoriteDao(flag)
      .getAllItems()
      .then(items => {
        let resultData = [];
        for (let i = 0, len = items.length; i < len; i++) {
          resultData.push(new ProjectModel(items[i], true));
        }
        dispatch({
          type: Types.FAVORITE_LOAD_SUCCESS,
          projectModels: resultData,
          storeName: flag,
        });
      })
      .catch(e => {
        console.log(e);
        dispatch({type: Types.FAVORITE_LOAD_FAIL, error: e, storeName: flag});
      });
  };
}

/**
 * 刷新收藏状态
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDao
 * @returns {function(*)}
 */
export function onFlushPopularFavorite(
  storeName,
  pageIndex,
  pageSize,
  dataArray = [],
  favoriteDao,
) {
  return dispatch => {
    //本次和载入的最大数量
    let max =
      pageSize * pageIndex > dataArray.length
        ? dataArray.length
        : pageSize * pageIndex;
    _projectModels(dataArray.slice(0, max), favoriteDao, data => {
      dispatch({
        type: Types.FLUSH_POPULAR_FAVORITE,
        storeName,
        pageIndex,
        projectModels: data,
      });
    });
  };
}
