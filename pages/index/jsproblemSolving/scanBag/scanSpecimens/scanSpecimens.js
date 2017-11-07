// pages/index/jsproblemSolving/scanBag/scanSpecimens/scanSpecimens.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    bagId:"",
    transportId: "",
    recordId:"",
    codes:[],
    code:"",
    num:"",
    barcode:"",
    filePaths:[]
  },
  //输入条码
  scanSpecimens:function(e){
    var This = this;
    var barCode = e.detail.value;//条码
    This.scanSpecimensCom(barCode)
  },
  //扫描条码
  scanSpecimensCode:function(){
    var This = this;
    wx.scanCode({
      success: function (msg) {
        This.scanSpecimensCom(msg.result)
      },
      fail: function (e) {       
        wx.showToast({
          title: '扫码失败',
        })
      }
    })
  },
  scanSpecimensCom:function(barCode){
    var This = this;
    wx.request({
      url: getApp().globalData.url + '/problem/scanSample',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: This.data.token,
        bagId: This.data.bagId,
        recordId: This.data.recordId,       
        transportId: This.data.transportId,
        barCode: barCode
      },
      success: function (msg) {
        if (msg.data.success) {
          This.initSpecimens(This.data.token,This.data.bagId,This.data.recordId)
        } else {
          getApp().hnToast(msg.data.message)
        }
      }
    })
  },
  initSpecimens: function (token, bagId, recordId){
    var This = this;
      wx.request({
        url: getApp().globalData.url  +'/problem/getReceiveSample',
        data:{
          token: token,
          bagId: bagId,
          recordId: recordId
        },
        success:function(msg){
         
          if(msg.data.success){
            This.setData({
              codes:msg.data.data,
              num: msg.data.data.length,
            })
          }else{
            getApp().hnToast(msg.data.message)
          }
        }
      })
  },
  delSpecimens:function(e){
    wx.showActionSheet({
      itemList: ["我要删除"],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == "0") {
          wx.navigateTo({
            url: 'delSpecimens/delSpecimens?sampleId=' + e.currentTarget.dataset.sampleid,
          })
        }
      }
    })
   
  },
  takePic:function(e){
    var This = this;
    var sampleId = e.currentTarget.dataset.sampleid;
    wx.chooseImage({
      count: 1,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {
        var tempPaths = res.tempFilePaths;
        wx.uploadFile({
          url: getApp().globalData.url + '/sample/uploadSampleApply',
          filePath: tempPaths[0],
          name: sampleId,
          formData: {
            token: This.data.token,
            sampleId: sampleId
          },
          success: function (msg) {
            var data = JSON.parse(msg.data);
            if (data.success) {
              wx.showToast({
                title: '图片上传成功',
              })
            } else {
              wx.showToast({
                title: '上传失败',
              })
            }
          }
        })
      },
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
          token:res.data,
          bagId: options.bagId,
          transportId: options.transportId,
          recordId: options.recordId,
          code: options.barcode
         
        })
        This.initSpecimens(This.data.token, This.data.bagId, This.data.recordId);
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
      barcode:""
    })
    var This = this;
    setTimeout(function () {
      This.initSpecimens(This.data.token, This.data.bagId, This.data.recordId);
    }, 500)
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