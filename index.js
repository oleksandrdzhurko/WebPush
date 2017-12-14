if (!('serviceWorker' in navigator)) { console.log('Service Worker isn\'t supported on this browser, disable or hide UI. return');}

if (!('PushManager' in window)) { console.log('Push isn\'t supported on this browser, disable or hide UI. return');}

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';