import { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../../services/api';
import type { UserProfile } from '../types/UserProfile';
import styles from './EditProfileUser.module.scss';

const EditProfileUser: React.FC = () => {
  const { username: paramUsername } = useParams<{ username: string }>();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Partial<UserProfile>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [nameError, setNameError] = useState<string | null>(null);

  useEffect(() => {
    if (!paramUsername) return;
    api
      .get<UserProfile>(`/users/${paramUsername}`)
      .then(res => setProfile(res.data))
      .catch(err => {
        console.error('GET /users/:username error', err);
        alert('❌ Không tải được hồ sơ.');
      });
  }, [paramUsername]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));

    if (name === 'username') {
      const len = value.trim().length;
      if (len < 6 || len > 12) {
        setNameError('Tên hiển thị phải từ 6 đến 12 ký tự');
      } else {
        setNameError(null);
      }
    }
  };

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setAvatarFile(file);
    if (file) {
      setProfile(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setCoverFile(file);
    if (file) {
      setProfile(prev => ({ ...prev, coverImage: URL.createObjectURL(file) }));
    }
  };

  const publicUrl = (path: string) =>
    path.startsWith('http') ? path : `http://localhost:8888${path}`;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nameLen = (profile.username?.trim().length ?? 0);
    if (nameLen < 6 || nameLen > 12) {
      alert('❌ Tên hiển thị phải từ 6 đến 12 ký tự');
      return;
    }

    try {
      const { data: updatedProfile } = await api.patch<UserProfile>(
        '/users/me',
        {
          username: profile.username,
          bio: profile.bio,
        }
      );

      if (avatarFile) {
        const fd = new FormData();
        fd.append('avatar', avatarFile);
        const { data: avatarRes } = await api.patch<UserProfile>(
          '/users/me/avatar',
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        updatedProfile.avatar = avatarRes.avatar;
      }

      if (coverFile) {
        const fd = new FormData();
        fd.append('cover', coverFile);
        const { data: coverRes } = await api.patch<UserProfile>(
          '/users/me/cover',
          fd,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        updatedProfile.coverImage = coverRes.coverImage;
      }

      navigate(`/profile/${updatedProfile.username}`, {
        state: { updatedProfile },
      });
    } catch (err: any) {
      console.error('Profile update error', err.response || err);
      alert(`❌ Cập nhật thất bại: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className={styles.container}>
      <h1>✏️ Chỉnh sửa hồ sơ</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <label>
          📸 Ảnh bìa
          <input type="file" accept="image/*" onChange={handleCoverChange} />
        </label>
        {profile.coverImage && (
          <img
            src={
              profile.coverImage.startsWith('blob:')
                ? profile.coverImage
                : publicUrl(profile.coverImage)
            }
            alt="Cover preview"
            className={styles.previewCover}
          />
        )}

        <label>
          🖼️ Avatar
          <input type="file" accept="image/*" onChange={handleAvatarChange} />
        </label>
        {profile.avatar && (
          <img
            src={
              profile.avatar.startsWith('blob:')
                ? profile.avatar
                : publicUrl(profile.avatar)
            }
            alt="Avatar preview"
            className={styles.previewAvatar}
          />
        )}

        <label>
          👤 Tên hiển thị
          <input
            type="text"
            name="username"
            value={profile.username || ''}
            onChange={handleChange}
            minLength={6}
            maxLength={12}
            required
          />
        </label>
        {nameError && <small style={{ color: '#f87171' }}>{nameError}</small>}

        <label>
          📝 Tiểu sử
          <textarea
            name="bio"
            rows={4}
            value={profile.bio || ''}
            onChange={handleChange}
            placeholder="Hãy giới thiệu đôi chút về bản thân..."
          />
        </label>

        <div className={styles.buttons}>
          <button type="submit" className={styles.save} disabled={!!nameError}>
            💾 Lưu thay đổi
          </button>
          <button
            type="button"
            className={styles.cancel}
            onClick={() => navigate(-1)}
          >
            ❌ Hủy bỏ
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfileUser;