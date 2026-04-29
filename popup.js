const toggle = document.getElementById('toggle');

chrome.storage.local.get(['feedRemoverEnabled'], (result) => {
    toggle.checked = result.feedRemoverEnabled !== false;
});

toggle.addEventListener('change', () => {
    const enabled = toggle.checked;
    chrome.storage.local.set({ feedRemoverEnabled: enabled }, () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs[0]?.id) {
                chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle', enabled: enabled });
            }
        });
    });
});