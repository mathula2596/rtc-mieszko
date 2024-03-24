importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
    apiKey: "AIzaSyCv8NwqEXw9rabWRJVdI1iQFUO6fswMc-E",
    authDomain: "rtcmonitoring-d2350.firebaseapp.com",
    projectId: "rtcmonitoring-d2350",
    storageBucket: "rtcmonitoring-d2350.appspot.com",
    messagingSenderId: "1053028006617",
    appId: "1:1053028006617:web:b1f24c5d6c0f666dbd1cc8",
    // measurementId: `REPLACE_WITH_YOUR_FIREBASE_MESSAGING_MEASUREMENT_ID`,
  };
  
  firebase.initializeApp(firebaseConfig);
  
  // Retrieve firebase messaging
  const messaging = firebase.messaging();
  
  messaging.onBackgroundMessage(function(payload) {
    console.log('Received background message', payload);  
   // Customize notification here
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
    };
  
    self.registration.showNotification(notificationTitle,
      notificationOptions);
  });

  