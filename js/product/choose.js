var productId =  getUrlParam('productId');
var productAttr = getUrlParam("attr");
var form = null,layer = null,element = null;
var ischange = false;
$(document).ready(function () {
    layui.use(['form', 'layer','element'], function () {
        layer = layui.layer;
        form = layui.form;
        element = layui.element;
        userList()
    });
});

$("#ischange").change(function() {
    ischange = !ischange
    if(ischange){
        $('#userList input').prop('checked',true);
    }else {
        $('#userList input').prop('checked',false);
    }

});

function inputChange(obj) {
    var checked =  $(obj).attr('checked');
    if(checked){
        $(obj).prop('checked',false);
    }else {
        $(obj).prop('checked',true);
    }

}

/**
 * 列表方法
 * @param cur_page
 */
function userList(cur_page) {
    var total = 0;
    var param = {};
    cur_page = isInteger(cur_page) ? cur_page : 1;
    param["pageNum"] = cur_page;
    param["pageSize"] = 1000;
    param["productId"] = productId;
    var loadingIndex = layer.load(1);
    $.ajax({
        data: param,
        url: baseUrl + "/operation/order/product",
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
                        tbody += "<tr>";
                        tbody += "<td style='text-align: center;'><input  type='checkbox' name='"+content.id+"' onchange='inputChange(this)' style='width: 20px;height: 20px;'></td>";
                        tbody += "<td>" + content.realName + "</td>";
                        tbody += "<td>" + content.phone + "</td>";
                        tbody += "<td>" + content.registerTime + "</td>";
                        tbody += "</tr>";
                    }
                    $('#userList').html(tbody);
                }
            }else {
                $('#userList').html("");
            }
            paging('userPageDiv', total, cur_page, 'totalNum', 'userList');
            return false;
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

function chooseUser() {
    var param = {};
    var allCheckBoxId = [];
    $('#userList input').each(function () {
        var checked =  $(this).prop('checked');
        if(checked){
            allCheckBoxId.push(this.name);
        }
    })
    if(allCheckBoxId.length == 0){
        layer.msg("请选择接单人",{icon:2,time:1000});
        return;
    }
    /*if(productAttr == 1 && allCheckBoxId.length > 1){
        layer.msg("此项目性质为持续性服务，只能选择一个接单人",{icon:2,time:1000});
        return;
    }*/

    layer.confirm('确认选择此接单人？', {skin: 'layui-layer-molv'}, function(index){
        param["productId"] = productId;
        param["orderIds"] = allCheckBoxId;

        $.ajax({
            data:param,
            url: baseUrl + "/operation/product/choose",
            type: "post",
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    layer.msg('设置成功!',{icon:1,time:1000});
                    window.parent.productList(null);
                    x_admin_close();
                }else {
                    layer.msg(resultData.returnMessage,{icon:2,time:1000});
                }
            }
        });
    });
}
