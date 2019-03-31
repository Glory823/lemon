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


    class Ico {
        constructor() {
            this.mainList = document.querySelector(".mainList ul");
            this.hbIco = document.querySelector(".header .bottom .left i");
            this.hbInput = document.querySelector(".header .bottom .right input");
            this.init();
        }

        init() {
            this.exitClick();
            this.getIco();
            this.diffClick();
            this.trueBtn();
        }

        //点击返回
        exitClick() {
            mui(".header .top").on("tap", ".left i", function() {
                window.location.href = "../page/add.html";
            });
        }

        //渲染页面
        getIco() {
            var that = this;
            mui.ajax('/api/findIcon', {
                dataType: 'json', //服务器返回json格式数据
                type: 'post', //HTTP请求类型
                timeout: 10000, //超时时间设置为10秒；
                success: function(data) {
                    // console.log(data)
                    that.rendon(data.data);
                }
            });
        }

        //渲染
        rendon(data) {
            this.mainList.innerHTML = data.map(item => {
                return `<li>
                            <p><i class="${item.icon}"></i></p>
                        </li>`
            }).join("");
        }

        //点击选择不同
        diffClick() {
            var that = this;
            mui(".mainList ul").on('tap', 'li', function() {
                var cls = this.children[0].children[0].className;
                that.hbIco.className = cls;
            })
        }

        //点击保存
        trueBtn() {
            var that = this;
            mui(".footer").on('tap', '.btn', function() {
                console.log();
                mui.ajax('/api/classInsert', {
                    data: {
                        uli: localStorage.getItem("id"),
                        icon: add.hbIco.className,
                        style: window.location.search.slice(7),
                        intro: add.hbInput.value
                    },
                    dataType: 'json', //服务器返回json格式数据
                    type: 'post', //HTTP请求类型
                    timeout: 10000, //超时时间设置为10秒；
                    success: function(data) {
                        mui.alert(data.msg, '提示', '确定', function(e) {
                            window.location.href = "../page/add.html";
                        })
                    }
                });
            })
        }


    }

    var add = new Ico();
})