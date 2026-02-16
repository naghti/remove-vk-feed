function redirectIfNeeded() {
    if (location.pathname === '/feed') {
        location.replace('/im');
    }
}

redirectIfNeeded();

const originalPushState = history.pushState;
const originalReplaceState = history.replaceState;

history.pushState = function() {
    originalPushState.apply(this, arguments);
    redirectIfNeeded();
};

history.replaceState = function() {
    originalReplaceState.apply(this, arguments);
    redirectIfNeeded();
};

window.addEventListener('popstate', redirectIfNeeded);