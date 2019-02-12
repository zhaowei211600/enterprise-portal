//var baseUrl = 'http://127.0.0.1:10001';
//var baseUrl = 'http://39.106.157.230:10001';
//var baseUrl = 'http://118.190.146.125:10001';
var baseUrl = 'http://zhaobangshou.com.cn/backenterprise/';
$(document).ready(function () {
    //全局处理异常
    $.ajaxSetup({
        type: 'POST',
        error: function (jqXHR, textStatus, errorMsg) {
            if (jqXHR.status == 0) {
                layer.msg('网络异常，请稍后重试!', {
                    icon : 5,
                    time : 2000,
                    skin : 'layui-layer-molv',
                    closeBtn : 0
                });
            }else if (jqXHR.status == 403) {
                layer.msg('登录过期，请重新登录!', {
                    icon : 5,
                    skin : 'layui-layer-molv',
                    closeBtn : 0
                }, function(){
                    var top = getTopWinow();
                    top.location.href = getRoot_path()+'/login.html';
                });
            }else if (jqXHR.status == 'timeout') {
                //超时,status还有success,error等值的情况
                layer.msg('请求超时，请稍后重试!', {
                    icon : 5,
                    time : 2000,
                    skin : 'layui-layer-molv',
                    closeBtn : 0
                });
            }
        },
        complete: function (XMLHttpRequest, status) {
            if("<" == XMLHttpRequest.responseText.charAt(0)) return;
            var res = JSON.parse(XMLHttpRequest.responseText);
            if(res.returnCode == '11001') {
                layui.use('layer', function () {
                    var layer = layui.layer;
                    layer.msg('登录过期，请重新登录!', {
                        id : 'time_out_tip',
                        icon : 5,
                        skin : 'layui-layer-molv',
                        closeBtn : 0
                    }, function(){
                        var top = getTopWinow();
                        top.location.href = getRoot_path()+'/login.html';
                    });
                });
            }
        }
    });

    $(".notification-menu").click(function () {
        if ($(".dropdown-menu-usermenu").css('display') != 'table') {
            $(".dropdown-menu-usermenu").css('display', 'table');
        } else {
            $(".dropdown-menu-usermenu").removeAttr("style");
        }
    });

    $(".notification-menu").mouseleave(function () {
        $(".dropdown-menu-usermenu").removeAttr("style");
    });
});

 function getRoot_path(){
     //获取当前网址，如： http://localhost:80/ybzx/index.jsp
     var curPath=window.document.location.href;
     //获取主机地址之后的目录，如： ybzx/index.jsp
     var pathName=window.document.location.pathname;
     var pos=curPath.indexOf(pathName);
     //获取主机地址，如： http://localhost:80
     var localhostPaht=curPath.substring(0,pos);
     //获取带"/"的项目名，如：/ybzx
     var projectName=pathName.substring(0,pathName.substr(1).indexOf('/')+1);
     return localhostPaht+projectName;
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
                        //console.log('cookie = '+ $.cookie('OperaAuthorization'))
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

function getRootPath_web() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    // var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    var l = patch('\/', pathName);
    var projectName;
    if (l > 2) {
        var tm = pathName.substr(1).substring(pathName.substr(1).indexOf('/') + 1);
        tm = tm.substring(0, tm.substr(1).indexOf('/') + 1);
        var sl = pathName.indexOf(tm) + tm.length;
        projectName = pathName.substring(0, sl);
    } else {

        projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);

    }
    return (localhostPaht + projectName);
}

function patch(re, s) {

    return (s.split(re)).length - 1;

}

// 选中父节点时，选中所有子节点
function getChildNodeIdArr(node) {
    var ts = [];
    if (node.nodes) {
        for (x in node.nodes) {
            ts.push(node.nodes[x].nodeId);
            if (node.nodes[x].nodes) {
                var getNodeDieDai = getChildNodeIdArr(node.nodes[x]);
                for (j in getNodeDieDai) {
                    ts.push(getNodeDieDai[j]);
                }
            }
        }
    } else {
        ts.push(node.nodeId);
    }
    return ts;
}

// 选中所有子节点时，选中父节点 取消子节点时取消父节点
function setParentNodeCheck(treeObj, node) {
    var parentNode = treeObj.treeview("getNode", node.parentId);
    if (parentNode.nodes) {
        var checkedCount = 0;
        for (x in parentNode.nodes) {
            if (parentNode.nodes[x].state.checked) {
                checkedCount++;
            } else {
                break;
            }
        }
        if (checkedCount == parentNode.nodes.length) {  //如果子节点全部被选 父全选
            treeObj.treeview("checkNode", parentNode.nodeId);
            setParentNodeCheck(treeObj, parentNode);
        } else {   //如果子节点未全部被选 父未全选
            treeObj.treeview('uncheckNode', parentNode.nodeId);
            setParentNodeCheck(treeObj, parentNode);
        }
    }
}


// 取消父节点时 取消所有子节点
function setChildNodeUncheck(node) {
    if (node.nodes) {
        var ts = [];    //当前节点子集中未被选中的集合
        for (x in node.nodes) {
            if (!node.nodes[x].state.checked) {
                ts.push(node.nodes[x].nodeId);
            }
            if (node.nodes[x].nodes) {
                var getNodeDieDai = node.nodes[x];
                console.log(getNodeDieDai);
                for (j in getNodeDieDai) {
                    if (!getNodeDieDai.state.checked) {
                        ts.push(getNodeDieDai[j]);
                    }
                }
            }
        }
    }
    return ts;
}

//设置父子节点关联
function setParentChildRelate(treeObj) {
    treeObj.on('nodeChecked', function (event, node) {
        var selectNodes = getChildNodeIdArr(node); //获取所有子节点
        if (selectNodes) { //子节点不为空，则选中所有子节点
            treeObj.treeview('checkNode', [selectNodes, {silent: true}]);
        }
        setParentNodeCheck(treeObj, node);
    });
    treeObj.on('nodeUnchecked', function (event, node) {
        // 取消父节点 子节点取消
        var unSelectNodes = setChildNodeUncheck(node); //获取未被选中的子节点
        var childNodes = getChildNodeIdArr(node);    //获取所有子节点
        if (childNodes && unSelectNodes && unSelectNodes.length == 0) { //有子节点且未被选中的子节点数目为0，则取消选中所有子节点
            console.log("反选");
            treeObj.treeview('uncheckNode', [childNodes, {silent: true}]);
        }
        // 取消节点 父节点取消
        setParentNodeCheck(treeObj, node);
    });

}

function getTopWinow() {
    var p = window;
    while (p != p.parent) {
        p = p.parent;
    }
    return p;
}