// pages/index/serviceManual/manualsList/mauanlsDetail/mauanlsDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    content: "",//内容
    createTime: "",//创建时间
    imageSrc: "",//图片
    keyword: "",//关键字
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This = this;
      wx.getStorage({
        key: 'token',
        success: function(res) {
          wx.request({
            url: getApp().globalData.url + '/news/getMauanlsTypeDetail',
            data:{
              token:res.data,
              newsId: options.newid
            },
            success:function(msg){
              //console.log(msg)
              wx.setNavigationBarTitle({
                title: msg.data.data.title,
              })
              This.setData({
                content: msg.data.data.content,//内容
                createTime: msg.data.data.createTime,//创建时间
                imageSrc: msg.data.data.imageSrc,//图片
                keyword: msg.data.data.keyword,//关键字
              })
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