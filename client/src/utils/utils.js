/**
 *
 * @param {*} list array of objects
 * @returns an object in the form of {lastItem, modifiedList}
 * where lastItem is the last item from list,
 * and modifiedList is the updated list with last item removed
 */
export const getAndRemoveLastItem = list => {
  if (!Array.isArray(list) || list.length === 0) {
    return {
      lastItem: null,
      modifiedList: []
    };
  }

  // make a copy of last item
  const lastItem = { ...list[list.length - 1] };
  // make a new list exclude last item
  const modifiedList = list.slice(0, -1);
  return { lastItem, modifiedList }
}