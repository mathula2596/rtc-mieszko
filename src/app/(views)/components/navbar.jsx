import { getApp, getApps, initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { HiMenuAlt1, HiX, HiOutlineLogout, HiOutlineBell } from 'react-icons/hi';
import { io } from 'socket.io-client';
import { Navbar, DarkThemeToggle } from 'flowbite-react';
import { useSidebarContext } from '../context/sidebarContext';
import { isSmallScreen } from '../../../helpers/helpers';
import { SocketContext } from '../context/socketContext';
// import { ProfileContext } from '../context/profileContext';

export const DashboardNavbar = () => {
    const { isCollapsed: isSidebarCollapsed, setCollapsed: setSidebarCollapsed } = useSidebarContext();
    const router = useRouter();
    const [openNotification, setOpenNotification] = useState(false);
    const [profile, setProfile] = useState({ username: '', userType: '' });
    const [unreadNotifications, setUnreadNotifications] = useState(0);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('/firebase-messaging-sw.js')
            .then((registration) => {
              console.log('Service Worker registered with scope:', registration.scope);
            }).catch((err) => {
              console.error('Service Worker registration failed:', err);
            });
        }
    }, []);

    // const registerServiceWorker = async () => {
    //     if ('serviceWorker' in navigator) {
    //       try {
    //         const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
    //         console.log('Service Worker registered with scope:', registration.scope);
    //       } catch (err) {
    //         console.error('Service Worker registration failed:', err);
    //       }
    //     }
    // };

    

    useEffect(() => {
        // const socket = io('http://localhost:3005');
        // if(socket!=null)
        // {
            // console.log('socket', socket);
            // socket.on('test', (data) => {
            //     getNotifications();
            // });
        // }
        checkNotification()
    }, []);

    const socket = useContext(SocketContext).socket;
    const checkNotification = async () =>{
        await socket.on('test', (data) => {
            getNotifications();
        });
        console.log('socket', socket);
    }

    // useEffect(() => {
    //     registerServiceWorker().then(() => {
    //         requestNotificationPermission();
    //       });
    // }, []);

    // const requestNotificationPermission = async () => {
    //     if ('Notification' in window) {
    //         generateToken();
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

    // const saveToken = async (token) => {
    //     try {
    //         const response = await axios.post('/api/notificationToken', { token });
    //         // console.log(response.data);
    //     } catch (error) {
    //         console.log(error);
    //     }
    // };

    const getUserData = async () => {
        try {
            const response = await axios.get('/api/users/profile');
            setProfile({ username: response.data.data.username, userType: response.data.data.type });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserData();
        getNotifications();
    }, []);

    const getNotifications = async () => {
        try {
            const response = await axios.get('/api/users/notification');
            setNotifications(response.data.data);
            setUnreadNotifications(response.data.data.length);
        } catch (error) {
            console.log(error);
        }
    };

    const readNotifications = async () => {
        try {
            const response = await axios.put('/api/users/notification');
            console.log(response)
            getNotifications()
            // setNotifications(response.data.data);
            // setUnreadNotifications(response.data.data.length);
        } catch (error) {
            console.log(error); 
        }
    };

    const handleBellClick = () => {
        setOpenNotification(!openNotification);
        if(unreadNotifications>0)
        {
            readNotifications()
        }
    };

    const onLogout = async () => {
        try {
            const response = await axios.get('/api/users/logout');
            router.push('/login');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <header>
            <Navbar
                fluid
                className="fixed top-0 z-30 w-full border-b border-gray-200 bg-white p-0 dark:border-gray-700 dark:bg-gray-800 sm:p-0"
            >
                <div className="w-full p-3 pr-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <button
                                aria-controls="sidebar"
                                aria-expanded
                                className="mr-2 cursor-pointer rounded p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:ring-2 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:bg-gray-700 dark:focus:ring-gray-700"
                                onClick={() => setSidebarCollapsed(!isSidebarCollapsed)}
                            >
                                {isSidebarCollapsed || !isSmallScreen() ? (
                                    <HiMenuAlt1 className="h-6 w-6" />
                                ) : (
                                    <HiX className="h-6 w-6" />
                                )}
                            </button>
                            <Navbar.Brand href="/">
                                {/* <Image alt="Mieszko" height="24" src="/favicon.ico" width="24" /> */}
                                <img src='/favicon.ico' alt='Mieszko' />
                                <span className="self-center whitespace-nowrap px-3 text-xl font-semibold dark:text-white">
                                    Mieszko
                                </span>
                            </Navbar.Brand>
                        </div>
                        <div className="flex-grow" />
                        <div className="flex items-end space-x-4">
                            <h3>{profile.username}</h3>|<h3>{profile.userType}</h3>
                        </div>
                        <div className="flex items-end space-x-4">
                            <DarkThemeToggle />
                            <button className="rounded bg-red-900 p-2 pr-4 pl-4 text-white" onClick={onLogout}>
                                <HiOutlineLogout />
                            </button>
                            <button className="rounded bg-red-900 p-2 pr-4 pl-4 text-white relative" onClick={handleBellClick}>
                                <HiOutlineBell />
                                {unreadNotifications > 0 && (
                                    <span className="notification-count absolute top-0 right-0 bg-white text-red-900 rounded-full h-5 w-5 flex items-center justify-center">{unreadNotifications}</span>
                                )}
                            </button>
                            {openNotification && (
                                <div className="relative">
                                    <div className="absolute right-0 mt-2 w-56 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                                        <div className="py-0">
                                        {notifications?.map((notification, index) => (
                                            <div key={index} className="px-4 py-2 text-sm text-gray-700">
                                                {notification.message}
                                            </div>
                                        )) || []} 
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Navbar>
        </header>
    );
};
