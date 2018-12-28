var nums = 59;
var clockk = '';

$(document).ready(function(){
	//切换登录注册界面
	$('#registBtn').click(function(){
		$('.login').hide();
		$('.regist').show();
	});
	$('#loginBtn').click(function(){
		$('.regist').hide();
		$('.login').show();
	});
	// 手机号码验证
    jQuery.validator.addMethod("isMobile", function (value, element) {
        var length = value.length;
        var mobile = /^((1[0-9][0-9]{1})+\d{8})$/;
        return this.optional(element) || (length == 11 && mobile.test(value));
    }, "请正确填写您的用户名");


    jQuery.validator.addMethod("isPws", function (value, element) {
    		var length = value.length;
        var mobile = /[0-9]+[a-zA-Z]+[0-9a-zA-Z]*|[a-zA-Z]+[0-9]+[0-9a-zA-Z]*/;
        var qw = this.optional(element)
        var er = mobile.test(value)
        return this.optional(element) || (mobile.test(value));
    }, "密码必须包含数字和字母");

    layui.use(['form', 'layer'], function () {
        var form = layui.form
            , layer = layui.layer,
            element = layui.element
    });

    //登录验证
	$("#loginform").validate({
        errorClass: "error",
        rules: {
            phonenumber: {required: true, maxlength: 16, minlength: 4},
            userpw: {required: true, maxlength: 16, minlength: 8, isPws:true},
            
        },
        messages: {
            phonenumber: {required: "请输入用户名"},
            userpw: {
                required: "请输入密码",
                maxlength: "输入长度不可超过16位.",
                minlength: "输入长度最少8位."
            },
            
        },
        submitHandler: function () {
            		var phoneNum = $('#loginPhone').val();
        			var passwordNum = $('#loginPws').val();
        			//提交表单 时调用的发方法
        			var param = {};
				param["username"] = phoneNum;
				param["password"] = passwordNum;
           		
	            $.ajax({
	                data: JSON.stringify(param),
	                url: baseUrl +"/operation/user/login",
	                type: "post",
	                contentType: "application/json;charset=utf-8",
	                crossDomain: true == !(document.all),
	                success: function (resultData) {
	                   // console.log(resultData)
	                    if (resultData.returnCode == 200) {
	                    		var content = resultData.data || {};
	                    		window.location.href = getRootPath_web()+'/index.html';
	                    		if (content.OperaAuthorization) {
	                    			if (window.ActiveXObject || "ActiveXObject" in window){
	                    				$.cookie('OperaAuthorization', content.OperaAuthorization, { path: '/' ,expires : 1 });
	                    				$.cookie('userName', content.userName, { path: '/' ,expires : 1 });
	                    				//console.log('cookie = '+ $.cookie('OperaAuthorization'))
	                    			}else{
	                    				localStorage.setItem('OperaAuthorization',content.OperaAuthorization);
	                    				localStorage.setItem('userName',content.userName);
	                    			}
	                    		} else{
	                    			//没有获取到token值
                                    layer.msg('登录失败', {icon: 6,time:3000});
                                    return false;
	                    		}
	                    		var clock = setInterval(refreshToken, 1000*60*50); //50分钟执行一次
	                    		
	                    } else if(resultData.returnCode == 405 ||resultData.returnCode == 401 ){
                            layer.msg('登录失败！请输入正确账号或密码', {icon: 6,time:3000});
                            return false;
	                    }else{
                            layer.msg('登录失败！请输入正确账号或密码', {icon: 6,time:3000});
                            return false;
	                    }
	                   
	                }
	            });
        },
        errorPlacement: function (error, element) { //错误信息位置设置方法
            if (element.is(":input")) {
                error.insertAfter(element); //这里的element是录入数据的对象
            }
        }
    });
    
    //注册验证
	$("#registform").validate({
        errorClass: "error",
        rules: {
            phonenumber: {required: true, maxlength: 16, minlength: 5},
            userpw: {required: true, maxlength: 16, minlength: 8, isPws:true},
           queryNum:{required: true}
        },
        messages: {
            phonenumber: {required: "请输入手机号码"},
            userpw: {
                required: "请输入密码，8~16位数字，字母混合组成",
                maxlength: "输入长度不可超过16位.",
                minlength: "输入长度最少8位."
            },
            queryNum:{ required: "请输入验证码"}
        },
        submitHandler: function () {
        			var phoneNum = $('#regestPhone').val();
        			var passwordNum = $('#regestPws').val();
        			var queryNum = $('#queryInput').val();
        			//提交表单 时调用的发方法
        			var param = {};
				param["phoneNumber"] = phoneNum;
				param["password"] = passwordNum;
				param["authCode"] = queryNum;
	            $.ajax({
	                data: JSON.stringify(param),
	                url: baseUrl+"/register/signIn",
	                type: "post",
	                contentType: "application/json;charset=utf-8",
	                crossDomain: true == !(document.all),
	                success: function (data) {
	                  // console.log(data);
	                   if(data.returnCode == 0 ){
	                  		$('body').append('<div class="popupParent"><div class="popup">恭喜您注册成功，请先登录</div></div>');
							setTimeout("$('.popupParent').remove();$('.regist').hide();$('.login').show();",2000);
	                   }else if(data.returnCode == 407){
	                   		$('body').append('<div class="popupParent"><div class="popup">手机号码已被注册，请去登录</div></div>');
	                   		setTimeout("$('.popupParent').remove();",1000);
	                   }else if(data.returnCode == 400){
	                   		$('body').append('<div class="popupParent"><div class="popup">验证码错误</div></div>');
	                   		setTimeout("$('.popupParent').remove();",1000);
	                   }else if(data.returnCode == 500){
	                   		$('body').append('<div class="popupParent"><div class="popup">注册失败！</div></div>');
	                   		setTimeout("$('.popupParent').remove();",1000);
	                   }
						
	                },
	            });
        },
        errorPlacement: function (error, element) { //错误信息位置设置方法
        	
            if (element.is(":input")) {
            		if(element.attr('id') == 'queryInput'){
            			error.insertAfter(element.parent());
            		}else{
            			 error.insertAfter(element); //这里的element是录入数据的对象
            		}
            }
        }
    });
    
   
	
});
//获取校验码
function getQueryNum(){
	var mobile = /^((1[0-9][0-9]{1})+\d{8})$/;
	var phoneNum = $('#regestPhone').val();
	if(mobile.test(phoneNum)){
		var param = {};
		param["phoneNumber"] = phoneNum;
		//console.log(param)
		$.ajax({
			type:"post",
			url:baseUrl+"/register/unique",
			data:param,
			crossDomain: true == !(document.all),
			success:function(data){
				//console.log(data);
				if(data.returnCode == '407'){
					$('body').append('<div class="popupParent"><div class="popup">手机号已经注册过，请更换新手机号</div></div>');
		 			setTimeout("$('.popupParent').remove();",1000);
				}else if(data.returnCode == '0'){
					var $this = $('.queryButton > a'); 
					$this.html(nums+'s后可重新获取');
					$this.css('color','#FF0000');
					clockk = setInterval(doLoop, 1000); //一秒执行一次
		
					$.ajax({
						type:"post",
						url:baseUrl+"/register/authCode ",
						data:param,
						success:function(resultData){
							console.log(resultData)
							if(resultData.returnCode == '0'){
								
							}else if(resultData.returnCode == '409'){
								$('body').append('<div class="popupParent"><div class="popup">验证码发送过于频繁，请稍后再试！</div></div>');
		 						setTimeout("$('.popupParent').remove();",1000);
							}else if(resultData.returnCode == '408'){
								$('body').append('<div class="popupParent"><div class="popup">验证码发送次数已超过今日最大限制，请明日再试！</div></div>');
		 						setTimeout("$('.popupParent').remove();",1000);
							}else{
								$('body').append('<div class="popupParent"><div class="popup">验证码发送失败！</div></div>');
		 						setTimeout("$('.popupParent').remove();",1000);
							}
							
							
						}
					});
				}
			}
		});
	}else{
		$('body').append('<div class="popupParent"><div class="popup">请先填写手机号！</div></div>');
		setTimeout("$('.popupParent').remove();",1000);
	}
	
}
function doLoop()
 {
 	     
 	var $this = $('.queryButton > a');
	 nums--;
	 if(nums > 0){
	  		$this.html(nums+'s后可重新获取');
	  		$('.queryButton').removeAttr('onclick');//去掉标签中的onclick事件
	 }else{
		  clearInterval(clockk); //清除js定时器
		  $this.html('获取短信验证码');
		  $this.css('color','#0080CC');
		  nums = 59; //重置时间''
		  $('.queryButton').attr("onclick","getQueryNum();"); 
	 }
 }


