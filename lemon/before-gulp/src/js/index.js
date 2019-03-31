require.config({
    paths: {
        "mui": "./libs/mui.min",
        "picker": "./libs/mui.picker.min",
        "poppicker": "./libs/mui.poppicker"
    },
    shim: {
        "picker": {
            "deps": ["mui"]
        },
        "poppicker": {
            "deps": ["mui"]
        }
    }
})


require(["mui", "picker", "poppicker"], function(mui, picker, poppicker) {

    var timer = new Date();
    var year = timer.getFullYear();
    var month = timer.getMonth() + 1;
    var yearMonth = year + "-" + (month > 10 ? month : "0" + month);

    class Index {
        constructor() {
            this.user = document.querySelector(".user");
            this.pwd = document.querySelector(".pwd");
            this.trueBtn = document.querySelector(".trueBtn");
            this.regBtn = document.querySelector(".regBtn");
            this.enter = document.querySelector(".enter");
            this.mainBody = document.querySelector(".mainBody");
            this.mainList = document.querySelector(".mainList");
            this.spend = document.querySelector(".header .center span");
            this.income = document.querySelector(".bottom .left span");
            this.getYearM = document.querySelector(".getYearM");
            this.getYm = document.querySelector(".getYm");
            this.add = document.querySelector(".footer .add");
            this.page = 1;
            this.pageSize = 6;
            this.init();
        }

        init() {
            this.storAge();
            this.clickTrue();
            this.clickReg();
            this.randerList();

            this.loading();

            this.leftDel();

            this.exitClick();

            this.startTime()

            this.timerClick();

            this.yearClick();

            this.addClick();
        }

        storAge() {
            if (localStorage.getItem("id")) {
                this.enter.classList.add("active");
                this.mainBody.classList.remove("active");
            } else {
                this.enter.classList.remove("active");
                this.mainBody.classList.add("active");
            }
        }


        //点击登录按钮
        clickTrue() {
            const that = this;
            this.trueBtn.addEventListener("tap", () => {
                mui.ajax('/api/login', {
                    data: {
                        name: this.user.value,
                        pwd: this.pwd.value
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    success: function(data) {
                        alert(data.msg);
                        if (data.code == 1) {
                            const id = data.data[0]._id;
                            window.localStorage.setItem("id", id);
                            that.enter.classList.add("active");
                            that.mainBody.classList.remove("active");
                        }
                    }
                });
            });
        }

        //点击注册按钮
        clickReg() {
            this.regBtn.addEventListener("tap", () => {
                mui.ajax('/api/register', {
                    data: {
                        name: this.user.value,
                        pwd: this.pwd.value
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    success: function(data) {
                        alert(data.msg);
                    }
                });
            });
        }

        //渲染列表
        randerList() {
            var _this = this;

            // console.log(this.getYearM.children[0].innerHTML)

            setTimeout(function() {
                mui.ajax('/api/billFind', {
                    data: {
                        uli: localStorage.getItem("id"),
                        page: x.page++,
                        pageSize: x.pageSize,
                        timer: x.getYearM.children[0].innerHTML
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    success: function(data) {
                        if (data.data.length === 0) {
                            mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
                        } else {
                            mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
                            x.rand(data.data)
                        }
                    }
                });
            }, 1500)
        }

        rand(data) {
            x.mainList.innerHTML += data.map(item => {
                return `<li class="mui-table-view-cell mui-transitioning mainListli">
                    <div class="mui-slider-right mui-disabled">
                        <a class="mui-btn mui-btn-red delBtn" style="transform: translate(0px, 0px);" data-id="${item._id}">删除</a>
                    </div>
                    <div class="mui-slider-handle list" style="transform: translate(0px, 0px);">
                        <div class="left"><i class=" ${item.icon}"></i> <span>${item.style}</span></div>
                        <div class="right" style="color:${item.income === "收入" ? 'green' :'red'}">${item.money}</div>
                    </div>
                </li>`
            }).join("");
            // this.redMoney = document.querySelectorAll(".mainListli .right[style='color:red']");
            // this.greenMoney = document.querySelectorAll(".mainListli .right[style='color:green']");

            this.total();
        }

        //上拉加载
        loading() {
            var that = this;
            mui.init({
                pullRefresh: {
                    container: '#pullrefresh',
                    down: {
                        // callback: pulldownRefresh
                    },
                    up: {
                        contentrefresh: '正在加载...',
                        contentnomove: '没有更多数据了',
                        callback: that.randerList
                    }
                }
            });
        }


        //左滑删除
        leftDel() {
            mui('#OA_task_1').on('tap', '.delBtn', function(event) {
                var elem = this;
                var li = elem.parentNode.parentNode;
                mui.confirm('确认删除该条记录？', "警告", ['确认', '取消'], function(e) {
                    if (e.index == 0) {
                        mui.ajax('/api/billRemove', {
                            data: {
                                id: elem.getAttribute("data-id")
                            },
                            dataType: 'json', //服务器返回json格式数据
                            type: 'post', //HTTP请求类型
                            timeout: 10000, //超时时间设置为10秒；
                            success: function(data) {
                                mui.alert(data.msg, '提示', '确定', function() {
                                    li.remove();
                                })
                            }
                        });
                    } else {
                        setTimeout(function() {
                            mui.swipeoutClose(li);
                        }, 0);
                    }
                });
            });
        }

        //	点击退出
        exitClick() {
            var that = this;
            mui(".footer ul").on('tap', '.exit', function() {
                that.enter.classList.remove("active");
                that.mainBody.classList.add("active");
                window.localStorage.removeItem("id");
            });
        }

        //计算总计
        total() {
            var that = this;
            this.redMoney = [...document.querySelectorAll(".mainListli .right[style='color:red']")];
            this.greenMoney = [...document.querySelectorAll(".mainListli .right[style='color:green']")];
            //支出
            if (this.redMoney.length) {
                var spendAll = 0;
                this.redMoney.forEach(item => {
                    spendAll += item.innerHTML * 1;
                })
                this.spend.innerHTML = spendAll
            } else {
                this.spend.innerHTML = 0;
            }

            //收入
            if (this.greenMoney.length) {
                var incomeAll = 0;
                this.greenMoney.forEach(item => {
                    incomeAll += item.innerHTML * 1;
                })
                this.income.innerHTML = incomeAll
            } else {
                this.income.innerHTML = 0;
            }
        }


        //页面开始时的初试时间
        startTime() {
            this.getYearM.children[0].innerHTML = yearMonth;
        }

        //点击时间改变事件
        timerClick() {
            var dtPicker = new mui.DtPicker({ "type": "month" });
            this.getYearM.addEventListener("tap", function() {

                var that = this;

                x.yearTit = document.querySelector("h5[data-id='title-y']");
                x.monthTit = document.querySelector("h5[data-id='title-m']");

                x.yearUl = document.querySelector("div[data-id='picker-y']");
                x.monthUl = document.querySelector("div[data-id='picker-m']");

                if (x.getYm.children[0].innerHTML == "年") {

                    x.yearTit.style.width = "100%";
                    x.yearUl.style.width = "100%";

                    x.monthTit.style.display = "none";
                    x.monthUl.style.display = "none";

                } else {

                    x.yearTit.style.width = "50%";
                    x.yearUl.style.width = "50%";

                    x.monthTit.style.display = "inline-block";
                    x.monthUl.style.display = "inline-block";
                }

                dtPicker.show(function(selectItems) {
                    // selectItems.y//{text: "2019", value: 2019}
                    if (x.getYm.children[0].innerHTML == "年") {
                        that.children[0].innerHTML = selectItems.y.value;
                    } else {
                        that.children[0].innerHTML = selectItems.y.value + "-" + selectItems.m.value;
                        // yearMonth = selectItems.y.value + "-" + selectItems.m.value;
                    }
                    x.page = 1;
                    x.randerList();

                })
            })
        }

        //点击年月
        yearClick() {
            var userPicker = new mui.PopPicker();
            userPicker.setData([{
                value: '1',
                text: '年'
            }, {
                value: '2',
                text: '月'
            }])
            this.getYm.addEventListener("tap", function() {
                var that = this;
                userPicker.show(function(items) {
                    that.children[0].innerHTML = items[0].text;
                    if (items[0].value == 1) {
                        x.getYearM.children[0].innerHTML = year;
                    } else {
                        x.getYearM.children[0].innerHTML = yearMonth;
                    }
                    x.page = 1;
                    x.randerList();

                });
            })
        }

        //点击加号  跳转页面  添加数据
        addClick() {
            var that = this;
            this.add.addEventListener("tap", function() {
                window.location.href = "./page/add.html";
            });
        }


    }
    var x = new Index();
})