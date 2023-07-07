import axiosClient from "./axiosClient";

class SampleClient {
  getAll() {
    return axiosClient.get("/samples");
  }

  create(payload) {
    return axiosClient.post("/samples", payload);
  }

  getById({
    id,
    withLabelSets,
    withEntities,
    withGeneratedTexts,
    performerId,
  }) {
    return axiosClient.get(`/samples/${id}`, {
      params: {
        withLabelSets,
        withEntities,
        withGeneratedTexts,
        performerId,
      },
    });
  }

  update({ id, sampleTexts }) {
    return axiosClient.patch(`/samples/${id}`, {
      sampleTexts,
    });
  }

  delete({ id }) {
    return axiosClient.delete(`/samples/${id}`);
  }

  addAnnotation({
    id,
    entityRecognition,
    generated_texts,
    labeling,
    userId,
  }) {
    return axiosClient.post(`/samples/${id}/annotation`, {
      entityRecognition,
      generated_texts,
      labeling,
      userId,
    });
  }
}

const sampleClient = new SampleClient();

export default sampleClient;
