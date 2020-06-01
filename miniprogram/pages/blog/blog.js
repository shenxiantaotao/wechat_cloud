const PAGE_SIZE = 10
let keyword = ''

Page({

  // 页面的初始数据
  data: {
    modalShow: false, //控制底部弹出层是否显示
    blogList: [], //用户评论界面
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this._loadBlogList()
  },

  // 获取用户评论列表
  _loadBlogList(page = 0) {

    wx.showLoading({
      title: '拼命加载中',
    })

    wx.cloud.callFunction({
      name: 'blog',
      data: {
        $url: 'list',
        keyword,
        page,
        page_size: PAGE_SIZE
      }
    }).then((res) => {
      // console.log(res)
      this.setData({
        blogList: this.data.blogList.concat(res.result.data)
      })
      // 下拉成功之后隐藏三个点
      wx.stopPullDownRefresh()
      wx.hideLoading()
    })


  },


  // 模糊搜索
  onSearch(event) {
    keyword = event.detail
    this.setData({
      blogList: []
    })
    this._loadBlogList()
  },

  // 用户授权成功
  onLoginSuccess(event) {
    // console.log(event)
    const {
      nickName,
      avatarUrl
    } = event.detail
    wx.navigateTo({
      url: `../blog-edit/blog-edit?nickName=${nickName}&avatarUrl=${avatarUrl}`,
    })
  },
  // 用户点击了拒绝授权
  onLoginFail() {
    wx.showModal({
      title: '授权用户才能发布',
      content: '',
    })
  },

  // 评论 
  onPublish() {
    // 首先判断当前是否授权 授权 -> 可评论 否则走授权
    wx.getSetting({
      success: (res) => {
        // console.log(res)
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: (res) => {
              this.onLoginSuccess({
                detail: res.userInfo
              })
            },
          })
        } else {
          this.setData({
            modalShow: true
          })
        }
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      blogList: []
    })
    this._loadBlogList(0)
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this._loadBlogList(this.data.blogList.length)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (event) {
    // console.log(event)
    // let blogObj = event.target.dataset.blog
    // return {
    //   title: blogObj.content,
    //   path: `/pages/blog-comment/blog-comment?blogId=${blogObj._id}`,
    // }
  },

  // 跳转到详情界面
  goComment(event) {
    const {
      blogid
    } = event.target.dataset
    wx.navigateTo({
      url: `../../pages/blog-comment/blog-comment?id=${blogid}`,
    })
  }
})