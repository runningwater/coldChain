// pages/index/myTask/receiveSamples/scan/scanBag/samples/samples.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    bag: "",//标本袋
    bagid: "",//标本袋id
    hospitalId: "",//医院id
    recordid: "",//标本箱记录id
    transportid: "",//运输表id
    code: "",
    location: "",//经纬度
    bagNum: 0,
    barCode: [],
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
        l: e.currentTarget.dataset.sampleid,
        flag: false
      })
    }

  },
  delSample:function(e){
    var This = this;
   
      var sampleId = e.currentTarget.dataset.sampleid;
      wx.showModal({
        title: '确认删除？',
        content: '确定要移除此标本吗？',
        success: function (confirm) {
          if (confirm.confirm) {
            wx.request({
              url: getApp().globalData.url + '/sample/removeSample',
              method: "POST",
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              data: {
                token: This.data.token,
                sampleId: sampleId
              },
              success: function (msg) {
                if (msg.data.success) {
                  wx.showToast({
                    title: msg.data.message,
                  })

                  wx.request({
                    url: getApp().globalData.url + '/sample/getSample',
                    data: {
                      token: This.data.token,
                      bagId: This.data.bagid,
                      recordId: This.data.recordid,
                      hospitalId: This.data.hospitalId
                    },
                    success: function (msg) {
                      //console.log(msg)
                      This.setData({
                        barCode: msg.data.data,
                        bagNum: msg.data.data.length
                      })
                    },
                    fail: function (err) {
                      console.log(err)
                    }
                  })
                }
              }
            })

          }
        }
      })

  },

  takePhoto: function (e) {

    var This = this;
    var sampleId = e.currentTarget.dataset.sampleidone;
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
              This.init();
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
  //扫描标本
  scanCode: function () {
    var This = this;
    wx.scanCode({

      success: function (msg) {
        console.log(msg)

        var sampleCode = msg.result;

        wx.getStorage({
          key: 'token',
          success: function (res) {
            if (res.data) {
              wx.request({
                url: getApp().globalData.url + '/sample/scanSample',
                method: "POST",
                header: {
                  "Content-Type": "application/x-www-form-urlencoded"
                },
                data: {
                  token: res.data,
                  bagId: This.data.bagid,
                  // scanTime: scanTime,
                  recordId: This.data.recordid,
                  hospitalId: This.data.hospitalId,
                  barCode: sampleCode,
                  location: This.data.location,
                  transportId: This.data.transportid
                },
                success: function (msg) {
                  // console.log(msg)
                  This.setData({
                    barCode: msg.data.data
                  });
                  wx.getStorage({
                    key: 'token',
                    success: function (res) {
                      if (res.data) {
                        This.setData({
                          token: res.data
                        })
                        wx.request({
                          url: getApp().globalData.url + '/sample/getSample',
                          data: {
                            token: This.data.token,
                            bagId: This.data.bagid,
                            recordId: This.data.recordid,
                            hospitalId: This.data.hospitalId
                          },
                          success: function (msg) {
                            // console.log(msg)
                            This.setData({
                              barCode: msg.data.data,
                              bagNum: msg.data.data.length
                            })
                          },
                          fail: function (err) {
                            console.log(err)
                          }
                        })
                      }
                    },
                  })
                },
                fail: function (err) {
                  console.log(err);
                }
              })
            }
          },
        })
      },
      fail: function (e) {
        console.log(e)
      }
    })
  },
  //录入标本号
  scanSimple: function (e) {
    var This = this;
    var sampleCode = e.detail.value;
    var scanTime = getApp().getTime();

    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          wx.request({
            url: getApp().globalData.url + '/sample/scanSample',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: res.data,
              bagId: This.data.bagid,
              // scanTime: scanTime,
              recordId: This.data.recordid,
              hospitalId: This.data.hospitalId,
              barCode: sampleCode,
              location: This.data.location,
              transportId: This.data.transportid
            },
            success: function (msg) {

              if (msg.data.success) {
                This.setData({
                  barCode: msg.data.data
                });
                wx.getStorage({
                  key: 'token',
                  success: function (res) {
                    if (res.data) {
                      This.setData({
                        token: res.data
                      })
                      wx.request({
                        url: getApp().globalData.url + '/sample/getSample',
                        data: {
                          token: This.data.token,
                          bagId: This.data.bagid,
                          recordId: This.data.recordid,
                          hospitalId: This.data.hospitalId
                        },
                        success: function (msg) {
                          // console.log(msg)
                          This.setData({
                            barCode: msg.data.data,
                            bagNum: msg.data.data.length
                          })
                        },
                        fail: function (err) {
                          console.log(err)
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
              console.log(err);
            }
          })
        }
      },
    })
  },
  //完成
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
        })
      },
    })

    This.setData({
      bagid: options.bagid,
      hospitalId: options.hospitalId,
      recordid: options.recordid,
      bag: options.bag,
      transportid: options.transportid
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        if (res.data) {
          This.setData({
            token: res.data
          })
          This.init();
        }
      },
    })

  },
  init: function () {
    var This = this;
    wx.request({
      url: getApp().globalData.url + '/sample/getSample',
      data: {
        token: This.data.token,
        bagId: This.data.bagid,
        recordId: This.data.recordid,
        hospitalId: This.data.hospitalId
      },
      success: function (msg) {
        if (msg.data.data.length > 0) {
          This.setData({
            barCode: msg.data.data,
            bagNum: msg.data.data.length
          })

        } else {
          //getApp().hnToast("暂无数据")
        }

      },
      fail: function (err) {
        console.log(err)
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