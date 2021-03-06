; (function () {
  var activePage = {
    // 验证手机号位数
    // 輸入的手機號碼錯誤！
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
      that.initSpine()
      // that.initMusicPlay()
    },
    // 初始化滑块
    initSwiper: function () {
      var roleSwiper = new Swiper('.role-swiper-container', {
        loop: false,
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        autoplay: 1000,
        autoplayDisableOnInteraction: false,
        autoplay: false,
        effect : 'fade',
        fade: {
          crossFade: true,
        }
      })
      var videoSwiper = new Swiper('.video-swiper-container', {
        loop: true,
        // 如果需要分页器
        pagination: '.swiper-pagination',
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: true,
        autoplayDisableOnInteraction: false,
        autoplay: 5000,
      })
      //新闻模块
      var newsSwiper = new Swiper('.news-swiper-container', {
        loop: false,
        // 如果需要分页器
        pagination: '.news-hd',
        paginationType: 'custom',
        paginationCustomRender: function (swiper, current, total) {
          var customPaginationHtml = "";
          customPaginationHtml += '<ul>';
          customPaginationHtml += '<li data-index="1"><a href="javascript:;">最新</a></li>';
          customPaginationHtml += '<li data-index="2"><a href="javascript:;">故事</a></li>';
          customPaginationHtml += '<li data-index="3"><a href="javascript:;">攻略</a></li>';
          customPaginationHtml += '<li data-index="4"><a href="javascript:;">活动</a></li></ul>';
          customPaginationHtml += '<div class="news-border-line"></div>';
          return customPaginationHtml;
        },
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        paginationClickable: false
        // autoplayDisableOnInteraction :false,
        // autoplay : 5000,
      });
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
          $("select[name='area']").val(val);
          $(".J-select-value").html(valText)
          that.setValidLength(val);
        },
        error: function () {
          $("select[name='area']").val(val);
          $(".J-select-value").html(valText)
        }
      })
    },
    initSpine:function(){
      new spine.SpinePlayer("J-spine-hml", {
        jsonUrl: "spine/hml/huamulan-2.json",
        atlasUrl: "spine/hml/huamulan-2.atlas",
        animation:"idle",
        alpha: true,
        backgroundColor: "#00000000",
        showControls: false
      });
    },
    // 处理地区数据
    validSpaceData(isocode){
      // spaceCode 由 /js/space.js 变量引入
      return spaceCode.find(function(item){
        return item.isocode == isocode
      })
    },
    // 设置活动进度
    initActivityProgress: function () {
      return
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
    // 初始化各种Dom事件
    initDomEvent: function () {
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
      // $(".J-select-option-list .list").on("click",function(){
      $("select[name='area']").change(function (e) {
        var text = this.options[this.options.selectedIndex].innerText
        $(".J-select-value").html(text)
        that.setValidLength(this.value);
      })
      // 过滤只能输入数字
      $('input[name="phone"],input[name="code"]').on('input', function () {
        this.value = this.value.replace(/[^\d]/g, '');
      })
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
          $(".slide-icon-one").fadeIn();
        } else {
          $(".J-go-top").fadeOut();
          $(".slide-icon-one").fadeOut();
        }
      })
      $(".J-go-top").on("click", function () {
        $("html,body").animate({
          scrollTop: 0
        }, 500);
      })
      $(".J-banner-btn").on("click", function () {
        var offsetHeight = $("#form").offset().top
        $("html,body").animate({
          scrollTop: offsetHeight
        }, 500);
      })
    },
    // 表单验证通用弹窗
    showDialog: function (e) {
      e ? e : e = "输入的手机号码/验证码不正确！"
      $(".dialog-phone").show()
      $(".dialog-phone .J-dialog-phone-text").html(e)
    },
    // 发送验证码功能
    sendValidCode: function () {
      var that = activePage;
      var phoneNumber = $('input[name="phone"]').val();
      if (phoneNumber == '') {
        return that.showDialog("输入的手机号码不能为空！");
      }
      if (phoneNumber.length != that.phoneValidLength && that.phoneValidLength != 99) {
        return that.showDialog("输入的手机号码错误！");
      }
      var _data = $("form").serialize();
      console.log(_data);
      $('.J-code-btn').prop("disabled", true)
      $.ajax({
        type: "get",
        url: "./config/index2.php?action=setphone",
        data: _data,
        success: function (e) {
          var result = JSON.parse(e).result;
          if (result == 1) {
            that.showDialog("验证码已发送！");

            // faceboox埋点
            try {
              fbq('track', 'CompleteRegistration');
            } catch (error) { }

            
          } else if (result == -2) {
            that.showDialog("该手机号已经成功预约。");
          } else {
            that.showDialog("短信发送失败");
          }
          $('.J-code-btn').prop("disabled", false)
        },
        error: function () {
          $('.J-code-btn').prop("disabled", false)
          that.showDialog("短信发送失败");
        }
      })
    },
    // 立即登录功能
    submitPhone: function () {
      var that = activePage;
      var phoneNumber = $('input[name="phone"]').val();
      var codeNumber = $('input[name="code"]').val();
      if (phoneNumber == '' || codeNumber == '') {
        return that.showDialog("输入的手机号码/验证码不正确！");
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
            that.showDialog("预约成功！");
            // faceboox埋点
            try {
              fbq('track', 'CompleteRegistration');
            } catch (error) { }
          } else if (result == 0) {
            that.showDialog("action参数错误或未知异常");
          } else if (result == -1) {
            that.showDialog("手机号码或验证码格式错误");
          } else if (result == -2) {
            that.showDialog("验证码错误！");
          } else if (result == -4) {
            that.showDialog("激活码发完了");
          } else {
            that.showDialog("失败！");
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
        // tpl += '<div class="list" data-value="'+ element.val +'">'+ element.valText +'</div>'
        tpl += '<option value="'+ element.val +'">'+ element.valText +'</option>'
      }
      $('.J-select-value-hide').append(tpl)
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
    },
    //音乐播放
    initMusicPlay: function () {
      var that = activePage;
      $(".music-play").on("click", function () {
        var music = document.getElementById("myMusic");
        var btn = $(".audio-btn");
        if (music.paused) {
          music.play();
          $(".audio-btn img").attr('src', "img/xgamemp/ui_yxz_ysb_0015.png");
        } else {
          music.pause();
          $(".audio-btn img").attr('src', "img/xgamemp/ui_yxz_ysb_0016.png");
        }
      });


    }
  }
  activePage.init()
})();
