/**
 * Created by Amy on 2018/8/9.
 */
$(function () {
    isLoginFun();
    header();
    $("#ctl01_lblUserName").text(getCookie('userName'));
    var oTable = new TableInit();
    oTable.Init();
});

//回车事件
$(document).keydown(function (event) {
    if (event.keyCode == 13) {
        getUserList();
    }
});

$('#userManager').on("keydown", function (event) {
    var keyCode = event.keyCode || event.which;
    if (keyCode == "13") {
        //console.log("1111")
        event.preventDefault();
    }
});

function getUserList() {
    $("#userTable").bootstrapTable('refresh');
}

function TableInit() {

    var oTableInit = new Object();
    //初始化Table
    oTableInit.Init = function () {
        $('#userTable').bootstrapTable({
            url: httpRequestUrl + '/admin/queryUserList',         //请求后台的URL（*）
            method: 'POST',                      //请求方式（*）
            striped: true,                      //是否显示行间隔色
            cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
            pagination: true,                   //是否显示分页（*）
            sortOrder: "asc",                   //排序方式
            queryParamsType: '',
            dataType: 'json',
            paginationShowPageGo: true,
            showJumpto: true,
            pageNumber: 1, //初始化加载第一页，默认第一页
            queryParams: queryParams,//请求服务器时所传的参数
            sidePagination: 'server',//指定服务器端分页
            pageSize: 10,//单页记录数
            pageList: [10, 20, 30, 40],//分页步进值
            search: false, //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
            silent: true,
            showRefresh: false,                  //是否显示刷新按钮
            showToggle: false,
            minimumCountColumns: 2,             //最少允许的列数
            uniqueId: "id",                     //每一行的唯一标识，一般为主键列

            columns: [{
                checkbox: true,
                visible: false
            }, {
                field: 'id',
                title: '序号',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
                {
                    field: 'username',
                    title: '用户账号',
                    align: 'center',
                    width: '230px'
                },
                {
                    field: 'password',
                    title: '用户密码',
                    align: 'center'
                }, {
                    field: 'startTime',
                    title: '开始时间',
                    align: 'center'
                }, {
                    field: 'endTime',
                    title: '结束时间',
                    align: 'center'
                },
                {
                    field: 'operation',
                    title: '操作',
                    align: 'center',
                    events: operateEvents,//给按钮注册事件
                    formatter: addFunctionAlty//表格中增加按钮
                }],
            responseHandler: function (res) {
                //console.log(res);
                if(res.code == "666"){
                    window.ids = [];
                    var userInfo = res.data.list;
                    var NewData = [];
                    if (userInfo.length) {
                        for (var i = 0; i < userInfo.length; i++) {
                            var dataNewObj = {
                                'id': '',
                                "username": '',
                                'password': '',
                                "startTime": '',
                                'endTime': '',
                                'status': ''
                            };
                            window.ids.push(userInfo[i].id);
                            dataNewObj.id = userInfo[i].id;
                            dataNewObj.username = userInfo[i].username;
                            dataNewObj.password = userInfo[i].password;
                            dataNewObj.startTime = userInfo[i].startTime.replace(/-/g,'/');
                            dataNewObj.endTime = userInfo[i].stopTime.replace(/-/g,'/');
                            dataNewObj.status = userInfo[i].status;
                            NewData.push(dataNewObj);
                        }
                        //console.log(NewData)
                    }
                    var data = {
                        total: res.data.total,
                        rows: NewData
                    };

                    return data;
                }

            }

        });
    };

    // 得到查询的参数
    function queryParams(params) {
        var userName = $("#keyWord").val();
        //console.log(userName);
        var temp = {   //这里的键的名字和控制器的变量名必须一直，这边改动，控制器也需要改成一样的
            pageNum: params.pageNumber,
            pageSize: params.pageSize,
            username: userName
        };
        return JSON.stringify(temp);
    }

    return oTableInit;
}


window.operateEvents = {
    //编辑
    'click #btn_count': function (e, value, row, index) {
        id = row.id;
        $.cookie('questionId', id);
    }
};


// 表格中按钮
function addFunctionAlty(value, row, index) {
    var btnText = '';

    btnText += "<button type=\"button\" id=\"btn_look\" onclick=\"resetPassword(" + "'" + row.id + "'" + ")\" style='width: 77px;' class=\"btn btn-default-g ajax-link\">重置密码</button>&nbsp;&nbsp;";

    btnText += "<button type=\"button\" id=\"btn_look\" onclick=\"editUserPage(" + "'" + row.id + "')\" class=\"btn btn-default-g ajax-link\">编辑</button>&nbsp;&nbsp;";

    if (row.status == "1") {
        btnText += "<button type=\"button\" id=\"btn_stop" + row.id + "\" onclick=\"changeStatus(" + "'" + row.id + "'" + ")\" class=\"btn btn-danger-g ajax-link\">关闭</button>&nbsp;&nbsp;";
    } else if (row.status == "0") {
        btnText += "<button type=\"button\" id=\"btn_stop" + row.id + "\" onclick=\"changeStatus(" + "'" + row.id + "'" + ")\" class=\"btn btn-success-g ajax-link\">开启</button>&nbsp;&nbsp;"
    }
    btnText += "<button type=\"button\" id=\"btn_stop" + row.id + "\" onclick=\"deleteUser(" + "'" + row.id + "'" + ")\" class=\"btn btn-danger-g ajax-link\">删除</button>&nbsp;&nbsp;";

    return btnText;
}

//重置密码
function resetPassword(id) {
    alert("重置密码")

}

// 打开创建用户页
function openCreateUserPage(id, value) {

    deleteCookie("userTitle");
    setCookie("userTitle", value);
    if (id != '') {
        deleteCookie("userId");
        setCookie("userId", id);
    }
    window.location.href = 'createNewUser.html';
}

//批量导入
// function batchImport() {
//     let inputObj = document.createElement('input')
//     inputObj.setAttribute('type','file');
//     inputObj.setAttribute('accept', 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
//     inputObj.setAttribute("style",'visibility: hidden');
//     inputObj.click();
//     inputObj.onchange = function () {
//         let file = inputObj.files[0];
//         let form = new FormData();
//         form.append("file", file);
//         form.append("fileName", file.name);
//         let xhr = new XMLHttpRequest();
//         let action = "http://localhost:8085/admin/batchImport";
//         xhr.open("POST", action);
//         xhr.send(form);
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4 && xhr.status === 200) {
//                 let resultObj = JSON.parse(xhr.responseText);
//                 //处理结果
//                 if (resultObj.code !== -1) {
//                     layer.msg("用户信息导入成功", {icon: 1});
//                     setTimeout(function () {
//                         window.location.href = 'userManage.html';
//                     }, 1000);
//                 }
//             }
//         }
//     }
// }


// 读取本地excel文件
function readWorkbookFromLocalFile(file, callback) {
    let reader = new FileReader();
    reader.onload = function(e) {
        let data = e.target.result;
        let workbook = XLSX.read(data, {type: 'binary'});
        if(callback) callback(workbook);
    };
    reader.readAsBinaryString(file);
}

// 从网络上读取某个excel文件，url必须同域，否则报错
function readWorkbookFromRemoteFile(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
        if(xhr.status === 200) {
            var data = new Uint8Array(xhr.response)
            var workbook = XLSX.read(data, {type: 'array'});
            if(callback) callback(workbook);
        }
    };
    xhr.send();
}

// 读取 excel文件
function outputWorkbook(workbook) {
    var sheetNames = workbook.SheetNames; // 工作表名称集合
    sheetNames.forEach(name => {
        var worksheet = workbook.Sheets[name]; // 只能通过工作表名称来获取指定工作表
        for(var key in worksheet) {
            // v是读取单元格的原始值
            console.log(key, key[0] === '!' ? worksheet[key] : worksheet[key].v);
        }
    });
}

function readWorkbook(workbook) {
    var sheetNames = workbook.SheetNames; // 工作表名称集合
    var worksheet = workbook.Sheets[sheetNames[0]]; // 这里我们只读取第一张sheet
    console.log(XLSX.utils.sheet_to_json(worksheet));
}

// 将csv转换成表格
function csv2table(csv)
{
    var html = '<table>';
    var rows = csv.split('\n');
    rows.pop(); // 最后一行没用的
    rows.forEach(function(row, idx) {
        var columns = row.split(',');
        columns.unshift(idx+1); // 添加行索引
        if(idx == 0) { // 添加列索引
            html += '<tr>';
            for(var i=0; i<columns.length; i++) {
                html += '<th>' + (i==0?'':String.fromCharCode(65+i-1)) + '</th>';
            }
            html += '</tr>';
        }
        html += '<tr>';
        columns.forEach(function(column) {
            html += '<td>'+column+'</td>';
        });
        html += '</tr>';
    });
    html += '</table>';
    return html;
}

function table2csv(table) {
    var csv = [];
    $(table).find('tr').each(function() {
        var temp = [];
        $(this).find('td').each(function() {
            temp.push($(this).html());
        })
        temp.shift(); // 移除第一个
        csv.push(temp.join(','));
    });
    csv.shift();
    return csv.join('\n');
}

// csv转sheet对象
function csv2sheet(csv) {
    var sheet = {}; // 将要生成的sheet
    csv = csv.split('\n');
    csv.forEach(function(row, i) {
        row = row.split(',');
        if(i == 0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+(csv.length-1);
        row.forEach(function(col, j) {
            sheet[String.fromCharCode(65+j)+(i+1)] = {v: col};
        });
    });
    return sheet;
}

// 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
function sheet2blob(sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
}

/**
 * 通用的打开下载对话框方法，没有测试过具体兼容性
 * @param url 下载地址，也可以是一个blob对象，必选
 * @param saveName 保存文件名，可选
 */
function openDownloadDialog(url, saveName)
{
    if(typeof url == 'object' && url instanceof Blob)
    {
        url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if(window.MouseEvent) event = new MouseEvent('click');
    else
    {
        event = document.createEvent('MouseEvents');
        event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
}

function loadRemoteFile(url) {
    readWorkbookFromRemoteFile(url, function(workbook) {
        readWorkbook(workbook);
    });
}

function exportExcel() {
    var csv = table2csv($('#result table')[0]);
    var sheet = csv2sheet(csv);
    var blob = sheet2blob(sheet);
    openDownloadDialog(blob, '导出.xlsx');
}

function batchImport() {
    let inputObj = document.createElement('input')
    inputObj.setAttribute('type','file');
    inputObj.setAttribute('accept', 'application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    inputObj.setAttribute("style",'display:none');
    inputObj.click();
    inputObj.onchange = function () {
        let f = inputObj.files[0];
        if(!/\.xlsx$/g.test(f.name)) {
            alert('仅支持读取xlsx格式！');
            return;
        }
        let reader = new FileReader();
        reader.onload = function(e) {
            let data = e.target.result;
            let workbook = XLSX.read(data, {type: 'binary'});
            let sheetNames = workbook.SheetNames;
            let worksheet = workbook.Sheets[sheetNames[0]];
            let userList = XLSX.utils.sheet_to_json(worksheet);
            console.log(userList);
            let xhr = new XMLHttpRequest();
            xhr.open("POST", "http://localhost:8085/admin/addUserInfoList");
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send(JSON.stringify({"userList": userList}));
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    let resultObj = JSON.parse(xhr.responseText);
                    if (resultObj.code !== -1) {
                        layer.msg("用户信息导入成功", {icon: 1});
                        setTimeout(function () {
                            window.location.href = 'userManage.html';
                        }, 1000);
                    }
                }
            }
        };
        reader.readAsBinaryString(f);
    }
}

function batchExport() {

}

// function batchExport() {
//     if (window.ids.length === 0) {
//         layer.msg("没有数据可以导出", {icon: 0});
//         //setTimeout(null, 700);
//     }
//     else {
//         let xhr = new XMLHttpRequest();
//         xhr.responseType = "blob";
//         xhr.open("GET", "http://localhost:8085/admin/selectUserListToExcel");
//         xhr.setRequestHeader("ids", window.ids.join("&"));
//         xhr.onload = function () {
//             let downloadElement = document.createElement('a');
//             let url = window.URL.createObjectURL(xhr.response);
//             downloadElement.href = url;
//             let now = new Date();
//             downloadElement.download = "exportInfo" + now.toString();
//             document.body.appendChild(downloadElement);
//             downloadElement.click();
//             document.body.removeChild(downloadElement);
//             window.URL.revokeObjectURL(url);
//         }
//         xhr.send(null);
//         xhr.onreadystatechange = function () {
//             if (xhr.readyState === 4 && xhr.status === 200) {
//                 layer.msg("用户信息导出成功", {icon: 1});
//                 setTimeout(function () {
//                     window.location.href = 'userManage.html';
//                 }, 1000);
//             }
//         }
//     }
// }

function editUserPage() {

    alert("编辑用户")
}
// 修改用户状态（禁用、开启）
function changeStatus(index) {

    alert("修改用户状态")
}

//删除用户
function deleteUser(id) {

    alert("删除用户")
}

