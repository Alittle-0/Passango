class AuthModel {
  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL;
    this.user = JSON.parse(localStorage.getItem("user")) || null;
    this.token = localStorage.getItem("token") || null;
  }

  // Helper method to get avatar URL
  getAvatarUrl() {
    if (this.user?.avatar?.data) {
      return `data:${this.user.avatar.contentType};base64,${this.user.avatar.data}`;
    }
    return "/images/default_avt.jpg";
  }

  // Get current user data
  getCurrentUser() {
    return this.user;
  }

  // Set user data after login/signup
  setUserData(userData, token) {
    this.user = userData;
    this.token = token;
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
  }

  // Clear user data on logout
  clearUserData() {
    this.user = null;
    this.token = null;
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  }

  // Login user
  async login(email, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      this.setUserData(data.user, data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Register user
  async signup(email, username, password) {
    try {
      const response = await fetch(`${this.baseUrl}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });
  
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Signup failed');
      }
  
      this.setUserData(data.user, data.token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  // Upload avatar
  async uploadAvatar(avatarFile) {
    try {
      if (!this.token) {
        throw new Error("Authentication required");
      }

      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await fetch(`${this.baseUrl}/api/auth/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.token}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to upload avatar");
      }

      // Update user data with new avatar
      this.user = {
        ...this.user,
        avatar: {
          data: data.avatar.data,
          contentType: data.avatar.contentType,
        },
      };
      localStorage.setItem("user", JSON.stringify(this.user));

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Get user profile
  async fetchUserProfile() {
    try {
      if (!this.token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${this.baseUrl}/api/auth/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch user profile");
      }

      // Format avatar data properly if it exists
      if (data.avatar && data.avatar.data && data.avatar.contentType) {
        data.avatar = {
          data: data.avatar.data,
          contentType: data.avatar.contentType
        };
      } else {
        data.avatar = null;
      }

      this.user = data;
      localStorage.setItem("user", JSON.stringify(data));
      return data;
    } catch (error) {
      throw error;
    }
  }
}

export default new AuthModel();
