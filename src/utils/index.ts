/**
 * 数组去重，基本数据类型
 * @param arr 需要去重的数组
 */
export const deduplicateBaseArray = <T>(arr: T[]): T[] => {
  // 数组不存在或者为空
  if (!arr || arr.length < 1) {
    return []
  }
  // 数组只有一个元素
  if (arr.length === 1) {
    return arr
  }
  // 数组有多个元素
  return Array.from(new Set(arr))
}

/**
 * 数组去重，对象类型
 * @param arr 需要去重的数组
 * @param keyName {string} 对象内的某个属性名
 */
export const deduplicateObjectArray = <T>(arr: T[], keyName: string): T[] => {
  // 数组不存在或者为空
  if (!arr || arr.length < 1) {
    return []
  }
  // 数组只有一个元素
  if (arr.length === 1) {
    return arr
  }
  // 数组有多个元素
  const res = new Map()
  return arr.filter((item: T) => !res.has(item[<keyof T>keyName]) && res.set(item[<keyof T>keyName], true))
}
