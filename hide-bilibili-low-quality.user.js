// ==UserScript==
// @name         Hide Lower Quality Options on Bilibili Player
// @namespace    https://github.com/dingwen07/Mongolian-Top-Laner
// @version      1.0
// @downloadURL  https://github.com/dingwen07/Mongolian-Top-Laner/raw/refs/heads/main/hide-bilibili-low-quality.user.js
// @description  Hide video quality options with data-value <= 80 by default; show when holding a modifier key
// @author       Dingwen Wang
// @match        *://www.bilibili.com/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const THRESHOLD = 80; 
    const MODIFIER_KEY = 'Control';

    const QUALITY_MENU_SELECTOR = '.bpx-player-ctrl-quality-menu';
    const QUALITY_ITEM_SELECTOR = '.bpx-player-ctrl-quality-menu-item';

    let hiddenItems = new Set();

    function processMenu() {
        const menu = document.querySelector(QUALITY_MENU_SELECTOR);
        if (!menu) return;

        const items = menu.querySelectorAll(QUALITY_ITEM_SELECTOR);
        items.forEach(li => {
            const value = parseInt(li.getAttribute('data-value'));
            if (!isNaN(value) && value <= THRESHOLD) {
                li.hidden = true;
                hiddenItems.add(li);
            }
        });
    }

    function showHiddenItems() {
        hiddenItems.forEach(item => item.hidden = false);
    }

    function hideItemsAgain() {
        hiddenItems.forEach(item => item.hidden = true);
    }

    // Attach keyboard listener
    window.addEventListener('keydown', (e) => {
        if (e.key === MODIFIER_KEY) {
            showHiddenItems();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.key === MODIFIER_KEY) {
            hideItemsAgain();
        }
    });

    // Retry to wait for element to appear
    const interval = setInterval(() => {
        const menu = document.querySelector(QUALITY_MENU_SELECTOR);
        if (menu) {
            clearInterval(interval);
            processMenu();

            // Observe for changes (e.g., menu re-rendered)
            const observer = new MutationObserver(() => {
                hiddenItems.clear();
                processMenu();
            });
            observer.observe(menu, { childList: true, subtree: true });
        }
    }, 500);
})();
