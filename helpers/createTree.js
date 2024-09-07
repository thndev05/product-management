let count = 0;

const createTree = (array, parentId = '') => {
  const tree = [];
  
  array.forEach(item => {
    if (item.parent_id === parentId) {
      count++;
      item.index = count;

      const children = createTree(array, item.id);

      if (children.length) {
        item.children = children;
      }

      tree.push(item);
    }
  });

  return tree;
}

module.exports.tree = (array, parentId = '') => {
  count = 0;
  const tree = createTree(array, parentId = '');

  return tree;
}