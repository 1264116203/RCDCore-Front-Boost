/** 设置Tree当前节点和自己子节点不可选 */
export function disabledNode(currentId, treeData) {
  for (let i = 0; i < treeData.length; i++) {
    const found = _findNode(currentId, treeData[i])
    if (found) {
      _disableNode(found)
      break
    }
  }
}

/** 找当前节点 */
export function _findNode(id, node) {
  if (node.id === id) {
    return node
  }

  if (node.children) {
    let found
    for (let i = 0; i < node.children.length; i++) {
      found = _findNode(id, node.children[i])
      if (found) {
        return found
      }
    }
    return undefined
  }
}

/** 节点不可选 */
export function _disableNode(node) {
  node.disabled = true
  if (node.children) {
    node.children.forEach(_disableNode)
  }
}
