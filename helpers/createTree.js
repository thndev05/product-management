const createTree = (array, parentId = '') => {
  const tree = [];
  
  array.forEach(item => {
    if (item.parent_id === parentId) {
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
  const tree = createTree(array, parentId = '');

  return tree;
}