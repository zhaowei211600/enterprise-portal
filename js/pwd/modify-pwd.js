$(function () {
    layui.use(['form', 'layer'], function () {
        $ = layui.jquery;
        var form = layui.form,
            layer = layui.layer;
        form.verify({
            password: [/(.+){8,20}$/, '密码必须为8-16位的字母或数字']
        });

        //监听提交
        form.on('submit(operation)', function (data) {
            var pwd = $("#pwd").val();
            var newPwd = $("#newPwd").val();
            var newPwdToConfirm = $('#newPwdToConfirm').val();
            if(!newPwd || !newPwdToConfirm || newPwd !== newPwdToConfirm) {
                layer.msg('请核对新密码！', {
                    icon : 5,
                    time : 2000,
                    skin : 'layui-layer-molv',
                    closeBtn : 0
                });
                return false;
            }
            var param = {pwd: pwd, newPwd: newPwd};
            pop_up();
            $.ajax({
                type:"post",
                url: baseUrl + '/user/modifyPwd',
                data:param,
                dataType: 'json',
                async: true,
                crossDomain: true == !(document.all),
                beforeSend: function (request) {
                    request.setRequestHeader("OperaAuthorization", TOKEN);
                },
                success: function (resultData) {
                    if (resultData.returnCode == 200) {
                        localStorage.setItem("OperaAuthorization","");
                        localStorage.setItem("userName","");
                        getTopWinow().location.href = getRoot_path()+'/login.html';
                    } else {
                        layer.msg(resultData.returnMessage, {icon: 5, time:3000,closeBtn : 0});
                    }
                    close_pop_up();
                }
            });
            return false;
        });
    });

});