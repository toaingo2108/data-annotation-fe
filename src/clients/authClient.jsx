import axiosClient from "./axiosClient";

class AuthClient {
  login(payload) {
    return axiosClient.post("/auth/login", payload);
  }
  register(payload) {
    return axiosClient.post("/auth/register", payload);
  }
  logout() {
    return axiosClient.post("/auth/logout");
  }
  getMe() {
    return axiosClient.get("/me");
  }
  resetPassword({ oldPassword, newPassword }) {
    return axiosClient.post("auth/reset-password", {
      oldPassword,
      newPassword,
    });
  }
}

const authClient = new AuthClient();

export default authClient;
