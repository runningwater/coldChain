// pages/index/announcements/announcements.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    newsList:[]
  },
  detail:function(e){
    //console.log(e.currentTarget.dataset.newid);
    wx.navigateTo({
      url: 'detail/detail?newid=' + e.currentTarget.dataset.newid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
          if(res.data){
            This.setData({
              token:res.data
            });
            wx.request({
              url: getApp().globalData.url + '/news/getNewsList',
              data:{
                token:This.data.token
              },
              success:function(msg){
                
                This.setData({
                  newsList:msg.data.data
                })
              }
            })
          }
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