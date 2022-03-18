"use strict";
/*--------------------------------------------------------------*
 * 퍼블 *
 *--------------------------------------------------------------*/

/*--------------------------------------------------------------*
 * 개발 *
 *--------------------------------------------------------------*/
var devJoinInputObj = {
    isUserIdRegExp: false, //아이디 정규식 규칙 플레그
    isUserIdDoubleCheck: false, //아이디 중복 체크 플레그
    isEmailRegExp: false, //이메일 정규식 규칙 플레그
    isEmailDoubleCheck: false, //이메일 중복 체크 플레그
    isCompanyCertify: false, //담당자 휴대폰 인증 플레그
    useCertify: $('#devUseCertify').val(),
    $emailDoubleCheckButton: $('#devEmailDoubleCheckButton'),
    userIdDoubleCheckResponse: function (response) {
        var self = devJoinInputObj;
        if (response.result == "success") {
            self.isUserIdDoubleCheck = true;
            $('#devUserIdDoubleCheckButton').attr('disabled', true);

            common.noti.tailMsg('devUserId', common.lang.get('joinInput.common.validation.userId.success'), 'success');
        } else if (response.result == "fail") {
            common.noti.tailMsg('devUserId', common.lang.get('joinInput.common.validation.userId.fail'));
        } else {
            common.noti.alert("system error");
        }
    },
    emailDoubleCheckResponse: function (response) {
        var self = devJoinInputObj;
        var $emailDoubleCheckButton = devJoinInputObj.$emailDoubleCheckButton;
        if (response.result == "success") {
            self.isEmailDoubleCheck = true;
            $emailDoubleCheckButton.attr('disabled', true);
            common.noti.tailMsg('devEmail', common.lang.get("joinInput.common.validation.email.success"), 'success');
        } else if (response.result == "fail") {
            common.noti.tailMsg('devEmail', common.lang.get("joinInput.common.validation.email.fail"));
        } else if (response.result == "wrongEmail") {
            common.noti.tailMsg('devEmail', common.lang.get("joinInput.common.validation.email.wrong"));
        } else {
            common.noti.alert("system error");
        }
    },
    authCancel: function () {
        return document.location.href = '/';
    },
    zipResponse: function (response) {
        $('#devZip').val(response.zipcode);
        $('#devAddress1').val(response.address1);
    },
    beforeCallback: function ($form) {
        var self = devJoinInputObj;
        //아이디 관련 체크
        if (self.isUserIdRegExp != true || self.isUserIdDoubleCheck != true) {
            common.noti.alert(common.lang.get('joinInput.common.validation.userId.doubleCheck'));
            return false;
        }
        //이메일 관련 체크
        if (self.isEmailRegExp != true || self.isEmailDoubleCheck != true) {
            common.noti.alert(common.lang.get('joinInput.common.validation.email.doubleCheck'));
            return false;
        }

        return common.validation.check($form, 'alert', false);
    },
    authIssueCallback: function () {
        return location.href = '/';
    },
    doubleIdCallback: function () {
        $('#devUserId').val('');
        common.util.focus($('#devUserId').get(0));
    },
    getEmail: function () {
        return $('#devEmail').val().trim();
    },
    checkEmail: function () {
        var self = devJoinInputObj;
        var $emailDoubleCheckButton = devJoinInputObj.$emailDoubleCheckButton;
        self.isEmailRegExp = false;
        self.isEmailDoubleCheck = false;

        $emailDoubleCheckButton.attr('disabled', false);

        var result = common.validation.checkElement($('#devEmail').get(0));
        if (result.success) {
            self.isEmailRegExp = true;
            common.noti.tailMsg('devEmail', common.lang.get("joinInput.common.validation.email.doubleCheck"));
        } else {
            common.noti.tailMsg('devEmail', result.message);
        }
    },
    comZipResponse: function (response) {
        $('#devComZip').val(response.zipcode);
        $('#devComAddress1').val(response.address1);
    },
    successCallback: function (response) {
        var self = devJoinInputObj;
        if (response.result == "success") {
            return location.href = '/member/joinEnd';
        } else if (response.result == "sessionIssue") { //세션 이슈
            common.noti.alert(common.lang.get('joinInput.common.validation.member.css.sessionIssue'));
        } else if (response.result == "authIssue") { //인증 데이터 이슈
            common.noti.alert(common.lang.get('joinInput.common.validation.member.css.authIssue', self.authIssueCallback));
        } else if (response.result == "doubleId") { //중복된 아이디
            common.noti.alert(common.lang.get('joinInput.common.validation.member.css.doubleId', self.doubleIdCallback));
        } else {
            common.noti.alert('system error');
        }
    },
    companyBeforeCallback: function ($companyform) {
        var self = devJoinInputObj;
        //아이디 관련 체크
        if (self.isUserIdRegExp != true || self.isUserIdDoubleCheck != true) {
            common.noti.alert(common.lang.get('joinInput.common.validation.userId.doubleCheck'));
            return false;
        }
        //이메일 관련 체크
        if (self.isEmailRegExp != true || self.isEmailDoubleCheck != true) {
            common.noti.alert(common.lang.get('joinInput.common.validation.email.doubleCheck'));
            return false;
        }
        //
        if (self.isCompanyCertify != true) {
            common.noti.alert(common.lang.get('joinInput.common.validation.companyCertify.fail'));
            return false;
        }
        return common.validation.check($companyform, 'alert', false);
    },
    companySuccessCallback: function (response) {
        var self = devJoinInputObj;
        if (response.result == "success") {
            return location.href = '/member/joinEnd';
        } else if (response.result == "sessionIssue") { //세션 이슈
            common.noti.alert(common.lang.get('joinInput.common.validation.member.css.sessionIssue'));
        } else if (response.result == "authIssue") { //인증 데이터 이슈
            common.noti.alert(common.lang.get('joinInput.common.validation.member.css.authIssue', self.companyAuthIssueCallback));
        } else if (response.result == "doubleId") { //중복된 아이디
            common.noti.alert(common.lang.get('joinInput.common.validation.member.css.doubleId', self.companyDoubleIdCallback));
        } else {
            common.noti.alert('system error');
        }
    },
    companyAuthIssueCallback: function () {
        return  location.href = '/';
    },
    companyDoubleIdCallback: function () {
        $('#devUserId').val('');
        common.util.focus($('#devUserId').get(0));
    },
    getComEmail: function () {
        return $('#devComEmail').val().trim();
    },
    checkComEmail: function () {
        var result = common.validation.checkElement($('#devComEmail').get(0));
        if (result.success) {
            common.noti.tailMsg('devComEmail', '');
        } else {
            common.noti.tailMsg('devComEmail', result.message);
        }
    },
    initEvent: function () {
        // sns로그인 팝업
        $('.devSnsJoin').on('click', function (e) {
            e.preventDefault();
            var url = $(this).data('href');
            location.href = url;
            // common.util.popup(url, 600, 800);
        });

        //apple 로그인
        $('.devAppleLogin').click(function (e) {
            e.preventDefault();
            window.webkit.messageHandlers.getSNSApple.postMessage('');
        });

    },
    initLang: function () {
        common.lang.load('joinInput.cancel.confirm', "회원 가입을 취소하시겠습니까?"); //Confirm_01
        common.lang.load('joinInput.common.validation.userId.doubleCheck', "아이디 중복 확인을 해주세요.");
        common.lang.load('joinInput.common.validation.userId.fail', "이미 사용중인 아이디입니다.");
        common.lang.load('joinInput.common.validation.userId.success', "사용 가능한 아이디 입니다.");
        common.lang.load('joinInput.common.validation.userPassword.fail', "영문 대소문자, 숫자, 특수문자 중 3개 이상을 조합하여 8자리 이상 입력해 주세요.");
        common.lang.load('joinInput.common.validation.userPassword.success', "사용 가능한 비밀번호 입니다.");
        common.lang.load('joinInput.common.validation.userComparePassword.fail', "비밀번호 확인을 위해 다시 한번 입력해 주세요.");
        common.lang.load('joinInput.common.validation.email.doubleCheck', "이메일 중복 확인을 해주세요.");
        common.lang.load('joinInput.common.validation.email.success', "사용 가능한 이메일입니다.");
        common.lang.load('joinInput.common.validation.email.fail', "이미 사용중인 이메일입니다.");
        common.lang.load('joinInput.common.validation.email.wrong', "이메일을 올바르게 입력해 주세요.");
        common.lang.load('joinInput.common.validation.member.css.sessionIssue', "오랜 시간 지연으로 회원가입이 실패되었습니다.{common.lineBreak}다시 진행해 주세요."); //Alert_85
        common.lang.load('joinInput.common.validation.member.css.authIssue', "올바르지 않은 본인인증 접근 경로입니다."); //Alert_86
        common.lang.load('joinInput.common.validation.member.css.doubleId', "동일한 아이디가 존재합니다.{common.lineBreak}다른 아이디로 입력해 주세요."); //Alert_87
        common.lang.load('joinInput.common.validation.companyCertify.fail', "휴대폰 인증을 해주세요.");
        common.lang.load('joinInput.company.file.find', "파일찾기");
        common.lang.load('joinInput.company.file.change', "파일변경");
        common.lang.load('joinInput.company.file.confirm.delete', "파일을 삭제하시겠습니까?");
    },
    initFormat: function () {
        //-----set input format
        common.inputFormat.set($('#devUserId,#devUserPassword,#devCompareUserPassword'), {'maxLength': 20});
        common.inputFormat.set($('#devEmail'), {'maxLength': 50});
        common.inputFormat.set($('#devPcs2,#devPcs3'), {'number': true, 'maxLength': 4});
        common.inputFormat.set($('#devTel2,#devTel3'), {'number': true, 'maxLength': 4});
        common.inputFormat.set($('#comPhone2,#comPhone3'), {'number': true, 'maxLength': 4});
        common.inputFormat.set($('#devComCeo,#devUserName'), {'maxLength': 20});
        common.inputFormat.set($('#devComPcs2,#devComPcs3'), {'number': true, 'maxLength': 4});
        common.inputFormat.set($('#devBusinessFile'), {'fileFormat': 'image', 'fileSize': 30});

        $('#devEmailHost').val($('#devEmailHostSelect option:selected').val());
    },
    initValidation: function () {
        //-----set validation
        common.validation.set($('#devUserId'), {'required': true, 'dataFormat': 'userId'});
        common.validation.set($('#devUserPassword'), {'required': true, 'dataFormat': 'userPassword'});
        common.validation.set($('#devCompareUserPassword'), {'required': true, 'compare': '#devUserPassword'});
        common.validation.set($('#devEmail'), {
            'required': true,
            'dataFormat': 'email',
            'getValueFunction': 'devJoinInputObj.getEmail'
        });
        common.validation.set($('#devPcs2,#devPcs3'), {'required': true});
        common.validation.set($('#comPhone2,#comPhone3'), {'required': true});
        common.validation.set($('#devUserBirthday1,#devUserBirthday2,#devUserBirthday3'), {'required': true});
        common.validation.set($('#devComZip,#devComAddress1,#devComAddress2'), {'required': true});
        common.validation.set($('#devComCeo,#devUserName'), {'required': true});
        common.validation.set($('#devComEmail'), {
            'required': true,
            'dataFormat': 'email',
            'getValueFunction': 'devJoinInputObj.getComEmail'
        });
        common.validation.set($('#devComPcs2,#devComPcs3'), {'required': true});
        common.validation.set($('#devBusinessFile'), {'required': true});
    },
    initCommonEvent: function () {
        var self = devJoinInputObj;
        var $emailDoubleCheckButton = devJoinInputObj.$emailDoubleCheckButton;

        //아이디 입력시 정규식 체크
        $('#devUserId').on({
            'input': function (e) {
                if (self.isUserIdDoubleCheck == true) {
                    $('#devUserIdDoubleCheckButton').attr('disabled', false);
                }

                self.isUserIdRegExp = false;
                self.isUserIdDoubleCheck = false;
                if (common.validation.check($(this))) {
                    self.isUserIdRegExp = true;
                    common.noti.tailMsg(this.id, common.lang.get('joinInput.common.validation.userId.doubleCheck'));
                }
            }
        });
        //아이디 중복 체크
        $('#devUserIdDoubleCheckButton').click(function (e) {
            e.preventDefault();
            self.isUserIdDoubleCheck = false;
            if (self.isUserIdRegExp == true) {
                common.ajax(common.util.getControllerUrl('userIdCheck', 'member'), {'userId': $('#devUserId').val()}, "", self.userIdDoubleCheckResponse);
            }
        });
        //비밀번호 체크
        $('#devUserPassword').on({
            'input': function (e) {
                if (common.validation.check($(this))) {
                    common.noti.tailMsg(this.id, common.lang.get('joinInput.common.validation.userPassword.success'), 'success');
                } else {
                    common.noti.tailMsg(this.id, common.lang.get('joinInput.common.validation.userPassword.fail'));
                }
            }
        });
        //비밀번호 확인 체크
        $('#devCompareUserPassword').on({
            'input': function (e) {
                if (common.validation.check($(this))) {
                    common.noti.tailMsg(this.id, "");
                } else {
                    if ($('#devCompareUserPassword').val() == '') {
                        common.noti.tailMsg(this.id, common.lang.get('joinInput.common.validation.userComparePassword.fail'));
                    }
                }
            }
        });
        //이메일 체크
        $('#devEmail').on({
            'input': function (e) {
                self.checkEmail();
            }
        });
        //이메일 서버 선택
        $('#devEmailHostSelect').change(function (e) {
            var selectValue = $(this).val();
            var $emailHost = $('#devEmailHost');
            $emailHost.val(selectValue);
            if (selectValue != '') {
                $emailHost.attr('readonly', true);
            } else {
                $emailHost.attr('readonly', false);
            }
            self.checkEmail();
        });

        //이메일 중복 체크        
        $emailDoubleCheckButton.click(function (e) {
            e.preventDefault();
            self.checkEmail();
            if (self.isEmailRegExp == true) {
                common.ajax(common.util.getControllerUrl('emailCheck', 'member'), {'email': self.getEmail}, "", self.emailDoubleCheckResponse);
            }
        });
        //취소
        $('#devCancelButton').click(function (e) {
            e.preventDefault();
            common.noti.confirm(common.lang.get('joinInput.cancel.confirm'), self.authCancel);
        });
    },
    initMemberEvent: function () {
        //-----일반회원 가입        
        var self = devJoinInputObj;
        var $form = $('#devBasicForm');
        var url = common.util.getControllerUrl('joinInputBasic', 'member');
        //주소 찾기
        $('#devZipPopupButton').click(function (e) {
            e.preventDefault();
            common.util.zipcode.popup(self.zipResponse);
        });

        $('#devBasicSubmitButton').click(function (e) {
            e.preventDefault();
            $form.submit();
        });

        // 일반회원 가입
        common.form.init($form, url, self.beforeCallback, self.successCallback);
    },
    initCompanyMemberEvent: function () {
        var self = devJoinInputObj;
        var $companyform = $('#devCompanyForm');
        var companyUrl = common.util.getControllerUrl('joinInputCompany', 'member');

        //-----사업자회원 가입
        //사업자 주소 찾기
        $('#devComZipPopupButton').click(function (e) {
            e.preventDefault();
            common.util.zipcode.popup(self.comZipResponse);
        });

        //대표 이메일 체크
        $('#devComEmail').on({
            'input': function (e) {
                self.checkComEmail();
            }
        });
        $('#devComEmailHostSelect').change(function (e) {
            var selectValue = $(this).val();
            var $comEmailHost = $('#devComEmailHost');
            $comEmailHost.val(selectValue);
            if (selectValue != '') {
                $comEmailHost.attr('readonly', true);
            } else {
                $comEmailHost.attr('readonly', false);
            }
            self.checkComEmail();
        });

        //이메일 도메인 입력
        $('#devDirectInputComEmailCheckBox').click(function() {
            var $this = $(this);
            var selectBox = $this.closest('.check-direct').siblings('.wrap-multi-input').find('select');
            
            if($this.is(":checked") == true) {                
                $('#devComEmailHost').val('');
                $('#devComEmailHost').show();
                selectBox.hide();
            } else {
                $('#devComEmailHost').hide();
                $('#devComEmailHost').val($('#devComEmailHostSelect').val());
                selectBox.show();
            }
        });

        //본인 인증
        $('#devCertifyButton').click(function (e) {
            e.preventDefault();
            common.certify.request('certify');
        });
        //본인, 아이핀 인증 응답 공통
        common.certify.setSuccess(function (data) {
            self.isCompanyCertify = true;
            $('#devCertifyPcsText').val(data.pcs).css("display", "block");
            $('#devCertifyButton').remove();
        });
        common.certify.setFail(function (message) {
            self.isCompanyCertify = false;
            common.noti.alert(message);
        });

        $('#devCompanySubmitButton').click(function (e) {
            e.preventDefault();
            $companyform.submit();
        });

        common.form.init($companyform, companyUrl, self.companyBeforeCallback, self.companySuccessCallback);
    },
    run: function () {
        var self = devJoinInputObj;
        self.initLang();
        self.initEvent();
        self.initFormat();
        self.initValidation();
        self.initCommonEvent();
        self.initMemberEvent();
        self.initCompanyMemberEvent();
    }
};

var devPhoto = {
    appCamera: false,
    appPhoto: false,
    initEvent: function () {
        var self = devPhoto;

        $('#devBusinessFile').click(function (e) {
            var chk = true;

            if (devAppType == 'iOS') {
                chk = self.iosCheck(e);
            }

            if (chk === true) {
                self.fileAttachments();
            }
        });

        $('#devBusinessFileDeleteButton').click(function (e) {
            self.fileDelete();
        });

    },
    getFile: function () {
        if (devAppType == 'iOS') {
            //아이폰용
            try {
                webkit.messageHandlers.showAuthority.postMessage("");
            } catch (err) {
                console.log(err);
            }
        } else if (devAppType == 'Android') {
            //안드로이드용
        }
    },
    getLoad: function () {
        if (devAppType == 'iOS') {
            //아이폰용
            try {
                webkit.messageHandlers.initStatusAuthority.postMessage("");
            } catch (err) {
                console.log(err);
            }
        } else if (devAppType == 'Android') {
            //안드로이드용
        }
    },
    FileChangeEvent: function ($file, $fileWrap, $imageWrap, $image) {
        if ($file.val() != "") {
            $fileWrap.hide();
            $imageWrap.show();
            common.util.previewFile($file, $image);
        } else {
            $fileWrap.show();
            $imageWrap.hide();
            $image.attr('src', '');
        }
    },
    fileAttachments: function () {
        var $file = $('#devBusinessFile');
        var $fileWrap = $('#devBusinessFileWrap');
        var $imageWrap = $('#devBusinessFileImageWrap');
        var $image = $('#devBusinessFileImage');
        //var $fileDeleteButton = $('#devBusinessFileDeleteButton'+num);

        $file.change(function () {
            if(devAppType == 'iOS' || devAppType == 'Android' ) {
                devPhoto.FileChangeEvent($file, $fileWrap, $imageWrap, $image);
            } else {
                devPhoto.FileChangeEvent($file, $fileWrap, $imageWrap, $image);
            }
        });
    },
    fileDelete: function () {
        var $file = $('#devBusinessFile');
        var $fileWrap = $('#devBusinessFileWrap');
        var $imageWrap = $('#devBusinessFileImageWrap');
        var $image = $('#devBusinessFileImage');

        if (common.noti.confirm(common.lang.get('write.customer.file.confirm.delete'))) {
            $file.val('');
            devPhoto.FileChangeEvent($file, $fileWrap, $imageWrap, $image);
        }
    },
    setShowAuthority: function (camera, photo) {
        devPhoto.appCamera = camera;
        devPhoto.appPhoto = photo;
    },
    iosCheck: function (e) {
        if (devPhoto.appCamera == 'N' && devPhoto.appPhoto == 'N') {
            devPhoto.getFile();
        }

        if (devPhoto.appCamera == 'N' && devPhoto.appPhoto == 'N') {
            e.preventDefault();
            return false;
        } else {
            return true;
        }
    },
    run: function () {
        devPhoto.getLoad();
    }
};


$(function () {
    devJoinInputObj.run();
    devPhoto.initEvent();
    devPhoto.run();
});

function setSNSApple(data) {
    data = JSON.parse(data);
    common.ajax(
        common.util.getControllerUrl('apple', 'member')
        , {
            id: data.sub
            , mode: 'join'
        }
        , false
        , function (result) {
            if (result.result == 'success') {
                $('#devAppleId').val(result.data.id);
                $('#devAppleIdBtn').attr('disabled', true);

            } else if (result.result == 'existsSnsId') {
                common.noti.alert(common.lang.get('joinInput.common.validation.userId.existsSnsId'));
            } else {
                common.noti.alert(common.lang.get('coupon.download.fail'));
            }
        });

}