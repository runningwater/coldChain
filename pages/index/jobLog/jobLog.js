// pages/index/jobLog/jobLog.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate:"年-月-日",
    endDate:"年-月-日",
    token:"",
    logs:[] 
  },
  changeStartDate:function(e){
    this.setData({
      startDate:e.detail.value
    })
  },
  changeEndDate:function(e){
    this.setData({
      endDate: e.detail.value
    })
  },
  query:function(){
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          This.setData({
            token: res.data
          })
          wx.request({
            url: getApp().globalData.url + '/task/myTaskLog',
            data: {
              token: This.data.token,
              beginDate: This.data.startDate,
              endDate: This.data.endDate
            },
            success: function (msg) {
             
              This.setData({
                logs: msg.data.data
              });
            }
          })
        }
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var nowDate = new Date();
    var y = nowDate.getFullYear();
    var m = nowDate.getMonth() + 1;
    var d = nowDate.getDate();
    if(m<10){
      m="0"+m;
    }
    if (d < 10) {
      d = "0" + d;
    }
    var dateTime = y+"-"+m+"-"+d;

    var This = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        if(res.data){
          This.setData({
            token:res.data
          })
          wx.request({
            url: getApp().globalData.url + '/task/myTaskLog',
            data:{
              token:This.data.token,
              beginDate: dateTime,
              endDate: dateTime
            },
            success:function(msg){
             
              This.setData({
                logs: msg.data.data
              });
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