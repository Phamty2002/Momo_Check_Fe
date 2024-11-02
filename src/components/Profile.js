// src/components/Profile.js

import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import './Profile.css';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Profile() {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            try {
                const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setUserData(response.data.user);
            } catch (err) {
                console.error(err);
                setError('Không thể lấy thông tin người dùng.');
                logout();
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [logout, navigate]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) {
        return <p>Đang tải...</p>;
    }

    if (error) {
        return <p className="error">{error}</p>;
    }

    return (
        <div className="profile-container">
            <h2>Thông Tin Người Dùng</h2>
            <p><strong>Username:</strong> {userData.username}</p>
            <p><strong>Email:</strong> {userData.email}</p>
            <button onClick={handleLogout}>Đăng Xuất</button>
        </div>
    );
}

export default Profile;
