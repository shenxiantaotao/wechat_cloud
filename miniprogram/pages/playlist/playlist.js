const MAX_LIMIT = 9
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperImgUrls: [{
        url: 'http://p1.music.126.net/oeH9rlBAj3UNkhOmfog8Hw==/109951164169407335.jpg'
      },
      {
        url: 'http://p1.music.126.net/xhWAaHI-SIYP8ZMzL9NOqg==/109951164167032995.jpg'
      },
      {
        url: 'http://p1.music.126.net/Yo-FjrJTQ9clkDkuUCTtUg==/109951164169441928.jpg'
      }
    ],
    playlist: []
  },

  // 生命周期函数--监听页面加载 真实项目中 这个生命周期 一般获取接口请求
  onLoad(options) {
    console.log('playlist:  ')
    console.log(options)
    // 这里的options是当前组件的参数 例如 ?name=1 
    this._getPlayList()
  },

  // 获取推荐列表数据
  _getPlayList() {
    wx.showLoading({
      title: '加载中',
    })
    const playlist = this.data.playlist
    wx.cloud.callFunction({
      name: 'music',
      data: {
        page: playlist.length,
        page_size: MAX_LIMIT,
        $url: "playlist"
      }
    }).then((res) => {
      this.setData({
        playlist: playlist.concat(res.result.data)
      })
      // 下拉成功之后隐藏三个点
      wx.stopPullDownRefresh()
      // 关闭加载框
      wx.hideLoading()
    })
  },






  // 生命周期函数--监听页面初次渲染完成
  onReady() {

  },

  // 生命周期函数--监听页面显示
  onShow() {

  },

  // 生命周期函数--监听页面隐藏
  onHide() {

  },

  // 生命周期函数--监听页面卸载
  onUnload() {

  },

  // 页面相关事件处理函数--监听用户下拉动作
  onPullDownRefresh() {
    this.setData({
      playlist: []
    })
    this._getPlayList()
  },

  // 页面上拉触底事件的处理函数
  onReachBottom() {
    this._getPlayList()
  },

  // 用户点击右上角分享
  onShareAppMessage() {

  }
})