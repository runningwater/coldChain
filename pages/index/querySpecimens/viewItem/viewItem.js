// pages/index/querySpecimens/viewItem/viewItem.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:'',
    sampleId:"",//标本ID
    itemArr:[]//已选项目集合
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This=this;
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
          console.log(res.data)
          wx.request({
            url: getApp().globalData.url + '/item/getSampleApplyItem',

            data: {
              token: res.data,
              sampleId: sampleid
            },
            success: function (msg) {
              console.log(msg)
              if (msg.data.success) {
                
                This.setData({
                  itemArr: msg.data.data
                })
                
                console.log(msg.data.data)
              }
            }
          })
        }
      },
    })
  },
  // viewItem: function (e) {
  //   var This=this;
  //   getApp().snGet('/item/getSampleApplyItem', {
  //     token: This.data.token,
  //     sampleId: e.target.dataset.sampleid,
  //   },
  //     function (msg) {
  //       console.log(msg.data.data)
  //       var alreadyItem = "";//临时已选项目 字符串
  //       for (let i = 0; i < msg.data.data.length; i++) {
  //         alreadyItem += msg.data.data[i].applyItemName + ",";
  //       }
  //       alreadyItem = alreadyItem.substr(0, alreadyItem.length - 1);
  //       console.log(alreadyItem)

  //     })
  // },
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