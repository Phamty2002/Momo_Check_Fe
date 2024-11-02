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
                {user && <Link to="/" className="navbar-brand">Momo_Check</Link>}
            </div>
            <div className="navbar-right">
                {user ? (
                    <>
                        {/* <Link to="/profile">Profile</Link> */} {/* Đã ẩn liên kết Profile */}
                        <button onClick={handleLogout}>Đăng Xuất</button>
                    </>
                ) : (
                    <Link to="/login">Đăng Nhập</Link>
                )}
            </div>
        </nav>
    );
}

export default NavBar;
