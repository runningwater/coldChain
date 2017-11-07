// pages/index/querySpecimens/querySpecimens.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    barCode: {}
  },
  scanCode:function(){
    var This = this;
    wx.scanCode({
      success:function(msg){
        var barcode =msg.result;
        This.query(barcode);
      }
    })
  
  },
  //输入条码时 查询
  querySpecimen: function (e) {
    var This = this;
    var barcode = e.detail.value;
    This.query(barcode);
  },
  query: function (barcode){
    var This = this;
    wx.request({
      url: getApp().globalData.url + '/sample/getQuerySample',
    
      data: {
        token: this.data.token,
        barCode: barcode
      },
      success: function (msg) {
       
        if (msg.data.success) {
          This.setData({
            barCode: msg.data.data
          })
        } else {
          wx.showToast({
            title: '标本不存在',
          })
        }
      }
    })
  },
  //申请单照片
  applicationFormPhotos: function (e) {
    var sampleid = e.currentTarget.dataset.sampleid;
    wx.navigateTo({
      url: 'applicationFormPhotos/applicationFormPhotos?sampleid=' + sampleid,
    })
  },
  //标本运行轨迹
  specimenOperationTrack: function (e) {
    var sampleid = e.currentTarget.dataset.sampleid;
    wx.navigateTo({
      url: 'specimenOperationTrack/specimenOperationTrack?sampleid=' + sampleid,
    })
  },
  //温度变化
  temperatureChange: function (e) {
    var sampleid = e.currentTarget.dataset.sampleid;
    wx.navigateTo({
      url: 'temperatureChange/temperatureChange?sampleid=' + sampleid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          This.setData({
            token: res.data
          })
        }
      },
    })
    wx.showToast({
      title: '请输入标本号进行查询',
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