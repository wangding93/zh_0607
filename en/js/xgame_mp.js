$(document).ready(function (){

    //音乐播放功能
    $(".music-play").on("click", function (){
        var music = document.getElementById("myMusic");
        var btn = $(".audio-btn");
       if (music.paused) {
           music.play();
           $(".audio-btn img").attr('src', "../img/xgamemp/ui_yxz_ysb_0015.png");
       } else {
           music.pause();
           $(".audio-btn img").attr('src', "../img/xgamemp/ui_yxz_ysb_0016.png");
       }
    });

    //侧边栏弹出收回事件
    $(document).click(function (){
        $(".navigation-btn").removeClass("open");
        if ($(window).width() < 1024) {
            $(this).removeClass("open");
            $(".navigation-btn").attr('src', "../img/xgamemp/ui_yxz_ysb_0004.png");
            $(".head-right").css("left", "100%");
        }
    });
    $(".navigation-btn").click(function () {
        console.log($(window).width());
        event.stopPropagation();
        if ($(this).hasClass("open")) {
            $(this).removeClass("open");
            $(".navigation-btn").attr('src', "../img/xgamemp/ui_yxz_ysb_0004.png");
            $(".head-right").css("left", "100%");
        } else {
            $(this).addClass("open");
            $(".navigation-btn").attr('src', "../img/xgamemp/ui_yxz_ysb_0005.png");
            if ($(window).width() < 1024) {
                $(".head-right").css("left", "54%");
            } else {
                $(".head-right").css("left", "83%");
            }

        }
    });

    //视频播放
    $(".movie-icon").click(function (){
        $(".movie-content").show();
        $(".movie-play")[0].play();
        $("#root").addClass("root-filter");
        $(".movie-play").css({"width":"6.5rem","height":"3.8rem"});
        $(".movie-delete").show();
    });
    $(".movie-delete").click(function (){
        // $(".movie-play")[0].pause();
        // $("#root").toggleClass("root-filter")
        // $(".movie-play").css({"width":"1px", "height": "1px"});
        // $(".movie-content").hide();
        // $(".movie-delete").hide();
        closeVideo();
    })

    //新闻列表
    $(".news-title ul li").click(function (){
       var index = $(this).data('index');
       $(".news-title ul li").css({"color": "antiquewhite"});
       $(".news-content-detail").hide();
       switch (index) {
           case 1:
               $(".news-title ul li:nth-child(1)").css({"color": "yellow"});
               $("#news-list-one").show();
               break;
           case 2:
               $(".news-title ul li:nth-child(2)").css({"color": "yellow"});
               $("#news-list-two").show();
               break;
           case 3:
               $(".news-title ul li:nth-child(3)").css({"color": "yellow"});
               $("#news-list-three").show();
               break;
           case 4:
               $(".news-title ul li:nth-child(4)").css({"color": "yellow"});
               $("#news-list-four").show();
               break;
           default:
               $(".news-title ul li:nth-child(1)").css({"color": "yellow"});
               $("#news-list-one").show();
       }
   })

    $(document).bind('click', function (e){
        var e = e || window.event;
        var elem = e.target || e.srcElement;
        if ($("#root").hasClass("root-filter") && elem.id != 'movie-icon' && elem.id != 'movie-content') {
            closeVideo();
        }
    })
});

function closeVideo()
{
    $(".movie-play")[0].pause();
    $("#root").removeClass("root-filter")
    $(".movie-play").css({"width":"1px", "height": "1px"});
    $(".movie-content").hide();
    $(".movie-delete").hide();
}