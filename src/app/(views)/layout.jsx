"use client";

import { SidebarProvider, useSidebarContext } from "./context/sidebarContext";
import { twMerge } from "tailwind-merge";
import { DashboardNavbar } from "./components/navbar";
import { DashboardSidebar } from "./components/sidebar";
import { SocketContextProvider } from "./context/socketContext";
import { ProfileContextProvider } from "./context/profileContext";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect } from "react";
import axios from "axios";

const DashboardLayout = function ({ children }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  );
};

const DashboardLayoutContent = function ({ children }) {
  const { isCollapsed } = useSidebarContext();

  const firebaseConfig = {
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  };

  const receiveNotification = async () => {
    const permission = await Notification.requestPermission();
    
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const messaging = getMessaging(app);

    if (permission === 'granted') {
        
        const token = await getToken(messaging, { vapidKey: process.env.VAPID_KEY });
        
        await saveToken(token);

        await onMessage(messaging, (payload) => {
          
            console.log('Message received. ', {payload:payload,token:token});

            new Notification(payload.notification.title, {
              body: payload.notification.body,
            });

        });

        // console.log(token);
        // Save the token to your server or elsewhere
        return token;
    }
  }

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
        console.log('Service Worker registered with scope:', registration.scope);
      } catch (err) {
        console.error('Service Worker registration failed:', err);
      }
    }
};


// useEffect(() => {
//     const socket = io('http://localhost:3005');
//     socket.on('test', (data) => {
//         getNotifications();
//     });
// }, []);

    useEffect(() => {
        registerServiceWorker().then(() => {
          // requestNotificationPermission();
          receiveNotification();
        });
    }, []);

    // const requestNotificationPermission = async () => {
    //     if ('Notification' in window) {
    //         // generateToken();
    //     }
    // };

    // const generateToken = async () => {
    //     const firebaseConfig = {
    //         apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    //         authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    //         projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    //         storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    //         messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    //         appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    //     };

    //     const permission = await Notification.requestPermission();
    //     // if (permission === 'granted') {
    //     //     const app = !getApps().length ? await initializeApp(firebaseConfig) : getApp();
    //     //     const messaging = await getMessaging(app);
    //     //     // const token = await getToken(messaging, { vapidKey: process.env.VAPID_KEY });

    //     //     // messaging.onMessage((payload) => {
    //     //     //     console.log('Message received. ', payload);
    //     //     //     // Customize notification here or perform other actions
    //     //     // });

    //     //     console.log(token);
    //     //     // saveToken(token);
    //     //     return token;
    //     // }
    // };

  const saveToken = async (token) => {
    try {
        const response = await axios.post('/api/notificationToken', { token });
        console.log(response.data);
    } catch (error) {
        console.log(error);
    }
};

 
  
  // useEffect(() => {
  //   receiveNotification();
  // },[])

  return (
    <>
      <ProfileContextProvider>
        <SocketContextProvider>
          <DashboardNavbar />
          <div className="mt-16 flex items-start">
            <DashboardSidebar />
            <div
              id="main-content"
              className={twMerge(
                "relative h-full w-full overflow-y-auto bg-gray-50 dark:bg-gray-900",
                isCollapsed ? "lg:ml-[4.5rem]" : "lg:ml-64"
              )}
            >
              {children}
            </div>
          </div>
        </SocketContextProvider>
      </ProfileContextProvider>
    </>
  );
};

export default DashboardLayout;
