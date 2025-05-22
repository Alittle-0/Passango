class AuthModel {
    constructor() {
      this.baseUrl = import.meta.env.VITE_API_URL;
    }
  
    getCurrentUser() {
      return JSON.parse(localStorage.getItem("user")) || null;
    }
  
    getToken() {
      return localStorage.getItem("token");
    }
  
    updateUser(userData) {
      const currentUser = this.getCurrentUser();
      const updatedUser = { ...currentUser, ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    }
  
    async uploadAvatar(file) {
      if (!file) throw new Error("No file provided");
  
      const token = this.getToken();
      if (!token) throw new Error("No authentication token found");
  
      if (!["image/jpeg", "image/png"].includes(file.type)) {
        throw new Error("Please upload a JPEG or PNG image.");
      }
      if (file.size > 2 * 1024 * 1024) {
        throw new Error("Image size must be less than 2MB.");
      }
  
      const formData = new FormData();
      formData.append("avatar", file);
  
      const response = await fetch(`${this.baseUrl}/api/auth/upload-avatar`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload avatar");
      }
  
      return response.json();
    }
  
    async updateProfile(newData) {
      try {
        const token = this.getToken();
        if (!token) throw new Error("No authentication token found");
  
        const filteredData = Object.fromEntries(
          Object.entries(newData).filter(([_, value]) => value !== undefined && value !== null)
        );
        const response = await fetch(`${this.baseUrl}/api/auth/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(filteredData),
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Profile update failed");
        }
        const data = await response.json();
        this.updateUser(data.user);
        return data;
      } catch (error) {
        console.error("Profile update error:", error);
        throw error;
      }
    }
  }
  
  export default new AuthModel();