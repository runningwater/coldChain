// pages/index/dbproblemSolving/scanBag/scanBag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:"",
    bags:[],
    flag: false,
    l:''
  },
  cancel: function () {
    this.setData({
      l: ""
    })
  },
  mytouchstart: function (e) {


    //开始触摸，获取触摸点坐标并放入数组中
    this.setData({
      startPoint: [e.touches[0].pageX, e.touches[0].pageY],
      flag: false
    });
  },
  //触摸点移动 
  mymove: function (e) {

    var This = this;
    var curPoint = [e.touches[0].pageX, e.touches[0].pageY];
    var startPoint = This.data.startPoint;
    //比较pageX值
    if (curPoint[0] <= startPoint[0]) {
      if (Math.abs(curPoint[0] - startPoint[0]) >= Math.abs(curPoint[1] - startPoint[1])) {
        //左滑 
        This.setData({
          flag: true
        })

      }
    }


  },
  myend: function (e) {

    var This = this;
    if (This.data.flag) {
      This.setData({
        l: e.currentTarget.dataset.bagid,
        flag: false
      })
    }

  },
  scanBag: function (e) {
    var barcode = e.detail.value;
    this.scanBagCom(barcode);
   },
  scanBagCode:function(){
    var This = this;
    wx.scanCode({
      success: function (msg) {
        This.scanBagCom(msg.result);
      },
      fail: function (e) {
       // console.log(e);
        wx.showToast({
          title: '扫码失败',
        })
      }
    })
  },
  scanBagCom: function(barcode) {
      var This = this;
      wx.request({
        url: getApp().globalData.url + '/problem/scanTransportBag',
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data:{
          token:This.data.token,
          boxId:This.data.bags[0].boxId,
          barCode:barcode,
          transportId: This.data.bags[0].transportId
        },
        success:function(msg){
          if(msg.data.success){
              This.initBag();
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
   // console.log(JSON.parse(options.bags))
    wx.getStorage({
      key: 'token',
      success: function(res) {
        This.setData({
          bags: JSON.parse(options.bags),
          token:res.data
        })
      },
    })
  
  },
initBag:function(){
  var This = this;
  wx.request({
    url: getApp().globalData.url + '/problem/scanTransportBox',
    method: "POST",
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    data: {
      token: This.data.token,
      barCode: This.data.bags[0].barCode
    },
    success: function (msg) {
    
      if (msg.data.success) {
      
        This.setData({
          bags:msg.data.data
        })
      } else {
        getApp().hnToast(msg.data.message)
      }
    }
  })
},

  delBag:function(e){
    wx.showActionSheet({
      itemList: ["我要删除"],
      success: function (res) {
       // console.log(res.tapIndex)
        if (res.tapIndex == "0") {
          wx.navigateTo({
            url: 'delBag/delBag?bagid=' + e.currentTarget.dataset.bagid,
          })
        }
      }
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
   
      this.initBag();
        
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