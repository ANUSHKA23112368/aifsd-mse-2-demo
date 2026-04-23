import api, { getErrorMessage } from "./authService";

export const submitGrievance = async (payload) => {
  const response = await api.post("/grievances", payload);
  return response.data;
};

export const fetchGrievances = async (query) => {
  const params = {};

  if (query?.title) params.title = query.title;

  const response = await api.get("/grievances", { params });
  return response.data;
};

export const fetchGrievanceById = async (id) => {
  const response = await api.get(`/grievances/${id}`);
  return response.data;
};

export const updateGrievance = async (id, payload) => {
  const response = await api.put(`/grievances/${id}`, payload);
  return response.data;
};

export const deleteGrievance = async (id) => {
  const response = await api.delete(`/grievances/${id}`);
  return response.data;
};

export { getErrorMessage };

export default {
  submitGrievance,
  fetchGrievances,
  fetchGrievanceById,
  updateGrievance,
  deleteGrievance,
};
