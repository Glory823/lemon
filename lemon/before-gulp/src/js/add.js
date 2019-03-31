require.config({
    paths: {
        "mui": "../js/libs/mui.min"
    }
})

require(["mui"], function(mui) {
    var timer = new Date();
    var year = timer.getFullYear();
    var month = timer.getMonth() + 1;
    var yearMonth = year + "-" + (month > 10 ? month : "0" + month);


    class Add {
        constructor() {
            this.tabLi = [...document.querySelectorAll(".center ul li")];
            this.numAdd = document.querySelector(".header .bottom span");
            this.mainTime = document.querySelector(".mainTime span");
            this.mainList = document.querySelector(".mainList ul");
            this.numTrue = document.querySelector(".numTrue");
            this.init();
        }

        init() {
            this.exitClick();
            this.tabClick();
            this.addClick();
            this.startTime();
            this.getClas();
            this.myListClick();
        }

        //点击返回
        exitClick() {
            mui(".header .top").on("tap", ".left i", function() {
                window.location.href = "../index.html";
            });
        }

        //tab切换
        tabClick() {
            var that = this;
            mui(".center ul").on("tap", "li", function() {
                for (var i = 0; i < that.tabLi.length; i++) {
                    that.tabLi[i].classList.remove("active");
                }
                this.classList.add("active");
                that.getClas();
            })
        }

        //计算器
        addClick() {
            var that = this;
            mui(".mainNum ul").on("tap", "li", function() {
                if (this.innerHTML == "×") {
                    that.numAdd.innerHTML = that.numAdd.innerHTML.length == 1 ? "0.00" : that.numAdd.innerHTML.substr(0, that.numAdd.innerHTML.length - 1);
                } else if (that.numAdd.innerHTML == "0.00") {
                    that.numAdd.innerHTML = this.innerHTML;
                } else if (that.numAdd.innerHTML.includes(".") && this.innerHTML == ".") {
                    that.numAdd.innerHTML = that.numAdd.innerHTML;
                } else if (that.numAdd.innerHTML.includes(".") && that.numAdd.innerHTML.split(".")[1].length == 2) {
                    that.numAdd.innerHTML = that.numAdd.innerHTML;
                } else {
                    that.numAdd.innerHTML += this.innerHTML;
                }
            })
        }

        //进入页面初始时间
        startTime() {
            this.mainTime.innerHTML = yearMonth;
        }

        //渲染页面
        getClas() {
            var that = this;
            const inc = document.querySelector(".center .active").innerHTML;
            mui.ajax('/api/classFind', {
                data: {
                    uli: localStorage.getItem("id"),
                    style: inc
                },
                dataType: 'json', //服务器返回json格式数据
                type: 'post', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒；
                success: function(data) {
                    that.render(data.data);
                    that.chooseStyle();
                }
            });
        }

        //渲染
        render(data) {
            var str = "";
            data.map(item => {
                str += `<li class="ico">
                            <p><i class="${item.icon}"></i></p>
                            <span>${item.intro}</span>
                        </li>`
            }).join("");
            str += `<li class="myList">
                        <p> <i class="mui-icon mui-icon-plusempty"></i></p>
                        <span>自定义</span>
                    </li>`;
            this.mainList.innerHTML = str;
        }

        //选择类型
        chooseStyle() {
            var that = this;
            var lis = [...document.querySelectorAll(".mainList ul li")];
            mui(".mainList ul").on('tap', 'li.ico', function() {
                for (var i = 0; i < lis.length; i++) {
                    lis[i].firstElementChild.classList.remove("active");
                }
                this.firstElementChild.classList.add("active");
                that.addBill();
            })

        }

        //添加数据类型
        addBill() {
            var that = this;
            var mainLi = document.querySelector(".mainList ul li.ico p.active");
            this.numTrue.addEventListener("tap", function() {
                const uli = localStorage.getItem("id");
                const icon = mainLi.firstElementChild.className;
                const style = mainLi.nextElementSibling.innerHTML;
                const income = document.querySelector(".center .active").innerHTML;
                const timer = that.mainTime.innerHTML;
                const money = that.numAdd.innerHTML;

                mui.ajax('/api/billInsert', {
                    data: {
                        uli,
                        icon,
                        style,
                        income,
                        timer,
                        money
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    success: function(data) {
                        mui.alert(data.msg, '提示', '确定', function(e) {
                            window.location.href = "../index.html";
                        })
                    }
                });
            });
        }


        //点击自定义
        myListClick() {
            mui(".mainList ul").on('tap', 'li.myList', function() {
                const income = document.querySelector(".center .active").getAttribute("data-income");
                this.tabLi = [...document.querySelectorAll(".center ul li")];
                this.firstElementChild.classList.add("active");
                window.location.href = "../page/ico.html?style=" + income;
            })
        }



    }

    var add = new Add();
})