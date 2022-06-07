; (function () {
  var activePage = {
    phoneValidLength: 10,
    // 初始化方法
    init: function () {
      var that = activePage;
      that.initSwiper()
      that.initDomEvent()
      that.initActiveOn()
      that.initIPSelect()
      that.initActivityProgress()
      that.initSelectItem()
    },
    // 初始化滑块
    initSwiper: function () {
      var roleSwiper = new Swiper('#role-swiper-container', {
        loop: true,
        pagination: '.swiper-pagination',
        nextButton: '.role-swiper-button-next',
        prevButton: '.role-swiper-button-prev',
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
        effect : 'fade',
        fade: {
          crossFade: true,
        }
      })
      var newsSwiper = new Swiper('.news-swiper-container', {
        loop: true,
        pagination: '.swiper-pagination',
        autoplay: 2000,
        autoplayDisableOnInteraction: false,
      })
    },
    // 初始化ip位置 更新坐标
    initIPSelect: function () {
      var that = activePage;
      var val = '65';
      var valText = '新加坡 +65';
      $.ajax({
        type: "get",
        url: "./config/index2.php?action=iplookup",
        success: function (e) {
          var isocode = JSON.parse(e).isocode;
          var spaceData = that.validSpaceData(isocode)
          val = spaceData.val
          valText = spaceData.valText
          $(".J-select-value").html(valText);
          $("input[name='area']").val(val);
          $('.J-select-option-list .list').removeClass("active");
          $('.J-select-option-list .list[data-value="' + val + '"]').addClass("active");
          that.setValidLength(val);
        },
        error: function () {
          $(".J-select-value").html(valText);
          $("input[name='area']").val(val);
          $('.J-select-option-list .list').removeClass("active");
          $('.J-select-option-list .list[data-value="' + val + '"]').addClass("active");
          that.setValidLength(val);
        }
      })
    },
    // 处理地区数据
    validSpaceData(isocode){
      // spaceCode 由 /js/space.js 变量引入
      return spaceCode.find(function(item){
        return item.isocode == isocode
      })
    },
    // 初始化活动的开始与结束和Facebook链接
    initActiveOn: function () {
      if (!activityOn) {
        $(".dialog.dialog-is-over").show();
      }
      if (facebookLink) {
        $(".btn.f").prop("href", facebookLink)
        $(".J-form-facebook a").prop("href", facebookLink)
      }
    },
    // 设置活动进度 与 侧边栏
    initActivityProgress: function () {
      return;
      if (!activityProgress) {
        $(".default-list .list").removeClass("active");
      } else {
        if (activityProgress == 4) {
          $(".default-list .list").addClass("active");
        } else if (activityProgress == 5) {
          $(".default-list .list").addClass("active");
          $(".max-list .list").addClass("active");
        } else {
          $(".default-list .list").removeClass("active");
          $(".default-list .list").eq(activityProgress).prevAll(".list").addClass("active");
        }
      }
      var cwidth = document.documentElement.clientWidth
      if (cwidth < 1400) {
        $(".J-section-navigation").addClass("closed")
      }
    },
    // 初始化各种Dom事件
    initDomEvent: function () {
      console.log('init')
      var that = this;
      // 导航的关闭按钮
      $(".J-nav-close").on("click", function () {
        $(".J-section-navigation").toggleClass("closed");
      })
      // dialog的关闭按钮
      $(".J-dialog-close").on("click", function () {
        $(this).parents(".J-dialog").hide();
      })
      // dialog点击任意位置关闭弹窗
      $(".J-dialog").on("click", function (e) {
        if (!$(e.target).closest(".content").length) {
          $(".J-dialog").hide();
        }
      })
      // dialog开启按钮
      $(".J-dialog-show").on("click", function () {
        var diaName = $(this).attr("data-name")
        $(".J-dialog.dialog-" + diaName).show()
      })
      // J-secect-btn
      $(".J-secect-btn").on("click", function () {
        $(".J-select-option-list").toggle();
      });
      // secect-list 点击事件
      $(".J-select-option-list").on("click",'.list', function () {
        $(".J-select-option-list").hide();
        $(".J-select-option-list .list").removeClass("active");
        $(".J-select-value").html($(this).html())
        $("input[name='area']").val($(this).attr("data-value"))
        $(this).addClass("active");
        that.setValidLength($(this).attr("data-value"));
      });
      // 点击任意地方 关闭目标弹窗
      $("body").click(function (e) {
        if (!$(e.target).closest(".J-secect-btn,.J-select-option-list").length) {
          $(".J-select-option-list").hide();
        }
      });
      // 过滤只能输入数字
      $('input[name="phone"]').on('input', function () {
        this.value = this.value.replace(/[^\d]/g, '');
      });
      // 发送验证码功能
      $('.J-code-btn').on('click', function () {
        that.sendValidCode()
      })
      // 立即登录功能
      $('.J-submit-btn').on('click', function () {
        that.submitPhone()
      })
      $(document).on("scroll", function () {
        var dHeight = document.documentElement.clientHeight;
        var sTop = $(document).scrollTop();
        if (sTop > dHeight) {
          $(".J-go-top").fadeIn();
          $(".slide-right").fadeIn();
        } else {
          $(".J-go-top").fadeOut();
          $(".slide-right").fadeOut();
        }
      })
      $(".J-go-top").on("click", function () {
        $("html,body").animate({
          scrollTop: 0
        }, 500);
      })
      $(".J-banner-btn").on("click", function () {
        $("html,body").animate({
          scrollTop: 1046
        }, 500);
      })
      // 新闻页面标题点击
      $(".J-list-title-item").on("click", function () {
        $(this).addClass("active").siblings().removeClass("active");
        var cindex = $(this).data("index")
        $(".J-list-content").hide()
        $(".J-list-content[data-index='" + cindex + "']").show()
      })
    },
    // 表单验证通用弹窗
    showDialog: function (e) {
      e ? e : e = "輸入的手機號碼/驗證碼不正確！"
      $(".dialog-phone").show()
      $(".dialog-phone .J-dialog-phone-text").html(e)
    },
    // 发送验证码功能
    sendValidCode: function () {
      var that = activePage;
      var phoneNumber = $('input[name="phone"]').val();
      if (phoneNumber == '') {
        return that.showDialog("輸入的手機號碼不能為空");
      }
      if (phoneNumber.length != that.phoneValidLength && that.phoneValidLength != 99) {
        return that.showDialog("輸入的手機號碼錯誤！");
      }
      var _data = $("form").serialize();
      $('.J-code-btn').prop("disabled", true)
      $.ajax({
        type: "get",
        url: "./config/index2.php?action=setphone",
        data: _data,
        success: function (e) {
          var result = JSON.parse(e).result;
          if (result == 1) {
            that.showDialog("驗證碼已發送！");
          } else if (result == -2) {
            that.showDialog("該手機號已經成功預約。");
          } else {
            that.showDialog("簡訊發送失敗");
          }
          $('.J-code-btn').prop("disabled", false)
        },
        error: function () {
          $('.J-code-btn').prop("disabled", false)
          that.showDialog("簡訊發送失敗");
        }
      })
    },
    // 立即登录功能
    submitPhone: function () {
      var that = activePage;
      var phoneNumber = $('input[name="phone"]').val();
      var codeNumber = $('input[name="code"]').val();
      if (phoneNumber == '' || codeNumber == '') {
        return that.showDialog("輸入的手機號碼/驗證碼不正確！");
      }
      $('.J-submit-btn').prop("disabled", true);
      var _data = $("form").serialize();
      $.ajax({
        type: "get",
        url: "./config/index2.php?action=sendcode",
        data: _data,
        success: function (e) {
          var result = JSON.parse(e).result;
          $('.J-submit-btn').prop("disabled", false);
          if (result == 1) {
            $('form')[0].reset();
            that.showDialog("預約成功！");
            // faceboox埋点
            try {
              fbq('track', 'CompleteRegistration');
            } catch (error) { }
          } else if (result == 0) {
            that.showDialog("action參數錯誤或未知異常");
          } else if (result == -1) {
            that.showDialog("手機號或者驗證碼格式錯誤");
          } else if (result == -2) {
            that.showDialog("驗證碼错误！");
          } else if (result == -4) {
            that.showDialog("激活碼發完了");
          } else {
            that.showDialog("失敗！");
          }
        },
        error: function () {
          $('.J-submit-btn').prop("disabled", false);
        }
      })
    },
    // 初始化地区select数据
    initSelectItem(){
      // spaceCode 由 /js/space.js 变量引入
      var tpl = ''
      for (var i = 0; i < spaceCode.length; i++) {
        var element = spaceCode[i];
        tpl += '<div class="list" data-value="'+ element.val +'">'+ element.valText +'</div>'
      }
      $('.J-select-items').append(tpl)
    },
    // 设置手机号验证位数
    setValidLength: function (e) {
      var that = activePage;
      if (e == "886") {
        that.phoneValidLength = 10
      } else if (e == "852") {
        that.phoneValidLength = 8
      } else if (e == "853") {
        that.phoneValidLength = 8
      } else if (e == "65") {
        that.phoneValidLength = 8
      } else {
        that.phoneValidLength = 99
      }
      console.log(that.phoneValidLength)
    }
  }
  activePage.init()
})();
