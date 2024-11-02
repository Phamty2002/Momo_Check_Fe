// src/components/CheckMomo.js

import React, { useState } from 'react';
import axios from 'axios';
import './CheckMomo.css'; // Đảm bảo bạn đã tạo file CSS này

function CheckMomo() {
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleCheckMomo = async (e) => {
    e.preventDefault();

    // Kiểm tra định dạng số điện thoại (ví dụ: 10 chữ số)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      setError('Vui lòng nhập số điện thoại hợp lệ (10 chữ số).');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/check-momo`, {
        access_token: process.env.REACT_APP_ACCESS_TOKEN,
        phone: phone
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Kiểm tra giá trị của 'error' trong phản hồi
      if (response.data.error === 0 && response.data.name) {
        setResult(response.data);
      } else {
        setError('Số điện thoại không được đăng kí Momo.');
      }
    } catch (err) {
      console.error(err);
      setError('Đã xảy ra lỗi khi gọi API.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="check-momo-container">
      <h1>Kiểm Tra Tài Khoản Momo</h1>
      <form onSubmit={handleCheckMomo}>
        <input
          type="text"
          placeholder="Nhập số điện thoại"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Đang kiểm tra...' : 'Kiểm Tra'}
        </button>
      </form>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result">
          <p>
            Số điện thoại <strong>{result.phone}</strong> đã được đăng ký Momo với tên: <strong>{result.name}</strong>.
          </p>
        </div>
      )}
    </div>
  );
}

export default CheckMomo;
