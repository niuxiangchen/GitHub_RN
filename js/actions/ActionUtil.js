import ProjectModel from '../model/ProjectModel';
import Utils from '../util/Utils';

export default function handleData(
  actionType,
  dispatch,
  storeName,
  data,
  pageSize,
  favoriteDao,
  params,
) {
  let fixItems = [];
  if (data && data.data) {
    // if (Array.isArray(data.data)) {
    fixItems = data.data.items;
    // }
  }

  let showItems =
    pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize); //第一次要加载的数据

  _projectModels(showItems, favoriteDao, projectModels => {
    dispatch({
      type: actionType,
      items: fixItems,
      projectModels: projectModels,
      storeName,
      pageIndex: 1,
      ...params,
    });
  });
}

/**
 * 通过本地的收藏状态包装Item
 * @param showItems
 * @param favoriteDao
 * @param callback
 * @returns {Promise<void>}
 * @private
 */
export async function _projectModels(showItems, favoriteDao, callback) {
  let keys = [];
  try {
    //获取收藏的key
    keys = await favoriteDao.getFavoriteKeys();
    console.log(keys, 'keys');
  } catch (e) {
    console.log(e);
  }
  let projectModels = [];
  for (let i = 0, len = showItems.length; i < len; i++) {
    projectModels.push(
      new ProjectModel(showItems[i], Utils.checkFavorite(showItems[i], keys)),
    );
  }
  doCallBack(callback, projectModels);
}

export const doCallBack = (callBack, object) => {
  if (typeof callBack === 'function') {
    callBack(object);
  }
};
