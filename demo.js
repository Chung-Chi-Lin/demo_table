$(document).ready(function () {
    const url = "ajax/ajaxCard";
    const ajaxobj = new AjaxObject(url, 'json');
    ajaxobj.getall();
    // validate
    (function () {
        'use strict';
        const forms = $('.needs-validation');

        Array.prototype.slice.call(forms)
            .forEach(function (form) {
                form.addEventListener('submit', function (event) {
                    if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
                }, false)
            })
    })();
    //  popover
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'))
    const popoverList = popoverTriggerList.map(function (popoverTriggerEl) {
    return new bootstrap.Popover(popoverTriggerEl)
    })
    // tooltip
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    const tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
    })
    // 新增按鈕
    $('.reset').on('click',function(){
        $('input').val('')
    })
    $("#addCrew").click(function (e) {
        const url = "ajax/ajaxCard";
        const cnname = $("#addcnname").val();
        const enname = $("#addenname").val();
        const emil = $("#addEmail").val();
        const sex = $('input:radio:checked[name="addsex"]').val();
        // 判斷中、英文
        const cn = new RegExp("[\u4e00-\u9fff]+")
        const en = new RegExp("[A-Za-z]+")
        if( cn.test(cnname) && en.test(enname)){
            const ajaxobj = new AjaxObject(url, 'json');
            ajaxobj.cnname = cnname;
            ajaxobj.enname = enname;
            ajaxobj.emil = emil;
            ajaxobj.sex = sex;
            ajaxobj.add();
            e.preventDefault(); // avoid to execute the actual submit of the form.
        }
    },)

    // 搜尋人員
    $("#searchCrew").click(function(e){
        console.log(e);
        let value = $("#myInput").val();
        if(value !== '' ) {
            $("#crew tr").filter(function() {
                console.log(this);
                $(this).toggle($(this).text().indexOf(value) > -1)
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: '請輸入內容',
                showConfirmButton: false,
                timer: 1500
            })
        }
    })
    // ShowAllCrew
    $("#showAllCrew").click(function(){
        const url = "ajax/ajaxCard";
        const ajaxobj = new AjaxObject(url, 'json');
        ajaxobj.getall();
    })
    // delCrew
    $("#cardtable").on('click', '.deletebutton', function () {
        const deleteid = $(this).attr('id');
        $('#delModal').modal('show');
        $("#checkDel").click(function () {
            const url = "ajax/ajaxCard";
            const ajaxobj = new AjaxObject(url, 'json');
            ajaxobj.id = deleteid;
            ajaxobj.delete();
        });
    })
    // modifyCrew
    $("#cardtable").on('click', '.modifybutton', function () {
        console.log($(this));
        const modifyid = $(this).attr('id');
        $('#modifyModal').modal('show');
        console.log(modifyid);
        const url = "ajax/ajaxCard";
        const ajaxobj = new AjaxObject(url, 'json');
        const allData = ajaxobj.allData;
        console.log(allData);
        $('#modifycnname').val(allData[modifyid].cnname);
        $('#modifyenname').val(allData[modifyid].enname);
        $('#modifyEmail').val(allData[modifyid].emil);
        $('#modifyPhone').val(allData[modifyid].phone);
        if(allData[modifyid].sex === 0) {
            $("#modifySexMan").prop("checked",true);
        } else {
            $("#modifySexWoman").prop("checked",true);
        }
    })
    
    // 自適應視窗
    $(window).resize(function () {
        var wWidth = $(window).width();
        var dWidth = wWidth * 0.4;
        var wHeight = $(window).height();
        var dHeight = wHeight * 0.4;
    });
});
// 4.setMouse
function mouseEnter(key) {
    const items = document.querySelectorAll('td');
    $('th')[key].style.setProperty('background-color', '#0142928a');
    items.forEach((item, index) => {
        if ((index + 1) % 5 === (key + 1) % 5) {
            item.style.setProperty('background-color', '#16d7fd1e');
        }
    })
};
// 4.removeMouse
function mouseOut(key) {
    const items = document.querySelectorAll('td');
    $('th').css('background-color', '');
    items.forEach((item, index) => {
        if ((index + 1) % 5 === (key + 1) % 5) {
            item.style.removeProperty('background-color', '');
        }
    })
};

function refreshTable(data) {
    // var HTML = '';
    $("#cardtable tbody > tr").remove();
    $.each(data, function (key, item) {
        console.log(key);
        console.log(item);
        var strsex = '';
        if (item.sex == 0){
            strsex = '男';
        }
        else{
            strsex = '女';
        }
        let nameTip = `[${strsex}]${ item.cnname }(${ item.enname })`
        let phone = item.phone.replace(/(\d\d\d\d)(\d\d\d)(\d\d\d)/, "$1-$2-$3");
        var row = $("<tr class='text-center'></tr>");
        row.append($(`<td onmouseout="mouseOut(${0})" onmouseenter="mouseEnter(${0})"></td>`).html(
        `<a tabindex="0" class="btn d-none d-md-inline" data-bs-placement="top" role="button" data-bs-toggle="popover" data-bs-trigger="focus" data-bs-content="聯絡方式：${phone}"><i class="bi bi-telephone-fill btn-h"></i></a>
        `+ `<button type="button" class="btn" data-bs-toggle="tooltip" data-bs-placement="top" title=${nameTip}>
        ${item.cnname}
        </button>`));
        row.append($(`<td onmouseout="mouseOut(${1})" onmouseenter="mouseEnter(${1})"></td>`).html(item.enname));
        row.append($(`<td onmouseout="mouseOut(${2})" onmouseenter="mouseEnter(${2})"></td>`).html(item.emil));
        row.append($(`<td onmouseout="mouseOut(${3})" onmouseenter="mouseEnter(${3})"></td>`).html(strsex));
        row.append($(`<td onmouseout="mouseOut(${4})" onmouseenter="mouseEnter(${4})"></td>`).html(
        `<button type="button" class="btn modifybutton" id="${key}">
            <i class="bi bi-pencil-fill btn-h"></i>
        </button>
        <button type="button" class="btn deletebutton" id="${key}">
            <i class="bi bi-trash-fill text-danger"></i>
        </button>`));
        $("#cardtable").prepend(row);
        //  data-bs-toggle="modal" data-bs-target="#delModal"
    });
}

function initEdit(response) {
var modifyid = $("#cardtable").attr('id').substring(12);
$("#mocnname").val(response[0].cnname);
$("#moenname").val(response[0].enname);
if (response[0].sex == 0) {
    $("#modifyman").prop("checked", true);
    $("#modifywoman").prop("checked", false);
}
else {
    $("#modifyman").prop("checked", false);
    $("#modifywoman").prop("checked", true);
}
$("#modifysid").val(modifyid);
$("#dialog-modifyconfirm").dialog({
    resizable: true,
    height: $(window).height() * 0.4,// dialog視窗度
    width: $(window).width() * 0.4,
    modal: true,
    buttons: {
        // 自訂button名稱
        "修改": function (e) {
            // $("#modifyform").submit();
            var url = "ajax/ajaxCard";
            var cnname = $("#mocnname").val();
            var enname = $("#moenname").val();
            var sex = $('input:radio:checked[name="mosex"]').val();
            var ajaxobj = new AjaxObject(url, 'json');
            ajaxobj.cnname = cnname;
            ajaxobj.enname = enname;
            ajaxobj.sex = sex;
            ajaxobj.id = modifyid;
            ajaxobj.modify();

            e.preventDefault(); 
        },
        "重新填寫": function () {
            $("#modifyform")[0].reset();
        },
        "取消": function () {
            $(this).dialog("close");
        }
    },
    error: function (exception) { alert('Exeption:' + exception); }
});
}

/**
* 
* @param string
*          url 呼叫controller的url
* @param string
*          datatype 資料傳回格式
* @uses refreshTable 利用ajax傳回資料更新Table
*/
function AjaxObject(url, datatype) {
    this.url = url;
    this.datatype = datatype;

}
AjaxObject.prototype.cnname = '';
AjaxObject.prototype.enname= '';
AjaxObject.prototype.sex = '';
AjaxObject.prototype.emil = '';
AjaxObject.prototype.phone = '';
AjaxObject.prototype.id = 0;
AjaxObject.prototype.alertt = function () {
    alert("Alert:");
}
AjaxObject.prototype.allData = [
    {s_sn:'35',cnname:'邱小甘', enname:'Peter',emil:'abc5288@gmail.com', sex:0,phone:'0925987648'},
    {s_sn:'49',cnname:'蔡凡昕', enname:'Allen',emil:'def0188@yahoo.com.tw', sex:1,phone:'0988168528'},
    {s_sn:'50',cnname:'趙雪瑜', enname:'Sharon',emil:'ghi6680@gmail.com', sex:0,phone:'096688178'},
    {s_sn:'51',cnname:'賴佳蓉', enname:'Yoki',emil:'jkl178@gmail.com', sex:1,phone:'0925178948'}
]
AjaxObject.prototype.getall = function () {
    refreshTable(this.allData);
}
AjaxObject.prototype.add = function () {
    this.allData.push({cnname: this.cnname, enname: this.enname,emil: this.emil, sex: this.sex,phone: this.phone});
    refreshTable(this.allData);
    $('#addModal').modal('hide');
    $('input').val('');
}
AjaxObject.prototype.modify = function () {
response = '[{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"}]';
refreshTable(JSON.parse(response));
$("#dialog-modifyconfirm").dialog("close");
}
AjaxObject.prototype.modify_get = function () {
response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"},{"s_sn":"49","cnname":"蔡凡昕","enname":"Allen","sex":"0"},{"s_sn":"50","cnname":"趙雪瑜","enname":"Sharon","sex":"0"},{"s_sn":"51","cnname":"賴佳蓉","enname":"Yoki","sex":"1"}]';
initEdit(JSON.parse(response));
}
AjaxObject.prototype.search = function () {
response = '[{"s_sn":"35","cnname":"邱小甘","enname":"Peter","sex":"0"}]';
refreshTable(JSON.parse(response));
$("#dialog-searchconfirm").dialog("close");
}
AjaxObject.prototype.delete = function () {
    console.log('to delete', this.allData[this.id]);
    this.allData.splice(this.id, 1);
    refreshTable(this.allData);
    $('#delModal').modal('hide');
}
