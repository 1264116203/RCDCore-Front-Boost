import Mock from 'mockjs'
const Random = Mock.Random
// 造列表数据
const dataSourceData = function() {
  let dataSources = []
  for (let i = 0; i < 5; i++) {
    let newArticleObject = {
      id: Random.guid(),
      title: Random.cword(4, 6), // Random.csentence() 随机生成一段中文文本。
      description: Random.cword(6, 8)
    }
    dataSources.push(newArticleObject)
  }

  return dataSources
}

Mock.mock(/.*?\/api\/datasource.*/, 'get', dataSourceData)
