// pages/index/myTask/receiveSamples/tackPic/tackPic.js
var app = getApp()
Page({

  /**
   * 页面的初始数据 
   * 触发事件顺序longtap -> touchend -> tap
   */
  data: {
    x: "",//缩略图宽
    token: "",
    hospitalId: "",
    workId: "",
    filePaths: [],
    lock: false//锁
  },
  //拍照上传
  takePic: function () {
    var That = this;
    wx.chooseImage({
      count: 9,
      sizeType: ["original", "compressed"],
      sourceType: ["album", "camera"],
      success: function (res) {

        That.setData({
          filePaths: res.tempFilePaths
        })
        //console.log(That.data.filePaths)
        for (var i = 0; i < That.data.filePaths.length; i++) {
          wx.uploadFile({
              url: getApp().globalData.url + '/sample/uploadSampleDelivery',
            filePath: That.data.filePaths[i],
            name: 'pic' + i,
            formData: {
              token: That.data.token,
              workId: That.data.workId,
              hospitalId: That.data.hospitalId,
              deliveryFile: "aaa"
            },
            success: function (msg) {
            
              var data = JSON.parse(msg.data);
              if (data.success) {
                wx.showToast({
                  title: '交接单上传成功',
                })
                wx.request({
                  url: getApp().globalData.url + '/sample/getDeliveryList',
                  method: "GET",

                  data: {
                    token: That.data.token,
                    workId: That.data.workId,
                    hospitalId: That.data.hospitalId
                  },
                  success: function (msg) {
                   
                    That.setData({
                      filePaths: msg.data.data
                    })
                  },
                  fail: function (err) {
                    console.log(err)
                  }
                })
              } else {
                wx.showToast({
                  title: '交接单上传失败',
                })
              }
            },
            fail: function (err) {
              console.log(err)
            }
          })
        }
      },
    })
  },
  //删除交接单
  delPic: function (e) {

   // console.log(e)
    var This = this;
    This.setData({
      lock: true//加锁
    })
    var deliveryId = e.currentTarget.dataset.deliveryid;
    var attachId = e.currentTarget.dataset.attachid;
    wx.showModal({
      title: '删除图片',
      content: '确认要删除这张图片么？',
      success: function (confirm) {
        if (confirm.confirm) {
          wx.request({
              url: getApp().globalData.url + '/sample/removeDelivery',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: This.data.token,
              deliveryId: deliveryId,
              attachId: attachId
            },
            success: function (msg) {
              console.log(msg)
              if (msg.data.success) {
                wx.showToast({
                  title: '删除成功',
                })
                wx.request({
                  url: getApp().globalData.url + '/sample/getDeliveryList',
                  method: "GET",

                  data: {
                    token: This.data.token,
                    workId: This.data.workId,
                    hospitalId: This.data.hospitalId
                  },
                  success: function (msg) {
                    console.log(msg)
                    This.setData({
                      filePaths: msg.data.data
                    })
                  },
                  fail: function (err) {
                    console.log(err)
                  }
                })

              } else {
                wx.showToast({
                  title: '删除失败',
                })
              }
            }
          })
        }
      }
    })

  },
  end: function () {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({ lock: false });
      }, 100);
    }

  },
  //预览图片
  prePic: function (e) {
    if (this.data.lock) {
      return;
    }
    console.log(e.currentTarget.dataset.file);
    var picArr = e.currentTarget.dataset.file;
    var current = e.currentTarget.dataset.current;
    var urls = [];
    for (var i = 0; i < picArr.length; i++) {
      urls.push(picArr[i].imgURL)
    }
    wx.previewImage({
      current: current,
      urls: urls
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This = this;
    wx.getSystemInfo({
      success: function (res) {
        var width = parseInt(res.screenWidth);
        console.log(width)
        This.setData({
          x: (width - 32) / 4
        })
      },
    })

    this.setData({
      hospitalId: options.hospitalId,
      workId: options.workId
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        This.setData({
          token: res.data
        })
        wx.request({
          url: getApp().globalData.url + '/sample/getDeliveryList',
          method: "GET",

          data: {
            token: This.data.token,
            workId: This.data.workId,
            hospitalId: This.data.hospitalId
          },
          success: function (msg) {
            console.log(msg)
            This.setData({
              filePaths: msg.data.data
            })
          },
          fail: function (err) {
            console.log(err)
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
    var This = this;
    wx.request({
      url: getApp().globalData.url + '/sample/getDeliveryList',
      method: "GET",

      data: {
        token: This.data.token,
        workId: This.data.workId,
        hospitalId: This.data.hospitalId
      },
      success: function (msg) {
        console.log(msg)
        This.setData({
          filePaths: msg.data.data
        })
      },
      fail: function (err) {
        console.log(err)
      }
    })
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