// pages/index/myTask/receiveSamples/scan/scan.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startPoint: [0, 0],//初始化touchstart坐标
    token: "",
    hospitalId: "",
    workId: "",
    location: "",//经纬度
    barCode: [],
    flag: false,
    hosName:""
  },
  mytouchstart: function (e) {
    //开始触摸，获取触摸点坐标并放入数组中
    this.setData({
      startPoint: [e.touches[0].pageX, e.touches[0].pageY],
      flag: false
    });
  },
  //触摸点移动 
  delBox: function (e) {
    
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
    var boxId = e.currentTarget.dataset.boxid;
    var recordId = e.currentTarget.dataset.recordid;
    var barCode = e.currentTarget.dataset.barcode;
    var This = this;
    if (This.data.flag) {
      wx.showModal({
        title: '确认删除？',
        content: '确定要删除此标本箱吗？',
        success: function (confirm) {
          if (confirm.confirm) {
            wx.request({
              url: getApp().globalData.url + '/sample/removeSampleBox',
              method: "POST",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                token: This.data.token,
                boxId: boxId,
                recordId: recordId,
                barCode: barCode,
                location: This.data.location
              },
              success: function (msg) {

                if (msg.data.success) {
                  var options = {
                    hospitalId: This.data.hospitalId,
                    workId: This.data.workId
                  }
                  This.onLoad(options)
                }
              },
              fail: function (e) {

              }
            })

          }
        }
      })
    }
  },
  //扫码
  scanCode: function () {
    var This = this;
    wx.scanCode({
      success: function (msg) {
        // console.log(msg.result)
        This.getBarCode(msg.result);
      },
      fail: function (e) {
        //console.log(e);
        wx.showToast({
          title: '扫码失败',
        })
      }
    })
  },
  //输入标本箱条码 
  scanBox: function (e) {
    //console.log(e)
    var barCode = e.detail.value;
    this.getBarCode(barCode);


  },
  //根据条码 展示结果
  getBarCode: function (barCode) {
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
    wx.getLocation({
      success: function (res) {

        if (res) {
          This.setData({
            location: res.longitude + "," + res.latitude
          });


          var scanTime = getApp().getTime();
          //console.log(this.data.hospitalId);
          //console.log(this.data.workId);
          wx.request({
            url: getApp().globalData.url + '/sample/scanSampleBox',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: This.data.token,
              hospitalId: This.data.hospitalId,
              //scanTime: scanTime,
              barCode: barCode,//输入框输入的值
              workId: This.data.workId,
              location: This.data.location,
              boxProperty: "1"
            },

            success: function (msg) {
              if (msg.data.success) {
                wx.getStorage({
                  key: 'token',
                  success: function (res) {
                    // console.log(res.data);
                    // console.log(This.data.hospitalId);
                    // console.log(This.data.workId);
                    if (res.data) {
                      wx.request({
                        url: getApp().globalData.url + '/sample/initRecordBox',
                        data: {
                          token: res.data,
                          hospitalId: This.data.hospitalId,
                          workId: This.data.workId
                        },
                        success: function (data) {
                          //console.log(data);
                          This.setData({
                            barCode: data.data.data
                          });
                          //console.log("成功获取标本箱")
                        },
                        fail: function (msg) {

                          console.log(msg)
                        }
                      })
                    }
                  },
                })
              } else {
                wx.showToast({
                  title: msg.data.message,
                })
              }
            },
            fail: function (err) {
              // console.log(err);
              wx.showToast({
                title: err,
              })
            }
          })
        }
      },
    })
  },
  //点击条目 进入扫标本袋的界面
  samplesBag: function (e) {

    var barcode = e.currentTarget.dataset.barcode;
    var boxid = e.currentTarget.dataset.boxid;
    var recordid = e.currentTarget.dataset.recordid;
    var transportid = e.currentTarget.dataset.transportid;
    var samplesum = e.currentTarget.dataset.samplesum;

    wx.navigateTo({
      url: 'scanBag/scanBag?barcode=' + barcode + "&boxid=" +
      boxid + "&recordid=" + recordid + "&transportid=" + transportid +
      "&samplesum=" + samplesum + "&hospitalId=" + this.data.hospitalId,
    })
  },
  complete: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This = this;
    wx.getLocation({
      success: function (res) {
        This.setData({
          location: res.longitude + "," + res.latitude
        });
      },
    })
    this.setData({
      hospitalId: options.hospitalId,
      workId: options.workId,
      hosName:options.hosName
    })

    wx.getStorage({
      key: 'token',
      success: function (res) {
        // console.log(res.data);
        // console.log(This.data.hospitalId);
        // console.log(This.data.workId);
        This.setData({
          token: res.data
        });
        if (res.data) {
          wx.request({
            url: getApp().globalData.url + '/sample/initRecordBox',
            data: {
              token: res.data,
              hospitalId: This.data.hospitalId,
              workId: This.data.workId
            },
            success: function (data) {
              //console.log(data);
              This.setData({
                barCode: data.data.data
              });
              //console.log("成功获取标本箱")
            },
            fail: function (msg) {

              console.log(msg)
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
    var options = {
      hospitalId: this.data.hospitalId,
      workId: this.data.workId
    }
    this.onLoad(options)
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