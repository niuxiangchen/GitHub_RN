export default function handleData(
  actionType,
  dispatch,
  storeName,
  data,
  pageSize,
) {
  let fixItems = [];
  if (data && data.data) {
    // if (Array.isArray(data.data)) {
    fixItems = data.data.items;
    // }
  }
  dispatch({
    type: actionType,
    items: fixItems,
    projectModels:
      pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize), //第一次要加载的数据
    storeName,
    pageIndex: 1,
  });
}
