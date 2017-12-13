firebase.initializeApp({
    messagingSenderId: '448358493027'
});

var messaging = null;
var bt_register = $('#register_FCM');
var bt_delete = $('#delete_FCM');
var token = $('#token_FCM');
var form = $('#notification_FCM');
var massage_id = $('#massage_id_FCM');
var massage_row = $('#massage_row_FCM');

var info = $('#info_FCM');
var info_message = $('#info-message_FCM');

var alert = $('#alert_FCM');
var alert_message = $('#alert-message_FCM');

var input_body = $('#body_FCM');

resetUI_FCM();

if (window.location.protocol === 'https:' &&
    'Notification' in window &&
    'serviceWorker' in navigator &&
    'localStorage' in window &&
    'fetch' in window &&
    'postMessage' in window
) {
    registerServiceWorker_FCM()
        .then(function () {
            if (Notification.permission === 'granted') {
                subscribe_FCM();
            }
        }).then(registerHandlers);
} else {
    if (window.location.protocol !== 'https:') {
        showError_FCM('Is not from HTTPS');
    } else if (!('Notification' in window)) {
        showError_FCM('Notification not supported');
    } else if (!('serviceWorker' in navigator)) {
        showError_FCM('ServiceWorker not supported');
    } else if (!('localStorage' in window)) {
        showError_FCM('LocalStorage not supported');
    } else if (!('fetch' in window)) {
        showError_FCM('fetch not supported');
    } else if (!('postMessage' in window)) {
        showError_FCM('postMessage not supported');
    }

    console.warn('This browser does not support desktop notification.');
    console.log('Is HTTPS', window.location.protocol === 'https:');
    console.log('Support Notification', 'Notification' in window);
    console.log('Support ServiceWorker', 'serviceWorker' in navigator);
    console.log('Support LocalStorage', 'localStorage' in window);
    console.log('Support fetch', 'fetch' in window);
    console.log('Support postMessage', 'postMessage' in window);

    updateUIForPushPermissionRequired_FCM();
}

function registerHandlers() {
    // get permission on subscribe only once
    bt_register.on('click', function () {
        if (Notification.permission === 'granted') {
            subscribe_FCM();
        } else {
            askPermission_FCM().then(subscribe_FCM);
        }
    });

    bt_delete.on('click', function () {
        // Delete Instance ID token.
        messaging.getToken()
            .then(function (currentToken) {
                messaging.deleteToken(currentToken)
                    .then(function () {
                        console.log('Token deleted.');
                        setTokenSentToServer(false);
                        // Once token is deleted update UI.
                        resetUI();
                    })
                    .catch(function (error) {
                        showError_FCM('Unable to delete token.', error);
                    });
            })
            .catch(function (error) {
                showError_FCM('Error retrieving Instance ID token.', error);
            });
    });

    form.on('submit', function (event) {
        event.preventDefault();

        var notification = {};
        form.find('input').each(function () {
            var input = $(this);
            notification[input.attr('name')] = input.val();
        });

        sendNotification(notification);
    });

    // handle catch the notification on current page
    messaging.onMessage(function (payload) {
        console.log('Message received. ', payload);
        info.show();
        info_message
            .text('')
            .append('<strong>' + payload.notification.title + '</strong>')
            .append('<em> ' + payload.notification.body + '</em>')
            ;

        // register fake ServiceWorker for show notification on mobile devices
        navigator.serviceWorker.register('messaging-sw.js');
        Notification.requestPermission(function (permission) {
            if (permission === 'granted') {
                navigator.serviceWorker.ready.then(function (registration) {
                    payload.notification.data = payload.notification;
                    registration.showNotification(payload.notification.title, payload.notification);
                }).catch(function (error) {
                    // registration failed :(
                    showError_FCM('ServiceWorker registration failed.', error);
                });
            }
        });
    });

    // Callback fired if Instance ID token is updated.
    messaging.onTokenRefresh(function () {
        messaging.getToken()
            .then(function (refreshedToken) {
                console.log('Token refreshed.');
                // Send Instance ID token to app server.
                sendTokenToServer_FCM(refreshedToken);
                updateUIForPushEnabled(refreshedToken);
            })
            .catch(function (error) {
                showError_FCM('Unable to retrieve refreshed token.', error);
            });
    });
}

function registerServiceWorker_FCM() {
    return new Promise(function (resolve, reject) {
        var registerResult = navigator.serviceWorker.register('firebase-messaging-sw.js')
            .then(function (registration) {
                console.log('service worker registered');
                messaging = firebase.messaging();
                messaging.useServiceWorker(registration);
                resolve(registration);
            }).catch(function (err) {
                console.error('Unable to register service worker.', err);
            });
        if (registerResult) {
            registerResult.then(resolve, reject);
        }
    });
}

function getToken_FCM() {
    if (Notification.permission === 'granted') {
        subscribe_FCM();
    }
}

function askPermission_FCM() {
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

function subscribe_FCM() {
    messaging.getToken()
        .then(function (currentToken) {
            console.log(currentToken);

            if (currentToken) {
                sendTokenToServer_FCM(currentToken);
                updateUIForPushEnabled_FCM(currentToken);
            } else {
                console.warn("Can't get Token");
                updateUIForPushPermissionRequired_FCM();
                setTokenSentToServer_FCM(false);
            }
        })
        .catch(function (err) {
            console.warn("Error while getting Token", err);
            updateUIForPushPermissionRequired_FCM();
            setTokenSentToServer_FCM(false);
        });
}

function sendTokenToServer_FCM(currentToken) {
    if (!isTokenSentToServer_FCM(currentToken)) {
        console.log("Send Token on Server");

        // var url = ''; 
        // $.post(url, {
        //     token: currentToken
        // });

        setTokenSentToServer_FCM(currentToken);
    } else {
        console.log("Token already on server");
    }
}

// Set in localStorage that user is subscribed
function isTokenSentToServer_FCM(currentToken) {
    return window.localStorage.getItem('sentFirebaseMessagingToken') == currentToken;
}

function setTokenSentToServer_FCM(currentToken) {
    window.localStorage.setItem(
        'sentFirebaseMessagingToken',
        currentToken ? currentToken : ''
    );
}

function updateUIForPushEnabled_FCM(currentToken) {
    console.log(currentToken);
    token.text(currentToken);
    bt_register.hide();
    bt_delete.show();
    form.show();
}

function resetUI_FCM() {
    token.text('');
    bt_register.show();
    bt_delete.hide();
    form.hide();
    massage_row.hide();
    info.hide();
}

function updateUIForPushPermissionRequired_FCM() {
    bt_register.attr('disabled', 'disabled');
    resetUI();
}

function showError_FCM(error, error_data) {
    if (typeof error_data !== "undefined") {
        console.error(error + ' ', error_data);
    } else {
        console.error(error);
    }

    alert.show();
    alert_message.html(error);
}

function sendNotification_FCM(notification) {
    var key = "AAAAszvHRk8:APA91bHLmWuFTmDvq2xVE8wPVec2f5yX9rvv0lshFHgS-Wfn179--M_97e8lEOhT1n-HyEn_08yjxFpfsW3cdudW7kbnqbIEZ2GJnzgcwn1EX28GcvNu3bG9W6UWbAAdBB27hxvdqjrN";

    console.log('Send notification', notification);

    // hide last notification data
    info.hide();
    massage_row.hide();

    messaging.getToken()
        .then(function (currentToken) {
            fetch('https://fcm.googleapis.com/fcm/send', {
                'method': 'POST',
                'headers': {
                    'Authorization': 'key=' + key,
                    'Content-Type': 'application/json'
                },
                'body': JSON.stringify({
                    'notification': notification,
                    'to': currentToken
                })
            }).then(function (response) {
                return response.json();
            }).then(function (json) {
                console.log('Response', json);

                if (json.success == 1) {
                    massage_row.show();
                    massage_id.text(json.results[0].message_id);
                } else {
                    massage_row.hide();
                    massage_id.text(json.results[0].error);
                }
            }).catch(function (error) {
                showError_FCM(error);
            });
        })
        .catch(function (error) {
            showError_FCM('Error retrieving Instance ID token.', error);
        });
}