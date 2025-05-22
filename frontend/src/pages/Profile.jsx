import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Modal from "../components/Modal";

function Profile() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const timeoutId = setTimeout(async () => {
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

          setUser(data);
        }, 300); // 300ms delay

        return () => clearTimeout(timeoutId);
      } catch (err) {
        console.error("Fetch user error:", err);
        setError(err.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

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

  if (error) {
    return (
      <div className="container_profile">
        <Header />
        <main>
          <div className="profile_header">
            <h2>Error: {error}</h2>
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
        <div className="profile_header">
          <h2>User Profile</h2>
          {user && (
            <img
              src={
                user.avatar?.data
                  ? `data:${user.avatar.contentType};base64,${user.avatar.data}`
                  : "/images/default_avatar.png"
              }
              className="profile_logo"
              alt="Profile Avatar"
            />
          )}
        </div>
        <div className="user_content">
          <h2>ACCOUNT</h2>
          <div className="edit_profile" onClick={() => setIsModalOpen(true)}>
            <img
              src="/images/pen_icon.png"
              className="img_profile"
              alt="Edit Icon"
            />
            <p>Edit profile</p>
          </div>
          <div className="Playlists_profile">
            <img
              src="/images/list_icon.png"
              className="img_profile"
              alt="Playlists Icon"
            />
            <p>Recent playlists</p>
          </div>
          {user && (
            <Modal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              title="Update Profile"
              user={user}
              setUser={setUser}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Profile;
