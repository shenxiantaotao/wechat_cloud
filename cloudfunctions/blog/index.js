// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const TcbRouter = require('tcb-router')

const db = cloud.database()
const blogCollection = db.collection('blog')

// 云函数入口函数
exports.main = async (event, context) => {

  // 实例化 tcb-router
  const app = new TcbRouter({
    event
  })

  // 发现列表
  app.router('list', async (ctx, next) => {

    const keyword = event.keyword
    let w = {}
    if (keyword.trim() != '') {
      w = {
        content: db.RegExp({
          regexp: keyword,
          options: 'i'
        })
      }
    }

    ctx.body = await blogCollection
      .where(w)
      .skip(event.page)
      .limit(event.page_size)
      .orderBy('createTime', 'desc')
      .get((res) => {
        console.log(res)
        return res.data
      })
  })



  // 返回实例
  return app.serve()
}