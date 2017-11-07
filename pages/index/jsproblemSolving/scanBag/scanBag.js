// pages/index/jsproblemSolving/scanBag/scanBag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    boxid:"",
    recordId:"",
    hospitalId:"",
    transportId:"",
    hospitalName:"",
    boxCode:"",
    bagCodes:[]
  },
  //点击进入标本
  enterBag:function(e){
      wx.navigateTo({
        url: 'scanSpecimens/scanSpecimens?bagId=' + e.currentTarget.dataset.bagid + '&transportId=' + this.data.transportId + '&recordId=' + this.data.recordId + '&num=' + e.currentTarget.dataset.num + '&barcode=' + e.currentTarget.dataset.barcode,
      })
  },
  //输入条码时
  scanBag:function(e){
    var This = this;
    var barCode = e.detail.value;//条码
    This.scanBagCom(barCode)
  },
  //扫描条码
  scanBagCode:function(){
    var This = this;
    wx.scanCode({
      success: function (msg) {
        This.scanBagCom(msg.result)
      },
      fail: function (e) {
       
        wx.showToast({
          title: '扫码失败',
        })
      }
    })
  },
  scanBagCom: function (barCode){
    var This = this;
    wx.request({
      url: getApp().globalData.url + '/problem/scanSampleBag',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: This.data.token,
        boxId: This.data.boxid,
        recordId: This.data.recordId,
        hospitalId: This.data.hospitalId,
        transportId: This.data.transportId,
        barCode: barCode
      },
      success: function (msg) {
        if (msg.data.success) {
          This.initBag(This.data.token, This.data.recordId)
        } else {
          getApp().hnToast(msg.data.message)
        }
      }
    })
  },
  initBag: function (token, recordId){
    var This = this;
    wx.request({
      url: getApp().globalData.url +'/problem/getReceiveBag',
      data:{
        token:token,
        recordId: recordId
      },
      success:function(msg){
        console.log(msg)
        if(msg.data.success){
          This.setData({
            bagCodes:msg.data.data
          })
        }else{
          getApp().hnToast(msg.data.message)
        }
      }
    })
  },
  //删除标本袋
  delBag:function(e){
    wx.showActionSheet({
      itemList: ["我要删除"],
      success:function(res){
        console.log(res.tapIndex)
        if (res.tapIndex=="0"){
          wx.navigateTo({
            url: 'delBag/delBag?bagid=' + e.currentTarget.dataset.bagid,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        This.setData({
          token:res.data,
          boxid: options.boxid,
          recordId: options.recordId,
          hospitalId: options.hospitalId,
          transportId: options.transportId,
          hospitalName: options.hospitalName,
          boxCode: options.boxCode
        })
        This.initBag(This.data.token, This.data.recordId)
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
    this.setData({
      code: ""
    })
    var This = this;
    setTimeout(function(){
      This.initBag(This.data.token, This.data.recordId)
    },500)
  
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