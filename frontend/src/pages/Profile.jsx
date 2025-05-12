import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Modal from '../components/Modal';

function Profile() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch user');
        }

        setUser(data);
      } catch (err) {
        console.error('Fetch user error:', err);
        setError(err.message);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container_profile">
      <Header />
      <main>
        <div className="profile_header">
          <h2>User Profile</h2>
          <img
            src={user.avatar ? `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.avatar}` : 'public/images/default_avatar.png'}
            className="profile_logo"
            alt="Profile Avatar"
          />
        </div>
        <div className="user_content">
          <h2>ACCOUNT</h2>
          <div className="edit_profile" onClick={() => setIsModalOpen(true)}>
            <img src="public/images/pen_icon.png" className="img_profile" alt="Edit Icon" />
            <p>Edit profile</p>
          </div>
          <div className="Playlists_profile">
            <img src="public/images/list_icon.png" className="img_profile" alt="Playlists Icon" />
            <p>Recent playlists</p>
          </div>
         {/*  <div className="reset_profile" onClick={() => setIsModalOpen(true)}>
            <img src="public/images/unlock_icon.png" className="img_profile" alt="Reset Icon" />
            <p>Reset password</p>
          </div>   */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Update Profile">
            <ProfileForm user={user} setUser={setUser} onClose={() => setIsModalOpen(false)} />
          </Modal>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ProfileForm({ user, setUser }) {
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(user.avatar ? `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.avatar}` : null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!['image/jpeg', 'image/png'].includes(file.type)) {
        setError('Please upload a JPEG or PNG image.');
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        setError('Image size must be less than 2MB.');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return;
    }

    try {
      if (!avatarFile) {
        setError('Please select an image to upload');
        return;
      }

      const formData = new FormData();
      formData.append('avatar', avatarFile);

      const avatarResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/upload-avatar`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const avatarData = await avatarResponse.json();
      if (!avatarResponse.ok) {
        throw new Error(avatarData.message || 'Failed to upload avatar');
      }

      setUser({ ...user, avatar: avatarData.avatar });
      localStorage.setItem('user', JSON.stringify({ ...user, avatar: avatarData.avatar }));
      setSuccess('Avatar uploaded successfully');
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <div className="profile_avatar">
        <label htmlFor="avatar">Profile Avatar</label>
        {avatarPreview && (
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            style={{ width: '100px', height: '100px', borderRadius: '50px', margin: '10px 0' }}
          />
        )}
        <input
          type="file"
          id="avatar"
          accept="image/jpeg,image/png"
          onChange={handleAvatarChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="avatar" className="avatar_upload_label">
          Choose Avatar
        </label>
      </div>
      <button type="submit" className="modal-btn">
        Update Avatar
      </button>
    </form>
  );
}

export default Profile;