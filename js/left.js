$(document).ready(function (e) {
    $.ajax({
        type: "get",
        url: getRootPath_web() + "/html/left.html",
        async: true,
        success: function (html) {
            $('.left-nav').append(html);
            //动态权限赋值
            userMenusForLayUI();
        }
    });
    var element;
    //加载弹出层
    layui.use('element', function () {
            element = layui.element;
    });

    //触发事件
    var tab = {
        tabAdd: function (title, url, id) {
            //新增一个Tab项
            element.tabAdd('xbs_tab', {
                title: title,
                content: '<iframe tab-id="' + id + '" frameborder="0" src="' + url + '" scrolling="yes" class="x-iframe"></iframe>',
                id: id
            })
        }
        , tabDelete: function (othis) {
            //删除指定Tab项
            element.tabDelete('xbs_tab', '44');
            othis.addClass('layui-btn-disabled');
        }
        , tabChange: function (id) {
            //切换到指定Tab项
            element.tabChange('xbs_tab', id);
        }
    };

    var tableCheck = {
        init: function () {
            $(".layui-form-checkbox").click(function (event) {
                if ($(this).hasClass('layui-form-checked')) {
                    $(this).removeClass('layui-form-checked');
                    if ($(this).hasClass('header')) {
                        $(".layui-form-checkbox").removeClass('layui-form-checked');
                    }
                } else {
                    $(this).addClass('layui-form-checked');
                    if ($(this).hasClass('header')) {
                        $(".layui-form-checkbox").addClass('layui-form-checked');
                    }
                }

            });
        },
        getData: function () {
            var obj = $(".layui-form-checked").not('.header');
            var arr = [];
            obj.each(function (index, el) {
                arr.push(obj.eq(index).attr('data-id'));
            });
            return arr;
        }
    }

    //开启表格多选
    tableCheck.init();

    $('.container .left_open i').click(function (event) {
        if ($('.left-nav').css('left') == '0px') {
            $('.left-nav').animate({left: '-221px'}, 100);
            $('.page-content').animate({left: '0px'}, 100);
            $('.page-content-bg').hide();
        } else {
            $('.left-nav').animate({left: '0px'}, 100);
            $('.page-content').animate({left: '221px'}, 100);
            if ($(window).width() < 768) {
                $('.page-content-bg').show();
            }
        }
    });

    $('.page-content-bg').click(function (event) {
        $('.left-nav').animate({left: '-221px'}, 100);
        $('.page-content').animate({left: '0px'}, 100);
        $(this).hide();
    });

    $('.layui-tab-close').click(function (event) {
        $('.layui-tab-title li').eq(0).find('i').remove();
    });

    function openTab(node, obj) {
        var url = $(node).prop('link');
        if(url.indexOf(".") != 0) {
            url ="." + url;
        }
        var title = $(node).prop('name');
        var index = $(node).prop('id');
        var _href = $(obj).prop('_href');
        if(_href && null != _href && typeof(_href) != "undefined") {
            //分支用于页面间通过a标签跳转传参，每次均重新打开目标页面
            url = url + _href;
            element.tabDelete('xbs_tab', index + 1);
            tab.tabAdd(title, url, index + 1);
            tab.tabChange(index + 1);
            return;
        }
        for (var i = 0; i < $('.x-iframe').length; i++) {
            if ($('.x-iframe').eq(i).attr('tab-id') == index + 1) {
                tab.tabChange(index + 1);
                return;
            }
        }
        tab.tabAdd(title, url, index + 1);
        tab.tabChange(index + 1);
    }

    function clickNode(node, obj) {
        if ($(node).prop('children') && $(node).prop('children').length) {
            if($(obj).hasClass('active')) {
                // $(node).prop('spread', false);
                $('#nav a.active').siblings('.layui-tree-spread').click();
                $('#nav a').removeClass('active');
            }else {
                // $(node).prop('spread', true);
                $('#nav a.active').siblings('.layui-tree-spread').click();
                $('#nav a.active').removeClass('active');
                $(obj).addClass('active');
                $(obj).siblings('.layui-tree-spread').click();
            }
            $(obj).parent().siblings().children('ul').removeClass("layui-show");
            var url = $(node).prop('link');
            if(null != url && typeof url !== 'undefined' && '' != url) {
                openTab(node, obj);
            }
        } else {
            openTab(node, obj);
        }
    }

    function refreshToken() {
        var token = localStorage.getItem('OperaAuthorization');
        var tokenString = 'Bearer ' + token;
        $.ajax({
            type: "post",
            url: baseUrl + "/auth/refreshToken",
            contentType: "application/json;charset=utf-8",
            data: '',
            dataType: 'json',
            async: true,
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", tokenString);
            },
            success: function (resultData) {
                if (resultData.returnCode == 0) {
                    var content = resultData.data || {};
                    if (content.OperaAuthorization) {
                        if (window.ActiveXObject || "ActiveXObject" in window) {
                            $.cookie('OperaAuthorization', content.OperaAuthorization, {path: '/'});
                        } else {
                            localStorage.setItem('OperaAuthorization', content.OperaAuthorization);
                        }
                    } else {
                        $('body').append('<div class="popupParent"><div class="popup">没有获取到token值</div></div>');
                        setTimeout("$('.popupParent').remove();", 1000);
                    }
                }
            }
        });
    }

    function userMenusForLayUI() {
        $.ajax({
            url: baseUrl + "/operation/menu/load",
            type: "post",
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    layui.use('tree', function () {
                        layui.tree({
                            elem : '#nav',
                            skin : 'sidebar',
                            nodes: resultData.data,
                            click: function (node,obj) {
                                clickNode(node,obj);
                            }
                        });
                    });
                    //加载【我的桌面】
                    $("#welcom_html").attr("src", "./welcome.html");
                }
            }
        });
    }
});