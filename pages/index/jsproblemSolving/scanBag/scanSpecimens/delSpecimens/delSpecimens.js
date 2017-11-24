// pages/index/jsproblemSolving/scanBag/scanSpecimens/delSpecimens/delSpecimens.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sampleId:""
  },
  delSpecimens:function(e){
    var This = this;
    wx.request({
      url: getApp().globalData.url + '/problem/removeSample',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: This.data.token,
        sampleId: This.data.sampleId,
        remark: e.detail.value.del
      },
      success: function (msg) {
        //console.log(msg)
        if (msg.data.success) {
   
          wx.showToast({
            title: msg.data.message,
            success:function(){
              wx.navigateBack({
                delta: 1
              })
            }
          })
          
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This = this;
    //console.log(options.sampleId)
    wx.getStorage({
      key: 'token',
      success: function (res) {
        This.setData({
          token: res.data,
          sampleId: options.sampleId
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