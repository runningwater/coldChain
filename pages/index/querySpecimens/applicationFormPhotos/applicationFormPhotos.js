// pages/index/querySpecimens/applicationFormPhotos/applicationFormPhotos.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    photos: [],
    x: "",
    sampleid: "",//标本id
    lock: false
  },
  //预览图片
  prePic: function (e) {
    if (this.data.lock) {
      return false;
    }
    //console.log(e.currentTarget.dataset.file);
    var picArr = e.currentTarget.dataset.file;
    var current = e.currentTarget.dataset.current;
    var urls = [];
    for (var i = 0; i < picArr.length; i++) {
      urls.push(picArr[i].url)
    }
    wx.previewImage({
      current: current,
      urls: urls
    })
  },
  end1: function () {
    if (this.data.lock) {
      //开锁
      setTimeout(() => {
        this.setData({ lock: false });
      }, 100);
    }

  },
  delSampleApply: function (e) {
    var This = this;
    This.setData({
      lock: true//加锁
    })
    var attachId = e.currentTarget.dataset.attachid;
    wx.showModal({
      title: '删除申请单',
      content: '确认要删除此张申请单图片么？',
      success: function (confirm) {
        if (confirm.confirm) {
          wx.request({
            url: getApp().globalData.url + '/sample/deleteSampleApply',
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            data: {
              token: This.data.token,
              attachId: attachId,
              sampleId: This.data.sampleid
            },
            success: function (msg) {
             
              if (msg.data.success) {
                wx.showToast({
                  title: '删除成功',
                })
                wx.request({
                  url: getApp().globalData.url + '/sample/getApplySample',
                 
                  data: {
                    token: This.data.token,
                    sampleId: This.data.sampleid
                  },
                  success: function (msg) {
                    //console.log(msg)
                    if (msg.data.success) {
                      This.setData({
                        photos: msg.data.data
                      })
                    } else {
                      wx.showToast({
                        title: msg.data.message,
                      })
                    }
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
    var sampleid = options.sampleid;
    This.setData({
      sampleid: sampleid
    })
    wx.getStorage({
      key: 'token',
      success: function (res) {
        This.setData({
          token: res.data
        })
        if (res.data) {
          wx.request({
            url: getApp().globalData.url + '/sample/getApplySample',
            
            data: {
              token: res.data,
              sampleId: sampleid
            },
            success: function (msg) {
              //console.log(msg)
              if (msg.data.success) {
                This.setData({
                  photos: msg.data.data
                })
              } else {
                wx.showToast({
                  title: msg.data.message,
                })
              }
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