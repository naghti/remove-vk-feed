const CSS_RULES = `
li[data-testid="leftmenuitem"]:not(#l_pr):not(#l_msg) {
  display: none;
}
.vkuiSeparator {
  display: none;
}
#ads_wrapper {
  display: none;
}
nav hr {
  display: none;
}`;

let styleElement = null;

function applyStyles() {
    if (styleElement) return;
    styleElement = document.createElement('style');
    styleElement.id = 'vk-feed-remover-styles';
    styleElement.textContent = CSS_RULES;
    (document.head || document.documentElement).appendChild(styleElement);
}

function removeStyles() {
    if (styleElement) {
        styleElement.remove();
        styleElement = null;
    }
    const existing = document.getElementById('vk-feed-remover-styles');
    if (existing) existing.remove();
}

function createOverlay() {
    if (document.getElementById('vk-feed-remover-overlay')) return;
    const overlay = document.createElement('div');
    overlay.id = 'vk-feed-remover-overlay';
    overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        background-color: #141414; z-index: 9999999;
        display: flex; align-items: center; justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    document.documentElement.appendChild(overlay);
}

function removeOverlay() {
    const overlay = document.getElementById('vk-feed-remover-overlay');
    if (overlay) overlay.remove();
}

// Состояние расширения
let enabled = false;
let popstateListener = null;

function checkAndApply() {
    if (!enabled) return;
    if (location.pathname !== '/im') {
        createOverlay();
        location.replace('/im');
    } else {
        removeOverlay();
    }
}

function enableExtension() {
    if (enabled) return;
    enabled = true;
    applyStyles();
    if (!popstateListener) {
        popstateListener = checkAndApply;
        window.addEventListener('popstate', popstateListener);
    }
    checkAndApply();
}

function disableExtension() {
    if (!enabled) return;
    enabled = false;
    removeStyles();
    removeOverlay();
    if (popstateListener) {
        window.removeEventListener('popstate', popstateListener);
        popstateListener = null;
    }
}

chrome.storage.local.get(['feedRemoverEnabled'], (result) => {
    const shouldEnable = result.feedRemoverEnabled !== false; // по умолчанию true
    if (shouldEnable) {
        enableExtension();
    } else {
        disableExtension();
    }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'toggle') {
        if (message.enabled) {
            enableExtension();
        } else {
            disableExtension();
        }
    }
});