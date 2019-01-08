var form = null,layer = null,element = null;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        customList(null);
        form.on('submit(sreach)', function (data) {
            customList(null);
        });
        $("#searchBtn").click();
    });
});

/**
 * 列表方法
 * @param cur_page
 */
function customList(cur_page) {
    var total = 0;
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 10;
    param['phone'] = $('#phone').val();
    param['status'] = $('#status').val();
    param['registerTimeStart'] = $("#startDate").val();
    param['registerTimeEnd'] = $("#endDate").val();
    param['passTimeStart'] = $("#confirmStartDate").val();
    param['passTimeEnd'] = $("#confirmEndDate").val();
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/custom/list",
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                if (resultData.data != null) {
                    var list = resultData.data;
                    total = resultData.total;
                    var tbody = '';
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        var status = '';
                        var passTime = '';
                        if(content.status == '0'){
                            status = '待认证';
                        }else if(content.status == '1'){
                            status = '审核通过';
                        }else if(content.status == '2'){
                            status = '审核失败';
                        }else if(content.status == '3'){
                            status = '已停用';
                        }

                        if(content.passTime != 'null' && content.passTime != null){
                            passTime = content.passTime;
                        }
                        tbody += "<tr>";
                        tbody += "<td>" + (i+1) + "</td>";
                        tbody += "<td>" + content.phone + "</td>";
                        tbody += "<td>" + content.registerTime + "</td>";
                        tbody += "<td>" + passTime + "</td>";
                        tbody += "<td>" ;
                        tbody += "<a title=\"证件照\" id=\"cardImgFront\" onclick=\"showImg('"+content.cardImgFront+"',this)\" href=\"javascript:;\">证件照A面</a>" ;
                        tbody += "</td>";
                        tbody += "<td>" ;
                        tbody += "<a title=\"证件照\" onclick=\"showImg('"+content.cardImgBack+"',this)\" href=\"javascript:;\">证件照B面</a>" ;
                        tbody += "</td>";
                        tbody += "<td>" + status + "</td>";
                        tbody += "<td class=\"td-manage\">" ;
                        tbody += "<a title=\"认证通过\" onclick=\"confirmUser("+content.id+")\" href=\"javascript:;\">\n" +
                            "                    <i class=\"layui-icon\">&#xe672;</i>\n" +
                            "                </a>" ;
                        tbody += "<a title=\"停用\" onclick=\"stopUser("+content.id+")\" href=\"javascript:;\">\n" +
                            "                    <i class=\"layui-icon\">&#x1007;</i>\n" +
                            "                </a>" ;
                        tbody += "</td>";
                        tbody += "</tr>";
                    }
                    $('#customList').html(tbody);
                }
            } else {
                $('#customList').html("");
            }
            paging('customPageDiv', total, cur_page, 'totalNum', 'customList');
            return false;
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

/**
 * 编辑页回调主页面-入口方法
 * @param icon(图标类型)
 * @param msg(信息)
 */
function initPage(icon, msg) {
    layer.msg(msg,{icon:icon,time:2000});
    customList(null);
}

function confirmUser(id) {
    layer.confirm('确认要认证通过该用户吗？', {skin: 'layui-layer-molv'}, function(index){
        $.ajax({
            url: baseUrl + "/operation/custom/confirm?userId=" + id,
            type: "post",
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    layer.msg('用户认证成功!',{icon:1,time:1000});
                    customList(null);
                }else {
                    layer.msg(resultData.returnMessage,{icon:2,time:1000});
                }
            }
        });
    });
}

function stopUser(id) {
    layer.confirm('确认要停用该用户吗？', {skin: 'layui-layer-molv'}, function(index){
        $.ajax({
            url: baseUrl + "/operation/custom/stop?userId=" + id,
            type: "post",
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    layer.msg('用户认证成功!',{icon:1,time:1000});
                    customList(null);
                }else {
                    layer.msg(resultData.returnMessage,{icon:2,time:1000});
                }
            }
        });
    });
}


function showImg(fileName,obj) {
    $.ajax({
        type: "post",
        url: baseUrl + '/user/file/download ',
        data: {'fileName': fileName},
        contentType: 'application/x-www-form-urlencoded;charset=utf-8',
        async: true,
        crossDomain: true == !(document.all),
        success: function (data) {
            if (data.returnCode == 200) {
                var imgContent = 'data:image/png;base64,' + data.data
                $('#obj').attr('src', imgContent)
                var imgHtml = "<img src='" + imgContent + "' />";
                //捕获页
                layer.open({
                    type: 1,
                    shade: false,
                    title: false, //不显示标题
                    //area:['600px','500px'],
                    area: [400 + 'px', 300 + 'px'],
                    content: imgHtml, //捕获的元素，注意：最好该指定的元素要存放在body最外层，否则可能被其它的相对元素所影响
                    cancel: function () {
                        //layer.msg('捕获就是从页面已经存在的元素上，包裹layer的结构', { time: 5000, icon: 6 });
                    }
                });
            }else{
                layer.msg('文件下载失败',{icon:2,time:1000});
            }
        }
    });

}