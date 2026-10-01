import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { blockUser, unblockUser, getBlockStatus } from '../services/user';
import { useAuth } from '../features/auth/AuthContext';
import { publicUrl } from '../untils/publicUrl';
import './FriendsListPage.scss';

interface Friend {
  _id: string;
  username: string;
  fullName?: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: number;
}

const FriendsListPage: React.FC = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [blockStatus, setBlockStatus] = useState<Record<string, boolean>>({});
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      const response = await api.get('/friends/list');
      const friendsData = response.data.friends || response.data;
      
      const formattedFriends = friendsData.map((friend: any) => ({
        _id: friend._id || friend.id,
        username: friend.username || friend.name,
        fullName: friend.fullName || friend.username,
        avatar: friend.avatar || friend.profilePicture,
        isOnline: friend.isOnline || false,
        lastSeen: friend.lastSeen
      }));
      
      setFriends(formattedFriends);
      
      const blockStatusMap: Record<string, boolean> = {};
      for (const friend of formattedFriends) {
        try {
          const status = await getBlockStatus(friend._id);
          blockStatusMap[friend._id] = status.blockedByMe;
        } catch (err) {
          blockStatusMap[friend._id] = false;
        }
      }
      setBlockStatus(blockStatusMap);
    } catch (err) {
      console.error('Error fetching friends:', err);
      setError('Không thể tải danh sách bạn bè');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (friendId: string) => {
    try {
      await blockUser(friendId);
      setBlockStatus(prev => ({ ...prev, [friendId]: true }));
      alert('✅ Đã chặn người dùng');
    } catch (err) {
      alert('❌ Chặn thất bại');
    }
  };

  const handleUnblockUser = async (friendId: string) => {
    try {
      await unblockUser(friendId);
      setBlockStatus(prev => ({ ...prev, [friendId]: false }));
      alert('✅ Đã bỏ chặn người dùng');
    } catch (err) {
      alert('❌ Bỏ chặn thất bại');
    }
  };

  const handleUnfriend = async (friendId: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa bạn này?')) return;
    try {
      await api.delete(`/friends/${friendId}`);
      setFriends(prev => prev.filter(friend => friend._id !== friendId));
      alert('✅ Đã xóa bạn');
    } catch (err) {
      alert('❌ Xóa bạn thất bại');
    }
  };

  const handleChat = async (friendId: string, username: string, avatar?: string) => {
    window.dispatchEvent(new CustomEvent('open-dm', {
      detail: { userId: friendId, username, avatar }
    }));
  };

  const handleViewProfile = (friendId: string, username: string) => {
    navigate(`/profile/${username || friendId}`);
  };

  if (loading) {
    return (
      <div className="friends-list-page">
        <div className="friends-header">
          <h2>👥 Danh sách bạn bè</h2>
        </div>
        <div className="loading">⏳ Đang tải bạn bè...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="friends-list-page">
        <div className="friends-header">
          <h2>👥 Danh sách bạn bè</h2>
        </div>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="friends-list-page">
      <div className="friends-header">
        <h2>👥 Bạn bè</h2>
        <span className="friends-count">{friends.length} người</span>
      </div>

      <div className="friends-list">
        {friends.length === 0 ? (
          <div className="no-friends">📭 Bạn chưa có bạn bè nào.</div>
        ) : (
          friends.map(friend => (
            <div key={friend._id} className="friend-item">
              <div className="friend-info">
                <div className="friend-avatar">
                  <img 
                    src={friend.avatar ? publicUrl(friend.avatar) : '/images/default-user.png'} 
                    alt={friend.username}
                  />
                  <span className={`status-indicator ${friend.isOnline ? 'online' : 'offline'}`}></span>
                </div>
                <div className="friend-details">
                  <h3 className="friend-name">{friend.fullName || friend.username}</h3>
                  <p className="friend-username">@{friend.username}</p>
                  <p className="friend-status">
                    {friend.isOnline ? '🟢 Đang hoạt động' : `⏰ ${formatLastSeen(friend.lastSeen)}`}
                  </p>
                </div>
              </div>
              
              <div className="friend-actions">
                <button className="btn btn-primary" onClick={() => handleChat(friend._id, friend.username, friend.avatar)}>
                  💬 Nhắn tin
                </button>
                <button className="btn btn-secondary" onClick={() => handleViewProfile(friend._id, friend.username)}>
                  👤 Xem hồ sơ
                </button>
                {blockStatus[friend._id] ? (
                  <button className="btn btn-warning" onClick={() => handleUnblockUser(friend._id)}>
                    🔓 Bỏ chặn
                  </button>
                ) : (
                  <button className="btn btn-danger" onClick={() => handleBlockUser(friend._id)}>
                    🚫 Chặn
                  </button>
                )}
                <button className="btn btn-danger" onClick={() => handleUnfriend(friend._id)}>
                  ❌ Xóa bạn
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const formatLastSeen = (timestamp?: number): string => {
  if (!timestamp) return 'không rõ';
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (minutes < 1) return 'vừa xong';
  if (minutes < 60) return `${minutes} phút trước`;
  if (hours < 24) return `${hours} giờ trước`;
  return `${days} ngày trước`;
};

export default FriendsListPage;