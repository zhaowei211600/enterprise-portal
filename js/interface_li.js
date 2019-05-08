//var TOKEN = 'Bearer eyJhbGciOiJIUzUxMiJ9.eyJpZCI6MzQsImV4cCI6MTUwODU4MDgzNCwic3ViIjoiMTUwMDEwOTQzMjAiLCJleHBpcmVkIjoxNTA4NTgwODM0OTM3LCJjcmVhdGVkIjoxNTA4NTc3MjM0OTM3fQ.-qfiKZVpRJVA9HeFe6xse29bffD2vF6fP1YW58uc2NRy-bsTdnHM4z-kKLKC4jjboac6hulwKbmMxmtGH3NilQ'
//var BASEURL = 'https://www.yinshuitong.com/backfinance';
//var BASECORPURL = 'https://www.yingshuitong.com/backcorp';

var corpID = '';

var TOKEN = '';
if (window.ActiveXObject || "ActiveXObject" in window) {
    var token = $.cookie('OperaAuthorization') || '';
    TOKEN = 'Bearer ' + token;
} else {
    var token = localStorage.getItem('OperaAuthorization') || '';
    TOKEN = 'Bearer ' + token;
}

var userName = '';
if (window.ActiveXObject || "ActiveXObject" in window) {
    userName = $.cookie('userName') || '';
} else {
    userName = localStorage.getItem('userName') || '';
}

$(document).ready(function(){
    $('#accountName').text(userName);
});

function  exitSystem(){
    $.ajax({
        type:"post",
        url: baseUrl + '/operation/user/logout',
        data:'',
        contentType:'application/json;charset=utf-8',
        dataType: 'json',
        async: true,
        crossDomain: true == !(document.all),
        beforeSend: function(request) {
            request.setRequestHeader("OperaAuthorization", TOKEN);
        },
        success:function(resultData){
            console.log(resultData);
            if (resultData.returnCode == '200') {
            	localStorage.setItem("OperaAuthorization","");
            	localStorage.setItem("userName","");
            }

            window.location.href = getRootPath_web()+"/login.html";
        },error:function (e) {
            window.location.href = getRootPath_web()+"/login.html";
        }
    });
}

