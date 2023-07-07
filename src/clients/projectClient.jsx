import axiosClient from "./axiosClient";

class ProjectClient {
  getAllProjects({ projectTypeId }) {
    return axiosClient.get("/projects", {
      params: {
        projectTypeId,
      },
    });
  }

  getProjectById({ id, ...query }) {
    return axiosClient.get(`/projects/${id}`, {
      params: query,
    });
  }

  createProject(payload) {
    return axiosClient.post("/projects", payload);
  }

  updateProject({ id, ...payload }) {
    return axiosClient.patch(`/projects/${id}`, payload);
  }

  deleteProject({ id }) {
    return axiosClient.delete(`/projects/${id}`);
  }

  assignUserToProject({ id, userIds }) {
    return axiosClient.post(`/projects/${id}/assignment`, {
      userIds,
    });
  }

  getUnassingedUsers({ id }) {
    return axiosClient.get(`/projects/${id}/un-assignment`);
  }

  importFile({ id, file }) {
    return axiosClient.post(
      `/projects/${id}/files`,
      {
        file,
      },
      {
        headers: { "content-type": "multipart/form-data" },
      }
    );
  }
}

const projectClient = new ProjectClient();
export default projectClient;
