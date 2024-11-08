// src/components/NavBar.js

import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NavBar.css';
import { AuthContext } from '../contexts/AuthContext';

function NavBar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                {user && (
                    <Link to="/" className="navbar-brand">
                        <img src="/logo1.png" alt="Logo" className="navbar-logo" /> {/* Direct path to public folder */}
                        Momo Checking
                    </Link>
                )}
            </div>
            <div className="navbar-right">
                {user ? (
                    <>
                        <button onClick={handleLogout} className="navbar-button">Đăng Xuất</button>
                    </>
                ) : (
                    <Link to="/login" className="navbar-link">Đăng Nhập</Link>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
