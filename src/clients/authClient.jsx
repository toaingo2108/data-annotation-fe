import axiosClient from "./axiosClient";

class AuthClient {
  login(payload) {
    return axiosClient.post("/auth/login", payload);
  }
  logout() {
    return axiosClient.post("/auth/logout");
  }
  getMe() {
    return axiosClient.get("/user");
  }
}

const authClient = new AuthClient();

export default authClient;
