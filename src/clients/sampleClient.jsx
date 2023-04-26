import axiosClient from "./axiosClient";

class SampleClient {
  create(payload) {
    return axiosClient.post("/samples", payload);
  }
}

const sampleClient = new SampleClient();

export default sampleClient;
