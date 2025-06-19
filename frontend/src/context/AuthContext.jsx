import React from 'react'
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/profile`, {
                    withCredentials: true,
                });
                setUser(res.data.user) 
            } catch (error) {
                setUser(null);
            }
        };
        fetchUser();
    }, []);

     const logout = async () => {
        await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/logout`, {
            withCredentials: true,
        });
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, setUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);