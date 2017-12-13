function FirefoxWebPushInit() {

    navigator.serviceWorker.register('service-worker.js')
        .then(function (registration) {
            console.log('service worker registered');
            subscriptionButton.removeAttribute('disabled');
            if ('Notification' in window) {
                checkPermission_F();
            }
        }).catch(function (err) {
            console.error('Unable to register service worker.', err);
        });
}

function checkPermission_F() {
    if (Notification.permission === 'granted') {
        subscribe_F();
    } else {
        askPermission_F().then(subscribe_F);
    }
}

function askPermission_F() {
    return new Promise(function (resolve, reject) {
        const permissionResult = Notification.requestPermission(function (result) {
            resolve(result);
        });

        if (permissionResult) {
            permissionResult.then(resolve, reject);
        }
    })
        .then(function (permissionResult) {
            if (permissionResult !== 'granted') {
                throw new Error('We weren\'t granted permission.');
            }
        });
}

// As subscription object is needed in few places let's create a method which
// returns a promise.
function getSubscription_F() {
    return navigator.serviceWorker.ready
        .then(function (registration) {
            return registration.pushManager.getSubscription_F();
        });
}


function subscribe_F() {
    getSubscription_F()
        .then(function (subscription) {
            if (subscription) {
                console.log('Already subscribed');
                console.log(subscription.endpoint);
                console.log(subscription.getKey('p256dh'));
                console.log(subscription.getKey('auth'));
                setUnsubscribeButton();
                sendEndpointToServer_F(subscription.endpoint);
            } else {
                setSubscribeButton();
            }
        });
}

function sendEndpointToServer_F(endpoint) {
    if (!isEndpointSentToServer_F(endpoint)) {
        console.log("Send Endpoint on Server");

        // var url = ''; 
        // $.post(url, {
        //     token: currentToken
        // });

        setEndpointSentToServer_F(endpoint);
    } else {
        console.log("Endpoint already on server");
    }
}

// Set in localStorage that user is subscribed
function isEndpointSentToServer_F(endpoint) {
    return window.localStorage.getItem('sentFirefoxendpoint') == endpoint;
}

function setEndpointSentToServer_F(endpoint) {
    window.localStorage.setItem(
        'sentFirefoxendpoint',
        endpoint ? endpoint : ''
    );
}