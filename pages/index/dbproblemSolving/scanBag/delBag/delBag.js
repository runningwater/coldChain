// pages/index/dbproblemSolving/scanBag/delBag/delBag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    bagId: ""
  },
  delBag: function (e) {
   
    var This = this;
    console.log(This.data.bagId)
    wx.request({
      url: getApp().globalData.url + '/problem/removeSampleBag',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: This.data.token,
        bagId: This.data.bagId,
        remark: e.detail.value.del
      },
      success: function (msg) {
        console.log(msg)
        if (msg.data.success) {
          getApp().hnToast("删除成功")
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        This.setData({
          token: res.data,
          bagId: options.bagid
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})