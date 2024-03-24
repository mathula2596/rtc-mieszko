"use client"
import React from 'react';
import { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { CorsRequest } from 'cors';
export const SocketContext = React.createContext();


export const SocketContextProvider = ({children}) => {

    const [socket, setSocket] = useState(null);

    useEffect(() => {

        if(socket==null) {

            const socketIo = io('http://localhost:3005',{ reconnectionDelay: 1000,
                reconnection:true,
                reconnectionAttempts: 5,
                agent: false,
                upgrade: false,
                rejectUnauthorized: false,
                withCredentials: true,
            });

                setSocket(socketIo);

              

                return () => {
                    socketIo.disconnect();
                };
         
           
        }
        

        
    }, []);

    return (
        <SocketContext.Provider value={{socket}}>
            {children}
        </SocketContext.Provider>
    );
};
