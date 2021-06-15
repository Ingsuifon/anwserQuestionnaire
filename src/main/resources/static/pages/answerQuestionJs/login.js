var UserName = document.getElementById("UserName");
var Password = document.getElementById("Password");
var LoginButton = document.getElementById("LoginButton");
var UserNameText = '';

// isLoginFun();
//登录
function login() {
    if (!UserName.value) {
        alert("请先输入用户名");
        UserName.focus();
        return;
    }
    if(!Password.value) {
        alert("请输入密码");
        Password.focus();
        return;
    }

    UserNameText = $("#UserName").val();
    var PasswordTest = $("#Password").val();

    var da = {
        "username":UserNameText,
        "password":PasswordTest
    };
    commonAjaxPost(true, "/admin/userLogin", da, loginSuccess)
}

function faceLogin() {
    //获取摄像头对象
    let capture = document.createElement("button");
    capture.setAttribute("id", "capture");
    capture.innerHTML = "登录";
    document.getElementById("divSojump").appendChild(capture);
    let canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas");
    canvas.setAttribute("width", "180");
    canvas.setAttribute("height", "180");
    //document.getElementById("divSojump").appendChild(canvas);
    let video = document.createElement("video");
    video.setAttribute("id", "video");
    video.setAttribute("width", "180");
    video.setAttribute("height", "180");
    video.setAttribute("autoplay", "autoplay");
    document.getElementById("divSojump").appendChild(video);
    let context = canvas.getContext("2d");
    capture.addEventListener("click", function () {
        //绘制画面
        context.drawImage(video, 0, 0, 180, 180);// 保存base64
        let s = canvas.toDataURL("image/png").substr(22);
        let da = {
            "photo": s
        };
        commonAjaxPost(true, "/admin/faceLogin", da, loginSuccess);
    });

    // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
    if (navigator.mediaDevices === undefined) {
        navigator.mediaDevices = {};
    }

    // 一些浏览器部分支持 mediaDevices。我们不能直接给对象设置 getUserMedia
    // 因为这样可能会覆盖已有的属性。这里我们只会在没有getUserMedia属性的时候添加它。
    if (navigator.mediaDevices.getUserMedia === undefined) {
        navigator.mediaDevices.getUserMedia = function (constraints) {

            // 首先，如果有getUserMedia的话，就获得它
            var getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

            // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
            if (!getUserMedia) {
                return Promise.reject(new Error('getUserMedia is not implemented in this browser'));
            }

            // 否则，为老的navigator.getUserMedia方法包裹一个Promise
            return new Promise(function (resolve, reject) {
                getUserMedia.call(navigator, constraints, resolve, reject);
            });
        }
    }

    //默认使用前摄像头，强制使用后置摄像头如下设置
    // let constraints = {video: { facingMode: { exact: "environment" } }};
    let constraints = {video: true};
    navigator.mediaDevices.getUserMedia(constraints)
        .then(function (stream) {
            // 旧的浏览器可能没有srcObject
            if ("srcObject" in video) {
                video.srcObject = stream;
            } else {
                // 防止在新的浏览器里使用它，应为它已经不再支持了
                video.src = window.URL.createObjectURL(stream);
            }
            video.onloadedmetadata = function (e) {
                video.play();
            };
        })
        .catch(function (err) {
            console.log(err.name + ": " + err.message);
        });
}

//登录成功回调
function loginSuccess(result){
    if (result.code === '666') {
        layer.msg(result.message, {icon:1});
        setCookie('isLogin','1');
        setCookie('userId',result.data.id);
        setCookie('userName',UserNameText);
        setCookie('power',result.data.role);
        setCookie('modelId',result.data.modelId)
        window.location.href = "myQuestionnaires.html"
    }else{
        layer.msg("此用户不存在",{icon:2});
    }
}

//回车事件
$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        login();
    }
});