/**
 * ...
 * @author minliang1112@foxmail.com
 */

'use strict';

import $ from 'jquery';
import Global from "manager/Global";
import { H5Common } from "common/H5Common";
import { UIComponent } from "./UIComponent";
import H5ComponentEvent from "../event/H5ComponentEvent";

export class Contextmenu extends UIComponent {

    constructor(container) {
        super();
        this.container = container;
        this.menuid = 'w-menu';
        this.showContextmenu(this.container);
        this.menuWidth = this.menuBox.width();
        this.menuHeight = this.menuBox.height();
    }

    /**
     * 生成右键菜单  
     * @param container 右键菜单承载容器 
     */
    showContextmenu(container) {
        let style = container.attr('id') == Global.getInstance().pbox.attr('id') ? '' : 
        'background: #fff;position: absolute;z-index: 2147483648;width: 265px;padding: 5px 0;color: #333;font-size: 12px;border: 1px solid #999;filter: drop-shadow(2px 2px 1px #333);';
        if (container.children('#' + this.menuid).length == 0) {
			$('<div/>', {
                'id' : this.menuid,
                'style' : style
            }).appendTo(container);
        }
        this.menuBox = container.children('#' + this.menuid);
        let menuStyle = container.attr('id') == Global.getInstance().pbox.attr('id') ? '' : 
        'padding-left: 15px;height: 25px;line-height: 25px;cursor: pointer;max-width: 100%;overflow: hidden;white-space: nowrap;text-overflow: ellipsis;';
        let menuDom = [];
        for (let item of H5Common.contextmenuArr) {
            menuDom.push(`<div class="w-menuitem" style="${menuStyle}">${item}</div>`)
        }
        this.menuBox.html(menuDom.join(''));
        this.menuBox.children().each((index, element) => {
            $(element).on('click', (e) => {
                this.menuBox.remove();
            });
            $(element).on('mouseover', (e) => {
                $(e.target).css('background', '#efefef');
            });
            $(element).on('mouseout', (e) => {
                $(e.target).css('background', 'none');
            });
        });
        $(this.menuBox[0].ownerDocument).on('click', (e) => {
            this.menuBox.remove();
        });
    }

    /**
     * 定位右键菜单位置
     * @param {left: , top: } obj 位置信息
     */
    setLocation(obj) {
        if (obj['left'] <= this.container.width() - this.menuWidth && obj['top'] <= this.container.height() - this.menuHeight) {
            // 右键菜单位于播放器内，若原先不存在，则播放器内重新创建
            if (this.container.children('#' + this.menuid).length == 0) {
                this.menuBox.remove();
                this.showContextmenu(this.container);
            }
        } else {
            let currNode = window.parent.document.getElementById('ifr_player');
            if (!currNode) {
                currNode = this.container[0];
            }
            let container = $(currNode.parentNode);
            container.css('position', 'absolute');
            // 右键菜单位于播放器外，若原先不存在，则播放器iframe外重新创建
            if (container.children('#' + this.menuid).length == 0) {
                this.menuBox.remove();
                this.showContextmenu(container);
            }
        }
        this.menuBox.css({
            'left' : obj['left'],
            'top' : obj['top']
        });
    }
}