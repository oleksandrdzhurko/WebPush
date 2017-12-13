if (!('serviceWorker' in navigator)) { console.log('Service Worker isn\'t supported on this browser, disable or hide UI. return');}

if (!('PushManager' in window)) { console.log('Push isn\'t supported on this browser, disable or hide UI. return');}


function registerServiceWorker() {
    return navigator.serviceWorker.register('service-worker.js')
    .then(function(registration) {
      console.log('Service worker successfully registered.');
      return registration;
    })
    .catch(function(err) {
      console.error('Unable to register service worker.', err);
    });
  }


  function askPermission() {
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


var serviceWorker = registerServiceWorker();
var permission = askPermission().then(permissionCallback);

function permissionCallback(permission){
    var data = {
        msg: "Hello everyone"
    };
    
    var e = new Notification("Test Title",{
        body: "This is the body " + data.msg,
        img: "https://static.volotea.com/img/logo.footer.png"
    });
}