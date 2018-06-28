/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import { UIComponent } from "./UIComponent";
import { CommonUI } from "./CommonUI";
import { H5Common } from "common/H5Common";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5ComponentEvent from "../event/H5ComponentEvent";

const contentClass = "w-content";
const triangleClass = "w-triangle";

export class ButtonTip extends UIComponent {

	constructor(container) {
        super();
        this.container = container;
        let tipId = 'w-button-tip';
		if ($('#' + tipId).length == 0) {
            this.btip = $('<div/>', {
                'id' : tipId,
            });
            this.btip.appendTo(this.container);
        }
        let content = [
            `<div class="${contentClass}" />`,
            `<div class="${triangleClass}" />`
        ].join('');
        this.btip.html(content);
        this.target = this.btip;
        //
        this.btip.on('click', (e) => {
            if (this.className === 'w-rate') {
                this.sendEvent('change_rate', {
                    'currftName' : $(e.target).attr('ft-name')
                });
            }
            if (this.className === 'w-setting') {
                $(e.target).find('span')[$(e.target).find('span').hasClass('select')?'removeClass':'addClass']('select');
                this.sendEvent('change_setting', {
                    'type' : $(e.target).attr('attr_type'),
                    'select' : Number($(e.target).find('span').hasClass('select'))
                });
            }
            if (this.className === 'w-language') {
                this.sendEvent('change_language', {
                    'chid' : e.target.className.split(' ')[1].split('-')[2]
                });
            }
            if (this.className === 'w-volume-slider') {
                this.sendEvent('change_volume', {
                    'currY' : e.clientY - (Global.getInstance().pbox.offset().top - $(window).scrollTop()) - this.btip.position().top
                });
            }                    
        });
        this.btip.on('mouseenter', (e) => {
            this.sendEvent('show_btn_tip', {
                'isShow' : 1
            });
        });
        this.btip.on('mouseleave', (e) => {
            this.sendEvent('show_btn_tip');
        });
    }

    set className(name) {
        try{
            this.btip[0].className = name;
        }catch(e){}
    }
    
    get className() {
        return this.btip[0].className;
    }

    hide() {
        this.btip.hide();
        $('.'+contentClass).html('');
    }

    set data(obj) {
		try{
            $('.'+contentClass).css({
                'padding' : (this.className == 'w-rate' || this.className == 'w-language') ? 0 : '1px 4px',
                'line-height' : (this.className == 'w-rate' || this.className == 'w-language') ? '30px' : '22px'
            });
            $('.'+contentClass).html(obj['content']);
            let triangleDisW = 8;
            let triangleLeft = this.btip.width() / 2 - triangleDisW;
            let tempX = obj['clientX'] - this.btip.width() / 2;
            let left = tempX;
            if (tempX < 0) {
                left = 0;
                triangleLeft = this.btip.width() / 2 - Math.abs(tempX) - triangleDisW;
                if (triangleLeft < 0) triangleLeft = 0;
            }
            if (tempX > this.container.width() - this.btip.width()) {
                left = this.container.width() - this.btip.width();
                triangleLeft = obj['clientX'] - left - triangleDisW;
                if (triangleLeft > this.btip.width() - triangleDisW * 2) {
                    triangleLeft = this.btip.width() - triangleDisW * 2
                }
            }
            this.btip.find('.'+triangleClass).css('left', triangleLeft);
            this.btip.css({
                'display' : 'block',
                'bottom' : this.className=='w-rate'||this.className=='w-setting'||this.className=='w-language'||this.className=='w-volume-slider'?'40px':'50px',
                'left': left
            });
            if (this.className === 'w-rate') {
                $('.'+contentClass).find('.w-ftname').each((index, item)=>{
                    $(item).on('mouseover', (e)=>{
                        $(e.target).css({
                            cursor : 'pointer',
                            color : '#ffffff',
                            background : '#3399ff'
                        });
                    })
                    $(item).on('mouseout', (e)=>{
                        $(e.target).css({
                            cursor : 'pointer',
                            color : e.target.className.split(' ')[1].split('-')[2] == H5Common.ft?'#3399ff':($(e.target).attr('ft-vip')!=0?'#FF7200':'#9b999b'),
                            background : 'none'
                        });
                    })
                })
            }
            if (this.className === 'w-language') {
                $('.'+contentClass).find('.w-ftname').each((index, item)=>{
                    $(item).on('mouseover', (e)=>{
                        $(e.target).css({
                            cursor : 'pointer',
                            color : '#ffffff',
                            background : '#3399ff'
                        });
                    })
                    $(item).on('mouseout', (e)=>{
                        $(e.target).css({
                            cursor : 'pointer',
                            color : e.target.className.split(' ')[1].split('-')[2] == Global.getInstance().cid?'#3399ff':'#9b999b',
                            background : 'none'
                        });
                    })
                })
            }
            if (this.className === 'w-volume-slider') {
                $('.'+contentClass).find('.volume-drag').on('mousedown', (e)=>{
                    e.preventDefault();
                    this.isTouching = true;
                });
                $(document).on('mousemove',(e)=>{
                    e.preventDefault();
                    if (this.isTouching) {
                        this.sendEvent('change_volume', {
                            'currY' : e.clientY - (Global.getInstance().pbox.offset().top - $(window).scrollTop()) - this.btip.position().top
                        });
                    }
                });
                $(document).on('mouseup',(e)=>{
                    e.preventDefault();
                    this.isTouching = false;
                });
            }
        }catch(e){ }
    }

}