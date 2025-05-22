import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";
import AuthModel from "../models/AuthModel";

function Profile() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(AuthModel.getCurrentUser());
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAvatarUploading, setIsAvatarUploading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUser(null);
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/auth/me`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch user");
        }

        AuthModel.updateUser(data);
        setUser(data);
      } catch (err) {
        console.error("Fetch user error:", err);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleProfileUpdate = async (newData) => {
    try {
      setIsLoading(true);
      setError(null);

      const updatedUser = await AuthModel.updateProfile(newData);
      setUser(updatedUser.user);
      setUpdateSuccess(true);

      setTimeout(() => setUpdateSuccess(false), 3000);
      setIsModalOpen(false);
    } catch (err) {
      console.error("Profile update error:", err);
      setError(err.message || "Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsAvatarUploading(true);
      const data = await AuthModel.uploadAvatar(file);
      handleProfileUpdate({ avatar: data.avatar });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsAvatarUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container_profile">
        <Header />
        <main>
          <div className="profile_header">
            <h2>Loading...</h2>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="container_profile">
      <Header />
      <main>
        {updateSuccess && (
          <div className="success-message">Profile updated successfully!</div>
        )}
        {error && <div className="error-message">{error}</div>}
        <div className="profile_header">
          <h2>User Profile</h2>
          <div className="avatar-container">
            <img
              src={
                user?.avatar
                  ? `${import.meta.env.VITE_API_URL}/uploads/avatars/${
                      user.avatar
                    }`
                  : "/images/default_avatar.png"
              }
              className="profile_logo"
              alt="Profile Avatar"
            />
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarUpload}
              style={{ display: "none" }}
              disabled={isAvatarUploading}
            />
            {isAvatarUploading && (
              <div className="uploading-message">Uploading avatar...</div>
            )}
          </div>
        </div>

        <div className="user_content">
          <h2>ACCOUNT</h2>
          <div className="user-details">
            <p>
              <strong>Username:</strong> {user?.username}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
          </div>

          <div className="profile-actions">
            <div className="edit_profile" onClick={() => setIsModalOpen(true)}>
              <img
                src="/images/pen_icon.png"
                className="img_profile"
                alt="Edit Icon"
              />
              <p>Edit profile</p>
            </div>

            <div
              className="Playlists_profile"
              onClick={() => navigate("/recent")}
            >
              <img
                src="/images/list_icon.png"
                className="img_profile"
                alt="Playlists Icon"
              />
              <p>Recent playlists</p>
            </div>
          </div>
        </div>

        {user && (
          <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            title="Edit Profile"
            user={user}
            onUpdate={handleProfileUpdate}
          />
        )}
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
