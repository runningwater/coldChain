// pages/index/jsproblemSolving/jsproblemSolving.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    code:"",
    barCode:[],//箱子列表
  },
  //输入条码
  scanBox:function(e){
    console.log(e.detail.value)
    var barcode = e.detail.value;
    this.initBox(barcode);
  },
  //扫描条码
  scanCode: function () { 
    var This = this;
    wx.scanCode({
      success: function (msg) {        
        This.initBox(msg.result);
      },
      fail: function (e) {
        console.log(e);
        wx.showToast({
          title: '扫码失败',
        })
      }
    })
  },
  initBox:function(barcode){
    var This = this;
    wx.request({
      url: getApp().globalData.url + '/problem/getReceiveBox',
      data:{
        token:This.data.token,
        barCode: barcode
      },
      success:function(msg){
        console.log(msg)
        if(msg.data.success){
          This.setData({
            barCode:msg.data.data
          })
        }else{
          getApp().hnToast(msg.data.message);
        }
      }
    })
  },
  enterBox:function(e){
    //console.log(e.currentTarget.dataset)
    wx.navigateTo({
      url: 'scanBag/scanBag?boxid=' + e.currentTarget.dataset.boxid + '&recordId=' + e.currentTarget.dataset.recordid + '&hospitalId=' + e.currentTarget.dataset.hospitalid + '&transportId=' + e.currentTarget.dataset.transportid + "&hospitalName=" + e.currentTarget.dataset.hospitalname + '&boxCode=' + e.currentTarget.dataset.boxcode,
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
            })
            This.initBox("");
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
   // this.initBox(this.data.code);
  
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
    this.initBox(this.data.code);
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