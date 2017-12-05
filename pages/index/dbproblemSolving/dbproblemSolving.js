// pages/index/dbproblemSolving/dbproblemSolving.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    code:"",
   // bags:[],
  },
  //输入条码
  scanBox: function(e) { 
    var This = this;
    var barCode = e.detail.value;//条码
    This.scanBoxCom(barCode)
  },
  //扫描条码
  scanBoxCode:function(){
    var This = this;
    wx.scanCode({
      success: function (msg) {
        This.scanBoxCom(msg.result)
      },
      fail: function (e) {

        wx.showToast({
          title: '扫码失败',
        })
      }
    })
  },
  scanBoxCom:function(barcode){
    var This =this;
    wx.request({
      url: getApp().globalData.url +'/problem/scanTransportBox',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data:{
        token:This.data.token,
        barCode: barcode
      },
      success:function(msg){
       // console.log(msg)
        if(msg.data.success){
          if (msg.data.data.length!=0){
           wx.navigateTo({
             url: 'scanBag/scanBag?bags=' + JSON.stringify(msg.data.data),
           })
         }else{
            getApp().hnToast("此箱子没有标本袋")
         }
          // This.setData({
          //   bags:msg.data.data
          // })
        }else{
          getApp().hnToast(msg.data.message)
        }
      }
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
        This.setData({
          token:res.data
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