function ChromWebPushInit(){
    firebase.initializeApp({
        messagingSenderId: "769802061391"
    });

    navigator.serviceWorker.register('firebase-messaging-sw.js')
        .then(function(registration) {
          console.log('service worker registered');
          subscriptionButton.removeAttribute('disabled');
          if ('Notification' in window) {
            messaging = firebase.messaging();
            messaging.useServiceWorker(registration);
            checkPermission_C();
        }
        }).catch(function(err) {
            console.error('Unable to register service worker.', err);
          });    
}

function checkPermission_C(){
    if (Notification.permission === 'granted') {
        subscribe_C();
    }else{
        askPermission_C().then(subscribe_C);
    }
}

function askPermission_C(){
    return new Promise(function(resolve, reject) {
        const permissionResult = Notification.requestPermission(function(result) {
          resolve(result);
        });
    
        if (permissionResult) {
          permissionResult.then(resolve, reject);
        }
      })
      .then(function(permissionResult) {
        if (permissionResult !== 'granted') {
          throw new Error('We weren\'t granted permission.');
        }
      });
}

function subscribe_C() {
    messaging.getToken()
        .then(function (currentToken) {
            console.log(currentToken);

            if (currentToken) {
                sendTokenToServer_C(currentToken);
            } else {
                console.warn("Can't get Token");
                setTokenSentToServer_C(false);
            }
        })
        .catch(function (err) {
            console.warn("Error while getting Token", err);
            setTokenSentToServer_C(false);
        });
}

function sendTokenToServer_C(currentToken) {
    if (!isTokenSentToServer_C(currentToken)) {
        console.log("Send Token on Server");

        // var url = ''; 
        // $.post(url, {
        //     token: currentToken
        // });

        setTokenSentToServer_C(currentToken);
    } else {
        console.log("Token already on server");
    }
}

// Set in localStorage that user is subscribed
function isTokenSentToServer_C(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer_C(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}