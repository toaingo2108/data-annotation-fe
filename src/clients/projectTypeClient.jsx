import axiosClient from "./axiosClient";

class ProjectTypeClient {
  getAll() {
    return axiosClient.get("/project-types");
  }

  create(payload) {
    return axiosClient.post("/project-types", payload);
  }

  delete(id) {
    return axiosClient.delete(`/project-types/${id}`);
  }
}

const projectTypeClient = new ProjectTypeClient();
export default projectTypeClient;
