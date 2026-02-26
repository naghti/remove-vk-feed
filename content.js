function createOverlay() {
    if (document.getElementById('vk-feed-remover-overlay')) {
        return;
    }

    const overlay = document.createElement('div');
    overlay.id = 'vk-feed-remover-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: #141414;
        z-index: 9999999;
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    `;
    document.documentElement.appendChild(overlay);
}

function removeOverlay() {
    const overlay = document.getElementById('vk-feed-remover-overlay');
    if (overlay) {
        overlay.remove();
    }
}


function checkAndApply() {
    if (location.pathname !== '/im') {
        createOverlay();
        location.replace('/im');
    } else {
        removeOverlay();
    }
}

checkAndApply();

window.addEventListener('popstate', checkAndApply);