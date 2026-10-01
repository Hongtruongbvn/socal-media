import React, { useState } from 'react';
import api from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { Link } from 'react-router-dom';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      const response = await api.post('/auth/forgot-password', { email });
      setMessage(response.data.message);
    } catch (err) {
      setMessage('Có lỗi xảy ra, vui lòng thử lại.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #ffb74d 0%, #48D1CC 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '32px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔑</div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1a1a2e',
          marginBottom: '12px'
        }}>Quên Mật khẩu</h2>
        {message ? (
          <div>
            <p style={{
              padding: '16px',
              backgroundColor: '#d4edda',
              color: '#155724',
              borderRadius: '16px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>{message}</p>
            <Link to="/login">
              <button style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
                borderRadius: '40px',
                color: 'white',
                fontWeight: '600',
                cursor: 'pointer'
              }}>🔐 Quay lại Đăng nhập</button>
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <p style={{ color: '#666', marginBottom: '20px', fontSize: '14px' }}>
              Nhập email của bạn để nhận link đặt lại mật khẩu.
            </p>
            <Input
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '1px solid #e0e0e0',
                borderRadius: '40px',
                marginBottom: '20px',
                fontSize: '16px'
              }}
            />
            <Button type="submit" style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '40px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer'
            }}>📧 Gửi yêu cầu</Button>
          </form>
        )}
        <div style={{ marginTop: '20px' }}>
          <Link to="/login" style={{ color: '#667eea', textDecoration: 'none', fontSize: '14px' }}>
            ← Quay lại Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};
export default ForgotPasswordPage;