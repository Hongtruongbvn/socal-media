import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import './StatusPages.scss';
import Button from '../components/common/Button';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Đang xác thực email của bạn...');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      api.get(`/auth/verify-email?token=${token}`)
        .then(() => {
          setStatus('success');
          setMessage('Xác thực thành công! Giờ bạn có thể đăng nhập.');
        })
        .catch((err) => {
          setStatus('error');
          setMessage(err.response?.data?.message || 'Token không hợp lệ hoặc đã hết hạn.');
        });
    } else {
      setStatus('error');
      setMessage('Không tìm thấy token xác thực.');
    }
  }, [searchParams]);

  return (
    <div className="status-page">
      <div className={`status-card ${status}`}>
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>
          {status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳'}
        </div>
        <h2>{status === 'success' ? 'Thành công!' : (status === 'error' ? 'Thất bại!' : 'Đang xử lý...')}</h2>
        <p>{message}</p>
        {status !== 'verifying' && (
          <Link to="/login">
            <Button style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              border: 'none',
              padding: '12px 32px',
              borderRadius: '40px',
              color: 'white',
              fontWeight: '600',
              cursor: 'pointer'
            }}>🔐 Về trang Đăng nhập</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
export default VerifyEmailPage;