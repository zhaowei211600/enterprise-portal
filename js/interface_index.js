$(document).ready(function(){
    /*$.ajax({
        url: baseUrl +"/user/findUserById",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if(resultData.returnCode == 200){
                var content = resultData.data;
                $('#indexUserName').text(content.name);
                if(content.lastLoginTime != null){
                    $('#lastLoginTime').text(content.lastLoginTime);
                }
            }
        },
    });*/

    /*$.ajax({
        url: baseUrl +"/menu/findMenuListByUserId",
        type: "post",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if(resultData.returnCode == 200){
                var list = resultData.data;
                var menus = "";
                for(i in list){
                    menus = menus + list[i].name + ",";
                }
                menus = menus.substring(0, menus.length - 1);
                $('#indexUserMenu').text(menus);
            }
        },
    });*/

    /*$.ajax({
        url: baseUrl +"/operation/corp/count?status=01",
        type: "get",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if(resultData.returnCode == 200){
                var content = resultData.data;
                $('#corpCount').text(content);
            }
        },
    });*/

    /*$.ajax({
        url: baseUrl +"/fipOperaApi/operation/register/count?status=0",
        type: "get",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if(resultData.returnCode == 200){
                var content = resultData.data;
                $('#devCount').text(content);
            }
        },
    });

    $.ajax({
        url: baseUrl +"/fipOperaOrg/orgUser/count?status=3",
        type: "get",
        contentType: "application/json;charset=utf-8",
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success: function (resultData) {
            if(resultData.returnCode == 200){
                var content = resultData.data;
                $('#orgCount').text(content);
            }
        },
    });*/

        $.ajax({
            url: baseUrl + "/operation/product/stat",
            type: "post",
            crossDomain: true == !(document.all),
            beforeSend: function (request) {
                request.setRequestHeader("OperaAuthorization", TOKEN);
            },
            success: function (resultData) {
                if (resultData.returnCode == 200) {
                    if (resultData.data != null) {
                        $("#totalCount").html(resultData.data.totalCount);
                        $("#doingCount").html(resultData.data.doingCount);
                        $("#finishCount").html(resultData.data.finishCount);
                        $("#settleAmount").html(resultData.data.settleAmount);

                    }
                }
                return false;
            },
            complete: function () {
            }
        });
});