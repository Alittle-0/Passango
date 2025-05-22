// src/components/Modal.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function Modal({ isOpen, onClose, title, user, setUser }) {
  //popup form 
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
  // Close modal on "Escape" key press
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'auto'; // Restore scrolling
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        <form onSubmit={handleSubmit}>
          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
          <div className="profile_avatar">
            <label htmlFor="avatar">Profile Avatar</label>
            {avatarPreview && (
            <img
                src={avatarPreview}
                alt="Avatar Preview"
                //style={{ width: '100px', height: '100px', borderRadius: '50px', margin: '10px 0' }}
            />
            )}
            <input
              type="file"
              id="avatar"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              //style={{ display: 'none' }}
            />
            <label htmlFor="avatar" className="avatar_upload_label">
              Choose Avatar
            </label>
          </div>
          <button type="submit" className="modal-btn">
            Update Avatar
          </button>
        </form>
      </div>
    </div>
  );
}

export default Modal;
