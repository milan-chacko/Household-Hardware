import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState({ isAuthenticated: false, username: '' });

    const login = (username) => {
        setAuthState({ isAuthenticated: true, username });
        sessionStorage.setItem('username', username); // Store firstname in session
    };

    const logout = () => {
        setAuthState({ isAuthenticated: false, username: '' });
        sessionStorage.removeItem('username');
    };

    return (
        <AuthContext.Provider value={{ ...authState, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
