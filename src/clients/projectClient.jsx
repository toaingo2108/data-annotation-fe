import axiosClient from "./axiosClient";

class ProjectClient {
  getAllProjects({ projectTypeId }) {
    return axiosClient.get("/projects", {
      params: {
        projectTypeId,
      },
    });
  }

  getProjectById(id) {
    return axiosClient.get(`/projects/${id}`);
  }

  createProject(payload) {
    return axiosClient.post("/projects", payload);
  }

  updateProject({ id, ...payload }) {
    return axiosClient.patch(`/projects/${id}`, payload);
  }
}

const projectClient = new ProjectClient();
export default projectClient;
