import Mock from 'mockjs'
const Random = Mock.Random
// 造列表数据
const dataSourceData = function() {
  let dataSources = []
  let dbTypeEnumArray = ['slack', 'qq', 'wechat', 'apple', 'taobao', 'aliwangwang', 'twitter']
  let state = ['已完成', '进行中', '马上到期', '已超期']
  for (let i = 0; i < 3; i++) {
    let newArticleObject = {
      id: Random.guid(),
      title: Random.cword(4, 6), // Random.csentence() 随机生成一段中文文本。
      description: Random.cword(6, 8),
      content: Random.cword(6, 12),
      time: Random.integer(1, 4), // 随机生成一个数字 最小值1 最大值4
      icon: Random.pick(dbTypeEnumArray), // 从数组中随机取一个值
      state: Random.pick(state) // 从数组中随机取一个值
    }
    dataSources.push(newArticleObject)
  }

  return dataSources
}

Mock.mock(/.*?\/api\/datasource.*/, 'get', dataSourceData)
