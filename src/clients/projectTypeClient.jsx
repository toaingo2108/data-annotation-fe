import axiosClient from "./axiosClient";

class ProjectTypeClient {
  getAll() {
    return axiosClient.get("/project-types");
  }
}

const projectTypeClient = new ProjectTypeClient();
export default projectTypeClient;
