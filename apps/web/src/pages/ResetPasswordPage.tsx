import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const ResetPasswordPage: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.post(`/auth/reset-password/${token}`, { password });
      setMessage('Đặt lại mật khẩu thành công!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setMessage('Token không hợp lệ hoặc đã hết hạn.');
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
        borderRadius: '24px',
        padding: '40px 32px',
        width: '100%',
        maxWidth: '440px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        textAlign: 'center'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px'
        }}>
          <span style={{ fontSize: '32px' }}>🔐</span>
        </div>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1a1a2e',
          marginBottom: '12px'
        }}>Đặt lại mật khẩu</h2>
        {message ? (
          <div>
            <p style={{
              padding: '16px',
              backgroundColor: message.includes('thành công') ? '#d4edda' : '#f8d7da',
              color: message.includes('thành công') ? '#155724' : '#721c24',
              borderRadius: '12px',
              fontSize: '14px',
              marginBottom: '20px'
            }}>{message}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '24px' }}>
              <Input
                type="password"
                placeholder="Mật khẩu mới"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.2s'
                }}
              />
            </div>
            <Button type="submit" style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              borderRadius: '12px',
              color: 'white',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'transform 0.2s'
            }}>Xác nhận</Button>
          </form>
        )}
      </div>
    </div>
  );
};
export default ResetPasswordPage;