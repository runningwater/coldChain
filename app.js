//app.js
App({

  getTime:function(){
    var nowDate = new Date();
    var y = nowDate.getFullYear();
    var m = nowDate.getMonth() + 1;
    if(m<10){
      m = "0"+m;
    }
    var d = nowDate.getDate();
    if(d<10){
      d = "0"+d;
    }
    var h = nowDate.getHours();
    if (h < 10) {
      h = "0" + h;
    }
    var min = nowDate.getMinutes();
    if (min < 10) {
      min = "0" + min;
    }
    var s = nowDate.getSeconds();
    if (s < 10) {
      s = "0" + s;
    }
    var recevietime = y + "-" + m + "-" + d + " " + h + ":" + min + ":" + s;
    return recevietime;
  },
 hnToast:function(msg){
     wx.showToast({
         title: msg,
     })
 },
 snGet:function(url,data,successFun){
   wx.request({
     url: getApp().globalData.url + url,
     data:data,
     success:successFun,
     fail:function(){
       getApp().hnToast("无法获取数据，请检查网络");
     }
   })
 },
 snPost: function (url, data, successFun){
    wx.request({
      url: getApp().globalData.url + url,
      data: data,
      method:"POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: successFun,
      fail: function () {
        getApp().hnToast("无法获取数据，请检查网络");
      }
    })
 },

  globalData: {
    //url: "https://wl.ailabcare.com/framework-web/api/v1" //正式库
    url:"https://wx.ailabcare.com/framework-web/api/v1"//测试库
  }
})
var app = getApp();