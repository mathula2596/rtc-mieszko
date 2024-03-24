import React from 'react';
import { useEffect, useState } from 'react';
import axios from 'axios';

export const ProfileContext = React.createContext();


export const ProfileContextProvider = ({children}) => {

    const [profile, setProfile] = useState({});
 
    const getUserData = async () => {
        try {
            const response = await axios.get('/api/users/profile');
            // console.log(response.data.data);
            setProfile({ username: response.data.data.username, userType: response.data.data.type });
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUserData()
    }, []);

    return (
        <ProfileContext.Provider value={{profile}}>
            {children}
        </ProfileContext.Provider>
    );
};
