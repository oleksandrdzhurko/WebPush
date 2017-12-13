function FirefoxWebPushInit() {

    navigator.serviceWorker.register('service-worker.js')
        .then(function (registration) {
            console.log('service worker registered');
            subscriptionButton.removeAttribute('disabled');
            if ('Notification' in window) {
                checkPermission();
            }
        }).catch(function (err) {
            console.error('Unable to register service worker.', err);
        });
}

function checkPermission() {
    if (Notification.permission === 'granted') {
        subscribe();
    } else {
        askPermission().then(subscribe);
    }
}

function askPermission() {
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
function getSubscription() {
    return navigator.serviceWorker.ready
        .then(function (registration) {
            return registration.pushManager.getSubscription();
        });
}


function subscribe() {
    getSubscription()
        .then(function (subscription) {
            if (subscription) {
                console.log('Already subscribed');
                console.log(subscription.endpoint);
                console.log(subscription.getKey('p256dh'));
                console.log(subscription.getKey('auth'));
                setUnsubscribeButton();
                sendEndpointToServer(subscription.endpoint);
            } else {
                setSubscribeButton();
            }
        });
}

function sendEndpointToServer(endpoint) {
    if (!isEndpointSentToServer(endpoint)) {
        console.log("Send Endpoint on Server");

        // var url = ''; 
        // $.post(url, {
        //     token: currentToken
        // });

        setEndpointSentToServer(endpoint);
    } else {
        console.log("Endpoint already on server");
    }
}

// Set in localStorage that user is subscribed
function isEndpointSentToServer(endpoint) {
    return window.localStorage.getItem('sentFirefoxendpoint') == endpoint;
}

function setEndpointSentToServer(endpoint) {
    window.localStorage.setItem(
        'sentFirefoxendpoint',
        endpoint ? endpoint : ''
    );
}