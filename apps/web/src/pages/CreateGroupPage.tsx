import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import * as groupApi from '../services/group.api';
import { getInterests } from '../services/interest.api';
import type { CreateGroupDto } from '../features/groups/types/GroupDto';
import type { Interest } from '../features/groups/types/Group';
import Button from '../components/common/Button';
import './CreateGroupPage.scss';

const CreateGroupPage: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [privacy, setPrivacy] = useState<'public' | 'private'>('public');
  const [selectedInterestIds, setSelectedInterestIds] = useState<string[]>([]);

  const { data: allInterests = [], isLoading: isLoadingInterests } = useQuery({
    queryKey: ['interests'],
    queryFn: getInterests,
  });

  const createGroupMutation = useMutation({
    mutationFn: groupApi.createGroup,
    onSuccess: (newGroup) => {
      queryClient.invalidateQueries({ queryKey: ['groups', 'me'] });
      queryClient.invalidateQueries({ queryKey: ['groups', 'suggestions'] });
      navigate(`/groups/${newGroup._id}`);
    },
    onError: (error: any) => {
      alert(`Tạo nhóm thất bại: ${error.response?.data?.message || error.message}`);
    },
  });

  const handleInterestToggle = (interestId: string) => {
    setSelectedInterestIds(prev =>
      prev.includes(interestId)
        ? prev.filter(id => id !== interestId)
        : [...prev, interestId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Tên nhóm không được để trống.');
      return;
    }
    const groupData: CreateGroupDto = {
      name,
      description,
      privacy,
      interestIds: selectedInterestIds,
    };
    createGroupMutation.mutate(groupData);
  };

  return (
    <div className="create-group-page">
      <form onSubmit={handleSubmit} className="create-group-form">
        <h1>🌟 Tạo nhóm mới</h1>
        <p>Kết nối với những người cùng sở thích và đam mê.</p>

        <div className="form-group">
          <label>Tên nhóm</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Hội những người yêu game..." required />
        </div>

        <div className="form-group">
          <label>Mô tả (tùy chọn)</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} placeholder="Giới thiệu về nhóm của bạn..." />
        </div>

        <div className="form-group">
          <label>Chọn sở thích (tùy chọn)</label>
          {isLoadingInterests ? (
            <p>⏳ Đang tải danh sách sở thích...</p>
          ) : (
            <div className="interest-selection-container">
              {allInterests.map(interest => (
                <label key={interest._id} className="interest-tag">
                  <input
                    type="checkbox"
                    checked={selectedInterestIds.includes(interest._id)}
                    onChange={() => handleInterestToggle(interest._id)}
                  />
                  {interest.name}
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="form-group">
          <label>Quyền riêng tư</label>
          <div className="privacy-options">
            <label>
              <input
                type="radio"
                name="privacy"
                value="public"
                checked={privacy === 'public'}
                onChange={() => setPrivacy('public')}
              />
              🌍 Công khai
            </label>
            <label>
              <input
                type="radio"
                name="privacy"
                value="private"
                checked={privacy === 'private'}
                onChange={() => setPrivacy('private')}
              />
              🔒 Riêng tư
            </label>
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={createGroupMutation.isPending}>
          {createGroupMutation.isPending ? '⏳ Đang tạo...' : '✨ Tạo nhóm'}
        </button>
      </form>
    </div>
  );
};

export default CreateGroupPage;