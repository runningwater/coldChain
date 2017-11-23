
Page({
  data: {

    userName: "cswork",
    pwd: "123456",

  },
  //事件处理函数
  bindName: function (e) {
    this.data.userName = e.detail.value
  },
  bindPwd: function (e) {
    this.setData({
      pwd: e.detail.value
    });
  },
  //忘记密码
  forgetPwd: function () {
    wx.showModal({
      title: '忘记密码？',
      content: '请联系系统管理员',
    })
  },
  login: function () { 
    var That = this;
    wx.login({
      success: function (e) {
        wx.getUserInfo({
          success: function (msg) {           
            getApp().snGet('/wxApp/getUser',{
                            code: e.code,
                            userId: That.data.userName,
                            pwd: That.data.pwd,
                            nickName: msg.userInfo.nickName
                        },
              function (e) {
                //登录成功的回调            
                if (e.data.success) {
                  getApp().snGet('/item/getApplyItem', { token: e.data.data.token }, function (res) {
                    wx.setStorage({
                      key: 'item',
                      data: res.data.data,
                    })
                  });
                  wx.setStorage({
                    key: 'token',
                    data: e.data.data.token,
                  })
                  wx.redirectTo({
                    url: '../index/index?usertype=' + e.data.data.userType,
                  })
                } else {
                  wx.showToast({
                    title: e.data.message,
                  })
                }
              });          
          }
        })
      }
    })
  }

})
