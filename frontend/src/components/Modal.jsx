import React, { useEffect, useState } from "react";
import AuthModel from "../models/AuthModel";

function Modal({ isOpen, onClose, title, user, onUpdate }) {
  const [formData, setFormData] = useState({
    email: user?.email || "",
    username: user?.username || "",
  });
  const [avatarPreview, setAvatarPreview] = useState(
    user?.avatar
      ? `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.avatar}`
      : "/images/default_avatar.png"
  );
  const [error, setError] = useState(null);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);

  useEffect(() => {
    setAvatarPreview(
      user?.avatar
        ? `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.avatar}`
        : "/images/default_avatar.png"
    );
    setError(null);

    return () => {
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [user, isOpen, avatarPreview]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setIsAvatarUploading(true);
      if (avatarPreview.startsWith("blob:")) {
        URL.revokeObjectURL(avatarPreview);
      }
      const newPreview = URL.createObjectURL(file);
      setAvatarPreview(newPreview);
      const data = await AuthModel.uploadAvatar(file);
      onUpdate({ avatar: data.avatar });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAvatarUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await onUpdate({
        ...formData,
        avatar: user?.avatar,
      });
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">{title}</h2>
        <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          ×
        </button>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="avatar-section">
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="avatar-preview"
            />
            <label htmlFor="avatar-upload" className="avatar-upload-button">
              Change Avatar
              <span className="visually-hidden">Upload a new profile picture</span>
            </label>
            <input
              type="file"
              id="avatar-upload"
              accept="image/jpeg,image/png"
              onChange={handleAvatarChange}
              style={{ display: "none" }}
              disabled={isAvatarUploading}
            />
            {isAvatarUploading && (
              <div className="uploading-message">Uploading avatar...</div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" className="save-btn">
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Modal;