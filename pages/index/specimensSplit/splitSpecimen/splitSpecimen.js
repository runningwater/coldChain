// pages/index/specimensSplit/specimensSplit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    location: "",
    code: "",
    listSp: [],//标本列表
    total: 0,//所有标本数量
    num: 0,//已选标本数量
    sampleList: [],
    barcode: "",//标本条码
    boxBarCode:"",
    btnName:true,
  },
  //全选
  selectAll:function(){
      var This = this;
      This.setData({
        btnName:!This.data.btnName
      })
      var arr = This.data.listSp;
      if (!This.data.btnName){
        for(let i=0;i<arr.length;i++){
          arr[i].status = 1;
        }
        This.setData({
          num: arr.length
        })
      }else{
        for (let i = 0; i < arr.length; i++) {
          arr[i].status = 0;
        }
        This.setData({
          num: 0
        })
      }
      This.setData({
        listSp:arr
      })
  },
  checkboxChange: function (e) {
    //console.log('checkbox发生change事件，携带value值为：', e.detail.value)
    this.setData({
      num: e.detail.value.length,
      sampleList: e.detail.value
    })
  },
  submit: function (e) {
    var This = this;
    if (this.data.sampleList.length<=0){
      getApp().hnToast("请选择标本");
      return false;
    }
    var data = {
      token: this.data.token,
      transportId: e.target.dataset.transportid,
      sampleList: this.data.sampleList.join(','),
      location: this.data.location
    }
    
    wx.request({
      url: getApp().globalData.url + '/box/closeBox',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: data,
      success: function (msg) {
       // console.log(msg)
        if (msg.data.success) {
          getApp().hnToast(msg.data.message);
         
        } else {
          getApp().hnToast(msg.data.message);
        }
        This.setData({
          num:0
        })
        This.scanSpecimens(This.data.boxBarCode)
      }
    })
  },

  scanSpecimens: function (barcode) {
    var This = this;
    wx.request({
      url: getApp().globalData.url + '/box/openBox',
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        token: This.data.token,
        location: This.data.location,
        barCode: barcode
      },
      success: function (msg) {
        //console.log(msg)
        if (msg.data.success) {
          if (msg.data.data.length == 0) {
            getApp().hnToast("暂无数据")
          } else {
            This.setData({
              listSp: msg.data.data,
              total: msg.data.data.length
            })
          }


        } else {
          getApp().hnToast(msg.data.message);
        }
      }
    })
  },
  //扫码
  scanCode: function () {
    var This = this;
    wx.scanCode({
      success: function (msg) {
        //console.log(msg.result)
        This.setData({
          barcode: msg.result
        })
        // This.scanSpecimens(msg.result)
      },
      fail: function (e) {
        //console.log(e);
        wx.showToast({
          title: '扫码失败',
        })
      }
    })
  },
  //手动录入
  blurBox: function (e) {
    //console.log(e.detail.value)
    var barcode = e.detail.value;
    var This = this;
    This.setData({
      barcode: barcode
    })
    

  },
 

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This = this;
  
    wx.getStorage({
      key: 'data',
      success: function(res) {
        //console.log(res.data)
        This.setData({
          listSp: res.data,
          total: res.data.length,
          boxBarCode:options.barcode
        })
      },
    })

    wx.getStorage({
      key: 'token',
      success: function (res) {
        This.setData({
          token: res.data
        })
      },
    })
   wx.getStorage({
     key: 'location',
     success: function(res) {
       This.setData({
         location: res.data
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
    this.setData({
      code: ""
    })
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