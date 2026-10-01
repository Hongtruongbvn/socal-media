import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { username, email, password });
      toast.success('✅ Đăng ký thành công! Vui lòng kiểm tra email để xác thực.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || '❌ Đăng ký thất bại');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '32px',
        padding: '48px 40px',
        width: '100%',
        maxWidth: '460px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '56px', marginBottom: '16px' }}>📝</div>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backgroundClip: 'text',
          WebkitBackgroundClip: 'text',
          color: 'transparent',
          marginBottom: '32px'
        }}>Tạo tài khoản</h2>
        
        <form onSubmit={handleSubmit}>
          <Input
            placeholder="👤 Tên người dùng"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px 18px',
              border: '1px solid #e0e0e0',
              borderRadius: '40px',
              marginBottom: '16px',
              fontSize: '16px'
            }}
          />
          <Input
            type="email"
            placeholder="📧 Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px 18px',
              border: '1px solid #e0e0e0',
              borderRadius: '40px',
              marginBottom: '16px',
              fontSize: '16px'
            }}
          />
          <Input
            type="password"
            placeholder="🔒 Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '14px 18px',
              border: '1px solid #e0e0e0',
              borderRadius: '40px',
              marginBottom: '24px',
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
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'transform 0.2s'
          }}>Đăng ký</Button>
        </form>
        
        <div style={{ marginTop: '24px' }}>
          <span style={{ color: '#666', fontSize: '14px' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ color: '#667eea', fontWeight: '600', textDecoration: 'none' }}>
              Đăng nhập
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};
export default RegisterPage;