// ==UserScript==
// @name         学信网信息自定义修改器 (Wap端 - 二合一极稳全能版)
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  自定义修改学信网[总览页]+[学籍详情页]信息，支持按需配置（注释掉的项保留原页面信息）
// @author       Gemini
// @match        https://my.chsi.com.cn/archive/wap/gdjy/index.action*
// @match        https://my.chsi.com.cn/archive/wap/gdjy/xj/detail.action*
// @icon         https://t1.chei.com.cn/common/favicon.ico
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    // =====================================================================
    // ⚠️ 全局配置区：请在此处集中修改你想要展示的信息（注释掉的项将保留网页原生信息）
    // =====================================================================
    const CONFIG = {

        // 【模块一：总览页面配置】(对应 index.action)
        xj_1: {
            school: "杭州电子科技大学",                  // 第1个学籍：学校
            // level: "普通全日制 本科",             // 第1个学籍：层次
            // status: "2022-09-01 | 在籍（注册学籍）" // 第1个学籍：状态
        },
        // xj_2: {
        //     school: "北京大学",
        //     level: "普通全日制 硕士研究生",
        //     status: "2026-06-30 | 不在籍（毕业）"
        // },
        // xl_1: {
        //     school: "清华大学",                  // 第1个学历：学校
        //     level: "本科",                      // 第1个学历：层次
        //     status: "普通全日制 | 毕业"           // 第1个学历：状态
        // },
        kaoyan_1: {
            school: "杭州电子科技大学",                  // 考研信息：院校
            // year: "2026年"                      // 考研信息：年份
        },


        // 【模块二：学籍详情页配置】(对应 detail.action)
        detail_head: {
            // name: "张三",                          // 姓名
            // namePinyin: "ZHANG SAN",               // 姓名拼音
            school: "杭州电子科技大学",                     // 院校名称
            // level: "普通全日制",                     // 层次 (如: 普通全日制、非全日制)
            majorAndType: "计算机技术 | 全日制"   // 专业与学历层次
        },
        detail_list: {
            // "民族": "汉族",
            // "证件号码": "110101200001011234",
            // "学制": "4 年",
            // "学历类别": "普通高等教育",
            "分院": "计算机学院",
            "系所": "",
            "班级": "",
            "学号": "252050244",
            // "入学日期": "2020年09月01日",
            // "学籍状态": "在籍（注册学籍）",
            // "预计毕业日期": "2024年06月30日"
        },
        detail_photo: {
            luQuPhoto: "",   // 录取照片 URL (不替换请留空 "")
            xueLiPhoto: ""   // 学历照片 URL (不替换请留空 "")
        }

    };
    // =====================================================================


    /**
     * 安全赋值阀门：严格判定配置项是否存在，且掐死 DOM 无限递归
     */
    function safeSetText(dom, targetText) {
        // 核心修改点：只有当 targetText 明确被赋值（且不为 undefined）时，才去覆盖DOM
        if (targetText !== undefined && dom && dom.innerText !== targetText) {
            dom.innerText = targetText;
        }
    }

    // 逻辑一：渲染【总览页】
    function renderIndexPage() {
        try {
            const xjCards = document.querySelectorAll('.xj.list-card');
            if (xjCards[0] && CONFIG.xj_1) {
                safeSetText(xjCards[0].querySelector('.yxmc'), CONFIG.xj_1.school);
                safeSetText(xjCards[0].querySelector('.cc'), CONFIG.xj_1.level);
                safeSetText(xjCards[0].querySelector('.des'), CONFIG.xj_1.status);
            }
            if (xjCards[1] && CONFIG.xj_2) {
                safeSetText(xjCards[1].querySelector('.yxmc'), CONFIG.xj_2.school);
                safeSetText(xjCards[1].querySelector('.cc'), CONFIG.xj_2.level);
                safeSetText(xjCards[1].querySelector('.des'), CONFIG.xj_2.status);
            }

            const xlCards = document.querySelectorAll('.xl.list-card');
            if (xlCards[0] && CONFIG.xl_1) {
                safeSetText(xlCards[0].querySelector('.yxmc'), CONFIG.xl_1.school);
                safeSetText(xlCards[0].querySelector('.cc'), CONFIG.xl_1.level);
                safeSetText(xlCards[0].querySelector('.des'), CONFIG.xl_1.status);
            }

            const kyCard = document.querySelector('.ky.list-card');
            if (kyCard && CONFIG.kaoyan_1) {
                safeSetText(kyCard.querySelector('.yxmc'), CONFIG.kaoyan_1.school);
                safeSetText(kyCard.querySelector('.des'), CONFIG.kaoyan_1.year);
            }
        } catch (err) {}
    }

    // 逻辑二：渲染【详情页】
    function renderDetailPage() {
        try {
            const h = CONFIG.detail_head;
            if (h) {
                safeSetText(document.querySelector('.nameFamily'), h.name);
                safeSetText(document.querySelector('.top-card .van-col--15 p'), h.namePinyin);
                safeSetText(document.querySelector('.yxmc'), h.school);
                safeSetText(document.querySelector('.xj-cc-lable'), h.level);
                safeSetText(document.querySelector('.xj-detail-img .des'), h.majorAndType);
            }

            const listItems = document.querySelectorAll('.gdjy-view-ul li');
            listItems.forEach(li => {
                const labelEl = li.querySelector('.left');
                const valueEl = li.querySelector('.right');
                if (labelEl && valueEl) {
                    const labelText = labelEl.innerText.trim();
                    if (CONFIG.detail_list && CONFIG.detail_list[labelText] !== undefined) {
                        safeSetText(valueEl, CONFIG.detail_list[labelText]);
                    }
                }
            });

            const p = CONFIG.detail_photo;
            if (p) {
                if (p.luQuPhoto) {
                    let img1 = document.querySelector('.lq-photo img');
                    if(img1 && img1.src !== p.luQuPhoto) img1.src = p.luQuPhoto;
                }
                if (p.xueLiPhoto) {
                    let img2 = document.querySelector('.xl-photo img');
                    if(img2 && img2.src !== p.xueLiPhoto) img2.src = p.xueLiPhoto;
                }
            }
        } catch (e) {}
    }


    // 核心中枢：智能路由分发器
    function masterController() {
        const currentUrl = window.location.href;

        if (currentUrl.includes('gdjy/index.action')) {
            renderIndexPage();
        } else if (currentUrl.includes('gdjy/xj/detail.action')) {
            renderDetailPage();
        }
    }

    // 20ms 低频心跳轮询
    setInterval(masterController, 20);

})();
