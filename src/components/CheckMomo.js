// src/components/CheckMomo.js

import React, { useState, useContext } from 'react';
import axios from 'axios';
import './CheckMomo.css';
import { AuthContext } from '../contexts/AuthContext';

function CheckMomo() {
    const [phone, setPhone] = useState('+'); // Khởi tạo với dấu +
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const { user } = useContext(AuthContext);

    const handlePhoneChange = (e) => {
        let input = e.target.value;

        // Nếu người dùng cố gắng xóa dấu +, đặt lại chuỗi thành +
        if (input.length === 0) {
            setPhone('+');
            return;
        }

        // Nếu người dùng cố gắng xóa dấu + ở đầu, đặt lại dấu +
        if (input[0] !== '+') {
            input = '+' + input.replace(/^\+*/, ''); // Đảm bảo chỉ có một dấu + ở đầu
        }

        setPhone(input);
    };

    const handleCheckMomo = async (e) => {
        e.preventDefault();

        // Kiểm tra định dạng số điện thoại (cho phép có dấu + ở đầu và từ 9 đến 15 chữ số)
        const phoneRegex = /^\+?\d{9,15}$/;
        if (!phoneRegex.test(phone)) {
            setError(
                <span>
                    Vui lòng nhập số điện thoại hợp lệ (<strong>từ 9 đến 15 chữ số</strong>, có thể bắt đầu bằng <strong>+</strong>).
                </span>
            );
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `${process.env.REACT_APP_API_URL}/api/check-momo`,
                { phone: phone },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            // Kiểm tra giá trị của 'error' trong phản hồi
            if (response.data.error === 0 && response.data.name) {
                setResult(response.data);
            } else if (response.data.message) {
                setError(response.data.message);
            } else {
                setError(
                    <span>
                        Số điện thoại <strong>{phone}</strong> không được đăng kí Momo.
                    </span>
                );
            }
        } catch (err) {
            console.error(err);

            // Kiểm tra lỗi phản hồi từ backend
            if (err.response) {
                // Yêu cầu đã được gửi và server đã phản hồi với mã trạng thái khác 2xx
                setError(err.response.data.message || 'Đã xảy ra lỗi khi gọi API.');
            } else if (err.request) {
                // Yêu cầu đã được gửi nhưng không nhận được phản hồi
                setError('Không thể kết nối đến server. Vui lòng thử lại sau.');
            } else {
                // Một lỗi xảy ra khi thiết lập yêu cầu
                setError('Đã xảy ra lỗi khi thiết lập yêu cầu.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="check-momo-container">
            <h1 className="title">Kiểm Tra Tài Khoản Momo</h1>
            <p className="welcome-message">
                Xin chào, <strong>{user.username}</strong>!
            </p>
            <form className="check-form" onSubmit={handleCheckMomo}>
                <input
                    type="text"
                    placeholder="Nhập số điện thoại"
                    value={phone}
                    onChange={handlePhoneChange}
                    className="phone-input"
                />
                <button type="submit" disabled={loading} className="submit-button">
                    {loading ? 'Đang kiểm tra...' : 'Kiểm Tra'}
                </button>
            </form>

            {error && <p className="error-message">{error}</p>}

            {result && (
                <div className="result-container">
                    <p className="result-text">
                        Số điện thoại <strong>{result.phone}</strong> đã được đăng ký Momo với tên: <strong>{result.name}</strong>.
                    </p>
                </div>
            )}
        </div>
    );
}

export default CheckMomo;
