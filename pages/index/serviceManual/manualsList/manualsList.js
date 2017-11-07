// pages/index/serviceManual/manualsList/manualsList.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    newsList:[]
  },
  detail:function(e){
    console.log(e.currentTarget.dataset.newid)
    wx.navigateTo({
      url: 'mauanlsDetail/mauanlsDetail?newid=' + e.currentTarget.dataset.newid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //console.log(options.type01)
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        wx.request({
          url: getApp().globalData.url +  '/news/getManualsTypeList',
          data:{
            token:res.data,
            type: options.type01
          },
          success:function(msg){
           // console.log(msg)
            wx.setNavigationBarTitle({
              title: msg.data.data.title,
            })
            if(msg.data.success){
                This.setData({
                  newsList: msg.data.data
                })
            }else{
              getApp().hnToast(msg.data.message)
            }
          }
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