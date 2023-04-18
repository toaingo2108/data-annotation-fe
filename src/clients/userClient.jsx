import axiosClient from "./axiosClient";

class UserClient {
  getAllUser() {
    return axiosClient.get("/users");
  }
  storeUser(payload) {
    return axiosClient.post("/users", payload);
  }
}

const userClient = new UserClient();

export default userClient;
