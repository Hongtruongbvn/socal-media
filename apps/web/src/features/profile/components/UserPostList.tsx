// File: src/features/profile/components/UserPostList.tsx (Cập nhật UI)
import React, { useEffect, useState, useCallback } from 'react';
import api from '../../../services/api';
import PostCard from '../../feed/components/PostCard';
import type { Post } from '../../feed/types/Post';
import './UserPostList.scss';

interface UserPostListProps {
  userId: string;
}

const UserPostList: React.FC<UserPostListProps> = ({ userId }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUserPosts = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await api.get(`/posts/user/${userId}`);
      setPosts(response.data);
    } catch (error) {
      console.error("Lỗi khi tải bài đăng của người dùng:", error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUserPosts();
  }, [fetchUserPosts]);

  if (loading) return <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', background: '#334155', borderRadius: '24px' }}>⏳ Đang tải bài đăng...</div>;
  if (posts.length === 0) return <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8', background: '#334155', borderRadius: '24px' }}>📭 Người dùng này chưa có bài đăng nào.</div>;

  return (
    <div className="user-post-list">
      {posts.map((post) => (
        <PostCard 
          key={post._id}
          post={post}
          onReact={() => {}}
          onRepost={() => {}}
          onPostDeleted={() => {}}
          onCommentAdded={() => {}}
          onCommentDeleted={() => {}}
          onPostUpdated={() => {}}
        />
      ))}
    </div>
  );
};

export default UserPostList;