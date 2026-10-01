import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as groupApi from '../services/group.api';
import { getInterests } from '../services/interest.api';
import Button from '../components/common/Button';
import './GroupManagementPage.scss';
import type { UpdateGroupDto } from '../features/groups/types/GroupDto';
import { FaCamera, FaSave, FaTrash } from 'react-icons/fa';
import { useToast } from '../components/common/Toast/ToastContext';
import { publicUrl } from '../untils/publicUrl';

type ManagementTab = 'settings' | 'members' | 'requests' | 'danger';

const GroupManagementPage: React.FC = () => {
  const { id: groupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { addToast } = useToast();
  const [activeTab, setActiveTab] = useState<ManagementTab>('settings');
  const [formState, setFormState] = useState<UpdateGroupDto & { interestIds?: string[] }>({});

  const avatarInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const { data: group, isLoading: isLoadingGroup } = useQuery({
    queryKey: ['group', groupId],
    queryFn: () => groupApi.getGroupById(groupId!),
    enabled: !!groupId,
  });

  const { data: members = [], refetch: refetchMembers } = useQuery({
    queryKey: ['groupMembers', groupId],
    queryFn: () => groupApi.getGroupMembers(groupId!),
    enabled: !!groupId,
  });

  const { data: requests = [], refetch: refetchRequests } = useQuery({
    queryKey: ['groupRequests', groupId],
    queryFn: () => groupApi.getGroupJoinRequests(groupId!),
    enabled: !!groupId,
  });

  const { data: allInterests = [] } = useQuery({
    queryKey: ['interests'],
    queryFn: getInterests,
  });

  useEffect(() => {
    if (group) {
      setFormState({
        name: group.name,
        description: group.description,
        privacy: group.privacy,
        interestIds: group.interests.map(interest => interest._id),
      });
    }
  }, [group]);

  const updateMutation = useMutation({
    mutationFn: (data: UpdateGroupDto & { interestIds?: string[] }) =>
      groupApi.updateGroup({ groupId: groupId!, groupData: data }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      addToast('✅ Cập nhật thông tin thành công!', 'success');
    },
    onError: () => addToast('❌ Cập nhật thất bại!', 'error'),
  });

  const uploadImageMutation = useMutation({
    mutationFn: groupApi.uploadGroupImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
      addToast('✅ Cập nhật ảnh thành công!', 'success');
    },
    onError: () => addToast('❌ Tải ảnh lên thất bại!', 'error'),
  });

  const deleteMutation = useMutation({
    mutationFn: () => groupApi.deleteGroup(groupId!),
    onSuccess: () => {
      addToast('✅ Đã xóa nhóm thành công.', 'success');
      queryClient.invalidateQueries({ queryKey: ['groups'] });
      navigate('/groups');
    },
    onError: () => addToast('❌ Xóa nhóm thất bại!', 'error'),
  });

  const kickMutation = useMutation({
    mutationFn: (memberUserId: string) =>
      groupApi.kickMember({ groupId: groupId!, memberUserId }),
    onSuccess: () => {
      addToast('✅ Đã xóa thành viên.', 'success');
      refetchMembers();
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });

  const approveMutation = useMutation({
    mutationFn: (requestId: string) => groupApi.approveJoinRequest(groupId!, requestId),
    onSuccess: () => {
      addToast('✅ Đã chấp thuận thành viên.', 'success');
      refetchRequests();
      refetchMembers();
      queryClient.invalidateQueries({ queryKey: ['group', groupId] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: (requestId: string) => groupApi.rejectJoinRequest(groupId!, requestId),
    onSuccess: () => {
      addToast('❌ Đã từ chối yêu cầu.', 'info');
      refetchRequests();
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormState(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    imageType: 'avatar' | 'cover'
  ) => {
    const file = e.target.files?.[0];
    if (file && groupId) {
      uploadImageMutation.mutate({ groupId, imageType, file });
    }
  };

  const handleInterestToggle = (interestId: string) => {
    setFormState(prev => {
      const currentIds = prev.interestIds || [];
      const newIds = currentIds.includes(interestId)
        ? currentIds.filter(id => id !== interestId)
        : [...currentIds, interestId];
      return { ...prev, interestIds: newIds };
    });
  };

  const confirmKick = (memberUserId: string, username: string) => {
    const ok = window.confirm(`Bạn có chắc muốn kick "${username}" khỏi nhóm?`);
    if (!ok) return;
    kickMutation.mutate(memberUserId);
  };

  const renderTabContent = () => {
    if (isLoadingGroup) return <p>⏳ Đang tải...</p>;

    switch (activeTab) {
      case 'settings':
        return (
          <div className="settings-tab">
            <h3>🖼️ Hình ảnh</h3>
            <div className="image-editors">
              <div className="image-editor">
                <label>Ảnh đại diện</label>
                <div className="avatar-preview" onClick={() => avatarInputRef.current?.click()}>
                  <img
                    src={publicUrl(group?.avatar) || 'https://placehold.co/150x150/f0f0f0/667eea?text=Avatar'}
                    alt="Avatar Preview"
                  />
                  <div className="overlay"><FaCamera /></div>
                </div>
                <input type="file" ref={avatarInputRef} onChange={e => handleImageChange(e, 'avatar')} accept="image/*" style={{ display: 'none' }} />
              </div>
              <div className="image-editor">
                <label>Ảnh bìa</label>
                <div className="cover-preview" onClick={() => coverInputRef.current?.click()}>
                  <img
                    src={publicUrl(group?.coverImage) || 'https://placehold.co/600x200/f0f0f0/667eea?text=Cover'}
                    alt="Cover Preview"
                  />
                  <div className="overlay"><FaCamera /></div>
                </div>
                <input type="file" ref={coverInputRef} onChange={e => handleImageChange(e, 'cover')} accept="image/*" style={{ display: 'none' }} />
              </div>
            </div>
            <hr />
            <h3>📝 Thông tin cơ bản</h3>
            <form onSubmit={e => { e.preventDefault(); updateMutation.mutate(formState); }}>
              <label>Tên nhóm</label>
              <input name="name" value={formState.name || ''} onChange={handleInputChange} />
              <label>Mô tả</label>
              <textarea name="description" value={formState.description || ''} onChange={handleInputChange} rows={4} />
              <label>Quyền riêng tư</label>
              <select name="privacy" value={formState.privacy || 'public'} onChange={handleInputChange}>
                <option value="public">🌍 Công khai</option>
                <option value="private">🔒 Riêng tư</option>
              </select>

              <hr />
              <h3>🏷️ Sở thích của nhóm</h3>
              <div className="interest-selection-container">
                {allInterests.map(interest => (
                  <label key={interest._id} className="interest-tag">
                    <input
                      type="checkbox"
                      checked={formState.interestIds?.includes(interest._id) || false}
                      onChange={() => handleInterestToggle(interest._id)}
                    />
                    {interest.name}
                  </label>
                ))}
              </div>

              <button type="submit" className="submit-btn" disabled={updateMutation.isPending} style={{ marginTop: '20px', padding: '12px 24px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none', borderRadius: '40px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>
                <FaSave /> Lưu thay đổi
              </button>
            </form>
          </div>
        );

      case 'members':
        return (
          <div className="list-container">
            {members.map(member => (
              <div key={member.user._id} className="item-row">
                <div className="item-details">
                  <Link to={`/profile/${member.user.username}`}>
                    <img className="item-avatar" src={publicUrl(member.user.avatar) || 'https://via.placeholder.com/52'} alt={member.user.username} />
                  </Link>
                  <div className="item-text-info">
                    <Link to={`/profile/${member.user.username}`} style={{ textDecoration: 'none' }}>
                      <strong>{member.user.username}</strong>
                    </Link>
                    <span className="role-badge">{member.role === 'OWNER' ? '👑 Chủ nhóm' : member.role === 'ADMIN' ? '⚙️ Quản trị' : '👤 Thành viên'}</span>
                  </div>
                </div>
                <div className="item-actions">
                  {member.role !== 'OWNER' && (
                    <button onClick={() => confirmKick(member.user._id, member.user.username)} disabled={kickMutation.isPending}>
                      🚫 Kick
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        );

      case 'requests':
        return (
          <div className="list-container">
            {requests.length > 0 ? (
              requests.map(req => (
                <div key={req._id} className="item-row">
                  <div className="item-details">
                    <Link to={`/profile/${req.user.username}`}>
                      <img className="item-avatar" src={publicUrl(req.user.avatar) || 'https://via.placeholder.com/52'} alt={req.user.username} />
                    </Link>
                    <div className="item-text-info">
                      <Link to={`/profile/${req.user.username}`} style={{ textDecoration: 'none' }}>
                        <strong>{req.user.username}</strong>
                      </Link>
                    </div>
                  </div>
                  <div className="item-actions" style={{ gap: '8px' }}>
                    <button onClick={() => approveMutation.mutate(req._id)} disabled={approveMutation.isPending} style={{ background: '#10b981', color: 'white', padding: '8px 18px', borderRadius: '40px', border: 'none', cursor: 'pointer' }}>✅ Chấp nhận</button>
                    <button onClick={() => rejectMutation.mutate(req._id)} disabled={rejectMutation.isPending} style={{ background: '#fee2e2', color: '#dc2626', padding: '8px 18px', borderRadius: '40px', border: 'none', cursor: 'pointer' }}>❌ Từ chối</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="page-status">📭 Không có yêu cầu tham gia nào.</p>
            )}
          </div>
        );

      case 'danger':
        return (
          <div className="danger-zone">
            <h3>⚠️ Xóa nhóm</h3>
            <p>Hành động này không thể hoàn tác. Tất cả bài viết và dữ liệu liên quan sẽ bị xóa vĩnh viễn.</p>
            <button onClick={() => { if (window.confirm('Bạn có chắc chắn muốn xóa nhóm này?')) deleteMutation.mutate(); }} disabled={deleteMutation.isPending}>
              <FaTrash /> Xóa nhóm này
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group-management-page">
      <h1>⚙️ Quản lý nhóm: {group?.name}</h1>
      <div className="management-tabs">
        <button className={`tab-button ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')}>Cài đặt</button>
        <button className={`tab-button ${activeTab === 'members' ? 'active' : ''}`} onClick={() => setActiveTab('members')}>Thành viên ({group?.memberCount || 0})</button>
        <button className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`} onClick={() => setActiveTab('requests')}>Yêu cầu ({requests.length})</button>
        <button className={`tab-button ${activeTab === 'danger' ? 'active' : ''}`} onClick={() => setActiveTab('danger')}>⚠️ Vùng nguy hiểm</button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>
    </div>
  );
};

export default GroupManagementPage;