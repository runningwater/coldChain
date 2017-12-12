// pages/index/samplePacking/scanBag/scanBag.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
      
      barCode:[],//标本袋条码集合
      token:"",
      location: "", 
      transportid:"",
      samplesum: "",//含有几个标本袋
      barcode: "",//标本箱条码
      startPoint: [0, 0],//初始化touchstart坐标
      flag: false
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
      var bagId = e.currentTarget.dataset.bagid;   
      var This = this;

      //当前触摸点坐标
      var curPoint = [e.touches[0].pageX, e.touches[0].pageY];
      var startPoint = this.data.startPoint;
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
  delBag:function(e){
    var This = this;
   
      wx.showModal({
        title: '确认删除？',
        content: '确定要删除此标本袋吗？',
        success: function (confirm) {
          if (confirm.confirm) {
            wx.request({
              url: getApp().globalData.url + '/box/transportRemoveBag',
              method: "POST",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                token: This.data.token,
                bagId: e.currentTarget.dataset.bagid,
                transportId: This.data.transportid
              },
              success: function (msg) {
                //   console.log(msg)
                if (msg.data.success) {
                  wx.request({
                    url: getApp().globalData.url + '/box/initBag',
                    data: {
                      token: This.data.token,
                      transportId: This.data.transportid
                    },
                    success: function (msg) {
                      //   console.log(msg)                                         
                      if (msg.data.success) {
                        This.setData({
                          barCode: msg.data.data,
                          samplesum: msg.data.data.length
                        })
                      } else {
                        getApp().hnToast(msg.data.message)
                      }

                    }
                  })
                } else {
                  getApp().hnToast(msg.data.message)
                }
              },
              fail: function (e) {

              }
            })

          }
        }
      })
  
  },
  //扫描标本袋
  scanCode: function () {
      var This = this;
      wx.scanCode({
          success: function (msg) {
              //console.log(msg)
              var barcode = msg.result;
              wx.request({
                  url: getApp().globalData.url + '/sample/packScanBag',
                  method: "POST",
                  header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                  },
                  data: {
                      token: This.data.token,
                      barCode: barcode,
                      location: This.data.location,
                      transportId: This.data.transportid
                  },
                  success: function (msg) {
                      //console.log(msg.data.success)
                      if (msg.data.success) {
                          wx.request({
                              url: getApp().globalData.url + '/box/initBag',
                              data: {
                                  token: This.data.token,
                                  transportId: This.data.transportid
                              },
                              success: function (msg) {
                                  //console.log(msg)
                                  if (msg.data.success) {
                                      This.setData({
                                          barCode: msg.data.data,
                                          samplesum: msg.data.data.length
                                      })
                                  } else {
                                      getApp().hnToast(msg.data.message)
                                  }

                              }
                          })
                      } else {
                          getApp().hnToast(msg.data.message)
                      }
                  }
              })
          }
      })
  },
  //完成返回
  packing:function(){
        wx.navigateBack({
            delta:1
        })
  },
 //输入标本袋条码zhengmanru
    scanBag:function(e){
        var This = this;
        //console.log(e.detail.value)
        var barcode = e.detail.value;
        wx.request({
            url: getApp().globalData.url + '/sample/packScanBag',
            method: "POST",
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
                token: This.data.token,
                barCode: barcode,
                location: This.data.location,
                transportId: This.data.transportid
            },
            success:function(msg){
               // console.log(msg.data.success)
                if (msg.data.success){
                    wx.request({
                        url: getApp().globalData.url + '/box/initBag',
                        data: {
                            token: This.data.token,
                            transportId: This.data.transportid
                        },
                        success: function (msg) {
                           
                            if (msg.data.success) {
                                This.setData({
                                  barCode: msg.data.data, 
                                  samplesum: msg.data.data.length
                                })
                            } else {
                                getApp().hnToast(msg.data.message)
                            }

                        }
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
    
    var This = this;
    this.setData({
      barcode: options.barcode,
      transportid: options.transportid,
      samplesum: options.samplesum
    })
    wx.getStorage({
        key: 'token',
        success: function (res) {
            if (res.data) {
                This.setData({
                    token: res.data,
                    transportid:options.transportid
                })
                wx.request({
                    url: getApp().globalData.url+'/box/initBag',
                    data:{
                        token:This.data.token,
                        transportId: options.transportid
                    },
                    success:function(msg){
                          
                            if(msg.data.success){
                                This.setData({
                                    barCode: msg.data.data,
                                    samplesum: msg.data.data.length
                                })
                            }else{
                                getApp().hnToast(msg.data.message)
                            }
                          
                    }
                })
            }else{
                getApp().hnToast("非法的Token")
            }
        },
    })
    wx.getLocation({
        success: function (res) {
            This.setData({
                location: res.longitude + "," + res.latitude
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