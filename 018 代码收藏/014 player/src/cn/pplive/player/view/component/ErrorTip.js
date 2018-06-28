/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import { CommonUI } from "./CommonUI";
import { UIComponent } from "./UIComponent";
import { H5Common } from "common/H5Common";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5ComponentEvent from "../event/H5ComponentEvent";

export class ErrorTip extends UIComponent {

	constructor(container) {
        super();
        let errorid = 'p-error';
        try {
			if ($('#' + errorid).length == 0) {
				this.errTip = $('<div/>', {
                    'id' : errorid
                });
                this.errTip.appendTo(container);
			}
        }catch(e){ }
        this.target = this.errTip;
    }

    resize() {
        try{
            let contentDom = this.errTip.children().eq(0);
            contentDom.css({
                'left' : Global.getInstance().pbox.width() - contentDom.width() >> 1,
                'top' : Global.getInstance().pbox.height() - contentDom.height() >> 1
            });
        }catch(e){}
    }
	
    /**
     * 
     * @param {*} errorcode   错误码
     */
    setData(errorcode, ...rest) {
        this.errorcode = errorcode;
        let tempCon = '',
            con = [
                '<div class="error-content">',
                    '<div class="error-img"/>',
                    '<div class="error-txt">[TITLE]<br>[CONTENT]<br>[BUTTON]<a href="javascript:void(0);" class="feedbackbtn">提交反馈</a><br>错误代码：'+errorcode+'</div>',
                '</div>'
            ];
        if (errorcode == 216) {
            con.splice(1, con.length-2, '<div class="copyright-text">',
                                            '<span style="color: #ffcf8d;font-size: 21px;">尊敬的用户：</span><br>',
                                            '<span style="color: #e5e5e5;">您正在观看的节目为PP视频客户端专属节目，请在PP视频客户端内观看。</span>',
                                        '</div>',
                                        '<div class="copyright-image">',
                                            '<div class="download-client">打开PP视频客户端免费看</div>',
                                            '<div class="copyright"/>',
                                            '<div class="download-app">',
                                                '<img width="100px" height="100px" src="'+H5CommonUtils.getDomainUrl()+'/dist/assets/ppsport.png"/>',
                                                '<span>您也可以下载<br>PP体育APP免费观看</span>',
                                            '</div>',
                                        '</div>');
        }
        con = con.join('');
        //当pc端环境时，类名前加 "w-" 前缀
        if (!Global.getInstance().isMobile) {
            con = H5CommonUtils.replaceClassPrefix(con, 'w-');
        }
        //
        let $temp, num = 5,
            replaceAll = (title, content, button) => con.replace(/\[TITLE\]/g, title).replace(/\[CONTENT\]/g, content).replace(/\[BUTTON\]/g, button),
            countdown = () => {
                            let inter = setInterval(() => {
                                if (num > 0) {
                                    num--;
                                    $temp = tempCon.replace(/\[NUM\]/g, num);
                                    this.errTip.html($temp);
                                    this.resize();
                                } else {
                                    clearInterval(inter);
                                    window.location.reload();
                                }
                            }, 1 * 1000)
                        };
        if (errorcode == 510) {
            tempCon = replaceAll(
                '<span class="f_txt">很抱歉，一大波人排队进来中...</span>', 
                '<span class="s_txt">熊小猫正在请程序员哥哥来帮忙</span>', 
                '<span class="t_txt"><a class="udpate">点我刷新试试</a></span>');
        } else if (errorcode == 210 || errorcode == 211) {
            tempCon = replaceAll(
                '<span class="f_txt">很抱歉，由于版权限制</span>', 
                '<span class="s_txt">您所在的地区无法播放该节目</span>', 
                '<span class="t_txt"><a href="//www.pptv.com" target="_top">去首页&nbsp;</a> 换个心情吧</span>');
        } else if (errorcode == 3002) {
            tempCon = replaceAll(
                '<span class="f_txt">信号调试中，请稍后再试...</span>', 
                '<span class="s_txt">熊小猫正在请程序员哥哥来帮忙</span>', 
                '<span class="t_txt"><a href="//www.pptv.com" target="_top">去首页&nbsp;</a> 换个心情吧</span>');
        } else if (errorcode == 2005) {
            if(rest && rest.length > 0) {
                tempCon = replaceAll(
                    '<span class="f_txt">您观看的节目【'+rest[0][0]['title']+'】</span>', 
                    '<span class="s_txt">仅限PP视频播放</span>',
                    '<span class="t_txt"><a href="'+rest[0][0]['link']+'" target="_top">立即观看</a></span>');
            }
        } else {
            tempCon = replaceAll(
                '<span class="f_txt">很抱歉，该节目信息加载异常</span>', 
                '<span class="s_txt">熊小猫正在请程序员哥哥来帮忙</span>', 
                '<span class="t_txt"><a href="//www.pptv.com" target="_top">去首页&nbsp;</a> 换个心情吧</span>');
        }
        this.errTip.html(tempCon);
        if (errorcode == 216) {
            this.checkPort(()=>{
                Global.getInstance().bip.setValue('ppva', 1, false);
                this.isDownloadClient = true;
                this.addTjId();
            }, ()=>{
                this.isDownloadClient = false;
                if (Global.getInstance().bip.getValue('ppva')) {
                    this.isDownloadClient = true;
                }
                this.addTjId();
            });
            this.errTip.find('.w-download-client').on('click', (e)=>{
                if (this.isDownloadClient) {
                    let cframe = document.createElement("iframe");  
                    cframe.src =`pptv://${Global.getInstance().pObj['pl']}`;
                    top.document.body.appendChild(cframe);
                } else {
                    top.location.href = `${H5Common.client_url}`;
                }
            });
        }
        //非正常渠道播放时隐藏提交反馈
        if (errorcode == 2005) {
            this.errTip.find('div[class$="feedbackbtn"]').css({'display' : 'none'});
        }
        if ($('.udpate').length != 0) {
            $('.udpate').on('click', (e) => {
                tempCon = replaceAll(
                    '<span class="f_txt">一大波人排队进来中...</span>', 
                    '<span class="s_txt">熊小猫正在请程序员哥哥来帮忙</span>', 
                    '<font style="color:#666;">点我刷新试试 [NUM]</font>');
                $temp = tempCon.replace(/\[NUM\]/g, num);
                this.errTip.html($temp);
                this.resize();
                countdown();
            });
        }
        this.handle();
    }

    checkPort(success, fail) {
        let synacast = document.createElement('script');
        synacast.src = 'http://127.0.0.1:9000/synacast.xml';
        synacast.onload = function(data) {
            success();
        }
        synacast.onerror = function() {
            fail()
        }
        top.document.body.appendChild(synacast);
    }

    addTjId() {
        this.errTip.find('.w-download-client').attr('tj_id', this.isDownloadClient?'zhibo_dakai':'zhibo_xiazai').html(`${this.isDownloadClient?'打开':'下载'}PP视频客户端免费看`);
    }

    handle() {
        try{
            let feedbackCon = [
                '<div class="feedback" style="display:none;">',
                    '<div class="mask">',
                        '<div class="mask-hd">',
                            '<h3>我要反馈</h3>',
                            '<a class="mask-close" href="javascript:;">X</a>',
                        '</div>',
                        '<div class="mask-bd">',
                            '<p>请尽量留下您的完整联系方式，<br>以便我们更好的为您解决问题！</p>',
                            '<form class="mask_form">',
                                '<div class="con qq">',
                                    '<span>Q  Q :</span><input type="text" placeholder="请输入您的QQ账号">',
                                '</div>',
                                '<div class="con tel">',
                                    '<span>电话 :</span><input type="text" maxlength="11" placeholder="请输入您的联系电话">',																
                                '</div>',
                                '<div class="cont_txt">',
                                    '<span>请输入联系方式！</span>',
                                '</div>',
                                '<div class="mask-btn">',
                                    '<a href="javascript:;" class="submit">提&nbsp;交</a>',
                                    '<a href="javascript:;" class="cancel">取&nbsp;消</a>',
                                '</div>',
                            '</form>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join('');
            if (!Global.getInstance().isMobile) {
                feedbackCon = H5CommonUtils.replaceClassPrefix(feedbackCon, 'w-');
            }
            this.feedback = Global.getInstance().pbox.find('div[class$="feedback"]');
            if (this.feedback.length == 0) {
                this.feedback = $(feedbackCon);
                this.feedback.appendTo(Global.getInstance().pbox);
            }
            this.feedBackCloseBtn = this.feedback.find('a[class$="mask-close"]');
			this.feedbackSubmit = this.feedback.find('a[class$="submit"]');
			this.feedbackCancel = this.feedback.find('a[class$="cancel"]');
			this.qqInput = this.feedback.find('.qq input');
			this.telInput = this.feedback.find('.tel input');
            this.contHide = this.feedback.find('div[class$="cont_txt"]');
            //
			this.feedbackBtn = this.errTip.find('a[class$="feedbackbtn"]');
			this.feedbackBtn.on('click', (e) => {
                this.feedback.show();
			});
			
			this.feedbackSubmit.on('click', (e) => {
				if(this.qqInput[0].value.length == 0 && this.telInput[0].value.length == 0){
					this.contHide.css('display', 'block');
					return;
				}
				this.feedbackAjax({
								'errorcode':this.errorcode,
								'extra1' : 'code=' + this.errorcode +  ((this.qqInput.val()) ? ('#qq=' + this.qqInput.val()) : '') + ((this.telInput.val()) ? ('#tel=' + this.telInput.val()) : '')
								},
								()=>{
									this.feedbackBtn.css({
                                        'pointer-events': 'none',
                                        'opacity' : 0
                                    });
                                    alert('反馈已收到，故障排查中');
								});
				this.feedback.hide();
				this.qqInput[0].value = '';
				this.telInput[0].value = '';
			});
			
			[this.feedBackCloseBtn, this.feedbackCancel].forEach((item)=>{
				$(item).on('click', (e) => {
					this.feedback.hide();
                    this.feedbackBtn.css({
                        'pointer-events': 'auto',
                        'opacity' : 1
                    });
					this.contHide.css('display', 'none');
				});
			});

			$.each([this.qqInput, this.telInput], (index, item) => {
				item.on('keyup input focus', (e)=>{
					switch(e.type) {         
                        case 'keyup':    //pc端模拟器走keyup事件
						case 'input':    //移动端走input事件
                            e.target.value = e.target.value.replace(/[^\d]/g,'');
							break;
                        case 'focus':
							this.contHide.css('display', 'none');
							break;
						default:
							break;
					}
				});
			});
		}catch(e){ }
    }
    
}