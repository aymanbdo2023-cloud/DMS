import axios from "axios";
const api = axios.create({
  baseURL: import.meta.env.API_URL,
  headers: { "api-key": import.meta.env.API_KEY },
});

export default api;
