// pages/index/feedBack/feedBack.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token:""
  },
  formSubmit:function(e){
    console.log(e.detail.value);
    var This = this;
    if (e.detail.value.title==""){
      wx.showModal({
        title: '请输入标题',
        content: '标题不允许为空',
      })
    } else if (e.detail.value.content == ""){
      wx.showModal({
        title: '请输入内容',
        content: '内容不允许为空',
      })
    }else{
      wx.request({
        url: getApp().globalData.url + '/feedBack/postFeedBack',
      
        data:{
          token:This.data.token,
          title: e.detail.value.title,
          content: e.detail.value.content
        },
        success:function(msg){
           // console.log(msg.data.success)
            if (msg.data.success){
              
              wx.showModal({
                  title: '提交成功',
                  content: '意见提交成功，感谢您对我们的支持',
                  success:function(confirm){
                        if(confirm.confirm){
                            wx.navigateBack({
                                delta: 1
                            })
                        }
                  }
              })
            
            }
        },
        fail:function(err){
          wx.showToast({
            title: '提交信息失败',
          })
        }
      })
    }

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var This = this;
    wx.getStorage({
      key: 'token',
      success: function(res) {
        if(res.data){
          This.setData({
            token:res.data
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