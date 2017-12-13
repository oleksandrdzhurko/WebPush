if (!('serviceWorker' in navigator)) { console.log('Service Worker isn\'t supported on this browser, disable or hide UI. return');}

if (!('PushManager' in window)) { console.log('Push isn\'t supported on this browser, disable or hide UI. return');}

// Chrome 1+
var isChrome = !!window.chrome && !!window.chrome.webstore;
// Firefox 1.0+
var isFirefox = typeof InstallTrigger !== 'undefined';

if(isChrome){
    ChromWebPushInit();
}

// if(isFirefox){
//     importScripts("WebPushFirefox.js");
//     FirefoxWebPushInit();
// }

// var subscriptionButton = document.getElementById('subscriptionButton');

// // As subscription object is needed in few places let's create a method which
// // returns a promise.
// function getSubscription() {
//   return navigator.serviceWorker.ready
//     .then(function(registration) {
//       return registration.pushManager.getSubscription();
//     });
// }

// // // Register service worker and check the initial subscription state.
// // // Set the UI (button) according to the status.
// // if ('serviceWorker' in navigator) {
// //   navigator.serviceWorker.register('service-worker.js')
// //     .then(function() {
// //       console.log('service worker registered');
// //       subscriptionButton.removeAttribute('disabled');
// //     }).catch(function(err) {
// //         console.error('Unable to register service worker.', err);
// //       });
// //   getSubscription()
// //     .then(function(subscription) {
// //       if (subscription) {
// //         console.log('Already subscribed', subscription.endpoint);
// //         setUnsubscribeButton();
// //       } else {
// //         setSubscribeButton();
// //       }
// //     });
// // }

// // Get the `registration` from service worker and create a new
// // subscription using `registration.pushManager.subscribe`. Then
// // register received new subscription by sending a POST request with its
// // endpoint to the server.
// function subscribe() {
//   navigator.serviceWorker.ready
//   .then(function(registration) {
//     return registration.pushManager.subscribe({ userVisibleOnly: true });
//   })
//   .then(function(subscription) {
//     console.log('Subscribed', subscription.endpoint);
//     setEndpoint(subscription.endpoint);
//     return fetch('register', {
//       method: 'post',
//       headers: {
//         'Content-type': 'application/json'
//       },
//       body: JSON.stringify({
//         endpoint: subscription.endpoint
//       })
//     });
//   })
//   .then(setUnsubscribeButton)
//   .then(function(serviceWorkerRegistration) {
//     // Do we already have a push message subscription?
//     getSubscription()
//       .then(function(subscription) {
//           debugger;
//         if (!subscription) {
//           // We aren’t subscribed to push, so set UI
//           // to allow the user to enable push
//           return;
//         }

//         // Keep your server in sync with the latest subscriptionId
//         //sendSubscriptionToServer(subscription);
        
//         //showCurlCommand(subscription);
//         })
//     });
// }

// // Get existing subscription from service worker, unsubscribe
// // (`subscription.unsubscribe()`) and unregister it in the server with
// // a POST request to stop sending push messages to
// // unexisting endpoint.
// function unsubscribe() {
//   getSubscription().then(function(subscription) {
//     return subscription.unsubscribe()
//       .then(function() {
//         console.log('Unsubscribed', subscription.endpoint);
//         return fetch('unregister', {
//           method: 'post',
//           headers: {
//             'Content-type': 'application/json'
//           },
//           body: JSON.stringify({
//             endpoint: subscription.endpoint
//           })
//         });
//       });
//   }).then(setSubscribeButton);
// }

// // Change the subscription button's text and action.
// function setSubscribeButton() {
//   subscriptionButton.onclick = subscribe;
//   subscriptionButton.textContent = 'Subscribe!';
// }

// function setUnsubscribeButton() {
//   subscriptionButton.onclick = unsubscribe;
//   subscriptionButton.textContent = 'Unsubscribe!';
// }

// function setEndpoint(endpoint) {
//     var input = document.getElementsByName('subscribtionEndpoint');
//     input[0].setAttribute("value",endpoint);
//   }

//   function askPermission() {
//     return new Promise(function(resolve, reject) {
//       const permissionResult = Notification.requestPermission(function(result) {
//         resolve(result);
//       });
  
//       if (permissionResult) {
//         permissionResult.then(resolve, reject);
//       }
//     })
//     .then(function(permissionResult) {
//       if (permissionResult !== 'granted') {
//         throw new Error('We weren\'t granted permission.');
//       }
//     });
//   }

//   function permissionCallback(permission){
//     var data = {
//         msg: "Hello everyone"
//     };
}