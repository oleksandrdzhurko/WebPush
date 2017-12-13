function ChromWebPushInit(){
    firebase.initializeApp({
        messagingSenderId: "769802061391"
    });

    navigator.serviceWorker.register('service-worker.js')
        .then(function() {
          console.log('service worker registered');
          subscriptionButton.removeAttribute('disabled');
          if ('Notification' in window) {
            var messaging = firebase.messaging();
            checkPermission();
        }
        }).catch(function(err) {
            console.error('Unable to register service worker.', err);
          });    
}

function checkPermission(){
    if (Notification.permission === 'granted') {
        subscribe();
    }else{
        askPermission().then(subscribe);
    }
}

function askPermission(){
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

function subscribe() {
    messaging.getToken()
        .then(function (currentToken) {
            console.log(currentToken);

            if (currentToken) {
                sendTokenToServer(currentToken);
            } else {
                console.warn("Can't get Token");
                setTokenSentToServer(false);
            }
        })
        .catch(function (err) {
            console.warn("Error while getting Token", err);
            setTokenSentToServer(false);
        });
}

function sendTokenToServer(currentToken) {
    if (!isTokenSentToServer(currentToken)) {
        console.log("Send Token on Server");

        // var url = ''; 
        // $.post(url, {
        //     token: currentToken
        // });

        setTokenSentToServer(currentToken);
    } else {
        console.log("Token already on server");
    }
}

// Set in localStorage that user is subscribed
function isTokenSentToServer(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}