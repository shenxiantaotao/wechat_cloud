// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 初始化云数据库 db 实例
const db = cloud.database()

// 导入export-promise
const rp = require('request-promise')

const URL = 'http://musicapi.xiecheng.live/personalized'

const playlistCollection = db.collection('playlist')

// 请求的最大条数
const MAX_LIMIT = 2


// 云函数入口函数
exports.main = async (event, context) => {
  // 优化一下 数据去重
  // 获取 本地云数据库中的数据 再来判断当前数据中是否有相同的 有的话就去除掉
  // const list = await playlistCollection.get()
  // console.log(list)

  // 突破小程序云数据库中get100的限制 
  const countResult = await playlistCollection.count()
  const total = countResult.total
  // 技巧是 取出数据库中所有的条数 比如 数据库中有399条 那么 使用399/100 再使用ceil向上取整
  const batchTomes = Math.ceil(total / MAX_LIMIT)
  const tasks = [];
  // 利用Promise集合来做
  for (let i = 0; i < batchTomes; i++) {
    let promise = playlistCollection.skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }

  let list = {
    data: []
  }

  if (tasks.length > 0) {
    list = (await (Promise.all(tasks))).reduce((oldItem, newItem) => {
      return {
        data: oldItem.data.concat(newItem.data)
      }
    })
  }



  // 发送request请求 
  const playlist = await rp(URL).then((res) => {
    return JSON.parse(res).result
  })
  console.log(playlist)

  // 重复数据去重
  let newList = [];
  for (let i = 0; i < playlist.length; i++) {
    let flag = true;
    for (let k = 0; k < list.data.length; k++) {
      if (playlist[i].id === list.data[k].id) {
        flag = false;
        break;
      }
    }

    // 这个是我想要的数据
    if (flag) {
      newList.push(playlist[i])
    }
  }

  // 更新云数据库
  let len = newList.length;
  for (let i = 0; i < len; i++) {
    await playlistCollection.add({
      data: {
        ...newList[i],
        createTime: db.serverDate(),
      }
    }).then((res) => {
      console.log('插入成功')
    }).catch((err) => {
      console.log('插入失败')
    })
  }

  return len;
}