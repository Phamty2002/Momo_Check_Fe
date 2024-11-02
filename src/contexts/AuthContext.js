// src/contexts/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Sử dụng named export
// Hoặc nếu bạn đã import mặc định như sau:
// import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwtDecode(token); // Sử dụng jwtDecode thay vì jwt_decode
                // Kiểm tra token hết hạn
                const currentTime = Date.now() / 1000;
                if (decoded.exp < currentTime) {
                    localStorage.removeItem('token');
                    setUser(null);
                } else {
                    setUser({ id: decoded.id, username: decoded.username });
                }
            } catch (error) {
                console.error('Lỗi khi giải mã token:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    }, []);

    const login = (token) => {
        localStorage.setItem('token', token);
        const decoded = jwtDecode(token); // Sử dụng jwtDecode thay vì jwt_decode
        setUser({ id: decoded.id, username: decoded.username });
    };

    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
