// pages/index/myWayBill/wayBill/wayBill.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        flag1: false,//运输方式1
        flag2: false,//运输方式2
        flag3: false,//运输方式3,
        transportType: "",//运输方式
        fromAddress: "",//出发地
        destiation: "",//到达地
        contact: "",//联系方式
        nowtime: "",//预计达到时间estimateTime
        carSN: "",//车牌号
        flightSN: "",//航班号
        addr: "",//接受地 receiveId
        expressCompany: "",//快递公司
        remark: "无",//备注
        barcode:""
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
       
        var This = this;     
    
         var bill = JSON.parse(options.bill);
         //console.log(bill)
        if (bill.transportType == "1") {
            This.setData({
                flag1: true,
                flag2: true,
                flag3: false,
                transportType: bill.transportName,
                fromAddress: bill.fromAddress,//出发地
                destiation: bill.destiation,//到达地
                contact: bill.contact,//联系方式
                nowtime: bill.estimateTime,//预计达到时间estimateTime
                carSN: bill.carSn,//车牌号
                flightSN: bill.flightSn,//航班号
                addr: bill.addressName, //接受地              
                remark: bill.remark,//备注
                barcode: bill.barCode
            });
        } else if (bill.transportType == "2") {
            This.setData({
                flag1: false,
                flag2: false,
                flag3: true,
                transportType: bill.transportName,
                fromAddress: bill.fromAddress,//出发地
                destiation: bill.destiation,//到达地
                contact: bill.contact,//联系方式
                nowtime: bill.estimateTime,//预计达到时间estimateTime            
                expressCompany: bill.expressCompany,//快递公司
                remark: bill.remark,//备注
                barcode: bill.barCode
            });
        } else {
            This.setData({
                flag1: true,
                flag2: false,
                flag3: false,
                transportType: bill.transportName,
                fromAddress: bill.fromAddress,//出发地
                destiation: bill.destiation,//到达地
                contact: bill.contact,//联系方式
                nowtime: bill.estimateTime,//预计达到时间estimateTime
                carSN: bill.carSn,//车牌号            
                remark: bill.remark,//备注
            });
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
    onShareAppMessage: function () {

    }
})