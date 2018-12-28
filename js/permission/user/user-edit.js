var form = null,layer = null;
$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        form = layui.form, layer = layui.layer;
        initialPage(form);
        //自定义验证规则
        form.verify({
            code: function (value) {
                if (value.length < 4 || value.length > 20) {
                    return '昵称必须为4-20个以内的字母或数字';
                }
            }, name: function (value) {
                if (value.length < 1 || value.length > 20) {
                    return "姓名不符合长度限制";
                }
            },
            phone: function (value) {
                var cell_phone_re = /^1\d{10}$/;
                var tel_phone_re = /^0\d{2,3}-?\d{7,8}$/;
                if (!cell_phone_re.test(value) && !tel_phone_re.test(value)) {
                    return "不正确的联系方式";
                }
            }
            , password: [/(.+){8,20}$/, '密码必须为8-20位的字母或数字']
            , roleId: function (value) {
                if (value.length <= 0) {
                    return '请选择角色';
                }
            }
        });

        //监听提交
        form.on('submit(operation)', function (data) {
            var id = $("#id").val();
            var code = $("#code").val();
            var password = $("#password").val();
            var name = $("#name").val();
            var roleId = $("#roleId").val();
            var phone = $("#phone").val();
            var params = {id: id, account: code, password: password, realName: name, contactPhone: phone, roleIds: roleId};
            var loadingIndex = layer.load(1);
            $.ajax({
                url: baseUrl + "/operation/user/save",
                type: "post",
                data: params,
                beforeSend: function (request) {
                    request.setRequestHeader("OperaAuthorization", TOKEN);
                },
                success: function (resultData) {
                    if (resultData.returnCode == 200) {
                        x_admin_close();
                        parent.initPage(1, resultData.returnMessage);
                    } else {
                        layer.msg(resultData.returnMessage, {icon: 5, time:3000});
                    }
                },
                complete: function () {
                    layer.close(loadingIndex);
                }
            });
            return false;
        });
    });

});

function initialPage(form) {
    var page_type = getUrlParam('type');
    var title = '添加';
    if(page_type && page_type == 1) {
        $("#pwdDiv").remove();
        title = '编辑';
        displayUser(getUrlParam('userId'), form);
    }else {
        $("#pwdDiv").show();
        $("#id").val('0');
        getRoles(form, null);
    }
    $('#submitBtn').text(title);
}
/**
 * 编辑前回显
 * @param id
 */
function displayUser(id, form) {
    if(!id || '' == id) return;
    var user;
    var userList;
    var loadingIndex = layer.load(1);
    $.ajax({
        url: baseUrl + "/operation/user/find?userId=" + id,
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                user = resultData.data;
                $("#id").val(user.id);
                $("#code").val(user.account);
                $("#name").val(user.realName);
                $("#phone").val(user.contactPhone);
                userList = user.roleList;
                getRoles(form, userList[0].id);
            }
        },
        complete: function () {
            layer.close(loadingIndex);
        }
    });
}

function getRoles(form, selected_role_id) {
    $.ajax({
        url: baseUrl + "/operation/role/all",
        type: "post",
        crossDomain: true == !(document.all),
        beforeSend: function (request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if (resultData.returnCode == 200) {
                var list = resultData.data;
                var tbody = "<option value=''>请选择</option>";
                if(selected_role_id && null != selected_role_id) {
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        if (selected_role_id == content.id) {
                            tbody += "<option selected value=" + content.id + ">" + content.name + "</option>";
                        } else {
                            tbody += "<option value=" + content.id + ">" + content.name + "</option>";
                        }
                    }
                }else {
                    for (var i = 0; i < list.length; i++) {
                        var content = list[i];
                        tbody += "<option value=" + content.id + ">" + content.name + "</option>option>";
                    }
                }
                $('#roleId').html(tbody);
                //注意layUI.form对象刷新下拉列表，此处不可省略
                form.render('select');
            }
        },
    });
}