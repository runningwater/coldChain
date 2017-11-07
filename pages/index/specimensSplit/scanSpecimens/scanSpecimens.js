// pages/index/specimensSplit/scanSpecimens/scanSpecimens.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      token:"",
      transportId:"",
      barcode:"",//运输箱条码
      num:"",//扫描标本个数
      specimens:[],
      location:""

  },
  //扫描标本
  scanCode:function(){
      var This = this;
      wx.scanCode({
          success: function (msg) {
              //console.log(msg.result)
              This.scanSpecimens(msg.result)
          },
          fail: function (e) {
            //  console.log(e);
              wx.showToast({
                  title: '扫码失败',
              })
          }
      })
  },
  //手工输入标本条码
  scanBox:function(e){
      var barCode = e.detail.value;
      this.scanSpecimens(barCode)
  },
  scanSpecimens:function(barcode){
      var This = this;
      wx.request({
          url: getApp().globalData.url +'/box/scanSample',
          method: "POST",
          header: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
          data: {
              token: This.data.token,
              transportId: This.data.transportId,
              location: This.data.location,
              barCode: barcode
          },
          success: function (msg) {
             // console.log(msg)
              if (msg.data.success){
                  wx.request({
                      url: getApp().globalData.url + '/box/initScanSample',
                      data: {
                          token: This.data.token,
                          transportId: This.data.transportId
                      },
                      success: function (msg) {
                          //console.log(msg)
                          if (msg.data.success) {
                              This.setData({
                                  num: msg.data.data.length,//扫描标本个数
                                  specimens: msg.data.data,
                              })
                          } else {
                              getApp().hnToast(msg.data.message)
                          }
                      }
                  })
              }else{
                  getApp().hnToast(msg.data.message);
              }
          }
      })
  },
  //完成
  complete:function(){
      var This = this;
      wx.request({
          url: getApp().globalData.url+'/box/closeBox',
          method: "POST",
          header: {
              "Content-Type": "application/x-www-form-urlencoded"
          },
          data:{
              token:This.data.token,
              transportId: This.data.transportId,
              location:This.data.location
          },
          success:function(msg){
               // console.log(msg)
                if(msg.data.success){
                    getApp().hnToast(msg.data.message)
                    wx.navigateBack({
                        delta:1
                    })
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
      console.log(options.transportId)
      var This = this;
      wx.getLocation({
          success: function(res) {
              This.setData({
                  location: res.longitude + "," + res.latitude
              });
          },
      })
      wx.getStorage({
          key: 'token',
          success: function(res) {
              This.setData({
                  transportId: options.transportId,
                  token:res.data,
                  barcode: options.barcode
              })
              wx.request({
                  url: getApp().globalData.url + '/box/initScanSample',
                  data: {
                      token: This.data.token,
                      transportId: This.data.transportId
                  },
                  success: function (msg) {
                     // console.log(msg)
                      if (msg.data.success){
                          This.setData({
                              num: msg.data.data.length,//扫描标本个数
                              specimens:msg.data.data,
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