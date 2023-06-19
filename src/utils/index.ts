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

/**
 * 更新当前页码的列表
 * 根据当前页码和每页大小等分页数据，从全部数据的总列表中截取出来，形成子列表
 * @param allList 全部数据的总列表
 * @param pageNum 当前页码
 * @param pageSize 每页大小（每页展示的项目数量）
 */
export const updateCurrentPageList = <T>(allList: T[] = [], pageNum: number = 1, pageSize: number = 5) => {
  // 初始化结果列表
  let resultList: T[] = []

  // 源列表没数据
  let len = allList?.length
  if (!len || len < 1) {
    return []
  }

  // 源列表有数据

  // 如果当前页码比总页码数大，则当前页码降到最后一页，防止页码溢出
  const maxPageNum = Math.ceil((allList?.length ?? 0) / pageSize)
  pageNum = Math.min(pageNum, maxPageNum)

  // 左闭右开区间
  // 1. 起始索引（含）
  const startIndex = (pageNum - 1) * pageSize
  // 2. 终止索引（不含）
  const endIndex = pageNum * pageSize

  // 截取对应区间的列表数据
  if (allList?.length) {
    resultList = allList.slice(startIndex, endIndex)
  }
  return resultList ?? []
}
