// 输入文字最大的个数
const MAX_WORDS_NUM = 140
// 最大上传图片数量
const MAX_IMG_NUM = 9

// 数据库初始化
const db = wx.cloud.database()

// 输入的文字内容
let content = ''
// 地址参数 用户头像 用户昵称
let userInfo = {}

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 输入的文字个数
    wordsNum: 0,
    // 添加图片元素是否显示 
    selectPhoto: true,
    // 上传图片列表
    images: [],
    // 一个小技巧 控制输入框弹出的时候发布的高度
    footerBottom: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    userInfo = options
  },

  // 发布
  send() {
    // 2、数据 -> 云数据库
    // 数据库：内容、图片fileID、openid、昵称、头像、时间
    // 1、图片 -> 云存储 fileID 云文件ID
    if (content.trim() === '') {
      wx.showModal({
        title: '请输入内容',
        content: '',
      })
      return
    }

    wx.showLoading({
      title: '发布中',
      mask: true,
    })

    // promise 集合数组
    let promiseArr = []
    // 图片云存储唯一标示ID
    let fileIds = []
    const len = this.data.images.length

    for (let i = 0; i < len; i++) {
      let p = new Promise((resolve, reject) => {
        let item = this.data.images[i]
        // 文件扩展名
        let suffix = /\.\w+$/.exec(item)[0]
        wx.cloud.uploadFile({
          cloudPath: 'blog/' + Date.now() + '-' + Math.random() * 1000000 + suffix,
          filePath: item,
          success: (res) => {
            console.log(res.fileID)
            fileIds = fileIds.concat(res.fileID)
            resolve()
          },
          fail: (err) => {
            console.error(err)
            reject()
          }
        })
      })

      // 添加到promise集合中
      promiseArr.push(p)
    }

    // 处理存储到云数据库中
    Promise.all(promiseArr).then((res) => {
      db.collection('blog').add({
        data: {
          ...userInfo,
          content,
          img: fileIds,
          createTime: db.serverDate(), // 服务端的时间
        }
      }).then((res) => {
        wx.showToast({
          title: '发布成功',
          mask: true
        })

        // 返回blog页面，并且刷新
        wx.navigateBack()
        const pages = getCurrentPages()
        const prevPage = pages[pages.length - 2]
        prevPage.onPullDownRefresh()
      })
    }).catch((err) => {
      wx.hideLoading()
      wx.showToast({
        title: '发布失败',
      })
    })

  },

  // 上传图片
  onChooseImage() {
    // 还能再选几张图片
    let images = this.data.images
    let max = MAX_IMG_NUM - images.length
    wx.chooseImage({
      count: max,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        console.log(res)
        this.setData({
          images: images.concat(res.tempFilePaths)
        })
        // 还能再选几张图片
        max = MAX_IMG_NUM - this.data.images.length
        this.setData({
          selectPhoto: max <= 0 ? false : true
        })
      }
    })
  },

  // 删除图片
  onDelImage(event) {
    const {
      index
    } = event.target.dataset
    this.data.images.splice(index, 1)
    this.setData({
      images: this.data.images
    })
    // 删除完了之后 要做判断把 + 号放出来
    if (this.data.images.length == MAX_IMG_NUM - 1) {
      this.setData({
        selectPhoto: true,
      })
    }
  },

  // 预览图片
  onPreviewImage(event) {
    // 6/9
    wx.previewImage({
      urls: this.data.images,
      current: event.target.dataset.imgsrc,
    })
  },

  // 输入框change
  onInput(event) {
    const {
      value
    } = event.detail
    let wordsNum = value.length

    if (wordsNum >= MAX_WORDS_NUM) {
      wordsNum = `最大字数为${MAX_WORDS_NUM}`
    }
    this.setData({
      wordsNum
    })

    content = value
  },
  // 获取焦点事件
  onFocus(event) {
    // 模拟器获取的键盘高度为0
    // console.log(event)
    const {
      height: footerBottom
    } = event.detail
    this.setData({
      footerBottom,
    })
  },
  // input blur
  onBlur() {
    this.setData({
      footerBottom: 0,
    })
  }
})