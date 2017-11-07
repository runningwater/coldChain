Page({

  /**
   * 页面的初始数据
   */
  data: {
    type1: false,
    type2: false,
    type3: false,
    type4: false,   
    type5:false ,
    type6:false
  },
  //我的任务
  myTask:function(){
    wx.getStorage({
      key: 'token',
      success: function(res) {       
        wx.navigateTo({
          url: 'myTask/myTask',
        })
      },
    })
    
  },
  //领取标本箱
  sampleBox:function(){
   
    wx.navigateTo({
      url: 'sampleBox/sampleBox',
    })
  },
  //标本查询
  querySpecimens: function () {
   
    wx.navigateTo({
      url: 'querySpecimens/querySpecimens',
    })
  },
  //标本装箱
  samplePacking: function () {
   
    wx.navigateTo({
      url: 'samplePacking/samplePacking',
    })
  },
  //工作日志
  jobLog: function () {
   
    wx.navigateTo({
      url: 'jobLog/jobLog',
    })
  },
  //标本拆箱
  specimensSplit: function () {
   
    wx.navigateTo({
      url: 'specimensSplit/specimensSplit',
    })
  },
  //我的运单
  myWayBill: function () {
    
    wx.navigateTo({
      url: 'myWayBill/myWayBill',
    })
  },
  //提货单
  billOfLoding: function () {
   
    wx.navigateTo({
      url: 'billOfLoding/billOfLoding',
    })
  },
  //通知公告
  announcements: function () {
   
    wx.navigateTo({
      url: 'announcements/announcements',
    })
  },
  //意见反馈
  feedBack: function () {
   
    wx.navigateTo({
      url: 'feedBack/feedBack',
    })
  },
  //服务手册
  serviceManual: function () {
  
    wx.navigateTo({
      url: 'serviceManual/serviceManual',
    })
  },
  //接收员问题处理
  jsproblemSolving: function () {

    wx.navigateTo({
      url: 'jsproblemSolving/jsproblemSolving',
    })
  },
  //打包员问题处理
  dbproblemSolving: function () {

    wx.navigateTo({
      url: 'dbproblemSolving/dbproblemSolving',
    })
  },
  audit:function(){
    wx.navigateTo({
      url: 'audit/audit',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      //console.log(options.usertype)
      var This = this;
      switch (options.usertype){
          case "1":
            This.setData({
                type1: true,
                type2: false,
                type3: false,
                type4: false,
                type5: false ,
                type6: false
            });
            break;
          case "2":
              This.setData({
                  type1: false,
                  type2: true,
                  type3: false,
                  type4: false,
                  type5: false,
                  type6: false
              });
              break;
          case "3":
              This.setData({
                  type1: false,
                  type2: false,
                  type3: true,
                  type4: false,
                  type5: false,
                  type6: false
              });
              break;
          case "4":
              This.setData({
                  type1: false,
                  type2: false,
                  type3: false,
                  type4: true,
                  type5: false,
                  type6: false
              });
              break;
          case "5":
              This.setData({
                  type1: false,
                  type2: false,
                  type3: false,
                  type4: false,
                  type5: true,
                  type6: false
              });
              break;
          case "6":
              This.setData({
                type1: false,
                type2: false,
                type3: false,
                type4: false,
                type5: false,
                type6: true
              });
          break;
        default:
         getApp().hnToast("您没有权限，请联系管理员");
        break;
      }
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
  onShareAppMessage: function (res) {
    //consoleconsole.log(res);
    return {
      title: '自定义转发标题',
      path: '/page/user?id=123',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})