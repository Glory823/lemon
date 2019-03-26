require.config({
    paths: {
        "mui": "./libs/mui.min"
    }
})


require(["mui"], function(mui) {
    class Index {
        constructor() {
            this.user = document.querySelector(".user");
            this.pwd = document.querySelector(".pwd");
            this.trueBtn = document.querySelector(".trueBtn");
            this.regBtn = document.querySelector(".regBtn");
            this.enter = document.querySelector(".enter");
            this.mainBody = document.querySelector(".mainBody");
            this.mainList = document.querySelector(".mainList");
            this.page = 1;
            this.pageSize = 3;
            this.init();
        }

        init() {
            var that = this;
            this.storAge();
            this.clickTrue();
            this.clickReg();
            this.randerList();

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

            this.leftDel();

            this.exitClick();
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
            setTimeout(function() {
                    mui.ajax('/api/billFind', {
                        data: {
                            uli: localStorage.getItem("id"),
                            page: x.page++,
                            pageSize: x.pageSize
                        },
                        dataType: 'json', //服务器返回json格式数据
                        type: 'post', //HTTP请求类型
                        timeout: 10000, //超时时间设置为10秒；
                        success: function(data) {
                            if (data.data.length === 0) {
                                console.log(data.data)
                                mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
                            } else {
                                mui("#pullrefresh").pullRefresh().endPullupToRefresh(false);
                                x.rand(data.data)
                            }

                        }
                    });
                }, 1500)
                // this.page++;
        }

        rand(data) {
            x.mainList.innerHTML += data.map(item => {
                return `<li class="mui-table-view-cell mui-transitioning mainListli">
							<div class="mui-slider-right mui-disabled">
								<a class="mui-btn mui-btn-red delBtn" style="transform: translate(0px, 0px);" data-id="${item._id}">删除</a>
							</div>
							<div class="mui-slider-handle list" style="transform: translate(0px, 0px);">
								<div class="left"><i class="iconfont ${item.icon}"></i> <span>${item.style}</span></div>
								<div class="right" style="color:${item.income === "收入" ? 'green' :'red'}">${item.money}</div>
							</div>
						</li>`
            }).join("");
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

        exitClick() {
            var that = this;
            mui(".footer ul").on('tap', '.exit', function() {
                that.enter.classList.remove("active");
                that.mainBody.classList.add("active");
                window.localStorage.removeItem("id");
            });
        }




    }
    var x = new Index()
})