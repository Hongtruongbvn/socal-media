import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../features/auth/AuthContext';
import Button from '../components/common/Button';
import './SelectInterestsPage.scss';

interface Interest {
  _id: string;
  name: string;
}

const SelectInterestsPage: React.FC = () => {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const { fetchUser, user } = useAuth();
console.log('user in SelectInterestsPage:', user);
  const navigate = useNavigate();

  useEffect(() => {
    api.get<Interest[]>('/interests').then(res => {
      console.log('res.data', res.data);
      setInterests(res.data);
    });
  }, []);

  const handleToggleInterest = (id: string) => {
    setSelectedIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleSubmit = async () => {
    if (selectedIds.size < 3) {
      alert('Vui lòng chọn ít nhất 3 sở thích.');
      return;
    }
    try {
      await api.patch('/users/me/interests', { interestIds: Array.from(selectedIds) });
      await fetchUser();
      navigate('/');
    } catch (error) {
      console.error('Lỗi khi lưu sở thích:', error);
    }
  };

  return (
    <div className="select-interests-page">
      <div className="container">
        <div style={{ marginBottom: '16px' }}>
          <span style={{ fontSize: '48px' }}>🎯</span>
        </div>
        <h1>Chào mừng bạn!</h1>
        <p>Hãy cho chúng tôi biết bạn quan tâm đến điều gì để có những gợi ý tốt nhất.</p>
        <div className="interests-grid">
          {interests.map(interest => (
            <button
              key={interest._id}
              className={`interest-tag ${selectedIds.has(interest._id) ? 'selected' : ''}`}
              onClick={() => handleToggleInterest(interest._id)}
            >
              {interest.name}
            </button>
          ))}
        </div>
        <Button onClick={handleSubmit} disabled={selectedIds.size < 3} style={{
          background: selectedIds.size >= 3 ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#ccc',
          border: 'none',
          padding: '14px 32px',
          borderRadius: '40px',
          fontSize: '16px',
          fontWeight: '600',
          cursor: selectedIds.size >= 3 ? 'pointer' : 'not-allowed'
        }}>
          Tiếp tục ({selectedIds.size}/3)
        </Button>
        <p style={{ fontSize: '13px', color: '#999', marginTop: '20px' }}>
          Đã chọn {selectedIds.size} sở thích
        </p>
      </div>
    </div>
  );
};
export default SelectInterestsPage;