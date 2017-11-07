// pages/index/serviceManual/serviceManual.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serverLists:[],//服务手册列表
  },
  manualsList:function(e){
    console.log(e.currentTarget.dataset.type);
    wx.navigateTo({
      url: 'manualsList/manualsList?type01=' + e.currentTarget.dataset.type,
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
          if(res.data){ getApp().globalData.url + 
            This.setData({
              token:res.data
            });
            wx.request({
              url: getApp().globalData.url + '/news/getManualsList',
              data:{
                token:res.data
              },
              success:function(msg){
                console.log(msg)
                if(msg.data.success){
                    This.setData({
                      serverLists:msg.data.data
                    })
                }else{
                  getApp().hnToast(msg.data.message)
                }
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