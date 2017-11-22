
Page({
  data: {
    userName: "",
    pwd: "",
    remeberPwd: false
  
  },
  //事件处理函数
  bindName: function (e) {
    this.data.userName = e.detail.value
  },
  bindPwd: function (e) {
    this.setData({
      pwd: e.detail.value
    }
    );
  },
  select: function (e) {
    this.setData({
      remeberPwd: e.detail.value
    }
    );
  },

  //忘记密码
  forgetPwd: function () {
    wx.showModal({
      title: '忘记密码？',
      content: '请联系系统管理员',
    })
  },
  login: function () {
    /*wx.navigateTo({
      url: '../index/index',
    })*/
    var That = this;

    wx.login({
      success: function (e) {
        wx.getUserInfo({
          success: function (msg) {
            // console.log(msg);
            wx.request({
              url: getApp().globalData.url + '/wxApp/getUser',
              data: {
                code: e.code,
                userId: That.data.userName,
                pwd: That.data.pwd,
                nickName: msg.userInfo.nickName
                // deviceType:1,
                // clientId:1
              },
              success: function (e) {
                //登录成功的回调
                //console.log(e);
                if (e.data.success) {
                  wx.setStorage({
                    key: 'token',
                    data: e.data.data.token,
                  })
                  wx.redirectTo({
                    url: '../index/index?usertype=' + e.data.data.userType,
                  })
                } else {
                  //console.log(e.data.message);
                  wx.showToast({
                    title: e.data.message,
                  })
                }


              },
              fail: function (msg) {

                wx.showModal({
                  title: '',
                  content: msg.errMsg,
                })
              }
            })
          }
        })


      }
    })
  }

})
