import axiosClient from "./axiosClient";

class UserClient {
  getAllUser() {
    return axiosClient.get("/users");
  }
}

const userClient = new UserClient();

export default userClient;
