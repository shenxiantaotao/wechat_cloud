// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 导入tcb-router
const TcbRouter = require("tcb-router")

// 导入 request-promise
const rp = require('request-promise')

// 接口请求地址
const BASE_URL = 'http://musicapi.xiecheng.live'


// 云函数入口函数
exports.main = async (event, context) => {
  // 实例 tcbrouter
  const app = new TcbRouter({
    event
  })

  // 获取推荐列表
  app.router('playlist', async (ctx, next) => {
    ctx.body = await cloud.database().collection('playlist')
      .skip(event.page)
      .limit(event.page_size)
      .orderBy('createTime', "desc")
      .get()
      .then((res) => {
        return res
      })
  })


  // 获取推荐歌单详情
  app.router('musiclist', async (ctx, next) => {
    ctx.body = await rp(BASE_URL + '/playlist/detail?id=' + parseInt(event.playlistId))
      .then((res) => {
        let response = JSON.parse(res);
        response.info = cloud.getWXContext()
        return response
      })
  })


  // 播放歌曲
  app.router('musicUrl', async (ctx, next)=>{
    ctx.body = await rp(BASE_URL + `/song/url?id=${ event.musicId }`).then((res)=>{
      return res
    })
  })

  // 歌词
  app.router('lyric', async (ctx, next)=>{
    ctx.body = await rp(BASE_URL + `/lyric?id=${ event.musicId }`).then((res) => {
      return res;
    })
  })


  // 启动路由服务
  return app.serve()
}