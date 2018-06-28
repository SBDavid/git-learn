'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import { H5Common } from "common/H5Common";
import { UIComponent } from "./UIComponent";
import H5PlayerEvent from "common/H5PlayerEvent";
import { H5CommonUtils } from "common/H5CommonUtils";
import H5ComponentEvent from "../event/H5ComponentEvent";

const contentClass = "w-recom-content";
const btnClass = "w-recom-btn";
const dotClass = "w-recom-dot";
const shareClass = "w-recom-share";

export class RecomUI extends UIComponent {

    disW = 100;
    columnNum = 3;

    constructor(container) {
        super();
        let recomClass = 'w-recom';
        if ($('.'+recomClass).length == 0) {
            this.recomTip = $('<div/>', {
                'class' : recomClass
            });
            this.recomTip.appendTo(container);
        }
		let content = [
            `<div class="${contentClass}">`,
                `<ul></ul>`,
            `</div>`,
            `<div class="${btnClass}">`,
                `<a href="javascript:void(0);">`,
                    `<div class="${shareClass}" />`,
                    `<span>分享</span>`,
                `</a>`,
                `<div class="${dotClass}"/>`,
            `</div>`,
        ].join('');
        this.recomTip.html(content);
        this.target = this.recomTip;
        $('.'+btnClass).find('a').on('click', (e)=>{
            this.sendEvent('_show_share_');
        });
    }

    resize() {
        try{
            let childDom = $('.'+contentClass).find('ul').children(),
                childWidth = childDom.outerWidth(), // 图片子项的宽度
                childDis = parseInt(childDom.css('margin-right'));  // 图片相互间距
            let showNum = Math.floor((Global.getInstance().pbox.width() - this.disW*2) / childWidth);
            (showNum > this.rowNum) && (showNum = this.rowNum);
            $('.'+contentClass).find('ul').css({
                'width' : this.rowNum * (childWidth + childDis),
                'margin-left' : 0
            });
            $('.'+contentClass).css({'width' : showNum * (childWidth + childDis)});
            $('.'+contentClass).css({
                'left' : Global.getInstance().pbox.width() - $('.'+contentClass).width() >> 1,
                'top' : Global.getInstance().pbox.height() - 35 - $('.'+contentClass).height() >> 1
            });
            $('.'+btnClass).css({
                'left' : $('.'+contentClass).position().left,
                'top' : $('.'+contentClass).position().top + $('.'+contentClass).height()
            });
            let dotNum = Math.ceil(this.rowNum / showNum),
                dotDom = $('.'+dotClass),
                currDot;
            if (dotDom.length > 0) {
                dotDom.remove();
            }
            if (dotNum < 2) return;
            dotDom = $('<div/>', {
                'class' : dotClass
            });
            dotDom.appendTo($('.'+btnClass));
            for(let i=0;i<dotNum;i++){
                let dot = $('<span></span>');
                dot.appendTo(dotDom);
                if (i==0) {
                    dot.addClass('select');
                    currDot = dot;
                }
                dot.on('click', (e)=>{
                    if (currDot) {
                        currDot.removeClass('select');
                    }
                    currDot = $(e.target);
                    currDot.addClass('select');
                    $('.'+contentClass).find('ul').animate({
                        'margin-left' : -$('.'+contentClass).width()*i
                    }, .3 * 1000, 'swing')
                });
            }
            dotDom.css({
                'margin' : '-20px '+ ($('.'+contentClass).width()-dotDom.width()>>1)+'px'
            })
        }catch(e){}
    }

    showData(data) {
        this.recomTip.show();
        this.rowNum = Math.ceil(data.length / this.columnNum);
        let con = '';
        for (let item of data) {
            con += [`<li>`,
                        `<a href="${item['link']}" target="_top">`,
                            `<img src="${item['capture']||item['catpure']}"/>`,
                            `<span>${item['title']}</span>`,
                        `</a>`,
                    `</li>`].join('');
        }
        $('.'+contentClass).find('ul').html(con);
        this.resize();
    }

    hide() {
        this.recomTip.hide();
    }

}